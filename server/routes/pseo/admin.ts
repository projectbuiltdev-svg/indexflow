import { Router } from "express";
import { db } from "../../db";
import { workspaces, pseoCampaigns, pseoPages } from "@shared/schema";
import { pseoCampaignEntitlements } from "../../../db/schema/pseo-campaign-entitlements";
import { pseoAuditLog } from "../../../db/schema/pseo-audit-log";
import { pseoReviewQueue } from "../../../db/schema/pseo-review-queue";
import { eq, sql, count, sum, and, ne, gte, isNull, desc } from "drizzle-orm";
import { countActiveCampaigns, getCampaignLimit } from "../../middleware/pseo-campaign-limit";
import { getAddonCampaignCount } from "../../middleware/pseo-billing-confirmation";
import { TIER_CAMPAIGN_LIMITS } from "../../config/pseo-geographic-divisions";
import crypto from "crypto";

const router = Router();

router.get("/stats", async (_req, res) => {
  try {
    const [campaignStats] = await db
      .select({
        totalActive: count(),
      })
      .from(pseoCampaigns)
      .where(ne(pseoCampaigns.status, "archived"));

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [pagesGeneratedToday] = await db
      .select({ count: count() })
      .from(pseoPages)
      .where(
        and(
          gte(pseoPages.createdAt, todayStart),
          isNull(pseoPages.deletedAt)
        )
      );

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [publishedThisMonth] = await db
      .select({ count: count() })
      .from(pseoPages)
      .where(
        and(
          eq(pseoPages.isPublished, true),
          gte(pseoPages.updatedAt, monthStart),
          isNull(pseoPages.deletedAt)
        )
      );

    let pendingReviewCount = 0;
    try {
      const [reviewResult] = await db
        .select({ count: count() })
        .from(pseoReviewQueue)
        .where(eq(pseoReviewQueue.status, "pending"));
      pendingReviewCount = reviewResult?.count ?? 0;
    } catch {
      pendingReviewCount = 0;
    }

    res.json({
      totalActiveCampaigns: campaignStats?.totalActive ?? 0,
      pagesGeneratedToday: pagesGeneratedToday?.count ?? 0,
      pagesPublishedThisMonth: publishedThisMonth?.count ?? 0,
      pendingReviewItems: pendingReviewCount,
    });
  } catch (error: any) {
    console.error("[pSEO Admin] Stats error:", error.message);
    res.status(500).json({ error: "Failed to fetch pSEO stats" });
  }
});

router.get("/workspaces", async (_req, res) => {
  try {
    const allWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        plan: workspaces.plan,
        pseoAdminOverride: workspaces.pseoAdminOverride,
      })
      .from(workspaces)
      .where(eq(workspaces.status, "active"));

    const campaignCounts = await db
      .select({
        venueId: pseoCampaigns.venueId,
        campaigns: count(),
        totalPages: sql<number>`COALESCE(SUM(${pseoCampaigns.totalPages}), 0)`.as("total_pages"),
        pagesPublished: sql<number>`COALESCE(SUM(${pseoCampaigns.pagesPublished}), 0)`.as("pages_published"),
      })
      .from(pseoCampaigns)
      .where(ne(pseoCampaigns.status, "archived"))
      .groupBy(pseoCampaigns.venueId);

    const lastActivity = await db
      .select({
        venueId: pseoAuditLog.venueId,
        lastActivityAt: sql<string>`MAX(${pseoAuditLog.createdAt})`.as("last_activity_at"),
      })
      .from(pseoAuditLog)
      .groupBy(pseoAuditLog.venueId);

    const campaignMap = new Map(campaignCounts.map((c) => [c.venueId, c]));
    const activityMap = new Map(lastActivity.map((a) => [a.venueId, a.lastActivityAt]));

    const result = allWorkspaces
      .map((ws) => {
        const stats = campaignMap.get(ws.id);
        const tierLimit = TIER_CAMPAIGN_LIMITS[(ws.plan || "solo").toLowerCase()] ?? 0;
        const pseoEnabled =
          ws.pseoAdminOverride === true ||
          (ws.pseoAdminOverride !== false && tierLimit > 0);

        return {
          id: ws.id,
          name: ws.name,
          plan: ws.plan,
          pseoAdminOverride: ws.pseoAdminOverride,
          pseoEnabled,
          tierLimit: tierLimit === -1 ? "unlimited" : tierLimit,
          campaigns: stats?.campaigns ?? 0,
          totalPages: Number(stats?.totalPages ?? 0),
          pagesPublished: Number(stats?.pagesPublished ?? 0),
          lastActivityAt: activityMap.get(ws.id) || null,
        };
      })
      .sort((a, b) => b.campaigns - a.campaigns);

    res.json({ workspaces: result });
  } catch (error: any) {
    console.error("[pSEO Admin] Workspaces error:", error.message);
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
});

router.post("/workspaces/:id/grant-slots", async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const { quantity, reason } = req.body;

    if (!quantity || typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ error: "quantity must be a positive integer" });
    }

    const adminGrantId = `admin_grant_${crypto.randomUUID()}`;

    await db.insert(pseoCampaignEntitlements).values({
      venueId: workspaceId,
      quantity,
      unitPrice: 0,
      polarOrderId: adminGrantId,
      polarProductId: "admin_grant",
    });

    try {
      const campaignRows = await db
        .select({ id: pseoCampaigns.id })
        .from(pseoCampaigns)
        .where(eq(pseoCampaigns.venueId, workspaceId))
        .limit(1);
      const campaignId = campaignRows[0]?.id || "system";

      await db.insert(pseoAuditLog).values({
        campaignId,
        venueId: workspaceId,
        action: "admin_grant_slots",
        message: `Admin granted ${quantity} bonus campaign slot${quantity > 1 ? "s" : ""}${reason ? `: ${reason}` : ""}`,
        level: "info",
        meta: { quantity, reason, grantId: adminGrantId },
      });
    } catch {}

    const addonCount = await getAddonCampaignCount(workspaceId);

    res.json({ granted: quantity, totalAddonSlots: addonCount });
  } catch (error: any) {
    console.error("[pSEO Admin] Grant slots error:", error.message);
    res.status(500).json({ error: "Failed to grant slots" });
  }
});

router.post("/workspaces/:id/revoke-slots", async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ error: "quantity must be a positive integer" });
    }

    const entitlements = await db
      .select()
      .from(pseoCampaignEntitlements)
      .where(eq(pseoCampaignEntitlements.venueId, workspaceId))
      .orderBy(desc(pseoCampaignEntitlements.grantedAt));

    let remaining = quantity;
    for (const ent of entitlements) {
      if (remaining <= 0) break;
      if (ent.quantity <= remaining) {
        await db
          .delete(pseoCampaignEntitlements)
          .where(eq(pseoCampaignEntitlements.id, ent.id));
        remaining -= ent.quantity;
      } else {
        await db
          .update(pseoCampaignEntitlements)
          .set({ quantity: ent.quantity - remaining })
          .where(eq(pseoCampaignEntitlements.id, ent.id));
        remaining = 0;
      }
    }

    const revoked = quantity - remaining;

    try {
      const campaignRows = await db
        .select({ id: pseoCampaigns.id })
        .from(pseoCampaigns)
        .where(eq(pseoCampaigns.venueId, workspaceId))
        .limit(1);
      const campaignId = campaignRows[0]?.id || "system";

      await db.insert(pseoAuditLog).values({
        campaignId,
        venueId: workspaceId,
        action: "admin_revoke_slots",
        message: `Admin revoked ${revoked} campaign slot${revoked > 1 ? "s" : ""}`,
        level: "warn",
        meta: { requested: quantity, revoked },
      });
    } catch {}

    const addonCount = await getAddonCampaignCount(workspaceId);

    res.json({ revoked, totalAddonSlots: addonCount });
  } catch (error: any) {
    console.error("[pSEO Admin] Revoke slots error:", error.message);
    res.status(500).json({ error: "Failed to revoke slots" });
  }
});

router.post("/workspaces/:id/toggle", async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const { enabled } = req.body;

    if (typeof enabled !== "boolean" && enabled !== null) {
      return res.status(400).json({ error: "enabled must be true, false, or null (reset to plan default)" });
    }

    await db
      .update(workspaces)
      .set({ pseoAdminOverride: enabled })
      .where(eq(workspaces.id, workspaceId));

    try {
      const campaignRows = await db
        .select({ id: pseoCampaigns.id })
        .from(pseoCampaigns)
        .where(eq(pseoCampaigns.venueId, workspaceId))
        .limit(1);
      const campaignId = campaignRows[0]?.id || "system";

      await db.insert(pseoAuditLog).values({
        campaignId,
        venueId: workspaceId,
        action: "admin_toggle_pseo",
        message: `Admin ${enabled === true ? "enabled" : enabled === false ? "disabled" : "reset"} pSEO for workspace`,
        level: "info",
        meta: { pseoAdminOverride: enabled },
      });
    } catch {}

    res.json({ pseoAdminOverride: enabled });
  } catch (error: any) {
    console.error("[pSEO Admin] Toggle error:", error.message);
    res.status(500).json({ error: "Failed to toggle pSEO" });
  }
});

export default router;
