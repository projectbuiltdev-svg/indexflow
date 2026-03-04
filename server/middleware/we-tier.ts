import type { Request, Response, NextFunction } from "express";
import { getTierConfig } from "../config/we-tier-config";
import { db } from "../db";
import { weAuditLog } from "../../db/schema/we-audit-log";

function logBlocked(req: Request, feature: string): void {
  const venueId = (req as any).venueId || "unknown";
  db.insert(weAuditLog)
    .values({
      venueId,
      action: "tier_blocked",
      metadata: { feature, path: req.originalUrl, tier: (req as any).tier },
      severity: "warn",
    })
    .catch(() => {});
}

function checkTierFeature(
  featureName: string,
  check: (tier: ReturnType<typeof getTierConfig>, isOnTrial: boolean) => boolean
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const tier = (req as any).tier || "solo";
    const isOnTrial = !!(req as any).isOnTrial;
    const config = getTierConfig(tier);

    if (!check(config, isOnTrial)) {
      logBlocked(req, featureName);
      res.status(403).json({ error: `Upgrade required to access ${featureName}` });
      return;
    }
    next();
  };
}

export const requireExport = checkTierFeature("export", (c, trial) => c.canExport && !trial);
export const requireWhiteLabel = checkTierFeature("white-label", (c, trial) => c.canWhiteLabel && !trial);
export const requireCollaboration = checkTierFeature("collaboration", (c, trial) => c.canCollaborate && !trial);
export const requirePaidDeployment = checkTierFeature("deployment", (_c, trial) => !trial);
