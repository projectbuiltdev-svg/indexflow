import { db } from "../db";
import { seoSettings } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const GSC_PROVIDER = "google-search-console";
const GSC_SITES_URL = "https://www.googleapis.com/webmasters/v3/sites";

export interface GscVerificationResult {
  connected: boolean;
  domain: string | null;
  verified: boolean;
  warning: string | null;
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
    console.error("[GSC] Failed to retrieve connection:", err.message);
    return null;
  }
}

export async function isGscPropertyVerified(
  domain: string,
  workspaceId: string
): Promise<boolean> {
  const connection = await getGscConnection(workspaceId);
  if (!connection) return false;

  try {
    const resp = await fetch(GSC_SITES_URL, {
      headers: {
        Authorization: `Bearer ${connection.token}`,
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) return false;

    const data = await resp.json();
    const sites: Array<{ siteUrl: string }> = data.siteEntry || [];

    const normalizedDomain = normalizeDomain(domain);
    return sites.some((site) => normalizeDomain(site.siteUrl) === normalizedDomain);
  } catch (err: any) {
    console.error("[GSC] Property verification failed:", err.message);
    return false;
  }
}

export async function getGscVerificationStatus(
  workspaceId: string
): Promise<GscVerificationResult> {
  const connection = await getGscConnection(workspaceId);

  if (!connection) {
    return {
      connected: false,
      domain: null,
      verified: false,
      warning: null,
    };
  }

  try {
    const resp = await fetch(GSC_SITES_URL, {
      headers: {
        Authorization: `Bearer ${connection.token}`,
      },
      signal: AbortSignal.timeout(15000),
    });

    if (resp.status === 401) {
      return {
        connected: true,
        domain: connection.domain,
        verified: false,
        warning: "GSC token expired. Please reconnect Google Search Console.",
      };
    }

    if (resp.status === 403) {
      return {
        connected: true,
        domain: connection.domain,
        verified: false,
        warning: "Insufficient permissions. Ensure the connected Google account has owner or full access to this Search Console property.",
      };
    }

    if (!resp.ok) {
      return {
        connected: true,
        domain: connection.domain,
        verified: false,
        warning: `GSC API returned status ${resp.status}`,
      };
    }

    const data = await resp.json();
    const sites: Array<{ siteUrl: string }> = data.siteEntry || [];

    const normalizedDomain = normalizeDomain(connection.domain);
    const verified = sites.some(
      (site) => normalizeDomain(site.siteUrl) === normalizedDomain
    );

    return {
      connected: true,
      domain: connection.domain,
      verified,
      warning: verified
        ? null
        : `Domain "${connection.domain}" not found in your Google Search Console properties.`,
    };
  } catch (err: any) {
    console.error("[GSC] Verification status check failed:", err.message);
    return {
      connected: true,
      domain: connection.domain,
      verified: false,
      warning: "Network error while checking GSC verification.",
    };
  }
}

function normalizeDomain(url: string): string {
  return url
    .replace(/^(sc-domain:|https?:\/\/)/, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}
