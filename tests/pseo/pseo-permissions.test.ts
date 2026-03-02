import { describe, it, expect, vi, beforeEach } from "vitest";

const mockDbInsert = vi.fn();
const mockDbValues = vi.fn();

vi.mock("../../server/db", () => ({
  db: {
    insert: (...args: any[]) => {
      mockDbInsert(...args);
      return { values: mockDbValues };
    },
  },
}));

vi.mock("../../db/schema/pseo-audit-log", () => ({
  pseoAuditLog: { _table: "pseo_audit_log" },
}));

import {
  PSEO_ROLES,
  type PseoRole,
  type RouteCategory,
  hasPermission,
  extractUserRole,
  requirePseoPermission,
} from "../../server/middleware/pseo-permissions";

function createMockReq(user: any = null, body: any = {}, params: any = {}) {
  return { user, body, params, method: "POST", path: "/api/pseo/test" } as any;
}

function createMockRes() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  return res;
}

describe("pSEO Permissions Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDbValues.mockResolvedValue(undefined);
  });

  describe("hasPermission", () => {
    const ALL_CATEGORIES: RouteCategory[] = [
      "activation", "purchase", "publish", "review-edit", "dashboard", "client-dashboard",
    ];

    it("admin has access to all categories", () => {
      for (const cat of ALL_CATEGORIES) {
        expect(hasPermission("admin", cat)).toBe(true);
      }
    });

    it("editor has access to review-edit, dashboard, client-dashboard only", () => {
      expect(hasPermission("editor", "review-edit")).toBe(true);
      expect(hasPermission("editor", "dashboard")).toBe(true);
      expect(hasPermission("editor", "client-dashboard")).toBe(true);
      expect(hasPermission("editor", "activation")).toBe(false);
      expect(hasPermission("editor", "purchase")).toBe(false);
      expect(hasPermission("editor", "publish")).toBe(false);
    });

    it("viewer has access to dashboard and client-dashboard only", () => {
      expect(hasPermission("viewer", "dashboard")).toBe(true);
      expect(hasPermission("viewer", "client-dashboard")).toBe(true);
      expect(hasPermission("viewer", "activation")).toBe(false);
      expect(hasPermission("viewer", "purchase")).toBe(false);
      expect(hasPermission("viewer", "publish")).toBe(false);
      expect(hasPermission("viewer", "review-edit")).toBe(false);
    });

    it("client has access to client-dashboard only", () => {
      expect(hasPermission("client", "client-dashboard")).toBe(true);
      expect(hasPermission("client", "dashboard")).toBe(false);
      expect(hasPermission("client", "activation")).toBe(false);
      expect(hasPermission("client", "purchase")).toBe(false);
      expect(hasPermission("client", "publish")).toBe(false);
      expect(hasPermission("client", "review-edit")).toBe(false);
    });
  });

  describe("extractUserRole", () => {
    it("returns null for unauthenticated request", () => {
      const req = createMockReq(null);
      const { userId, role } = extractUserRole(req);
      expect(userId).toBeNull();
      expect(role).toBeNull();
    });

    it("extracts userId and role from user object", () => {
      const req = createMockReq({ id: "u1", pseoRole: "admin" });
      const { userId, role } = extractUserRole(req);
      expect(userId).toBe("u1");
      expect(role).toBe("admin");
    });

    it("defaults to viewer for unknown role", () => {
      const req = createMockReq({ id: "u1", pseoRole: "superuser" });
      const { userId, role } = extractUserRole(req);
      expect(role).toBe("viewer");
    });

    it("falls back to role field if pseoRole missing", () => {
      const req = createMockReq({ id: "u1", role: "editor" });
      const { userId, role } = extractUserRole(req);
      expect(role).toBe("editor");
    });
  });

  describe("requirePseoPermission middleware", () => {
    it("rejects unauthenticated request with 401", async () => {
      const middleware = requirePseoPermission("dashboard");
      const req = createMockReq(null);
      const res = createMockRes();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ type: "PERMISSION_DENIED" })
      );
    });

    describe("activation routes", () => {
      const middleware = requirePseoPermission("activation");

      it("admin can access", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "admin" }, { workspaceId: "w1" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(next).toHaveBeenCalledOnce();
      });

      it("editor is blocked with 403", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "editor" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
      });

      it("viewer is blocked with 403", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "viewer" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
      });

      it("client is blocked with 403", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "client" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
      });
    });

    describe("purchase routes", () => {
      const middleware = requirePseoPermission("purchase");

      it("admin can access", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "admin" }, { workspaceId: "w1" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(next).toHaveBeenCalledOnce();
      });

      it.each(["editor", "viewer", "client"] as PseoRole[])(
        "%s is blocked",
        async (role) => {
          const req = createMockReq({ id: "u1", pseoRole: role });
          const res = createMockRes();
          const next = vi.fn();
          await middleware(req, res, next);
          expect(res.status).toHaveBeenCalledWith(403);
        }
      );
    });

    describe("publish routes", () => {
      const middleware = requirePseoPermission("publish");

      it("admin can access", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "admin" }, { workspaceId: "w1" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(next).toHaveBeenCalledOnce();
      });

      it.each(["editor", "viewer", "client"] as PseoRole[])(
        "%s is blocked",
        async (role) => {
          const req = createMockReq({ id: "u1", pseoRole: role });
          const res = createMockRes();
          const next = vi.fn();
          await middleware(req, res, next);
          expect(res.status).toHaveBeenCalledWith(403);
        }
      );
    });

    describe("review-edit routes", () => {
      const middleware = requirePseoPermission("review-edit");

      it("admin can access", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "admin" }, { workspaceId: "w1" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(next).toHaveBeenCalledOnce();
      });

      it("editor can access", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "editor" }, { workspaceId: "w1" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(next).toHaveBeenCalledOnce();
      });

      it("viewer is blocked", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "viewer" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
      });

      it("client is blocked", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "client" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
      });
    });

    describe("dashboard routes", () => {
      const middleware = requirePseoPermission("dashboard");

      it.each(["admin", "editor", "viewer"] as PseoRole[])(
        "%s can access",
        async (role) => {
          const req = createMockReq({ id: "u1", pseoRole: role }, { workspaceId: "w1" });
          const res = createMockRes();
          const next = vi.fn();
          await middleware(req, res, next);
          expect(next).toHaveBeenCalledOnce();
        }
      );

      it("client is blocked from internal dashboard", async () => {
        const req = createMockReq({ id: "u1", pseoRole: "client" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
      });
    });

    describe("client-dashboard routes", () => {
      const middleware = requirePseoPermission("client-dashboard");

      it.each(PSEO_ROLES)("%s can access client-dashboard", async (role) => {
        const req = createMockReq({ id: "u1", pseoRole: role }, { workspaceId: "w1" });
        const res = createMockRes();
        const next = vi.fn();
        await middleware(req, res, next);
        expect(next).toHaveBeenCalledOnce();
      });
    });

    describe("audit logging", () => {
      it("admin action creates audit log entry", async () => {
        const middleware = requirePseoPermission("dashboard");
        const req = createMockReq(
          { id: "u1", pseoRole: "admin" },
          { workspaceId: "w1", campaignId: "c1" }
        );
        const res = createMockRes();
        const next = vi.fn();

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(mockDbInsert).toHaveBeenCalled();
        expect(mockDbValues).toHaveBeenCalledWith(
          expect.objectContaining({
            venueId: "w1",
            campaignId: "c1",
            triggeredBy: "u1",
            action: "POST /api/pseo/test",
            level: "info",
          })
        );
      });

      it("editor action creates audit log entry", async () => {
        const middleware = requirePseoPermission("review-edit");
        const req = createMockReq(
          { id: "u2", pseoRole: "editor" },
          { workspaceId: "w1" }
        );
        const res = createMockRes();
        const next = vi.fn();

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(mockDbInsert).toHaveBeenCalled();
      });

      it("viewer action does not create audit log entry", async () => {
        const middleware = requirePseoPermission("dashboard");
        const req = createMockReq(
          { id: "u3", pseoRole: "viewer" },
          { workspaceId: "w1" }
        );
        const res = createMockRes();
        const next = vi.fn();

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(mockDbInsert).not.toHaveBeenCalled();
      });

      it("client action does not create audit log entry", async () => {
        const middleware = requirePseoPermission("client-dashboard");
        const req = createMockReq(
          { id: "u4", pseoRole: "client" },
          { workspaceId: "w1" }
        );
        const res = createMockRes();
        const next = vi.fn();

        await middleware(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(mockDbInsert).not.toHaveBeenCalled();
      });

      it("rejected request does not create audit log entry", async () => {
        const middleware = requirePseoPermission("activation");
        const req = createMockReq({ id: "u1", pseoRole: "viewer" });
        const res = createMockRes();
        const next = vi.fn();

        await middleware(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(mockDbInsert).not.toHaveBeenCalled();
      });
    });
  });
});
