import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertVenueSchema,
  insertBlogPostSchema,
  insertDomainSchema,
  insertContentAssetSchema,
  insertContentAssetUsageSchema,
  insertCampaignSchema,
  insertRankKeywordSchema,
  insertGridKeywordSchema,
  insertContactMessageSchema,
  insertReservationSchema,
  insertResourceSchema,
} from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/venues", async (_req, res) => {
    const venueList = await storage.getVenues();
    res.json(venueList);
  });

  app.get("/api/venues/:id", async (req, res) => {
    const venue = await storage.getVenue(req.params.id);
    if (!venue) return res.status(404).json({ error: "Venue not found" });
    res.json(venue);
  });

  app.post("/api/venues", async (req, res) => {
    const parsed = insertVenueSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const venue = await storage.createVenue(parsed.data);
    res.status(201).json(venue);
  });

  app.patch("/api/venues/:id", async (req, res) => {
    const venue = await storage.updateVenue(req.params.id, req.body);
    if (!venue) return res.status(404).json({ error: "Venue not found" });
    res.json(venue);
  });

  app.get("/api/blog-posts", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    const posts = await storage.getBlogPosts(venueId);
    res.json(posts);
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    const post = await storage.getBlogPost(req.params.id);
    if (!post) return res.status(404).json({ error: "Blog post not found" });
    res.json(post);
  });

  app.post("/api/blog-posts", async (req, res) => {
    const parsed = insertBlogPostSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const post = await storage.createBlogPost(parsed.data);
    res.status(201).json(post);
  });

  app.put("/api/blog-posts/:id", async (req, res) => {
    const post = await storage.updateBlogPost(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: "Blog post not found" });
    res.json(post);
  });

  app.delete("/api/blog-posts/:id", async (req, res) => {
    await storage.deleteBlogPost(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/blog-posts/:id/publish-now", async (req, res) => {
    const post = await storage.updateBlogPost(req.params.id, {
      status: "published",
      publishedAt: new Date(),
    });
    if (!post) return res.status(404).json({ error: "Blog post not found" });
    res.json(post);
  });

  app.post("/api/blog-posts/:id/schedule", async (req, res) => {
    const { publish_at } = req.body;
    if (!publish_at) return res.status(400).json({ error: "publish_at is required" });
    const post = await storage.updateBlogPost(req.params.id, {
      status: "scheduled",
      publishAt: new Date(publish_at),
    });
    if (!post) return res.status(404).json({ error: "Blog post not found" });
    res.json(post);
  });

  app.post("/api/blog-posts/bulk/create", async (req, res) => {
    const { venueId, posts: entries } = req.body;
    if (!venueId || !entries || !Array.isArray(entries)) {
      return res.status(400).json({ error: "venueId and posts array are required" });
    }
    const campaign = await storage.createCampaign({ venueId, name: `Bulk ${new Date().toISOString().slice(0, 10)}`, status: "pending" });
    const created = [];
    for (const entry of entries) {
      const slug = (entry.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const post = await storage.createBlogPost({
        venueId,
        title: entry.title,
        slug,
        primaryKeyword: entry.primaryKeyword || "",
        intent: entry.intent || "informational",
        funnel: entry.funnel || "tofu",
        category: entry.category || "general",
        campaignId: campaign.id,
        status: "draft",
        generationStatus: "pending",
      });
      created.push(post);
    }
    res.status(201).json({ campaignId: campaign.id, posts: created });
  });

  app.get("/api/domains", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    const doms = await storage.getDomains(venueId);
    res.json(doms);
  });

  app.post("/api/domains", async (req, res) => {
    const parsed = insertDomainSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const domain = await storage.createDomain(parsed.data);
    res.status(201).json(domain);
  });

  app.patch("/api/domains/:id", async (req, res) => {
    const domain = await storage.updateDomain(req.params.id, req.body);
    if (!domain) return res.status(404).json({ error: "Domain not found" });
    res.json(domain);
  });

  app.delete("/api/domains/:id", async (req, res) => {
    await storage.deleteDomain(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/content-assets", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    const assets = await storage.getContentAssets(venueId);
    res.json(assets);
  });

  app.post("/api/content-assets", async (req, res) => {
    const parsed = insertContentAssetSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const asset = await storage.createContentAsset(parsed.data);
    res.status(201).json(asset);
  });

  app.post("/api/content-asset-usages", async (req, res) => {
    const parsed = insertContentAssetUsageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const usage = await storage.createContentAssetUsage(parsed.data);
    res.status(201).json(usage);
  });

  app.get("/api/campaigns", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const cmpns = await storage.getCampaigns(venueId);
    res.json(cmpns);
  });

  app.post("/api/campaigns", async (req, res) => {
    const parsed = insertCampaignSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const campaign = await storage.createCampaign(parsed.data);
    res.status(201).json(campaign);
  });

  app.get("/api/rank-keywords", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const kws = await storage.getRankKeywords(venueId);
    res.json(kws);
  });

  app.post("/api/rank-keywords", async (req, res) => {
    const parsed = insertRankKeywordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const kw = await storage.createRankKeyword(parsed.data);
    res.status(201).json(kw);
  });

  app.delete("/api/rank-keywords/:id", async (req, res) => {
    await storage.deleteRankKeyword(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.get("/api/rank-results", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const results = await storage.getRankResults(venueId);
    res.json(results);
  });

  app.get("/api/grid-keywords", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const kws = await storage.getGridKeywords(venueId);
    res.json(kws);
  });

  app.post("/api/grid-keywords", async (req, res) => {
    const parsed = insertGridKeywordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const kw = await storage.createGridKeyword(parsed.data);
    res.status(201).json(kw);
  });

  app.delete("/api/grid-keywords/:id", async (req, res) => {
    await storage.deleteGridKeyword(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.get("/api/grid-scan-results", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    const keyword = req.query.keyword as string | undefined;
    if (!venueId) return res.json([]);
    const results = await storage.getGridScanResults(venueId, keyword);
    res.json(results);
  });

  app.get("/api/contact-messages", async (_req, res) => {
    const msgs = await storage.getContactMessages();
    res.json(msgs);
  });

  app.post("/api/contact-messages", async (req, res) => {
    const parsed = insertContactMessageSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const msg = await storage.createContactMessage(parsed.data);
    res.status(201).json(msg);
  });

  app.get("/api/seo-settings", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const settings = await storage.getSeoSettings(venueId);
    res.json(settings);
  });

  app.get("/api/reservations", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const rvns = await storage.getReservations(venueId);
    res.json(rvns);
  });

  app.post("/api/reservations", async (req, res) => {
    const parsed = insertReservationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const reservation = await storage.createReservation(parsed.data);
    res.status(201).json(reservation);
  });

  app.patch("/api/reservations/:id", async (req, res) => {
    const reservation = await storage.updateReservation(req.params.id, req.body);
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json(reservation);
  });

  app.get("/api/resources", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const resList = await storage.getResources(venueId);
    res.json(resList);
  });

  app.post("/api/resources", async (req, res) => {
    const parsed = insertResourceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const resource = await storage.createResource(parsed.data);
    res.status(201).json(resource);
  });

  app.post("/api/mdx-preview", async (req, res) => {
    const { mdx } = req.body;
    if (!mdx || typeof mdx !== "string") return res.status(400).json({ error: "mdx string is required" });
    const html = mdx
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
      .replace(/\n{2,}/g, "</p><p>")
      .replace(/\n/g, "<br/>");
    res.json({ html: `<div class="prose">${html}</div>` });
  });

  app.post("/api/ai/generate-content", async (req, res) => {
    const { postId, keyword, intent, funnel, title } = req.body;
    if (!postId || !keyword) return res.status(400).json({ error: "postId and keyword are required" });
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const sections = [
      `# ${title || "Untitled Article"}\n\n`,
      `## Introduction\n\nThis article covers **${keyword}** from a ${intent || "informational"} perspective. `,
      `Whether you're looking for practical tips or in-depth understanding, this guide has you covered.\n\n`,
      `## What is ${keyword}?\n\n`,
      `Understanding *${keyword}* is essential for anyone looking to improve their online presence. `,
      `It encompasses strategies, tools, and best practices that drive measurable results.\n\n`,
      `## Key Benefits\n\n`,
      `- Increased organic traffic and visibility\n`,
      `- Better user engagement and conversion rates\n`,
      `- Long-term sustainable growth\n\n`,
      `## Conclusion\n\n`,
      `Mastering ${keyword} takes time, but the results are worth the investment.\n`,
    ];

    let fullContent = "";
    for (let i = 0; i < sections.length; i++) {
      fullContent += sections[i];
      res.write(`data: ${JSON.stringify({ chunk: sections[i], progress: Math.round(((i + 1) / sections.length) * 100) })}\n\n`);
      await new Promise((r) => setTimeout(r, 150 + Math.random() * 200));
    }

    await storage.updateBlogPost(postId, { mdxContent: fullContent, generationStatus: "completed" });
    res.write(`data: ${JSON.stringify({ done: true, wordCount: fullContent.split(/\s+/).length })}\n\n`);
    res.end();
  });

  app.post("/api/ai/generate-meta", async (req, res) => {
    const { keyword, title, body } = req.body;
    if (!keyword) return res.status(400).json({ error: "keyword is required" });
    const metaTitle = `${title || keyword} | Expert Guide ${new Date().getFullYear()}`;
    const metaDescription = `Discover everything about ${keyword}. Learn key strategies, best practices, and actionable tips.`;
    res.json({ metaTitle, metaDescription });
  });

  return httpServer;
}
