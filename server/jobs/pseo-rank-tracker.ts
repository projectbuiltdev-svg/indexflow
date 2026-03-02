import { db } from "../db";
import { pseoCampaigns, pseoPages } from "@shared/schema";
import { pseoKeywords } from "../../db/schema/pseo-keywords";
import { pseoAuditLog } from "../../db/schema/pseo-audit-log";
import { eq, and, isNull, ne } from "drizzle-orm";
import {
  getRankData,
  calculateRankMovement,
  shouldFlagPage,
} from "../integrations/google-search-console-rank-client";
import {
  GSC_POLLING_INTERVAL_HOURS,
  FLAG_AFTER_DAYS,
} from "../config/pseo-indexing-rate-limits";

export interface RankTrackResult {
  campaignId: string;
  keywordsUpdated: number;
  pagesFlagged: number;
  movements: { improved: number; declined: number; stable: number; new: number };
}

export async function trackCampaignRanks(
  campaignId: string,
  workspaceId: string
): Promise<RankTrackResult> {
  const result: RankTrackResult = {
    campaignId,
    keywordsUpdated: 0,
    pagesFlagged: 0,
    movements: { improved: 0, declined: 0, stable: 0, new: 0 },
  };

  const [campaign] = await db
    .select()
    .from(pseoCampaigns)
    .where(eq(pseoCampaigns.id, campaignId));

  if (!campaign) return result;

  const publishedPages = await db
    .select({
      id: pseoPages.id,
      slug: pseoPages.slug,
      title: pseoPages.title,
      isPublished: pseoPages.isPublished,
      createdAt: pseoPages.createdAt,
    })
    .from(pseoPages)
    .where(
      and(
        eq(pseoPages.campaignId, campaignId),
        eq(pseoPages.isPublished, true),
        isNull(pseoPages.deletedAt)
      )
    );

  if (publishedPages.length === 0) return result;

  const keywords = await db
    .select()
    .from(pseoKeywords)
    .where(
      and(
        eq(pseoKeywords.campaignId, campaignId),
        isNull(pseoKeywords.deletedAt)
      )
    );

  const keywordsByPage = new Map<string, typeof keywords>();
  for (const kw of keywords) {
    if (!kw.pageId) continue;
    const existing = keywordsByPage.get(kw.pageId) || [];
    existing.push(kw);
    keywordsByPage.set(kw.pageId, existing);
  }

  const domain = campaign.urlStructure?.split("/")[0] || "";
  const urls = publishedPages.map((p) => {
    const base = domain.startsWith("http") ? domain : `https://${domain}`;
    return `${base.replace(/\/+$/, "")}/${p.slug}`;
  });

  const gscResult = await getRankData(domain, urls, workspaceId);

  if (!gscResult.connected) {
    await logAudit(campaignId, workspaceId, "rank_check_skipped", "GSC not connected — skipping rank check", "warn");
    return result;
  }

  const rankByPageQuery = new Map<string, { position: number; clicks: number; impressions: number; ctr: number }>();
  for (const row of gscResult.rows) {
    const key = `${row.page}|||${row.query}`;
    const existing = rankByPageQuery.get(key);
    if (!existing || row.clicks > existing.clicks) {
      rankByPageQuery.set(key, {
        position: row.position,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
      });
    }
  }

  const now = new Date();

  for (const page of publishedPages) {
    const pageKeywords = keywordsByPage.get(page.id) || [];
    let pageHasImpressions = false;

    for (const kw of pageKeywords) {
      const pageUrl = urls.find((u) => u.endsWith(`/${page.slug}`));
      if (!pageUrl) continue;

      const key = `${pageUrl}|||${kw.keyword}`;
      const rankData = rankByPageQuery.get(key);

      const currentPosition = rankData?.position ? Math.round(rankData.position) : null;
      const movement = calculateRankMovement(currentPosition, kw.position);
      result.movements[movement]++;

      if (rankData && rankData.impressions > 0) {
        pageHasImpressions = true;
      }

      await db
        .update(pseoKeywords)
        .set({
          previousPosition: kw.position,
          position: currentPosition,
          clicks: rankData?.clicks ?? 0,
          impressions: rankData?.impressions ?? 0,
          ctr: String(rankData?.ctr ?? 0),
          lastCheckedAt: now,
        })
        .where(eq(pseoKeywords.id, kw.id));

      result.keywordsUpdated++;
    }

    if (shouldFlagPage(pageHasImpressions ? 1 : 0, page.createdAt, FLAG_AFTER_DAYS)) {
      await db
        .update(pseoPages)
        .set({ qualityGateStatus: "flagged" })
        .where(
          and(
            eq(pseoPages.id, page.id),
            ne(pseoPages.qualityGateStatus, "flagged")
          )
        );
      result.pagesFlagged++;
    }
  }

  await logAudit(
    campaignId,
    workspaceId,
    "rank_check_complete",
    `Rank check complete: ${result.keywordsUpdated} keywords updated, ${result.pagesFlagged} pages flagged. Movements: +${result.movements.improved} -${result.movements.declined} =${result.movements.stable} *${result.movements.new}`,
    "info",
    result
  );

  return result;
}

export async function runRankTrackerForAllCampaigns(): Promise<void> {
  try {
    const monitoringCampaigns = await db
      .select({
        id: pseoCampaigns.id,
        venueId: pseoCampaigns.venueId,
      })
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.status, "monitoring"));

    console.log(`[pSEO Rank Tracker] Found ${monitoringCampaigns.length} campaigns in monitoring state`);

    for (const campaign of monitoringCampaigns) {
      try {
        const result = await trackCampaignRanks(campaign.id, campaign.venueId);
        console.log(`[pSEO Rank Tracker] Campaign ${campaign.id}: ${result.keywordsUpdated} keywords, ${result.pagesFlagged} flagged`);
      } catch (err: any) {
        console.error(`[pSEO Rank Tracker] Campaign ${campaign.id} failed:`, err.message);
      }
    }
  } catch (err: any) {
    console.error("[pSEO Rank Tracker] Job failed:", err.message);
  }
}

async function logAudit(
  campaignId: string,
  workspaceId: string,
  action: string,
  message: string,
  level: string,
  meta?: Record<string, any>
): Promise<void> {
  try {
    await db.insert(pseoAuditLog).values({
      campaignId,
      venueId: workspaceId,
      action,
      message,
      level,
      meta: meta || {},
    });
  } catch (err: any) {
    console.error("[pSEO Rank Tracker] Audit log failed:", err.message);
  }
}

let rankTrackerInterval: ReturnType<typeof setInterval> | null = null;

export function startRankTrackerScheduler(): void {
  if (rankTrackerInterval) return;

  const intervalMs = GSC_POLLING_INTERVAL_HOURS * 60 * 60 * 1000;
  console.log(`[pSEO Rank Tracker] Scheduler started (every ${GSC_POLLING_INTERVAL_HOURS}h)`);

  rankTrackerInterval = setInterval(() => {
    runRankTrackerForAllCampaigns();
  }, intervalMs);
}

export function stopRankTrackerScheduler(): void {
  if (rankTrackerInterval) {
    clearInterval(rankTrackerInterval);
    rankTrackerInterval = null;
  }
}
