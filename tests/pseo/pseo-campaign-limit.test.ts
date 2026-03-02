import { describe, it, expect, vi, beforeEach } from "vitest";
import { TIER_CAMPAIGN_LIMITS } from "../../server/config/pseo-geographic-divisions";

const mockGetWorkspace = vi.fn();
const mockGetUser = vi.fn();
const mockDbFrom = vi.fn();
const mockDbWhere = vi.fn();
const mockDbSelect = vi.fn();

vi.mock("../../server/db", () => ({
  db: {
    select: (...args: any[]) => {
      mockDbSelect(...args);
      return {
        from: (...fArgs: any[]) => {
          mockDbFrom(...fArgs);
          return {
            where: mockDbWhere,
          };
        },
      };
    },
  },
}));

vi.mock("../../server/storage", () => ({
  storage: {
    getWorkspace: (...args: any[]) => mockGetWorkspace(...args),
    getUser: (...args: any[]) => mockGetUser(...args),
  },
}));

vi.mock("@shared/schema", () => {
  const PLAN_TIERS: Record<string, any> = {
    solo: { name: "Solo", pseoCampaigns: 1 },
    pro: { name: "Pro", pseoCampaigns: 1 },
    agency: { name: "Agency", pseoCampaigns: 1 },
    enterprise: { name: "Enterprise", pseoCampaigns: 1 },
  };
  return {
    getPlanTier: (planId: string) => PLAN_TIERS[planId] || PLAN_TIERS.solo,
    pseoCampaigns: {
      venueId: "venue_id",
      status: "status",
    },
  };
});

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((...args: any[]) => ({ type: "eq", args })),
  and: vi.fn((...args: any[]) => ({ type: "and", args })),
  ne: vi.fn((...args: any[]) => ({ type: "ne", args })),
  count: vi.fn(() => "count_fn"),
}));

import { enforceCampaignLimit, getCampaignLimit } from "../../server/middleware/pseo-campaign-limit";

function setupDbCount(count: number) {
  mockDbWhere.mockResolvedValue([{ count }]);
}

function createMockReqRes(body: any = {}, params: any = {}) {
  const req = { body, params } as any;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();
  return { req, res, next };
}

describe("Campaign Limit Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("TIER_CAMPAIGN_LIMITS config", () => {
    it("Solo = 1", () => {
      expect(TIER_CAMPAIGN_LIMITS.solo).toBe(1);
    });
    it("Pro = 25", () => {
      expect(TIER_CAMPAIGN_LIMITS.pro).toBe(25);
    });
    it("Agency = 50", () => {
      expect(TIER_CAMPAIGN_LIMITS.agency).toBe(50);
    });
    it("Enterprise = -1 (unlimited)", () => {
      expect(TIER_CAMPAIGN_LIMITS.enterprise).toBe(-1);
    });
  });

  describe("enforceCampaignLimit", () => {
    it("allows request when count < limit", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "pro" });
      setupDbCount(10);

      const { req, res, next } = createMockReqRes({ workspaceId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("returns 403 when count >= limit (Solo at 1)", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "solo" });
      setupDbCount(1);

      const { req, res, next } = createMockReqRes({ workspaceId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: true,
          type: "CAMPAIGN_LIMIT_REACHED",
        })
      );
    });

    it("returns 403 when count exceeds limit", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "solo" });
      setupDbCount(5);

      const { req, res, next } = createMockReqRes({ workspaceId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("Enterprise tier always proceeds regardless of count", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "enterprise" });

      const { req, res, next } = createMockReqRes({ workspaceId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("returns 400 when workspaceId is missing", async () => {
      const { req, res, next } = createMockReqRes({});
      await enforceCampaignLimit(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("reads workspaceId from venueId in body", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "pro" });
      setupDbCount(0);

      const { req, res, next } = createMockReqRes({ venueId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(mockGetWorkspace).toHaveBeenCalledWith("w1");
    });

    it("reads workspaceId from params as fallback", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "pro" });
      setupDbCount(0);

      const { req, res, next } = createMockReqRes({}, { workspaceId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).toHaveBeenCalledOnce();
    });

    it("Pro tier allows up to 24 campaigns", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "pro" });
      setupDbCount(24);

      const { req, res, next } = createMockReqRes({ workspaceId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).toHaveBeenCalledOnce();
    });

    it("Pro tier blocks at 25 campaigns", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "pro" });
      setupDbCount(25);

      const { req, res, next } = createMockReqRes({ workspaceId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("Agency tier allows up to 49 campaigns", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "agency" });
      setupDbCount(49);

      const { req, res, next } = createMockReqRes({ workspaceId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).toHaveBeenCalledOnce();
    });

    it("Agency tier blocks at 50 campaigns", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "agency" });
      setupDbCount(50);

      const { req, res, next } = createMockReqRes({ workspaceId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("defaults to solo tier for unknown plan", async () => {
      mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
      mockGetUser.mockResolvedValue({ id: "u1", plan: "unknown_plan" });
      setupDbCount(1);

      const { req, res, next } = createMockReqRes({ workspaceId: "w1" });
      await enforceCampaignLimit(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("getCampaignLimit", () => {
    it("returns 0 when workspace not found", async () => {
      mockGetWorkspace.mockResolvedValue(null);
      const limit = await getCampaignLimit("nonexistent");
      expect(limit).toBe(0);
    });

    it("returns correct limit for each tier", async () => {
      for (const [tier, expectedLimit] of Object.entries(TIER_CAMPAIGN_LIMITS)) {
        mockGetWorkspace.mockResolvedValue({ id: "w1", ownerId: "u1" });
        mockGetUser.mockResolvedValue({ id: "u1", plan: tier });
        const limit = await getCampaignLimit("w1");
        expect(limit).toBe(expectedLimit);
      }
    });
  });
});
