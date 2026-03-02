import { db } from "../db";
import { seoSettings } from "@shared/schema";
import { pseoAuditLog } from "../../db/schema/pseo-audit-log";
import { pseoIndexingQueue } from "../../db/schema/pseo-indexing-queue";
import { pseoPages } from "@shared/schema";
import { eq, and, inArray } from "drizzle-orm";
import {
  MAX_URLS_PER_HOUR,
} from "../config/pseo-indexing-rate-limits";

const GOOGLE_INDEXING_API_URL = "https://indexing.googleapis.com/v3/urlNotifications:publish";
const GSC_PROVIDER = "google-search-console";

export interface IndexingSubmitResult {
  success: boolean;
  notifyTime?: string;
  error?: string;
}

export interface BatchSubmitResult {
  submitted: number;
  queued: number;
  failed: number;
}

export interface IndexingStorage {
  getGscToken(workspaceId: string): Promise<string | null>;
  logAudit(entry: {
    campaignId: string;
    venueId: string;
    pageId?: string;
    level: string;
    action: string;
    message: string;
    errorType?: string;
    meta?: Record<string, any>;
  }): Promise<void>;
}

const hourlySubmissionCounts = new Map<string, { count: number; resetAt: number }>();

function getHourlyCount(workspaceId: string): number {
  const entry = hourlySubmissionCounts.get(workspaceId);
  if (!entry) return 0;
  if (Date.now() > entry.resetAt) {
    hourlySubmissionCounts.delete(workspaceId);
    return 0;
  }
  return entry.count;
}

function incrementHourlyCount(workspaceId: string, amount: number): void {
  const entry = hourlySubmissionCounts.get(workspaceId);
  if (!entry || Date.now() > entry.resetAt) {
    hourlySubmissionCounts.set(workspaceId, {
      count: amount,
      resetAt: Date.now() + 3600000,
    });
  } else {
    entry.count += amount;
  }
}

export class DefaultIndexingStorage implements IndexingStorage {
  async getGscToken(workspaceId: string): Promise<string | null> {
    try {
      const [settings] = await db
        .select()
        .from(seoSettings)
        .where(
          and(
            eq(seoSettings.workspaceId, workspaceId),
            eq(seoSettings.provider, GSC_PROVIDER),
            eq(seoSettings.isConnected, true)
          )
        );
      return settings?.apiKey || null;
    } catch {
      return null;
    }
  }

  async logAudit(entry: {
    campaignId: string;
    venueId: string;
    pageId?: string;
    level: string;
    action: string;
    message: string;
    errorType?: string;
    meta?: Record<string, any>;
  }): Promise<void> {
    try {
      await db.insert(pseoAuditLog).values({
        campaignId: entry.campaignId,
        venueId: entry.venueId,
        pageId: entry.pageId || null,
        level: entry.level,
        action: entry.action,
        message: entry.message,
        errorType: entry.errorType || null,
        meta: entry.meta || null,
      });
    } catch (err: any) {
      console.error("[Indexing] Failed to log audit:", err.message);
    }
  }
}

export async function submitUrl(
  url: string,
  workspaceId: string,
  type: "URL_UPDATED" | "URL_DELETED",
  storage: IndexingStorage = new DefaultIndexingStorage(),
  campaignId: string = ""
): Promise<IndexingSubmitResult> {
  const token = await storage.getGscToken(workspaceId);
  if (!token) {
    return { success: false, error: "No GSC token available" };
  }

  try {
    const resp = await fetch(GOOGLE_INDEXING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, type }),
      signal: AbortSignal.timeout(15000),
    });

    if (resp.status === 429) {
      console.warn(`[Indexing] Rate limited for ${url}, queuing for retry`);
      await storage.logAudit({
        campaignId,
        venueId: workspaceId,
        level: "warn",
        action: "indexing_rate_limited",
        message: `Rate limited when submitting ${url}, queued for retry`,
        meta: { url, type },
      });
      return { success: false, error: "rate_limited" };
    }

    if (resp.status === 401) {
      console.error(`[Indexing] Token expired for workspace ${workspaceId}`);
      await storage.logAudit({
        campaignId,
        venueId: workspaceId,
        level: "error",
        action: "indexing_auth_failure",
        message: `Google OAuth token expired for workspace ${workspaceId}`,
        errorType: "auth_expired",
        meta: { url, type, status: 401 },
      });
      return { success: false, error: "token_expired" };
    }

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => "");
      return { success: false, error: `HTTP ${resp.status}: ${errBody}` };
    }

    const data = await resp.json();
    return {
      success: true,
      notifyTime: data.urlNotificationMetadata?.latestUpdate?.notifyTime || new Date().toISOString(),
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error" };
  }
}

export async function submitBatch(
  urls: Array<{ url: string; pageId?: string }>,
  workspaceId: string,
  campaignId: string = "",
  storage: IndexingStorage = new DefaultIndexingStorage()
): Promise<BatchSubmitResult> {
  const currentCount = getHourlyCount(workspaceId);
  const remaining = Math.max(0, MAX_URLS_PER_HOUR - currentCount);

  const toSubmitNow = urls.slice(0, remaining);
  const toQueue = urls.slice(remaining);

  let submitted = 0;
  let failed = 0;

  for (const item of toSubmitNow) {
    const result = await submitUrl(item.url, workspaceId, "URL_UPDATED", storage, campaignId);
    if (result.success) {
      submitted++;
    } else if (result.error === "rate_limited") {
      toQueue.push(item);
    } else {
      failed++;
    }
  }

  incrementHourlyCount(workspaceId, submitted);

  return {
    submitted,
    queued: toQueue.length,
    failed,
  };
}

export async function enqueueForIndexing(
  pageIds: string[],
  campaignId: string,
  workspaceId: string
): Promise<number> {
  if (pageIds.length === 0) return 0;

  const pages = await db
    .select({
      id: pseoPages.id,
      slug: pseoPages.slug,
      pageType: pseoPages.pageType,
    })
    .from(pseoPages)
    .where(inArray(pseoPages.id, pageIds));

  const priorityMap: Record<string, number> = {
    hub: 1,
    service: 2,
    location: 3,
  };

  let enqueued = 0;
  for (const page of pages) {
    const priority = priorityMap[page.pageType] ?? 4;
    try {
      await db.insert(pseoIndexingQueue).values({
        campaignId,
        venueId: workspaceId,
        pageId: page.id,
        url: `/${page.slug}`,
        status: "pending",
        method: "google-indexing-api",
        attempts: 0,
        maxAttempts: 3,
        priority,
      });
      enqueued++;
    } catch (err: any) {
      console.error(`[Indexing] Failed to enqueue page ${page.id}:`, err.message);
    }
  }

  return enqueued;
}

export function resetHourlyCounts(): void {
  hourlySubmissionCounts.clear();
}
