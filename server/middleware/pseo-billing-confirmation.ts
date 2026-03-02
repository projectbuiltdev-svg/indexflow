import type { Request, Response } from "express";
import { storage } from "../storage";
import { db } from "../db";
import { pseoAuditLog } from "../../db/schema/pseo-audit-log";
import { createPseoError, PseoErrorType } from "../pseo/error-handler";
import { countActiveCampaigns } from "./pseo-campaign-limit";
import {
  BASE_CAMPAIGN_PRICE,
  BUNDLE_3_PRICE,
  BUNDLE_5_PRICE,
  BUNDLE_3_THRESHOLD,
  BUNDLE_5_THRESHOLD,
  FREE_CAMPAIGNS_PER_WORKSPACE,
} from "../config/pseo-pricing";

export interface CampaignPricing {
  currentCampaignCount: number;
  nextCampaignNumber: number;
  isFree: boolean;
  unitPrice: number;
  bundleApplied: boolean;
  bundleType: "none" | "bundle-3" | "bundle-5";
  bundlePrice: number | null;
  savings: number;
  totalDue: number;
  currency: "usd";
}

export async function getCampaignPricing(workspaceId: string): Promise<CampaignPricing> {
  const currentCount = await countActiveCampaigns(workspaceId);
  const nextNumber = currentCount + 1;

  if (nextNumber <= FREE_CAMPAIGNS_PER_WORKSPACE) {
    return {
      currentCampaignCount: currentCount,
      nextCampaignNumber: nextNumber,
      isFree: true,
      unitPrice: 0,
      bundleApplied: false,
      bundleType: "none",
      bundlePrice: null,
      savings: 0,
      totalDue: 0,
      currency: "usd",
    };
  }

  const paidCampaignNumber = nextNumber - FREE_CAMPAIGNS_PER_WORKSPACE;

  let bundleApplied = false;
  let bundleType: CampaignPricing["bundleType"] = "none";
  let bundlePrice: number | null = null;
  let savings = 0;
  let totalDue = BASE_CAMPAIGN_PRICE;

  if (paidCampaignNumber >= BUNDLE_5_THRESHOLD && paidCampaignNumber % BUNDLE_5_THRESHOLD === 0) {
    bundleApplied = true;
    bundleType = "bundle-5";
    bundlePrice = BUNDLE_5_PRICE;
    totalDue = BUNDLE_5_PRICE;
    savings = (BASE_CAMPAIGN_PRICE * BUNDLE_5_THRESHOLD) - BUNDLE_5_PRICE;
  } else if (paidCampaignNumber >= BUNDLE_3_THRESHOLD && paidCampaignNumber % BUNDLE_3_THRESHOLD === 0) {
    bundleApplied = true;
    bundleType = "bundle-3";
    bundlePrice = BUNDLE_3_PRICE;
    totalDue = BUNDLE_3_PRICE;
    savings = (BASE_CAMPAIGN_PRICE * BUNDLE_3_THRESHOLD) - BUNDLE_3_PRICE;
  }

  return {
    currentCampaignCount: currentCount,
    nextCampaignNumber: nextNumber,
    isFree: false,
    unitPrice: BASE_CAMPAIGN_PRICE,
    bundleApplied,
    bundleType,
    bundlePrice,
    savings,
    totalDue,
    currency: "usd",
  };
}

async function getStripeSecretKey(workspaceId: string): Promise<string | null> {
  const settings = await storage.getPaymentSettings(workspaceId);
  if (!settings?.stripeConnected || !settings?.stripeSecretKey) {
    return null;
  }
  return settings.stripeSecretKey;
}

async function logPaymentAudit(
  workspaceId: string,
  action: string,
  meta: Record<string, any>
): Promise<void> {
  try {
    await db.insert(pseoAuditLog).values({
      campaignId: meta.campaignId || "system",
      venueId: workspaceId,
      action,
      message: `Payment ${action}: ${meta.outcome || "initiated"}`,
      level: meta.outcome === "failed" ? "error" : "info",
      triggeredBy: meta.triggeredBy || null,
      meta,
    });
  } catch (err: any) {
    console.error("[pSEO Billing] Failed to write audit log:", err.message);
  }
}

export interface PaymentIntentResult {
  success: boolean;
  clientSecret: string | null;
  paymentIntentId: string | null;
  pricing: CampaignPricing;
  error: string | null;
}

export async function createCampaignPaymentIntent(
  workspaceId: string,
  triggeredBy?: string
): Promise<PaymentIntentResult> {
  const pricing = await getCampaignPricing(workspaceId);

  if (pricing.isFree) {
    await logPaymentAudit(workspaceId, "campaign-purchase", {
      outcome: "free",
      amount: 0,
      priceType: "free",
      bundleApplied: false,
      triggeredBy,
    });

    return {
      success: true,
      clientSecret: null,
      paymentIntentId: null,
      pricing,
      error: null,
    };
  }

  const stripeKey = await getStripeSecretKey(workspaceId);
  if (!stripeKey) {
    await logPaymentAudit(workspaceId, "campaign-purchase", {
      outcome: "failed",
      amount: pricing.totalDue,
      priceType: pricing.bundleType,
      bundleApplied: pricing.bundleApplied,
      reason: "No Stripe connection configured",
      triggeredBy,
    });

    return {
      success: false,
      clientSecret: null,
      paymentIntentId: null,
      pricing,
      error: "Stripe is not connected for this workspace. Configure payment settings first.",
    };
  }

  try {
    const amountInCents = Math.round(pricing.totalDue * 100);

    const params = new URLSearchParams();
    params.append("amount", String(amountInCents));
    params.append("currency", pricing.currency);
    params.append("automatic_payment_methods[enabled]", "true");
    params.append("metadata[workspace_id]", workspaceId);
    params.append("metadata[campaign_number]", String(pricing.nextCampaignNumber));
    params.append("metadata[bundle_type]", pricing.bundleType);
    params.append("metadata[bundle_applied]", String(pricing.bundleApplied));
    params.append("metadata[type]", "pseo_campaign_addon");
    if (triggeredBy) {
      params.append("metadata[triggered_by]", triggeredBy);
    }

    const resp = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      await logPaymentAudit(workspaceId, "campaign-purchase", {
        outcome: "failed",
        amount: pricing.totalDue,
        priceType: pricing.bundleType,
        bundleApplied: pricing.bundleApplied,
        reason: `Stripe API error ${resp.status}: ${body.slice(0, 200)}`,
        triggeredBy,
      });

      return {
        success: false,
        clientSecret: null,
        paymentIntentId: null,
        pricing,
        error: "Payment processing failed. Please try again.",
      };
    }

    const intent = await resp.json();

    await logPaymentAudit(workspaceId, "campaign-purchase", {
      outcome: "intent_created",
      amount: pricing.totalDue,
      priceType: pricing.bundleType,
      bundleApplied: pricing.bundleApplied,
      savings: pricing.savings,
      stripePaymentIntentId: intent.id,
      triggeredBy,
    });

    return {
      success: true,
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      pricing,
      error: null,
    };
  } catch (err: any) {
    await logPaymentAudit(workspaceId, "campaign-purchase", {
      outcome: "failed",
      amount: pricing.totalDue,
      priceType: pricing.bundleType,
      bundleApplied: pricing.bundleApplied,
      reason: err.message,
      triggeredBy,
    });

    return {
      success: false,
      clientSecret: null,
      paymentIntentId: null,
      pricing,
      error: "Payment processing failed. Please try again.",
    };
  }
}

async function verifyStripeSignature(
  payload: string,
  signature: string,
  webhookSecret: string
): Promise<boolean> {
  try {
    const crypto = await import("crypto");
    const elements = signature.split(",");
    const timestampStr = elements.find((e) => e.startsWith("t="))?.slice(2);
    const signatureV1 = elements.find((e) => e.startsWith("v1="))?.slice(3);

    if (!timestampStr || !signatureV1) return false;

    const signedPayload = `${timestampStr}.${payload}`;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signatureV1),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export async function handlePaymentWebhook(req: Request, res: Response): Promise<void> {
  const signature = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    res.status(400).json({ error: "Missing signature or webhook secret" });
    return;
  }

  const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

  const isValid = await verifyStripeSignature(rawBody, signature, webhookSecret);
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

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const metadata = intent.metadata || {};

    if (metadata.type !== "pseo_campaign_addon") {
      res.json({ received: true, handled: false });
      return;
    }

    const workspaceId = metadata.workspace_id;
    if (!workspaceId) {
      res.status(400).json({ error: "Missing workspace_id in metadata" });
      return;
    }

    await logPaymentAudit(workspaceId, "campaign-purchase-confirmed", {
      outcome: "success",
      amount: intent.amount / 100,
      stripePaymentIntentId: intent.id,
      bundleType: metadata.bundle_type,
      bundleApplied: metadata.bundle_applied === "true",
      campaignNumber: metadata.campaign_number,
      triggeredBy: metadata.triggered_by,
    });

    res.json({ received: true, handled: true });
    return;
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object;
    const metadata = intent.metadata || {};

    if (metadata.type === "pseo_campaign_addon" && metadata.workspace_id) {
      await logPaymentAudit(metadata.workspace_id, "campaign-purchase-failed", {
        outcome: "failed",
        amount: intent.amount / 100,
        stripePaymentIntentId: intent.id,
        bundleType: metadata.bundle_type,
        reason: intent.last_payment_error?.message || "Payment failed",
        triggeredBy: metadata.triggered_by,
      });
    }

    res.json({ received: true, handled: true });
    return;
  }

  res.json({ received: true, handled: false });
}
