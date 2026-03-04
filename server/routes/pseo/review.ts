import { Router, Request, Response } from "express";
import { db } from "../../db";
import { pseoPages, pseoServices, pseoLocations, workspaceSitePages, pseoCampaigns } from "@shared/schema";
import { eq, and, inArray, isNull, sql } from "drizzle-orm";
import { REVIEW_QUEUE_POLL_INTERVAL_MS } from "../../config/pseo-gate-thresholds";

const router = Router();

function extractComparisonPageId(failReasons: string[]): string | null {
  for (const reason of failReasons) {
    const match = reason.match(/compared to page ([a-f0-9-]+)/i);
    if (match) return match[1];
    const match2 = reason.match(/vs page ([a-f0-9-]+)/i);
    if (match2) return match2[1];
  }
  return null;
}

function computeWordCount(paragraphVariants: string[] | null, title: string): number {
  let text = title || "";
  if (paragraphVariants && Array.isArray(paragraphVariants)) {
    text += " " + paragraphVariants.join(" ");
  }
  const stripped = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return stripped ? stripped.split(" ").length : 0;
}

router.get("/review/config", async (_req: Request, res: Response) => {
  return res.json({
    pollIntervalMs: REVIEW_QUEUE_POLL_INTERVAL_MS,
    rowsPerPage: 25,
  });
});

router.get("/campaigns/:id/review-queue", async (req: Request, res: Response) => {
  try {
    const campaignId = req.params.id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const offset = (page - 1) * limit;

    const reviewPages = await db
      .select()
      .from(pseoPages)
      .where(
        and(
          eq(pseoPages.campaignId, campaignId),
          inArray(pseoPages.qualityGateStatus, ["fail", "review"]),
          isNull(pseoPages.deletedAt)
        )
      )
      .orderBy(pseoPages.createdAt)
      .limit(limit)
      .offset(offset);

    const allReviewPages = await db
      .select({ id: pseoPages.id, qualityGateStatus: pseoPages.qualityGateStatus })
      .from(pseoPages)
      .where(
        and(
          eq(pseoPages.campaignId, campaignId),
          inArray(pseoPages.qualityGateStatus, ["fail", "review"]),
          isNull(pseoPages.deletedAt)
        )
      );

    const qualityFailCount = allReviewPages.filter((p) => p.qualityGateStatus === "fail").length;
    const similarityHoldCount = allReviewPages.filter((p) => p.qualityGateStatus === "review").length;

    const serviceIds = [...new Set(reviewPages.map((p) => p.serviceId).filter(Boolean))] as string[];
    const locationIds = [...new Set(reviewPages.map((p) => p.locationId).filter(Boolean))] as string[];

    let servicesMap: Record<string, string> = {};
    let locationsMap: Record<string, string> = {};

    if (serviceIds.length > 0) {
      const services = await db
        .select({ id: pseoServices.id, name: pseoServices.name })
        .from(pseoServices)
        .where(inArray(pseoServices.id, serviceIds));
      servicesMap = Object.fromEntries(services.map((s) => [s.id, s.name]));
    }

    if (locationIds.length > 0) {
      const locations = await db
        .select({ id: pseoLocations.id, name: pseoLocations.name })
        .from(pseoLocations)
        .where(inArray(pseoLocations.id, locationIds));
      locationsMap = Object.fromEntries(locations.map((l) => [l.id, l.name]));
    }

    const comparisonPageIds = new Set<string>();
    for (const p of reviewPages) {
      if (p.qualityGateStatus === "review" && p.qualityFailReasons) {
        const cpId = extractComparisonPageId(p.qualityFailReasons as string[]);
        if (cpId) comparisonPageIds.add(cpId);
      }
    }

    let comparisonPagesMap: Record<string, string> = {};
    if (comparisonPageIds.size > 0) {
      const cpPages = await db
        .select({ id: pseoPages.id, title: pseoPages.title })
        .from(pseoPages)
        .where(inArray(pseoPages.id, [...comparisonPageIds]));
      comparisonPagesMap = Object.fromEntries(cpPages.map((p) => [p.id, p.title]));
    }

    const items = reviewPages.map((p) => {
      const failReasons = (p.qualityFailReasons || []) as string[];
      const cpId = extractComparisonPageId(failReasons);
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        serviceName: p.serviceId ? servicesMap[p.serviceId] || "Unknown" : "Unknown",
        locationName: p.locationId ? locationsMap[p.locationId] || "Unknown" : "Unknown",
        qualityGateStatus: p.qualityGateStatus,
        qualityFailReasons: failReasons,
        similarityScore: p.similarityScore ? parseFloat(p.similarityScore) : null,
        comparisonPageId: cpId,
        comparisonPageTitle: cpId ? comparisonPagesMap[cpId] || null : null,
        wordCount: computeWordCount(p.paragraphVariants as string[] | null, p.title),
        paragraphVariants: p.paragraphVariants,
        metaTitle: p.metaTitle,
        metaDescription: p.metaDescription,
        h1Variant: p.h1Variant,
        createdAt: p.createdAt,
        type: p.qualityGateStatus === "fail" ? "quality_gate" : "similarity_hold",
      };
    });

    return res.json({
      items,
      total: allReviewPages.length,
      qualityFailCount,
      similarityHoldCount,
      page,
      limit,
      totalPages: Math.ceil(allReviewPages.length / limit),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch review queue" });
  }
});

router.post("/review/:itemId/approve", async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId as string;

    const [page] = await db
      .select()
      .from(pseoPages)
      .where(eq(pseoPages.id, itemId))
      .limit(1);

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    const content = `<!DOCTYPE html><html><head><title>${page.metaTitle || page.title}</title></head><body><h1>${page.title}</h1></body></html>`;

    const [sitePage] = await db
      .insert(workspaceSitePages)
      .values({
        workspaceId: page.venueId,
        slug: page.slug,
        title: page.title,
        description: page.metaDescription || "",
        content,
        template: "pseo",
        isPublished: true,
        metaTitle: page.metaTitle || page.title,
        metaDescription: page.metaDescription || "",
      })
      .returning({ id: workspaceSitePages.id });

    await db
      .update(pseoPages)
      .set({
        qualityGateStatus: "pass",
        isPublished: true,
        venueSitePageId: sitePage.id,
        updatedAt: new Date(),
      })
      .where(eq(pseoPages.id, itemId));

    await db
      .update(pseoCampaigns)
      .set({ pagesPublished: sql`pages_published + 1`, updatedAt: new Date() })
      .where(eq(pseoCampaigns.id, page.campaignId));

    return res.json({ success: true, pageId: itemId, sitePageId: sitePage.id });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Approve failed" });
  }
});

router.post("/review/:itemId/reject", async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId as string;

    const [page] = await db
      .select({ id: pseoPages.id, campaignId: pseoPages.campaignId })
      .from(pseoPages)
      .where(eq(pseoPages.id, itemId))
      .limit(1);

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    await db
      .update(pseoPages)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(pseoPages.id, itemId));

    return res.json({ success: true, pageId: itemId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Reject failed" });
  }
});

router.post("/review/:itemId/regenerate", async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId as string;

    const [page] = await db
      .select()
      .from(pseoPages)
      .where(eq(pseoPages.id, itemId))
      .limit(1);

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    await db
      .update(pseoPages)
      .set({
        qualityGateStatus: "pending",
        qualityFailReasons: [],
        similarityScore: null,
        updatedAt: new Date(),
      })
      .where(eq(pseoPages.id, itemId));

    return res.json({ success: true, pageId: itemId, status: "queued" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Regenerate failed" });
  }
});

router.post("/review/:itemId/update", async (req: Request, res: Response) => {
  try {
    const itemId = req.params.itemId as string;
    const { title, metaTitle, metaDescription, h1Variant, paragraphVariants } = req.body;

    const [page] = await db
      .select({ id: pseoPages.id })
      .from(pseoPages)
      .where(eq(pseoPages.id, itemId))
      .limit(1);

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    const updates: Record<string, any> = { updatedAt: new Date() };
    if (title !== undefined) updates.title = title;
    if (metaTitle !== undefined) updates.metaTitle = metaTitle;
    if (metaDescription !== undefined) updates.metaDescription = metaDescription;
    if (h1Variant !== undefined) updates.h1Variant = h1Variant;
    if (paragraphVariants !== undefined) updates.paragraphVariants = paragraphVariants;

    updates.qualityGateStatus = "pending";
    updates.qualityFailReasons = [];

    await db.update(pseoPages).set(updates).where(eq(pseoPages.id, itemId));

    return res.json({ success: true, pageId: itemId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Update failed" });
  }
});

router.post("/review/bulk-approve", async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.body;
    if (!campaignId) {
      return res.status(400).json({ error: "campaignId required" });
    }

    const reviewPages = await db
      .select()
      .from(pseoPages)
      .where(
        and(
          eq(pseoPages.campaignId, campaignId),
          inArray(pseoPages.qualityGateStatus, ["fail", "review"]),
          isNull(pseoPages.deletedAt)
        )
      );

    let approved = 0;
    for (const page of reviewPages) {
      try {
        const [sitePage] = await db
          .insert(workspaceSitePages)
          .values({
            workspaceId: page.venueId,
            slug: page.slug,
            title: page.title,
            description: page.metaDescription || "",
            content: `<!DOCTYPE html><html><head><title>${page.metaTitle || page.title}</title></head><body><h1>${page.title}</h1></body></html>`,
            template: "pseo",
            isPublished: true,
            metaTitle: page.metaTitle || page.title,
            metaDescription: page.metaDescription || "",
          })
          .returning({ id: workspaceSitePages.id });

        await db
          .update(pseoPages)
          .set({
            qualityGateStatus: "pass",
            isPublished: true,
            venueSitePageId: sitePage.id,
            updatedAt: new Date(),
          })
          .where(eq(pseoPages.id, page.id));

        approved++;
      } catch {}
    }

    return res.json({ success: true, approved, total: reviewPages.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Bulk approve failed" });
  }
});

router.post("/review/bulk-reject", async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.body;
    if (!campaignId) {
      return res.status(400).json({ error: "campaignId required" });
    }

    await db
      .update(pseoPages)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(pseoPages.campaignId, campaignId),
          inArray(pseoPages.qualityGateStatus, ["fail", "review"]),
          isNull(pseoPages.deletedAt)
        )
      );

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Bulk reject failed" });
  }
});

export default router;
