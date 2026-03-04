import { Router, Request, Response } from "express";
import { db } from "../db";
import { wePages } from "../../db/schema/we-pages";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and, asc, isNull } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/:projectId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);

    const pages = await db
      .select({
        id: wePages.id,
        projectId: wePages.projectId,
        venueId: wePages.venueId,
        name: wePages.name,
        slug: wePages.slug,
        seoMeta: wePages.seoMeta,
        accessTag: wePages.accessTag,
        pageOrder: wePages.pageOrder,
        isHome: wePages.isHome,
        deletedAt: wePages.deletedAt,
        createdAt: wePages.createdAt,
        updatedAt: wePages.updatedAt,
      })
      .from(wePages)
      .where(
        and(
          eq(wePages.projectId, projectId),
          eq(wePages.venueId, venueId),
          isNull(wePages.deletedAt)
        )
      )
      .orderBy(asc(wePages.pageOrder));

    res.json({ pages, total: pages.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:projectId/:pageId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const pageId = parseInt(req.params.pageId as string);

    const [page] = await db
      .select()
      .from(wePages)
      .where(
        and(
          eq(wePages.id, pageId),
          eq(wePages.projectId, projectId),
          eq(wePages.venueId, venueId)
        )
      );

    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json(page);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:projectId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const { name, slug, grapejsState, seoMeta, accessTag, isHome } = req.body;

    if (!name || !slug) return res.status(400).json({ error: "name and slug are required" });

    const existing = await db
      .select({ id: wePages.id })
      .from(wePages)
      .where(
        and(
          eq(wePages.projectId, projectId),
          eq(wePages.slug, slug),
          isNull(wePages.deletedAt)
        )
      );

    if (existing.length > 0) return res.status(409).json({ error: "Slug already exists in this project" });

    const [maxOrder] = await db
      .select({ max: sql<number>`COALESCE(MAX(${wePages.pageOrder}), -1)` })
      .from(wePages)
      .where(eq(wePages.projectId, projectId));

    const [page] = await db
      .insert(wePages)
      .values({
        projectId,
        venueId,
        name,
        slug,
        grapejsState: grapejsState || null,
        seoMeta: seoMeta || null,
        accessTag: accessTag || "public",
        pageOrder: (maxOrder?.max ?? -1) + 1,
        isHome: isHome || false,
      })
      .returning();

    await db.insert(weAuditLog).values({
      venueId,
      projectId,
      userId: (req as any).user?.id,
      action: "page_created",
      metadata: { pageId: page.id, name, slug },
      severity: "info",
    });

    res.status(201).json(page);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/:projectId/:pageId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const pageId = parseInt(req.params.pageId as string);
    const { grapejsState, name, slug, seoMeta, accessTag, pageOrder } = req.body;

    if (slug) {
      const existing = await db
        .select({ id: wePages.id })
        .from(wePages)
        .where(
          and(
            eq(wePages.projectId, projectId),
            eq(wePages.slug, slug),
            isNull(wePages.deletedAt)
          )
        );
      const conflict = existing.find((p) => p.id !== pageId);
      if (conflict) return res.status(409).json({ error: "Slug already exists in this project" });
    }

    const updates: Record<string, any> = { updatedAt: new Date() };
    if (grapejsState !== undefined) updates.grapejsState = grapejsState;
    if (name !== undefined) updates.name = name;
    if (slug !== undefined) updates.slug = slug;
    if (seoMeta !== undefined) updates.seoMeta = seoMeta;
    if (accessTag !== undefined) updates.accessTag = accessTag;
    if (pageOrder !== undefined) updates.pageOrder = pageOrder;

    const [updated] = await db
      .update(wePages)
      .set(updates)
      .where(
        and(
          eq(wePages.id, pageId),
          eq(wePages.projectId, projectId),
          eq(wePages.venueId, venueId)
        )
      )
      .returning();

    if (!updated) return res.status(404).json({ error: "Page not found" });
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:projectId/:pageId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const projectId = parseInt(req.params.projectId as string);
    const pageId = parseInt(req.params.pageId as string);

    const [page] = await db
      .select()
      .from(wePages)
      .where(
        and(
          eq(wePages.id, pageId),
          eq(wePages.projectId, projectId),
          eq(wePages.venueId, venueId)
        )
      );

    if (!page) return res.status(404).json({ error: "Page not found" });
    if (page.isHome) return res.status(400).json({ error: "Cannot delete the home page" });

    const [deleted] = await db
      .update(wePages)
      .set({ deletedAt: new Date() })
      .where(eq(wePages.id, pageId))
      .returning();

    await db.insert(weAuditLog).values({
      venueId,
      projectId,
      userId: (req as any).user?.id,
      action: "page_deleted",
      metadata: { pageId, name: page.name },
      severity: "warn",
    });

    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
