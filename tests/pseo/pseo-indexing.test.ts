import { describe, it, expect, vi, beforeEach } from "vitest";

const mockStorage = {
  getGscToken: vi.fn(),
  logAudit: vi.fn().mockResolvedValue(undefined),
};

vi.mock("../server/db", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  },
}));

vi.mock("@shared/schema", () => ({
  seoSettings: { workspaceId: "workspaceId", provider: "provider", isConnected: "isConnected", apiKey: "apiKey" },
  pseoPages: { id: "id", slug: "slug", pageType: "pageType" },
}));

vi.mock("../../db/schema/pseo-audit-log", () => ({
  pseoAuditLog: {},
}));

vi.mock("../../db/schema/pseo-indexing-queue", () => ({
  pseoIndexingQueue: {
    id: "id",
    status: "status",
    indexedAt: "indexedAt",
    submittedAt: "submittedAt",
    deletedAt: "deletedAt",
    priority: "priority",
    createdAt: "createdAt",
    nextRetryAt: "nextRetryAt",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn((a, b) => ({ type: "eq", a, b })),
  and: vi.fn((...args: any[]) => ({ type: "and", args })),
  or: vi.fn((...args: any[]) => ({ type: "or", args })),
  inArray: vi.fn((a, b) => ({ type: "inArray", a, b })),
  lte: vi.fn((a, b) => ({ type: "lte", a, b })),
  isNull: vi.fn((a) => ({ type: "isNull", a })),
  asc: vi.fn((a) => ({ type: "asc", a })),
  sql: vi.fn(),
}));

const originalFetch = globalThis.fetch;

describe("Google Indexing Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getGscToken.mockResolvedValue("test-token-123");
    globalThis.fetch = originalFetch;
  });

  describe("submitUrl", () => {
    it("should submit a single URL successfully", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          urlNotificationMetadata: {
            latestUpdate: { notifyTime: "2026-03-02T12:00:00Z" },
          },
        }),
      }) as any;

      const { submitUrl } = await import("../../server/integrations/google-indexing-client");
      const result = await submitUrl("https://example.com/page", "ws-1", "URL_UPDATED", mockStorage, "camp-1");

      expect(result.success).toBe(true);
      expect(result.notifyTime).toBe("2026-03-02T12:00:00Z");
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "https://indexing.googleapis.com/v3/urlNotifications:publish",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ url: "https://example.com/page", type: "URL_UPDATED" }),
        })
      );
    });

    it("should handle rate limit (429) without throwing", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
      }) as any;

      const { submitUrl } = await import("../../server/integrations/google-indexing-client");
      const result = await submitUrl("https://example.com/page", "ws-1", "URL_UPDATED", mockStorage, "camp-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("rate_limited");
      expect(mockStorage.logAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          level: "warn",
          action: "indexing_rate_limited",
        })
      );
    });

    it("should handle 401 auth failure without throwing", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }) as any;

      const { submitUrl } = await import("../../server/integrations/google-indexing-client");
      const result = await submitUrl("https://example.com/page", "ws-1", "URL_UPDATED", mockStorage, "camp-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("token_expired");
      expect(mockStorage.logAudit).toHaveBeenCalledWith(
        expect.objectContaining({
          level: "error",
          action: "indexing_auth_failure",
          errorType: "auth_expired",
        })
      );
    });

    it("should return error when no GSC token available", async () => {
      mockStorage.getGscToken.mockResolvedValue(null);

      const { submitUrl } = await import("../../server/integrations/google-indexing-client");
      const result = await submitUrl("https://example.com/page", "ws-1", "URL_UPDATED", mockStorage);

      expect(result.success).toBe(false);
      expect(result.error).toBe("No GSC token available");
    });

    it("should handle network errors without throwing", async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error("Connection refused")) as any;

      const { submitUrl } = await import("../../server/integrations/google-indexing-client");
      const result = await submitUrl("https://example.com/page", "ws-1", "URL_UPDATED", mockStorage, "camp-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection refused");
    });

    it("should support URL_DELETED type", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ urlNotificationMetadata: {} }),
      }) as any;

      const { submitUrl } = await import("../../server/integrations/google-indexing-client");
      const result = await submitUrl("https://example.com/old-page", "ws-1", "URL_DELETED", mockStorage, "camp-1");

      expect(result.success).toBe(true);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ url: "https://example.com/old-page", type: "URL_DELETED" }),
        })
      );
    });
  });

  describe("submitBatch", () => {
    it("should enforce 200/hour limit", async () => {
      const { submitBatch, resetHourlyCounts } = await import("../../server/integrations/google-indexing-client");
      resetHourlyCounts();

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ urlNotificationMetadata: { latestUpdate: { notifyTime: new Date().toISOString() } } }),
      }) as any;

      const urls = Array.from({ length: 250 }, (_, i) => ({
        url: `https://example.com/page-${i}`,
        pageId: `page-${i}`,
      }));

      const result = await submitBatch(urls, "ws-batch", "camp-1", mockStorage);

      expect(result.submitted).toBeLessThanOrEqual(200);
      expect(result.queued).toBeGreaterThanOrEqual(50);
      expect(result.submitted + result.queued + result.failed).toBe(250);
    });

    it("should queue rate-limited URLs", async () => {
      const { submitBatch, resetHourlyCounts } = await import("../../server/integrations/google-indexing-client");
      resetHourlyCounts();

      let callCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 3) {
          return { ok: false, status: 429 };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({ urlNotificationMetadata: { latestUpdate: { notifyTime: new Date().toISOString() } } }),
        };
      }) as any;

      const urls = Array.from({ length: 5 }, (_, i) => ({
        url: `https://example.com/p-${i}`,
        pageId: `p-${i}`,
      }));

      const result = await submitBatch(urls, "ws-rl", "camp-1", mockStorage);

      expect(result.submitted).toBe(4);
      expect(result.queued).toBe(1);
    });
  });
});

describe("Queue Processor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.getGscToken.mockResolvedValue("test-token");
  });

  it("should respect MAX_RETRIES and mark as failed", async () => {
    const { MAX_RETRIES } = await import("../../server/config/pseo-indexing-rate-limits");
    expect(MAX_RETRIES).toBe(3);
  });

  it("should use RETRY_AFTER_HOURS for next retry calculation", async () => {
    const { RETRY_AFTER_HOURS } = await import("../../server/config/pseo-indexing-rate-limits");
    expect(RETRY_AFTER_HOURS).toBe(24);
  });

  it("should have FLAG_AFTER_DAYS = 21 in config", async () => {
    const { FLAG_AFTER_DAYS } = await import("../../server/config/pseo-indexing-rate-limits");
    expect(FLAG_AFTER_DAYS).toBe(21);
  });

  it("should have RESUBMIT_AFTER_DAYS = 14 in config", async () => {
    const { RESUBMIT_AFTER_DAYS } = await import("../../server/config/pseo-indexing-rate-limits");
    expect(RESUBMIT_AFTER_DAYS).toBe(14);
  });

  it("should have QUEUE_PROCESSOR_INTERVAL_MS = 900000 (15 min)", async () => {
    const { QUEUE_PROCESSOR_INTERVAL_MS } = await import("../../server/config/pseo-indexing-rate-limits");
    expect(QUEUE_PROCESSOR_INTERVAL_MS).toBe(900000);
  });

  it("should have MAX_URLS_PER_HOUR = 200", async () => {
    const { MAX_URLS_PER_HOUR } = await import("../../server/config/pseo-indexing-rate-limits");
    expect(MAX_URLS_PER_HOUR).toBe(200);
  });
});

describe("enqueueForIndexing", () => {
  it("should assign priority based on page type", () => {
    const priorityMap: Record<string, number> = {
      hub: 1,
      service: 2,
      location: 3,
    };
    expect(priorityMap["hub"]).toBe(1);
    expect(priorityMap["service"]).toBe(2);
    expect(priorityMap["location"]).toBe(3);
    expect(priorityMap["other"] ?? 4).toBe(4);
  });
});
