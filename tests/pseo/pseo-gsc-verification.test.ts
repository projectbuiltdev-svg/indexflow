import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();

vi.mock("../../server/db", () => ({
  db: {
    select: (...args: any[]) => {
      mockSelect(...args);
      return { from: (...a: any[]) => { mockFrom(...a); return { where: mockWhere }; } };
    },
  },
}));

vi.mock("../../shared/schema", () => ({
  seoSettings: {
    workspaceId: "venue_id",
    provider: "provider",
    isConnected: "is_connected",
    apiKey: "api_key",
    siteUrl: "site_url",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: (a: any, b: any) => ({ _eq: [a, b] }),
  and: (...args: any[]) => ({ _and: args }),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

import {
  isGscPropertyVerified,
  getGscVerificationStatus,
} from "../../server/integrations/google-search-console-client";

function mockConnection(settings: any) {
  mockWhere.mockResolvedValue(settings ? [settings] : []);
}

const validConnection = {
  apiKey: "test-token-123",
  siteUrl: "https://example.com",
  isConnected: true,
  provider: "google-search-console",
};

describe("Google Search Console Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("isGscPropertyVerified", () => {
    it("returns true when domain is found in sites list", async () => {
      mockConnection(validConnection);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          siteEntry: [
            { siteUrl: "https://example.com/" },
            { siteUrl: "https://other.com/" },
          ],
        }),
      });

      const result = await isGscPropertyVerified("https://example.com", "ws-1");
      expect(result).toBe(true);
    });

    it("returns false when domain is not in sites list", async () => {
      mockConnection(validConnection);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          siteEntry: [
            { siteUrl: "https://other.com/" },
          ],
        }),
      });

      const result = await isGscPropertyVerified("https://example.com", "ws-1");
      expect(result).toBe(false);
    });

    it("returns false when GSC is not connected", async () => {
      mockConnection(null);

      const result = await isGscPropertyVerified("https://example.com", "ws-1");
      expect(result).toBe(false);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("returns false on 401 response", async () => {
      mockConnection(validConnection);
      mockFetch.mockResolvedValue({ ok: false, status: 401 });

      const result = await isGscPropertyVerified("https://example.com", "ws-1");
      expect(result).toBe(false);
    });

    it("returns false on 403 response", async () => {
      mockConnection(validConnection);
      mockFetch.mockResolvedValue({ ok: false, status: 403 });

      const result = await isGscPropertyVerified("https://example.com", "ws-1");
      expect(result).toBe(false);
    });

    it("returns false on network error without throwing", async () => {
      mockConnection(validConnection);
      mockFetch.mockRejectedValue(new Error("Network timeout"));

      const result = await isGscPropertyVerified("https://example.com", "ws-1");
      expect(result).toBe(false);
    });

    it("normalizes sc-domain: prefix for matching", async () => {
      mockConnection(validConnection);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          siteEntry: [
            { siteUrl: "sc-domain:example.com" },
          ],
        }),
      });

      const result = await isGscPropertyVerified("https://example.com", "ws-1");
      expect(result).toBe(true);
    });
  });

  describe("getGscVerificationStatus", () => {
    it("returns connected:false when GSC is not connected", async () => {
      mockConnection(null);

      const result = await getGscVerificationStatus("ws-1");
      expect(result).toEqual({
        connected: false,
        domain: null,
        verified: false,
        warning: null,
      });
    });

    it("returns verified:true when domain found", async () => {
      mockConnection(validConnection);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          siteEntry: [{ siteUrl: "https://example.com/" }],
        }),
      });

      const result = await getGscVerificationStatus("ws-1");
      expect(result.connected).toBe(true);
      expect(result.domain).toBe("https://example.com");
      expect(result.verified).toBe(true);
      expect(result.warning).toBeNull();
    });

    it("returns verified:false with warning when domain not found", async () => {
      mockConnection(validConnection);
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          siteEntry: [{ siteUrl: "https://other.com/" }],
        }),
      });

      const result = await getGscVerificationStatus("ws-1");
      expect(result.connected).toBe(true);
      expect(result.verified).toBe(false);
      expect(result.warning).toContain("not found");
    });

    it("returns warning on 401 — token expired", async () => {
      mockConnection(validConnection);
      mockFetch.mockResolvedValue({ ok: false, status: 401 });

      const result = await getGscVerificationStatus("ws-1");
      expect(result.connected).toBe(true);
      expect(result.verified).toBe(false);
      expect(result.warning).toContain("token expired");
    });

    it("returns warning on 403 — insufficient permissions", async () => {
      mockConnection(validConnection);
      mockFetch.mockResolvedValue({ ok: false, status: 403 });

      const result = await getGscVerificationStatus("ws-1");
      expect(result.connected).toBe(true);
      expect(result.verified).toBe(false);
      expect(result.warning).toContain("Insufficient permissions");
    });

    it("returns warning on network error without throwing", async () => {
      mockConnection(validConnection);
      mockFetch.mockRejectedValue(new Error("ECONNREFUSED"));

      const result = await getGscVerificationStatus("ws-1");
      expect(result.connected).toBe(true);
      expect(result.verified).toBe(false);
      expect(result.warning).toContain("Network error");
    });

    it("returns warning on unknown HTTP error", async () => {
      mockConnection(validConnection);
      mockFetch.mockResolvedValue({ ok: false, status: 500 });

      const result = await getGscVerificationStatus("ws-1");
      expect(result.connected).toBe(true);
      expect(result.verified).toBe(false);
      expect(result.warning).toContain("500");
    });
  });
});
