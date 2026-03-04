import dns from "dns";
import { db } from "../db";
import { weDomains } from "../../db/schema/we-domains";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and } from "drizzle-orm";

export interface DnsPollingStatus {
  isPolling: boolean;
  startedAt: string | null;
  lastCheckedAt: string | null;
  expiresAt: string | null;
  verified: boolean;
}

interface PollingJob {
  domainId: number;
  venueId: string;
  startedAt: Date;
  lastCheckedAt: Date | null;
  expiresAt: Date;
  timer: ReturnType<typeof setInterval>;
  verified: boolean;
}

const activePollers = new Map<string, PollingJob>();

function pollerKey(domainId: number): string {
  return `dns-${domainId}`;
}

export async function checkDnsTxtRecord(domain: string, txtValue: string): Promise<boolean> {
  return new Promise((resolve) => {
    dns.resolveTxt(domain, (err, records) => {
      if (err) return resolve(false);
      const flat = records.flat();
      resolve(flat.some((r) => r.includes(txtValue)));
    });
  });
}

export function startDnsPolling(domainId: number, venueId: string): void {
  const key = pollerKey(domainId);
  if (activePollers.has(key)) return;

  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + 72 * 60 * 60 * 1000);

  const timer = setInterval(async () => {
    const job = activePollers.get(key);
    if (!job) return;

    if (new Date() > job.expiresAt) {
      clearInterval(job.timer);
      activePollers.delete(key);
      return;
    }

    const [domain] = await db.select().from(weDomains).where(and(eq(weDomains.id, domainId), eq(weDomains.venueId, venueId)));
    if (!domain || !domain.txtRecord) return;

    job.lastCheckedAt = new Date();

    if (domain.verificationStatus === "verified") {
      job.verified = true;
      clearInterval(job.timer);
      activePollers.delete(key);
      return;
    }

    const found = await checkDnsTxtRecord(domain.domain, domain.txtRecord);
    if (found) {
      await db.update(weDomains).set({
        verificationStatus: "verified",
        verifiedAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(weDomains.id, domainId));

      await db.insert(weAuditLog).values({
        venueId,
        action: "domain_verified",
        metadata: { domainId, domain: domain.domain },
        severity: "info",
      });

      job.verified = true;
      clearInterval(job.timer);
      activePollers.delete(key);
    }
  }, 60_000);

  activePollers.set(key, {
    domainId,
    venueId,
    startedAt,
    lastCheckedAt: null,
    expiresAt,
    timer,
    verified: false,
  });
}

export function getDnsPollingStatus(domainId: number): DnsPollingStatus {
  const key = pollerKey(domainId);
  const job = activePollers.get(key);

  if (!job) {
    return { isPolling: false, startedAt: null, lastCheckedAt: null, expiresAt: null, verified: false };
  }

  return {
    isPolling: true,
    startedAt: job.startedAt.toISOString(),
    lastCheckedAt: job.lastCheckedAt?.toISOString() || null,
    expiresAt: job.expiresAt.toISOString(),
    verified: job.verified,
  };
}
