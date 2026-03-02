import { describe, it, expect } from "vitest";
import {
  calculateRankMovement,
  shouldFlagPage,
} from "../integrations/google-search-console-rank-client";

describe("Rank Movement Calculation", () => {
  it("returns 'improved' when current position is lower (better) than previous", () => {
    expect(calculateRankMovement(3, 10)).toBe("improved");
    expect(calculateRankMovement(1, 2)).toBe("improved");
    expect(calculateRankMovement(5, 100)).toBe("improved");
  });

  it("returns 'declined' when current position is higher (worse) than previous", () => {
    expect(calculateRankMovement(10, 3)).toBe("declined");
    expect(calculateRankMovement(50, 10)).toBe("declined");
    expect(calculateRankMovement(2, 1)).toBe("declined");
  });

  it("returns 'stable' when positions are equal", () => {
    expect(calculateRankMovement(5, 5)).toBe("stable");
    expect(calculateRankMovement(1, 1)).toBe("stable");
    expect(calculateRankMovement(100, 100)).toBe("stable");
  });

  it("returns 'new' when previousPosition is null", () => {
    expect(calculateRankMovement(5, null)).toBe("new");
    expect(calculateRankMovement(1, null)).toBe("new");
    expect(calculateRankMovement(null, null)).toBe("new");
  });

  it("returns 'declined' when currentPosition is null but previousPosition exists", () => {
    expect(calculateRankMovement(null, 5)).toBe("declined");
    expect(calculateRankMovement(null, 1)).toBe("declined");
  });

  it("returns 'new' when previousPosition is undefined", () => {
    expect(calculateRankMovement(5, undefined as any)).toBe("new");
  });
});

describe("shouldFlagPage", () => {
  it("flags page with zero impressions published beyond FLAG_AFTER_DAYS", () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    expect(shouldFlagPage(0, thirtyDaysAgo, 21)).toBe(true);
  });

  it("does not flag page with impressions even if old", () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    expect(shouldFlagPage(10, thirtyDaysAgo, 21)).toBe(false);
  });

  it("does not flag page published recently", () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    expect(shouldFlagPage(0, fiveDaysAgo, 21)).toBe(false);
  });

  it("does not flag page with null publishedAt", () => {
    expect(shouldFlagPage(0, null, 21)).toBe(false);
  });

  it("flags page at exactly FLAG_AFTER_DAYS boundary", () => {
    const exactlyDaysAgo = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000);
    expect(shouldFlagPage(0, exactlyDaysAgo, 21)).toBe(true);
  });

  it("does not flag page one day before FLAG_AFTER_DAYS", () => {
    const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    expect(shouldFlagPage(0, twentyDaysAgo, 21)).toBe(false);
  });
});

describe("GSC not connected returns empty", () => {
  it("calculateRankMovement never throws regardless of input", () => {
    expect(() => calculateRankMovement(null, null)).not.toThrow();
    expect(() => calculateRankMovement(0, 0)).not.toThrow();
    expect(() => calculateRankMovement(-1, 5)).not.toThrow();
    expect(() => calculateRankMovement(undefined as any, undefined as any)).not.toThrow();
  });

  it("shouldFlagPage never throws regardless of input", () => {
    expect(() => shouldFlagPage(0, null, 21)).not.toThrow();
    expect(() => shouldFlagPage(0, new Date(), 0)).not.toThrow();
    expect(() => shouldFlagPage(-1, new Date(), 21)).not.toThrow();
  });
});
