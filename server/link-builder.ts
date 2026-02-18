import type { VenueBlogPost, InsertPostKeywordIndex } from "@shared/schema";

export interface KeywordEntry {
  keyword: string;
  postId: string;
  slug: string;
  title: string;
  frequency: number;
  inTitle: boolean;
  inDescription: boolean;
  inH1: boolean;
  inH2: boolean;
  position: number;
}

export interface LinkSuggestion {
  sourcePostId: string;
  sourceTitle: string;
  sourceSlug: string;
  targetPostId: string;
  targetTitle: string;
  targetSlug: string;
  keyword: string;
  reason: string;
  confidence: number;
}

export interface OrphanPost {
  postId: string;
  title: string;
  slug: string;
  inboundLinks: number;
  outboundLinks: number;
}

export interface LinkHealthResult {
  postId: string;
  title: string;
  href: string;
  anchorText: string;
  status: "ok" | "broken" | "redirect" | "timeout" | "error";
  statusCode?: number;
  redirectUrl?: string;
  error?: string;
}

function extractText(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

function extractLinks(html: string): { href: string; text: string }[] {
  const linkRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const links: { href: string; text: string }[] = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    links.push({
      href: match[1],
      text: match[2].replace(/<[^>]*>/g, "").trim(),
    });
  }
  return links;
}

function extractHeadingText(html: string, level: number): string[] {
  const regex = new RegExp(`<h${level}[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi");
  const headings: string[] = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push(match[1].replace(/<[^>]*>/g, "").trim().toLowerCase());
  }
  return headings;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").split(/\s+/).filter((w) => w.length > 2);
}

function generateNgrams(tokens: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(" "));
  }
  return ngrams;
}

export function indexPostKeywords(post: VenueBlogPost): KeywordEntry[] {
  const html = post.compiledHtml || post.mdxContent || "";
  const text = extractText(html);
  const tokens = tokenize(text);
  const titleLower = (post.title || "").toLowerCase();
  const descLower = (post.description || "").toLowerCase();
  const h1Texts = extractHeadingText(html, 1);
  const h2Texts = extractHeadingText(html, 2);

  const keywordCandidates = new Map<string, number>();

  for (let n = 1; n <= 4; n++) {
    const ngrams = generateNgrams(tokens, n);
    for (const ngram of ngrams) {
      keywordCandidates.set(ngram, (keywordCandidates.get(ngram) || 0) + 1);
    }
  }

  if (post.primaryKeyword) {
    const pk = post.primaryKeyword.toLowerCase();
    const freq = keywordCandidates.get(pk) || 0;
    keywordCandidates.set(pk, Math.max(freq, 1));
  }

  const stopWords = new Set([
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one",
    "our", "out", "has", "have", "been", "some", "them", "than", "its", "over", "such", "they",
    "with", "this", "that", "from", "will", "what", "when", "make", "like", "just", "into",
    "your", "more", "also", "how", "about", "which", "their", "would", "there", "these", "other",
  ]);

  const entries: KeywordEntry[] = [];
  const sorted = Array.from(keywordCandidates.entries())
    .filter(([kw, freq]) => {
      if (freq < 2 && kw.split(" ").length === 1) return false;
      const words = kw.split(" ");
      if (words.every((w: string) => stopWords.has(w))) return false;
      if (kw.length < 3) return false;
      return true;
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);

  let position = 0;
  for (const [keyword, frequency] of sorted) {
    entries.push({
      keyword,
      postId: post.id,
      slug: post.slug,
      title: post.title,
      frequency,
      inTitle: titleLower.includes(keyword),
      inDescription: descLower.includes(keyword),
      inH1: h1Texts.some((h) => h.includes(keyword)),
      inH2: h2Texts.some((h) => h.includes(keyword)),
      position: position++,
    });
  }

  return entries;
}

export function keywordEntriesToInsertRecords(
  entries: KeywordEntry[],
  venueId: string,
  workspaceId?: string
): InsertPostKeywordIndex[] {
  return entries.map((e) => ({
    workspaceId: workspaceId || null,
    venueId,
    postId: e.postId,
    keyword: e.keyword,
    slug: e.slug,
    title: e.title,
    frequency: e.frequency,
    inTitle: e.inTitle,
    inDescription: e.inDescription,
    inH1: e.inH1,
    inH2: e.inH2,
    position: e.position,
  }));
}

export function generateLinkSuggestions(posts: VenueBlogPost[]): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];
  const postKeywords = new Map<string, KeywordEntry[]>();

  for (const post of posts) {
    const entries = indexPostKeywords(post);
    postKeywords.set(post.id, entries);
  }

  for (const sourcePost of posts) {
    const sourceHtml = sourcePost.compiledHtml || sourcePost.mdxContent || "";
    const sourceText = extractText(sourceHtml);
    const existingLinks = extractLinks(sourceHtml);
    const linkedSlugs = new Set(existingLinks.map((l) => {
      const parts = l.href.split("/");
      return parts[parts.length - 1];
    }));

    for (const targetPost of posts) {
      if (targetPost.id === sourcePost.id) continue;
      if (linkedSlugs.has(targetPost.slug)) continue;

      const targetKeywords = postKeywords.get(targetPost.id) || [];
      const relevantKeywords = targetKeywords.filter((k) => k.frequency >= 2);

      for (const kw of relevantKeywords) {
        if (sourceText.includes(kw.keyword)) {
          const confidence = calculateLinkConfidence(kw, sourcePost, targetPost);
          if (confidence > 0.3) {
            suggestions.push({
              sourcePostId: sourcePost.id,
              sourceTitle: sourcePost.title,
              sourceSlug: sourcePost.slug,
              targetPostId: targetPost.id,
              targetTitle: targetPost.title,
              targetSlug: targetPost.slug,
              keyword: kw.keyword,
              reason: buildLinkReason(kw, targetPost),
              confidence,
            });
          }
        }
      }
    }
  }

  suggestions.sort((a, b) => b.confidence - a.confidence);
  const seen = new Set<string>();
  return suggestions.filter((s) => {
    const key = `${s.sourcePostId}-${s.targetPostId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 50);
}

function calculateLinkConfidence(
  kw: KeywordEntry,
  source: VenueBlogPost,
  target: VenueBlogPost
): number {
  let confidence = 0.3;

  if (kw.inTitle) confidence += 0.2;
  if (kw.inH1 || kw.inH2) confidence += 0.1;
  if (kw.frequency >= 3) confidence += 0.1;
  if (kw.frequency >= 5) confidence += 0.1;
  if (target.primaryKeyword && kw.keyword.includes(target.primaryKeyword.toLowerCase())) {
    confidence += 0.2;
  }
  if (source.category && target.category && source.category === target.category) {
    confidence += 0.1;
  }

  return Math.min(confidence, 1.0);
}

function buildLinkReason(kw: KeywordEntry, target: VenueBlogPost): string {
  const parts: string[] = [];
  if (kw.inTitle) parts.push("keyword in target title");
  if (kw.frequency >= 3) parts.push(`appears ${kw.frequency}x in source`);
  if (target.primaryKeyword && kw.keyword.includes(target.primaryKeyword.toLowerCase())) {
    parts.push("matches target's primary keyword");
  }
  return parts.length > 0 ? parts.join(", ") : "keyword match in content";
}

export function applyLink(
  html: string,
  keyword: string,
  targetSlug: string,
  maxOccurrences: number = 1
): { html: string; applied: number } {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(?<![<"][^>]*)\\b(${escaped})\\b(?![^<]*[>"])`, "gi");
  let applied = 0;

  const result = html.replace(regex, (match) => {
    if (applied >= maxOccurrences) return match;
    applied++;
    return `<a href="/blog/${targetSlug}" title="${keyword}">${match}</a>`;
  });

  return { html: result, applied };
}

export function bulkAutoLink(
  posts: VenueBlogPost[],
  suggestions: LinkSuggestion[],
  maxLinksPerPost: number = 3
): { postId: string; updatedHtml: string; linksAdded: number }[] {
  const results: { postId: string; updatedHtml: string; linksAdded: number }[] = [];
  const postMap = new Map(posts.map((p) => [p.id, p]));
  const suggestionsBySource = new Map<string, LinkSuggestion[]>();

  for (const s of suggestions) {
    const list = suggestionsBySource.get(s.sourcePostId) || [];
    list.push(s);
    suggestionsBySource.set(s.sourcePostId, list);
  }

  for (const [postId, postSuggestions] of Array.from(suggestionsBySource.entries())) {
    const post = postMap.get(postId);
    if (!post) continue;

    let html = post.compiledHtml || post.mdxContent || "";
    let totalLinksAdded = 0;
    const topSuggestions = postSuggestions
      .sort((a: LinkSuggestion, b: LinkSuggestion) => b.confidence - a.confidence)
      .slice(0, maxLinksPerPost);

    for (const suggestion of topSuggestions) {
      const { html: updated, applied } = applyLink(html, suggestion.keyword, suggestion.targetSlug, 1);
      if (applied > 0) {
        html = updated;
        totalLinksAdded += applied;
      }
    }

    if (totalLinksAdded > 0) {
      results.push({ postId, updatedHtml: html, linksAdded: totalLinksAdded });
    }
  }

  return results;
}

export function generateOrphanReport(posts: VenueBlogPost[]): OrphanPost[] {
  const inboundCount = new Map<string, number>();
  const outboundCount = new Map<string, number>();
  const slugToPostId = new Map<string, string>();

  for (const post of posts) {
    slugToPostId.set(post.slug, post.id);
    inboundCount.set(post.id, 0);
    outboundCount.set(post.id, 0);
  }

  for (const post of posts) {
    const html = post.compiledHtml || post.mdxContent || "";
    const links = extractLinks(html);
    const internalLinks = links.filter((l) => !l.href.startsWith("http"));
    outboundCount.set(post.id, internalLinks.length);

    for (const link of internalLinks) {
      const parts = link.href.split("/").filter(Boolean);
      const slug = parts[parts.length - 1];
      const targetId = slugToPostId.get(slug);
      if (targetId) {
        inboundCount.set(targetId, (inboundCount.get(targetId) || 0) + 1);
      }
    }
  }

  const orphans: OrphanPost[] = [];
  for (const post of posts) {
    const inbound = inboundCount.get(post.id) || 0;
    const outbound = outboundCount.get(post.id) || 0;

    if (inbound === 0 || outbound === 0) {
      orphans.push({
        postId: post.id,
        title: post.title,
        slug: post.slug,
        inboundLinks: inbound,
        outboundLinks: outbound,
      });
    }
  }

  return orphans.sort((a, b) => (a.inboundLinks + a.outboundLinks) - (b.inboundLinks + b.outboundLinks));
}

export async function checkLinkHealth(
  posts: VenueBlogPost[],
  maxConcurrent: number = 5
): Promise<LinkHealthResult[]> {
  const results: LinkHealthResult[] = [];
  const checked = new Set<string>();
  const allLinks: { postId: string; title: string; href: string; text: string }[] = [];

  for (const post of posts) {
    const html = post.compiledHtml || post.mdxContent || "";
    const links = extractLinks(html);
    for (const link of links) {
      if (link.href.startsWith("http") && !checked.has(link.href)) {
        checked.add(link.href);
        allLinks.push({
          postId: post.id,
          title: post.title,
          href: link.href,
          text: link.text,
        });
      }
    }
  }

  for (let i = 0; i < allLinks.length; i += maxConcurrent) {
    const batch = allLinks.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(
      batch.map(async (link) => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          const response = await fetch(link.href, {
            method: "HEAD",
            signal: controller.signal,
            redirect: "manual",
            headers: { "User-Agent": "IndexFlow-LinkChecker/1.0" },
          });

          clearTimeout(timeoutId);

          if (response.status >= 300 && response.status < 400) {
            return {
              postId: link.postId,
              title: link.title,
              href: link.href,
              anchorText: link.text,
              status: "redirect" as const,
              statusCode: response.status,
              redirectUrl: response.headers.get("location") || undefined,
            };
          } else if (response.status >= 400) {
            return {
              postId: link.postId,
              title: link.title,
              href: link.href,
              anchorText: link.text,
              status: "broken" as const,
              statusCode: response.status,
            };
          } else {
            return {
              postId: link.postId,
              title: link.title,
              href: link.href,
              anchorText: link.text,
              status: "ok" as const,
              statusCode: response.status,
            };
          }
        } catch (err: any) {
          if (err.name === "AbortError") {
            return {
              postId: link.postId,
              title: link.title,
              href: link.href,
              anchorText: link.text,
              status: "timeout" as const,
              error: "Request timed out after 10s",
            };
          }
          return {
            postId: link.postId,
            title: link.title,
            href: link.href,
            anchorText: link.text,
            status: "error" as const,
            error: err.message,
          };
        }
      })
    );

    results.push(...batchResults);
  }

  return results;
}
