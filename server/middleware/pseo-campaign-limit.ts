import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";
import { TIER_CAMPAIGN_LIMITS } from "../config/pseo-geographic-divisions";
import { getPlanTier } from "@shared/schema";
import { createPseoError, PseoErrorType } from "../pseo/error-handler";
import { db } from "../db";
import { pseoCampaigns } from "@shared/schema";
import { eq, and, ne, count } from "drizzle-orm";

export async function countActiveCampaigns(workspaceId: string): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(pseoCampaigns)
    .where(
      and(
        eq(pseoCampaigns.venueId, workspaceId),
        ne(pseoCampaigns.status, "archived")
      )
    );
  return result?.count ?? 0;
}

export async function getCampaignLimit(workspaceId: string): Promise<number> {
  const workspace = await storage.getWorkspace(workspaceId);
  if (!workspace) return 0;

  const owner = await storage.getUser(workspace.ownerId!);
  const planTier = getPlanTier(owner?.plan || "solo");
  const tierKey = (owner?.plan || "solo").toLowerCase();

  return TIER_CAMPAIGN_LIMITS[tierKey] ?? TIER_CAMPAIGN_LIMITS.solo;
}

export async function enforceCampaignLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workspaceId = req.body?.venueId || req.body?.workspaceId || req.params?.workspaceId;

    if (!workspaceId) {
      res.status(400).json({ error: "workspaceId is required" });
      return;
    }

    const limit = await getCampaignLimit(workspaceId);

    if (limit === -1) {
      next();
      return;
    }

    const activeCount = await countActiveCampaigns(workspaceId);

    if (activeCount >= limit) {
      const errorResponse = createPseoError(
        PseoErrorType.CAMPAIGN_LIMIT_REACHED,
        `Campaign limit reached. Your plan allows ${limit} active campaign${limit === 1 ? "" : "s"}. You currently have ${activeCount}. Archive existing campaigns or upgrade your plan.`,
        {
          workspaceId,
          retryable: false,
        }
      );
      res.status(errorResponse.httpStatus).json(errorResponse);
      return;
    }

    next();
  } catch (error: any) {
    console.error("[pSEO] Campaign limit check failed:", error.message);
    res.status(500).json({ error: "Failed to check campaign limits" });
  }
}
