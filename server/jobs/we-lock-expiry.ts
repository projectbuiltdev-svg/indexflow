import { db } from "../db";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and, lt, isNull } from "drizzle-orm";
import { sql } from "drizzle-orm";

const LOCK_TTL_MS = 30 * 60 * 1000;
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

let timer: ReturnType<typeof setInterval> | null = null;

async function expireStale(): Promise<void> {
  const cutoff = new Date(Date.now() - LOCK_TTL_MS);

  const staleLocks = await db
    .select()
    .from(weAuditLog)
    .where(
      and(
        eq(weAuditLog.action, "page_locked"),
        lt(weAuditLog.createdAt, cutoff)
      )
    );

  for (const lock of staleLocks) {
    const meta = lock.metadata as any;
    if (!meta?.pageId) continue;

    const unlocked = await db
      .select()
      .from(weAuditLog)
      .where(
        and(
          eq(weAuditLog.action, "page_unlocked"),
          eq(weAuditLog.venueId, lock.venueId)
        )
      );

    const isStillLocked = !unlocked.some(
      (u) => (u.metadata as any)?.pageId === meta.pageId && u.createdAt! > lock.createdAt!
    );

    if (isStillLocked) {
      await db.insert(weAuditLog).values({
        venueId: lock.venueId,
        projectId: lock.projectId,
        action: "page_unlocked",
        metadata: { ...meta, reason: "expired" },
        severity: "info",
      });
    }
  }
}

export function startLockExpiryJob(): void {
  if (timer) return;
  timer = setInterval(() => {
    expireStale().catch(() => {});
  }, CHECK_INTERVAL_MS);
}

export function stopLockExpiryJob(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
