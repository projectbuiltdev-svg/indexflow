import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { InsertRoomBooking } from "@shared/schema";
import { insertSupportTicketSchema, getPlanTier } from "@shared/schema";
import { getAiResponse, buildWidgetSystemPrompt, resolveAiKey } from "./ai-chat";
import { compileMdxToHtml } from "./mdx-compiler";
import { generateSingleDraft } from "./draft-generator";
import { protectPseoManagedPages } from "./middleware/pseo-page-deletion-protection";
import { registerPseoPageRoutes } from "./routes/pseo/pages";
import pseoTemplateRouter from "./routes/pseo/template";
import pseoLocationsRouter from "./routes/pseo/locations";
import pseoKeywordsRouter from "./routes/pseo/keywords";
import pseoCampaignsRouter from "./routes/pseo/campaigns";
import pseoReviewRouter from "./routes/pseo/review";
import fs from "fs";
import path from "path";

function isForeignKeyError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes("foreign key") || msg.includes("violates foreign key constraint");
  }
  return false;
}

function normalizeISODate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    return value.trim().slice(0, 10);
  }
  return "";
}

function normalizeTime(value: unknown): string {
  if (typeof value !== "string") return "";
  const t = value.trim();
  if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
  return t;
}

async function authorizeWorkspaceAccess(req: Request, workspaceId: string): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    const workspace = await storage.getWorkspace(workspaceId);
    return !!workspace;
  }
  const userId = (req as any).user?.id;
  if (!userId) return false;
  const workspace = await storage.getWorkspace(workspaceId);
  if (!workspace) return false;
  if (workspace.ownerId === userId) return true;
  const teamMember = await storage.getTeamMemberByUserAndWorkspace(userId, workspaceId);
  return !!teamMember;
}

import { 
  insertContactMessageSchema,
  insertWorkspaceSchema,
  insertTeamMemberSchema,
  insertKnowledgeBaseItemSchema,
  insertWidgetSettingsSchema,
  insertTwilioSettingsSchema,
  insertPaymentSettingsSchema,
  insertAiProviderSettingsSchema,
  insertRoomTypeSchema,
  insertRoomSchema,
  insertRoomBookingSchema,
  insertWorkspaceSiteProfileSchema,
} from "@shared/schema";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerTwilioWebhooks } from "./twilio-webhooks";
import { registerCrmRoutes } from "./crm-routes";
import { registerContentRoutes, runScheduledPublisher } from "./content-routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  const BLOG_CONTENT_DIR = path.resolve("apps/marketing/content/blog");

  function parseFrontmatter(raw: string) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { meta: {}, content: raw };
    const meta: Record<string, string> = {};
    for (const line of match[1].split("\n")) {
      const idx = line.indexOf(":");
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        meta[key] = val;
      }
    }
    return { meta, content: raw.slice(match[0].length).trim() };
  }

  app.get("/api/marketing/posts", async (_req, res) => {
    try {
      if (!fs.existsSync(BLOG_CONTENT_DIR)) {
        return res.json([]);
      }
      const categories = fs.readdirSync(BLOG_CONTENT_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

      const posts: any[] = [];
      for (const category of categories) {
        const catDir = path.join(BLOG_CONTENT_DIR, category);
        const files = fs.readdirSync(catDir).filter(f => f.endsWith(".mdx") || f.endsWith(".md"));
        for (const file of files) {
          const raw = fs.readFileSync(path.join(catDir, file), "utf-8");
          const { meta } = parseFrontmatter(raw);
          posts.push({
            slug: meta.slug || file.replace(/\.mdx?$/, ""),
            title: meta.title || "",
            description: meta.description || "",
            date: meta.date || "",
            category: meta.category || category,
            author: meta.author || "",
            readTime: meta.readTime || "",
            featured: meta.featured === "true",
            categorySlug: category,
          });
        }
      }
      posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      res.json(posts);
    } catch (error) {
      console.error("Error reading blog posts:", error);
      res.status(500).json({ error: "Failed to load blog posts" });
    }
  });

  app.get("/api/marketing/posts/:category/:slug", async (req, res) => {
    try {
      const { category, slug } = req.params;
      const mdxPath = path.join(BLOG_CONTENT_DIR, category, `${slug}.mdx`);
      const mdPath = path.join(BLOG_CONTENT_DIR, category, `${slug}.md`);
      const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
      if (!filePath) {
        return res.status(404).json({ error: "Post not found" });
      }
      const raw = fs.readFileSync(filePath, "utf-8");
      const { meta, content } = parseFrontmatter(raw);
      res.json({
        slug: meta.slug || slug,
        title: meta.title || "",
        description: meta.description || "",
        date: meta.date || "",
        category: meta.category || category,
        author: meta.author || "",
        readTime: meta.readTime || "",
        featured: meta.featured === "true",
        categorySlug: category,
        content,
      });
    } catch (error) {
      console.error("Error reading blog post:", error);
      res.status(500).json({ error: "Failed to load blog post" });
    }
  });

  // Contact Messages
  app.get("/api/contact", async (req, res) => {
    try {
      if (process.env.NODE_ENV === "production") {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });
      }
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid message data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Support Tickets
  app.get("/api/workspaces/:workspaceId/support-tickets", async (req, res) => {
    try {
      const { workspaceId } = req.params;
      if (process.env.NODE_ENV === "production") {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        const authorized = await authorizeWorkspaceAccess(req, workspaceId);
        if (!authorized) return res.status(403).json({ error: "Forbidden" });
      }
      
      const tickets = await storage.getSupportTicketsByWorkspace(workspaceId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.post("/api/workspaces/:workspaceId/support-tickets", async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const userId = (req as any).user?.id || "dev-user";
      if (process.env.NODE_ENV === "production") {
        if (!userId || userId === "dev-user") return res.status(401).json({ error: "Unauthorized" });
        const authorized = await authorizeWorkspaceAccess(req, workspaceId);
        if (!authorized) return res.status(403).json({ error: "Forbidden" });
      }

      const validatedData = insertSupportTicketSchema.parse({
        ...req.body,
        workspaceId,
        userId,
        status: "open"
      });
      
      const ticket = await storage.createSupportTicket(validatedData);

      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid ticket data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit ticket" });
    }
  });

  // Legacy support endpoint (for unauthenticated quick submissions)
  app.post("/api/support/tickets", async (req, res) => {
    try {
      const ticketSchema = z.object({
        subject: z.string().min(5),
        description: z.string().min(20),
        priority: z.enum(["low", "medium", "high", "urgent"]),
        category: z.enum(["technical", "billing", "feature", "general"])
      });

      const validatedData = ticketSchema.parse(req.body);
      const userId = (req as any).user?.id || "anonymous";

      res.status(201).json({ 
        success: true, 
        message: "Ticket submitted successfully",
        ticketId: `TKT-${Date.now()}`
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid ticket data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit ticket" });
    }
  });

  app.get("/api/plan-info", async (req, res) => {
    try {
      const userId = (req as any).user?.id || "dev-user";
      const user = await storage.getUser(userId);
      const planTier = getPlanTier(user?.plan || "solo");
      const workspaceCount = await storage.countWorkspacesByOwner(userId);
      const seatCount = await storage.countTeamMembersByOwner(userId);

      const planId = user?.plan || "solo";
      res.json({
        plan: planId,
        planName: planTier.name,
        price: planTier.price,
        limits: {
          workspaces: planTier.workspaces === Infinity ? null : planTier.workspaces,
          users: planTier.users,
          postsPerWorkspacePerMonth: planTier.postsPerWorkspacePerMonth,
          pseoCampaigns: planTier.pseoCampaigns,
        },
        features: planTier.features,
        usage: {
          workspaces: workspaceCount,
          users: seatCount,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plan info" });
    }
  });

  // Venues
  app.get("/api/workspaces", async (req, res) => {
    try {
      // WARNING: Development convenience only — returns ALL workspaces without owner scoping.
      // Must never reach production. Remove or gate behind auth before go-live.
      if (process.env.NODE_ENV !== "production") {
        const venues = await storage.getWorkspaces();
        return res.json(venues);
      }
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      const venues = await storage.getWorkspacesByOwner(userId);
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workspaces" });
    }
  });

  app.get("/api/workspaces/:id", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.id)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const workspace = await storage.getWorkspace(req.params.id);
      if (!workspace) return res.status(404).json({ error: "Workspace not found" });
      res.json(workspace);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workspace" });
    }
  });

  app.post("/api/workspaces", async (req, res) => {
    try {
      const userId = (req as any).user?.id || "dev-user";
      if (process.env.NODE_ENV === "production" && (!userId || userId === "dev-user")) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      const planTier = getPlanTier(user?.plan || "solo");
      const currentCount = await storage.countWorkspacesByOwner(userId);

      if (currentCount >= planTier.workspaces) {
        return res.status(403).json({
          error: "workspace_limit_reached",
          message: `Your ${planTier.name} plan allows up to ${planTier.workspaces === Infinity ? "unlimited" : planTier.workspaces} workspace${planTier.workspaces === 1 ? "" : "s"}. Please upgrade your plan to create more.`,
          currentCount,
          maxAllowed: planTier.workspaces === Infinity ? null : planTier.workspaces,
          plan: user?.plan || "solo",
        });
      }

      const validatedData = insertWorkspaceSchema.parse({ ...req.body, ownerId: userId });
      const workspace = await storage.createWorkspace(validatedData);
      res.status(201).json(workspace);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid workspace data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create workspace" });
    }
  });

  app.patch("/api/workspaces/:id", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.id)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      if (req.body.aiKeySource && !["agency", "client"].includes(req.body.aiKeySource)) {
        return res.status(400).json({ error: "aiKeySource must be 'agency' or 'client'" });
      }
      const workspace = await storage.updateWorkspace(req.params.id, req.body);
      if (!workspace) return res.status(404).json({ error: "Workspace not found" });
      res.json(workspace);
    } catch (error) {
      res.status(500).json({ error: "Failed to update workspace" });
    }
  });

  app.delete("/api/workspaces/:id", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.id)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const deleted = await storage.deleteWorkspace(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Workspace not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete workspace" });
    }
  });

  // Team Members
  app.get("/api/workspaces/:workspaceId/team", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const members = await storage.getTeamMembers(req.params.workspaceId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.post("/api/workspaces/:workspaceId/team", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const workspace = await storage.getWorkspace(req.params.workspaceId);
      if (!workspace) return res.status(404).json({ error: "Workspace not found" });

      const ownerId = workspace.ownerId || (req as any).user?.id || "dev-user";
      const owner = await storage.getUser(ownerId);
      const planTier = getPlanTier(owner?.plan || "solo");
      const currentSeatCount = await storage.countTeamMembersByOwner(ownerId);

      if (currentSeatCount >= planTier.users) {
        return res.status(403).json({
          error: "user_seat_limit_reached",
          message: `Your ${planTier.name} plan allows up to ${planTier.users} user seat${planTier.users === 1 ? "" : "s"}. Please upgrade your plan to add more team members.`,
          currentCount: currentSeatCount,
          maxAllowed: planTier.users,
          plan: owner?.plan || "solo",
        });
      }

      const validatedData = insertTeamMemberSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId,
      });
      const member = await storage.createTeamMember(validatedData);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid team member data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create team member" });
    }
  });

  app.patch("/api/team/:id", async (req, res) => {
    try {
      const member = await storage.getTeamMember(parseInt(req.params.id));
      if (!member) return res.status(404).json({ error: "Team member not found" });
      if (!await authorizeWorkspaceAccess(req, member.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const updated = await storage.updateTeamMember(parseInt(req.params.id), req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update team member" });
    }
  });

  app.delete("/api/team/:id", async (req, res) => {
    try {
      const member = await storage.getTeamMember(parseInt(req.params.id));
      if (!member) return res.status(404).json({ error: "Team member not found" });
      if (!await authorizeWorkspaceAccess(req, member.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteTeamMember(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team member" });
    }
  });

  // Knowledge Base
  app.get("/api/workspaces/:workspaceId/knowledge-base", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const items = await storage.getKnowledgeBaseItems(req.params.workspaceId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge base items" });
    }
  });

  app.post("/api/workspaces/:workspaceId/knowledge-base", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertKnowledgeBaseItemSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId,
      });
      const item = await storage.createKnowledgeBaseItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid knowledge base data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create knowledge base item" });
    }
  });

  app.patch("/api/knowledge-base/:id", async (req, res) => {
    try {
      const item = await storage.getKnowledgeBaseItem(req.params.id);
      if (!item) return res.status(404).json({ error: "Knowledge base item not found" });
      if (!await authorizeWorkspaceAccess(req, item.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const updated = await storage.updateKnowledgeBaseItem(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update knowledge base item" });
    }
  });

  app.delete("/api/knowledge-base/:id", async (req, res) => {
    try {
      const item = await storage.getKnowledgeBaseItem(req.params.id);
      if (!item) return res.status(404).json({ error: "Knowledge base item not found" });
      if (!await authorizeWorkspaceAccess(req, item.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteKnowledgeBaseItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete knowledge base item" });
    }
  });

  // Call Logs
  app.get("/api/workspaces/:workspaceId/calls", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const logs = await storage.getCallLogs(req.params.workspaceId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch call logs" });
    }
  });

  app.get("/api/calls/:id", async (req, res) => {
    try {
      const log = await storage.getCallLog(req.params.id);
      if (!log) return res.status(404).json({ error: "Call log not found" });
      if (!await authorizeWorkspaceAccess(req, log.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch call log" });
    }
  });

  // Widget Settings
  app.get("/api/workspaces/:workspaceId/widget-settings", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const settings = await storage.getWidgetSettings(req.params.workspaceId);
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch widget settings" });
    }
  });

  app.put("/api/workspaces/:workspaceId/widget-settings", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertWidgetSettingsSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId,
      });
      const settings = await storage.upsertWidgetSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid widget settings", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update widget settings" });
    }
  });

  // Twilio Settings
  app.get("/api/workspaces/:workspaceId/twilio-settings", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const settings = await storage.getTwilioSettings(req.params.workspaceId);
      if (settings) {
        res.json({ ...settings, authToken: settings.authToken ? "***" : null });
      } else {
        res.json({});
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Twilio settings" });
    }
  });

  app.put("/api/workspaces/:workspaceId/twilio-settings", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertTwilioSettingsSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId,
      });
      const settings = await storage.upsertTwilioSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid Twilio settings", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update Twilio settings" });
    }
  });

  // Payment Settings
  app.get("/api/workspaces/:workspaceId/payment-settings", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const settings = await storage.getPaymentSettings(req.params.workspaceId);
      if (settings) {
        const masked = {
          ...settings,
          stripeSecretKey: settings.stripeSecretKey ? "***" : null,
          stripePublishableKey: settings.stripePublishableKey || null,
          paypalClientSecret: settings.paypalClientSecret ? "***" : null,
          paypalClientId: settings.paypalClientId || null,
        };
        res.json(masked);
      } else {
        res.json(null);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment settings" });
    }
  });

  app.put("/api/workspaces/:workspaceId/payment-settings", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { provider, ...credentials } = req.body;
      const validProviders = ["stripe", "paypal", "disconnect-stripe", "disconnect-paypal"];
      if (!provider || !validProviders.includes(provider)) {
        return res.status(400).json({ error: "Invalid provider. Must be one of: stripe, paypal, disconnect-stripe, disconnect-paypal" });
      }
      if (provider === "stripe" && (!credentials.stripePublishableKey || !credentials.stripeSecretKey)) {
        return res.status(400).json({ error: "Stripe requires both publishableKey and secretKey" });
      }
      if (provider === "paypal" && (!credentials.paypalClientId || !credentials.paypalClientSecret)) {
        return res.status(400).json({ error: "PayPal requires both clientId and clientSecret" });
      }
      const existing = await storage.getPaymentSettings(req.params.workspaceId);

      let data: any = {
        workspaceId: req.params.workspaceId,
      };

      if (provider === "stripe") {
        data.stripePublishableKey = credentials.stripePublishableKey;
        data.stripeSecretKey = credentials.stripeSecretKey;
        data.stripeConnected = true;
        if (existing) {
          data.paypalClientId = existing.paypalClientId;
          data.paypalClientSecret = existing.paypalClientSecret;
          data.paypalConnected = existing.paypalConnected;
        }
      } else if (provider === "paypal") {
        data.paypalClientId = credentials.paypalClientId;
        data.paypalClientSecret = credentials.paypalClientSecret;
        data.paypalConnected = true;
        if (existing) {
          data.stripePublishableKey = existing.stripePublishableKey;
          data.stripeSecretKey = existing.stripeSecretKey;
          data.stripeConnected = existing.stripeConnected;
        }
      } else if (provider === "disconnect-stripe") {
        data = {
          ...data,
          stripePublishableKey: null,
          stripeSecretKey: null,
          stripeConnected: false,
          paypalClientId: existing?.paypalClientId || null,
          paypalClientSecret: existing?.paypalClientSecret || null,
          paypalConnected: existing?.paypalConnected || false,
        };
      } else if (provider === "disconnect-paypal") {
        data = {
          ...data,
          stripePublishableKey: existing?.stripePublishableKey || null,
          stripeSecretKey: existing?.stripeSecretKey || null,
          stripeConnected: existing?.stripeConnected || false,
          paypalClientId: null,
          paypalClientSecret: null,
          paypalConnected: false,
        };
      }

      const settings = await storage.upsertPaymentSettings(data);
      const masked = {
        ...settings,
        stripeSecretKey: settings.stripeSecretKey ? "***" : null,
        stripePublishableKey: settings.stripePublishableKey || null,
        paypalClientSecret: settings.paypalClientSecret ? "***" : null,
        paypalClientId: settings.paypalClientId || null,
      };
      res.json(masked);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment settings" });
    }
  });

  // AI Provider Settings
  app.get("/api/workspaces/:workspaceId/ai-providers", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const settings = await storage.getAiProviderSettings(req.params.workspaceId);
      const masked = settings.map((s) => ({
        ...s,
        apiKey: s.apiKey ? "***" : null,
      }));
      res.json(masked);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI provider settings" });
    }
  });

  app.put("/api/workspaces/:workspaceId/ai-providers", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertAiProviderSettingsSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId,
      });
      const settings = await storage.upsertAiProviderSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid AI provider settings", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update AI provider settings" });
    }
  });

  app.get("/api/workspaces/:workspaceId/site-profile", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const profile = await storage.getSiteProfile(req.params.workspaceId);
      res.json(profile || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch site profile" });
    }
  });

  app.put("/api/workspaces/:workspaceId/site-profile", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertWorkspaceSiteProfileSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId,
      });
      const profile = await storage.upsertSiteProfile(validatedData);
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid site profile data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update site profile" });
    }
  });

  app.get("/api/workspaces/:workspaceId/ai-status", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const resolved = await resolveAiKey(req.params.workspaceId, "openai");
      res.json({
        available: !!resolved.apiKey,
        source: resolved.source,
        provider: resolved.provider,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check AI status" });
    }
  });


  app.get("/api/workspaces/:workspaceId/images/search", async (req, res) => {
    try {
      const source = (req.query.source as string) || "pexels";
      const q = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      if (!q) return res.status(400).json({ error: "q (query) required" });

      let results: any[] = [];

      if (source === "pexels") {
        const apiKey = process.env.PEXELS_API_KEY;
        if (!apiKey) return res.status(503).json({ error: "Image search not available" });
        const resp = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=20&page=${page}`, {
          headers: { Authorization: apiKey },
        });
        const data = await resp.json() as any;
        results = (data.photos || []).map((p: any) => ({
          source: "pexels",
          thumb_url: p.src?.medium || p.src?.small,
          full_url: p.src?.large2x || p.src?.original,
          width: p.width,
          height: p.height,
          credit_name: p.photographer,
          credit_url: p.photographer_url,
        }));
      } else if (source === "unsplash") {
        const accessKey = process.env.UNSPLASH_ACCESS_KEY;
        if (!accessKey) return res.status(503).json({ error: "Image search not available" });
        const resp = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=20&page=${page}`, {
          headers: { Authorization: `Client-ID ${accessKey}` },
        });
        const data = await resp.json() as any;
        results = (data.results || []).map((p: any) => ({
          source: "unsplash",
          thumb_url: p.urls?.small,
          full_url: p.urls?.full,
          width: p.width,
          height: p.height,
          credit_name: p.user?.name,
          credit_url: p.user?.links?.html,
        }));
      } else if (source === "pixabay") {
        const apiKey = process.env.PIXABAY_API_KEY;
        if (!apiKey) return res.status(503).json({ error: "Image search not available" });
        const resp = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(q)}&per_page=20&page=${page}&image_type=photo`);
        const data = await resp.json() as any;
        results = (data.hits || []).map((p: any) => ({
          source: "pixabay",
          thumb_url: p.webformatURL,
          full_url: p.largeImageURL,
          width: p.imageWidth,
          height: p.imageHeight,
          credit_name: p.user,
          credit_url: `https://pixabay.com/users/${p.user}-${p.user_id}/`,
        }));
      }

      res.json(results);
    } catch (err) {
      res.status(500).json({ error: "Failed to search images" });
    }
  });

  // Admin Settings
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getAdminSetting(req.params.key);
      res.json(setting || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin setting" });
    }
  });

  app.put("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.setAdminSetting(req.params.key, req.body.value);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to update admin setting" });
    }
  });

  // Admin Support Tickets
  const adminTicketUpdateSchema = z.object({
    status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional()
  });

  app.get("/api/support-tickets", async (req, res) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  app.get("/api/support-tickets/:id", async (req, res) => {
    try {
      
      const ticket = await storage.getSupportTicket(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket" });
    }
  });

  app.patch("/api/support-tickets/:id", async (req, res) => {
    try {
      
      const validatedData = adminTicketUpdateSchema.parse(req.body);
      const updates: Record<string, string> = {};
      if (validatedData.status) updates.status = validatedData.status;
      if (validatedData.priority) updates.priority = validatedData.priority;
      
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No valid updates provided" });
      }
      
      const ticket = await storage.updateSupportTicket(req.params.id, updates);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid update data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update ticket" });
    }
  });

  // Admin aggregate endpoints (used by admin dashboard pages)
  app.get("/api/admin/venues", async (req, res) => {
    try {
      const venues = await storage.getWorkspaces();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workspaces" });
    }
  });

  app.get("/api/admin/call-logs", async (req, res) => {
    try {
      const venues = await storage.getWorkspaces();
      const allLogs: any[] = [];
      for (const ws of venues) {
        const logs = await storage.getCallLogs(ws.id);
        allLogs.push(...logs);
      }
      allLogs.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
      res.json(allLogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch call logs" });
    }
  });

  app.get("/api/admin/widget-settings", async (req, res) => {
    try {
      const venues = await storage.getWorkspaces();
      const allSettings: any[] = [];
      for (const ws of venues) {
        const settings = await storage.getWidgetSettings(ws.id);
        if (settings) allSettings.push(settings);
      }
      res.json(allSettings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch widget settings" });
    }
  });

  // Old-style rank-keywords / grid-keywords endpoints (used by admin SEO pages)
  app.get("/api/rank-keywords", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.json([]);
      const keywords = await storage.getRankTrackerKeywords(workspaceId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rank keywords" });
    }
  });

  app.post("/api/rank-keywords", async (req, res) => {
    try {
      const { workspaceId, keyword } = req.body;
      const kws = await storage.addRankTrackerKeywords([{ workspaceId, keyword }]);
      res.json(kws[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to add rank keyword" });
    }
  });

  app.delete("/api/rank-keywords/:id", async (req, res) => {
    try {
      await storage.deleteRankTrackerKeyword(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete rank keyword" });
    }
  });

  app.get("/api/rank-results", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.json([]);
      const results = await storage.getRankTrackerResults(workspaceId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rank results" });
    }
  });

  app.get("/api/grid-keywords", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.json([]);
      const keywords = await storage.getGridKeywords(workspaceId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid keywords" });
    }
  });

  app.post("/api/grid-keywords", async (req, res) => {
    try {
      const { workspaceId, keyword } = req.body;
      const kws = await storage.addGridKeywords([{ workspaceId, keyword }]);
      res.json(kws[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to add grid keyword" });
    }
  });

  app.delete("/api/grid-keywords/:id", async (req, res) => {
    try {
      await storage.deleteGridKeyword(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete grid keyword" });
    }
  });

  app.get("/api/grid-scan-results", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.json([]);
      const keywords = await storage.getGridKeywords(workspaceId);
      if (keywords.length === 0) return res.json([]);
      const results = await storage.getLatestGridScanResults(workspaceId, keywords[0].keyword);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid scan results" });
    }
  });

  app.get("/api/knowledge-base", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.json([]);
      const items = await storage.getKnowledgeBaseItems(workspaceId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge base" });
    }
  });

  app.get("/api/contact-messages", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (workspaceId) {
        if (!(await authorizeWorkspaceAccess(req, workspaceId))) {
          return res.status(403).json({ error: "Forbidden" });
        }
        const messages = await storage.getContactMessages();
        return res.json(messages.filter((m: any) => m.workspaceId === workspaceId));
      }
      if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ error: "Forbidden" });
      }
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact messages" });
    }
  });

  app.get("/api/calls", async (req, res) => {
    try {
      const workspaceId = req.query.workspaceId as string;
      if (!workspaceId) return res.json([]);
      if (!(await authorizeWorkspaceAccess(req, workspaceId))) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const calls = await storage.getCallLogs(workspaceId);
      res.json(calls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calls" });
    }
  });

  const PLATFORM_DOMAINS = ["indexflow.io", "indexflow.cloud"];

  app.get("/api/public/blog/posts", async (req, res) => {
    try {
      const domain = req.query.domain as string;
      if (!domain) return res.json({ blogTemplate: "editorial", accentColor: null, accentForeground: null, posts: [] });

      if (PLATFORM_DOMAINS.includes(domain)) {
        const allWorkspaces = await storage.getWorkspaces();
        let allPosts: any[] = [];
        for (const ws of allWorkspaces) {
          const posts = await storage.getWorkspaceBlogPosts(ws.id, "published");
          allPosts = allPosts.concat(posts);
        }
        allPosts.sort((a, b) => {
          const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return db - da;
        });
        return res.json({ blogTemplate: "editorial", accentColor: null, accentForeground: null, posts: allPosts });
      }

      const domainRecord = await storage.getWorkspaceDomainByDomain(domain);
      if (!domainRecord) return res.json({ blogTemplate: "editorial", accentColor: null, accentForeground: null, posts: [] });
      const workspace = await storage.getWorkspace(domainRecord.workspaceId);
      const posts = await storage.getWorkspaceBlogPosts(domainRecord.workspaceId, "published");
      res.json({
        blogTemplate: (workspace as any)?.blogTemplate || "editorial",
        accentColor: (workspace as any)?.accentColor || null,
        accentForeground: (workspace as any)?.accentForeground || null,
        posts,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/public/blog/post", async (req, res) => {
    try {
      const domain = req.query.domain as string;
      const slug = req.query.slug as string;
      if (!domain || !slug) return res.status(400).json({ error: "domain and slug required" });

      const compileIfNeeded = async (post: any) => {
        if (!post.compiledHtml && post.mdxContent) {
          const { html } = await compileMdxToHtml(post.mdxContent);
          return { ...post, compiledHtml: html };
        }
        return post;
      };

      if (PLATFORM_DOMAINS.includes(domain)) {
        const allWorkspaces = await storage.getWorkspaces();
        for (const ws of allWorkspaces) {
          const posts = await storage.getWorkspaceBlogPosts(ws.id, "published");
          const post = posts.find(p => p.slug === slug);
          if (post) {
            const workspace = await storage.getWorkspace(ws.id);
            return res.json({
              blogTemplate: (workspace as any)?.blogTemplate || "editorial",
              accentColor: (workspace as any)?.accentColor || null,
              accentForeground: (workspace as any)?.accentForeground || null,
              ...(await compileIfNeeded(post)),
            });
          }
        }
        return res.status(404).json({ error: "Post not found" });
      }

      const domainRecord = await storage.getWorkspaceDomainByDomain(domain);
      if (!domainRecord) return res.status(404).json({ error: "Domain not found" });
      const posts = await storage.getWorkspaceBlogPosts(domainRecord.workspaceId, "published");
      const post = posts.find(p => p.slug === slug);
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(await compileIfNeeded(post));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Room Types
  app.get("/api/workspaces/:workspaceId/room-types", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const roomTypes = await storage.getRoomTypes(req.params.workspaceId);
      res.json(roomTypes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room types" });
    }
  });

  app.get("/api/workspaces/:workspaceId/room-types/:id", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const roomType = await storage.getRoomType(req.params.id);
      if (!roomType || roomType.workspaceId !== req.params.workspaceId) {
        return res.status(404).json({ error: "Room type not found" });
      }
      res.json(roomType);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room type" });
    }
  });

  app.post("/api/workspaces/:workspaceId/room-types", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertRoomTypeSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId,
      });
      const roomType = await storage.createRoomType(validatedData);
      res.status(201).json(roomType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid room type data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create room type" });
    }
  });

  app.patch("/api/room-types/:id", async (req, res) => {
    try {
      const existing = await storage.getRoomType(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Room type not found" });
      }
      if (!await authorizeWorkspaceAccess(req, existing.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validation = insertRoomTypeSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid room type data", details: validation.error.flatten() });
      }
      const roomType = await storage.updateRoomType(req.params.id, validation.data);
      res.json(roomType);
    } catch (error) {
      res.status(500).json({ error: "Failed to update room type" });
    }
  });

  app.delete("/api/room-types/:id", async (req, res) => {
    try {
      const existing = await storage.getRoomType(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Room type not found" });
      }
      if (!await authorizeWorkspaceAccess(req, existing.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteRoomType(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete room type" });
    }
  });

  // Rooms
  app.get("/api/workspaces/:workspaceId/rooms", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const rooms = await storage.getRooms(req.params.workspaceId);
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  });

  app.get("/api/workspaces/:workspaceId/rooms/:id", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const room = await storage.getRoom(req.params.id);
      if (!room || room.workspaceId !== req.params.workspaceId) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room" });
    }
  });

  app.post("/api/workspaces/:workspaceId/rooms", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertRoomSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId,
      });
      const room = await storage.createRoom(validatedData);
      res.status(201).json(room);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid room data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create room" });
    }
  });

  app.patch("/api/rooms/:id", async (req, res) => {
    try {
      const existing = await storage.getRoom(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Room not found" });
      }
      if (!await authorizeWorkspaceAccess(req, existing.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validation = insertRoomSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid room data", details: validation.error.flatten() });
      }
      const room = await storage.updateRoom(req.params.id, validation.data);
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Failed to update room" });
    }
  });

  app.delete("/api/rooms/:id", async (req, res) => {
    try {
      const existing = await storage.getRoom(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Room not found" });
      }
      if (!await authorizeWorkspaceAccess(req, existing.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteRoom(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete room" });
    }
  });

  // Room Bookings
  app.get("/api/workspaces/:workspaceId/room-bookings", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { startDate, endDate } = req.query;
      let bookings;
      if (startDate && endDate) {
        bookings = await storage.getRoomBookingsByDateRange(
          req.params.workspaceId,
          normalizeISODate(startDate),
          normalizeISODate(endDate)
        );
      } else {
        bookings = await storage.getRoomBookings(req.params.workspaceId);
      }
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room bookings" });
    }
  });

  app.get("/api/room-bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getRoomBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Room booking not found" });
      }
      if (!await authorizeWorkspaceAccess(req, booking.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room booking" });
    }
  });

  app.post("/api/workspaces/:workspaceId/room-bookings", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const checkIn = normalizeISODate(req.body.checkIn);
      const checkOut = normalizeISODate(req.body.checkOut);
      
      if (checkOut <= checkIn) {
        return res.status(400).json({ error: "Check-out date must be after check-in date" });
      }
      
      // Check for overlapping bookings on the same room
      const existingBookings = await storage.getRoomBookingsByDateRange(
        req.params.workspaceId,
        checkIn,
        checkOut
      );
      const hasOverlap = existingBookings.some(
        (b) => b.roomId === req.body.roomId && b.status !== "cancelled"
      );
      if (hasOverlap) {
        return res.status(409).json({ error: "Room is already booked for the selected dates" });
      }
      
      const validatedData = insertRoomBookingSchema.parse({
        ...req.body,
        workspaceId: req.params.workspaceId,
        checkIn,
        checkOut,
      });
      const booking = await storage.createRoomBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid room booking data", details: error.errors });
      }
      if (isForeignKeyError(error)) {
        return res.status(400).json({ error: "Invalid room or room type" });
      }
      res.status(500).json({ error: "Failed to create room booking" });
    }
  });

  app.patch("/api/room-bookings/:id", async (req, res) => {
    try {
      const existing = await storage.getRoomBooking(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Room booking not found" });
      }
      if (!await authorizeWorkspaceAccess(req, existing.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validation = insertRoomBookingSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid room booking data", details: validation.error.flatten() });
      }
      const update = { ...validation.data };
      const normalizedCheckIn = update.checkIn ? normalizeISODate(update.checkIn) : null;
      const normalizedCheckOut = update.checkOut ? normalizeISODate(update.checkOut) : null;
      
      // Check for overlapping bookings if dates or room changed
      const newCheckIn = normalizedCheckIn || existing.checkIn;
      const newCheckOut = normalizedCheckOut || existing.checkOut;
      const newRoomId = update.roomId || existing.roomId;
      
      if (newCheckOut <= newCheckIn) {
        return res.status(400).json({ error: "Check-out date must be after check-in date" });
      }
      if (update.checkIn || update.checkOut || update.roomId) {
        const overlapping = await storage.getRoomBookingsByDateRange(
          existing.workspaceId,
          newCheckIn,
          newCheckOut
        );
        const hasOverlap = overlapping.some(
          (b) => b.id !== req.params.id && b.roomId === newRoomId && b.status !== "cancelled"
        );
        if (hasOverlap) {
          return res.status(409).json({ error: "Room is already booked for the selected dates" });
        }
      }
      
      // Prepare update with normalized dates for storage
      const storageUpdate = {
        ...update,
        ...(normalizedCheckIn && { checkIn: normalizedCheckIn }),
        ...(normalizedCheckOut && { checkOut: normalizedCheckOut }),
      } as Partial<InsertRoomBooking>;
      const booking = await storage.updateRoomBooking(req.params.id, storageUpdate);
      res.json(booking);
    } catch (error) {
      if (isForeignKeyError(error)) {
        return res.status(400).json({ error: "Invalid room or room type" });
      }
      res.status(500).json({ error: "Failed to update room booking" });
    }
  });

  app.delete("/api/room-bookings/:id", async (req, res) => {
    try {
      const existing = await storage.getRoomBooking(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "Room booking not found" });
      }
      if (!await authorizeWorkspaceAccess(req, existing.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteRoomBooking(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete room booking" });
    }
  });

  // Website Change Requests
  app.get("/api/workspaces/:workspaceId/website-changes", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const changes = await storage.getWebsiteChangeRequests(req.params.workspaceId);
      res.json(changes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch website change requests" });
    }
  });

  app.post("/api/workspaces/:workspaceId/website-changes", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const userId = (req as any).user?.id || "anonymous";
      const { changeType, description, pageUrl } = req.body;
      if (!description || typeof description !== "string" || description.trim().length === 0) {
        return res.status(400).json({ error: "Description is required" });
      }
      const change = await storage.createWebsiteChangeRequest({
        workspaceId: req.params.workspaceId,
        userId,
        changeType: changeType || "text",
        description: description.trim(),
        pageUrl: pageUrl || null,
        status: "pending",
      });
      res.json(change);
    } catch (error) {
      res.status(500).json({ error: "Failed to create website change request" });
    }
  });

  app.patch("/api/workspaces/:workspaceId/website-changes/:id", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { status, adminNotes } = req.body;
      const updates: Record<string, any> = {};
      if (status) updates.status = status;
      if (adminNotes !== undefined) updates.adminNotes = adminNotes;
      const change = await storage.updateWebsiteChangeRequest(req.params.id, updates);
      if (!change) return res.status(404).json({ error: "Change request not found" });
      res.json(change);
    } catch (error) {
      res.status(500).json({ error: "Failed to update change request" });
    }
  });

  // Rank Tracker - Keywords
  app.get("/api/workspaces/:workspaceId/rank-tracker/keywords", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const keywords = await storage.getRankTrackerKeywords(req.params.workspaceId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch keywords" });
    }
  });

  app.post("/api/workspaces/:workspaceId/rank-tracker/keywords", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { keywords } = req.body;
      if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ error: "Keywords array is required" });
      }
      const keywordSet = new Set<string>(keywords.map((k: string) => k.trim().toLowerCase()).filter((k: string) => k.length > 0));
      const cleaned = Array.from(keywordSet);
      if (cleaned.length === 0) {
        return res.status(400).json({ error: "No valid keywords provided" });
      }
      const MAX_KEYWORDS = 1000;
      const existing = await storage.getRankTrackerKeywords(req.params.workspaceId);
      const existingSet = new Set(existing.map(e => e.keyword.toLowerCase()));
      const newKeywords = cleaned.filter(k => !existingSet.has(k));
      if (newKeywords.length === 0) {
        return res.status(400).json({ error: "All keywords already exist" });
      }
      if (existing.length + newKeywords.length > MAX_KEYWORDS) {
        return res.status(400).json({ error: `Keyword limit exceeded. You have ${existing.length} keywords and can add up to ${MAX_KEYWORDS - existing.length} more (max ${MAX_KEYWORDS}).` });
      }
      const items = newKeywords.map(k => ({ workspaceId: req.params.workspaceId, keyword: k }));
      const added = await storage.addRankTrackerKeywords(items);
      res.json({ added: added.length, keywords: added });
    } catch (error) {
      res.status(500).json({ error: "Failed to add keywords" });
    }
  });

  app.delete("/api/workspaces/:workspaceId/rank-tracker/keywords/:keywordId", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteRankTrackerKeyword(parseInt(req.params.keywordId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete keyword" });
    }
  });

  app.delete("/api/workspaces/:workspaceId/rank-tracker/keywords", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteAllRankTrackerKeywords(req.params.workspaceId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear keywords" });
    }
  });

  // Rank Tracker - Results
  app.get("/api/workspaces/:workspaceId/rank-tracker/results", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const data = await storage.getRankTrackerResults(req.params.workspaceId, page, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch results" });
    }
  });

  app.get("/api/workspaces/:workspaceId/rank-tracker/latest", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const results = await storage.getLatestRankTrackerResults(req.params.workspaceId);
      const lastCheck = await storage.getLastRankCheckDate(req.params.workspaceId);
      res.json({ results, lastCheckedAt: lastCheck });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest results" });
    }
  });

  // Rank Tracker - Check Rankings (weekly limit)
  app.post("/api/workspaces/:workspaceId/rank-tracker/check", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const lastCheck = await storage.getLastRankCheckDate(req.params.workspaceId);
      if (lastCheck) {
        const now = new Date();
        const lastCheckDate = new Date(lastCheck);
        const getMonday = (d: Date) => {
          const day = d.getDay();
          const diff = d.getDate() - day + (day === 0 ? -6 : 1);
          return new Date(d.getFullYear(), d.getMonth(), diff);
        };
        const thisMonday = getMonday(now);
        const lastMonday = getMonday(lastCheckDate);
        if (thisMonday.getTime() === lastMonday.getTime()) {
          return res.status(429).json({ 
            error: "Weekly check limit reached", 
            message: "You can check rankings once per calendar week. Next check available next Monday.",
            lastCheckedAt: lastCheck 
          });
        }
      }

      const keywords = await storage.getRankTrackerKeywords(req.params.workspaceId);
      if (keywords.length === 0) {
        return res.status(400).json({ error: "No keywords to check. Add keywords first." });
      }

      const workspace = await storage.getWorkspace(req.params.workspaceId);
      const siteUrl = workspace?.website || "";
      
      if (!siteUrl) {
        return res.status(400).json({ error: "No custom domain configured for this workspace. The Rank Tracker only works with your workspace's custom domain. Please set up a domain in your workspace settings." });
      }

      const dfsLogin = process.env.DATAFORSEO_LOGIN;
      const dfsPassword = process.env.DATAFORSEO_PASSWORD;
      
      if (!dfsLogin || !dfsPassword) {
        return res.status(503).json({ error: "Rank tracking service not configured. Please contact support." });
      }

      const previousResults = await storage.getLatestRankTrackerResults(req.params.workspaceId);
      const previousMap = new Map(previousResults.map(r => [r.keyword.toLowerCase(), r.position]));

      const checkedAt = new Date();
      const resultItems: any[] = [];
      const batchSize = 100;
      
      for (let i = 0; i < keywords.length; i += batchSize) {
        const batch = keywords.slice(i, i + batchSize);
        
        for (const kw of batch) {
          try {
            const response = await fetch("https://api.dataforseo.com/v3/serp/google/organic/live/advanced", {
              method: "POST",
              headers: {
                "Authorization": "Basic " + Buffer.from(`${dfsLogin}:${dfsPassword}`).toString("base64"),
                "Content-Type": "application/json",
              },
              body: JSON.stringify([{
                keyword: kw.keyword,
                location_code: 2840,
                language_code: "en",
                device: "desktop",
                os: "windows",
                depth: 100,
              }]),
            });

            const data = await response.json();
            
            if (data.status_code === 20000 && data.tasks?.[0]?.result?.[0]?.items) {
              const items = data.tasks[0].result[0].items;
              const targetDomain = siteUrl.replace(/https?:\/\//, "").replace(/\/$/, "").toLowerCase();
              let foundPosition: number | null = null;
              let foundUrl: string | null = null;
              
              for (const item of items) {
                if (item.type === "organic" && item.url) {
                  const itemDomain = item.url.replace(/https?:\/\//, "").replace(/\/$/, "").toLowerCase();
                  if (itemDomain.includes(targetDomain) || targetDomain.includes(itemDomain.split("/")[0])) {
                    foundPosition = item.rank_absolute;
                    foundUrl = item.url;
                    break;
                  }
                }
              }

              const prevPos = previousMap.get(kw.keyword.toLowerCase()) || null;
              
              resultItems.push({
                workspaceId: req.params.workspaceId,
                keywordId: kw.id,
                keyword: kw.keyword,
                position: foundPosition,
                previousPosition: prevPos,
                url: foundUrl,
                searchEngine: "google",
              });
            } else {
              const prevPos = previousMap.get(kw.keyword.toLowerCase()) || null;
              resultItems.push({
                workspaceId: req.params.workspaceId,
                keywordId: kw.id,
                keyword: kw.keyword,
                position: null,
                previousPosition: prevPos,
                url: null,
                searchEngine: "google",
              });
            }
          } catch (err) {
            console.error(`DataForSEO error for keyword "${kw.keyword}":`, err);
            resultItems.push({
              workspaceId: req.params.workspaceId,
              keywordId: kw.id,
              keyword: kw.keyword,
              position: null,
              previousPosition: previousMap.get(kw.keyword.toLowerCase()) || null,
              url: null,
              searchEngine: "google",
            });
          }
        }
      }

      if (resultItems.length > 0) {
        await storage.saveRankTrackerResults(resultItems);
      }

      res.json({ 
        success: true, 
        checked: resultItems.length,
        checkedAt,
        message: `Checked ${resultItems.length} keywords`
      });
    } catch (error) {
      console.error("Rank check error:", error);
      res.status(500).json({ error: "Failed to check rankings" });
    }
  });

  // Grid Keywords
  app.get("/api/workspaces/:workspaceId/grid-keywords", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const keywords = await storage.getGridKeywords(req.params.workspaceId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid keywords" });
    }
  });

  app.post("/api/workspaces/:workspaceId/grid-keywords", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { keywords, gridSize, distance } = req.body;
      if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ error: "Keywords array is required" });
      }
      const gridKeywordSet = new Set<string>(keywords.map((k: string) => k.trim().toLowerCase()).filter((k: string) => k.length > 0));
      const cleaned = Array.from(gridKeywordSet);
      if (cleaned.length === 0) {
        return res.status(400).json({ error: "No valid keywords provided" });
      }
      const MAX_GRID_KEYWORDS = 25;
      const existing = await storage.getGridKeywords(req.params.workspaceId);
      const existingSet = new Set(existing.map(e => e.keyword.toLowerCase()));
      const newKeywords = cleaned.filter(k => !existingSet.has(k));
      if (newKeywords.length === 0) {
        return res.status(400).json({ error: "All keywords already exist" });
      }
      if (existing.length + newKeywords.length > MAX_GRID_KEYWORDS) {
        return res.status(400).json({ error: `Keyword limit exceeded. You have ${existing.length} keywords and can add up to ${MAX_GRID_KEYWORDS - existing.length} more (max ${MAX_GRID_KEYWORDS}).` });
      }
      const items = newKeywords.map(k => ({
        workspaceId: req.params.workspaceId,
        keyword: k,
        gridSize: gridSize ? parseInt(gridSize) : 5,
        distance: distance || "2.0",
      }));
      const added = await storage.addGridKeywords(items);
      res.json({ added: added.length, keywords: added });
    } catch (error) {
      res.status(500).json({ error: "Failed to add grid keywords" });
    }
  });

  app.delete("/api/workspaces/:workspaceId/grid-keywords/:keywordId", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteGridKeyword(parseInt(req.params.keywordId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete grid keyword" });
    }
  });

  app.delete("/api/workspaces/:workspaceId/grid-keywords", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteAllGridKeywords(req.params.workspaceId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear grid keywords" });
    }
  });

  // Grid Refresh Credits
  app.get("/api/workspaces/:workspaceId/grid-refresh-credits", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const credits = await storage.getGridRefreshCredits(req.params.workspaceId);
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid refresh credits" });
    }
  });

  app.post("/api/workspaces/:workspaceId/grid-refresh-credits/purchase", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { amount } = req.body;
      const validPacks: Record<number, string> = { 5: "$10 — 5 scans", 25: "$35 — 25 scans (best value)" };
      if (!amount || typeof amount !== "number" || !validPacks[amount]) {
        return res.status(400).json({ error: "Invalid credit pack. Choose 5 or 25 scans." });
      }
      const credits = await storage.addGridRefreshCredits(req.params.workspaceId, amount, `Purchased ${validPacks[amount]}`);
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to purchase credits" });
    }
  });

  app.post("/api/workspaces/:workspaceId/grid-refresh-credits/use", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const result = await storage.useGridRefreshCredit(req.params.workspaceId);
      if (!result.success) {
        return res.status(402).json({ error: "No credits remaining. Purchase additional scans to continue.", balance: 0 });
      }
      res.json({ ...result, type: "credit" });
    } catch (error) {
      res.status(500).json({ error: "Failed to use refresh credit" });
    }
  });

  app.post("/api/workspaces/:workspaceId/grid-scan", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const workspace = await storage.getWorkspace(req.params.workspaceId);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      if (!workspace.latitude || !workspace.longitude) {
        return res.status(400).json({ error: "Workspace has no coordinates set. Please update your workspace address with latitude and longitude." });
      }

      const gridKeywordsList = await storage.getGridKeywords(req.params.workspaceId);
      if (gridKeywordsList.length === 0) {
        return res.status(400).json({ error: "No grid keywords to scan. Add keywords first." });
      }

      const dfsLogin = process.env.DATAFORSEO_LOGIN;
      const dfsPassword = process.env.DATAFORSEO_PASSWORD;

      if (!dfsLogin || !dfsPassword) {
        return res.status(503).json({ error: "Grid scanning service not configured. Please contact support." });
      }

      const centerLat = parseFloat(workspace.latitude as string);
      const centerLng = parseFloat(workspace.longitude as string);
      const gridSize = 5;
      const distanceMiles = parseFloat(gridKeywordsList[0]?.distance as string) || 2;

      const degreesPerMile = 1 / 69.0;
      const offset = distanceMiles * degreesPerMile;
      const halfGrid = Math.floor(gridSize / 2);

      const gridCoords: { lat: number; lng: number; index: number }[] = [];
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const lat = centerLat + (halfGrid - row) * offset;
          const lng = centerLng + (col - halfGrid) * offset;
          gridCoords.push({ lat, lng, index: row * gridSize + col });
        }
      }

      const allResults: any[] = [];
      const wsName = workspace.name.toLowerCase();
      const wsWebsite = (workspace.website || "").replace(/https?:\/\//, "").replace(/\/$/, "").toLowerCase();
      const authHeader = "Basic " + Buffer.from(`${dfsLogin}:${dfsPassword}`).toString("base64");

      const scanPoint = async (keyword: string, point: { lat: number; lng: number; index: number }) => {
        try {
          const response = await fetch("https://api.dataforseo.com/v3/serp/google/maps/live/advanced", {
            method: "POST",
            headers: {
              "Authorization": authHeader,
              "Content-Type": "application/json",
            },
            body: JSON.stringify([{
              keyword,
              location_coordinate: `${point.lat.toFixed(7)},${point.lng.toFixed(7)},15z`,
              language_code: "en",
              device: "desktop",
              os: "windows",
              depth: 20,
            }]),
          });

          if (!response.ok) {
            console.error(`DataForSEO HTTP error: ${response.status} for keyword "${keyword}" at ${point.lat},${point.lng}`);
            return { rank: null as number | null, businessName: null as string | null, error: true };
          }

          const data = await response.json();

          if (data.status_code !== 20000) {
            console.error(`DataForSEO API error: ${data.status_code} ${data.status_message} for keyword "${keyword}"`);
            return { rank: null as number | null, businessName: null as string | null, error: true };
          }

          let rank: number | null = null;
          let businessName: string | null = null;
          const items = data.tasks?.[0]?.result?.[0]?.items || [];

          for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type === "maps_search" && item.title) {
              const itemTitle = item.title.toLowerCase();
              const itemDomain = (item.domain || "").toLowerCase();

              if (
                itemTitle.includes(wsName) ||
                wsName.includes(itemTitle) ||
                (wsWebsite && itemDomain.includes(wsWebsite))
              ) {
                rank = item.rank_absolute || (i + 1);
                businessName = item.title;
                break;
              }
            }
          }

          return { rank, businessName, error: false };
        } catch (err) {
          console.error(`DataForSEO request failed for keyword "${keyword}":`, err);
          return { rank: null as number | null, businessName: null as string | null, error: true };
        }
      };

      let totalErrors = 0;

      for (const kw of gridKeywordsList) {
        const concurrency = 5;
        const keywordResults: any[] = new Array(gridCoords.length);

        for (let batch = 0; batch < gridCoords.length; batch += concurrency) {
          const chunk = gridCoords.slice(batch, batch + concurrency);
          const results = await Promise.all(
            chunk.map(async (point) => {
              const result = await scanPoint(kw.keyword, point);
              if (result.error) totalErrors++;
              return {
                workspaceId: req.params.workspaceId,
                keyword: kw.keyword,
                gridSize,
                gridIndex: point.index,
                latitude: point.lat.toFixed(7),
                longitude: point.lng.toFixed(7),
                rank: result.rank,
                businessName: result.businessName,
              };
            })
          );
          results.forEach(r => { keywordResults[r.gridIndex] = r; });
        }

        allResults.push(...keywordResults.filter(Boolean));
      }

      if (totalErrors > 0 && totalErrors === gridCoords.length * gridKeywordsList.length) {
        return res.status(502).json({ error: "All grid scan requests failed. Please check your DataForSEO credentials or try again later." });
      }

      const saved = await storage.saveGridScanResults(allResults);
      res.json({ success: true, totalPoints: allResults.length, keywords: gridKeywordsList.length, gridSize, results: saved });
    } catch (error) {
      console.error("Grid scan error:", error);
      res.status(500).json({ error: "Failed to run grid scan" });
    }
  });

  app.get("/api/workspaces/:workspaceId/grid-scan-results/:keyword", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const results = await storage.getLatestGridScanResults(req.params.workspaceId, decodeURIComponent(req.params.keyword));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid scan results" });
    }
  });

  app.get("/api/workspaces/:workspaceId/grid-scan-keywords", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const keywords = await storage.getGridScanKeywords(req.params.workspaceId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scanned keywords" });
    }
  });

  app.get("/api/workspaces/:workspaceId/grid-refresh-history", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const history = await storage.getGridRefreshHistory(req.params.workspaceId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch refresh history" });
    }
  });

  // Rank Tracker Credits
  app.get("/api/workspaces/:workspaceId/rank-tracker-credits", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const credits = await storage.getRankTrackerCredits(req.params.workspaceId);
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rank tracker credits" });
    }
  });

  app.post("/api/workspaces/:workspaceId/rank-tracker-credits/purchase", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { amount } = req.body;
      if (!amount || typeof amount !== "number" || amount < 1) {
        return res.status(400).json({ error: "Valid amount is required" });
      }
      const credits = await storage.addRankTrackerCredits(req.params.workspaceId, amount, `Purchased ${amount} rank check credits`);
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to purchase credits" });
    }
  });

  app.post("/api/workspaces/:workspaceId/rank-tracker-credits/use", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const result = await storage.useRankTrackerCredit(req.params.workspaceId);
      if (!result.success) {
        return res.status(402).json({ error: "No rank check credits remaining. Purchase more to continue.", balance: 0 });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to use rank check credit" });
    }
  });

  app.get("/api/workspaces/:workspaceId/rank-tracker-history", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const history = await storage.getRankTrackerHistory(req.params.workspaceId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rank tracker history" });
    }
  });

  // SEO Settings
  app.get("/api/workspaces/:workspaceId/seo-settings", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const settings = await storage.getSeoSettings(req.params.workspaceId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch SEO settings" });
    }
  });

  app.post("/api/workspaces/:workspaceId/seo-settings", async (req, res) => {
    try {
      if (!await authorizeWorkspaceAccess(req, req.params.workspaceId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { provider, apiKey, apiLogin, apiPassword, siteUrl, isConnected } = req.body;
      if (!provider) return res.status(400).json({ error: "Provider is required" });
      const settings = await storage.upsertSeoSettings({
        workspaceId: req.params.workspaceId,
        provider,
        apiKey: apiKey || null,
        apiLogin: apiLogin || null,
        apiPassword: apiPassword || null,
        siteUrl: siteUrl || null,
        isConnected: isConnected ?? false,
      });
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to save SEO settings" });
    }
  });

  const widgetRateLimit = new Map<string, { count: number; resetAt: number }>();
  const WIDGET_RATE_LIMIT = 20;
  const WIDGET_RATE_WINDOW = 60 * 1000;

  app.post("/api/widget/:workspaceId/chat", async (req, res) => {
    try {
      const { workspaceId } = req.params;
      const { message, history, sessionId, channel } = req.body;

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (message.length > 1000) {
        return res.status(400).json({ error: "Message too long" });
      }

      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      const rateLimitKey = `${clientIp}:${workspaceId}`;
      const now = Date.now();
      const rateEntry = widgetRateLimit.get(rateLimitKey);

      if (rateEntry && now < rateEntry.resetAt) {
        if (rateEntry.count >= WIDGET_RATE_LIMIT) {
          return res.status(429).json({ error: "Too many requests. Please try again shortly." });
        }
        rateEntry.count++;
      } else {
        widgetRateLimit.set(rateLimitKey, { count: 1, resetAt: now + WIDGET_RATE_WINDOW });
      }

      const workspace = await storage.getWorkspace(workspaceId);
      if (!workspace) {
        return res.status(404).json({ error: "Workspace not found" });
      }

      const widgetSettings = await storage.getWidgetSettings(workspaceId);
      if (widgetSettings && !widgetSettings.isEnabled) {
        return res.status(403).json({ error: "Widget is not enabled for this workspace" });
      }

      const knowledgeBase = await storage.getKnowledgeBaseItems(workspaceId);
      const systemPrompt = buildWidgetSystemPrompt(
        workspace.name,
        workspace.type || "agency",
        knowledgeBase,
        widgetSettings?.welcomeMessage
      );

      const conversationHistory: Array<{ role: string; content: string }> = [];
      if (Array.isArray(history)) {
        for (const msg of history.slice(-10)) {
          if (msg.role && msg.content && typeof msg.content === "string") {
            conversationHistory.push({
              role: msg.role === "user" ? "user" : "assistant",
              content: msg.content.slice(0, 1000),
            });
          }
        }
      }

      const aiReply = await getAiResponse(workspaceId, systemPrompt, message.trim(), conversationHistory);

      if (sessionId && typeof sessionId === "string") {
        try {
          const existingLog = await storage.updateWidgetChatLogMessageCount(sessionId);
          if (!existingLog) {
            await storage.createWidgetChatLog({
              workspaceId,
              sessionId,
              visitorIp: clientIp,
              messageCount: 1,
              firstMessage: message.trim().slice(0, 200),
              channel: channel === "voice" ? "voice" : "text",
            });
          }
        } catch (logError: any) {
          console.error("[Widget Chat] Failed to log interaction:", logError.message);
        }
      }

      res.json({ reply: aiReply });
    } catch (error: any) {
      console.error("[Widget Chat] Error:", error.message);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // ═══════════════════════════════════════════════════
  // Content Engine: Pages (workspaceSitePages table)
  // ═══════════════════════════════════════════════════
  app.get("/api/site-pages/:workspaceId", async (req, res) => {
    try {
      const pages = await storage.getSitePages(req.params.workspaceId);
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.get("/api/site-pages/detail/:id", async (req, res) => {
    try {
      const page = await storage.getSitePage(Number(req.params.id));
      if (!page) return res.status(404).json({ error: "Page not found" });
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.post("/api/site-pages", async (req, res) => {
    try {
      const { workspaceId, title, slug, description, content, template, metaTitle, metaDescription } = req.body;
      if (!workspaceId || !title) return res.status(400).json({ error: "workspaceId and title are required" });
      const pageSlug = slug || `/${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
      const page = await storage.createSitePage({
        workspaceId,
        title,
        slug: pageSlug,
        description: description || "",
        content: content || "",
        template: template || "default",
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description || "",
      });
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to create page" });
    }
  });

  app.put("/api/site-pages/:id", async (req, res) => {
    try {
      const page = await storage.updateSitePage(Number(req.params.id), req.body);
      if (!page) return res.status(404).json({ error: "Page not found" });
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/site-pages/:id", protectPseoManagedPages, async (req, res) => {
    try {
      const deleted = await storage.deleteSitePage(Number(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Page not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete page" });
    }
  });

  // ═══════════════════════════════════════════════════
  // Content Engine: SEO Profile
  // ═══════════════════════════════════════════════════

  setInterval(() => {
    const now = Date.now();
    const keys = Array.from(widgetRateLimit.keys());
    for (const key of keys) {
      const entry = widgetRateLimit.get(key);
      if (entry && now >= entry.resetAt) {
        widgetRateLimit.delete(key);
      }
    }
  }, 60 * 1000);

  setInterval(async () => {
    try {
      await runScheduledPublisher();
    } catch (err) {
      console.error('[Scheduler] runScheduledPublisher tick failed:', err);
    }
  }, 5 * 60 * 1000);

  registerTwilioWebhooks(app);
  registerCrmRoutes(app);
  registerContentRoutes(app);
  registerPseoPageRoutes(app);
  app.use("/api/pseo/template", pseoTemplateRouter);
  app.use("/api/pseo/locations", pseoLocationsRouter);
  app.use("/api/pseo/keywords", pseoKeywordsRouter);
  app.use("/api/pseo/campaigns", pseoCampaignsRouter);
  app.use("/api/pseo", pseoCampaignsRouter);
  app.use("/api/pseo", pseoReviewRouter);

  return httpServer;
}
