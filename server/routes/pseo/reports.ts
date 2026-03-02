import { Router } from "express";
import { db } from "../../db";
import { pseoCampaigns, pseoPages, pseoServices, pseoLocations } from "@shared/schema";
import { pseoKeywords } from "../../../db/schema/pseo-keywords";
import { pseoIndexingQueue } from "../../../db/schema/pseo-indexing-queue";
import { eq, and, isNull, sql, count, avg } from "drizzle-orm";

const router = Router();

function countWords(text: string | null): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateWordCount(paragraphs: string[] | null, title: string | null, h1: string | null): number {
  let total = countWords(title) + countWords(h1);
  if (paragraphs && Array.isArray(paragraphs)) {
    for (const p of paragraphs) {
      total += countWords(p);
    }
  }
  return total;
}

router.get("/campaigns/:id/report", async (req, res) => {
  try {
    const campaignId = req.params.id;

    const [campaign] = await db
      .select()
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.id, campaignId));

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const pages = await db
      .select()
      .from(pseoPages)
      .where(
        and(
          eq(pseoPages.campaignId, campaignId),
          isNull(pseoPages.deletedAt)
        )
      );

    const services = await db
      .select({ id: pseoServices.id, name: pseoServices.name })
      .from(pseoServices)
      .where(eq(pseoServices.campaignId, campaignId));

    const locations = await db
      .select({ id: pseoLocations.id, name: pseoLocations.name })
      .from(pseoLocations)
      .where(eq(pseoLocations.campaignId, campaignId));

    const keywords = await db
      .select()
      .from(pseoKeywords)
      .where(
        and(
          eq(pseoKeywords.campaignId, campaignId),
          isNull(pseoKeywords.deletedAt)
        )
      );

    const indexingItems = await db
      .select()
      .from(pseoIndexingQueue)
      .where(
        and(
          eq(pseoIndexingQueue.campaignId, campaignId),
          isNull(pseoIndexingQueue.deletedAt)
        )
      );

    const serviceMap = new Map(services.map((s) => [s.id, s.name]));
    const locationMap = new Map(locations.map((l) => [l.id, l.name]));

    const published = pages.filter((p) => p.isPublished);
    const drafts = pages.filter((p) => !p.isPublished && p.qualityGateStatus === "pending");
    const held = pages.filter((p) => !p.isPublished && (p.qualityGateStatus === "held" || p.qualityGateStatus === "flagged"));
    const failed = pages.filter((p) => p.qualityGateStatus === "fail");

    const coverageGrid: Record<string, Record<string, string>> = {};
    const serviceCompletions: Record<string, { total: number; published: number }> = {};
    const locationCompletions: Record<string, { total: number; published: number }> = {};

    for (const svc of services) {
      coverageGrid[svc.id] = {};
      serviceCompletions[svc.id] = { total: 0, published: 0 };
    }
    for (const loc of locations) {
      locationCompletions[loc.id] = { total: 0, published: 0 };
    }

    for (const page of pages) {
      if (!page.serviceId || !page.locationId) continue;
      let status = "draft";
      if (page.isPublished) status = "published";
      else if (page.qualityGateStatus === "fail") status = "failed";
      else if (page.qualityGateStatus === "held" || page.qualityGateStatus === "flagged") status = "held";

      if (coverageGrid[page.serviceId]) {
        coverageGrid[page.serviceId][page.locationId] = status;
      }

      if (serviceCompletions[page.serviceId]) {
        serviceCompletions[page.serviceId].total++;
        if (page.isPublished) serviceCompletions[page.serviceId].published++;
      }
      if (locationCompletions[page.locationId]) {
        locationCompletions[page.locationId].total++;
        if (page.isPublished) locationCompletions[page.locationId].published++;
      }
    }

    const contentCoverage = {
      total: pages.length,
      published: published.length,
      draft: drafts.length,
      held: held.length,
      failed: failed.length,
      services: services.map((s) => ({
        id: s.id,
        name: s.name,
        completionPct: serviceCompletions[s.id]
          ? locations.length > 0
            ? Math.round((serviceCompletions[s.id].published / locations.length) * 100)
            : 0
          : 0,
      })),
      locations: locations.map((l) => ({
        id: l.id,
        name: l.name,
        completionPct: locationCompletions[l.id]
          ? services.length > 0
            ? Math.round((locationCompletions[l.id].published / services.length) * 100)
            : 0
          : 0,
      })),
      coverageGrid: Object.entries(coverageGrid).map(([serviceId, locs]) => ({
        serviceId,
        serviceName: serviceMap.get(serviceId) || "",
        locations: Object.entries(locs).map(([locationId, status]) => ({
          locationId,
          locationName: locationMap.get(locationId) || "",
          status,
        })),
      })),
    };

    const passCount = pages.filter((p) => p.qualityGateStatus === "pass").length;
    const failCount = pages.filter((p) => p.qualityGateStatus === "fail").length;
    const pendingCount = pages.filter((p) => p.qualityGateStatus === "pending").length;
    const heldCount = pages.filter((p) => p.qualityGateStatus === "held" || p.qualityGateStatus === "flagged").length;

    const failReasonCounts: Record<string, number> = {};
    for (const page of pages) {
      if (page.qualityFailReasons && Array.isArray(page.qualityFailReasons)) {
        for (const reason of page.qualityFailReasons) {
          failReasonCounts[reason] = (failReasonCounts[reason] || 0) + 1;
        }
      }
    }
    const topFailReasons = Object.entries(failReasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => ({ reason, count }));

    const wordCounts = published.map((p) =>
      estimateWordCount(p.paragraphVariants, p.title, p.h1Variant)
    );
    const avgWordCount = wordCounts.length > 0
      ? Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length)
      : 0;

    const qualitySummary = {
      passRate: pages.length > 0 ? Math.round((passCount / pages.length) * 100) : 0,
      gates: {
        pass: passCount,
        fail: failCount,
        pending: pendingCount,
        held: heldCount,
      },
      topFailReasons,
      avgWordCount,
    };

    const submittedCount = indexingItems.filter((i) => i.status === "submitted").length;
    const pendingIdxCount = indexingItems.filter((i) => i.status === "pending").length;
    const failedIdxCount = indexingItems.filter((i) => i.status === "failed").length;
    const flaggedIdxCount = indexingItems.filter((i) => i.status === "flagged").length;
    const resubmitCount = indexingItems.filter((i) => i.status === "retry").length;

    const indexedItems = indexingItems.filter((i) => i.indexedAt && i.submittedAt);
    let avgTimeToIndexMs: number | null = null;
    if (indexedItems.length > 0) {
      const totalMs = indexedItems.reduce((sum, i) => {
        return sum + (new Date(i.indexedAt!).getTime() - new Date(i.submittedAt!).getTime());
      }, 0);
      avgTimeToIndexMs = totalMs / indexedItems.length;
    }

    const indexingStatus = {
      totalSubmitted: indexingItems.length,
      submitted: submittedCount,
      pending: pendingIdxCount,
      failed: failedIdxCount,
      flagged: flaggedIdxCount,
      resubmitQueue: resubmitCount,
      avgTimeToIndexHours: avgTimeToIndexMs !== null
        ? Math.round(avgTimeToIndexMs / (1000 * 60 * 60) * 10) / 10
        : null,
    };

    const keywordsByPage = new Map<string, typeof keywords>();
    for (const kw of keywords) {
      if (!kw.pageId) continue;
      const existing = keywordsByPage.get(kw.pageId) || [];
      existing.push(kw);
      keywordsByPage.set(kw.pageId, existing);
    }

    let totalClicks = 0;
    let totalImpressions = 0;
    let positionSum = 0;
    let positionCount = 0;
    let ctrSum = 0;
    let ctrCount = 0;

    const pagePerformance: Array<{
      pageId: string;
      title: string;
      slug: string;
      clicks: number;
      impressions: number;
      avgPosition: number | null;
      ctr: number;
    }> = [];

    const positionBuckets = { "1-3": 0, "4-10": 0, "11-20": 0, "20+": 0 };

    for (const page of published) {
      const kws = keywordsByPage.get(page.id) || [];
      let pageClicks = 0;
      let pageImpressions = 0;
      let pagePositionSum = 0;
      let pagePositionCount = 0;
      let pageCtrSum = 0;
      let pageCtrCount = 0;

      for (const kw of kws) {
        const clicks = kw.clicks ?? 0;
        const impressions = kw.impressions ?? 0;
        const ctr = Number(kw.ctr ?? 0);
        const position = kw.position;

        pageClicks += clicks;
        pageImpressions += impressions;
        totalClicks += clicks;
        totalImpressions += impressions;

        if (position !== null && position !== undefined) {
          pagePositionSum += position;
          pagePositionCount++;
          positionSum += position;
          positionCount++;

          if (position <= 3) positionBuckets["1-3"]++;
          else if (position <= 10) positionBuckets["4-10"]++;
          else if (position <= 20) positionBuckets["11-20"]++;
          else positionBuckets["20+"]++;
        }

        if (ctr > 0) {
          pageCtrSum += ctr;
          pageCtrCount++;
          ctrSum += ctr;
          ctrCount++;
        }
      }

      pagePerformance.push({
        pageId: page.id,
        title: page.title,
        slug: page.slug,
        clicks: pageClicks,
        impressions: pageImpressions,
        avgPosition: pagePositionCount > 0
          ? Math.round((pagePositionSum / pagePositionCount) * 10) / 10
          : null,
        ctr: pageCtrCount > 0
          ? Math.round((pageCtrSum / pageCtrCount) * 10000) / 10000
          : 0,
      });
    }

    const top10Pages = [...pagePerformance]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    const hasGscData = keywords.some((k) => k.lastCheckedAt !== null);

    const performance = {
      connected: hasGscData,
      totalClicks,
      totalImpressions,
      averageCtr: ctrCount > 0 ? Math.round((ctrSum / ctrCount) * 10000) / 10000 : null,
      averagePosition: positionCount > 0 ? Math.round((positionSum / positionCount) * 10) / 10 : null,
      top10Pages,
      rankDistribution: positionBuckets,
    };

    res.json({
      campaignId,
      campaignName: campaign.name,
      generatedAt: new Date().toISOString(),
      contentCoverage,
      qualitySummary,
      indexingStatus,
      performance,
    });
  } catch (error: any) {
    console.error("[pSEO Reports] Failed to generate report:", error.message);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

router.get("/campaigns/:id/report/export", async (req, res) => {
  try {
    const campaignId = req.params.id;

    const [campaign] = await db
      .select()
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.id, campaignId));

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const pages = await db
      .select()
      .from(pseoPages)
      .where(
        and(
          eq(pseoPages.campaignId, campaignId),
          isNull(pseoPages.deletedAt)
        )
      );

    const services = await db
      .select({ id: pseoServices.id, name: pseoServices.name })
      .from(pseoServices)
      .where(eq(pseoServices.campaignId, campaignId));

    const locations = await db
      .select({ id: pseoLocations.id, name: pseoLocations.name })
      .from(pseoLocations)
      .where(eq(pseoLocations.campaignId, campaignId));

    const keywords = await db
      .select()
      .from(pseoKeywords)
      .where(
        and(
          eq(pseoKeywords.campaignId, campaignId),
          isNull(pseoKeywords.deletedAt)
        )
      );

    const indexingItems = await db
      .select()
      .from(pseoIndexingQueue)
      .where(
        and(
          eq(pseoIndexingQueue.campaignId, campaignId),
          isNull(pseoIndexingQueue.deletedAt)
        )
      );

    const serviceMap = new Map(services.map((s) => [s.id, s.name]));
    const locationMap = new Map(locations.map((l) => [l.id, l.name]));
    const indexingMap = new Map(indexingItems.map((i) => [i.pageId, i]));

    const keywordsByPage = new Map<string, typeof keywords>();
    for (const kw of keywords) {
      if (!kw.pageId) continue;
      const existing = keywordsByPage.get(kw.pageId) || [];
      existing.push(kw);
      keywordsByPage.set(kw.pageId, existing);
    }

    const csvHeaders = [
      "Title",
      "URL",
      "Service",
      "Location",
      "Status",
      "Word Count",
      "Quality Gate Status",
      "Failure Reasons",
      "Similarity Score",
      "Indexing Status",
      "Position",
      "Clicks",
      "Impressions",
      "CTR",
    ];

    const csvRows = pages.map((page) => {
      const serviceName = page.serviceId ? serviceMap.get(page.serviceId) || "" : "";
      const locationName = page.locationId ? locationMap.get(page.locationId) || "" : "";
      const status = page.isPublished ? "published" : page.qualityGateStatus === "fail" ? "failed" : page.qualityGateStatus === "held" || page.qualityGateStatus === "flagged" ? "held" : "draft";
      const wordCount = estimateWordCount(page.paragraphVariants, page.title, page.h1Variant);
      const failReasons = page.qualityFailReasons ? page.qualityFailReasons.join("; ") : "";
      const simScore = page.similarityScore || "";
      const idxItem = indexingMap.get(page.id);
      const idxStatus = idxItem ? idxItem.status : "not submitted";

      const pageKws = keywordsByPage.get(page.id) || [];
      const primaryKw = pageKws.find((k) => k.isPrimary);
      const position = primaryKw?.position ?? "";
      const clicks = pageKws.reduce((sum, k) => sum + (k.clicks ?? 0), 0);
      const impressions = pageKws.reduce((sum, k) => sum + (k.impressions ?? 0), 0);
      const ctrVals = pageKws.filter((k) => Number(k.ctr ?? 0) > 0).map((k) => Number(k.ctr));
      const avgCtr = ctrVals.length > 0
        ? (ctrVals.reduce((a, b) => a + b, 0) / ctrVals.length * 100).toFixed(2) + "%"
        : "";

      const url = `${campaign.urlStructure || ""}/${page.slug}`;

      return [
        escapeCsv(page.title),
        escapeCsv(url),
        escapeCsv(serviceName),
        escapeCsv(locationName),
        status,
        String(wordCount),
        page.qualityGateStatus,
        escapeCsv(failReasons),
        String(simScore),
        idxStatus,
        String(position),
        String(clicks),
        String(impressions),
        avgCtr,
      ].join(",");
    });

    const csvContent = [csvHeaders.join(","), ...csvRows].join("\n");

    const safeName = campaign.name.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 50);
    const filename = `pseo-report-${safeName}-${new Date().toISOString().split("T")[0]}.csv`;

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csvContent);
  } catch (error: any) {
    console.error("[pSEO Reports] CSV export failed:", error.message);
    res.status(500).json({ error: "Failed to export report" });
  }
});

function escapeCsv(value: string): string {
  if (!value) return "";
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export default router;
