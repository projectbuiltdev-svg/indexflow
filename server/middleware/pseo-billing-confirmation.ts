import type { Request, Response } from "express";
import { db } from "../db";
import { eq, and, ne, count, sum } from "drizzle-orm";
import { pseoCampaigns } from "@shared/schema";
import { pseoCampaignEntitlements } from "../../db/schema/pseo-campaign-entitlements";
import { pseoAuditLog } from "../../db/schema/pseo-audit-log";
import { TIER_CAMPAIGN_LIMITS } from "../config/pseo-geographic-divisions";
import { BASE_CAMPAIGN_PRICE, FREE_CAMPAIGNS_PER_WORKSPACE, PSEO_ADDON_CURRENCY } from "../config/pseo-pricing";
import { countActiveCampaigns, getCampaignLimit } from "./pseo-campaign-limit";
import { createPseoError, PseoErrorType } from "../pseo/error-handler";

export interface CampaignEntitlement {
  baseCampaigns: number;
  addonCampaigns: number;
  totalEntitlement: number;
  activeCount: number;
  slotsAvailable: number;
}

export async function getAddonCampaignCount(workspaceId: string): Promise<number> {
  const [result] = await db
    .select({ total: sum(pseoCampaignEntitlements.quantity) })
    .from(pseoCampaignEntitlements)
    .where(eq(pseoCampaignEntitlements.venueId, workspaceId));
  return Number(result?.total) || 0;
}

export async function checkCampaignEntitlement(workspaceId: string): Promise<CampaignEntitlement> {
  const baseCampaigns = await getCampaignLimit(workspaceId);
  const addonCampaigns = await getAddonCampaignCount(workspaceId);
  const activeCount = await countActiveCampaigns(workspaceId);

  const effectiveBase = baseCampaigns === -1 ? Infinity : baseCampaigns;
  const totalEntitlement = effectiveBase + addonCampaigns;
  const slotsAvailable = Math.max(0, totalEntitlement - activeCount);

  return {
    baseCampaigns: baseCampaigns === -1 ? -1 : baseCampaigns,
    addonCampaigns,
    totalEntitlement: baseCampaigns === -1 ? -1 : effectiveBase + addonCampaigns,
    activeCount,
    slotsAvailable: baseCampaigns === -1 ? -1 : slotsAvailable,
  };
}

export function generatePolarCheckoutUrl(
  workspaceId: string,
  quantity: number
): string {
  const productId = process.env.POLAR_PSEO_PRODUCT_ID || "";
  const successUrl = process.env.POLAR_SUCCESS_URL || `${process.env.APP_URL || ""}/checkout/success`;
  const cancelUrl = process.env.POLAR_CANCEL_URL || `${process.env.APP_URL || ""}/checkout/cancel`;

  const params = new URLSearchParams();
  params.append("product_id", productId);
  params.append("quantity", String(quantity));
  params.append("metadata[workspace_id]", workspaceId);
  params.append("metadata[type]", "pseo_campaign_addon");
  params.append("success_url", successUrl);
  params.append("cancel_url", cancelUrl);

  return `https://polar.sh/checkout?${params.toString()}`;
}

async function logBillingAudit(
  workspaceId: string,
  action: string,
  meta: Record<string, any>
): Promise<void> {
  try {
    await db.insert(pseoAuditLog).values({
      campaignId: "system",
      venueId: workspaceId,
      action,
      message: `Billing ${action}: ${meta.outcome || "initiated"}`,
      level: meta.outcome === "failed" ? "error" : "info",
      triggeredBy: meta.triggeredBy || null,
      meta,
    });
  } catch (err: any) {
    console.error("[pSEO Billing] Failed to write audit log:", err.message);
  }
}

async function verifyPolarSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const crypto = await import("crypto");
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected)
    );
  } catch {
    return false;
  }
}

export async function handlePolarWebhook(req: Request, res: Response): Promise<void> {
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    res.status(500).json({ error: "Webhook secret not configured" });
    return;
  }

  const signature =
    (req.headers["x-polar-signature"] as string) ||
    (req.headers["webhook-signature"] as string) ||
    "";

  if (!signature) {
    res.status(400).json({ error: "Missing webhook signature" });
    return;
  }

  const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  const isValid = await verifyPolarSignature(rawBody, signature, webhookSecret);
  if (!isValid) {
    res.status(400).json({ error: "Invalid webhook signature" });
    return;
  }

  let event: any;
  try {
    event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ error: "Invalid JSON payload" });
    return;
  }

  if (event.type !== "order.created") {
    res.json({ received: true, handled: false });
    return;
  }

  const order = event.data;
  if (!order) {
    res.status(400).json({ error: "Missing order data" });
    return;
  }

  const metadata = order.metadata || {};
  const workspaceId = metadata.workspace_id;
  const quantity = order.quantity || order.items?.length || 1;
  const polarOrderId = order.id || "";
  const polarProductId = order.product_id || metadata.product_id || "";

  if (!workspaceId) {
    await logBillingAudit("unknown", "polar-webhook-rejected", {
      outcome: "failed",
      reason: "Missing workspace_id in order metadata",
      polarOrderId,
    });
    res.status(400).json({ error: "Missing workspace_id in order metadata" });
    return;
  }

  if (metadata.type !== "pseo_campaign_addon") {
    res.json({ received: true, handled: false });
    return;
  }

  try {
    await db.insert(pseoCampaignEntitlements).values({
      venueId: workspaceId,
      quantity,
      unitPrice: BASE_CAMPAIGN_PRICE,
      polarOrderId,
      polarProductId,
    });

    await logBillingAudit(workspaceId, "polar-campaign-purchase", {
      outcome: "success",
      polarOrderId,
      polarProductId,
      quantity,
      slotsGranted: quantity,
      unitPrice: BASE_CAMPAIGN_PRICE,
      totalAmount: BASE_CAMPAIGN_PRICE * quantity,
    });

    res.json({ received: true, handled: true, slotsGranted: quantity });
  } catch (err: any) {
    await logBillingAudit(workspaceId, "polar-campaign-purchase", {
      outcome: "failed",
      polarOrderId,
      polarProductId,
      quantity,
      reason: err.message,
    });

    res.status(500).json({ error: "Failed to grant campaign entitlement" });
  }
}
