import OpenAI from "openai";
import { storage } from "./storage";
import { batchProcess } from "./replit_integrations/batch/utils";
import type { WorkspaceBlogPost } from "@shared/schema";
import { resolvePostImages } from "./image-resolver";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

interface QualityResult {
  pass: boolean;
  reasons: string[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 120);
}

function runQualityGate(mdx: string): QualityResult {
  const reasons: string[] = [];

  const wordCount = mdx.split(/\s+/).filter(Boolean).length;
  if (wordCount < 1500) reasons.push(`Word count too low: ${wordCount} (min 1500)`);
  if (wordCount > 2500) reasons.push(`Word count too high: ${wordCount} (max 2500)`);

  const headings = mdx.match(/^#{1,6}\s+/gm) || [];
  if (headings.length < 6) reasons.push(`Too few headings: ${headings.length} (min 6)`);

  const imageMatches = mdx.match(/<BlogImage\s[^>]*prompt="[^"]+"\s*\/>/g) || [];
  const expectedImages = Math.max(4, Math.floor(wordCount / 275));
  if (imageMatches.length < Math.min(expectedImages, 4)) {
    reasons.push(`Too few image placeholders: ${imageMatches.length} (need at least ${Math.min(expectedImages, 4)} for ${wordCount} words)`);
  }

  const paragraphs = mdx.split(/\n\n+/).filter(p => p.trim().length > 20);
  const uniqueParagraphs = new Set(paragraphs.map(p => p.trim().slice(0, 100)));
  if (uniqueParagraphs.size < paragraphs.length * 0.85) {
    reasons.push("Possible duplicate content detected");
  }

  if (!mdx.includes("## FAQ") && !mdx.includes("## Frequently Asked Questions")) {
    reasons.push("Missing FAQ section");
  }

  return { pass: reasons.length === 0, reasons };
}

const SYSTEM_PROMPT = `You are an expert SEO content writer specializing in digital marketing, SEO, and business growth. You create high-quality, informative blog posts in MDX format.

STRICT REQUIREMENTS:
- Write between 1800-2500 words of actual prose content. This is a HARD requirement - never write fewer than 1800 words. Aim for 2200+ words. You MUST count your words before finishing. If your draft is under 1800 words, expand each section with more detail, examples, and actionable advice until you exceed 1800 words. Err on the side of writing MORE rather than less.
- Use at least 6 headings (H2 and H3) to structure the content
- Include a FAQ section at the end with at least 3 questions
- IMAGE PLACEHOLDERS: You MUST insert a <BlogImage /> placeholder every 250-300 words throughout the article. Each placeholder MUST include a "prompt" attribute with a detailed, descriptive prompt suitable for AI image generation or stock photo search. The prompt should describe the scene, mood, style and subject matter relevant to the surrounding text.
  - Format: <BlogImage prompt="detailed description of the image needed, including style, mood, subject, and context" />
  - Example: <BlogImage prompt="Marketing team analyzing SEO performance data on multiple screens, modern office environment, collaborative workspace" />
  - Example: <BlogImage prompt="Business professional reviewing analytics dashboard on laptop, clean desk setup, data visualizations on screen" />
  - For a 1500 word article, include at least 5 image placeholders
  - For a 2500 word article, include at least 8 image placeholders
  - Place them naturally between paragraphs, after key section introductions
  - Do NOT put two image placeholders back-to-back without text between them
- Write naturally and avoid keyword stuffing
- Include internal linking opportunities with placeholder links
- Format as valid MDX (markdown with JSX components)
- Do NOT include frontmatter - just the content body
- Do NOT wrap in code blocks
- Do NOT include src, alt, caption, or credit attributes - only the prompt attribute. These will be filled automatically on publish.

CONTENT STRUCTURE:
1. Engaging introduction with image placeholder (no H1 - title is handled separately)
2. Multiple H2 sections covering the topic thoroughly, each major section with an image
3. Practical tips or actionable advice
4. H2 FAQ section with Q&A pairs
5. Brief conclusion`;

function buildUserPrompt(
  title: string,
  keyword: string,
  intent: string,
  funnel: string,
  workspaceName?: string
): string {
  return `Write a blog post with the following specifications:

TITLE: ${title}
PRIMARY KEYWORD: ${keyword}
SEARCH INTENT: ${intent}
FUNNEL STAGE: ${funnel}
${workspaceName ? `BUSINESS NAME: ${workspaceName} (mention naturally 1-2 times)` : ""}

The post should target the "${keyword}" keyword naturally throughout the content. Match the "${intent}" search intent and serve readers at the "${funnel}" stage of the marketing funnel.

Write the full MDX content now.`;
}

export async function generateSingleDraft(postId: string): Promise<WorkspaceBlogPost | null> {
  const post = await storage.getWorkspaceBlogPost(postId);
  if (!post || !post.primaryKeyword) return null;

  await storage.updateWorkspaceBlogPost(postId, {
    generationStatus: "generating",
  });

  try {
    let workspaceName: string | undefined;
    try {
      const ws = await storage.getWorkspace(post.workspaceId);
      workspaceName = ws?.name;
    } catch {}

    const userPrompt = buildUserPrompt(
      post.title,
      post.primaryKeyword,
      post.intent || "informational",
      post.funnel || "tofu",
      workspaceName
    );

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ];

    let mdxContent = "";
    let attempt1WordCount = 0;
    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_tokens: 16384,
        temperature: 0.7,
      });

      mdxContent = response.choices[0]?.message?.content || "";
      const wordCount = mdxContent.split(/\s+/).filter(Boolean).length;
      console.log(`[DraftGenerator] Attempt ${attempt + 1} for "${post.title}": ${wordCount} words`);

      if (attempt === 0) attempt1WordCount = wordCount;
      if (wordCount >= 1800 || attempt === 1) break;

      messages.push({ role: "assistant", content: mdxContent });
      messages.push({
        role: "user",
        content: `This draft is only ${wordCount} words. I need at least 1800 words. Please rewrite and significantly expand EVERY section with more detail, real-world examples, step-by-step instructions, data points, and actionable tips. Add 2-3 more paragraphs per section. Keep the same structure and image placeholders but make each section much more comprehensive. Return the complete expanded article.`,
      });
    }

    const finalWordCount = mdxContent.split(/\s+/).filter(Boolean).length;

    if (!mdxContent || finalWordCount < 1500) {
      await storage.updateWorkspaceBlogPost(postId, {
        generationStatus: "needs_review",
        qualityGateStatus: "fail",
        qualityFailReasons: [
          `Both generation attempts returned insufficient content. Attempt 1: ${attempt1WordCount} words. Attempt 2: ${finalWordCount} words. Minimum required: 1,800 words.`
        ],
      });
      return null;
    }

    const qualityResult = runQualityGate(mdxContent);

    const updated = await storage.updateWorkspaceBlogPost(postId, {
      mdxContent,
      generationStatus: qualityResult.pass ? "generated" : "needs_review",
      qualityGateStatus: qualityResult.pass ? "pass" : "fail",
      qualityFailReasons: qualityResult.reasons.length > 0 ? qualityResult.reasons : null,
    });

    try {
      const imageResult = await resolvePostImages(postId);
      console.log(`[DraftGenerator] Auto-resolved images for "${post.title}": ${imageResult.resolved} resolved, ${imageResult.failed} failed`);
    } catch (imgErr: any) {
      console.error(`[DraftGenerator] Image auto-resolve failed for "${post.title}":`, imgErr.message);
    }

    return updated || null;
  } catch (err: any) {
    console.error(`[DraftGenerator] Failed to generate post ${postId}:`, err.message);
    await storage.updateWorkspaceBlogPost(postId, {
      generationStatus: "failed",
      qualityGateStatus: "fail",
      qualityFailReasons: [`Generation error: ${err.message}`],
    });
    return null;
  }
}

export async function generateCampaignDrafts(
  workspaceId: string,
  campaignId: string,
  onProgress?: (completed: number, total: number) => void
): Promise<{ generated: number; failed: number; needsReview: number }> {
  const posts = await storage.getWorkspaceBlogPostsByCampaign(workspaceId, campaignId);
  const pending = posts.filter(p => p.generationStatus === "pending" || p.generationStatus === "failed");

  if (pending.length === 0) {
    return { generated: 0, failed: 0, needsReview: 0 };
  }

  let generated = 0;
  let failed = 0;
  let needsReview = 0;

  await batchProcess(
    pending,
    async (post) => {
      const result = await generateSingleDraft(post.id);
      if (!result) {
        failed++;
      } else if (result.generationStatus === "needs_review") {
        needsReview++;
      } else {
        generated++;
      }
      return result;
    },
    {
      concurrency: 2,
      retries: 3,
      onProgress: (completed, total) => {
        onProgress?.(completed, total);
      },
    }
  );

  return { generated, failed, needsReview };
}

export interface BulkCreateInput {
  workspaceId: string;
  campaignId: string;
  posts: Array<{
    title: string;
    primaryKeyword: string;
    intent?: string;
    funnel?: string;
    category?: string;
  }>;
}

export async function bulkCreateDraftPosts(input: BulkCreateInput): Promise<WorkspaceBlogPost[]> {
  const postsToCreate = input.posts.map((p) => ({
    workspaceId: input.workspaceId,
    slug: slugify(p.title),
    title: p.title,
    primaryKeyword: p.primaryKeyword,
    intent: p.intent || "informational",
    funnel: p.funnel || "tofu",
    category: p.category || "general",
    status: "draft" as const,
    generationStatus: "pending",
    qualityGateStatus: "unknown",
    campaignId: input.campaignId,
    mdxContent: "",
  }));

  return storage.bulkCreateWorkspaceBlogPosts(postsToCreate);
}
