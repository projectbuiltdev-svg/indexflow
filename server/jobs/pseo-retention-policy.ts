import { db } from "../db";
import { pseoReviewQueue } from "../../db/schema/pseo-review-queue";
import { pseoIndexingQueue } from "../../db/schema/pseo-indexing-queue";
import { pseoAuditLog } from "../../db/schema/pseo-audit-log";
import { softDeleteWhere } from "../utils/pseo-soft-delete";
import { and, lt, isNull, inArray, sql } from "drizzle-orm";

const REVIEW_QUEUE_RETENTION_DAYS = 90;
const INDEXING_QUEUE_RETENTION_MONTHS = 6;

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function monthsAgo(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d;
}

export async function runRetentionPolicy(): Promise<{
  reviewQueueDeleted: number;
  indexingQueueDeleted: number;
}> {
  const reviewCutoff = daysAgo(REVIEW_QUEUE_RETENTION_DAYS);
  const reviewQueueDeleted = await softDeleteWhere(
    pseoReviewQueue,
    and(
      lt(pseoReviewQueue.createdAt, reviewCutoff),
      inArray(pseoReviewQueue.status, ["approved", "rejected", "resolved"])
    )!
  );

  const indexingCutoff = monthsAgo(INDEXING_QUEUE_RETENTION_MONTHS);
  const indexingQueueDeleted = await softDeleteWhere(
    pseoIndexingQueue,
    lt(pseoIndexingQueue.createdAt, indexingCutoff)!
  );

  try {
    await db.insert(pseoAuditLog).values({
      campaignId: "system",
      venueId: "system",
      action: "retention-policy-run",
      message: `Retention policy completed: ${reviewQueueDeleted} review queue records soft-deleted (>${REVIEW_QUEUE_RETENTION_DAYS}d resolved), ${indexingQueueDeleted} indexing queue records soft-deleted (>${INDEXING_QUEUE_RETENTION_MONTHS}mo)`,
      level: "info",
      triggeredBy: "system",
      meta: {
        reviewQueueDeleted,
        indexingQueueDeleted,
        reviewCutoff: reviewCutoff.toISOString(),
        indexingCutoff: indexingCutoff.toISOString(),
        runAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("[pSEO Retention] Failed to write audit log:", err.message);
  }

  console.log(
    `[pSEO Retention] Completed: ${reviewQueueDeleted} review records, ${indexingQueueDeleted} indexing records soft-deleted`
  );

  return { reviewQueueDeleted, indexingQueueDeleted };
}

let retentionInterval: ReturnType<typeof setInterval> | null = null;

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function startRetentionSchedule(): void {
  if (retentionInterval) return;

  retentionInterval = setInterval(async () => {
    try {
      await runRetentionPolicy();
    } catch (err: any) {
      console.error("[pSEO Retention] Scheduled run failed:", err.message);
    }
  }, ONE_WEEK_MS);

  console.log("[pSEO Retention] Weekly schedule started");
}

export function stopRetentionSchedule(): void {
  if (retentionInterval) {
    clearInterval(retentionInterval);
    retentionInterval = null;
    console.log("[pSEO Retention] Schedule stopped");
  }
}
