import { db } from "../db";
import { pseoIndexingQueue } from "../../db/schema/pseo-indexing-queue";
import { eq, and, lte, isNull, or, asc } from "drizzle-orm";
import { submitUrl, IndexingStorage, DefaultIndexingStorage } from "../integrations/google-indexing-client";
import {
  MAX_URLS_PER_HOUR,
  QUEUE_PROCESSOR_INTERVAL_MS,
  RETRY_AFTER_HOURS,
  MAX_RETRIES,
  RESUBMIT_AFTER_DAYS,
  FLAG_AFTER_DAYS,
} from "../config/pseo-indexing-rate-limits";

export interface QueueProcessorResult {
  processed: number;
  submitted: number;
  failed: number;
  flagged: number;
  resubmitted: number;
}

export async function processIndexingQueue(
  storage: IndexingStorage = new DefaultIndexingStorage()
): Promise<QueueProcessorResult> {
  const now = new Date();
  const result: QueueProcessorResult = {
    processed: 0,
    submitted: 0,
    failed: 0,
    flagged: 0,
    resubmitted: 0,
  };

  await handleResubmitsAndFlags(now, result);

  const pendingItems = await db
    .select()
    .from(pseoIndexingQueue)
    .where(
      and(
        or(
          eq(pseoIndexingQueue.status, "pending"),
          and(
            eq(pseoIndexingQueue.status, "retry"),
            lte(pseoIndexingQueue.nextRetryAt, now)
          )
        ),
        isNull(pseoIndexingQueue.deletedAt)
      )
    )
    .orderBy(asc(pseoIndexingQueue.priority), asc(pseoIndexingQueue.createdAt))
    .limit(MAX_URLS_PER_HOUR);

  for (const item of pendingItems) {
    result.processed++;

    const submitResult = await submitUrl(
      item.url,
      item.venueId,
      "URL_UPDATED",
      storage,
      item.campaignId
    );

    if (submitResult.success) {
      await db
        .update(pseoIndexingQueue)
        .set({
          status: "submitted",
          submittedAt: now,
          lastAttemptAt: now,
          attempts: item.attempts + 1,
        })
        .where(eq(pseoIndexingQueue.id, item.id));
      result.submitted++;
    } else if (submitResult.error === "rate_limited") {
      break;
    } else {
      const newAttempts = item.attempts + 1;
      if (newAttempts >= MAX_RETRIES) {
        await db
          .update(pseoIndexingQueue)
          .set({
            status: "failed",
            attempts: newAttempts,
            lastAttemptAt: now,
            errorMessage: submitResult.error || "Max retries exceeded",
          })
          .where(eq(pseoIndexingQueue.id, item.id));
        result.failed++;
      } else {
        const nextRetry = new Date(now.getTime() + RETRY_AFTER_HOURS * 3600000);
        await db
          .update(pseoIndexingQueue)
          .set({
            status: "retry",
            attempts: newAttempts,
            lastAttemptAt: now,
            nextRetryAt: nextRetry,
            errorMessage: submitResult.error || "Submission failed",
          })
          .where(eq(pseoIndexingQueue.id, item.id));
      }
    }
  }

  return result;
}

async function handleResubmitsAndFlags(
  now: Date,
  result: QueueProcessorResult
): Promise<void> {
  const resubmitCutoff = new Date(now.getTime() - RESUBMIT_AFTER_DAYS * 86400000);
  const flagCutoff = new Date(now.getTime() - FLAG_AFTER_DAYS * 86400000);

  const flagItems = await db
    .select()
    .from(pseoIndexingQueue)
    .where(
      and(
        eq(pseoIndexingQueue.status, "submitted"),
        isNull(pseoIndexingQueue.indexedAt),
        lte(pseoIndexingQueue.submittedAt, flagCutoff),
        isNull(pseoIndexingQueue.deletedAt)
      )
    );

  for (const item of flagItems) {
    await db
      .update(pseoIndexingQueue)
      .set({ status: "flagged" })
      .where(eq(pseoIndexingQueue.id, item.id));
    result.flagged++;
  }

  const resubmitItems = await db
    .select()
    .from(pseoIndexingQueue)
    .where(
      and(
        eq(pseoIndexingQueue.status, "submitted"),
        isNull(pseoIndexingQueue.indexedAt),
        lte(pseoIndexingQueue.submittedAt, resubmitCutoff),
        isNull(pseoIndexingQueue.deletedAt)
      )
    );

  for (const item of resubmitItems) {
    await db
      .update(pseoIndexingQueue)
      .set({
        status: "pending",
        attempts: 0,
        nextRetryAt: null,
        errorMessage: null,
      })
      .where(eq(pseoIndexingQueue.id, item.id));
    result.resubmitted++;
  }
}

let processorInterval: ReturnType<typeof setInterval> | null = null;

export function startIndexingQueueProcessor(
  storage?: IndexingStorage
): void {
  if (processorInterval) return;

  console.log(`[Indexing Queue] Starting processor, interval: ${QUEUE_PROCESSOR_INTERVAL_MS}ms`);
  processorInterval = setInterval(async () => {
    try {
      const result = await processIndexingQueue(storage);
      if (result.processed > 0) {
        console.log(
          `[Indexing Queue] Processed: ${result.processed}, Submitted: ${result.submitted}, Failed: ${result.failed}, Flagged: ${result.flagged}, Resubmitted: ${result.resubmitted}`
        );
      }
    } catch (err: any) {
      console.error("[Indexing Queue] Processor error:", err.message);
    }
  }, QUEUE_PROCESSOR_INTERVAL_MS);
}

export function stopIndexingQueueProcessor(): void {
  if (processorInterval) {
    clearInterval(processorInterval);
    processorInterval = null;
  }
}
