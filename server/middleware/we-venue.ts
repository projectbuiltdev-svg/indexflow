import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { weAuditLog } from "../../db/schema/we-audit-log";

export function weVenue(req: Request, res: Response, next: NextFunction): void {
  const venueId =
    req.params.venueId ||
    req.body?.venueId ||
    (req.query.venueId as string);

  if (!venueId || typeof venueId !== "string" || venueId.length > 36) {
    db.insert(weAuditLog)
      .values({
        venueId: venueId || "unknown",
        action: "venue_access_denied",
        metadata: {
          ip: req.ip,
          path: req.originalUrl,
          reason: "missing_or_malformed_venue_id",
        },
        severity: "warn",
      })
      .catch(() => {});

    res.status(403).json({ error: "Missing or malformed workspace ID" });
    return;
  }

  (req as any).venueId = venueId;
  next();
}
