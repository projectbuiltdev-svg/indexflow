import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { InsertRoomBooking } from "@shared/schema";
import { insertSupportTicketSchema } from "@shared/schema";
import { getAiResponse, buildWidgetSystemPrompt } from "./ai-chat";
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

async function authorizeVenueAccess(req: Request, venueId: string): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    const venue = await storage.getVenue(venueId);
    return !!venue;
  }
  const userId = (req as any).user?.id;
  if (!userId) return false;
  const venue = await storage.getVenue(venueId);
  if (!venue) return false;
  if (venue.ownerId === userId) return true;
  const teamMember = await storage.getTeamMemberByUserAndVenue(userId, venueId);
  return !!teamMember;
}

import { 
  insertContactMessageSchema,
  insertVenueSchema,
  insertReservationSchema,
  insertBusinessHoursSchema,
  insertClosureSchema,
  insertResourceSchema,
  insertTeamMemberSchema,
  insertKnowledgeBaseItemSchema,
  insertWidgetSettingsSchema,
  insertTwilioSettingsSchema,
  insertPaymentSettingsSchema,
  insertAiProviderSettingsSchema,
  insertRoomTypeSchema,
  insertRoomSchema,
  insertRoomBookingSchema,
} from "@shared/schema";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerTwilioWebhooks } from "./twilio-webhooks";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get("/api/db-dump", (_req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ error: "Not available in production" });
    }
    const dumpPath = path.resolve("resto_database_dump.sql");
    if (!fs.existsSync(dumpPath)) {
      return res.status(404).send("Dump file not found");
    }
    const content = fs.readFileSync(dumpPath, "utf-8");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(content);
  });

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

  app.get("/api/blog/posts", async (_req, res) => {
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

  app.get("/api/blog/posts/:category/:slug", async (req, res) => {
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
  app.get("/api/venues/:venueId/support-tickets", async (req, res) => {
    try {
      const { venueId } = req.params;
      if (process.env.NODE_ENV === "production") {
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        const authorized = await authorizeVenueAccess(req, venueId);
        if (!authorized) return res.status(403).json({ error: "Forbidden" });
      }
      
      const tickets = await storage.getSupportTicketsByVenue(venueId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.post("/api/venues/:venueId/support-tickets", async (req, res) => {
    try {
      const { venueId } = req.params;
      const userId = (req as any).user?.id || "dev-user";
      if (process.env.NODE_ENV === "production") {
        if (!userId || userId === "dev-user") return res.status(401).json({ error: "Unauthorized" });
        const authorized = await authorizeVenueAccess(req, venueId);
        if (!authorized) return res.status(403).json({ error: "Forbidden" });
      }

      const validatedData = insertSupportTicketSchema.parse({
        ...req.body,
        venueId,
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

  // Venues
  app.get("/api/venues", async (req, res) => {
    try {
      if (process.env.NODE_ENV !== "production") {
        const venues = await storage.getVenues();
        return res.json(venues);
      }
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });
      const venues = await storage.getVenuesByOwner(userId);
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch venues" });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.id)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const venue = await storage.getVenue(req.params.id);
      if (!venue) return res.status(404).json({ error: "Venue not found" });
      res.json(venue);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch venue" });
    }
  });

  app.post("/api/venues", async (req, res) => {
    try {
      const userId = (req as any).user?.id || "dev-user";
      if (process.env.NODE_ENV === "production" && (!userId || userId === "dev-user")) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const validatedData = insertVenueSchema.parse({ ...req.body, ownerId: userId });
      const venue = await storage.createVenue(validatedData);
      res.status(201).json(venue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid venue data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create venue" });
    }
  });

  app.patch("/api/venues/:id", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.id)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const venue = await storage.updateVenue(req.params.id, req.body);
      if (!venue) return res.status(404).json({ error: "Venue not found" });
      res.json(venue);
    } catch (error) {
      res.status(500).json({ error: "Failed to update venue" });
    }
  });

  app.delete("/api/venues/:id", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.id)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const deleted = await storage.deleteVenue(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Venue not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete venue" });
    }
  });

  // Reservations
  app.get("/api/venues/:venueId/reservations", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { date } = req.query;
      const reservations = date
        ? await storage.getReservationsByDate(req.params.venueId, date as string)
        : await storage.getReservations(req.params.venueId);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  });

  app.get("/api/reservations/:id", async (req, res) => {
    try {
      const reservation = await storage.getReservation(req.params.id);
      if (!reservation) return res.status(404).json({ error: "Reservation not found" });
      if (!await authorizeVenueAccess(req, reservation.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reservation" });
    }
  });

  app.post("/api/venues/:venueId/reservations", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertReservationSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
        date: normalizeISODate(req.body.date),
        time: normalizeTime(req.body.time),
      });
      const reservation = await storage.createReservation(validatedData);
      res.status(201).json(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid reservation data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create reservation" });
    }
  });

  app.patch("/api/reservations/:id", async (req, res) => {
    try {
      const reservation = await storage.getReservation(req.params.id);
      if (!reservation) return res.status(404).json({ error: "Reservation not found" });
      if (!await authorizeVenueAccess(req, reservation.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const updates = { ...req.body };
      if (updates.date) updates.date = normalizeISODate(updates.date);
      if (updates.time) updates.time = normalizeTime(updates.time);
      const updated = await storage.updateReservation(req.params.id, updates);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update reservation" });
    }
  });

  app.delete("/api/reservations/:id", async (req, res) => {
    try {
      const reservation = await storage.getReservation(req.params.id);
      if (!reservation) return res.status(404).json({ error: "Reservation not found" });
      if (!await authorizeVenueAccess(req, reservation.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteReservation(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete reservation" });
    }
  });

  // Business Hours
  app.get("/api/venues/:venueId/hours", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const hours = await storage.getBusinessHours(req.params.venueId);
      res.json(hours);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch business hours" });
    }
  });

  app.put("/api/venues/:venueId/hours", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const hoursArray = z.array(insertBusinessHoursSchema).parse(req.body);
      const hours = await storage.setBusinessHours(req.params.venueId, hoursArray);
      res.json(hours);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid hours data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update business hours" });
    }
  });

  // Closures
  app.get("/api/venues/:venueId/closures", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const closures = await storage.getClosures(req.params.venueId);
      res.json(closures);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch closures" });
    }
  });

  app.post("/api/venues/:venueId/closures", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertClosureSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
      });
      const closure = await storage.createClosure(validatedData);
      res.status(201).json(closure);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid closure data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create closure" });
    }
  });

  app.delete("/api/closures/:id", async (req, res) => {
    try {
      const closure = await storage.getClosure(parseInt(req.params.id));
      if (!closure) return res.status(404).json({ error: "Closure not found" });
      if (!await authorizeVenueAccess(req, closure.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteClosure(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete closure" });
    }
  });

  // Resources
  app.get("/api/venues/:venueId/resources", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const resources = await storage.getResources(req.params.venueId);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  app.post("/api/venues/:venueId/resources", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertResourceSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
      });
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid resource data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create resource" });
    }
  });

  app.patch("/api/resources/:id", async (req, res) => {
    try {
      const resource = await storage.getResource(req.params.id);
      if (!resource) return res.status(404).json({ error: "Resource not found" });
      if (!await authorizeVenueAccess(req, resource.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const updated = await storage.updateResource(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update resource" });
    }
  });

  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const resource = await storage.getResource(req.params.id);
      if (!resource) return res.status(404).json({ error: "Resource not found" });
      if (!await authorizeVenueAccess(req, resource.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteResource(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete resource" });
    }
  });

  // Team Members
  app.get("/api/venues/:venueId/team", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const members = await storage.getTeamMembers(req.params.venueId);
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team members" });
    }
  });

  app.post("/api/venues/:venueId/team", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertTeamMemberSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
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
      if (!await authorizeVenueAccess(req, member.venueId)) {
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
      if (!await authorizeVenueAccess(req, member.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteTeamMember(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete team member" });
    }
  });

  // Knowledge Base
  app.get("/api/venues/:venueId/knowledge-base", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const items = await storage.getKnowledgeBaseItems(req.params.venueId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge base items" });
    }
  });

  app.post("/api/venues/:venueId/knowledge-base", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertKnowledgeBaseItemSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
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
      if (!await authorizeVenueAccess(req, item.venueId)) {
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
      if (!await authorizeVenueAccess(req, item.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteKnowledgeBaseItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete knowledge base item" });
    }
  });

  // Call Logs
  app.get("/api/venues/:venueId/calls", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const logs = await storage.getCallLogs(req.params.venueId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch call logs" });
    }
  });

  app.get("/api/calls/:id", async (req, res) => {
    try {
      const log = await storage.getCallLog(req.params.id);
      if (!log) return res.status(404).json({ error: "Call log not found" });
      if (!await authorizeVenueAccess(req, log.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch call log" });
    }
  });

  // Widget Settings
  app.get("/api/venues/:venueId/widget-settings", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const settings = await storage.getWidgetSettings(req.params.venueId);
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch widget settings" });
    }
  });

  app.put("/api/venues/:venueId/widget-settings", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertWidgetSettingsSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
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
  app.get("/api/venues/:venueId/twilio-settings", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const settings = await storage.getTwilioSettings(req.params.venueId);
      if (settings) {
        res.json({ ...settings, authToken: settings.authToken ? "***" : null });
      } else {
        res.json({});
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Twilio settings" });
    }
  });

  app.put("/api/venues/:venueId/twilio-settings", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertTwilioSettingsSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
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
  app.get("/api/venues/:venueId/payment-settings", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const settings = await storage.getPaymentSettings(req.params.venueId);
      if (settings) {
        res.json({
          ...settings,
          stripeSecretKey: settings.stripeSecretKey ? "***" : null,
          paypalClientSecret: settings.paypalClientSecret ? "***" : null,
        });
      } else {
        res.json({});
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment settings" });
    }
  });

  app.put("/api/venues/:venueId/payment-settings", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertPaymentSettingsSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
      });
      const settings = await storage.upsertPaymentSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid payment settings", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update payment settings" });
    }
  });

  // AI Provider Settings
  app.get("/api/venues/:venueId/ai-providers", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const settings = await storage.getAiProviderSettings(req.params.venueId);
      const masked = settings.map((s) => ({
        ...s,
        apiKey: s.apiKey ? "***" : null,
      }));
      res.json(masked);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI provider settings" });
    }
  });

  app.put("/api/venues/:venueId/ai-providers", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertAiProviderSettingsSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
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

  // Admin auth middleware - protects all /api/admin/* routes in production
  const requireAdminAuth = (req: any, res: any, next: any) => {
    if (process.env.NODE_ENV === "production") {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  // Admin Settings
  app.get("/api/admin/settings/:key", requireAdminAuth, async (req, res) => {
    try {
      const setting = await storage.getAdminSetting(req.params.key);
      res.json(setting || {});
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin setting" });
    }
  });

  app.put("/api/admin/settings/:key", requireAdminAuth, async (req, res) => {
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

  app.get("/api/admin/support-tickets", requireAdminAuth, async (req, res) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch support tickets" });
    }
  });

  app.get("/api/admin/support-tickets/:id", requireAdminAuth, async (req, res) => {
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

  app.patch("/api/admin/support-tickets/:id", requireAdminAuth, async (req, res) => {
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
  app.get("/api/admin/venues", requireAdminAuth, async (req, res) => {
    try {
      const venues = await storage.getVenues();
      res.json(venues);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch venues" });
    }
  });

  app.get("/api/admin/call-logs", requireAdminAuth, async (req, res) => {
    try {
      const venues = await storage.getVenues();
      const allLogs: any[] = [];
      for (const venue of venues) {
        const logs = await storage.getCallLogs(venue.id);
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

  app.get("/api/admin/widget-settings", requireAdminAuth, async (req, res) => {
    try {
      const venues = await storage.getVenues();
      const allSettings: any[] = [];
      for (const venue of venues) {
        const settings = await storage.getWidgetSettings(venue.id);
        if (settings) allSettings.push(settings);
      }
      res.json(allSettings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch widget settings" });
    }
  });

  app.get("/api/admin/blog/posts", requireAdminAuth, async (req, res) => {
    try {
      const venueId = req.query.venueId as string;
      if (!venueId) return res.json([]);
      const posts = await storage.getVenueBlogPosts(venueId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog/posts", requireAdminAuth, async (req, res) => {
    try {
      const post = await storage.createVenueBlogPost(req.body);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/posts/:id", requireAdminAuth, async (req, res) => {
    try {
      const post = await storage.updateVenueBlogPost(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/posts/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteVenueBlogPost(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  app.post("/api/admin/blog/posts/:id/publish-now", requireAdminAuth, async (req, res) => {
    try {
      const post = await storage.updateVenueBlogPost(req.params.id, { status: "published", publishedAt: new Date() });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to publish post" });
    }
  });

  app.post("/api/admin/blog/posts/:id/schedule", requireAdminAuth, async (req, res) => {
    try {
      const post = await storage.updateVenueBlogPost(req.params.id, { status: "scheduled", publishAt: new Date(req.body.publishAt) });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to schedule post" });
    }
  });

  app.get("/api/admin/blog/posts/campaign/:venueId/:campaignId", requireAdminAuth, async (req, res) => {
    try {
      const posts = await storage.getVenueBlogPostsByCampaign(req.params.venueId, req.params.campaignId);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaign posts" });
    }
  });

  app.get("/api/admin/blog/domains", requireAdminAuth, async (req, res) => {
    try {
      const venueId = req.query.venueId as string;
      if (!venueId) return res.json([]);
      const domains = await storage.getVenueDomains(venueId);
      res.json(domains);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch domains" });
    }
  });

  app.post("/api/admin/blog/domains", requireAdminAuth, async (req, res) => {
    try {
      const domain = await storage.createVenueDomain(req.body);
      res.json(domain);
    } catch (error) {
      res.status(500).json({ error: "Failed to create domain" });
    }
  });

  app.delete("/api/admin/blog/domains/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteVenueDomain(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete domain" });
    }
  });

  app.patch("/api/admin/blog/domains/:id", requireAdminAuth, async (req, res) => {
    try {
      const domain = await storage.updateVenueDomain(req.params.id, req.body);
      res.json(domain);
    } catch (error) {
      res.status(500).json({ error: "Failed to update domain" });
    }
  });

  app.get("/api/admin/blog/campaigns/:venueId", requireAdminAuth, async (req, res) => {
    try {
      const campaigns = await storage.getVenueCampaigns(req.params.venueId);
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/admin/assets/search", requireAdminAuth, async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      res.status(500).json({ error: "Failed to search assets" });
    }
  });

  app.post("/api/admin/assets/save", requireAdminAuth, async (req, res) => {
    try {
      res.json({ id: Date.now(), ...req.body });
    } catch (error) {
      res.status(500).json({ error: "Failed to save asset" });
    }
  });

  app.post("/api/admin/blog/posts/bulk/create", requireAdminAuth, async (req, res) => {
    try {
      const posts = req.body.posts || [];
      const created = [];
      for (const post of posts) {
        const result = await storage.createVenueBlogPost(post);
        created.push(result);
      }
      res.json(created);
    } catch (error) {
      res.status(500).json({ error: "Failed to create bulk posts" });
    }
  });

  app.post("/api/admin/blog/posts/bulk/generate", requireAdminAuth, async (req, res) => {
    try {
      res.json({ message: "Content generation is not available in this environment" });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  app.post("/api/admin/content/preview", requireAdminAuth, async (req, res) => {
    try {
      const mdx = req.body.mdx || "";
      if (!mdx.trim()) return res.json({ html: "", errors: [] });

      const errors: string[] = [];
      let html = mdx;

      html = html.replace(/<BlogImage\s+([^>]*)\/?>/g, (_match: string, attrs: string) => {
        const src = attrs.match(/src="([^"]*)"/)?.[1] || "";
        const alt = attrs.match(/alt="([^"]*)"/)?.[1] || "";
        const credit = attrs.match(/credit="([^"]*)"/)?.[1] || "";
        const creditUrl = attrs.match(/creditUrl="([^"]*)"/)?.[1] || "";
        let figcaption = "";
        if (credit) {
          const creditHtml = creditUrl
            ? `<span class="credit">Image by <a href="${creditUrl}" target="_blank" rel="noopener">${credit}</a></span>`
            : `<span class="credit">Image by ${credit}</span>`;
          figcaption = `<figcaption>${creditHtml}</figcaption>`;
        }
        return `<figure class="blog-image"><img src="${src}" alt="${alt}" loading="lazy" />${figcaption}</figure>`;
      });

      html = html.replace(/<CallToAction\s+([^>]*)\/?>/g, (_match: string, attrs: string) => {
        const text = attrs.match(/(?:text|title)="([^"]*)"/)?.[1] || "Learn More";
        const href = attrs.match(/href="([^"]*)"/)?.[1] || "#";
        return `<div class="cta-block"><a href="${href}" class="cta-button">${text}</a></div>`;
      });

      html = html.replace(/<\/?(?:import|export)\s[^>]*>/g, "");
      html = html.replace(/^import\s.*$/gm, "");
      html = html.replace(/^export\s.*$/gm, "");

      const lines = html.split("\n");
      const result: string[] = [];
      let inList = false;
      let listType = "";

      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.match(/^#{1,6}\s/)) {
          if (inList) { result.push(listType === "ol" ? "</ol>" : "</ul>"); inList = false; }
          const level = line.match(/^(#{1,6})\s/)![1].length;
          const text = line.replace(/^#{1,6}\s+/, "");
          result.push(`<h${level}>${processInline(text)}</h${level}>`);
          continue;
        }

        if (line.match(/^---\s*$/)) {
          if (inList) { result.push(listType === "ol" ? "</ol>" : "</ul>"); inList = false; }
          result.push("<hr />");
          continue;
        }

        if (line.match(/^\d+\.\s/)) {
          if (!inList || listType !== "ol") {
            if (inList) result.push(listType === "ol" ? "</ol>" : "</ul>");
            result.push("<ol>");
            inList = true;
            listType = "ol";
          }
          const text = line.replace(/^\d+\.\s+/, "");
          result.push(`<li>${processInline(text)}</li>`);
          continue;
        }

        if (line.match(/^[-*]\s/)) {
          if (!inList || listType !== "ul") {
            if (inList) result.push(listType === "ol" ? "</ol>" : "</ul>");
            result.push("<ul>");
            inList = true;
            listType = "ul";
          }
          const text = line.replace(/^[-*]\s+/, "");
          result.push(`<li>${processInline(text)}</li>`);
          continue;
        }

        if (inList && line.trim() === "") {
          result.push(listType === "ol" ? "</ol>" : "</ul>");
          inList = false;
          continue;
        }

        if (line.startsWith("<")) {
          if (inList) { result.push(listType === "ol" ? "</ol>" : "</ul>"); inList = false; }
          result.push(line);
          continue;
        }

        if (line.trim() === "") {
          continue;
        }

        if (inList) { result.push(listType === "ol" ? "</ol>" : "</ul>"); inList = false; }
        result.push(`<p>${processInline(line)}</p>`);
      }

      if (inList) result.push(listType === "ol" ? "</ol>" : "</ul>");
      html = result.join("\n");

      res.json({ html, errors });
    } catch (error) {
      res.status(500).json({ error: "Failed to preview content" });
    }
  });

  function processInline(text: string): string {
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
    text = text.replace(/`(.+?)`/g, "<code>$1</code>");
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return text;
  }

  // Old-style rank-keywords / grid-keywords endpoints (used by admin SEO pages)
  app.get("/api/rank-keywords", async (req, res) => {
    try {
      const venueId = req.query.venueId as string;
      if (!venueId) return res.json([]);
      const keywords = await storage.getRankTrackerKeywords(venueId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rank keywords" });
    }
  });

  app.post("/api/rank-keywords", async (req, res) => {
    try {
      const { venueId, keyword } = req.body;
      const kws = await storage.addRankTrackerKeywords([{ venueId, keyword }]);
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
      const venueId = req.query.venueId as string;
      if (!venueId) return res.json([]);
      const results = await storage.getRankTrackerResults(venueId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rank results" });
    }
  });

  app.get("/api/grid-keywords", async (req, res) => {
    try {
      const venueId = req.query.venueId as string;
      if (!venueId) return res.json([]);
      const keywords = await storage.getGridKeywords(venueId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid keywords" });
    }
  });

  app.post("/api/grid-keywords", async (req, res) => {
    try {
      const { venueId, keyword } = req.body;
      const kws = await storage.addGridKeywords([{ venueId, keyword }]);
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
      const venueId = req.query.venueId as string;
      if (!venueId) return res.json([]);
      const keywords = await storage.getGridKeywords(venueId);
      if (keywords.length === 0) return res.json([]);
      const results = await storage.getLatestGridScanResults(venueId, keywords[0].keyword);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid scan results" });
    }
  });

  app.get("/api/knowledge-base", async (req, res) => {
    try {
      const venueId = req.query.venueId as string;
      if (!venueId) return res.json([]);
      const items = await storage.getKnowledgeBaseItems(venueId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch knowledge base" });
    }
  });

  app.get("/api/contact-messages", async (req, res) => {
    try {
      const venueId = req.query.venueId as string;
      if (venueId) {
        if (!(await authorizeVenueAccess(req, venueId))) {
          return res.status(403).json({ error: "Forbidden" });
        }
        const messages = await storage.getContactMessages();
        return res.json(messages.filter((m: any) => m.venueId === venueId));
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

  app.get("/api/reservations", async (req, res) => {
    try {
      const venueId = req.query.venueId as string;
      if (!venueId) return res.json([]);
      if (!(await authorizeVenueAccess(req, venueId))) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const date = req.query.date as string;
      if (date) {
        const reservations = await storage.getReservationsByDate(venueId, date);
        return res.json(reservations);
      }
      const reservations = await storage.getReservations(venueId);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  });

  app.get("/api/calls", async (req, res) => {
    try {
      const venueId = req.query.venueId as string;
      if (!venueId) return res.json([]);
      if (!(await authorizeVenueAccess(req, venueId))) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const calls = await storage.getCallLogs(venueId);
      res.json(calls);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch calls" });
    }
  });

  app.get("/api/admin/reservations", requireAdminAuth, async (req, res) => {
    try {
      const venues = await storage.getVenues();
      const allReservations: any[] = [];
      for (const venue of venues) {
        const reservations = await storage.getReservations(venue.id);
        allReservations.push(...reservations);
      }
      allReservations.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
      res.json(allReservations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reservations" });
    }
  });

  app.get("/api/public/blog/posts", async (req, res) => {
    try {
      const domain = req.query.domain as string;
      if (!domain) return res.json({ blogTemplate: "editorial", accentColor: null, accentForeground: null, posts: [] });
      const domainRecord = await storage.getVenueDomainByDomain(domain);
      if (!domainRecord) return res.json({ blogTemplate: "editorial", accentColor: null, accentForeground: null, posts: [] });
      const venue = await storage.getVenue(domainRecord.venueId);
      const posts = await storage.getVenueBlogPosts(domainRecord.venueId, "published");
      res.json({
        blogTemplate: (venue as any)?.blogTemplate || "editorial",
        accentColor: (venue as any)?.accentColor || null,
        accentForeground: (venue as any)?.accentForeground || null,
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
      const domainRecord = await storage.getVenueDomainByDomain(domain);
      if (!domainRecord) return res.status(404).json({ error: "Domain not found" });
      const posts = await storage.getVenueBlogPosts(domainRecord.venueId, "published");
      const post = posts.find(p => p.slug === slug);
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Room Types
  app.get("/api/venues/:venueId/room-types", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const roomTypes = await storage.getRoomTypes(req.params.venueId);
      res.json(roomTypes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room types" });
    }
  });

  app.get("/api/venues/:venueId/room-types/:id", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const roomType = await storage.getRoomType(req.params.id);
      if (!roomType || roomType.venueId !== req.params.venueId) {
        return res.status(404).json({ error: "Room type not found" });
      }
      res.json(roomType);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room type" });
    }
  });

  app.post("/api/venues/:venueId/room-types", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertRoomTypeSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
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
      if (!await authorizeVenueAccess(req, existing.venueId)) {
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
      if (!await authorizeVenueAccess(req, existing.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteRoomType(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete room type" });
    }
  });

  // Rooms
  app.get("/api/venues/:venueId/rooms", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const rooms = await storage.getRooms(req.params.venueId);
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  });

  app.get("/api/venues/:venueId/rooms/:id", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const room = await storage.getRoom(req.params.id);
      if (!room || room.venueId !== req.params.venueId) {
        return res.status(404).json({ error: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room" });
    }
  });

  app.post("/api/venues/:venueId/rooms", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const validatedData = insertRoomSchema.parse({
        ...req.body,
        venueId: req.params.venueId,
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
      if (!await authorizeVenueAccess(req, existing.venueId)) {
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
      if (!await authorizeVenueAccess(req, existing.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteRoom(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete room" });
    }
  });

  // Room Bookings
  app.get("/api/venues/:venueId/room-bookings", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { startDate, endDate } = req.query;
      let bookings;
      if (startDate && endDate) {
        bookings = await storage.getRoomBookingsByDateRange(
          req.params.venueId,
          normalizeISODate(startDate),
          normalizeISODate(endDate)
        );
      } else {
        bookings = await storage.getRoomBookings(req.params.venueId);
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
      if (!await authorizeVenueAccess(req, booking.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch room booking" });
    }
  });

  app.post("/api/venues/:venueId/room-bookings", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const checkIn = normalizeISODate(req.body.checkIn);
      const checkOut = normalizeISODate(req.body.checkOut);
      
      if (checkOut <= checkIn) {
        return res.status(400).json({ error: "Check-out date must be after check-in date" });
      }
      
      // Check for overlapping bookings on the same room
      const existingBookings = await storage.getRoomBookingsByDateRange(
        req.params.venueId,
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
        venueId: req.params.venueId,
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
      if (!await authorizeVenueAccess(req, existing.venueId)) {
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
          existing.venueId,
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
      if (!await authorizeVenueAccess(req, existing.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteRoomBooking(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete room booking" });
    }
  });

  // Website Change Requests
  app.get("/api/venues/:venueId/website-changes", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const changes = await storage.getWebsiteChangeRequests(req.params.venueId);
      res.json(changes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch website change requests" });
    }
  });

  app.post("/api/venues/:venueId/website-changes", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const userId = (req as any).user?.id || "anonymous";
      const { changeType, description, pageUrl } = req.body;
      if (!description || typeof description !== "string" || description.trim().length === 0) {
        return res.status(400).json({ error: "Description is required" });
      }
      const change = await storage.createWebsiteChangeRequest({
        venueId: req.params.venueId,
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

  app.patch("/api/venues/:venueId/website-changes/:id", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
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
  app.get("/api/venues/:venueId/rank-tracker/keywords", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const keywords = await storage.getRankTrackerKeywords(req.params.venueId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch keywords" });
    }
  });

  app.post("/api/venues/:venueId/rank-tracker/keywords", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
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
      const existing = await storage.getRankTrackerKeywords(req.params.venueId);
      const existingSet = new Set(existing.map(e => e.keyword.toLowerCase()));
      const newKeywords = cleaned.filter(k => !existingSet.has(k));
      if (newKeywords.length === 0) {
        return res.status(400).json({ error: "All keywords already exist" });
      }
      if (existing.length + newKeywords.length > MAX_KEYWORDS) {
        return res.status(400).json({ error: `Keyword limit exceeded. You have ${existing.length} keywords and can add up to ${MAX_KEYWORDS - existing.length} more (max ${MAX_KEYWORDS}).` });
      }
      const items = newKeywords.map(k => ({ venueId: req.params.venueId, keyword: k }));
      const added = await storage.addRankTrackerKeywords(items);
      res.json({ added: added.length, keywords: added });
    } catch (error) {
      res.status(500).json({ error: "Failed to add keywords" });
    }
  });

  app.delete("/api/venues/:venueId/rank-tracker/keywords/:keywordId", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteRankTrackerKeyword(parseInt(req.params.keywordId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete keyword" });
    }
  });

  app.delete("/api/venues/:venueId/rank-tracker/keywords", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteAllRankTrackerKeywords(req.params.venueId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear keywords" });
    }
  });

  // Rank Tracker - Results
  app.get("/api/venues/:venueId/rank-tracker/results", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const data = await storage.getRankTrackerResults(req.params.venueId, page, limit);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch results" });
    }
  });

  app.get("/api/venues/:venueId/rank-tracker/latest", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const results = await storage.getLatestRankTrackerResults(req.params.venueId);
      const lastCheck = await storage.getLastRankCheckDate(req.params.venueId);
      res.json({ results, lastCheckedAt: lastCheck });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest results" });
    }
  });

  // Rank Tracker - Check Rankings (weekly limit)
  app.post("/api/venues/:venueId/rank-tracker/check", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const lastCheck = await storage.getLastRankCheckDate(req.params.venueId);
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

      const keywords = await storage.getRankTrackerKeywords(req.params.venueId);
      if (keywords.length === 0) {
        return res.status(400).json({ error: "No keywords to check. Add keywords first." });
      }

      const venue = await storage.getVenue(req.params.venueId);
      const siteUrl = venue?.website || "";
      
      if (!siteUrl) {
        return res.status(400).json({ error: "No custom domain configured for this venue. The Rank Tracker only works with your venue's custom domain. Please contact Resto to set up your domain." });
      }

      const dfsLogin = process.env.DATAFORSEO_LOGIN;
      const dfsPassword = process.env.DATAFORSEO_PASSWORD;
      
      if (!dfsLogin || !dfsPassword) {
        return res.status(503).json({ error: "Rank tracking service not configured. Please contact support." });
      }

      const previousResults = await storage.getLatestRankTrackerResults(req.params.venueId);
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
                venueId: req.params.venueId,
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
                venueId: req.params.venueId,
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
              venueId: req.params.venueId,
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
  app.get("/api/venues/:venueId/grid-keywords", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const keywords = await storage.getGridKeywords(req.params.venueId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid keywords" });
    }
  });

  app.post("/api/venues/:venueId/grid-keywords", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
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
      const existing = await storage.getGridKeywords(req.params.venueId);
      const existingSet = new Set(existing.map(e => e.keyword.toLowerCase()));
      const newKeywords = cleaned.filter(k => !existingSet.has(k));
      if (newKeywords.length === 0) {
        return res.status(400).json({ error: "All keywords already exist" });
      }
      if (existing.length + newKeywords.length > MAX_GRID_KEYWORDS) {
        return res.status(400).json({ error: `Keyword limit exceeded. You have ${existing.length} keywords and can add up to ${MAX_GRID_KEYWORDS - existing.length} more (max ${MAX_GRID_KEYWORDS}).` });
      }
      const items = newKeywords.map(k => ({
        venueId: req.params.venueId,
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

  app.delete("/api/venues/:venueId/grid-keywords/:keywordId", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteGridKeyword(parseInt(req.params.keywordId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete grid keyword" });
    }
  });

  app.delete("/api/venues/:venueId/grid-keywords", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      await storage.deleteAllGridKeywords(req.params.venueId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear grid keywords" });
    }
  });

  // Grid Refresh Credits
  app.get("/api/venues/:venueId/grid-refresh-credits", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const credits = await storage.getGridRefreshCredits(req.params.venueId);
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid refresh credits" });
    }
  });

  app.post("/api/venues/:venueId/grid-refresh-credits/purchase", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { amount } = req.body;
      const validPacks: Record<number, string> = { 5: "$10 — 5 scans", 25: "$35 — 25 scans (best value)" };
      if (!amount || typeof amount !== "number" || !validPacks[amount]) {
        return res.status(400).json({ error: "Invalid credit pack. Choose 5 or 25 scans." });
      }
      const credits = await storage.addGridRefreshCredits(req.params.venueId, amount, `Purchased ${validPacks[amount]}`);
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to purchase credits" });
    }
  });

  app.post("/api/venues/:venueId/grid-refresh-credits/use", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const result = await storage.useGridRefreshCredit(req.params.venueId);
      if (!result.success) {
        return res.status(402).json({ error: "No credits remaining. Purchase additional scans to continue.", balance: 0 });
      }
      res.json({ ...result, type: "credit" });
    } catch (error) {
      res.status(500).json({ error: "Failed to use refresh credit" });
    }
  });

  app.post("/api/venues/:venueId/grid-scan", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const venue = await storage.getVenue(req.params.venueId);
      if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
      }

      if (!venue.latitude || !venue.longitude) {
        return res.status(400).json({ error: "Venue has no coordinates set. Please update your venue address with latitude and longitude." });
      }

      const gridKeywordsList = await storage.getGridKeywords(req.params.venueId);
      if (gridKeywordsList.length === 0) {
        return res.status(400).json({ error: "No grid keywords to scan. Add keywords first." });
      }

      const dfsLogin = process.env.DATAFORSEO_LOGIN;
      const dfsPassword = process.env.DATAFORSEO_PASSWORD;

      if (!dfsLogin || !dfsPassword) {
        return res.status(503).json({ error: "Grid scanning service not configured. Please contact support." });
      }

      const centerLat = parseFloat(venue.latitude as string);
      const centerLng = parseFloat(venue.longitude as string);
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
      const venueName = venue.name.toLowerCase();
      const venueWebsite = (venue.website || "").replace(/https?:\/\//, "").replace(/\/$/, "").toLowerCase();
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
                itemTitle.includes(venueName) ||
                venueName.includes(itemTitle) ||
                (venueWebsite && itemDomain.includes(venueWebsite))
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
                venueId: req.params.venueId,
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

  app.get("/api/venues/:venueId/grid-scan-results/:keyword", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const results = await storage.getLatestGridScanResults(req.params.venueId, decodeURIComponent(req.params.keyword));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid scan results" });
    }
  });

  app.get("/api/venues/:venueId/grid-scan-keywords", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const keywords = await storage.getGridScanKeywords(req.params.venueId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scanned keywords" });
    }
  });

  app.get("/api/venues/:venueId/grid-refresh-history", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const history = await storage.getGridRefreshHistory(req.params.venueId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch refresh history" });
    }
  });

  // Rank Tracker Credits
  app.get("/api/venues/:venueId/rank-tracker-credits", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const credits = await storage.getRankTrackerCredits(req.params.venueId);
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rank tracker credits" });
    }
  });

  app.post("/api/venues/:venueId/rank-tracker-credits/purchase", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { amount } = req.body;
      if (!amount || typeof amount !== "number" || amount < 1) {
        return res.status(400).json({ error: "Valid amount is required" });
      }
      const credits = await storage.addRankTrackerCredits(req.params.venueId, amount, `Purchased ${amount} rank check credits`);
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to purchase credits" });
    }
  });

  app.post("/api/venues/:venueId/rank-tracker-credits/use", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const result = await storage.useRankTrackerCredit(req.params.venueId);
      if (!result.success) {
        return res.status(402).json({ error: "No rank check credits remaining. Purchase more to continue.", balance: 0 });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to use rank check credit" });
    }
  });

  app.get("/api/venues/:venueId/rank-tracker-history", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const history = await storage.getRankTrackerHistory(req.params.venueId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rank tracker history" });
    }
  });

  // SEO Settings
  app.get("/api/venues/:venueId/seo-settings", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const settings = await storage.getSeoSettings(req.params.venueId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch SEO settings" });
    }
  });

  app.post("/api/venues/:venueId/seo-settings", async (req, res) => {
    try {
      if (!await authorizeVenueAccess(req, req.params.venueId)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      const { provider, apiKey, apiLogin, apiPassword, siteUrl, isConnected } = req.body;
      if (!provider) return res.status(400).json({ error: "Provider is required" });
      const settings = await storage.upsertSeoSettings({
        venueId: req.params.venueId,
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

  app.post("/api/widget/:venueId/chat", async (req, res) => {
    try {
      const { venueId } = req.params;
      const { message, history, sessionId, channel } = req.body;

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (message.length > 1000) {
        return res.status(400).json({ error: "Message too long" });
      }

      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      const rateLimitKey = `${clientIp}:${venueId}`;
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

      const venue = await storage.getVenue(venueId);
      if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
      }

      const widgetSettings = await storage.getWidgetSettings(venueId);
      if (widgetSettings && !widgetSettings.isEnabled) {
        return res.status(403).json({ error: "Widget is not enabled for this venue" });
      }

      const knowledgeBase = await storage.getKnowledgeBaseItems(venueId);
      const systemPrompt = buildWidgetSystemPrompt(
        venue.name,
        venue.type || "restaurant",
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

      const aiReply = await getAiResponse(venueId, systemPrompt, message.trim(), conversationHistory);

      if (sessionId && typeof sessionId === "string") {
        try {
          const existingLog = await storage.updateWidgetChatLogMessageCount(sessionId);
          if (!existingLog) {
            await storage.createWidgetChatLog({
              venueId,
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

  registerTwilioWebhooks(app);

  return httpServer;
}
