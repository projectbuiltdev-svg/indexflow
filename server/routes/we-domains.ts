import { Router, Request, Response } from "express";
import { db } from "../db";
import { weDomains } from "../../db/schema/we-domains";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import dns from "dns";
import { promisify } from "util";

const resolveTxt = promisify(dns.resolveTxt);
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const domains = await db
      .select()
      .from(weDomains)
      .where(eq(weDomains.venueId, venueId));
    res.json({ domains, total: domains.length });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: "domain is required" });

    const existing = await db
      .select({ id: weDomains.id })
      .from(weDomains)
      .where(eq(weDomains.venueId, venueId));

    if (existing.length > 0) {
      return res.status(409).json({ error: "Only 1 domain per workspace allowed. Delete existing first." });
    }

    const txtRecord = `indexflow-verify=${crypto.randomBytes(16).toString("hex")}`;

    const [created] = await db
      .insert(weDomains)
      .values({
        venueId,
        domain,
        txtRecord,
        verificationStatus: "pending",
      })
      .returning();

    res.status(201).json(created);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:domainId/verify", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const domainId = parseInt(req.params.domainId as string);

    const [domainRecord] = await db
      .select()
      .from(weDomains)
      .where(and(eq(weDomains.id, domainId), eq(weDomains.venueId, venueId)));

    if (!domainRecord) return res.status(404).json({ error: "Domain not found" });

    let verified = false;
    try {
      const records = await resolveTxt(domainRecord.domain);
      const flat = records.flat();
      verified = flat.some((r) => r === domainRecord.txtRecord);
    } catch {
      verified = false;
    }

    const newStatus = verified ? "verified" : "failed";
    const [updated] = await db
      .update(weDomains)
      .set({
        verificationStatus: newStatus,
        verifiedAt: verified ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(weDomains.id, domainId))
      .returning();

    await db.insert(weAuditLog).values({
      venueId,
      userId: (req as any).user?.id,
      action: "domain_verification",
      metadata: { domain: domainRecord.domain, result: newStatus },
      severity: verified ? "info" : "warn",
    });

    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:domainId", async (req: Request, res: Response) => {
  try {
    const venueId = (req as any).venueId as string;
    const domainId = parseInt(req.params.domainId as string);

    const [domain] = await db
      .select()
      .from(weDomains)
      .where(and(eq(weDomains.id, domainId), eq(weDomains.venueId, venueId)));

    if (!domain) return res.status(404).json({ error: "Domain not found" });

    await db.delete(weDomains).where(eq(weDomains.id, domainId));

    await db.insert(weAuditLog).values({
      venueId,
      userId: (req as any).user?.id,
      action: "domain_deleted",
      metadata: { domain: domain.domain },
      severity: "warn",
    });

    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
