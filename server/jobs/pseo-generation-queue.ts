import { db } from "../db";
import { pseoCampaigns, pseoServices, pseoLocations } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import {
  generateSinglePage,
  type PageGenerationContext,
  type GenerationStorage,
} from "../pseo/content-generator";
import { assertTransition, type CampaignState } from "../pseo/campaign-state-machine";
import { generateFallbackPool, type SpintaxPool, type SpintaxPoolRecord, type PoolStorage } from "../pseo/spintax-engine";
import type { SimilarityStorage, PageVector } from "../pseo/similarity-checker";

const MAX_CONCURRENT_AI_CALLS_PER_CAMPAIGN = 10;
const MAX_CONCURRENT_AI_CALLS_PLATFORM = 100;

let activePlatformCalls = 0;

interface ActiveService {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

interface ActiveLocation {
  id: string;
  name: string;
  state: string | null;
  country: string;
  latitude: string;
  longitude: string;
}

interface CampaignConfig {
  id: string;
  venueId: string;
  urlStructure: string;
  aiModel: string;
  language: string;
  totalPages: number;
}

const generationStorage: GenerationStorage = {
  async getPoolsByCampaign(): Promise<SpintaxPoolRecord[]> {
    return [];
  },
  async upsertPool(pool): Promise<SpintaxPoolRecord> {
    return { id: "stub", campaignId: pool.campaignId, venueId: pool.venueId, poolType: pool.poolType, zoneId: pool.zoneId, variants: pool.variants, usageCount: null, version: pool.version };
  },
  async logAudit(entry): Promise<void> {
    console.log(`[pseo-audit] ${entry.action}: ${entry.message}`);
  },
  async getUsedH1s(): Promise<string[]> {
    return [];
  },
  async getPageVectors(campaignId: string): Promise<PageVector[]> {
    return [];
  },
  async addToReviewQueue(entry): Promise<void> {
    console.log(`[pseo-review] ${entry.reason}`);
  },
  async updatePageStatus(pageId: string, status: string, score: number): Promise<void> {
    console.log(`[pseo-status] ${pageId} -> ${status} (${score})`);
  },
  async storePageVector(pageId: string, campaignId: string, vector: Record<string, number>): Promise<void> {
    // stub
  },
  async insertPseoPage(page) {
    const [result] = await db
      .insert(require("@shared/schema").pseoPages)
      .values(page)
      .returning({ id: require("@shared/schema").pseoPages.id });
    return result;
  },
  async insertSitePage(page) {
    const [result] = await db
      .insert(require("@shared/schema").workspaceSitePages)
      .values(page)
      .returning({ id: require("@shared/schema").workspaceSitePages.id });
    return result;
  },
};

export async function processGenerationQueue(
  campaignId: string,
  workspaceId: string
): Promise<{ success: boolean; totalGenerated: number; totalFailed: number; error?: string }> {
  let totalGenerated = 0;
  let totalFailed = 0;

  try {
    const [campaign] = await db
      .select()
      .from(pseoCampaigns)
      .where(eq(pseoCampaigns.id, campaignId))
      .limit(1);

    if (!campaign) {
      return { success: false, totalGenerated: 0, totalFailed: 0, error: "Campaign not found" };
    }

    const config: CampaignConfig = {
      id: campaign.id,
      venueId: campaign.venueId,
      urlStructure: campaign.urlStructure,
      aiModel: campaign.aiModel,
      language: campaign.language,
      totalPages: campaign.totalPages || 0,
    };

    const services = await db
      .select()
      .from(pseoServices)
      .where(and(eq(pseoServices.campaignId, campaignId), eq(pseoServices.isExcluded, false)));

    const locations = await db
      .select()
      .from(pseoLocations)
      .where(and(eq(pseoLocations.campaignId, campaignId), eq(pseoLocations.isExcluded, false)));

    if (services.length === 0 || locations.length === 0) {
      return { success: false, totalGenerated: 0, totalFailed: 0, error: "No active services or locations" };
    }

    const combinations: Array<{ service: typeof services[0]; location: typeof locations[0] }> = [];
    for (const service of services) {
      for (const location of locations) {
        combinations.push({ service, location });
      }
    }

    const batches: Array<typeof combinations> = [];
    for (let i = 0; i < combinations.length; i += MAX_CONCURRENT_AI_CALLS_PER_CAMPAIGN) {
      batches.push(combinations.slice(i, i + MAX_CONCURRENT_AI_CALLS_PER_CAMPAIGN));
    }

    for (const batch of batches) {
      while (activePlatformCalls >= MAX_CONCURRENT_AI_CALLS_PLATFORM) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const results = await Promise.allSettled(
        batch.map(async ({ service, location }) => {
          activePlatformCalls++;
          try {
            const ctx: PageGenerationContext = {
              campaignId,
              workspaceId,
              serviceName: service.name,
              serviceId: service.id,
              serviceDescription: service.description || service.name,
              serviceKeywords: (service.keywords as string[]) || [service.name],
              locationName: location.name,
              locationId: location.id,
              locationState: location.state,
              locationCountry: location.country,
              urlStructure: config.urlStructure as "location-first" | "service-first",
              aiModel: config.aiModel,
              domainName: "",
              languageCode: config.language,
              sectionCount: 4,
            };

            return await generateSinglePage(ctx, generationStorage);
          } finally {
            activePlatformCalls--;
          }
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value.success) {
          totalGenerated++;
        } else {
          totalFailed++;
        }
      }

      await db
        .update(pseoCampaigns)
        .set({
          pagesGenerated: totalGenerated,
          updatedAt: new Date(),
        })
        .where(eq(pseoCampaigns.id, campaignId));
    }

    const finalStatus: CampaignState = totalFailed > 0 && totalGenerated === 0 ? "draft" : "reviewing";

    try {
      assertTransition(campaign.status as CampaignState, finalStatus);
      await db
        .update(pseoCampaigns)
        .set({
          status: finalStatus,
          pagesGenerated: totalGenerated,
          updatedAt: new Date(),
        })
        .where(eq(pseoCampaigns.id, campaignId));
    } catch {
      await db
        .update(pseoCampaigns)
        .set({
          pagesGenerated: totalGenerated,
          updatedAt: new Date(),
        })
        .where(eq(pseoCampaigns.id, campaignId));
    }

    return { success: true, totalGenerated, totalFailed };
  } catch (err: any) {
    try {
      await db
        .update(pseoCampaigns)
        .set({ status: "draft", updatedAt: new Date() })
        .where(eq(pseoCampaigns.id, campaignId));
    } catch {}

    return { success: false, totalGenerated, totalFailed, error: err.message };
  }
}

export function getActivePlatformCalls(): number {
  return activePlatformCalls;
}
