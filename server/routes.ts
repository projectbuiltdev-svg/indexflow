import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "./db";
import { desc } from "drizzle-orm";
import { storage } from "./storage";
import {
  twilioSettings as twilioSettingsTable,
  widgetSettings as widgetSettingsTable,
  rankTrackerKeywords as rankTrackerKeywordsTable,
  gridKeywords as gridKeywordsTable,
  reservations as reservationsTable,
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
  insertCallLogSchema,
  insertSupportTicketSchema,
  insertTwilioSettingsSchema,
  insertWidgetSettingsSchema,
  insertWebsiteChangeRequestSchema,
  insertAdminUserSchema,
  insertPaymentSettingSchema,
  insertAiProviderSettingSchema,
  insertRoomTypeSchema,
  insertRoomSchema,
  insertRoomBookingSchema,
  insertBusinessHourSchema,
  insertClosureSchema,
  insertTeamMemberSchema,
} from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/users", async (_req, res) => {
    const userList = await storage.getUsers();
    res.json(userList);
  });

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

  // Call Logs
  app.get("/api/call-logs", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const logs = await storage.getCallLogs(venueId);
    res.json(logs);
  });

  app.post("/api/call-logs", async (req, res) => {
    const parsed = insertCallLogSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const log = await storage.createCallLog(parsed.data);
    res.status(201).json(log);
  });

  // Support Tickets
  app.get("/api/support-tickets", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const tickets = await storage.getSupportTickets(venueId);
    res.json(tickets);
  });

  app.post("/api/support-tickets", async (req, res) => {
    const parsed = insertSupportTicketSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const ticket = await storage.createSupportTicket(parsed.data);
    res.status(201).json(ticket);
  });

  app.patch("/api/support-tickets/:id", async (req, res) => {
    const ticket = await storage.updateSupportTicket(req.params.id, req.body);
    if (!ticket) return res.status(404).json({ error: "Support ticket not found" });
    res.json(ticket);
  });

  // Twilio Settings
  app.get("/api/twilio-settings", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json(null);
    const settings = await storage.getTwilioSettings(venueId);
    res.json(settings || null);
  });

  app.put("/api/twilio-settings", async (req, res) => {
    const parsed = insertTwilioSettingsSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const settings = await storage.upsertTwilioSettings(parsed.data);
    res.json(settings);
  });

  // Widget Settings
  app.get("/api/widget-settings", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json(null);
    const settings = await storage.getWidgetSettings(venueId);
    res.json(settings || null);
  });

  app.put("/api/widget-settings", async (req, res) => {
    const parsed = insertWidgetSettingsSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const settings = await storage.upsertWidgetSettings(parsed.data);
    res.json(settings);
  });

  // Widget Chat Logs
  app.get("/api/widget-chat-logs", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const logs = await storage.getWidgetChatLogs(venueId);
    res.json(logs);
  });

  // Website Change Requests
  app.get("/api/website-change-requests", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const requests = await storage.getWebsiteChangeRequests(venueId);
    res.json(requests);
  });

  app.post("/api/website-change-requests", async (req, res) => {
    const parsed = insertWebsiteChangeRequestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const request = await storage.createWebsiteChangeRequest(parsed.data);
    res.status(201).json(request);
  });

  app.patch("/api/website-change-requests/:id", async (req, res) => {
    const request = await storage.updateWebsiteChangeRequest(req.params.id, req.body);
    if (!request) return res.status(404).json({ error: "Website change request not found" });
    res.json(request);
  });

  // Admin Users
  app.get("/api/admin-users", async (_req, res) => {
    const users = await storage.getAdminUsers();
    res.json(users);
  });

  app.post("/api/admin-users", async (req, res) => {
    const parsed = insertAdminUserSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const user = await storage.createAdminUser(parsed.data);
    res.status(201).json(user);
  });

  app.patch("/api/admin-users/:id", async (req, res) => {
    const user = await storage.updateAdminUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "Admin user not found" });
    res.json(user);
  });

  // Admin Settings
  app.get("/api/admin-settings", async (_req, res) => {
    const settings = await storage.getAdminSettings();
    res.json(settings);
  });

  // Payment Settings
  app.get("/api/payment-settings", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json(null);
    const settings = await storage.getPaymentSettings(venueId);
    res.json(settings || null);
  });

  app.put("/api/payment-settings", async (req, res) => {
    const parsed = insertPaymentSettingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const settings = await storage.upsertPaymentSettings(parsed.data);
    res.json(settings);
  });

  // AI Provider Settings
  app.get("/api/ai-provider-settings", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const settings = await storage.getAiProviderSettings(venueId);
    res.json(settings);
  });

  app.put("/api/ai-provider-settings", async (req, res) => {
    const parsed = insertAiProviderSettingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const settings = await storage.upsertAiProviderSettings(parsed.data);
    res.json(settings);
  });

  // Room Types
  app.get("/api/room-types", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const types = await storage.getRoomTypes(venueId);
    res.json(types);
  });

  app.post("/api/room-types", async (req, res) => {
    const parsed = insertRoomTypeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const roomType = await storage.createRoomType(parsed.data);
    res.status(201).json(roomType);
  });

  app.patch("/api/room-types/:id", async (req, res) => {
    const roomType = await storage.updateRoomType(req.params.id, req.body);
    if (!roomType) return res.status(404).json({ error: "Room type not found" });
    res.json(roomType);
  });

  // Rooms
  app.get("/api/rooms", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const roomList = await storage.getRooms(venueId);
    res.json(roomList);
  });

  app.post("/api/rooms", async (req, res) => {
    const parsed = insertRoomSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const room = await storage.createRoom(parsed.data);
    res.status(201).json(room);
  });

  // Room Bookings
  app.get("/api/room-bookings", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const bookings = await storage.getRoomBookings(venueId);
    res.json(bookings);
  });

  app.post("/api/room-bookings", async (req, res) => {
    const parsed = insertRoomBookingSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const booking = await storage.createRoomBooking(parsed.data);
    res.status(201).json(booking);
  });

  app.patch("/api/room-bookings/:id", async (req, res) => {
    const booking = await storage.updateRoomBooking(req.params.id, req.body);
    if (!booking) return res.status(404).json({ error: "Room booking not found" });
    res.json(booking);
  });

  // Business Hours
  app.get("/api/business-hours", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const hours = await storage.getBusinessHours(venueId);
    res.json(hours);
  });

  app.put("/api/business-hours", async (req, res) => {
    const { venueId, hours } = req.body;
    if (!venueId || !Array.isArray(hours)) return res.status(400).json({ error: "venueId and hours array are required" });
    const results = await storage.upsertBusinessHours(venueId, hours);
    res.json(results);
  });

  // Closures
  app.get("/api/closures", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const closureList = await storage.getClosures(venueId);
    res.json(closureList);
  });

  app.post("/api/closures", async (req, res) => {
    const parsed = insertClosureSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const closure = await storage.createClosure(parsed.data);
    res.status(201).json(closure);
  });

  app.delete("/api/closures/:id", async (req, res) => {
    await storage.deleteClosure(parseInt(req.params.id));
    res.json({ success: true });
  });

  // Knowledge Base
  app.get("/api/knowledge-base", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const items = await storage.getKnowledgeBaseItems(venueId);
    res.json(items);
  });

  // Team Members
  app.get("/api/team-members", async (req, res) => {
    const venueId = req.query.venueId as string | undefined;
    if (!venueId) return res.json([]);
    const members = await storage.getTeamMembers(venueId);
    res.json(members);
  });

  app.post("/api/team-members", async (req, res) => {
    const parsed = insertTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: fromError(parsed.error).toString() });
    const member = await storage.createTeamMember(parsed.data);
    res.status(201).json(member);
  });

  // Admin-only endpoints (all data, no venueId filter)
  app.get("/api/admin/call-logs", async (_req, res) => {
    const logs = await storage.getAllCallLogs();
    res.json(logs);
  });

  app.get("/api/admin/support-tickets", async (_req, res) => {
    const tickets = await storage.getAllSupportTickets();
    res.json(tickets);
  });

  app.get("/api/admin/website-change-requests", async (_req, res) => {
    const requests = await storage.getAllWebsiteChangeRequests();
    res.json(requests);
  });

  app.get("/api/admin/payment-settings", async (_req, res) => {
    const settings = await storage.getAllPaymentSettings();
    res.json(settings);
  });

  app.get("/api/admin/twilio-settings", async (_req, res) => {
    const allSettings = await db.select().from(twilioSettingsTable);
    res.json(allSettings);
  });

  app.get("/api/admin/widget-settings", async (_req, res) => {
    const allSettings = await db.select().from(widgetSettingsTable);
    res.json(allSettings);
  });

  app.get("/api/admin/rank-keywords", async (_req, res) => {
    const kws = await db.select().from(rankTrackerKeywordsTable);
    res.json(kws);
  });

  app.get("/api/admin/grid-keywords", async (_req, res) => {
    const kws = await db.select().from(gridKeywordsTable);
    res.json(kws);
  });

  app.get("/api/admin/reservations", async (_req, res) => {
    const rvns = await db.select().from(reservationsTable).orderBy(desc(reservationsTable.createdAt));
    res.json(rvns);
  });

  return httpServer;
}
