import { Router } from "express";
import { db } from "../../db";
import { pseoCampaigns, pseoPages, pseoServices, pseoLocations } from "@shared/schema";
import { pseoKeywords } from "../../../db/schema/pseo-keywords";
import { eq, and, isNull, sql, desc } from "drizzle-orm";
import { trackCampaignRanks } from "../../jobs/pseo-rank-tracker";
import { calculateRankMovement } from "../../integrations/google-search-console-rank-client";
import type { RankMovement } from "../../integrations/google-search-console-rank-client";

const router = Router();

router.get("/campaigns/:id/ranks", async (req, res) => {
  try {
    const campaignId = req.params.id;

    const [campaign] = await db
      .select()
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.id, campaignId));

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const keywords = await db
      .select({
        id: pseoKeywords.id,
        pageId: pseoKeywords.pageId,
        keyword: pseoKeywords.keyword,
        isPrimary: pseoKeywords.isPrimary,
        position: pseoKeywords.position,
        previousPosition: pseoKeywords.previousPosition,
        clicks: pseoKeywords.clicks,
        impressions: pseoKeywords.impressions,
        ctr: pseoKeywords.ctr,
        lastCheckedAt: pseoKeywords.lastCheckedAt,
      })
      .from(pseoKeywords)
      .where(
        and(
          eq(pseoKeywords.campaignId, campaignId),
          isNull(pseoKeywords.deletedAt)
        )
      )
      .orderBy(desc(pseoKeywords.isPrimary), pseoKeywords.keyword);

    const pages = await db
      .select({
        id: pseoPages.id,
        title: pseoPages.title,
        slug: pseoPages.slug,
        serviceId: pseoPages.serviceId,
        locationId: pseoPages.locationId,
      })
      .from(pseoPages)
      .where(
        and(
          eq(pseoPages.campaignId, campaignId),
          isNull(pseoPages.deletedAt)
        )
      );

    const pageMap = new Map(pages.map((p) => [p.id, p]));

    const services = await db
      .select({ id: pseoServices.id, name: pseoServices.name })
      .from(pseoServices)
      .where(eq(pseoServices.campaignId, campaignId));

    const locations = await db
      .select({ id: pseoLocations.id, name: pseoLocations.name })
      .from(pseoLocations)
      .where(eq(pseoLocations.campaignId, campaignId));

    const serviceMap = new Map(services.map((s) => [s.id, s.name]));
    const locationMap = new Map(locations.map((l) => [l.id, l.name]));

    let totalClicks = 0;
    let totalImpressions = 0;
    let positionSum = 0;
    let positionCount = 0;
    let ctrSum = 0;
    let ctrCount = 0;

    const ranks = keywords.map((kw) => {
      const page = kw.pageId ? pageMap.get(kw.pageId) : null;
      const movement: RankMovement = calculateRankMovement(kw.position, kw.previousPosition);
      const clicks = kw.clicks ?? 0;
      const impressions = kw.impressions ?? 0;
      const ctr = Number(kw.ctr ?? 0);

      totalClicks += clicks;
      totalImpressions += impressions;
      if (kw.position) {
        positionSum += kw.position;
        positionCount++;
      }
      if (ctr > 0) {
        ctrSum += ctr;
        ctrCount++;
      }

      return {
        id: kw.id,
        pageId: kw.pageId,
        pageTitle: page?.title || null,
        pageSlug: page?.slug || null,
        serviceId: page?.serviceId || null,
        serviceName: page?.serviceId ? serviceMap.get(page.serviceId) || null : null,
        locationId: page?.locationId || null,
        locationName: page?.locationId ? locationMap.get(page.locationId) || null : null,
        keyword: kw.keyword,
        isPrimary: kw.isPrimary,
        position: kw.position,
        previousPosition: kw.previousPosition,
        movement,
        clicks,
        impressions,
        ctr,
        lastCheckedAt: kw.lastCheckedAt,
      };
    });

    const summary = {
      averagePosition: positionCount > 0 ? Math.round((positionSum / positionCount) * 10) / 10 : null,
      totalClicks,
      totalImpressions,
      averageCtr: ctrCount > 0 ? Math.round((ctrSum / ctrCount) * 10000) / 10000 : null,
      keywordsTracked: keywords.length,
      lastUpdated: keywords.reduce((latest: string | null, k) => {
        if (!k.lastCheckedAt) return latest;
        const ts = new Date(k.lastCheckedAt).toISOString();
        return !latest || ts > latest ? ts : latest;
      }, null),
    };

    const filterOptions = {
      services: services.map((s) => ({ id: s.id, name: s.name })),
      locations: locations.map((l) => ({ id: l.id, name: l.name })),
    };

    res.json({ ranks, summary, filterOptions });
  } catch (error: any) {
    console.error("[pSEO Ranks] Failed to fetch ranks:", error.message);
    res.status(500).json({ error: "Failed to fetch rank data" });
  }
});

router.post("/campaigns/:id/ranks/refresh", async (req, res) => {
  try {
    const campaignId = req.params.id;

    const [campaign] = await db
      .select()
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.id, campaignId));

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const result = await trackCampaignRanks(campaignId, campaign.venueId);

    res.json({
      message: "Rank refresh complete",
      ...result,
    });
  } catch (error: any) {
    console.error("[pSEO Ranks] Refresh failed:", error.message);
    res.status(500).json({ error: "Failed to refresh ranks" });
  }
});

export default router;
