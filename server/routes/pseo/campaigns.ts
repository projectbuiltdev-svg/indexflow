import { Router, Request, Response } from "express";
import { storage } from "../../storage";
import { AI_COST_ESTIMATES, estimateCampaignCost } from "../../config/pseo-ai-cost-estimates";
import { TIER_CAMPAIGN_LIMITS } from "../../config/pseo-geographic-divisions";
import { resolveAiKey } from "../../ai-chat";
import { db } from "../../db";
import { pseoCampaigns, pseoServices, pseoLocations } from "@shared/schema";

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default router;
