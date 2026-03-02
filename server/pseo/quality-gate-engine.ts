import {
  MIN_WORD_COUNT,
  META_DESCRIPTION_MIN,
  META_DESCRIPTION_MAX,
  MIN_INTERNAL_LINKS,
  MIN_EXTERNAL_LINKS,
} from "../config/pseo-gate-thresholds";

export interface PageContext {
  primaryKeyword: string;
  secondaryKeywords: string[];
  locationName: string;
  domainName: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface GateResult {
  gate: number;
  name: string;
  passed: boolean;
  reason?: string;
}

export interface QualityGateOutput {
  passed: boolean;
  failures: string[];
  gateResults: GateResult[];
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function extractTagContent(html: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(stripHtml(match[1]));
  }
  return matches;
}

function extractHrefs(html: string): string[] {
  const regex = /<a\s[^>]*href=["']([^"']+)["'][^>]*>/gi;
  const hrefs: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    hrefs.push(match[1]);
  }
  return hrefs;
}

function extractImgTags(html: string): { src: string; alt: string }[] {
  const regex = /<img\s[^>]*>/gi;
  const imgs: { src: string; alt: string }[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const tag = match[0];
    const srcMatch = tag.match(/src=["']([^"']*)["']/i);
    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    imgs.push({
      src: srcMatch ? srcMatch[1] : "",
      alt: altMatch ? altMatch[1] : "",
    });
  }
  return imgs;
}

function extractLdJson(html: string): string[] {
  const regex = /<script\s[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const blocks: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}

function extractFirstParagraph(html: string): string {
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!match) return "";
  return stripHtml(match[1]);
}

function containsSubstring(text: string, substring: string): boolean {
  return text.toLowerCase().includes(substring.toLowerCase());
}

function isInternalLink(href: string, domain: string): boolean {
  if (href.startsWith("/") || href.startsWith("#")) return true;
  try {
    const url = new URL(href);
    return url.hostname.toLowerCase() === domain.toLowerCase() ||
           url.hostname.toLowerCase().endsWith("." + domain.toLowerCase());
  } catch {
    return true;
  }
}

export function runQualityGates(html: string, ctx: PageContext): QualityGateOutput {
  const gateResults: GateResult[] = [];

  const visibleText = stripHtml(html);
  const wordCount = countWords(visibleText);
  gateResults.push(wordCount >= MIN_WORD_COUNT
    ? { gate: 1, name: "Word count", passed: true }
    : { gate: 1, name: "Word count", passed: false, reason: `Word count ${wordCount} is below minimum ${MIN_WORD_COUNT}` }
  );

  const h1s = extractTagContent(html, "h1");
  const h1Text = h1s.length > 0 ? h1s[0] : "";
  gateResults.push(h1Text && containsSubstring(h1Text, ctx.primaryKeyword)
    ? { gate: 2, name: "H1 keyword check", passed: true }
    : { gate: 2, name: "H1 keyword check", passed: false, reason: `H1 does not contain primary keyword "${ctx.primaryKeyword}"` }
  );

  const metaTitle = ctx.metaTitle || "";
  gateResults.push(metaTitle && containsSubstring(metaTitle, ctx.primaryKeyword)
    ? { gate: 3, name: "Meta title keyword check", passed: true }
    : { gate: 3, name: "Meta title keyword check", passed: false, reason: `Meta title does not contain primary keyword "${ctx.primaryKeyword}"` }
  );

  const metaDesc = ctx.metaDescription || "";
  gateResults.push(metaDesc.trim().length > 0
    ? { gate: 4, name: "Meta description presence", passed: true }
    : { gate: 4, name: "Meta description presence", passed: false, reason: "Meta description is empty" }
  );

  const descLen = metaDesc.length;
  gateResults.push(descLen >= META_DESCRIPTION_MIN && descLen <= META_DESCRIPTION_MAX
    ? { gate: 5, name: "Meta description length", passed: true }
    : { gate: 5, name: "Meta description length", passed: false, reason: `Meta description length ${descLen} is outside range ${META_DESCRIPTION_MIN}-${META_DESCRIPTION_MAX} characters` }
  );

  const h2s = extractTagContent(html, "h2");
  const h2HasSecondary = ctx.secondaryKeywords.length > 0 && h2s.some((h2) =>
    ctx.secondaryKeywords.some((kw) => containsSubstring(h2, kw))
  );
  gateResults.push(h2HasSecondary
    ? { gate: 6, name: "H2 secondary keyword check", passed: true }
    : { gate: 6, name: "H2 secondary keyword check", passed: false, reason: "No H2 contains any secondary keyword" }
  );

  const hrefs = extractHrefs(html);
  const internalLinks = hrefs.filter((h) => isInternalLink(h, ctx.domainName));
  gateResults.push(internalLinks.length >= MIN_INTERNAL_LINKS
    ? { gate: 7, name: "Internal link count", passed: true }
    : { gate: 7, name: "Internal link count", passed: false, reason: `Internal link count ${internalLinks.length} is below minimum ${MIN_INTERNAL_LINKS}` }
  );

  const externalLinks = hrefs.filter((h) => !isInternalLink(h, ctx.domainName));
  gateResults.push(externalLinks.length >= MIN_EXTERNAL_LINKS
    ? { gate: 8, name: "External link count", passed: true }
    : { gate: 8, name: "External link count", passed: false, reason: `External link count ${externalLinks.length} is below minimum ${MIN_EXTERNAL_LINKS}` }
  );

  const imgs = extractImgTags(html);
  gateResults.push(imgs.length > 0
    ? { gate: 9, name: "Image presence", passed: true }
    : { gate: 9, name: "Image presence", passed: false, reason: "No images found on page" }
  );

  const allHaveAlt = imgs.length > 0 && imgs.every((img) => img.alt.trim().length > 0);
  gateResults.push(allHaveAlt
    ? { gate: 10, name: "Alt text check", passed: true }
    : { gate: 10, name: "Alt text check", passed: false, reason: imgs.length === 0 ? "No images to check alt text" : "One or more images missing alt text" }
  );

  const ldJsonBlocks = extractLdJson(html);
  let schemaValid = false;
  if (ldJsonBlocks.length > 0) {
    try {
      ldJsonBlocks.forEach((block) => JSON.parse(block));
      schemaValid = true;
    } catch {
      schemaValid = false;
    }
  }
  gateResults.push(schemaValid
    ? { gate: 11, name: "Schema presence", passed: true }
    : { gate: 11, name: "Schema presence", passed: false, reason: ldJsonBlocks.length === 0 ? "No schema markup found" : "Schema markup contains invalid JSON" }
  );

  const firstParagraph = extractFirstParagraph(html);
  gateResults.push(firstParagraph && containsSubstring(firstParagraph, ctx.locationName)
    ? { gate: 12, name: "Location name check", passed: true }
    : { gate: 12, name: "Location name check", passed: false, reason: `First paragraph does not contain location name "${ctx.locationName}"` }
  );

  const failures = gateResults.filter((r) => !r.passed).map((r) => r.reason!);
  return {
    passed: failures.length === 0,
    failures,
    gateResults,
  };
}
