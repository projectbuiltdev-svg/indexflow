import { haversineDistance } from "../utils/pseo-haversine";
import { MIN_INTERNAL_LINKS, MAX_INTERNAL_LINKS } from "../config/pseo-gate-thresholds";

const NEIGHBOUR_RADIUS_MILES = 25;
const MAX_NEIGHBOUR_LINKS = 3;

export interface LinkMapperContext {
  campaignId: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  locationId: string;
  locationName: string;
  locationSlug: string;
  locationLat: number;
  locationLng: number;
  urlStructure: "location-first" | "service-first";
  indexPageSlug?: string;
}

export interface InternalLink {
  url: string;
  anchor: string;
  type: "service-hub" | "location-hub" | "neighbour" | "index";
}

export interface PublishedPage {
  id: string;
  slug: string;
  serviceId: string;
  locationId: string;
  locationName: string;
  locationLat: number;
  locationLng: number;
}

export interface LinkMapperStorage {
  getPublishedPages(campaignId: string, serviceId: string): Promise<PublishedPage[]>;
  hubPageExists(campaignId: string, slug: string): Promise<boolean>;
}

export function buildInternalLinks(
  ctx: LinkMapperContext,
  publishedPages: PublishedPage[],
  hubExists: { serviceHub: boolean; locationHub: boolean }
): InternalLink[] {
  const links: InternalLink[] = [];

  if (hubExists.serviceHub) {
    links.push({
      url: `/${ctx.serviceSlug}`,
      anchor: `All ${ctx.serviceName} locations`,
      type: "service-hub",
    });
  }

  if (hubExists.locationHub) {
    links.push({
      url: `/${ctx.locationSlug}`,
      anchor: `All services in ${ctx.locationName}`,
      type: "location-hub",
    });
  }

  const neighbourLinks = buildNeighbourLinks(ctx, publishedPages);
  links.push(...neighbourLinks);

  const indexSlug = ctx.indexPageSlug || "index";
  links.push({
    url: `/${indexSlug}`,
    anchor: "All services & locations",
    type: "index",
  });

  while (links.length < MIN_INTERNAL_LINKS) {
    if (!hubExists.serviceHub) {
      links.push({
        url: `/${ctx.serviceSlug}`,
        anchor: `${ctx.serviceName} services`,
        type: "service-hub",
      });
    }
    if (links.length < MIN_INTERNAL_LINKS && !hubExists.locationHub) {
      links.push({
        url: `/${ctx.locationSlug}`,
        anchor: `Services in ${ctx.locationName}`,
        type: "location-hub",
      });
    }
    if (links.length < MIN_INTERNAL_LINKS) {
      break;
    }
  }

  return links.slice(0, MAX_INTERNAL_LINKS);
}

export function buildNeighbourLinks(
  ctx: LinkMapperContext,
  publishedPages: PublishedPage[]
): InternalLink[] {
  const sameServicePages = publishedPages.filter(
    (p) => p.serviceId === ctx.serviceId && p.locationId !== ctx.locationId
  );

  const withDistance = sameServicePages
    .map((p) => ({
      page: p,
      distance: haversineDistance(ctx.locationLat, ctx.locationLng, p.locationLat, p.locationLng),
    }))
    .filter((d) => d.distance <= NEIGHBOUR_RADIUS_MILES && d.distance > 0)
    .sort((a, b) => a.distance - b.distance);

  return withDistance.slice(0, MAX_NEIGHBOUR_LINKS).map((d) => {
    const slug = ctx.urlStructure === "location-first"
      ? `${slugify(d.page.locationName)}/${ctx.serviceSlug}`
      : `${ctx.serviceSlug}/${slugify(d.page.locationName)}`;

    return {
      url: `/${slug}`,
      anchor: `${ctx.serviceName} in ${d.page.locationName}`,
      type: "neighbour" as const,
    };
  });
}

export function buildHubLinks(
  ctx: LinkMapperContext,
  hubExists: { serviceHub: boolean; locationHub: boolean }
): InternalLink[] {
  const links: InternalLink[] = [];

  if (hubExists.serviceHub) {
    links.push({
      url: `/${ctx.serviceSlug}`,
      anchor: `All ${ctx.serviceName} locations`,
      type: "service-hub",
    });
  }

  if (hubExists.locationHub) {
    links.push({
      url: `/${ctx.locationSlug}`,
      anchor: `All services in ${ctx.locationName}`,
      type: "location-hub",
    });
  }

  return links;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
