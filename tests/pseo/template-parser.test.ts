import { describe, it, expect, vi } from "vitest";

import {
  parseTemplate,
  parseTemplateWithBranding,
  extractBranding,
  fetchTemplateHtml,
  parseTemplateFromSource,
  type TemplateZoneDescriptor,
} from "../../server/pseo/template-parser";

const FULL_TEMPLATE = [
  `<style>.hero { color: #3b82f6; background: #3b82f6; } .cta { background-color: #3b82f6; } body { font-family: "Inter", sans-serif; } h1 { font-family: "Source Serif 4", serif; }</style>`,
  `<header class="site-header"><img src="/logo.png" alt="Logo"></header>`,
  `<nav id="main-nav">Home About</nav>`,
  `<h1>Your Title Here</h1>`,
  `<h2>Section Heading</h2>`,
  `<main>Main content area</main>`,
  `<article class="content-area">Article body text</article>`,
  `<section class="services">Our professional services</section>`,
  `<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`,
  `<footer class="site-footer">Copyright 2025</footer>`,
].join("\n");

const LOCKED_ONLY_TEMPLATE = [
  `<header class="site-header">Logo area</header>`,
  `<nav id="main-nav">Navigation links</nav>`,
  `<footer class="site-footer">Copyright content</footer>`,
  `<div class="brand-wrapper">Brand stuff</div>`,
].join("\n");

describe("template-parser: locked zone detection", () => {
  it("detects nav element as locked with 95% confidence", () => {
    const result = parseTemplate(FULL_TEMPLATE);
    const navZone = result.lockedZones.find((z) => z.elementType === "nav");
    expect(navZone).toBeDefined();
    expect(navZone!.confidenceScore).toBe(0.95);
    expect(navZone!.zoneType).toBe("locked");
  });

  it("detects header element as locked with 95% confidence", () => {
    const result = parseTemplate(FULL_TEMPLATE);
    const headerZone = result.lockedZones.find((z) => z.elementType === "header");
    expect(headerZone).toBeDefined();
    expect(headerZone!.confidenceScore).toBe(0.95);
  });

  it("detects footer element as locked with 95% confidence", () => {
    const result = parseTemplate(FULL_TEMPLATE);
    const footerZone = result.lockedZones.find((z) => z.elementType === "footer");
    expect(footerZone).toBeDefined();
    expect(footerZone!.confidenceScore).toBe(0.95);
  });

  it("detects elements with brand/logo class as locked", () => {
    const html = `<div class="brand-bar">Brand content</div><h1>Title</h1>`;
    const result = parseTemplate(html);
    const brandZone = result.lockedZones.find((z) =>
      z.cssSelector.includes("brand")
    );
    expect(brandZone).toBeDefined();
    expect(brandZone!.confidenceScore).toBeGreaterThanOrEqual(0.85);
  });

  it("auto-locks zones with confidence >= 80%", () => {
    const result = parseTemplate(FULL_TEMPLATE);
    for (const zone of result.lockedZones) {
      expect(zone.confidenceScore).toBeGreaterThanOrEqual(0.80);
    }
  });

  it("zones below 80% confidence go to dynamic", () => {
    const html = `<div class="unknown-widget">Some widget</div><h1>Title</h1>`;
    const result = parseTemplate(html);
    const widgetInDynamic = result.dynamicZones.find((z) =>
      z.cssSelector.includes("unknown-widget")
    );
    expect(widgetInDynamic).toBeDefined();
    expect(widgetInDynamic!.confidenceScore).toBeLessThan(0.80);
  });
});

describe("template-parser: dynamic zone detection", () => {
  it("detects h1 as dynamic with 90% confidence", () => {
    const result = parseTemplate(FULL_TEMPLATE);
    const h1Zone = result.dynamicZones.find((z) => z.elementType === "h1");
    expect(h1Zone).toBeDefined();
    expect(h1Zone!.confidenceScore).toBe(0.90);
    expect(h1Zone!.zoneType).toBe("dynamic");
  });

  it("detects h2 as dynamic", () => {
    const result = parseTemplate(FULL_TEMPLATE);
    const h2Zone = result.dynamicZones.find((z) => z.elementType === "h2");
    expect(h2Zone).toBeDefined();
  });

  it("detects main as dynamic", () => {
    const result = parseTemplate(FULL_TEMPLATE);
    const mainZone = result.dynamicZones.find((z) => z.elementType === "main");
    expect(mainZone).toBeDefined();
    expect(mainZone!.confidenceScore).toBe(0.90);
  });

  it("detects article as dynamic", () => {
    const result = parseTemplate(FULL_TEMPLATE);
    const articleZone = result.dynamicZones.find((z) => z.elementType === "article");
    expect(articleZone).toBeDefined();
  });

  it("detects section as dynamic", () => {
    const result = parseTemplate(FULL_TEMPLATE);
    const sectionZone = result.dynamicZones.find((z) => z.elementType === "section");
    expect(sectionZone).toBeDefined();
  });
});

describe("template-parser: lorem ipsum detection", () => {
  it("flags lorem ipsum content as dynamic with 95% confidence", () => {
    const html = `<div class="placeholder-area">Lorem ipsum dolor sit amet</div><h1>Title</h1>`;
    const result = parseTemplate(html);
    const loremZone = result.dynamicZones.find((z) =>
      z.contentSummary.toLowerCase().includes("lorem ipsum")
    );
    expect(loremZone).toBeDefined();
    expect(loremZone!.confidenceScore).toBe(0.95);
  });

  it("flags placeholder text as dynamic", () => {
    const html = `<div class="widget">Your text here for testing</div><h1>Title</h1>`;
    const result = parseTemplate(html);
    const placeholderZone = result.dynamicZones.find((z) =>
      z.contentSummary.toLowerCase().includes("your text here")
    );
    expect(placeholderZone).toBeDefined();
    expect(placeholderZone!.confidenceScore).toBe(0.95);
  });

  it("flags sample content as dynamic", () => {
    const html = `<div class="box">Sample text goes here</div><h1>Title</h1>`;
    const result = parseTemplate(html);
    const sampleZone = result.dynamicZones.find((z) =>
      z.contentSummary.toLowerCase().includes("sample text")
    );
    expect(sampleZone).toBeDefined();
    expect(sampleZone!.confidenceScore).toBe(0.95);
  });
});

describe("template-parser: extractBranding", () => {
  it("extracts primary colour from inline styles", () => {
    const branding = extractBranding(FULL_TEMPLATE);
    expect(branding.primaryColour).toBe("#3b82f6");
  });

  it("ignores black and white as primary colours", () => {
    const html = `<div style="color: #000000; background: #ffffff; border: 1px solid #ff5733;">test</div>`;
    const branding = extractBranding(html);
    expect(branding.primaryColour).toBe("#ff5733");
  });

  it("extracts font families", () => {
    const branding = extractBranding(FULL_TEMPLATE);
    expect(branding.fonts).toContain("Inter");
    expect(branding.fonts).toContain("Source Serif 4");
  });

  it("extracts logo URL from header img", () => {
    const branding = extractBranding(FULL_TEMPLATE);
    expect(branding.logoUrl).toBe("/logo.png");
  });

  it("returns null for logo when no header img", () => {
    const html = `<div><img src="/not-logo.png" alt="test"></div>`;
    const branding = extractBranding(html);
    expect(branding.logoUrl).toBeNull();
  });

  it("returns null for primary colour when none found", () => {
    const html = `<div>Plain text with no colours</div>`;
    const branding = extractBranding(html);
    expect(branding.primaryColour).toBeNull();
  });

  it("deduplicates font families", () => {
    const html = `<div style="font-family: Inter;">A</div><div style="font-family: Inter;">B</div>`;
    const branding = extractBranding(html);
    const interCount = branding.fonts.filter((f) => f === "Inter").length;
    expect(interCount).toBe(1);
  });
});

describe("template-parser: parseTemplateWithBranding", () => {
  it("returns full TemplateParseResult with branding", () => {
    const result = parseTemplateWithBranding(FULL_TEMPLATE);
    expect(result.primaryColour).toBe("#3b82f6");
    expect(result.fonts.length).toBeGreaterThan(0);
    expect(result.logoUrl).toBe("/logo.png");
    expect(result.hasMinimumDynamicZones).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.lockedZones.length).toBeGreaterThan(0);
    expect(result.dynamicZones.length).toBeGreaterThan(0);
  });

  it("returns error when no dynamic zones exist", () => {
    const result = parseTemplateWithBranding(LOCKED_ONLY_TEMPLATE);
    expect(result.hasMinimumDynamicZones).toBe(false);
    expect(result.error).toContain("at least one dynamic zone");
  });
});

describe("template-parser: fetchTemplateHtml", () => {
  it("returns HTML on successful fetch", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => "text/html; charset=utf-8" },
      text: () => Promise.resolve("<html><body>Hello</body></html>"),
    } as any);

    const result = await fetchTemplateHtml("https://example.com", mockFetch);
    expect(result.html).toBe("<html><body>Hello</body></html>");
    expect(result.error).toBeUndefined();
  });

  it("returns null on HTTP error", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      headers: { get: () => "text/html" },
    } as any);

    const result = await fetchTemplateHtml("https://example.com/missing", mockFetch);
    expect(result.html).toBeNull();
    expect(result.error).toContain("404");
  });

  it("returns null on network failure", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await fetchTemplateHtml("https://unreachable.com", mockFetch);
    expect(result.html).toBeNull();
    expect(result.error).toContain("Network error");
  });

  it("rejects non-HTML content types", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      text: () => Promise.resolve("{}"),
    } as any);

    const result = await fetchTemplateHtml("https://example.com/api", mockFetch);
    expect(result.html).toBeNull();
    expect(result.error).toContain("content type");
  });
});

describe("template-parser: parseTemplateFromSource", () => {
  it("parses URL source via fetch", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => "text/html" },
      text: () => Promise.resolve(FULL_TEMPLATE),
    } as any);

    const result = await parseTemplateFromSource("https://example.com", mockFetch);
    expect(result.hasMinimumDynamicZones).toBe(true);
    expect(result.lockedZones.length).toBeGreaterThan(0);
    expect(result.dynamicZones.length).toBeGreaterThan(0);
  });

  it("parses raw HTML string directly", async () => {
    const result = await parseTemplateFromSource(FULL_TEMPLATE);
    expect(result.hasMinimumDynamicZones).toBe(true);
  });

  it("returns error when URL fetch fails", async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error("Timeout"));

    const result = await parseTemplateFromSource("https://slow-site.com", mockFetch);
    expect(result.hasMinimumDynamicZones).toBe(false);
    expect(result.error).toContain("Timeout");
  });
});

describe("template-parser: confidence threshold", () => {
  it("elements at exactly 80% confidence are auto-locked", () => {
    const html = `<div class="content-area">Some content text here</div><h1>Title</h1>`;
    const result = parseTemplate(html);
    const contentDiv = result.dynamicZones.find((z) =>
      z.cssSelector.includes("content")
    );
    expect(contentDiv).toBeDefined();
    expect(contentDiv!.confidenceScore).toBeGreaterThanOrEqual(0.80);
  });

  it("all locked zones have confidence >= 80%", () => {
    const result = parseTemplate(FULL_TEMPLATE);
    for (const zone of result.lockedZones) {
      expect(zone.confidenceScore).toBeGreaterThanOrEqual(0.80);
    }
  });
});
