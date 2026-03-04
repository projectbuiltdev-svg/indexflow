import { Router, Request, Response } from "express";
import { db } from "../db";
import { weDeployments } from "../../db/schema/we-deployments";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and, desc } from "drizzle-orm";
import { weAuth } from "../middleware/we-auth";
import { weVenue } from "../middleware/we-venue";

const router = Router();

interface StoredComment {
  id: number;
  projectId: number;
  venueId: string;
  elementSelector: string;
  xPercent: number;
  yPercent: number;
  comment: string;
  clientName: string;
  clientEmail?: string;
  pinNumber: number;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  replies: { text: string; by: string; at: string }[];
  createdAt: string;
  page?: string;
}

let commentIdCounter = 1;
const commentsStore: StoredComment[] = [];
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  return (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

async function resolveTokenToProject(token: string): Promise<{ projectId: number; venueId: string } | null> {
  const logs = await db.select().from(weAuditLog)
    .where(eq(weAuditLog.action, "preview_link_created"))
    .orderBy(desc(weAuditLog.createdAt));

  for (const log of logs) {
    const meta = log.metadata as any;
    if (meta?.token === token) {
      const expiresAt = new Date(meta.expiresAt);
      if (expiresAt > new Date()) {
        return { projectId: log.projectId!, venueId: log.venueId };
      }
    }
  }
  return null;
}

router.post("/:token/add", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const ip = getClientIp(req);

    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: "Rate limit exceeded. Max 20 comments per hour." });
    }

    const resolved = await resolveTokenToProject(token as string);
    if (!resolved) return res.status(404).json({ error: "Preview link not found or expired" });

    const { elementSelector, xPercent, yPercent, comment, clientName, clientEmail, page } = req.body;
    if (!comment || !clientName) return res.status(400).json({ error: "comment and clientName required" });

    const pinNumber = commentsStore.filter((c) => c.projectId === resolved.projectId && !c.resolved).length + 1;

    const stored: StoredComment = {
      id: commentIdCounter++,
      projectId: resolved.projectId,
      venueId: resolved.venueId,
      elementSelector: elementSelector || "",
      xPercent: xPercent || 0,
      yPercent: yPercent || 0,
      comment,
      clientName,
      clientEmail,
      pinNumber,
      resolved: false,
      replies: [],
      createdAt: new Date().toISOString(),
      page,
    };

    commentsStore.push(stored);

    await db.insert(weAuditLog).values({
      venueId: resolved.venueId,
      projectId: resolved.projectId,
      action: "preview_comment_added",
      metadata: { commentId: stored.id, clientName, pinNumber },
      severity: "info",
    });

    res.status(201).json({ commentId: stored.id, pinNumber });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const resolved = await resolveTokenToProject(token as string);
    if (!resolved) return res.status(404).json({ error: "Preview link not found or expired" });

    const comments = commentsStore.filter(
      (c) => c.projectId === resolved.projectId && !c.resolved
    );

    res.json({ comments, total: comments.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/project/:projectId", weAuth, weVenue, async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const resolvedFilter = req.query.resolved;

    let comments = commentsStore.filter(
      (c) => c.projectId === projectId && c.venueId === venueId
    );

    if (resolvedFilter === "true") comments = comments.filter((c) => c.resolved);
    if (resolvedFilter === "false") comments = comments.filter((c) => !c.resolved);

    res.json({ comments, total: comments.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/:commentId/resolve", weAuth, weVenue, async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const commentId = parseInt(req.params.commentId as string);
    const userId = (req as any).userId || "anonymous";

    const comment = commentsStore.find((c) => c.id === commentId && c.venueId === venueId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.resolved = true;
    comment.resolvedAt = new Date().toISOString();
    comment.resolvedBy = userId;

    await db.insert(weAuditLog).values({
      venueId,
      projectId: comment.projectId,
      action: "preview_comment_resolved",
      metadata: { commentId, resolvedBy: userId },
      severity: "info",
    });

    res.json(comment);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:commentId/reply", weAuth, weVenue, async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const commentId = parseInt(req.params.commentId as string);
    const userId = (req as any).userId || "anonymous";
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "text required" });

    const comment = commentsStore.find((c) => c.id === commentId && c.venueId === venueId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.replies.push({ text, by: userId, at: new Date().toISOString() });

    res.json(comment);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
