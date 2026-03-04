import { Router, Request, Response } from "express";
import { db } from "../db";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { weDeployments } from "../../db/schema/we-deployments";
import { eq, and, desc } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

const LOCK_TTL_MS = 30 * 60 * 1000;

interface ActiveLock {
  pageId: string;
  userId: string;
  userName: string;
  lockedAt: Date;
  expiresAt: Date;
}

const activeLocks = new Map<string, ActiveLock>();

function lockKey(projectId: string, pageId: string): string {
  return `${projectId}:${pageId}`;
}

router.post("/:projectId/:pageId/lock", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = req.params.projectId as string;
    const pageId = req.params.pageId as string;
    const userId = (req as any).userId || "anonymous";
    const userName = (req as any).userName || "Unknown";
    const key = lockKey(projectId, pageId);

    const existing = activeLocks.get(key);
    if (existing && existing.userId !== userId && existing.expiresAt > new Date()) {
      return res.json({ locked: false, lockedBy: existing.userName, lockedAt: existing.lockedAt.toISOString() });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + LOCK_TTL_MS);

    activeLocks.set(key, { pageId, userId, userName, lockedAt: now, expiresAt });

    await db.insert(weAuditLog).values({
      venueId,
      projectId: parseInt(projectId),
      action: "page_locked",
      metadata: { userId, userName, pageId, lockedAt: now.toISOString() },
      severity: "info",
    });

    res.json({ locked: true, lockedBy: userName, lockedAt: now.toISOString(), expiresAt: expiresAt.toISOString() });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:projectId/:pageId/lock", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = req.params.projectId as string;
    const pageId = req.params.pageId as string;
    const userId = (req as any).userId || "anonymous";
    const key = lockKey(projectId, pageId);

    const existing = activeLocks.get(key);
    if (existing && existing.userId !== userId) {
      return res.status(403).json({ error: "Only the lock holder can release" });
    }

    activeLocks.delete(key);

    await db.insert(weAuditLog).values({
      venueId,
      projectId: parseInt(projectId),
      action: "page_unlocked",
      metadata: { userId, pageId },
      severity: "info",
    });

    res.json({ released: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId/:pageId/lock", async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;
    const pageId = req.params.pageId as string;
    const key = lockKey(projectId, pageId);
    const existing = activeLocks.get(key);

    if (!existing || existing.expiresAt < new Date()) {
      if (existing) activeLocks.delete(key);
      return res.json({ isLocked: false, lockedBy: null, lockedAt: null, expiresAt: null });
    }

    res.json({
      isLocked: true,
      lockedBy: existing.userName,
      lockedAt: existing.lockedAt.toISOString(),
      expiresAt: existing.expiresAt.toISOString(),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:projectId/:pageId/heartbeat", async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;
    const pageId = req.params.pageId as string;
    const userId = (req as any).userId || "anonymous";
    const key = lockKey(projectId, pageId);
    const existing = activeLocks.get(key);

    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ error: "No active lock" });
    }

    existing.expiresAt = new Date(Date.now() + LOCK_TTL_MS);
    res.json({ expiresAt: existing.expiresAt.toISOString() });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId/locks", async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;
    const now = new Date();
    const locks: any[] = [];

    for (const [k, v] of activeLocks) {
      if (k.startsWith(`${projectId}:`) && v.expiresAt > now) {
        locks.push({
          pageId: v.pageId,
          lockedBy: v.userName,
          lockedAt: v.lockedAt.toISOString(),
          expiresAt: v.expiresAt.toISOString(),
        });
      }
    }

    res.json({ locks });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:projectId/preview-link", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const whitelabelDomain = (req as any).whitelabelDomain;
    const baseUrl = whitelabelDomain ? `preview.${whitelabelDomain}` : "preview.indexflow.cloud";
    const previewUrl = `https://${baseUrl}/${token}`;

    await db.insert(weDeployments).values({
      projectId,
      venueId,
      domain: previewUrl,
      deploymentType: "test",
      htmlSnapshot: token,
      status: "success",
      deployedAt: new Date(),
    });

    await db.insert(weAuditLog).values({
      venueId,
      projectId,
      action: "preview_link_created",
      metadata: { token, previewUrl, expiresAt: expiresAt.toISOString() },
      severity: "info",
    });

    res.json({ previewUrl, expiresAt: expiresAt.toISOString(), token });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:projectId/preview-link/:token", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const { token } = req.params;

    await db.insert(weAuditLog).values({
      venueId,
      projectId,
      action: "preview_link_invalidated",
      metadata: { token },
      severity: "info",
    });

    res.json({ invalidated: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId/preview-link", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    const logs = await db.select().from(weAuditLog)
      .where(and(
        eq(weAuditLog.venueId, venueId),
        eq(weAuditLog.projectId, projectId),
        eq(weAuditLog.action, "preview_link_created")
      ))
      .orderBy(desc(weAuditLog.createdAt))
      .limit(1);

    if (!logs.length) return res.json(null);

    const meta = logs[0].metadata as any;
    const expiresAt = new Date(meta.expiresAt);
    if (expiresAt < new Date()) return res.json(null);

    const invalidated = await db.select().from(weAuditLog)
      .where(and(
        eq(weAuditLog.venueId, venueId),
        eq(weAuditLog.projectId, projectId),
        eq(weAuditLog.action, "preview_link_invalidated")
      ))
      .orderBy(desc(weAuditLog.createdAt))
      .limit(1);

    if (invalidated.length && invalidated[0].createdAt! > logs[0].createdAt!) {
      return res.json(null);
    }

    res.json({ previewUrl: meta.previewUrl, expiresAt: meta.expiresAt, token: meta.token });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
