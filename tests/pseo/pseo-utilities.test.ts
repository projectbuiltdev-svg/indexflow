import { describe, it, expect } from "vitest";

import {
  hashSeed,
  seededRandom,
  seededSelect,
  seededSelectIndex,
} from "../../server/utils/pseo-hash-seeder";

import {
  tokenise,
  termFrequency,
  buildTfIdfVector,
} from "../../server/utils/pseo-tfidf-vectoriser";

import {
  dotProduct,
  l2Norm,
  cosineSimilarity,
} from "../../server/utils/pseo-cosine-similarity";

import {
  haversineDistance,
  findNearest,
} from "../../server/utils/pseo-haversine";

import {
  commercialIntentScore,
  getBusinessCategoryDemandIndex,
  scoreLocation,
} from "../../server/utils/pseo-commercial-intent-scorer";

describe("pseo-hash-seeder", () => {
  it("same inputs always produce same hash", () => {
    const a = hashSeed("loc-1", "svc-1");
    const b = hashSeed("loc-1", "svc-1");
    expect(a).toBe(b);
  });

  it("different inputs produce different hashes", () => {
    const a = hashSeed("loc-1", "svc-1");
    const b = hashSeed("loc-2", "svc-1");
    const c = hashSeed("loc-1", "svc-2");
    expect(a).not.toBe(b);
    expect(a).not.toBe(c);
    expect(b).not.toBe(c);
  });

  it("hashSeed returns a positive integer", () => {
    const h = hashSeed("abc", "def");
    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThan(0);
  });

  it("seededRandom returns value between 0 and 1", () => {
    for (let i = 0; i < 100; i++) {
      const r = seededRandom(i);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(1);
    }
  });

  it("seededRandom is deterministic", () => {
    expect(seededRandom(42)).toBe(seededRandom(42));
    expect(seededRandom(123)).toBe(seededRandom(123));
  });

  it("seededSelect picks same item for same seed", () => {
    const arr = ["a", "b", "c", "d", "e"];
    const pick1 = seededSelect(42, arr);
    const pick2 = seededSelect(42, arr);
    expect(pick1).toBe(pick2);
  });

  it("seededSelect covers different items with different seeds", () => {
    const arr = ["a", "b", "c", "d", "e"];
    const picks = new Set<string>();
    for (let i = 0; i < 100; i++) {
      picks.add(seededSelect(i, arr));
    }
    expect(picks.size).toBeGreaterThan(1);
  });

  it("seededSelectIndex returns valid index", () => {
    for (let i = 0; i < 50; i++) {
      const idx = seededSelectIndex(i, 10);
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBeLessThan(10);
    }
  });

  it("seededSelect throws on empty array", () => {
    expect(() => seededSelect(1, [])).toThrow();
  });
});

describe("pseo-tfidf-vectoriser", () => {
  it("tokenise removes English stop words", () => {
    const tokens = tokenise("the best plumber in the city", "en");
    expect(tokens).not.toContain("the");
    expect(tokens).not.toContain("in");
    expect(tokens).toContain("best");
    expect(tokens).toContain("plumber");
    expect(tokens).toContain("city");
  });

  it("tokenise removes French stop words", () => {
    const tokens = tokenise("le meilleur plombier de la ville", "fr");
    expect(tokens).not.toContain("le");
    expect(tokens).not.toContain("de");
    expect(tokens).not.toContain("la");
    expect(tokens).toContain("meilleur");
    expect(tokens).toContain("plombier");
    expect(tokens).toContain("ville");
  });

  it("tokenise lowercases and removes punctuation", () => {
    const tokens = tokenise("Hello, World! Great-Service.", "en");
    expect(tokens).toContain("hello");
    expect(tokens).toContain("world");
    expect(tokens).toContain("greatservice");
  });

  it("termFrequency normalises by token count", () => {
    const tf = termFrequency(["plumber", "plumber", "dublin", "best"]);
    expect(tf["plumber"]).toBeCloseTo(0.5);
    expect(tf["dublin"]).toBeCloseTo(0.25);
    expect(tf["best"]).toBeCloseTo(0.25);
  });

  it("termFrequency returns empty for empty tokens", () => {
    expect(termFrequency([])).toEqual({});
  });

  it("buildTfIdfVector full pipeline", () => {
    const vec = buildTfIdfVector("best plumber in Dublin city", "en");
    expect(vec["best"]).toBeDefined();
    expect(vec["plumber"]).toBeDefined();
    expect(vec["dublin"]).toBeDefined();
    expect(vec["in"]).toBeUndefined();
  });
});

describe("pseo-cosine-similarity", () => {
  it("identical vectors return 1.0", () => {
    const v = { a: 0.5, b: 0.3, c: 0.2 };
    expect(cosineSimilarity(v, v)).toBeCloseTo(1.0, 5);
  });

  it("orthogonal vectors return 0.0", () => {
    const a = { x: 1, y: 0 };
    const b = { a: 0, b: 1 };
    expect(cosineSimilarity(a, b)).toBeCloseTo(0.0);
  });

  it("empty vector returns 0.0", () => {
    expect(cosineSimilarity({}, { a: 1 })).toBe(0.0);
    expect(cosineSimilarity({ a: 1 }, {})).toBe(0.0);
    expect(cosineSimilarity({}, {})).toBe(0.0);
  });

  it("partially overlapping vectors return between 0 and 1", () => {
    const a = { x: 1, y: 1 };
    const b = { x: 1, z: 1 };
    const sim = cosineSimilarity(a, b);
    expect(sim).toBeGreaterThan(0);
    expect(sim).toBeLessThan(1);
    expect(sim).toBeCloseTo(0.5, 5);
  });

  it("dotProduct calculates correctly", () => {
    expect(dotProduct({ a: 2, b: 3 }, { a: 4, b: 5 })).toBe(23);
  });

  it("l2Norm calculates correctly", () => {
    expect(l2Norm({ a: 3, b: 4 })).toBeCloseTo(5.0);
  });
});

describe("pseo-haversine", () => {
  it("Dublin to London ≈ 288 miles", () => {
    const dist = haversineDistance(53.3498, -6.2603, 51.5074, -0.1278);
    expect(dist).toBeGreaterThan(280);
    expect(dist).toBeLessThan(300);
  });

  it("New York to Los Angeles ≈ 2445 miles", () => {
    const dist = haversineDistance(40.7128, -74.006, 34.0522, -118.2437);
    expect(dist).toBeGreaterThan(2430);
    expect(dist).toBeLessThan(2460);
  });

  it("same point returns 0", () => {
    const dist = haversineDistance(53.3498, -6.2603, 53.3498, -6.2603);
    expect(dist).toBeCloseTo(0, 5);
  });

  it("Paris to Berlin ≈ 545 miles", () => {
    const dist = haversineDistance(48.8566, 2.3522, 52.52, 13.405);
    expect(dist).toBeGreaterThan(535);
    expect(dist).toBeLessThan(555);
  });

  it("findNearest returns locations within radius sorted by distance", () => {
    const origin = { latitude: 53.3498, longitude: -6.2603 };
    const locations = [
      { id: "1", name: "Cork", latitude: 51.8985, longitude: -8.4756 },
      { id: "2", name: "Galway", latitude: 53.2707, longitude: -9.0568 },
      { id: "3", name: "London", latitude: 51.5074, longitude: -0.1278 },
      { id: "4", name: "Belfast", latitude: 54.5973, longitude: -5.9301 },
    ];

    const nearby = findNearest(origin, locations, 120);
    expect(nearby.length).toBe(2);
    expect(nearby[0].location.name).toBe("Belfast");
    expect(nearby[1].location.name).toBe("Galway");
    expect(nearby[0].distanceMiles).toBeLessThan(nearby[1].distanceMiles);
  });

  it("findNearest returns empty for no matches", () => {
    const origin = { latitude: 0, longitude: 0 };
    const locations = [
      { id: "1", name: "Far", latitude: 89, longitude: 179 },
    ];
    const nearby = findNearest(origin, locations, 10);
    expect(nearby).toEqual([]);
  });
});

describe("pseo-commercial-intent-scorer", () => {
  it("getBusinessCategoryDemandIndex returns known category index", () => {
    expect(getBusinessCategoryDemandIndex("plumber")).toBe(92);
    expect(getBusinessCategoryDemandIndex("solicitor")).toBe(88);
    expect(getBusinessCategoryDemandIndex("dentist")).toBe(87);
  });

  it("getBusinessCategoryDemandIndex returns 50 for unknown", () => {
    expect(getBusinessCategoryDemandIndex("xyz-unknown")).toBe(50);
  });

  it("getBusinessCategoryDemandIndex is case-insensitive", () => {
    expect(getBusinessCategoryDemandIndex("Plumber")).toBe(92);
    expect(getBusinessCategoryDemandIndex("DENTIST")).toBe(87);
  });

  it("commercialIntentScore returns value between 0 and 100", () => {
    const score = commercialIntentScore(500000, 80);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it("commercialIntentScore with zero population", () => {
    const score = commercialIntentScore(0, 80);
    expect(score).toBeCloseTo(32.0);
  });

  it("commercialIntentScore with max population and max demand", () => {
    const score = commercialIntentScore(10_000_000, 100);
    expect(score).toBeCloseTo(100.0);
  });

  it("commercialIntentScore with zero demand", () => {
    const score = commercialIntentScore(1_000_000, 0);
    expect(score).toBeCloseTo(6.0);
  });

  it("population capped at MAX_POPULATION", () => {
    const a = commercialIntentScore(10_000_000, 50);
    const b = commercialIntentScore(20_000_000, 50);
    expect(a).toBe(b);
  });

  it("scoreLocation combines population and category", () => {
    const score = scoreLocation({ population: 1_000_000 }, "plumber");
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBeGreaterThan(scoreLocation({ population: 100_000 }, "plumber"));
  });

  it("formula correctness: 500k pop, demand 80", () => {
    const normPop = 500000 / 10_000_000;
    const normDemand = 80 / 100;
    const expected = Math.round((normPop * 0.6 + normDemand * 0.4) * 100 * 100) / 100;
    expect(commercialIntentScore(500000, 80)).toBeCloseTo(expected);
  });
});
