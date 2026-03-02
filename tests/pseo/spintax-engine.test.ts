import { describe, it, expect, vi } from "vitest";

import {
  resolveH1,
  resolveH2,
  resolveParagraph,
  checkH1Collision,
  resolveH1WithCollisionAvoidance,
  expandPool,
  applyMicroVariation,
  generateFallbackPool,
  storePool,
  type SpintaxPool,
  type PoolStorage,
} from "../../server/pseo/spintax-engine";

function makeTestPool(): SpintaxPool {
  return {
    h1Variants: [
      "{keyword} in {location} — Trusted Local Plumber",
      "Find the Best {keyword} in {location}",
      "Professional {keyword} Services in {location}",
      "{location}'s Leading {keyword} Provider",
      "Expert {keyword} Near You in {location}",
      "Top-Rated {keyword} in {location} — Call Today",
      "Reliable {keyword} Services Across {location}",
      "Your Local {keyword} Specialist in {location}",
    ],
    h2Variants: {
      0: ["Why Choose Our {keyword}", "About Our Services", "What Sets Us Apart", "Our Commitment", "Trusted Experts"],
      1: ["Our Process", "How We Deliver", "Step-by-Step", "What to Expect", "Our Approach"],
    },
    paragraphVariants: {
      0: ["When you need {keyword} in {location}, our team delivers.", "Searching for reliable service?", "Our services are designed for you.", "Residents trust us."],
      1: ["We follow a proven process.", "Our team uses the latest techniques.", "From start to finish, transparent.", "Every project benefits."],
    },
  };
}

function makeMockPoolStorage(): PoolStorage {
  return {
    getPoolsByCampaign: vi.fn().mockResolvedValue([]),
    upsertPool: vi.fn().mockResolvedValue({ id: "pool-1", campaignId: "c1", venueId: "w1", poolType: "h1", zoneId: null, variants: [], usageCount: null, version: 1 }),
    logAudit: vi.fn().mockResolvedValue(undefined),
  };
}

describe("spintax-engine: deterministic selection", () => {
  const pool = makeTestPool();

  it("resolveH1 returns same result for same inputs", () => {
    const a = resolveH1("loc-1", "svc-1", pool, "Dublin", "plumber");
    const b = resolveH1("loc-1", "svc-1", pool, "Dublin", "plumber");
    expect(a).toBe(b);
  });

  it("resolveH1 returns different results for different location+service", () => {
    const a = resolveH1("loc-1", "svc-1", pool, "Dublin", "plumber");
    const b = resolveH1("loc-2", "svc-1", pool, "Cork", "plumber");
    const c = resolveH1("loc-1", "svc-2", pool, "Dublin", "electrician");
    const results = new Set([a, b, c]);
    expect(results.size).toBeGreaterThan(1);
  });

  it("resolveH1 injects location and keyword", () => {
    const h1 = resolveH1("loc-1", "svc-1", pool, "Dublin", "plumber");
    const hasPlaceholder = h1.includes("{location}") || h1.includes("{keyword}");
    expect(hasPlaceholder).toBe(false);
  });

  it("resolveH2 is deterministic per section", () => {
    const a = resolveH2("loc-1", "svc-1", 0, pool);
    const b = resolveH2("loc-1", "svc-1", 0, pool);
    expect(a).toBe(b);
  });

  it("resolveH2 differs across sections for same location", () => {
    const a = resolveH2("loc-1", "svc-1", 0, pool);
    const b = resolveH2("loc-1", "svc-1", 1, pool);
    expect(a).not.toBe(b);
  });

  it("resolveParagraph is deterministic", () => {
    const a = resolveParagraph("loc-1", "svc-1", 0, pool);
    const b = resolveParagraph("loc-1", "svc-1", 0, pool);
    expect(a).toBe(b);
  });

  it("resolveParagraph differs for different locations", () => {
    const results = new Set<string>();
    for (let i = 0; i < 20; i++) {
      results.add(resolveParagraph(`loc-${i}`, "svc-1", 0, pool));
    }
    expect(results.size).toBeGreaterThan(1);
  });

  it("resolveH2 returns empty string for missing section", () => {
    expect(resolveH2("loc-1", "svc-1", 99, pool)).toBe("");
  });

  it("resolveParagraph returns empty string for missing section", () => {
    expect(resolveParagraph("loc-1", "svc-1", 99, pool)).toBe("");
  });
});

describe("spintax-engine: H1 collision detection", () => {
  const pool = makeTestPool();

  it("checkH1Collision returns false for unused H1", () => {
    expect(checkH1Collision("Brand New H1", [])).toBe(false);
  });

  it("checkH1Collision returns true for duplicate", () => {
    expect(checkH1Collision("Used H1", ["Used H1", "Another"])).toBe(true);
  });

  it("collision avoidance selects next variant when collision exists", () => {
    const h1First = resolveH1("loc-1", "svc-1", pool, "Dublin", "plumber");
    const result = resolveH1WithCollisionAvoidance("loc-1", "svc-1", pool, "Dublin", "plumber", [h1First]);
    expect(result.collisionAvoided).toBe(true);
    expect(result.h1).not.toBe(h1First);
  });

  it("collision avoidance returns original when no collision", () => {
    const result = resolveH1WithCollisionAvoidance("loc-1", "svc-1", pool, "Dublin", "plumber", []);
    expect(result.collisionAvoided).toBe(false);
    expect(result.h1).toBeTruthy();
  });

  it("pool exhaustion detected when all H1s used", () => {
    const allH1s = pool.h1Variants.map((v) =>
      v.replace(/\{location\}/gi, "Dublin").replace(/\{keyword\}/gi, "plumber")
    );
    const result = resolveH1WithCollisionAvoidance("loc-1", "svc-1", pool, "Dublin", "plumber", allH1s);
    expect(result.collisionAvoided).toBe(true);
  });
});

describe("spintax-engine: pool expansion", () => {
  it("expandPool calls AI and appends variants", async () => {
    const mockAiCall = vi.fn().mockResolvedValue('["New variant 1", "New variant 2", "New variant 3"]');
    const mockStorage = makeMockPoolStorage();

    const result = await expandPool(
      "campaign-1", "workspace-1", "h1", null,
      ["Existing 1", "Existing 2"], 0, mockStorage, mockAiCall, "test-key"
    );

    expect(result.expanded).toBe(true);
    expect(result.variants.length).toBe(5);
    expect(mockStorage.upsertPool).toHaveBeenCalled();
    expect(mockStorage.logAudit).toHaveBeenCalledWith(
      expect.objectContaining({ action: "spintax_pool_expanded" })
    );
  });

  it("expandPool refuses after MAX_POOL_EXPANSIONS", async () => {
    const mockStorage = makeMockPoolStorage();
    const result = await expandPool(
      "campaign-1", "workspace-1", "h1", null,
      ["v1"], 5, mockStorage
    );

    expect(result.expanded).toBe(false);
    expect(result.reason).toContain("Maximum pool expansions");
    expect(mockStorage.upsertPool).not.toHaveBeenCalled();
  });

  it("expandPool handles section index for h2/paragraph", async () => {
    const mockAiCall = vi.fn().mockResolvedValue('["A", "B", "C"]');
    const mockStorage = makeMockPoolStorage();

    const result = await expandPool(
      "campaign-1", "workspace-1", "h2", 2,
      ["Existing"], 1, mockStorage, mockAiCall, "test-key"
    );

    expect(result.expanded).toBe(true);
    expect(mockStorage.upsertPool).toHaveBeenCalledWith(
      expect.objectContaining({ zoneId: "section-2" })
    );
  });
});

describe("spintax-engine: micro-variation", () => {
  it("changes text without changing core meaning", () => {
    const original = "We provide excellent professional service to our customers";
    const varied = applyMicroVariation(original, 42);
    expect(varied).not.toBe(original);
    expect(varied.split(/\s+/).length).toBe(original.split(/\s+/).length);
  });

  it("is deterministic for same seed", () => {
    const text = "Our reliable team provides quality service";
    const a = applyMicroVariation(text, 123);
    const b = applyMicroVariation(text, 123);
    expect(a).toBe(b);
  });

  it("different seeds produce different variations", () => {
    const text = "excellent professional reliable affordable quality fast best";
    const results = new Set<string>();
    for (let i = 0; i < 30; i++) {
      results.add(applyMicroVariation(text, i));
    }
    expect(results.size).toBeGreaterThan(1);
  });

  it("preserves capitalisation", () => {
    const text = "Excellent service";
    const varied = applyMicroVariation(text, 999);
    const firstWord = varied.split(" ")[0];
    if (firstWord !== "Excellent") {
      expect(firstWord[0]).toBe(firstWord[0].toUpperCase());
    }
  });

  it("preserves punctuation", () => {
    const text = "excellent, professional.";
    const varied = applyMicroVariation(text, 42);
    expect(varied).toMatch(/[,.]/)
  });

  it("returns original for text with no swappable words", () => {
    const text = "xyz abc 123";
    const varied = applyMicroVariation(text, 42);
    expect(varied).toBe(text);
  });

  it("handles empty string", () => {
    expect(applyMicroVariation("", 42)).toBe("");
  });
});

describe("spintax-engine: pool size minimums", () => {
  it("fallback pool produces minimum pool sizes", () => {
    const pool = generateFallbackPool({
      campaignId: "c1",
      workspaceId: "w1",
      serviceName: "Plumber",
      serviceDescription: "Professional plumbing",
      sectionCount: 3,
      languageCode: "en",
    });

    expect(pool.h1Variants.length).toBeGreaterThanOrEqual(6);

    for (let i = 0; i < 3; i++) {
      expect(pool.h2Variants[i].length).toBeGreaterThanOrEqual(5);
      expect(pool.paragraphVariants[i].length).toBeGreaterThanOrEqual(4);
    }
  });

  it("fallback pool contains placeholders", () => {
    const pool = generateFallbackPool({
      campaignId: "c1",
      workspaceId: "w1",
      serviceName: "Dentist",
      serviceDescription: "Dental care",
      sectionCount: 2,
      languageCode: "en",
    });

    const hasLocationPlaceholder = pool.h1Variants.some((v) => v.includes("{location}"));
    const hasKeywordPlaceholder = pool.h1Variants.some((v) => v.includes("{keyword}"));
    expect(hasLocationPlaceholder).toBe(true);
    expect(hasKeywordPlaceholder).toBe(true);
  });
});

describe("spintax-engine: storePool", () => {
  it("stores h1, h2, and paragraph pools", async () => {
    const pool = makeTestPool();
    const mockStorage = makeMockPoolStorage();

    await storePool("campaign-1", "workspace-1", pool, mockStorage);

    expect(mockStorage.upsertPool).toHaveBeenCalledTimes(5);

    expect(mockStorage.upsertPool).toHaveBeenCalledWith(
      expect.objectContaining({ poolType: "h1", zoneId: null })
    );
    expect(mockStorage.upsertPool).toHaveBeenCalledWith(
      expect.objectContaining({ poolType: "h2", zoneId: "section-0" })
    );
    expect(mockStorage.upsertPool).toHaveBeenCalledWith(
      expect.objectContaining({ poolType: "paragraph", zoneId: "section-1" })
    );
  });
});
