import { db } from "../db";
import { seoSettings } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const GSC_PROVIDER = "google-search-console";
const GSC_SEARCH_ANALYTICS_URL = "https://www.googleapis.com/webmasters/v3/sites";
const MAX_ROWS_PER_REQUEST = 25000;

export interface GscRankRow {
  query: string;
  page: string;
  device: string;
  date: string;
  position: number;
  clicks: number;
  impressions: number;
  ctr: number;
}

export interface GscRankResult {
  rows: GscRankRow[];
  domain: string | null;
  connected: boolean;
}

async function getGscConnection(workspaceId: string): Promise<{ token: string; domain: string } | null> {
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

    if (!settings?.apiKey || !settings?.siteUrl) return null;

    return {
      token: settings.apiKey,
      domain: settings.siteUrl,
    };
  } catch (err: any) {
    console.error("[GSC Rank] Failed to retrieve connection:", err.message);
    return null;
  }
}

function formatGscSiteUrl(domain: string): string {
  if (domain.startsWith("sc-domain:")) return domain;
  if (!domain.startsWith("http")) return `https://${domain}/`;
  return domain.endsWith("/") ? domain : `${domain}/`;
}

function dateMinusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

export async function getRankData(
  domain: string,
  urls: string[],
  workspaceId: string
): Promise<GscRankResult> {
  const connection = await getGscConnection(workspaceId);
  if (!connection) {
    return { rows: [], domain: null, connected: false };
  }

  const siteUrl = formatGscSiteUrl(connection.domain);
  const encodedSite = encodeURIComponent(siteUrl);
  const endpoint = `${GSC_SEARCH_ANALYTICS_URL}/${encodedSite}/searchAnalytics/query`;

  const startDate = dateMinusDays(28);
  const endDate = dateMinusDays(1);

  const pageFilters = urls.map((url) => ({
    dimension: "page",
    operator: "equals",
    expression: url,
  }));

  const allRows: GscRankRow[] = [];

  const batchSize = 50;
  for (let i = 0; i < pageFilters.length; i += batchSize) {
    const batch = pageFilters.slice(i, i + batchSize);

    const body = {
      startDate,
      endDate,
      dimensions: ["query", "page", "device", "date"],
      dimensionFilterGroups: [
        {
          groupType: "and",
          filters: batch.length === 1
            ? [batch[0]]
            : [{ dimension: "page", operator: "includingRegex", expression: batch.map(f => escapeRegex(f.expression)).join("|") }],
        },
      ],
      rowLimit: MAX_ROWS_PER_REQUEST,
      startRow: 0,
    };

    try {
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${connection.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000),
      });

      if (resp.status === 429) {
        console.warn("[GSC Rank] Rate limited, skipping batch");
        continue;
      }

      if (resp.status === 401) {
        console.warn("[GSC Rank] Token expired");
        return { rows: allRows, domain: connection.domain, connected: true };
      }

      if (!resp.ok) {
        console.warn(`[GSC Rank] API returned ${resp.status}`);
        continue;
      }

      const data = await resp.json();
      const rows = (data.rows || []).map((r: any) => ({
        query: r.keys[0],
        page: r.keys[1],
        device: r.keys[2],
        date: r.keys[3],
        position: Math.round(r.position * 10) / 10,
        clicks: r.clicks || 0,
        impressions: r.impressions || 0,
        ctr: Math.round((r.ctr || 0) * 10000) / 10000,
      }));

      allRows.push(...rows);
    } catch (err: any) {
      console.error("[GSC Rank] Request failed:", err.message);
      continue;
    }
  }

  return { rows: allRows, domain: connection.domain, connected: true };
}

export async function getTopQueries(
  domain: string,
  workspaceId: string,
  limit: number = 100
): Promise<GscRankResult> {
  const connection = await getGscConnection(workspaceId);
  if (!connection) {
    return { rows: [], domain: null, connected: false };
  }

  const siteUrl = formatGscSiteUrl(connection.domain);
  const encodedSite = encodeURIComponent(siteUrl);
  const endpoint = `${GSC_SEARCH_ANALYTICS_URL}/${encodedSite}/searchAnalytics/query`;

  const body = {
    startDate: dateMinusDays(28),
    endDate: dateMinusDays(1),
    dimensions: ["query"],
    rowLimit: Math.min(limit, MAX_ROWS_PER_REQUEST),
    startRow: 0,
  };

  try {
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${connection.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    if (!resp.ok) {
      return { rows: [], domain: connection.domain, connected: true };
    }

    const data = await resp.json();
    const rows: GscRankRow[] = (data.rows || []).map((r: any) => ({
      query: r.keys[0],
      page: "",
      device: "",
      date: "",
      position: Math.round(r.position * 10) / 10,
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: Math.round((r.ctr || 0) * 10000) / 10000,
    }));

    return { rows, domain: connection.domain, connected: true };
  } catch (err: any) {
    console.error("[GSC Rank] Top queries failed:", err.message);
    return { rows: [], domain: connection.domain, connected: true };
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type RankMovement = "improved" | "declined" | "stable" | "new";

export function calculateRankMovement(
  currentPosition: number | null,
  previousPosition: number | null
): RankMovement {
  if (previousPosition === null || previousPosition === undefined) return "new";
  if (currentPosition === null || currentPosition === undefined) return "declined";
  if (currentPosition < previousPosition) return "improved";
  if (currentPosition > previousPosition) return "declined";
  return "stable";
}

export function shouldFlagPage(
  impressions: number,
  publishedAt: Date | null,
  flagAfterDays: number
): boolean {
  if (!publishedAt) return false;
  if (impressions > 0) return false;
  const daysSincePublish = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24);
  return daysSincePublish >= flagAfterDays;
}
