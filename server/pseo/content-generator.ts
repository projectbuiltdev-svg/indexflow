import { hashSeed, seededSelect } from "../utils/pseo-hash-seeder";
import {
  generateSpintaxPool,
  resolveH1WithCollisionAvoidance,
  resolveH2,
  resolveParagraph,
  applyMicroVariation,
  generateFallbackPool,
  type CampaignContext,
  type SpintaxPool,
  type PoolStorage,
  type UsedH1Tracker,
} from "./spintax-engine";
import { runQualityGates, type PageContext, type QualityGateOutput } from "./quality-gate-engine";
import {
  checkSimilarity,
  extractTextForSimilarity,
  type SimilarityResult,
  type SimilarityStorage,
} from "./similarity-checker";
import { callAi } from "../integrations/byok-ai-client";
import { searchImages, type ImageResult } from "../integrations/image-bank-client";

export interface PageGenerationContext {
  campaignId: string;
  workspaceId: string;
  serviceName: string;
  serviceId: string;
  serviceDescription: string;
  serviceKeywords: string[];
  locationName: string;
  locationId: string;
  locationState: string | null;
  locationCountry: string;
  urlStructure: "location-first" | "service-first";
  aiModel: string;
  domainName: string;
  languageCode: string;
  sectionCount: number;
  tone?: string;
}

export interface PageGenerationResult {
  success: boolean;
  pageId?: string;
  slug: string;
  title: string;
  html: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  qualityGateStatus: "pass" | "fail" | "review";
  qualityFailReasons: string[];
  similarityScore: number;
  status: "published" | "review" | "failed";
  error?: string;
}

export interface GenerationStorage extends PoolStorage, UsedH1Tracker, SimilarityStorage {
  insertPseoPage(page: {
    campaignId: string;
    venueId: string;
    locationId: string;
    serviceId: string;
    pageType: string;
    slug: string;
    title: string;
    h1Variant: string;
    paragraphVariants: string[];
    metaTitle: string;
    metaDescription: string;
    schemaJson: Record<string, any>;
    internalLinks: Array<{ url: string; anchor: string }>;
    similarityScore: string;
    qualityGateStatus: string;
    qualityFailReasons: string[];
    isPublished: boolean;
  }): Promise<{ id: string }>;

  insertSitePage(page: {
    workspaceId: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    template: string;
    isPublished: boolean;
    metaTitle: string;
    metaDescription: string;
  }): Promise<{ id: number }>;
}

const DEFAULT_SECTION_COUNT = 4;

export async function generateSinglePage(
  ctx: PageGenerationContext,
  storage: GenerationStorage,
  pool?: SpintaxPool
): Promise<PageGenerationResult> {
  const slug = buildSlug(ctx);
  const seed = hashSeed(ctx.locationId, ctx.serviceId);

  try {
    const campaignCtx: CampaignContext = {
      campaignId: ctx.campaignId,
      workspaceId: ctx.workspaceId,
      serviceName: ctx.serviceName,
      serviceDescription: ctx.serviceDescription,
      sectionCount: ctx.sectionCount || DEFAULT_SECTION_COUNT,
      languageCode: ctx.languageCode,
      tone: ctx.tone,
    };

    const spintaxPool = pool || await generateSpintaxPool(campaignCtx);

    const h1 = resolveH1WithCollisionAvoidance(
      spintaxPool,
      seed,
      await storage.getUsedH1s(ctx.campaignId)
    );

    const sections: string[] = [];
    const paragraphVariants: string[] = [];
    const sectionCount = ctx.sectionCount || DEFAULT_SECTION_COUNT;

    for (let i = 0; i < sectionCount; i++) {
      const h2 = resolveH2(spintaxPool, i, seed + i);
      const para = resolveParagraph(spintaxPool, i, seed + i + 100);
      const varied = applyMicroVariation(
        para.replace(/\{location\}/gi, ctx.locationName).replace(/\{service\}/gi, ctx.serviceName),
        seed + i + 200
      );

      paragraphVariants.push(varied);

      sections.push(`<section>
<h2>${h2.replace(/\{location\}/gi, ctx.locationName).replace(/\{service\}/gi, ctx.serviceName)}</h2>
<p>${varied}</p>
</section>`);
    }

    let images: ImageResult[] = [];
    try {
      images = await searchImages(`${ctx.serviceName} ${ctx.locationName}`, ctx.workspaceId, 3);
    } catch {
      images = [];
    }

    const imageHtml = images.length > 0
      ? images.map((img) =>
        `<figure><img src="${img.url}" alt="${escapeHtml(img.alt)}" width="${img.width}" height="${img.height}" loading="lazy" />${img.photographer ? `<figcaption>Photo by ${escapeHtml(img.photographer)} on ${img.source}</figcaption>` : ""}</figure>`
      ).join("\n")
      : "";

    const metaTitle = `${ctx.serviceName} in ${ctx.locationName}${ctx.locationState ? `, ${ctx.locationState}` : ""} | ${ctx.domainName}`;
    const metaDescription = `Find professional ${ctx.serviceName.toLowerCase()} services in ${ctx.locationName}. Trusted local providers with proven results.`;
    const title = `${h1.replace(/\{location\}/gi, ctx.locationName).replace(/\{service\}/gi, ctx.serviceName)}`;

    const schemaJson = buildLocalBusinessSchema(ctx, title, metaDescription);

    const internalLinks = buildInternalLinks(ctx);

    const internalLinksHtml = internalLinks.length > 0
      ? `<nav aria-label="Related pages"><ul>${internalLinks.map((l) => `<li><a href="${l.url}">${escapeHtml(l.anchor)}</a></li>`).join("")}</ul></nav>`
      : "";

    const fullHtml = `<!DOCTYPE html>
<html lang="${ctx.languageCode}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(metaTitle)}</title>
<meta name="description" content="${escapeHtml(metaDescription)}">
<script type="application/ld+json">${JSON.stringify(schemaJson)}</script>
</head>
<body>
<main>
<h1>${escapeHtml(title)}</h1>
${imageHtml}
${sections.join("\n")}
${internalLinksHtml}
</main>
</body>
</html>`;

    const primaryKeyword = ctx.serviceKeywords[0] || ctx.serviceName;
    const secondaryKeywords = ctx.serviceKeywords.slice(1);

    const pageCtx: PageContext = {
      primaryKeyword,
      secondaryKeywords,
      locationName: ctx.locationName,
      domainName: ctx.domainName,
      metaTitle,
      metaDescription,
    };

    const gateOutput: QualityGateOutput = runQualityGates(fullHtml, pageCtx);

    if (!gateOutput.passed) {
      const page = await storage.insertPseoPage({
        campaignId: ctx.campaignId,
        venueId: ctx.workspaceId,
        locationId: ctx.locationId,
        serviceId: ctx.serviceId,
        pageType: "service-location",
        slug,
        title,
        h1Variant: title,
        paragraphVariants,
        metaTitle,
        metaDescription,
        schemaJson,
        internalLinks,
        similarityScore: "0",
        qualityGateStatus: "fail",
        qualityFailReasons: gateOutput.failures,
        isPublished: false,
      });

      await storage.addToReviewQueue({
        campaignId: ctx.campaignId,
        venueId: ctx.workspaceId,
        pageId: page.id,
        reason: `Quality gates failed: ${gateOutput.failures.join(", ")}`,
        reasonCategory: "quality_gate",
        failReasons: gateOutput.failures,
        status: "pending",
      });

      await storage.logAudit({
        campaignId: ctx.campaignId,
        venueId: ctx.workspaceId,
        action: "page_quality_fail",
        message: `Page ${slug} failed quality gates`,
        meta: { failures: gateOutput.failures },
      });

      return {
        success: true,
        pageId: page.id,
        slug,
        title,
        html: fullHtml,
        h1: title,
        metaTitle,
        metaDescription,
        qualityGateStatus: "fail",
        qualityFailReasons: gateOutput.failures,
        similarityScore: 0,
        status: "review",
      };
    }

    const text = extractTextForSimilarity(fullHtml, ctx.languageCode);
    let similarityResult: SimilarityResult = { similarityScore: 0, comparisonPageId: null, action: "pass" };

    try {
      similarityResult = await checkSimilarity(
        { pageId: `pending-${slug}`, campaignId: ctx.campaignId, text },
        storage
      );
    } catch {
      similarityResult = { similarityScore: 0, comparisonPageId: null, action: "pass" };
    }

    const isHeld = similarityResult.action === "hold";

    const page = await storage.insertPseoPage({
      campaignId: ctx.campaignId,
      venueId: ctx.workspaceId,
      locationId: ctx.locationId,
      serviceId: ctx.serviceId,
      pageType: "service-location",
      slug,
      title,
      h1Variant: title,
      paragraphVariants,
      metaTitle,
      metaDescription,
      schemaJson,
      internalLinks,
      similarityScore: String(similarityResult.similarityScore),
      qualityGateStatus: isHeld ? "review" : "pass",
      qualityFailReasons: isHeld ? [`Similarity ${(similarityResult.similarityScore * 100).toFixed(1)}% with page ${similarityResult.comparisonPageId}`] : [],
      isPublished: !isHeld,
    });

    if (isHeld) {
      await storage.addToReviewQueue({
        campaignId: ctx.campaignId,
        venueId: ctx.workspaceId,
        pageId: page.id,
        reason: `Similarity score ${(similarityResult.similarityScore * 100).toFixed(1)}% exceeds threshold`,
        reasonCategory: "similarity",
        failReasons: [`similarity_${similarityResult.similarityScore.toFixed(3)}`],
        status: "pending",
      });
    } else {
      await storage.insertSitePage({
        workspaceId: ctx.workspaceId,
        slug,
        title,
        description: metaDescription,
        content: fullHtml,
        template: "pseo",
        isPublished: true,
        metaTitle,
        metaDescription,
      });
    }

    await storage.logAudit({
      campaignId: ctx.campaignId,
      venueId: ctx.workspaceId,
      action: isHeld ? "page_similarity_hold" : "page_generated",
      message: `Page ${slug} ${isHeld ? "held for review" : "generated and published"}`,
      meta: { similarityScore: similarityResult.similarityScore },
    });

    return {
      success: true,
      pageId: page.id,
      slug,
      title,
      html: fullHtml,
      h1: title,
      metaTitle,
      metaDescription,
      qualityGateStatus: isHeld ? "review" : "pass",
      qualityFailReasons: isHeld ? [`similarity_hold`] : [],
      similarityScore: similarityResult.similarityScore,
      status: isHeld ? "review" : "published",
    };
  } catch (err: any) {
    await storage.logAudit({
      campaignId: ctx.campaignId,
      venueId: ctx.workspaceId,
      action: "page_generation_error",
      message: `Page ${slug} generation failed: ${err.message}`,
    });

    return {
      success: false,
      slug,
      title: "",
      html: "",
      h1: "",
      metaTitle: "",
      metaDescription: "",
      qualityGateStatus: "fail",
      qualityFailReasons: [err.message],
      similarityScore: 0,
      status: "failed",
      error: err.message,
    };
  }
}

function buildSlug(ctx: PageGenerationContext): string {
  const svcSlug = slugify(ctx.serviceName);
  const locSlug = slugify(ctx.locationName);
  return ctx.urlStructure === "location-first"
    ? `${locSlug}/${svcSlug}`
    : `${svcSlug}/${locSlug}`;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildLocalBusinessSchema(
  ctx: PageGenerationContext,
  title: string,
  description: string
): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: title,
    description,
    address: {
      "@type": "PostalAddress",
      addressLocality: ctx.locationName,
      addressRegion: ctx.locationState || undefined,
      addressCountry: ctx.locationCountry,
    },
    areaServed: {
      "@type": "City",
      name: ctx.locationName,
    },
  };
}

function buildInternalLinks(ctx: PageGenerationContext): Array<{ url: string; anchor: string }> {
  const links: Array<{ url: string; anchor: string }> = [];

  const svcSlug = slugify(ctx.serviceName);
  links.push({
    url: `/${svcSlug}`,
    anchor: `All ${ctx.serviceName} locations`,
  });

  const locSlug = slugify(ctx.locationName);
  links.push({
    url: `/${locSlug}`,
    anchor: `All services in ${ctx.locationName}`,
  });

  return links;
}
