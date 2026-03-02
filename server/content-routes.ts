import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { compileMdxToHtml } from "./mdx-compiler";
import { insertWorkspaceBlogPostSchema, insertWorkspaceDomainSchema, insertContentAssetSchema, insertContentAssetUsageSchema, insertInvoiceSchema, insertInvoiceLineItemSchema, insertContentReportSchema, insertCmsApiKeySchema, blogTemplates, getPlanTier } from "@shared/schema";
import { z } from "zod";
import { bulkCreateDraftPosts, generateCampaignDrafts, generateSingleDraft } from "./draft-generator";
import { randomUUID } from "crypto";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { validatePost, issuesToInsertRecords } from "./post-processor";
import { indexPostKeywords, keywordEntriesToInsertRecords, generateLinkSuggestions, applyLink, bulkAutoLink, generateOrphanReport, checkLinkHealth } from "./link-builder";
import { analyzePostForImageSuggestions, resolveKeywordImages, resolveAllSourceImages } from "./image-resolver";

const VALID_CATEGORIES = [
  "general", "seo", "content-marketing", "ai-automation", "voice-sms", "website-design",
  "link-building", "comparisons", "pricing-cost", "industry-guides",
  "local-seo", "agency-operations",
];

function normalizeCategory(cat: string | undefined | null): string {
  if (!cat) return "general";
  const lower = cat.trim().toLowerCase();
  return VALID_CATEGORIES.includes(lower) ? lower : "general";
}

async function checkPostLimit(workspaceId: string): Promise<{ allowed: boolean; used: number; limit: number; remaining: number }> {
  const workspace = await storage.getWorkspace(workspaceId);
  if (!workspace) return { allowed: false, used: 0, limit: 0, remaining: 0 };
  const tier = getPlanTier((workspace as any).plan);
  const limit = tier.postsPerWorkspacePerMonth;
  const used = await storage.countBlogPostsThisMonth(workspaceId);
  return {
    allowed: used < limit,
    used,
    limit,
    remaining: Math.max(0, limit - used),
  };
}

async function getDomainLockStatus(workspaceId: string): Promise<{
  locked: boolean;
  reason: string | null;
}> {
  const workspace = await storage.getWorkspace(workspaceId);
  if (!workspace) return { locked: false, reason: null };

  const tier = getPlanTier((workspace as any).plan);

  if (tier.workspaces > 1) return { locked: false, reason: null };

  const posts = await storage.getWorkspaceBlogPosts(workspaceId, "published");
  const hasPublishedContent = posts.length > 0;

  if (hasPublishedContent) {
    return {
      locked: true,
      reason: "Your domain is locked because you have published content. Upgrade to Pro to manage multiple domains.",
    };
  }

  return { locked: false, reason: null };
}

function normalizeTags(tags: any): string[] | null {
  if (!Array.isArray(tags)) return null;
  const normalized = tags
    .map((t: any) => String(t).trim().toLowerCase())
    .filter((t: string) => t.length > 0 && t.length <= 50);
  const unique = Array.from(new Set(normalized));
  return unique.length > 0 ? unique.slice(0, 20) : null;
}

function isSuperAdmin(req: Request): boolean {
  const session = (req as any).session;
  if (session?.adminRole === "super_admin") return true;
  return false;
}

function requireSuperAdmin(req: Request, res: Response): boolean {
  if (!isSuperAdmin(req)) {
    res.status(403).json({ error: "Forbidden: super_admin required" });
    return false;
  }
  return true;
}

export function registerContentRoutes(app: Express) {

  app.get("/api/workspaces", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const workspaces = await storage.getWorkspaces();
      res.json(workspaces);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const workspaceId = req.body.workspaceId;
      if (workspaceId) {
        const limitCheck = await checkPostLimit(workspaceId);
        if (!limitCheck.allowed) {
          return res.status(403).json({
            error: "ai_post_limit_reached",
            message: `Monthly post limit reached. Used ${limitCheck.used} of ${limitCheck.limit} posts this month.`,
            used: limitCheck.used,
            limit: limitCheck.limit,
          });
        }
      }
      const data = insertWorkspaceBlogPostSchema.parse({
        ...req.body,
        category: normalizeCategory(req.body.category),
        tags: normalizeTags(req.body.tags),
      });
      const post = await storage.createWorkspaceBlogPost(data);
      res.status(201).json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/blog/posts/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const updates = { ...req.body };
      if ("category" in updates) updates.category = normalizeCategory(updates.category);
      if ("tags" in updates) updates.tags = normalizeTags(updates.tags);
      const post = await storage.updateWorkspaceBlogPost(req.params.id, updates);
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/blog/posts", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
      const status = req.query.status as string | undefined;
      const posts = await storage.getWorkspaceBlogPosts(workspaceId, status);
      res.json(posts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/blog/posts/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const deleted = await storage.deleteWorkspaceBlogPost(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Post not found" });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/publish-now", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const { html, errors } = await compileMdxToHtml(post.mdxContent);
      if (errors.length > 0) {
        return res.status(400).json({ error: "MDX compilation failed", errors });
      }

      const updated = await storage.updateWorkspaceBlogPost(post.id, {
        compiledHtml: html,
        status: "published",
        publishedAt: new Date(),
      });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/process-images", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const mdx = post.mdxContent;
      if (!mdx) return res.status(400).json({ error: "Post has no content" });

      const promptRegex = /<BlogImage\s+prompt="([^"]+)"\s*\/>/g;
      const placeholders: Array<{ fullMatch: string; prompt: string; index: number }> = [];
      let match;
      while ((match = promptRegex.exec(mdx)) !== null) {
        placeholders.push({ fullMatch: match[0], prompt: match[1], index: placeholders.length });
      }

      if (placeholders.length === 0) {
        return res.json({ message: "No image placeholders found", images: [], updatedMdx: mdx });
      }

      const openai = new OpenAI({
        baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
        apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
      });

      const seoPrompt = `You are an SEO specialist. For each image prompt below, generate optimized image metadata.

Post title: "${post.title}"
Post category: "${post.category || "general"}"
Target keyword: "${post.primaryKeyword || ""}"

For EACH image prompt, return a JSON object with:
- "alt": SEO-optimized alt text (60-125 chars, include target keyword naturally in at least one, describe the image accurately)
- "caption": A brief, informative caption for below the image (optional, 1 sentence)
- "searchQuery": An optimized search query for stock photo banks (3-6 words, specific and searchable)
- "schemaType": The schema.org ImageObject type context ("photograph", "illustration", or "infographic")

Return a JSON array with one object per image, in order. Return ONLY valid JSON, no markdown.

Image prompts:
${placeholders.map((p, i) => `${i + 1}. "${p.prompt}"`).join("\n")}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: seoPrompt }],
        max_tokens: 2048,
        temperature: 0.3,
      });

      let imageData: Array<{ alt: string; caption: string; searchQuery: string; schemaType: string }> = [];
      try {
        const raw = response.choices[0]?.message?.content || "[]";
        const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        imageData = JSON.parse(cleaned);
      } catch {
        return res.status(500).json({ error: "Failed to parse AI response for image SEO" });
      }

      const images = placeholders.map((p, i) => ({
        index: i,
        prompt: p.prompt,
        alt: imageData[i]?.alt || p.prompt.slice(0, 125),
        caption: imageData[i]?.caption || "",
        searchQuery: imageData[i]?.searchQuery || p.prompt.split(",")[0].trim(),
        schemaType: imageData[i]?.schemaType || "photograph",
        originalTag: p.fullMatch,
      }));

      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "name": post.title,
        "image": images.map((img) => ({
          "@type": "ImageObject",
          "description": img.alt,
          "caption": img.caption,
          "representativeOfPage": img.index === 0,
        })),
      };

      res.json({
        postId: post.id,
        title: post.title,
        placeholderCount: placeholders.length,
        images,
        schema,
        message: `Processed ${images.length} image placeholders with SEO metadata`,
      });
    } catch (err: any) {
      console.error("[ProcessImages] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/apply-images", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const { images } = req.body;
      if (!images || !Array.isArray(images)) {
        return res.status(400).json({ error: "images array required with src, alt, caption for each placeholder" });
      }

      let updatedMdx = post.mdxContent;
      const promptRegex = /<BlogImage\s+prompt="([^"]+)"\s*\/>/g;
      const matches: string[] = [];
      let m;
      while ((m = promptRegex.exec(post.mdxContent)) !== null) {
        matches.push(m[0]);
      }

      if (images.length < matches.length) {
        return res.status(400).json({ error: `Provided ${images.length} images but post has ${matches.length} placeholders` });
      }

      const sanitizeAttr = (val: string): string => {
        return val.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      };
      const validateUrl = (url: string): string => {
        const trimmed = (url || "").trim();
        if (/^https?:\/\//i.test(trimmed)) return sanitizeAttr(trimmed);
        return "";
      };

      for (let i = 0; i < Math.min(matches.length, images.length); i++) {
        const img = images[i];
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
        updatedMdx = updatedMdx.replace(matches[i], replacement);
      }

      const { html, errors } = await compileMdxToHtml(updatedMdx);
      if (errors.length > 0) {
        return res.status(400).json({ error: "MDX compilation failed after image replacement", errors });
      }

      const updated = await storage.updateWorkspaceBlogPost(post.id, {
        mdxContent: updatedMdx,
        compiledHtml: html,
      });

      res.json({
        message: `Applied ${images.filter((img: any) => img.src).length} images to post`,
        post: updated,
      });
    } catch (err: any) {
      console.error("[ApplyImages] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/schedule", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const { publish_at } = req.body;
      if (!publish_at) return res.status(400).json({ error: "publish_at required" });

      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const updated = await storage.updateWorkspaceBlogPost(post.id, {
        status: "scheduled",
        publishAt: new Date(publish_at),
      });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/content/preview", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const { mdx } = req.body;
      if (!mdx) return res.status(400).json({ error: "mdx required" });
      const result = await compileMdxToHtml(mdx);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/assets/search", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const source = (req.query.source as string) || "pexels";
      const q = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      if (!q) return res.status(400).json({ error: "q (query) required" });

      let results: any[] = [];

      if (source === "pexels") {
        const apiKey = process.env.PEXELS_API_KEY;
        if (!apiKey) return res.status(503).json({ error: "Stock image search is not available" });
        const resp = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=20&page=${page}`, {
          headers: { Authorization: apiKey },
        });
        const data = await resp.json() as any;
        results = (data.photos || []).map((p: any) => ({
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
        if (!accessKey) return res.status(503).json({ error: "Stock image search is not available" });
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=30&page=${page}`;
        const resp = await fetch(unsplashUrl, {
          headers: { Authorization: `Client-ID ${accessKey}` },
        });
        const data = await resp.json() as any;
        if (data.errors) {
          console.error("Unsplash API error:", data.errors);
          return res.status(resp.status).json({ error: data.errors.join(", ") });
        }
        console.log(`Unsplash search "${q}": total=${data.total}, results=${(data.results || []).length}`);
        results = (data.results || []).map((p: any) => ({
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
      } else if (source === "pixabay") {
        const apiKey = process.env.PIXABAY_API_KEY;
        if (!apiKey) return res.status(503).json({ error: "Stock image search is not available" });
        const resp = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(q)}&per_page=20&page=${page}&image_type=photo`);
        const data = await resp.json() as any;
        results = (data.hits || []).map((p: any) => ({
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

      res.json(results);
    } catch (err: any) {
      res.status(500).json({ error: "Failed to search stock images" });
    }
  });

  app.post("/api/assets/save", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const data = insertContentAssetSchema.parse(req.body);
      const asset = await storage.createContentAsset({
        ...data,
        publicUrl: data.originalUrl,
      });
      res.status(201).json(asset);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:postId/assets/attach", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const data = insertContentAssetUsageSchema.parse({
        ...req.body,
        postId: req.params.postId,
      });
      const usage = await storage.createContentAssetUsage(data);
      res.status(201).json(usage);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/blog/assets/search", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
      const query = req.query.query as string | undefined;
      const assets = await storage.searchContentAssets(workspaceId, query);
      res.json(assets);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/assets/save", async (req, res) => {
    try {
      const data = insertContentAssetSchema.parse(req.body);
      const asset = await storage.createContentAsset(data);
      res.status(201).json(asset);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/blog/domains", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });
      const domains = await storage.getWorkspaceDomains(workspaceId);
      res.json(domains);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/domains", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const data = insertWorkspaceDomainSchema.parse(req.body);
      const workspace = await storage.getWorkspace(data.workspaceId);
      if (workspace) {
        const tier = getPlanTier((workspace as any).plan);
        if (tier.workspaces === 1) {
          const existingDomains = await storage.getWorkspaceDomains(data.workspaceId);
          if (existingDomains.length >= 1) {
            return res.status(403).json({
              error: "domain_limit_reached",
              message: "Solo plan allows one domain per workspace. Upgrade to Pro to add more domains.",
            });
          }
        }
      }
      const domain = await storage.createWorkspaceDomain(data);
      res.status(201).json(domain);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch("/api/blog/domains/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const updateSchema = z.object({
        blogTemplate: z.enum(blogTemplates).optional(),
        isPrimary: z.boolean().optional(),
        accentColor: z.string().max(20).optional().nullable(),
        accentForeground: z.string().max(20).optional().nullable(),
      });
      const data = updateSchema.parse(req.body);
      const updated = await storage.updateWorkspaceDomain(req.params.id, data);
      if (!updated) return res.status(404).json({ error: "Domain not found" });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/blog/domains/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const domain = await storage.getWorkspaceDomain(req.params.id);
      if (domain) {
        const lockStatus = await getDomainLockStatus(domain.workspaceId);
        if (lockStatus.locked) {
          return res.status(403).json({
            error: "domain_locked",
            message: lockStatus.reason,
          });
        }
      }
      const deleted = await storage.deleteWorkspaceDomain(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Domain not found" });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  const bulkCreateSchema = z.object({
    workspaceId: z.string().min(1),
    posts: z.array(z.object({
      title: z.string().min(1),
      primaryKeyword: z.string().min(1),
      intent: z.string().optional(),
      funnel: z.string().optional(),
      category: z.string().optional(),
    })).min(1).max(50),
  });

  app.post("/api/blog/posts/bulk/create", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const data = bulkCreateSchema.parse(req.body);
      const limitCheck = await checkPostLimit(data.workspaceId);
      const requested = data.posts.length;
      if (limitCheck.remaining < requested) {
        return res.status(403).json({
          error: "ai_post_limit_exceeded",
          message: `Bulk create would exceed monthly limit. Remaining: ${limitCheck.remaining}, Requested: ${requested}.`,
          remaining: limitCheck.remaining,
          requested,
        });
      }
      const campaign = await storage.createContentCampaign({
        workspaceId: data.workspaceId,
        name: `Bulk ${new Date().toISOString().slice(0, 10)}`,
        status: "active",
        postsTotal: data.posts.length,
      });
      const posts = await bulkCreateDraftPosts({
        workspaceId: data.workspaceId,
        campaignId: campaign.id,
        posts: data.posts,
      });
      res.status(201).json({ campaignId: campaign.id, posts });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/bulk/generate", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const { workspaceId, campaignId } = req.body;
      if (!workspaceId || !campaignId) {
        return res.status(400).json({ error: "workspaceId and campaignId required" });
      }

      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const sendSSE = (data: any) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      };

      sendSSE({ type: "started" });

      const result = await generateCampaignDrafts(workspaceId, campaignId, (completed, total) => {
        sendSSE({ type: "progress", completed, total });
      });

      sendSSE({ type: "complete", ...result });
      res.end();
    } catch (err: any) {
      if (!res.headersSent) {
        res.status(500).json({ error: err.message });
      } else {
        res.write(`data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`);
        res.end();
      }
    }
  });

  app.post("/api/blog/posts/:id/regenerate", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      await storage.updateWorkspaceBlogPost(req.params.id, {
        generationStatus: "pending",
        qualityGateStatus: "unknown",
        qualityFailReasons: null,
        mdxContent: "",
      });
      const result = await generateSingleDraft(req.params.id);
      if (!result) return res.status(500).json({ error: "Generation failed" });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/approve-and-schedule", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const { publish_at } = req.body;

      const { html, errors } = await compileMdxToHtml(post.mdxContent);
      if (errors.length > 0) {
        return res.status(400).json({ error: "MDX compilation failed", errors });
      }

      if (publish_at) {
        const updated = await storage.updateWorkspaceBlogPost(post.id, {
          compiledHtml: html,
          status: "scheduled",
          publishAt: new Date(publish_at),
          generationStatus: "generated",
          qualityGateStatus: "pass",
        });
        res.json(updated);
      } else {
        const updated = await storage.updateWorkspaceBlogPost(post.id, {
          compiledHtml: html,
          status: "published",
          publishedAt: new Date(),
          generationStatus: "generated",
          qualityGateStatus: "pass",
        });
        res.json(updated);
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/blog/campaigns/:workspaceId", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const campaigns = await storage.getWorkspaceCampaigns(req.params.workspaceId);
      res.json(campaigns);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/blog/posts/campaign/:workspaceId/:campaignId", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const posts = await storage.getWorkspaceBlogPostsByCampaign(req.params.workspaceId, req.params.campaignId);
      res.json(posts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/campaigns/:campaignId/publish-all", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const campaign = await storage.getContentCampaign(req.params.campaignId);
      if (!campaign) return res.status(404).json({ error: "Campaign not found" });

      const posts = await storage.getWorkspaceBlogPostsByCampaign(campaign.workspaceId, campaign.id);
      const unpublished = posts.filter(p => p.status !== "published");
      let publishedCount = 0;

      for (const post of unpublished) {
        let html = post.compiledHtml;
        if (!html && post.mdxContent) {
          const result = await compileMdxToHtml(post.mdxContent);
          if (result.errors.length === 0) {
            html = result.html;
          }
        }
        await storage.updateWorkspaceBlogPost(post.id, {
          compiledHtml: html || post.compiledHtml,
          status: "published",
          publishedAt: new Date(),
          generationStatus: "generated",
        });
        publishedCount++;
      }

      res.json({ campaignId: campaign.id, published: publishedCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/campaigns/:campaignId/schedule-all", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const campaign = await storage.getContentCampaign(req.params.campaignId);
      if (!campaign) return res.status(404).json({ error: "Campaign not found" });

      const { publishAt } = req.body;
      if (!publishAt) return res.status(400).json({ error: "publishAt date string required" });

      const publishDate = new Date(publishAt);
      if (isNaN(publishDate.getTime())) return res.status(400).json({ error: "Invalid publishAt date" });

      const posts = await storage.getWorkspaceBlogPostsByCampaign(campaign.workspaceId, campaign.id);
      const eligible = posts.filter(p => p.status === "draft" || p.status === "needs_review");
      let scheduledCount = 0;

      for (const post of eligible) {
        await storage.updateWorkspaceBlogPost(post.id, {
          status: "scheduled",
          publishAt: publishDate,
        });
        scheduledCount++;
      }

      res.json({ campaignId: campaign.id, scheduled: scheduledCount, publishAt: publishDate.toISOString() });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/blog/campaigns/:campaignId/summary", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const campaign = await storage.getContentCampaign(req.params.campaignId);
      if (!campaign) return res.status(404).json({ error: "Campaign not found" });

      const posts = await storage.getWorkspaceBlogPostsByCampaign(campaign.workspaceId, campaign.id);

      const byStatus: Record<string, number> = { draft: 0, generating: 0, generated: 0, needs_review: 0, scheduled: 0, published: 0, failed: 0 };
      const byQualityGate: Record<string, number> = { pass: 0, fail: 0, unknown: 0 };
      let totalWords = 0;

      for (const post of posts) {
        const s = post.status || "draft";
        if (s in byStatus) byStatus[s]++;
        const q = post.qualityGateStatus || "unknown";
        if (q in byQualityGate) byQualityGate[q]++;
        if (post.mdxContent) {
          totalWords += post.mdxContent.split(/\s+/).filter(Boolean).length;
        }
      }

      res.json({
        campaignId: campaign.id,
        name: campaign.name,
        status: campaign.status,
        totalPosts: posts.length,
        byStatus,
        byQualityGate,
        avgWordCount: posts.length > 0 ? Math.round(totalWords / posts.length) : 0,
        totalWords,
        createdAt: campaign.createdAt ? new Date(campaign.createdAt).toISOString() : null,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/blog/campaigns/:campaignId", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const { name, status } = req.body;
      if (!name && !status) return res.status(400).json({ error: "Provide name or status to update" });

      const updates: Record<string, any> = {};
      if (name) updates.name = name;
      if (status) updates.status = status;

      const updated = await storage.updateContentCampaign(req.params.campaignId, updates);
      if (!updated) return res.status(404).json({ error: "Campaign not found" });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/export-mdx", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const { workspaceId } = req.body;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });

      const posts = await storage.getWorkspaceBlogPosts(workspaceId);
      const exportable = posts.filter(p => p.mdxContent && p.mdxContent.length > 100);

      if (exportable.length === 0) {
        return res.json({ exported: 0, message: "No posts with content to export" });
      }

      const baseDir = path.resolve(process.cwd(), "apps", "marketing", "content", "blog");
      const exported: string[] = [];

      for (const post of exportable) {
        const category = normalizeCategory(post.category);
        const safeSlug = (post.slug || "untitled").replace(/[^a-z0-9-]/g, "-").replace(/(^-|-$)+/g, "").slice(0, 120) || "untitled";
        const categoryDir = path.join(baseDir, category);
        fs.mkdirSync(categoryDir, { recursive: true });

        const date = post.publishedAt
          ? new Date(post.publishedAt).toISOString().slice(0, 10)
          : post.createdAt
          ? new Date(post.createdAt).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10);

        const description = post.description || `Learn about ${post.primaryKeyword || post.title}. Expert insights for growing your business.`;

        const frontmatter = [
          "---",
          `title: "${post.title.replace(/"/g, '\\"')}"`,
          `description: "${description.replace(/"/g, '\\"')}"`,
          `date: "${date}"`,
          `slug: "${post.slug}"`,
          `category: "${category}"`,
          post.primaryKeyword ? `keyword: "${post.primaryKeyword}"` : null,
          post.intent ? `intent: "${post.intent}"` : null,
          post.funnel ? `funnel: "${post.funnel}"` : null,
          post.tags && post.tags.length > 0 ? `tags: [${post.tags.map(t => `"${t}"`).join(", ")}]` : null,
          post.schemaType ? `schemaType: "${post.schemaType}"` : null,
          post.schemaJson ? `schemaJson: ${JSON.stringify(post.schemaJson)}` : null,
          "---",
        ].filter(Boolean).join("\n");

        const mdxBody = post.mdxContent.replace(/```mdx\n?/g, "").replace(/```\n?$/g, "").trim();
        const fileContent = `${frontmatter}\n\n${mdxBody}\n`;

        const filePath = path.join(categoryDir, `${safeSlug}.mdx`);
        fs.writeFileSync(filePath, fileContent, "utf-8");
        exported.push(`${category}/${safeSlug}.mdx`);
      }

      res.json({
        exported: exported.length,
        files: exported,
        outputDir: baseDir,
      });
    } catch (err: any) {
      console.error("[ExportMDX] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/public/blog/posts", async (req, res) => {
    try {
      const domain = (req.query.domain as string) || req.hostname;
      const normalized = domain.toLowerCase().replace(/^www\./, "").split(":")[0];

      const wsDomain = await storage.getWorkspaceDomainByDomain(normalized);
      if (!wsDomain) {
        return res.status(404).json({ error: "Domain not found" });
      }

      const posts = await storage.getPublishedPostsByWorkspace(wsDomain.workspaceId);
      const safeList = posts.map(p => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
        category: p.category,
        tags: p.tags,
        publishedAt: p.publishedAt,
      }));

      res.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
      res.json({
        blogTemplate: wsDomain.blogTemplate || "editorial",
        accentColor: wsDomain.accentColor || null,
        accentForeground: wsDomain.accentForeground || null,
        posts: safeList,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/public/blog/post", async (req, res) => {
    try {
      const domain = (req.query.domain as string) || req.hostname;
      const slug = req.query.slug as string;
      if (!slug) return res.status(400).json({ error: "slug required" });

      const normalized = domain.toLowerCase().replace(/^www\./, "").split(":")[0];
      const wsDomain = await storage.getWorkspaceDomainByDomain(normalized);
      if (!wsDomain) {
        return res.status(404).json({ error: "Domain not found" });
      }

      const post = await storage.getWorkspaceBlogPostBySlug(wsDomain.workspaceId, slug);
      if (!post || post.status !== "published") {
        return res.status(404).json({ error: "Post not found" });
      }

      res.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
      res.json({
        blogTemplate: wsDomain.blogTemplate || "editorial",
        accentColor: wsDomain.accentColor || null,
        accentForeground: wsDomain.accentForeground || null,
        slug: post.slug,
        title: post.title,
        description: post.description,
        category: post.category,
        tags: post.tags,
        compiled_html: post.compiledHtml,
        publishedAt: post.publishedAt,
        schemaType: post.schemaType || null,
        schemaJson: post.schemaJson || null,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  const SCHEMA_TYPES = [
    { value: "Article", label: "Article", description: "General articles and blog posts" },
    { value: "HowTo", label: "How-To", description: "Step-by-step instructions or tutorials" },
    { value: "FAQPage", label: "FAQ Page", description: "Frequently asked questions page" },
    { value: "LocalBusiness", label: "Local Business", description: "Content about a specific local business" },
    { value: "Recipe", label: "Recipe", description: "Food/drink recipe content" },
    { value: "Review", label: "Review", description: "Product or service review" },
    { value: "Event", label: "Event", description: "Event-related content" },
    { value: "Product", label: "Product", description: "Product descriptions and details" },
    { value: "BlogPosting", label: "Blog Posting", description: "Blog post (more specific than Article)" },
    { value: "NewsArticle", label: "News Article", description: "News reporting content" },
    { value: "TechArticle", label: "Tech Article", description: "Technical documentation or article" },
  ];

  function heuristicSchemaDetect(title: string, content: string, category?: string | null): { schemaType: string; confidence: number } {
    const lower = (title + " " + content).toLowerCase();
    const catLower = (category || "").toLowerCase();

    if (/how\s+to\b|step[\s-]by[\s-]step|guide|tutorial|instructions/i.test(title)) {
      return { schemaType: "HowTo", confidence: 0.8 };
    }
    if (/faq|frequently\s+asked|common\s+questions/i.test(title)) {
      return { schemaType: "FAQPage", confidence: 0.85 };
    }
    if (/recipe|cooking|ingredient|preparation/i.test(title) || catLower === "recipe") {
      return { schemaType: "Recipe", confidence: 0.75 };
    }
    if (/review|rating|comparison|vs\b|versus/i.test(title) || catLower === "comparisons") {
      return { schemaType: "Review", confidence: 0.7 };
    }
    if (/event|conference|meetup|workshop|webinar/i.test(title)) {
      return { schemaType: "Event", confidence: 0.7 };
    }
    if (/local.*guide|best.*agencies|best.*tools|best.*platforms|city\s+guide/i.test(title) || catLower === "local-guides") {
      return { schemaType: "LocalBusiness", confidence: 0.65 };
    }
    if (/news|breaking|update|announce/i.test(title)) {
      return { schemaType: "NewsArticle", confidence: 0.6 };
    }
    if (/product|pricing|cost|plan|subscription/i.test(title) || catLower === "pricing-cost") {
      return { schemaType: "Product", confidence: 0.6 };
    }
    if (/technical|api|code|development|integration/i.test(title) || catLower === "ai-automation") {
      return { schemaType: "TechArticle", confidence: 0.55 };
    }
    return { schemaType: "Article", confidence: 0.5 };
  }

  function generateSchemaJson(schemaType: string, post: any, workspace?: any): Record<string, any> {
    const base: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": schemaType,
      "headline": post.title,
      "description": post.description || `Learn about ${post.primaryKeyword || post.title}`,
      "datePublished": post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    };

    if (post.primaryKeyword) {
      base["keywords"] = post.primaryKeyword;
    }

    if (workspace) {
      base["publisher"] = {
        "@type": "Organization",
        "name": workspace.name,
        "url": workspace.website || undefined,
      };
    }

    if (schemaType === "Article" || schemaType === "BlogPosting" || schemaType === "NewsArticle" || schemaType === "TechArticle") {
      base["@type"] = schemaType;
      base["articleSection"] = post.category || "General";
      if (post.tags && Array.isArray(post.tags)) {
        base["keywords"] = post.tags.join(", ");
      }
    }

    if (schemaType === "HowTo") {
      base["@type"] = "HowTo";
      base["name"] = post.title;
    }

    if (schemaType === "FAQPage") {
      base["@type"] = "FAQPage";
      base["mainEntity"] = [];
    }

    if (schemaType === "LocalBusiness") {
      base["@type"] = "LocalBusiness";
      if (workspace) {
        base["name"] = workspace.name;
        base["address"] = workspace.address || undefined;
        base["telephone"] = workspace.phone || undefined;
      }
    }

    if (schemaType === "Recipe") {
      base["@type"] = "Recipe";
      base["name"] = post.title;
    }

    if (schemaType === "Review") {
      base["@type"] = "Review";
      base["itemReviewed"] = { "@type": "Thing", "name": post.title };
    }

    if (schemaType === "Event") {
      base["@type"] = "Event";
      base["name"] = post.title;
    }

    if (schemaType === "Product") {
      base["@type"] = "Product";
      base["name"] = post.title;
    }

    Object.keys(base).forEach(k => base[k] === undefined && delete base[k]);
    return base;
  }

  app.get("/api/blog/schema-types", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    res.json(SCHEMA_TYPES);
  });

  app.get("/api/blog/posts/:id/schema", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      res.json({
        schemaType: post.schemaType || null,
        schemaJson: post.schemaJson || null,
        schemaAutoDetected: post.schemaAutoDetected || false,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/schema/detect", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const workspace = await storage.getWorkspace(post.workspaceId);
      let detectedType: string;
      let confidence: number;
      let method: string;

      try {
        const openai = new OpenAI({
          baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
          apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
        });

        const classifyPrompt = `You are an SEO schema.org markup specialist. Classify this blog post into the most appropriate schema.org type.

Title: "${post.title}"
Category: "${post.category || "general"}"
Primary Keyword: "${post.primaryKeyword || ""}"
Content excerpt (first 500 chars): "${(post.mdxContent || "").slice(0, 500)}"

Choose EXACTLY ONE from these types: Article, HowTo, FAQPage, LocalBusiness, Recipe, Review, Event, Product, BlogPosting, NewsArticle, TechArticle

Return ONLY a JSON object with:
- "schemaType": the chosen type (string)
- "confidence": your confidence level 0-1 (number)
- "reasoning": one sentence explaining why (string)

Return ONLY valid JSON, no markdown.`;

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: classifyPrompt }],
          max_tokens: 256,
          temperature: 0.2,
        });

        const raw = response.choices[0]?.message?.content || "{}";
        const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        detectedType = parsed.schemaType || "Article";
        confidence = parsed.confidence || 0.5;
        method = "gpt-4o";
      } catch (aiErr: any) {
        console.warn("[SchemaDetect] AI classification failed, using heuristic:", aiErr.message);
        const heuristic = heuristicSchemaDetect(post.title, post.mdxContent || "", post.category);
        detectedType = heuristic.schemaType;
        confidence = heuristic.confidence;
        method = "heuristic";
      }

      const schemaJson = generateSchemaJson(detectedType, post, workspace);

      const updated = await storage.updateWorkspaceBlogPost(post.id, {
        schemaType: detectedType,
        schemaJson: schemaJson,
        schemaAutoDetected: true,
      });

      res.json({
        schemaType: detectedType,
        schemaJson: schemaJson,
        schemaAutoDetected: true,
        confidence,
        method,
        post: updated,
      });
    } catch (err: any) {
      console.error("[SchemaDetect] Error:", err.message);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/schema/override", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const { schemaType } = req.body;
      if (!schemaType) return res.status(400).json({ error: "schemaType required" });

      const validTypes = SCHEMA_TYPES.map(t => t.value);
      if (!validTypes.includes(schemaType)) {
        return res.status(400).json({ error: `Invalid schemaType. Must be one of: ${validTypes.join(", ")}` });
      }

      const workspace = await storage.getWorkspace(post.workspaceId);
      const schemaJson = generateSchemaJson(schemaType, post, workspace);

      const updated = await storage.updateWorkspaceBlogPost(post.id, {
        schemaType,
        schemaJson,
        schemaAutoDetected: false,
      });

      res.json({
        schemaType,
        schemaJson,
        schemaAutoDetected: false,
        post: updated,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/schema/edit-json", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const { schemaJson } = req.body;
      if (!schemaJson || typeof schemaJson !== "object") {
        return res.status(400).json({ error: "schemaJson object required" });
      }

      if (!schemaJson["@context"]) schemaJson["@context"] = "https://schema.org";
      if (!schemaJson["@type"]) {
        return res.status(400).json({ error: "schemaJson must include @type" });
      }

      const schemaType = schemaJson["@type"];

      const updated = await storage.updateWorkspaceBlogPost(post.id, {
        schemaType,
        schemaJson,
        schemaAutoDetected: false,
      });

      res.json({
        schemaType,
        schemaJson,
        schemaAutoDetected: false,
        post: updated,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  const CMS_FORMATS = ["wordpress", "ghost", "webflow", "hubspot", "contentful", "shopify", "wix"] as const;
  type CmsFormat = typeof CMS_FORMATS[number];

  function formatForWordPress(post: any): Record<string, any> {
    return {
      title: post.title,
      slug: post.slug,
      content: post.compiledHtml || "",
      excerpt: post.description || "",
      status: post.status === "published" ? "publish" : "draft",
      categories: post.category ? [post.category] : [],
      tags: post.tags || [],
      date: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      meta: {
        _yoast_wpseo_focuskw: post.primaryKeyword || "",
        _yoast_wpseo_metadesc: post.description || "",
      },
      schemaMarkup: post.schemaJson ? JSON.stringify(post.schemaJson) : null,
    };
  }

  function formatForGhost(post: any): Record<string, any> {
    return {
      title: post.title,
      slug: post.slug,
      html: post.compiledHtml || "",
      custom_excerpt: post.description || "",
      status: post.status === "published" ? "published" : "draft",
      tags: (post.tags || []).map((t: string) => ({ name: t })),
      published_at: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      meta_title: post.title,
      meta_description: post.description || "",
      og_title: post.title,
      og_description: post.description || "",
      codeinjection_head: post.schemaJson
        ? `<script type="application/ld+json">${JSON.stringify(post.schemaJson)}</script>`
        : "",
      schemaMarkup: post.schemaJson || null,
    };
  }

  function formatForWebflow(post: any): Record<string, any> {
    return {
      name: post.title,
      slug: post.slug,
      "post-body": post.compiledHtml || "",
      "post-summary": post.description || "",
      _archived: false,
      _draft: post.status !== "published",
      category: post.category || "",
      tags: (post.tags || []).join(", "),
      "publish-date": post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      "seo-title": post.title,
      "seo-description": post.description || "",
      "focus-keyword": post.primaryKeyword || "",
      schemaMarkup: post.schemaJson
        ? `<script type="application/ld+json">${JSON.stringify(post.schemaJson)}</script>`
        : null,
    };
  }

  function formatForHubSpot(post: any): Record<string, any> {
    return {
      name: post.title,
      slug: post.slug,
      post_body: post.compiledHtml || "",
      post_summary: post.description || "",
      state: post.status === "published" ? "PUBLISHED" : "DRAFT",
      blog_author_id: null,
      campaign: post.campaignId || null,
      content_group_id: null,
      meta_description: post.description || "",
      html_title: post.title,
      publish_date: post.publishedAt ? new Date(post.publishedAt).getTime() : undefined,
      tag_ids: [],
      keywords: post.primaryKeyword ? [post.primaryKeyword] : [],
      head_html: post.schemaJson
        ? `<script type="application/ld+json">${JSON.stringify(post.schemaJson)}</script>`
        : "",
      schemaMarkup: post.schemaJson || null,
    };
  }

  function formatForContentful(post: any): Record<string, any> {
    return {
      fields: {
        title: { "en-US": post.title },
        slug: { "en-US": post.slug },
        body: { "en-US": post.compiledHtml || post.mdxContent || "" },
        description: { "en-US": post.description || "" },
        category: { "en-US": post.category || "" },
        tags: { "en-US": post.tags || [] },
        publishDate: { "en-US": post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined },
        seoTitle: { "en-US": post.title },
        seoDescription: { "en-US": post.description || "" },
        focusKeyword: { "en-US": post.primaryKeyword || "" },
        schemaMarkup: { "en-US": post.schemaJson || null },
      },
    };
  }

  function formatForShopify(post: any): Record<string, any> {
    return {
      title: post.title,
      body_html: post.compiledHtml || "",
      summary_html: post.description || "",
      tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
      published: post.status === "published",
      published_at: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
      metafields: [
        { key: "title", value: post.metaTitle || post.title, type: "single_line_text_field", namespace: "seo" },
        { key: "description", value: post.metaDescription || post.description || "", type: "single_line_text_field", namespace: "seo" },
      ],
    };
  }

  function formatForWix(post: any): Record<string, any> {
    return {
      title: post.title,
      slug: post.slug,
      content: post.compiledHtml || "",
      excerpt: post.description || "",
      coverMedia: null,
      tags: Array.isArray(post.tags) ? post.tags : [],
      categories: post.category ? [post.category] : [],
      seo: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.description || "",
      },
      publishedDate: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
    };
  }

  const cmsFormatters: Record<CmsFormat, (post: any) => Record<string, any>> = {
    wordpress: formatForWordPress,
    ghost: formatForGhost,
    webflow: formatForWebflow,
    hubspot: formatForHubSpot,
    contentful: formatForContentful,
    shopify: formatForShopify,
    wix: formatForWix,
  };

  app.get("/api/blog/cms-formats", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    res.json(CMS_FORMATS.map(f => ({
      value: f,
      label: f.charAt(0).toUpperCase() + f.slice(1),
    })));
  });

  app.post("/api/blog/posts/:id/export-cms", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const format = (req.body.format || "wordpress") as CmsFormat;
      if (!CMS_FORMATS.includes(format)) {
        return res.status(400).json({ error: `Invalid format. Must be one of: ${CMS_FORMATS.join(", ")}` });
      }

      let postToExport = post;
      if (!post.compiledHtml && post.mdxContent) {
        const { html, errors } = await compileMdxToHtml(post.mdxContent);
        if (errors.length === 0) {
          postToExport = { ...post, compiledHtml: html };
          await storage.updateWorkspaceBlogPost(post.id, { compiledHtml: html });
        }
      }

      const formatter = cmsFormatters[format];
      const formatted = formatter(postToExport);

      res.json({
        format,
        data: formatted,
        postId: post.id,
        title: post.title,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/export-cms-bulk", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const { workspaceId, format: formatStr } = req.body;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });

      const format = (formatStr || "wordpress") as CmsFormat;
      if (!CMS_FORMATS.includes(format)) {
        return res.status(400).json({ error: `Invalid format. Must be one of: ${CMS_FORMATS.join(", ")}` });
      }

      const posts = await storage.getWorkspaceBlogPosts(workspaceId);
      const exportable = posts.filter(p => p.mdxContent && p.mdxContent.length > 100);

      const formatter = cmsFormatters[format];
      const items = [];
      for (const post of exportable) {
        let postToExport = post;
        if (!post.compiledHtml && post.mdxContent) {
          const { html, errors } = await compileMdxToHtml(post.mdxContent);
          if (errors.length === 0) {
            postToExport = { ...post, compiledHtml: html };
            await storage.updateWorkspaceBlogPost(post.id, { compiledHtml: html });
          }
        }
        items.push({
          postId: post.id,
          title: post.title,
          slug: post.slug,
          data: formatter(postToExport),
        });
      }

      res.json({
        format,
        exported: items.length,
        items,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/invoices", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const workspaceId = req.query.workspaceId as string | undefined;
      const data = await storage.getInvoices(workspaceId || undefined);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const invoice = await storage.getInvoice(Number(req.params.id));
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });
      const lineItems = await storage.getInvoiceLineItems(invoice.id);
      res.json({ ...invoice, lineItems });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/invoices", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const { lineItems, ...invoiceData } = req.body;
      const parsed = insertInvoiceSchema.parse(invoiceData);
      const invoice = await storage.createInvoice(parsed);
      if (lineItems && Array.isArray(lineItems)) {
        for (let i = 0; i < lineItems.length; i++) {
          const liData = insertInvoiceLineItemSchema.parse({ ...lineItems[i], invoiceId: invoice.id, sortOrder: i });
          await storage.createInvoiceLineItem(liData);
        }
      }
      const items = await storage.getInvoiceLineItems(invoice.id);
      res.status(201).json({ ...invoice, lineItems: items });
    } catch (err: any) {
      if (err?.name === "ZodError") return res.status(400).json({ error: "Validation error", details: err.errors });
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/invoices/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const id = Number(req.params.id);
      const { lineItems, ...invoiceData } = req.body;
      const updated = await storage.updateInvoice(id, invoiceData);
      if (!updated) return res.status(404).json({ error: "Invoice not found" });
      if (lineItems && Array.isArray(lineItems)) {
        await storage.deleteInvoiceLineItemsByInvoice(id);
        for (let i = 0; i < lineItems.length; i++) {
          const liData = insertInvoiceLineItemSchema.parse({ ...lineItems[i], invoiceId: id, sortOrder: i });
          await storage.createInvoiceLineItem(liData);
        }
      }
      const items = await storage.getInvoiceLineItems(id);
      res.json({ ...updated, lineItems: items });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/invoices/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const ok = await storage.deleteInvoice(Number(req.params.id));
      if (!ok) return res.status(404).json({ error: "Invoice not found" });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/content-reports", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const workspaceId = req.query.workspaceId as string | undefined;
      const data = await storage.getContentReports(workspaceId || undefined);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/content-reports/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const report = await storage.getContentReport(Number(req.params.id));
      if (!report) return res.status(404).json({ error: "Report not found" });
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/content-reports", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const parsed = insertContentReportSchema.parse(req.body);
      const report = await storage.createContentReport(parsed);
      res.status(201).json(report);
    } catch (err: any) {
      if (err?.name === "ZodError") return res.status(400).json({ error: "Validation error", details: err.errors });
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/content-reports/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const updated = await storage.updateContentReport(Number(req.params.id), req.body);
      if (!updated) return res.status(404).json({ error: "Report not found" });
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/content-reports/:id", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const ok = await storage.deleteContentReport(Number(req.params.id));
      if (!ok) return res.status(404).json({ error: "Report not found" });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/validate", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const report = validatePost(post);

      await storage.deletePostValidationResultsByPost(post.id);
      const records = issuesToInsertRecords(report, req.body.workspaceId);
      if (records.length > 0) {
        await storage.bulkCreatePostValidationResults(records);
      }

      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/validate-all", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const { workspaceId } = req.body;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });

      const posts = await storage.getWorkspaceBlogPosts(workspaceId);
      const reports = [];

      for (const post of posts) {
        const report = validatePost(post);
        await storage.deletePostValidationResultsByPost(post.id);
        const records = issuesToInsertRecords(report, workspaceId);
        if (records.length > 0) {
          await storage.bulkCreatePostValidationResults(records);
        }
        reports.push({
          postId: report.postId,
          title: post.title,
          score: report.score,
          issues: report.issues.length,
          errors: report.issues.filter((i) => i.severity === "error").length,
          warnings: report.issues.filter((i) => i.severity === "warning").length,
        });
      }

      res.json({
        validated: reports.length,
        avgScore: reports.length > 0 ? Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length) : 0,
        reports,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/blog/posts/:id/validation", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const results = await storage.getPostValidationResults(req.params.id);
      res.json(results);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/index-keywords", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const entries = indexPostKeywords(post);

      await storage.deletePostKeywordIndexByPost(post.id);
      const records = keywordEntriesToInsertRecords(entries, post.workspaceId, req.body.workspaceId);
      if (records.length > 0) {
        await storage.bulkUpsertPostKeywordIndex(records);
      }

      res.json({
        postId: post.id,
        indexed: entries.length,
        topKeywords: entries.slice(0, 10).map((e) => ({
          keyword: e.keyword,
          frequency: e.frequency,
          inTitle: e.inTitle,
          inH1: e.inH1,
          inH2: e.inH2,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/index-all-keywords", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const { workspaceId } = req.body;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });

      const posts = await storage.getWorkspaceBlogPosts(workspaceId);
      let totalIndexed = 0;

      for (const post of posts) {
        const entries = indexPostKeywords(post);
        await storage.deletePostKeywordIndexByPost(post.id);
        const records = keywordEntriesToInsertRecords(entries, post.workspaceId, workspaceId);
        if (records.length > 0) {
          await storage.bulkUpsertPostKeywordIndex(records);
        }
        totalIndexed += entries.length;
      }

      res.json({ postsProcessed: posts.length, totalKeywordsIndexed: totalIndexed });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/blog/link-suggestions", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });

      const posts = await storage.getWorkspaceBlogPosts(workspaceId);
      const suggestions = generateLinkSuggestions(posts);

      res.json({ total: suggestions.length, suggestions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/apply-link", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const { keyword, targetSlug, maxOccurrences } = req.body;
      if (!keyword || !targetSlug) {
        return res.status(400).json({ error: "keyword and targetSlug required" });
      }

      const html = post.compiledHtml || post.mdxContent || "";
      const { html: updatedHtml, applied } = applyLink(html, keyword, targetSlug, maxOccurrences || 1);

      if (applied > 0) {
        await storage.updateWorkspaceBlogPost(post.id, { compiledHtml: updatedHtml });
      }

      res.json({ postId: post.id, keyword, targetSlug, linksApplied: applied });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/bulk-auto-link", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const { workspaceId, maxLinksPerPost } = req.body;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });

      const posts = await storage.getWorkspaceBlogPosts(workspaceId);
      const suggestions = generateLinkSuggestions(posts);
      const results = bulkAutoLink(posts, suggestions, maxLinksPerPost || 3);

      for (const result of results) {
        await storage.updateWorkspaceBlogPost(result.postId, { compiledHtml: result.updatedHtml });
      }

      res.json({
        postsUpdated: results.length,
        totalLinksAdded: results.reduce((sum, r) => sum + r.linksAdded, 0),
        details: results.map((r) => ({
          postId: r.postId,
          linksAdded: r.linksAdded,
        })),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/blog/orphan-report", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });

      const posts = await storage.getWorkspaceBlogPosts(workspaceId);
      const orphans = generateOrphanReport(posts);

      res.json({
        totalPosts: posts.length,
        orphanCount: orphans.length,
        orphans,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/blog/link-health", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.status(400).json({ error: "workspaceId required" });

      const posts = await storage.getWorkspaceBlogPosts(workspaceId);
      const results = await checkLinkHealth(posts);

      const broken = results.filter((r) => r.status === "broken").length;
      const redirects = results.filter((r) => r.status === "redirect").length;
      const ok = results.filter((r) => r.status === "ok").length;
      const errors = results.filter((r) => r.status === "error" || r.status === "timeout").length;

      res.json({
        totalChecked: results.length,
        summary: { ok, broken, redirects, errors },
        results,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/image-suggestions", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const suggestions = analyzePostForImageSuggestions(post);
      res.json({ postId: post.id, suggestions });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/blog/posts/:id/resolve-images", async (req, res) => {
    if (!requireSuperAdmin(req, res)) return;
    try {
      const post = await storage.getWorkspaceBlogPost(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const { source, count, allSources } = req.body;

      let result;
      if (allSources) {
        result = await resolveAllSourceImages(post, count || 2);
      } else {
        result = await resolveKeywordImages(post, source || "pexels", count || 3);
      }

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/reports/content-stats", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.json({});
      const posts = await storage.getWorkspaceBlogPosts(workspaceId);
      const invoices = await storage.getInvoices(workspaceId);

      const published = posts.filter((p: any) => p.status === "published").length;
      const draft = posts.filter((p: any) => p.status === "draft").length;
      const totalWords = posts.reduce((sum: number, p: any) => sum + (p.mdxContent?.split(/\s+/).length || 0), 0);

      const totalInvoices = invoices.length;
      const revenue = invoices.filter((i: any) => i.status === "paid").reduce((sum: number, i: any) => sum + parseFloat(i.total || "0"), 0);
      const outstanding = invoices.filter((i: any) => i.status !== "paid" && i.status !== "cancelled").reduce((sum: number, i: any) => sum + parseFloat(i.total || "0"), 0);
      const overdue = invoices.filter((i: any) => i.status === "overdue").length;

      res.json({
        totalPosts: posts.length,
        published,
        draft,
        avgWords: posts.length > 0 ? Math.round(totalWords / posts.length) : 0,
        totalImages: 0,
        schemaCoverage: 0,
        pagesAudited: 0,
        avgSeoScore: 0,
        highScore: 0,
        mediumScore: 0,
        lowScore: 0,
        totalInvoices,
        revenue,
        outstanding,
        overdue,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content stats" });
    }
  });

  app.get("/api/reports/saved", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      const reports = await storage.getContentReports(workspaceId || undefined);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch saved reports" });
    }
  });

  app.post("/api/reports/snapshot", async (req, res) => {
    try {
      const { workspaceId } = req.body;
      const report = await storage.createContentReport({
        workspaceId,
        title: `Snapshot ${new Date().toISOString().split("T")[0]}`,
        type: "snapshot",
        status: "completed",
      });
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to save snapshot" });
    }
  });

  app.get("/api/blog/cms/api-keys", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.json([]);
      const keys = await storage.getCmsApiKeys(workspaceId);
      res.json(keys);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch CMS API keys" });
    }
  });

  app.post("/api/blog/cms/generate-key", async (req, res) => {
    try {
      const { workspaceId, platform, label } = req.body;
      if (!workspaceId || !platform) {
        return res.status(400).json({ error: "workspaceId and platform are required" });
      }
      const keyString = `ixf_${platform.toLowerCase()}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
      const record = await storage.createCmsApiKey({
        workspaceId,
        platform,
        label: label || platform,
        apiKey: keyString,
        isActive: true,
      });
      res.json(record);
    } catch (error: any) {
      console.error("[CMS] generate-key error:", error?.message || error);
      res.status(500).json({ error: "Failed to generate CMS API key" });
    }
  });

  app.delete("/api/blog/cms/api-keys/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCmsApiKey(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Key not found" });
      res.json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete CMS API key" });
    }
  });

  app.get("/api/blog/cms/sync-logs", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.json([]);
      const logs = await storage.getCmsSyncLogs(workspaceId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch CMS sync logs" });
    }
  });
}

export async function runScheduledPublisher() {
  try {
    const duePosts = await storage.getScheduledPostsDue();
    for (const post of duePosts) {
      try {
        const { html, errors } = await compileMdxToHtml(post.mdxContent);
        if (errors.length === 0) {
          await storage.updateWorkspaceBlogPost(post.id, {
            compiledHtml: html,
            status: "published",
            publishedAt: new Date(),
          });
          console.log(`[Scheduler] Published post: ${post.title} (${post.id})`);
        } else {
          console.error(`[Scheduler] MDX errors for post ${post.id}:`, errors);
        }
      } catch (err) {
        console.error(`[Scheduler] Failed to publish post ${post.id}:`, err);
      }
    }
  } catch (err) {
    console.error("[Scheduler] Error:", err);
  }
}
