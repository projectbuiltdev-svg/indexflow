import type { VenueBlogPost, InsertPostValidationResult } from "@shared/schema";

export interface ValidationIssue {
  rule: string;
  severity: "error" | "warning" | "info";
  message: string;
  details?: Record<string, any>;
  autoFixable?: boolean;
}

export interface ValidationReport {
  postId: string;
  venueId: string;
  issues: ValidationIssue[];
  score: number;
  checkedAt: string;
}

function extractLinks(html: string): { href: string; text: string; rel?: string; target?: string }[] {
  const linkRegex = /<a\s+([^>]*)>([\s\S]*?)<\/a>/gi;
  const links: { href: string; text: string; rel?: string; target?: string }[] = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const attrs = match[1];
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
    const relMatch = attrs.match(/rel=["']([^"']*)["']/i);
    const targetMatch = attrs.match(/target=["']([^"']*)["']/i);
    if (hrefMatch) {
      links.push({
        href: hrefMatch[1],
        text,
        rel: relMatch?.[1],
        target: targetMatch?.[1],
      });
    }
  }
  return links;
}

function extractImages(html: string): { src: string; alt?: string; title?: string }[] {
  const imgRegex = /<img\s+([^>]*)\/?\s*>/gi;
  const images: { src: string; alt?: string; title?: string }[] = [];
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const attrs = match[1];
    const srcMatch = attrs.match(/src=["']([^"']*)["']/i);
    const altMatch = attrs.match(/alt=["']([^"']*)["']/i);
    const titleMatch = attrs.match(/title=["']([^"']*)["']/i);
    if (srcMatch) {
      images.push({
        src: srcMatch[1],
        alt: altMatch?.[1],
        title: titleMatch?.[1],
      });
    }
  }
  return images;
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

function getWordCount(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(" ").length : 0;
}

export function validateRelAttributes(html: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const links = extractLinks(html);

  for (const link of links) {
    const isExternal = link.href.startsWith("http://") || link.href.startsWith("https://");

    if (isExternal) {
      if (!link.rel || !link.rel.includes("noopener")) {
        issues.push({
          rule: "rel-noopener",
          severity: "warning",
          message: `External link to "${link.href}" is missing rel="noopener"`,
          details: { href: link.href, text: link.text, currentRel: link.rel || "none" },
          autoFixable: true,
        });
      }
      if (link.target === "_blank" && (!link.rel || !link.rel.includes("noreferrer"))) {
        issues.push({
          rule: "rel-noreferrer",
          severity: "warning",
          message: `External link with target="_blank" to "${link.href}" should have rel="noreferrer"`,
          details: { href: link.href, text: link.text },
          autoFixable: true,
        });
      }
      if (!link.rel || (!link.rel.includes("nofollow") && !link.rel.includes("dofollow"))) {
        issues.push({
          rule: "rel-follow-policy",
          severity: "info",
          message: `External link to "${link.href}" has no explicit follow/nofollow policy`,
          details: { href: link.href, text: link.text },
          autoFixable: false,
        });
      }
    }

    if (link.href.startsWith("http://") && !link.href.includes("localhost")) {
      issues.push({
        rule: "insecure-link",
        severity: "error",
        message: `Insecure HTTP link detected: "${link.href}"`,
        details: { href: link.href, text: link.text },
        autoFixable: true,
      });
    }
  }

  return issues;
}

export function validateAnchorTextDiversity(html: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const links = extractLinks(html);
  const anchorTexts = links.map((l) => l.text.toLowerCase().trim()).filter((t) => t.length > 0);

  if (anchorTexts.length < 2) return issues;

  const frequency: Record<string, number> = {};
  for (const text of anchorTexts) {
    frequency[text] = (frequency[text] || 0) + 1;
  }

  const genericAnchors = ["click here", "read more", "learn more", "here", "link", "this", "more"];
  for (const anchor of anchorTexts) {
    if (genericAnchors.includes(anchor)) {
      issues.push({
        rule: "generic-anchor-text",
        severity: "warning",
        message: `Generic anchor text "${anchor}" detected. Use descriptive anchor text for better SEO.`,
        details: { anchorText: anchor },
        autoFixable: false,
      });
    }
  }

  for (const [text, count] of Object.entries(frequency)) {
    if (count > 2 && anchorTexts.length > 3) {
      const ratio = count / anchorTexts.length;
      if (ratio > 0.4) {
        issues.push({
          rule: "anchor-text-over-optimization",
          severity: "warning",
          message: `Anchor text "${text}" used ${count} times (${Math.round(ratio * 100)}%). Diversify anchor text to avoid over-optimization.`,
          details: { anchorText: text, count, ratio: Math.round(ratio * 100) },
          autoFixable: false,
        });
      }
    }
  }

  return issues;
}

export function validateLinkDensity(html: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const links = extractLinks(html);
  const wordCount = getWordCount(html);

  if (wordCount < 100) return issues;

  const linkDensity = links.length / (wordCount / 100);

  if (linkDensity > 5) {
    issues.push({
      rule: "link-density-high",
      severity: "warning",
      message: `High link density: ${links.length} links in ${wordCount} words (${linkDensity.toFixed(1)} links per 100 words). Recommended: 2-3 per 100 words.`,
      details: { linkCount: links.length, wordCount, density: parseFloat(linkDensity.toFixed(1)) },
      autoFixable: false,
    });
  }

  if (links.length === 0 && wordCount > 300) {
    issues.push({
      rule: "no-links",
      severity: "warning",
      message: `No links found in ${wordCount}-word post. Add internal and external links for better SEO.`,
      details: { wordCount },
      autoFixable: false,
    });
  }

  const internalLinks = links.filter((l) => !l.href.startsWith("http"));
  const externalLinks = links.filter((l) => l.href.startsWith("http"));

  if (internalLinks.length === 0 && links.length > 0) {
    issues.push({
      rule: "no-internal-links",
      severity: "warning",
      message: "No internal links found. Add internal links to boost site authority and help crawlers discover related pages.",
      details: { externalCount: externalLinks.length },
      autoFixable: false,
    });
  }

  return issues;
}

export function validateImageAltCoverage(html: string, primaryKeyword?: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const images = extractImages(html);

  if (images.length === 0) {
    const wordCount = getWordCount(html);
    if (wordCount > 500) {
      issues.push({
        rule: "no-images",
        severity: "info",
        message: "No images found in post. Consider adding relevant images to improve engagement and SEO.",
        details: { wordCount },
        autoFixable: false,
      });
    }
    return issues;
  }

  let missingAlt = 0;
  let emptyAlt = 0;
  let hasKeywordInAlt = false;

  for (const img of images) {
    if (img.alt === undefined) {
      missingAlt++;
      issues.push({
        rule: "missing-alt",
        severity: "error",
        message: `Image missing alt attribute: "${img.src}"`,
        details: { src: img.src },
        autoFixable: true,
      });
    } else if (img.alt.trim() === "") {
      emptyAlt++;
      issues.push({
        rule: "empty-alt",
        severity: "warning",
        message: `Image has empty alt text: "${img.src}"`,
        details: { src: img.src },
        autoFixable: false,
      });
    }

    if (primaryKeyword && img.alt && img.alt.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      hasKeywordInAlt = true;
    }
  }

  const altCoverage = ((images.length - missingAlt - emptyAlt) / images.length) * 100;
  if (altCoverage < 80 && images.length > 1) {
    issues.push({
      rule: "low-alt-coverage",
      severity: "warning",
      message: `Only ${Math.round(altCoverage)}% of images have meaningful alt text (${images.length - missingAlt - emptyAlt}/${images.length}).`,
      details: { coverage: Math.round(altCoverage), total: images.length, missing: missingAlt, empty: emptyAlt },
      autoFixable: false,
    });
  }

  if (primaryKeyword && !hasKeywordInAlt && images.length > 0) {
    issues.push({
      rule: "keyword-not-in-alt",
      severity: "info",
      message: `Primary keyword "${primaryKeyword}" not found in any image alt text. Consider including it in at least one image alt.`,
      details: { keyword: primaryKeyword, imageCount: images.length },
      autoFixable: false,
    });
  }

  return issues;
}

export function validateHeadingStructure(html: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const headings = extractHeadings(html);

  if (headings.length === 0) {
    const wordCount = getWordCount(html);
    if (wordCount > 300) {
      issues.push({
        rule: "no-headings",
        severity: "warning",
        message: "No headings found. Use H2/H3 headings to structure content for better readability and SEO.",
        details: { wordCount },
        autoFixable: false,
      });
    }
    return issues;
  }

  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count > 1) {
    issues.push({
      rule: "multiple-h1",
      severity: "error",
      message: `Multiple H1 headings found (${h1Count}). Use only one H1 per page.`,
      details: { count: h1Count, headings: headings.filter((h) => h.level === 1).map((h) => h.text) },
      autoFixable: false,
    });
  }

  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level > headings[i - 1].level + 1) {
      issues.push({
        rule: "heading-skip",
        severity: "warning",
        message: `Heading level skipped: H${headings[i - 1].level} followed by H${headings[i].level}. Maintain proper heading hierarchy.`,
        details: {
          previous: { level: headings[i - 1].level, text: headings[i - 1].text },
          current: { level: headings[i].level, text: headings[i].text },
        },
        autoFixable: false,
      });
    }
  }

  return issues;
}

export function validateMetaFields(post: VenueBlogPost): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!post.title || post.title.length < 10) {
    issues.push({
      rule: "title-too-short",
      severity: "error",
      message: `Title is too short (${post.title?.length || 0} chars). Recommended: 30-60 characters.`,
      details: { length: post.title?.length || 0 },
      autoFixable: false,
    });
  } else if (post.title.length > 70) {
    issues.push({
      rule: "title-too-long",
      severity: "warning",
      message: `Title may be truncated in SERPs (${post.title.length} chars). Recommended: 30-60 characters.`,
      details: { length: post.title.length },
      autoFixable: false,
    });
  }

  if (!post.description) {
    issues.push({
      rule: "missing-description",
      severity: "error",
      message: "Meta description is missing. Add a 120-160 character description for better CTR in search results.",
      details: {},
      autoFixable: false,
    });
  } else if (post.description.length < 80) {
    issues.push({
      rule: "description-too-short",
      severity: "warning",
      message: `Meta description is short (${post.description.length} chars). Recommended: 120-160 characters.`,
      details: { length: post.description.length },
      autoFixable: false,
    });
  } else if (post.description.length > 170) {
    issues.push({
      rule: "description-too-long",
      severity: "warning",
      message: `Meta description may be truncated (${post.description.length} chars). Recommended: 120-160 characters.`,
      details: { length: post.description.length },
      autoFixable: false,
    });
  }

  if (!post.primaryKeyword) {
    issues.push({
      rule: "missing-primary-keyword",
      severity: "warning",
      message: "No primary keyword set. Assign a focus keyword for on-page SEO optimization.",
      details: {},
      autoFixable: false,
    });
  }

  if (!post.slug || post.slug.includes(" ")) {
    issues.push({
      rule: "invalid-slug",
      severity: "error",
      message: "Slug is invalid or contains spaces.",
      details: { slug: post.slug },
      autoFixable: true,
    });
  }

  return issues;
}

export function validatePost(post: VenueBlogPost): ValidationReport {
  const html = post.compiledHtml || post.mdxContent || "";
  const allIssues: ValidationIssue[] = [
    ...validateRelAttributes(html),
    ...validateAnchorTextDiversity(html),
    ...validateLinkDensity(html),
    ...validateImageAltCoverage(html, post.primaryKeyword || undefined),
    ...validateHeadingStructure(html),
    ...validateMetaFields(post),
  ];

  const errorCount = allIssues.filter((i) => i.severity === "error").length;
  const warningCount = allIssues.filter((i) => i.severity === "warning").length;
  const score = Math.max(0, 100 - errorCount * 15 - warningCount * 5);

  return {
    postId: post.id,
    venueId: post.venueId,
    issues: allIssues,
    score,
    checkedAt: new Date().toISOString(),
  };
}

export function issuesToInsertRecords(
  report: ValidationReport,
  workspaceId?: string
): InsertPostValidationResult[] {
  return report.issues.map((issue) => ({
    workspaceId: workspaceId || null,
    venueId: report.venueId,
    postId: report.postId,
    rule: issue.rule,
    severity: issue.severity,
    message: issue.message,
    details: issue.details || {},
    autoFixable: issue.autoFixable || false,
    fixed: false,
  }));
}
