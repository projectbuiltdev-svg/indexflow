import { Router, Request, Response } from "express";
import { storage } from "../../storage";
import { AI_COST_ESTIMATES, estimateCampaignCost } from "../../config/pseo-ai-cost-estimates";
import { TIER_CAMPAIGN_LIMITS } from "../../config/pseo-geographic-divisions";
import { resolveAiKey } from "../../ai-chat";
import { db } from "../../db";
import { pseoCampaigns, pseoServices, pseoLocations, pseoPages } from "@shared/schema";
import { eq, and, count, isNull, inArray, desc, sql } from "drizzle-orm";
import { processGenerationQueue } from "../../jobs/pseo-generation-queue";
import { canTransition, getAvailableTransitions, CampaignState } from "../../pseo/campaign-state-machine";
import { pseoAuditLog } from "../../../db/schema/pseo-audit-log";

const router = Router();

router.get("/wizard/byok-models", async (req: Request, res: Response) => {
  try {
    const workspaceId = req.query.workspaceId as string;
    if (!workspaceId) {
      return res.status(400).json({ error: "workspaceId required" });
    }

    const providers = await storage.getAiProviderSettings(workspaceId);
    const enabledProviders = providers.filter((p) => p.isEnabled && p.apiKey);

    const models = AI_COST_ESTIMATES
      .filter((est) => enabledProviders.some((p) => p.provider === est.provider))
      .map((est) => ({
        model: est.model,
        provider: est.provider,
        costPer665Pages: est.costPer665Pages,
        costPerPage: est.costPerPage,
      }));

    return res.json({ models });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch models" });
  }
});

router.get("/wizard/validate-byok", async (req: Request, res: Response) => {
  try {
    const workspaceId = req.query.workspaceId as string;
    if (!workspaceId) {
      return res.status(400).json({ error: "workspaceId required" });
    }

    const aiKey = await resolveAiKey(workspaceId, "openai");
    const hasValidAiKey = !!aiKey.apiKey;

    const providers = await storage.getAiProviderSettings(workspaceId);
    const imageProviders = ["unsplash", "pexels", "pixabay"];
    const hasImageBank = providers.some((p) => imageProviders.includes(p.provider) && p.isEnabled && p.apiKey);

    return res.json({
      hasValidAiKey,
      aiKeySource: aiKey.source,
      hasImageBank,
      gscVerified: false,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Validation failed" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      workspaceId,
      name,
      urlStructure,
      templateHtml,
      templateLockedZones,
      aiModel,
      services: servicesList,
      locations: locationsList,
      keywords,
      matrix,
      totalPages,
    } = req.body;

    if (!workspaceId || !name || !urlStructure) {
      return res.status(400).json({ error: "workspaceId, name, and urlStructure are required" });
    }

    const workspace = await storage.getWorkspace(workspaceId);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const planTier = (workspace as any).planTier || "solo";
    const limit = TIER_CAMPAIGN_LIMITS[planTier] ?? 1;

    if (limit > 0) {
      const existing = await db
        .select({ id: pseoCampaigns.id })
        .from(pseoCampaigns)
        .where(
          require("drizzle-orm").eq(pseoCampaigns.venueId, workspaceId)
        );

      if (existing.length >= limit) {
        return res.status(403).json({
          error: `Campaign limit reached for ${planTier} plan (${limit} campaign${limit !== 1 ? "s" : ""})`,
        });
      }
    }

    const [campaign] = await db
      .insert(pseoCampaigns)
      .values({
        venueId: workspaceId,
        name,
        status: "active",
        urlStructure,
        templateHtml: templateHtml || null,
        templateLockedZones: templateLockedZones || [],
        aiModel: aiModel || "gpt-4o-mini",
        totalPages: totalPages || 0,
        activatedAt: new Date(),
      })
      .returning();

    if (Array.isArray(servicesList) && servicesList.length > 0) {
      const serviceValues = servicesList.map((s: any) => ({
        campaignId: campaign.id,
        venueId: workspaceId,
        name: s.name,
        slug: slugify(s.name),
        keywords: s.keywords || [],
        isExcluded: false,
      }));
      await db.insert(pseoServices).values(serviceValues);
    }

    if (Array.isArray(locationsList) && locationsList.length > 0) {
      const locationValues = locationsList.map((l: any) => ({
        campaignId: campaign.id,
        venueId: workspaceId,
        name: l.name,
        slug: slugify(l.name),
        latitude: String(l.lat),
        longitude: String(l.lng),
        state: l.state || null,
        country: l.country || "US",
        isExcluded: l.excluded || false,
      }));
      await db.insert(pseoLocations).values(locationValues);
    }

    return res.status(201).json({ id: campaign.id, status: campaign.status });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Campaign creation failed" });
  }
});

router.post("/:id/generate", async (req: Request, res: Response) => {
  try {
    const campaignId = req.params.id as string;

    const [campaign] = await db
      .select()
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.id, campaignId))
      .limit(1);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    if (campaign.status !== "active" && campaign.status !== "generating") {
      return res.status(400).json({ error: `Campaign must be in active status to generate (current: ${campaign.status})` });
    }

    await db
      .update(pseoCampaigns)
      .set({ status: "generating", updatedAt: new Date() })
      .where(eq(pseoCampaigns.id, campaignId));

    res.json({ status: "generating", campaignId });

    processGenerationQueue(campaignId, campaign.venueId).catch((err) => {
      console.error(`[pseo-generation] Campaign ${campaignId} failed:`, err.message);
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to start generation" });
  }
});

router.get("/:id/progress", async (req: Request, res: Response) => {
  try {
    const campaignId = req.params.id as string;

    const [campaign] = await db
      .select({
        id: pseoCampaigns.id,
        status: pseoCampaigns.status,
        totalPages: pseoCampaigns.totalPages,
        pagesGenerated: pseoCampaigns.pagesGenerated,
        pagesPublished: pseoCampaigns.pagesPublished,
      })
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.id, campaignId))
      .limit(1);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const total = campaign.totalPages || 0;
    const generated = campaign.pagesGenerated || 0;
    const percentage = total > 0 ? Math.round((generated / total) * 100) : 0;

    return res.json({
      campaignId: campaign.id,
      status: campaign.status,
      total,
      generated,
      published: campaign.pagesPublished || 0,
      percentage,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch progress" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const workspaceId = req.query.workspaceId as string;
    if (!workspaceId) {
      return res.status(400).json({ error: "workspaceId required" });
    }

    const campaigns = await db
      .select()
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.venueId, workspaceId))
      .orderBy(desc(pseoCampaigns.createdAt));

    const campaignIds = campaigns.map((c) => c.id);

    let serviceCounts: Record<string, number> = {};
    let locationCounts: Record<string, number> = {};

    if (campaignIds.length > 0) {
      const svcRows = await db
        .select({ campaignId: pseoServices.campaignId, cnt: count() })
        .from(pseoServices)
        .where(inArray(pseoServices.campaignId, campaignIds))
        .groupBy(pseoServices.campaignId);
      serviceCounts = Object.fromEntries(svcRows.map((r) => [r.campaignId, Number(r.cnt)]));

      const locRows = await db
        .select({ campaignId: pseoLocations.campaignId, cnt: count() })
        .from(pseoLocations)
        .where(inArray(pseoLocations.campaignId, campaignIds))
        .groupBy(pseoLocations.campaignId);
      locationCounts = Object.fromEntries(locRows.map((r) => [r.campaignId, Number(r.cnt)]));
    }

    const items = campaigns.map((c) => ({
      ...c,
      servicesCount: serviceCounts[c.id] || 0,
      locationsCount: locationCounts[c.id] || 0,
      availableTransitions: getAvailableTransitions(c.status as CampaignState),
    }));

    return res.json({ campaigns: items });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to list campaigns" });
  }
});

router.get("/:id/detail", async (req: Request, res: Response) => {
  try {
    const campaignId = req.params.id as string;

    const [campaign] = await db
      .select()
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.id, campaignId))
      .limit(1);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const [svcCount] = await db
      .select({ cnt: count() })
      .from(pseoServices)
      .where(eq(pseoServices.campaignId, campaignId));

    const [locCount] = await db
      .select({ cnt: count() })
      .from(pseoLocations)
      .where(eq(pseoLocations.campaignId, campaignId));

    const statusCounts = await db
      .select({ status: pseoPages.qualityGateStatus, cnt: count() })
      .from(pseoPages)
      .where(and(eq(pseoPages.campaignId, campaignId), isNull(pseoPages.deletedAt)))
      .groupBy(pseoPages.qualityGateStatus);

    const statusMap: Record<string, number> = {};
    for (const row of statusCounts) {
      statusMap[row.status] = Number(row.cnt);
    }

    const [publishedCount] = await db
      .select({ cnt: count() })
      .from(pseoPages)
      .where(and(eq(pseoPages.campaignId, campaignId), eq(pseoPages.isPublished, true), isNull(pseoPages.deletedAt)));

    const [deletedCount] = await db
      .select({ cnt: count() })
      .from(pseoPages)
      .where(and(eq(pseoPages.campaignId, campaignId), sql`${pseoPages.deletedAt} IS NOT NULL`));

    return res.json({
      campaign: {
        ...campaign,
        servicesCount: Number(svcCount?.cnt) || 0,
        locationsCount: Number(locCount?.cnt) || 0,
        availableTransitions: getAvailableTransitions(campaign.status as CampaignState),
      },
      stats: {
        totalPages: campaign.totalPages || 0,
        pagesGenerated: campaign.pagesGenerated || 0,
        published: Number(publishedCount?.cnt) || 0,
        inReview: (statusMap["fail"] || 0) + (statusMap["review"] || 0),
        failed: statusMap["fail"] || 0,
        similarityHolds: statusMap["review"] || 0,
        qualityGateFailures: statusMap["fail"] || 0,
        deleted: Number(deletedCount?.cnt) || 0,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch campaign detail" });
  }
});

router.get("/:id/pages", async (req: Request, res: Response) => {
  try {
    const campaignId = req.params.id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    const statusFilter = req.query.status as string;
    const search = req.query.search as string;

    let conditions = [eq(pseoPages.campaignId, campaignId)];

    if (statusFilter === "published") {
      conditions.push(eq(pseoPages.isPublished, true));
      conditions.push(isNull(pseoPages.deletedAt));
    } else if (statusFilter === "draft") {
      conditions.push(eq(pseoPages.qualityGateStatus, "pending"));
      conditions.push(isNull(pseoPages.deletedAt));
    } else if (statusFilter === "held") {
      conditions.push(eq(pseoPages.qualityGateStatus, "review"));
      conditions.push(isNull(pseoPages.deletedAt));
    } else if (statusFilter === "failed") {
      conditions.push(eq(pseoPages.qualityGateStatus, "fail"));
      conditions.push(isNull(pseoPages.deletedAt));
    } else if (statusFilter === "deleted") {
      conditions.push(sql`${pseoPages.deletedAt} IS NOT NULL`);
    } else {
      conditions.push(isNull(pseoPages.deletedAt));
    }

    if (search) {
      conditions.push(sql`(${pseoPages.title} ILIKE ${'%' + search + '%'} OR ${pseoPages.slug} ILIKE ${'%' + search + '%'})`);
    }

    const pages = await db
      .select()
      .from(pseoPages)
      .where(and(...conditions))
      .orderBy(desc(pseoPages.createdAt))
      .limit(limit)
      .offset(offset);

    const [totalRow] = await db
      .select({ cnt: count() })
      .from(pseoPages)
      .where(and(...conditions));

    const total = Number(totalRow?.cnt) || 0;

    const serviceIds = [...new Set(pages.map((p) => p.serviceId).filter(Boolean))] as string[];
    const locationIds = [...new Set(pages.map((p) => p.locationId).filter(Boolean))] as string[];

    let servicesMap: Record<string, string> = {};
    let locationsMap: Record<string, string> = {};

    if (serviceIds.length > 0) {
      const svcs = await db.select({ id: pseoServices.id, name: pseoServices.name }).from(pseoServices).where(inArray(pseoServices.id, serviceIds));
      servicesMap = Object.fromEntries(svcs.map((s) => [s.id, s.name]));
    }
    if (locationIds.length > 0) {
      const locs = await db.select({ id: pseoLocations.id, name: pseoLocations.name }).from(pseoLocations).where(inArray(pseoLocations.id, locationIds));
      locationsMap = Object.fromEntries(locs.map((l) => [l.id, l.name]));
    }

    const items = pages.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      serviceName: p.serviceId ? servicesMap[p.serviceId] || "Unknown" : "Unknown",
      locationName: p.locationId ? locationsMap[p.locationId] || "Unknown" : "Unknown",
      qualityGateStatus: p.qualityGateStatus,
      similarityScore: p.similarityScore ? parseFloat(p.similarityScore) : null,
      isPublished: p.isPublished,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return res.json({
      pages: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch pages" });
  }
});

router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const campaignId = req.params.id as string;
    const { status: newStatus } = req.body;

    if (!newStatus) {
      return res.status(400).json({ error: "status is required" });
    }

    const [campaign] = await db
      .select()
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.id, campaignId))
      .limit(1);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const currentStatus = campaign.status as CampaignState;

    if (!canTransition(currentStatus, newStatus as CampaignState)) {
      const available = getAvailableTransitions(currentStatus);
      return res.status(400).json({
        error: `Invalid transition from "${currentStatus}" to "${newStatus}"`,
        availableTransitions: available.map((t) => ({ to: t.to, label: t.label })),
      });
    }

    await db
      .update(pseoCampaigns)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(pseoCampaigns.id, campaignId));

    try {
      await db.insert(pseoAuditLog).values({
        campaignId,
        venueId: campaign.venueId,
        action: "campaign_status_change",
        message: `Campaign status changed from ${currentStatus} to ${newStatus}`,
        level: "info",
        previousState: currentStatus,
        newState: newStatus,
      });
    } catch {}

    return res.json({
      success: true,
      previousStatus: currentStatus,
      newStatus,
      availableTransitions: getAvailableTransitions(newStatus as CampaignState),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Status transition failed" });
  }
});

router.get("/:id/activity", async (req: Request, res: Response) => {
  try {
    const campaignId = req.params.id as string;

    const entries = await db
      .select()
      .from(pseoAuditLog)
      .where(eq(pseoAuditLog.campaignId, campaignId))
      .orderBy(desc(pseoAuditLog.createdAt))
      .limit(10);

    return res.json({ entries });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch activity" });
  }
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default router;
