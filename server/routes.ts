import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertWorkspaceSchema,
  insertBlogPostSchema,
  insertDomainSchema,
  insertContentAssetSchema,
  insertContentAssetUsageSchema,
  insertCampaignSchema,
  insertRankTrackerKeywordSchema,
  insertGridKeywordSchema,
  insertGridScanResultSchema,
  insertLeadSchema,
  insertGscDataSchema,
  insertSeoSettingsSchema,
} from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/workspaces", async (_req, res) => {
    const workspaces = await storage.getWorkspaces();
    res.json(workspaces);
  });

  app.get("/api/workspaces/:id", async (req, res) => {
    const ws = await storage.getWorkspace(req.params.id);
    if (!ws) return res.status(404).json({ error: "Workspace not found" });
    res.json(ws);
  });

  app.post("/api/workspaces", async (req, res) => {
    const parsed = insertWorkspaceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const ws = await storage.createWorkspace(parsed.data);
    res.status(201).json(ws);
  });

  app.patch("/api/workspaces/:id", async (req, res) => {
    const ws = await storage.updateWorkspace(req.params.id, req.body);
    if (!ws) return res.status(404).json({ error: "Workspace not found" });
    res.json(ws);
  });

  app.get("/api/blog-posts", async (req, res) => {
    const workspaceId = req.query.workspaceId as string | undefined;
    const posts = await storage.getBlogPosts(workspaceId);
    res.json(posts);
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    const post = await storage.getBlogPost(req.params.id);
    if (!post) return res.status(404).json({ error: "Blog post not found" });
    res.json(post);
  });

  app.get("/api/blog-posts/campaign/:workspaceId/:campaignId", async (req, res) => {
    const posts = await storage.getBlogPostsByCampaign(req.params.workspaceId, req.params.campaignId);
    res.json(posts);
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
      scheduledAt: new Date(publish_at),
    });
    if (!post) return res.status(404).json({ error: "Blog post not found" });
    res.json(post);
  });

  app.post("/api/blog-posts/bulk/create", async (req, res) => {
    const { workspaceId, posts: entries } = req.body;
    if (!workspaceId || !entries || !Array.isArray(entries)) {
      return res.status(400).json({ error: "workspaceId and posts array are required" });
    }
    const campaign = await storage.createCampaign({ workspaceId, name: `Bulk ${new Date().toISOString().slice(0, 10)}`, status: "pending", totalPosts: entries.length });
    const created = [];
    for (const entry of entries) {
      const slug = (entry.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const post = await storage.createBlogPost({
        workspaceId,
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
    const workspaceId = req.query.workspaceId as string | undefined;
    const doms = await storage.getDomains(workspaceId);
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

  app.get("/api/content-assets", async (_req, res) => {
    const assets = await storage.getContentAssets();
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

  app.get("/api/campaigns/:workspaceId", async (req, res) => {
    const cmpns = await storage.getCampaigns(req.params.workspaceId);
    res.json(cmpns);
  });

  app.post("/api/campaigns", async (req, res) => {
    const parsed = insertCampaignSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const campaign = await storage.createCampaign(parsed.data);
    res.status(201).json(campaign);
  });

  app.get("/api/rank-keywords", async (req, res) => {
    const workspaceId = req.query.workspaceId as string | undefined;
    const kws = await storage.getRankKeywords(workspaceId);
    res.json(kws);
  });

  app.post("/api/rank-keywords", async (req, res) => {
    const parsed = insertRankTrackerKeywordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const kw = await storage.createRankKeyword(parsed.data);
    res.status(201).json(kw);
  });

  app.patch("/api/rank-keywords/:id", async (req, res) => {
    const kw = await storage.updateRankKeyword(req.params.id, req.body);
    if (!kw) return res.status(404).json({ error: "Keyword not found" });
    res.json(kw);
  });

  app.delete("/api/rank-keywords/:id", async (req, res) => {
    await storage.deleteRankKeyword(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/grid-keywords", async (req, res) => {
    const workspaceId = req.query.workspaceId as string | undefined;
    const kws = await storage.getGridKeywords(workspaceId);
    res.json(kws);
  });

  app.post("/api/grid-keywords", async (req, res) => {
    const parsed = insertGridKeywordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const kw = await storage.createGridKeyword(parsed.data);
    res.status(201).json(kw);
  });

  app.delete("/api/grid-keywords/:id", async (req, res) => {
    await storage.deleteGridKeyword(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/grid-scan-results", async (req, res) => {
    const workspaceId = req.query.workspaceId as string | undefined;
    const gridKeywordId = req.query.gridKeywordId as string | undefined;
    if (gridKeywordId) {
      const results = await storage.getGridScanResults(gridKeywordId);
      return res.json(results);
    }
    if (workspaceId) {
      const results = await storage.getGridScanResultsByWorkspace(workspaceId);
      return res.json(results);
    }
    res.json([]);
  });

  app.get("/api/grid-scan-results-with-keywords", async (req, res) => {
    const workspaceId = req.query.workspaceId as string | undefined;
    const kws = await storage.getGridKeywords(workspaceId);
    const kwMap = new Map(kws.map(k => [k.id, k]));
    const allResults = [];
    for (const kw of kws) {
      const scans = await storage.getGridScanResults(kw.id);
      for (const scan of scans) {
        allResults.push({ ...scan, keyword: kw.keyword, location: kw.location });
      }
    }
    res.json(allResults);
  });

  app.post("/api/grid-scan-results", async (req, res) => {
    const parsed = insertGridScanResultSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const result = await storage.createGridScanResult(parsed.data);
    res.status(201).json(result);
  });

  app.get("/api/leads", async (req, res) => {
    const workspaceId = req.query.workspaceId as string | undefined;
    const lds = await storage.getLeads(workspaceId);
    res.json(lds);
  });

  app.post("/api/leads", async (req, res) => {
    const parsed = insertLeadSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const lead = await storage.createLead(parsed.data);
    res.status(201).json(lead);
  });

  app.patch("/api/leads/:id", async (req, res) => {
    const lead = await storage.updateLead(req.params.id, req.body);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json(lead);
  });

  app.get("/api/gsc-data", async (req, res) => {
    const workspaceId = req.query.workspaceId as string | undefined;
    const data = await storage.getGscData(workspaceId);
    res.json(data);
  });

  app.post("/api/gsc-data", async (req, res) => {
    const parsed = insertGscDataSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const data = await storage.createGscData(parsed.data);
    res.status(201).json(data);
  });

  app.get("/api/seo-settings/:workspaceId", async (req, res) => {
    const settings = await storage.getSeoSettings(req.params.workspaceId);
    res.json(settings || {});
  });

  app.put("/api/seo-settings", async (req, res) => {
    const parsed = insertSeoSettingsSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const settings = await storage.upsertSeoSettings(parsed.data);
    res.json(settings);
  });

  return httpServer;
}
