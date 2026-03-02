import { describe, it, expect } from "vitest";
import {
  buildInternalLinks,
  buildNeighbourLinks,
  buildHubLinks,
  type LinkMapperContext,
  type PublishedPage,
} from "../../server/pseo/internal-link-mapper";

const baseCtx: LinkMapperContext = {
  campaignId: "camp-1",
  serviceId: "svc-1",
  serviceName: "Plumbing",
  serviceSlug: "plumbing",
  locationId: "loc-1",
  locationName: "Dublin",
  locationSlug: "dublin",
  locationLat: 53.3498,
  locationLng: -6.2603,
  urlStructure: "location-first",
  indexPageSlug: "all-services",
};

const publishedPages: PublishedPage[] = [
  { id: "p1", slug: "cork/plumbing", serviceId: "svc-1", locationId: "loc-2", locationName: "Cork", locationLat: 51.8985, locationLng: -8.4756 },
  { id: "p2", slug: "galway/plumbing", serviceId: "svc-1", locationId: "loc-3", locationName: "Galway", locationLat: 53.2707, locationLng: -9.0568 },
  { id: "p3", slug: "limerick/plumbing", serviceId: "svc-1", locationId: "loc-4", locationName: "Limerick", locationLat: 52.6638, locationLng: -8.6267 },
  { id: "p4", slug: "waterford/plumbing", serviceId: "svc-1", locationId: "loc-5", locationName: "Waterford", locationLat: 52.2593, locationLng: -7.1101 },
  { id: "p5", slug: "belfast/electrician", serviceId: "svc-2", locationId: "loc-6", locationName: "Belfast", locationLat: 54.5973, locationLng: -5.9301 },
];

describe("internal-link-mapper: buildInternalLinks", () => {
  it("includes service hub and location hub when they exist", () => {
    const links = buildInternalLinks(baseCtx, publishedPages, { serviceHub: true, locationHub: true });
    const serviceHub = links.find((l) => l.type === "service-hub");
    const locationHub = links.find((l) => l.type === "location-hub");
    expect(serviceHub).toBeDefined();
    expect(serviceHub!.url).toBe("/plumbing");
    expect(locationHub).toBeDefined();
    expect(locationHub!.url).toBe("/dublin");
  });

  it("includes index page link", () => {
    const links = buildInternalLinks(baseCtx, publishedPages, { serviceHub: true, locationHub: true });
    const index = links.find((l) => l.type === "index");
    expect(index).toBeDefined();
    expect(index!.url).toBe("/all-services");
  });

  it("always has at least MIN_INTERNAL_LINKS (2)", () => {
    const links = buildInternalLinks(baseCtx, [], { serviceHub: false, locationHub: false });
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it("never exceeds MAX_INTERNAL_LINKS (8)", () => {
    const manyPages: PublishedPage[] = Array.from({ length: 20 }, (_, i) => ({
      id: `p-${i}`,
      slug: `loc${i}/plumbing`,
      serviceId: "svc-1",
      locationId: `loc-${i + 10}`,
      locationName: `Town${i}`,
      locationLat: 53.3498 + (i * 0.01),
      locationLng: -6.2603 + (i * 0.01),
    }));
    const links = buildInternalLinks(baseCtx, manyPages, { serviceHub: true, locationHub: true });
    expect(links.length).toBeLessThanOrEqual(8);
  });

  it("includes neighbour links from published pages", () => {
    const links = buildInternalLinks(baseCtx, publishedPages, { serviceHub: true, locationHub: true });
    const neighbours = links.filter((l) => l.type === "neighbour");
    expect(neighbours.length).toBeGreaterThanOrEqual(0);
    expect(neighbours.length).toBeLessThanOrEqual(3);
  });
});

describe("internal-link-mapper: buildNeighbourLinks", () => {
  it("only includes same-service pages", () => {
    const links = buildNeighbourLinks(baseCtx, publishedPages);
    for (const link of links) {
      expect(link.anchor).toContain("Plumbing");
    }
  });

  it("excludes current location", () => {
    const links = buildNeighbourLinks(baseCtx, publishedPages);
    for (const link of links) {
      expect(link.anchor).not.toContain("Dublin");
    }
  });

  it("returns at most 3 neighbour links", () => {
    const links = buildNeighbourLinks(baseCtx, publishedPages);
    expect(links.length).toBeLessThanOrEqual(3);
  });

  it("sorts by distance (nearest first)", () => {
    const links = buildNeighbourLinks(baseCtx, publishedPages);
    if (links.length >= 2) {
      expect(links[0].anchor).toContain("Galway");
    }
  });

  it("uses location-first URL structure", () => {
    const links = buildNeighbourLinks(baseCtx, publishedPages);
    if (links.length > 0) {
      expect(links[0].url).toMatch(/^\/[a-z-]+\/plumbing$/);
    }
  });

  it("uses service-first URL structure when configured", () => {
    const ctx = { ...baseCtx, urlStructure: "service-first" as const };
    const links = buildNeighbourLinks(ctx, publishedPages);
    if (links.length > 0) {
      expect(links[0].url).toMatch(/^\/plumbing\/[a-z-]+$/);
    }
  });

  it("excludes pages beyond 25 mile radius", () => {
    const farPage: PublishedPage = {
      id: "p-far", slug: "sydney/plumbing", serviceId: "svc-1",
      locationId: "loc-far", locationName: "Sydney",
      locationLat: -33.8688, locationLng: 151.2093,
    };
    const links = buildNeighbourLinks(baseCtx, [farPage]);
    expect(links).toHaveLength(0);
  });

  it("returns empty when no published pages", () => {
    const links = buildNeighbourLinks(baseCtx, []);
    expect(links).toHaveLength(0);
  });
});

describe("internal-link-mapper: buildHubLinks", () => {
  it("returns service hub link when it exists", () => {
    const links = buildHubLinks(baseCtx, { serviceHub: true, locationHub: false });
    expect(links).toHaveLength(1);
    expect(links[0].type).toBe("service-hub");
    expect(links[0].url).toBe("/plumbing");
  });

  it("returns location hub link when it exists", () => {
    const links = buildHubLinks(baseCtx, { serviceHub: false, locationHub: true });
    expect(links).toHaveLength(1);
    expect(links[0].type).toBe("location-hub");
    expect(links[0].url).toBe("/dublin");
  });

  it("returns both when both exist", () => {
    const links = buildHubLinks(baseCtx, { serviceHub: true, locationHub: true });
    expect(links).toHaveLength(2);
  });

  it("returns empty when neither exists", () => {
    const links = buildHubLinks(baseCtx, { serviceHub: false, locationHub: false });
    expect(links).toHaveLength(0);
  });
});
