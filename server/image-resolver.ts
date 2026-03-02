import OpenAI from "openai";
import { storage } from "./storage";
import { compileMdxToHtml } from "./mdx-compiler";

interface StockResult {
  source: string;
  source_asset_id: string;
  thumb_url: string;
  full_url: string;
  width: number;
  height: number;
  credit_name: string;
  credit_url: string;
  license_note: string;
}

interface ResolvedImage {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  creditUrl: string;
}

export async function searchStockImages(query: string, source: string = "pixabay", page: number = 1): Promise<StockResult[]> {
  try {
    if (source === "pexels") {
      const apiKey = process.env.PEXELS_API_KEY;
      if (!apiKey) return [];
      const resp = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&page=${page}`, {
        headers: { Authorization: apiKey },
      });
      const data = await resp.json() as any;
      return (data.photos || []).map((p: any) => ({
        source: "pexels",
        source_asset_id: String(p.id),
        thumb_url: p.src?.medium || p.src?.small,
        full_url: p.src?.large2x || p.src?.original,
        width: p.width,
        height: p.height,
        credit_name: p.photographer,
        credit_url: p.photographer_url,
        license_note: "Pexels License",
      }));
    } else if (source === "unsplash") {
      const accessKey = process.env.UNSPLASH_ACCESS_KEY;
      if (!accessKey) return [];
      const resp = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=30&page=${page}`, {
        headers: { Authorization: `Client-ID ${accessKey}` },
      });
      const data = await resp.json() as any;
      if (data.errors) return [];
      return (data.results || []).map((p: any) => ({
        source: "unsplash",
        source_asset_id: p.id,
        thumb_url: p.urls?.small,
        full_url: p.urls?.full,
        width: p.width,
        height: p.height,
        credit_name: p.user?.name,
        credit_url: p.user?.links?.html,
        license_note: "Unsplash License",
      }));
    } else {
      const apiKey = process.env.PIXABAY_API_KEY;
      if (!apiKey) return [];
      const resp = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=20&page=${page}&image_type=photo`);
      const data = await resp.json() as any;
      return (data.hits || []).map((p: any) => ({
        source: "pixabay",
        source_asset_id: String(p.id),
        thumb_url: p.webformatURL,
        full_url: p.largeImageURL,
        width: p.imageWidth,
        height: p.imageHeight,
        credit_name: p.user,
        credit_url: `https://pixabay.com/users/${p.user}-${p.user_id}/`,
        license_note: "Pixabay License",
      }));
    }
  } catch (err: any) {
    console.error(`[ImageResolver] Stock search error (${source}):`, err.message);
    return [];
  }
}

async function searchWithFallback(query: string, index: number): Promise<StockResult | null> {
  let results = await searchStockImages(query, "pixabay");
  if (results.length === 0) {
    results = await searchStockImages(query, "pexels");
  }
  if (results.length === 0) {
    const simpleQuery = query.split(" ").slice(0, 3).join(" ");
    results = await searchStockImages(simpleQuery, "pixabay");
  }
  if (results.length === 0) {
    const ultraSimple = query.split(" ").slice(0, 2).join(" ");
    results = await searchStockImages(ultraSimple, "pexels");
  }
  if (results.length === 0) return null;
  const pickIdx = index % Math.min(results.length, 5);
  return results[pickIdx];
}

async function saveStockAsset(item: StockResult, postId?: string, workspaceId?: string): Promise<string> {
  const asset = await storage.createContentAsset({
    source: item.source,
    sourceAssetId: item.source_asset_id,
    originalUrl: item.full_url,
    publicUrl: item.full_url,
    width: item.width,
    height: item.height,
    creditName: item.credit_name,
    creditUrl: item.credit_url,
    type: "blog_image",
    licenseNote: item.license_note,
    postId: postId || null,
    workspaceId: workspaceId || null,
  });
  return asset.publicUrl || asset.originalUrl;
}

export async function resolvePostImages(postId: string): Promise<{ resolved: number; failed: number }> {
  try {
    const post = await storage.getWorkspaceBlogPost(postId);
    if (!post || !post.mdxContent) return { resolved: 0, failed: 0 };

    const promptRegex = /<BlogImage\s+prompt="([^"]+)"\s*\/>/g;
    const placeholders: Array<{ fullMatch: string; prompt: string }> = [];
    let match;
    while ((match = promptRegex.exec(post.mdxContent)) !== null) {
      placeholders.push({ fullMatch: match[0], prompt: match[1] });
    }

    if (placeholders.length === 0) return { resolved: 0, failed: 0 };

    console.log(`[ImageResolver] Processing ${placeholders.length} placeholders for post "${post.title}"`);

    const openai = new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
    });

    const seoPrompt = `You are an SEO specialist. For each image prompt below, generate optimized image metadata.

Post title: "${post.title}"
Post category: "${post.category || "general"}"
Target keyword: "${post.primaryKeyword || ""}"

For EACH image prompt, return a JSON object with:
- "alt": SEO-optimized alt text (60-125 chars, include target keyword naturally in at least one, describe the image accurately)
- "caption": A brief, informative caption for below the image (optional, 1 sentence)
- "searchQuery": An optimized search query for stock photo banks (3-6 words, specific and searchable)

Return a JSON array with one object per image, in order. Return ONLY valid JSON, no markdown.

Image prompts:
${placeholders.map((p, i) => `${i + 1}. "${p.prompt}"`).join("\n")}`;

    let imageData: Array<{ alt: string; caption: string; searchQuery: string }> = [];
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: seoPrompt }],
        max_tokens: 2048,
        temperature: 0.3,
      });
      const raw = response.choices[0]?.message?.content || "[]";
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      imageData = JSON.parse(cleaned);
    } catch (err: any) {
      console.error("[ImageResolver] AI metadata generation failed:", err.message);
      imageData = placeholders.map(p => ({
        alt: p.prompt.slice(0, 125),
        caption: "",
        searchQuery: p.prompt.split(",")[0].trim().split(" ").slice(0, 4).join(" "),
      }));
    }

    const resolvedImages: ResolvedImage[] = [];
    let resolved = 0;
    let failed = 0;

    for (let i = 0; i < placeholders.length; i++) {
      const meta = imageData[i] || { alt: placeholders[i].prompt.slice(0, 125), caption: "", searchQuery: placeholders[i].prompt.split(",")[0].trim() };
      const searchQuery = meta.searchQuery || placeholders[i].prompt.split(",")[0].trim();

      const stockResult = await searchWithFallback(searchQuery, i);

      if (stockResult) {
        const url = await saveStockAsset(stockResult, postId, post.workspaceId);
        resolvedImages.push({
          src: url,
          alt: meta.alt || searchQuery,
          caption: meta.caption || "",
          credit: stockResult.credit_name || "",
          creditUrl: stockResult.credit_url || "",
        });
        resolved++;
        console.log(`[ImageResolver]   [${i + 1}/${placeholders.length}] Found: ${stockResult.credit_name} (${stockResult.source})`);
      } else {
        resolvedImages.push({ src: "", alt: "", caption: "", credit: "", creditUrl: "" });
        failed++;
        console.log(`[ImageResolver]   [${i + 1}/${placeholders.length}] No results for "${searchQuery}"`);
      }

      await new Promise(r => setTimeout(r, 300));
    }

    if (resolved === 0) {
      console.warn(`[ImageResolver] All ${failed} image lookups failed for post "${post.title}" (${postId})`);
      return { resolved: 0, failed };
    }

    let updatedMdx = post.mdxContent;
    const matchesForReplace: string[] = [];
    const regex2 = /<BlogImage\s+prompt="([^"]+)"\s*\/>/g;
    let m2;
    while ((m2 = regex2.exec(post.mdxContent)) !== null) {
      matchesForReplace.push(m2[0]);
    }

    function sanitizeAttr(val: string): string {
      return val.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    function validateUrl(url: string): string {
      const trimmed = (url || "").trim();
      if (/^https?:\/\//i.test(trimmed)) return sanitizeAttr(trimmed);
      return "";
    }

    for (let i = 0; i < Math.min(matchesForReplace.length, resolvedImages.length); i++) {
      const img = resolvedImages[i];
      const safeSrc = validateUrl(img.src);
      if (!safeSrc) continue;
      const attrs = [
        `src="${safeSrc}"`,
        `alt="${sanitizeAttr(img.alt || "")}"`,
      ];
      if (img.caption) attrs.push(`caption="${sanitizeAttr(img.caption)}"`);
      if (img.credit) attrs.push(`credit="${sanitizeAttr(img.credit)}"`);
      if (img.creditUrl) {
        const safeCredit = validateUrl(img.creditUrl);
        if (safeCredit) attrs.push(`creditUrl="${safeCredit}"`);
      }
      const replacement = `<BlogImage ${attrs.join(" ")} />`;
      updatedMdx = updatedMdx.replace(matchesForReplace[i], replacement);
    }

    const { html } = await compileMdxToHtml(updatedMdx);

    await storage.updateWorkspaceBlogPost(postId, {
      mdxContent: updatedMdx,
      compiledHtml: html,
    });

    console.log(`[ImageResolver] Done: ${resolved} resolved, ${failed} failed for "${post.title}"`);
    return { resolved, failed };
  } catch (error) {
    console.error(`[ImageResolver] Failed for post ${postId}:`, error);
    await storage.updateWorkspaceBlogPost(postId, {
      qualityFailReasons: [`Image resolution failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
    });
    return { resolved: 0, failed: 0 };
  }
}

export interface ImageSuggestion {
  keyword: string;
  query: string;
  placement: "hero" | "inline" | "infographic";
  alt: string;
  context: string;
}

export interface KeywordImageResult {
  postId: string;
  keyword: string;
  suggestions: ImageSuggestion[];
  resolved: StockResult[];
}

function extractHeadings(html: string): { level: number; text: string }[] {
  const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  const headings: { level: number; text: string }[] = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: match[2].replace(/<[^>]*>/g, "").trim(),
    });
  }
  return headings;
}

export function analyzePostForImageSuggestions(post: any): ImageSuggestion[] {
  const html = post.compiledHtml || post.mdxContent || "";
  const suggestions: ImageSuggestion[] = [];
  const primaryKeyword = post.primaryKeyword || post.title;

  suggestions.push({
    keyword: primaryKeyword,
    query: `${primaryKeyword} ${(post.category || "").split("-").join(" ")}`.trim(),
    placement: "hero",
    alt: `${post.title} - featured image`,
    context: post.title,
  });

  const headings = extractHeadings(html);
  const h2Headings = headings.filter((h) => h.level === 2);

  for (const heading of h2Headings.slice(0, 4)) {
    suggestions.push({
      keyword: heading.text.toLowerCase(),
      query: `${primaryKeyword} ${heading.text}`.split(" ").slice(0, 5).join(" "),
      placement: "inline",
      alt: heading.text.length > 10 ? heading.text : `${primaryKeyword} - ${heading.text}`,
      context: heading.text,
    });
  }

  const tags = post.tags || [];
  if (tags.length > 0 && post.category) {
    suggestions.push({
      keyword: post.category,
      query: `${post.category} ${tags[0]} infographic`,
      placement: "infographic",
      alt: `${post.category} overview - ${tags[0]}`,
      context: `${post.category}: ${tags.join(", ")}`,
    });
  }

  return suggestions;
}

export async function resolveKeywordImages(
  post: any,
  source: string = "pexels",
  count: number = 3
): Promise<KeywordImageResult> {
  const suggestions = analyzePostForImageSuggestions(post);
  const primaryKeyword = post.primaryKeyword || post.title;
  const heroSuggestion = suggestions.find((s) => s.placement === "hero");
  const query = heroSuggestion?.query || primaryKeyword;

  const resolved = await searchStockImages(query, source, 1);

  return {
    postId: post.id,
    keyword: primaryKeyword,
    suggestions,
    resolved: resolved.slice(0, count),
  };
}

export async function resolveAllSourceImages(
  post: any,
  count: number = 2
): Promise<KeywordImageResult> {
  const suggestions = analyzePostForImageSuggestions(post);
  const primaryKeyword = post.primaryKeyword || post.title;
  const heroSuggestion = suggestions.find((s) => s.placement === "hero");
  const query = heroSuggestion?.query || primaryKeyword;

  const [pexels, unsplash, pixabay] = await Promise.all([
    searchStockImages(query, "pexels", 1),
    searchStockImages(query, "unsplash", 1),
    searchStockImages(query, "pixabay", 1),
  ]);

  return {
    postId: post.id,
    keyword: primaryKeyword,
    suggestions,
    resolved: [...pexels.slice(0, count), ...unsplash.slice(0, count), ...pixabay.slice(0, count)],
  };
}
