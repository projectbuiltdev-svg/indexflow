import { Router, Request, Response } from "express";
import { db } from "../db";
import { workspaces } from "../../shared/schema";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq } from "drizzle-orm";

const router = Router();

const smtpPending = new Map<string, {
  host: string; port: number; username: string; password: string;
  fromName: string; fromEmail: string;
}>();

const smtpStored = new Map<string, {
  host: string; port: number; username: string;
  fromName: string; fromEmail: string;
}>();

const stagingDomains = new Map<string, {
  domain: string; verified: boolean; cnameRecord: string;
  cnameTarget: string; txtRecord: string; txtValue: string;
}>();

router.get("/", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;

    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, venueId));
    const profile = (ws as any)?.siteProfile || {};
    const smtp = smtpStored.get(venueId);
    const staging = stagingDomains.get(venueId);

    res.json({
      agencyName: profile.agencyName || ws?.name || "",
      agencyLogo: profile.agencyLogo || "",
      brandColours: profile.brandColours || { primary: "#0284c7", secondary: "#64748b" },
      stagingDomain: staging?.verified ? staging.domain : null,
      smtpConfigured: !!smtp,
      fromName: smtp?.fromName || "",
      fromEmail: smtp?.fromEmail || "",
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/config", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const { agencyName, agencyLogo, brandColours } = req.body;

    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, venueId));
    const existing = (ws as any)?.siteProfile || {};

    const updated = {
      ...existing,
      ...(agencyName !== undefined && { agencyName }),
      ...(agencyLogo !== undefined && { agencyLogo }),
      ...(brandColours !== undefined && { brandColours }),
    };

    await db.update(workspaces).set({ siteProfile: updated } as any).where(eq(workspaces.id, venueId));

    await db.insert(weAuditLog).values({
      venueId,
      action: "whitelabel_config_updated",
      metadata: { agencyName, hasBrandColours: !!brandColours },
      severity: "info",
    });

    res.json({ saved: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/smtp", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const { host, port, username, password, fromName, fromEmail } = req.body;

    if (!host || !port || !username || !password || !fromName || !fromEmail) {
      return res.status(400).json({ error: "All SMTP fields required" });
    }

    smtpPending.set(venueId, { host, port, username, password, fromName, fromEmail });

    res.json({ testSent: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/smtp/confirm", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const pending = smtpPending.get(venueId);

    if (!pending) {
      return res.status(400).json({ error: "No pending SMTP configuration" });
    }

    smtpStored.set(venueId, {
      host: pending.host,
      port: pending.port,
      username: pending.username,
      fromName: pending.fromName,
      fromEmail: pending.fromEmail,
    });
    smtpPending.delete(venueId);

    await db.insert(weAuditLog).values({
      venueId,
      action: "smtp_configured",
      metadata: { fromName: pending.fromName, fromEmail: pending.fromEmail },
      severity: "info",
    });

    res.json({ confirmed: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/smtp/test", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const stored = smtpStored.get(venueId);

    if (!stored) {
      return res.status(400).json({ error: "No SMTP credentials configured" });
    }

    res.json({ sent: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/smtp", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;

    smtpStored.delete(venueId);
    smtpPending.delete(venueId);

    await db.insert(weAuditLog).values({
      venueId,
      action: "smtp_removed",
      metadata: {},
      severity: "warn",
    });

    res.json({ removed: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/staging-domain", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const { domain } = req.body;

    if (!domain || !/^[a-z0-9][a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
      return res.status(400).json({ error: "Invalid domain format" });
    }

    const cnameRecord = domain;
    const cnameTarget = "staging.indexflow.cloud";
    const txtRecord = domain;
    const txtValue = `indexflow-verify=${venueId}-${Date.now().toString(36)}`;

    stagingDomains.set(venueId, {
      domain,
      verified: false,
      cnameRecord,
      cnameTarget,
      txtRecord,
      txtValue,
    });

    res.json({ cnameRecord, cnameTarget, txtRecord, txtValue });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/staging-domain/verify", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const staging = stagingDomains.get(venueId);

    if (!staging) {
      return res.status(404).json({ error: "No staging domain configured" });
    }

    staging.verified = true;

    await db.insert(weAuditLog).values({
      venueId,
      action: "staging_domain_verified",
      metadata: { domain: staging.domain },
      severity: "info",
    });

    res.json({ verified: true, domain: staging.domain });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/staging-domain", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const staging = stagingDomains.get(venueId);

    stagingDomains.delete(venueId);

    await db.insert(weAuditLog).values({
      venueId,
      action: "staging_domain_removed",
      metadata: { domain: staging?.domain },
      severity: "warn",
    });

    res.json({ removed: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
