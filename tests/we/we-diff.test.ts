import { describe, it, expect } from "vitest";
import { parseDiff, applyDiff, validateDiff } from "../../server/services/we-diff";

describe("we-diff", () => {
  describe("parseDiff", () => {
    it("parses valid diff correctly", () => {
      const input = JSON.stringify({
        changes: [
          { blockId: "hero-centered", action: "update", data: { headline: "New" } },
        ],
        pageLevel: { title: "My Page" },
      });
      const result = parseDiff(input);
      expect(result.valid).toBe(true);
      expect(result.diff?.changes).toHaveLength(1);
      expect(result.diff?.pageLevel?.title).toBe("My Page");
    });

    it("returns valid: false for invalid JSON, no throw", () => {
      const result = parseDiff("not json {{{");
      expect(result.valid).toBe(false);
      expect(result.diff).toBeNull();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("rejects unknown blockId", () => {
      const input = JSON.stringify({
        changes: [{ blockId: "totally-fake-block", action: "add", data: {} }],
      });
      const result = parseDiff(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("unknown blockId"))).toBe(true);
    });

    it("rejects unknown action", () => {
      const input = JSON.stringify({
        changes: [{ blockId: "hero-centered", action: "destroy", data: {} }],
      });
      const result = parseDiff(input);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("invalid action"))).toBe(true);
    });

    it("strips markdown fences before parsing", () => {
      const json = JSON.stringify({
        changes: [{ blockId: "hero-centered", action: "update", data: { text: "hi" } }],
      });
      const input = "```json\n" + json + "\n```";
      const result = parseDiff(input);
      expect(result.valid).toBe(true);
      expect(result.diff?.changes).toHaveLength(1);
    });
  });

  describe("applyDiff", () => {
    const baseState = {
      components: [
        { blockId: "hero-centered", headline: "Old", sub: "Sub" },
        { blockId: "nav-standard", links: [] },
        { blockId: "footer-standard", text: "Footer" },
      ],
    };

    it("update action merges data correctly", () => {
      const diff = {
        changes: [{ blockId: "hero-centered", action: "update" as const, data: { headline: "New" } }],
      };
      const result = applyDiff(baseState, diff);
      expect(result.success).toBe(true);
      expect(result.newState.components[0].headline).toBe("New");
      expect(result.newState.components[0].sub).toBe("Sub");
    });

    it("add action inserts at correct position", () => {
      const diff = {
        changes: [{ blockId: "cta-banner-centered", action: "add" as const, data: { text: "CTA" }, position: 1 }],
      };
      const result = applyDiff(baseState, diff);
      expect(result.success).toBe(true);
      expect(result.newState.components).toHaveLength(4);
      expect(result.newState.components[1].blockId).toBe("cta-banner-centered");
    });

    it("remove action removes correct block", () => {
      const diff = {
        changes: [{ blockId: "nav-standard", action: "remove" as const }],
      };
      const result = applyDiff(baseState, diff);
      expect(result.success).toBe(true);
      expect(result.newState.components).toHaveLength(2);
      expect(result.newState.components.find((c: any) => c.blockId === "nav-standard")).toBeUndefined();
    });

    it("reorder action moves to correct position", () => {
      const diff = {
        changes: [{ blockId: "footer-standard", action: "reorder" as const, position: 0 }],
      };
      const result = applyDiff(baseState, diff);
      expect(result.success).toBe(true);
      expect(result.newState.components[0].blockId).toBe("footer-standard");
    });

    it("failed change aborts entire diff, returns original state", () => {
      const diff = {
        changes: [{ blockId: "nonexistent-block", action: "update" as const, data: {} }],
      };
      const result = applyDiff(baseState, diff);
      expect(result.success).toBe(false);
      expect(result.newState).toEqual(baseState);
      expect(result.failedChange?.blockId).toBe("nonexistent-block");
    });

    it("never mutates input state", () => {
      const original = JSON.parse(JSON.stringify(baseState));
      const diff = {
        changes: [{ blockId: "hero-centered", action: "update" as const, data: { headline: "Changed" } }],
      };
      applyDiff(baseState, diff);
      expect(baseState).toEqual(original);
    });

    it("pageLevel title and slug applied correctly", () => {
      const diff = {
        changes: [],
        pageLevel: { title: "New Title", slug: "/new-slug" },
      };
      const result = applyDiff(baseState, diff);
      expect(result.success).toBe(true);
      expect(result.newState.title).toBe("New Title");
      expect(result.newState.slug).toBe("/new-slug");
    });
  });

  describe("validateDiff", () => {
    it("returns valid for correct diff", () => {
      const state = { components: [{ blockId: "hero-centered" }] };
      const diff = { changes: [{ blockId: "hero-centered", action: "update" as const, data: {} }] };
      const result = validateDiff(diff, state);
      expect(result.valid).toBe(true);
    });

    it("warns about missing blockId in state", () => {
      const state = { components: [{ blockId: "hero-centered" }] };
      const diff = { changes: [{ blockId: "nav-standard", action: "update" as const, data: {} }] };
      const result = validateDiff(diff, state);
      expect(result.valid).toBe(false);
      expect(result.warnings.some((w) => w.includes("not found"))).toBe(true);
    });
  });
});
