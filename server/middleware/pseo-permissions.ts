import type { Request, Response, NextFunction } from "express";
import { createPseoError, PseoErrorType } from "../pseo/error-handler";
import { db } from "../db";
import { pseoAuditLog } from "../../db/schema/pseo-audit-log";

export const PSEO_ROLES = ["admin", "editor", "viewer", "client"] as const;
export type PseoRole = (typeof PSEO_ROLES)[number];

export type RouteCategory =
  | "activation"
  | "purchase"
  | "publish"
  | "review-edit"
  | "dashboard"
  | "client-dashboard";

const ROLE_PERMISSIONS: Record<PseoRole, Set<RouteCategory>> = {
  admin: new Set(["activation", "purchase", "publish", "review-edit", "dashboard", "client-dashboard"]),
  editor: new Set(["review-edit", "dashboard", "client-dashboard"]),
  viewer: new Set(["dashboard", "client-dashboard"]),
  client: new Set(["client-dashboard"]),
};

const AUDIT_ROLES: Set<PseoRole> = new Set(["admin", "editor"]);

export function hasPermission(role: PseoRole, category: RouteCategory): boolean {
  const allowed = ROLE_PERMISSIONS[role];
  return allowed ? allowed.has(category) : false;
}

export function extractUserRole(req: Request): { userId: string | null; role: PseoRole | null } {
  const user = (req as any).user;
  if (!user) {
    return { userId: null, role: null };
  }

  const userId: string = user.id || user.userId || null;
  const role: PseoRole = user.pseoRole || user.role || "viewer";

  if (!PSEO_ROLES.includes(role as PseoRole)) {
    return { userId, role: "viewer" };
  }

  return { userId, role: role as PseoRole };
}

export async function logAuditEntry(
  userId: string,
  action: string,
  campaignId: string | null,
  workspaceId: string,
  meta?: Record<string, any>
): Promise<void> {
  try {
    await db.insert(pseoAuditLog).values({
      campaignId: campaignId || "system",
      venueId: workspaceId,
      action,
      message: `User ${userId} performed ${action}`,
      level: "info",
      triggeredBy: userId,
      meta: meta || {},
    });
  } catch (err: any) {
    console.error("[pSEO] Failed to write audit log:", err.message);
  }
}

export function requirePseoPermission(category: RouteCategory) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { userId, role } = extractUserRole(req);

    if (!userId || !role) {
      const errorResponse = createPseoError(
        PseoErrorType.PERMISSION_DENIED,
        "Authentication required",
        { retryable: false }
      );
      res.status(401).json(errorResponse);
      return;
    }

    if (!hasPermission(role, category)) {
      const errorResponse = createPseoError(
        PseoErrorType.PERMISSION_DENIED,
        `Role '${role}' does not have permission for ${category} operations`,
        {
          retryable: false,
        }
      );
      res.status(403).json(errorResponse);
      return;
    }

    if (AUDIT_ROLES.has(role)) {
      const workspaceId =
        req.body?.workspaceId ||
        req.body?.venueId ||
        req.params?.workspaceId ||
        "unknown";
      const campaignId =
        req.body?.campaignId ||
        req.params?.campaignId ||
        null;

      logAuditEntry(userId, `${req.method} ${req.path}`, campaignId, workspaceId, {
        role,
        category,
        method: req.method,
        path: req.path,
      });
    }

    next();
  };
}

export const requireAdmin = requirePseoPermission("activation");
export const requireAdminOrEditor = requirePseoPermission("review-edit");
export const requireAuthenticated = requirePseoPermission("dashboard");
export const requireClientAccess = requirePseoPermission("client-dashboard");
