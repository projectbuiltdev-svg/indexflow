import { describe, it, expect } from "vitest";
import { scoreOne } from "../../server/services/we-template-scorer";

function makeTemplate(overrides: Partial<{ category: string | null; styleTags: any; grapejsState: any }> = {}) {
  return {
    category: overrides.category ?? null,
    styleTags: overrides.styleTags ?? [],
    grapejsState: overrides.grapejsState ?? {},
  };
}

describe("we-template-scorer", () => {
  describe("scoreOne", () => {
    it("scores 8/8 with perfect match on all signals", () => {
      const intake = {
        businessType: "restaurant",
        needsContactForm: true,
        needsGallery: true,
        needsPricing: true,
        needsTestimonials: true,
        needsTeam: true,
        pageCount: 5,
        stylePreference: "modern",
      };

      const template = makeTemplate({
        category: "restaurant",
        styleTags: ["modern", "clean"],
        grapejsState: {
          blocks: [
            "form-contact",
            "media-gallery-grid",
            "pricing-table-3col",
            "social-testimonials-carousel",
            "team-grid",
            "nav-standard",
          ],
        },
      });

      expect(scoreOne(template, intake)).toBe(8);
    });

    it("scores 0 with no matches", () => {
      const intake = {
        businessType: "plumber",
        needsContactForm: false,
        needsGallery: false,
        needsPricing: false,
        needsTestimonials: false,
        needsTeam: false,
        pageCount: 1,
        stylePreference: "brutalist",
      };

      const template = makeTemplate({
        category: "bakery",
        styleTags: ["elegant"],
        grapejsState: { blocks: ["hero-centered"] },
      });

      expect(scoreOne(template, intake)).toBe(0);
    });

    it("handles missing intakeAnswers fields without error — defaults to 0", () => {
      const intake = {};
      const template = makeTemplate({
        category: "agency",
        styleTags: ["bold"],
        grapejsState: { blocks: ["form-contact", "team-grid"] },
      });

      expect(scoreOne(template, intake)).toBe(0);
    });

    it("scores partial matches correctly", () => {
      const intake = {
        businessType: "agency",
        needsContactForm: true,
        needsGallery: false,
        needsPricing: true,
      };

      const template = makeTemplate({
        category: "agency",
        grapejsState: { blocks: ["form-contact", "hero-centered"] },
      });

      expect(scoreOne(template, intake)).toBe(2);
    });

    it("signal 7: pageCount <= 3 matches single-page template", () => {
      const intake = { pageCount: 2 };
      const template = makeTemplate({
        grapejsState: { blocks: ["footer-standard"] },
      });

      expect(scoreOne(template, intake)).toBe(1);
    });

    it("signal 7: pageCount > 3 matches multi-page template", () => {
      const intake = { pageCount: 6 };
      const template = makeTemplate({
        grapejsState: { blocks: ["nav-standard"] },
      });

      expect(scoreOne(template, intake)).toBe(1);
    });

    it("signal 8: style preference matches styleTags", () => {
      const intake = { stylePreference: "Minimal" };
      const template = makeTemplate({ styleTags: ["minimal", "clean"] });

      expect(scoreOne(template, intake)).toBe(1);
    });

    it("signal 3: gallery matches masonry variant", () => {
      const intake = { needsGallery: true };
      const template = makeTemplate({
        grapejsState: { blocks: ["media-gallery-masonry"] },
      });

      expect(scoreOne(template, intake)).toBe(1);
    });

    it("template ID is not present in scoreOne return", () => {
      const result = scoreOne(makeTemplate(), {});
      expect(typeof result).toBe("number");
    });
  });
});
