import { describe, it, expect } from "vitest";
import { runQualityGates, type PageContext } from "../../server/pseo/quality-gate-engine";

function makeCtx(overrides: Partial<PageContext> = {}): PageContext {
  return {
    primaryKeyword: "plumber",
    secondaryKeywords: ["emergency plumbing", "pipe repair"],
    locationName: "Dublin",
    domainName: "example.com",
    metaTitle: "Best Plumber in Dublin | Example",
    metaDescription: "Find a trusted plumber in Dublin for all your plumbing needs. Professional service, fast response times, and competitive pricing guaranteed.",
    ...overrides,
  };
}

const LONG_TEXT = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor. ".repeat(110);

function makePassingHtml(ctx: PageContext = makeCtx()): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${ctx.metaTitle}</title>
  <meta name="description" content="${ctx.metaDescription}">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"LocalBusiness","name":"Example Plumber"}</script>
</head>
<body>
  <h1>Expert Plumber Services in Dublin</h1>
  <p>Welcome to Dublin's most trusted plumber service. ${LONG_TEXT}</p>
  <h2>Emergency Plumbing Available 24/7</h2>
  <p>We offer comprehensive pipe repair and emergency plumbing across the city.</p>
  <a href="/services/plumbing">Our Services</a>
  <a href="/about">About Us</a>
  <a href="https://external-site.com/resource">External Resource</a>
  <img src="/images/plumber.jpg" alt="Professional plumber at work in Dublin">
</body>
</html>`;
}

describe("quality-gate-engine: all gates pass", () => {
  it("returns passed=true when all 12 gates pass", () => {
    const ctx = makeCtx();
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.passed).toBe(true);
    expect(result.failures).toEqual([]);
    expect(result.gateResults).toHaveLength(12);
    expect(result.gateResults.every((r) => r.passed)).toBe(true);
  });

  it("all 12 gate names are present", () => {
    const ctx = makeCtx();
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    const names = result.gateResults.map((r) => r.name);
    expect(names).toEqual([
      "Word count",
      "H1 keyword check",
      "Meta title keyword check",
      "Meta description presence",
      "Meta description length",
      "H2 secondary keyword check",
      "Internal link count",
      "External link count",
      "Image presence",
      "Alt text check",
      "Schema presence",
      "Location name check",
    ]);
  });
});

describe("quality-gate-engine: gate 1 — word count", () => {
  it("fails when word count below 800", () => {
    const ctx = makeCtx();
    const html = `<h1>Plumber in Dublin</h1><p>Dublin short text.</p>
      <h2>Emergency Plumbing</h2>
      <a href="/a">A</a><a href="/b">B</a><a href="https://ext.com">E</a>
      <img src="x.jpg" alt="x">
      <script type="application/ld+json">{"@type":"Thing"}</script>`;
    const result = runQualityGates(html, ctx);
    const gate1 = result.gateResults[0];
    expect(gate1.passed).toBe(false);
    expect(gate1.reason).toContain("below minimum 800");
  });

  it("passes when word count >= 800", () => {
    const ctx = makeCtx();
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[0].passed).toBe(true);
  });

  it("strips HTML tags before counting", () => {
    const ctx = makeCtx();
    const html = `<h1>Plumber</h1><p>Dublin. ${"word ".repeat(810)}</p>
      <h2>Emergency Plumbing</h2>
      <a href="/a">A</a><a href="/b">B</a><a href="https://ext.com">E</a>
      <img src="x.jpg" alt="x">
      <script type="application/ld+json">{"@type":"Thing"}</script>`;
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[0].passed).toBe(true);
  });
});

describe("quality-gate-engine: gate 2 — H1 keyword check", () => {
  it("fails when H1 missing primary keyword", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx).replace("Expert Plumber Services", "Expert Services Available");
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[1].passed).toBe(false);
    expect(result.gateResults[1].reason).toContain("plumber");
  });

  it("passes with case-insensitive match", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx).replace("Expert Plumber Services", "Expert PLUMBER Services");
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[1].passed).toBe(true);
  });
});

describe("quality-gate-engine: gate 3 — meta title keyword check", () => {
  it("fails when meta title missing keyword", () => {
    const ctx = makeCtx({ metaTitle: "Best Services in Dublin" });
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[2].passed).toBe(false);
  });

  it("passes when meta title contains keyword", () => {
    const ctx = makeCtx();
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[2].passed).toBe(true);
  });
});

describe("quality-gate-engine: gate 4 — meta description presence", () => {
  it("fails when meta description empty", () => {
    const ctx = makeCtx({ metaDescription: "" });
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[3].passed).toBe(false);
    expect(result.gateResults[3].reason).toContain("empty");
  });

  it("fails when meta description undefined", () => {
    const ctx = makeCtx({ metaDescription: undefined });
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[3].passed).toBe(false);
  });
});

describe("quality-gate-engine: gate 5 — meta description length", () => {
  it("fails when too short", () => {
    const ctx = makeCtx({ metaDescription: "Too short description." });
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[4].passed).toBe(false);
    expect(result.gateResults[4].reason).toContain("outside range");
  });

  it("fails when too long", () => {
    const ctx = makeCtx({ metaDescription: "A".repeat(200) });
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[4].passed).toBe(false);
  });

  it("passes at exactly 140 characters", () => {
    const ctx = makeCtx({ metaDescription: "A".repeat(140) });
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[4].passed).toBe(true);
  });

  it("passes at exactly 160 characters", () => {
    const ctx = makeCtx({ metaDescription: "A".repeat(160) });
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[4].passed).toBe(true);
  });
});

describe("quality-gate-engine: gate 6 — H2 secondary keyword check", () => {
  it("fails when no H2 contains secondary keyword", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx).replace("Emergency Plumbing Available 24/7", "Services Available 24/7");
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[5].passed).toBe(false);
  });

  it("passes when any H2 contains any secondary keyword", () => {
    const ctx = makeCtx();
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[5].passed).toBe(true);
  });

  it("fails when no secondary keywords provided", () => {
    const ctx = makeCtx({ secondaryKeywords: [] });
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[5].passed).toBe(false);
  });
});

describe("quality-gate-engine: gate 7 — internal link count", () => {
  it("fails with fewer than 2 internal links", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx)
      .replace('<a href="/about">About Us</a>', "");
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[6].passed).toBe(false);
    expect(result.gateResults[6].reason).toContain("below minimum 2");
  });

  it("counts same-domain absolute URLs as internal", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx)
      .replace('<a href="/services/plumbing">Our Services</a>', '<a href="https://example.com/services">Our Services</a>');
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[6].passed).toBe(true);
  });
});

describe("quality-gate-engine: gate 8 — external link count", () => {
  it("fails with no external links", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx)
      .replace('<a href="https://external-site.com/resource">External Resource</a>', "");
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[7].passed).toBe(false);
    expect(result.gateResults[7].reason).toContain("below minimum 1");
  });

  it("passes with 1+ external links", () => {
    const ctx = makeCtx();
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[7].passed).toBe(true);
  });
});

describe("quality-gate-engine: gate 9 — image presence", () => {
  it("fails with no images", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx)
      .replace('<img src="/images/plumber.jpg" alt="Professional plumber at work in Dublin">', "");
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[8].passed).toBe(false);
    expect(result.gateResults[8].reason).toContain("No images");
  });

  it("passes with at least 1 image", () => {
    const ctx = makeCtx();
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[8].passed).toBe(true);
  });
});

describe("quality-gate-engine: gate 10 — alt text check", () => {
  it("fails when image has empty alt", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx)
      .replace('alt="Professional plumber at work in Dublin"', 'alt=""');
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[9].passed).toBe(false);
    expect(result.gateResults[9].reason).toContain("missing alt text");
  });

  it("fails when image has no alt attribute", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx)
      .replace(' alt="Professional plumber at work in Dublin"', "");
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[9].passed).toBe(false);
  });
});

describe("quality-gate-engine: gate 11 — schema presence", () => {
  it("fails with no ld+json script", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx)
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, "");
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[10].passed).toBe(false);
    expect(result.gateResults[10].reason).toContain("No schema markup");
  });

  it("fails with invalid JSON in ld+json", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx)
      .replace('{"@context":"https://schema.org","@type":"LocalBusiness","name":"Example Plumber"}', "{invalid json}");
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[10].passed).toBe(false);
    expect(result.gateResults[10].reason).toContain("invalid JSON");
  });

  it("passes with valid ld+json", () => {
    const ctx = makeCtx();
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[10].passed).toBe(true);
  });
});

describe("quality-gate-engine: gate 12 — location name check", () => {
  it("fails when first paragraph does not contain location", () => {
    const ctx = makeCtx();
    const html = makePassingHtml(ctx)
      .replace("Welcome to Dublin's most trusted", "Welcome to the most trusted");
    const result = runQualityGates(html, ctx);
    expect(result.gateResults[11].passed).toBe(false);
    expect(result.gateResults[11].reason).toContain("Dublin");
  });

  it("passes with case-insensitive location match", () => {
    const ctx = makeCtx({ locationName: "DUBLIN" });
    const result = runQualityGates(makePassingHtml(ctx), ctx);
    expect(result.gateResults[11].passed).toBe(true);
  });
});

describe("quality-gate-engine: multiple failures", () => {
  it("collects all failures, not just the first", () => {
    const ctx = makeCtx({
      metaTitle: "No keyword here",
      metaDescription: "",
      secondaryKeywords: [],
    });
    const html = `<h1>No keyword here</h1><p>Short text, no location.</p>`;
    const result = runQualityGates(html, ctx);

    expect(result.passed).toBe(false);
    expect(result.failures.length).toBeGreaterThan(1);
    expect(result.gateResults).toHaveLength(12);
  });

  it("all 12 gates run even when early gates fail", () => {
    const ctx = makeCtx({
      metaTitle: "",
      metaDescription: "",
    });
    const html = "<p>Minimal page</p>";
    const result = runQualityGates(html, ctx);

    expect(result.gateResults).toHaveLength(12);
    const gateNumbers = result.gateResults.map((r) => r.gate);
    expect(gateNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("failure reasons are human-readable strings", () => {
    const ctx = makeCtx({ metaDescription: "" });
    const html = "<p>Minimal</p>";
    const result = runQualityGates(html, ctx);

    for (const failure of result.failures) {
      expect(typeof failure).toBe("string");
      expect(failure.length).toBeGreaterThan(10);
      expect(failure).not.toMatch(/^[A-Z_]+$/);
    }
  });

  it("worst case: all 12 gates fail simultaneously", () => {
    const ctx = makeCtx({
      metaTitle: "",
      metaDescription: "",
      secondaryKeywords: [],
    });
    const html = "<h1>Nothing</h1><p>Short.</p>";
    const result = runQualityGates(html, ctx);

    expect(result.passed).toBe(false);
    expect(result.failures.length).toBe(12);
    expect(result.gateResults.every((r) => !r.passed)).toBe(true);
  });
});
