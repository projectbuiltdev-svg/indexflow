import { Router, Request, Response } from "express";
import { db } from "../db";
import { weVersions } from "../../db/schema/we-versions";
import { wePages } from "../../db/schema/we-pages";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and, desc, asc, sql, lt } from "drizzle-orm";

const router = Router();
const MAX_VERSIONS = 500;
const ARCHIVE_BATCH = 50;

router.get("/:projectId/:pageId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const pageId = parseInt(req.params.pageId as string);

    const versions = await db
      .select({
        id: weVersions.id,
        pageId: weVersions.pageId,
        projectId: weVersions.projectId,
        venueId: weVersions.venueId,
        versionNumber: weVersions.versionNumber,
        createdBy: weVersions.createdBy,
        createdAt: weVersions.createdAt,
      })
      .from(weVersions)
      .where(
        and(
          eq(weVersions.pageId, pageId),
          eq(weVersions.projectId, projectId),
          eq(weVersions.venueId, venueId)
        )
      )
      .orderBy(desc(weVersions.versionNumber));

    res.json({ versions, total: versions.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId/:pageId/:versionId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const versionId = parseInt(req.params.versionId as string);

    const [version] = await db
      .select()
      .from(weVersions)
      .where(and(eq(weVersions.id, versionId), eq(weVersions.venueId, venueId)));

    if (!version) return res.status(404).json({ error: "Version not found" });
    res.json(version);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:projectId/:pageId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const pageId = parseInt(req.params.pageId as string);
    const userId = (req as any).user?.id;

    const [page] = await db
      .select()
      .from(wePages)
      .where(and(eq(wePages.id, pageId), eq(wePages.projectId, projectId), eq(wePages.venueId, venueId)));

    if (!page) return res.status(404).json({ error: "Page not found" });

    const [maxVer] = await db
      .select({ max: sql<number>`COALESCE(MAX(${weVersions.versionNumber}), 0)` })
      .from(weVersions)
      .where(and(eq(weVersions.pageId, pageId), eq(weVersions.projectId, projectId)));

    const nextVersion = (maxVer?.max ?? 0) + 1;

    if (nextVersion > MAX_VERSIONS) {
      const oldest = await db
        .select({ id: weVersions.id, versionNumber: weVersions.versionNumber })
        .from(weVersions)
        .where(and(eq(weVersions.pageId, pageId), eq(weVersions.projectId, projectId)))
        .orderBy(asc(weVersions.versionNumber))
        .limit(ARCHIVE_BATCH);

      const archivedIds = oldest.map((v) => v.id);

      await db.insert(weAuditLog).values({
        venueId,
        projectId,
        userId,
        action: "versions_archived",
        metadata: { pageId, archivedCount: archivedIds.length, archivedVersionNumbers: oldest.map((v) => v.versionNumber) },
        severity: "info",
      });

      await db.delete(weVersions).where(
        and(
          eq(weVersions.pageId, pageId),
          eq(weVersions.projectId, projectId),
          lt(weVersions.versionNumber, oldest[oldest.length - 1].versionNumber + 1)
        )
      );
    }

    const [version] = await db
      .insert(weVersions)
      .values({
        pageId,
        projectId,
        venueId,
        grapejsState: page.grapejsState,
        versionNumber: nextVersion,
        createdBy: userId,
      })
      .returning();

    res.status(201).json(version);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:projectId/:pageId/:versionId/restore", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const pageId = parseInt(req.params.pageId as string);
    const versionId = parseInt(req.params.versionId as string);
    const userId = (req as any).user?.id;

    const [version] = await db
      .select()
      .from(weVersions)
      .where(and(eq(weVersions.id, versionId), eq(weVersions.venueId, venueId)));

    if (!version) return res.status(404).json({ error: "Version not found" });

    const [currentPage] = await db
      .select()
      .from(wePages)
      .where(and(eq(wePages.id, pageId), eq(wePages.projectId, projectId), eq(wePages.venueId, venueId)));

    if (!currentPage) return res.status(404).json({ error: "Page not found" });

    const [maxVer] = await db
      .select({ max: sql<number>`COALESCE(MAX(${weVersions.versionNumber}), 0)` })
      .from(weVersions)
      .where(and(eq(weVersions.pageId, pageId), eq(weVersions.projectId, projectId)));

    await db.insert(weVersions).values({
      pageId,
      projectId,
      venueId,
      grapejsState: currentPage.grapejsState,
      versionNumber: (maxVer?.max ?? 0) + 1,
      createdBy: userId,
    });

    const [updated] = await db
      .update(wePages)
      .set({ grapejsState: version.grapejsState, updatedAt: new Date() })
      .where(eq(wePages.id, pageId))
      .returning();

    await db.insert(weAuditLog).values({
      venueId,
      projectId,
      userId,
      action: "version_restored",
      metadata: { pageId, versionId, versionNumber: version.versionNumber },
      severity: "info",
    });

    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
