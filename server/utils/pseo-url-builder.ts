import { db } from "../db";
import { pseoLocations, pseoServices, pseoCampaigns, pseoPages, workspaceSitePages } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { excludeDeleted } from "./pseo-soft-delete";

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export type UrlStructure = "location_first" | "service_first";

export function buildPseoUrl(
  town: string,
  service: string,
  country: string,
  state: string,
  urlStructure: UrlStructure
): string {
  const townSlug = slugify(town);
  const serviceSlug = slugify(service);
  const countrySlug = slugify(country);
  const stateSlug = slugify(state);

  if (urlStructure === "service_first") {
    return `/${serviceSlug}/${countrySlug}/${stateSlug}/${townSlug}`;
  }

  return `/${countrySlug}/${stateSlug}/${townSlug}/${serviceSlug}`;
}

export interface SlugConflict {
  slug: string;
  locationName: string;
  serviceName: string;
  conflictsWith: "cms_page" | "pseo_page";
  existingPageId?: string | number;
}

export async function detectSlugConflicts(
  campaignId: string,
  workspaceId: string
): Promise<SlugConflict[]> {
  const [campaign] = await db
    .select()
    .from(pseoCampaigns)
    .where(eq(pseoCampaigns.id, campaignId));

  if (!campaign) return [];

  const urlStructure = campaign.urlStructure as UrlStructure;

  const locations = await db
    .select()
    .from(pseoLocations)
    .where(
      and(
        eq(pseoLocations.campaignId, campaignId),
        eq(pseoLocations.isExcluded, false)
      )
    );

  const services = await db
    .select()
    .from(pseoServices)
    .where(
      and(
        eq(pseoServices.campaignId, campaignId),
        eq(pseoServices.isExcluded, false)
      )
    );

  const plannedSlugs: Array<{
    slug: string;
    locationName: string;
    serviceName: string;
  }> = [];

  for (const location of locations) {
    for (const service of services) {
      const url = buildPseoUrl(
        location.name,
        service.name,
        location.country,
        location.state || "",
        urlStructure
      );
      const slug = url.replace(/^\//, "");
      plannedSlugs.push({
        slug,
        locationName: location.name,
        serviceName: service.name,
      });
    }
  }

  if (plannedSlugs.length === 0) return [];

  const existingCmsPages = await db
    .select({ id: workspaceSitePages.id, slug: workspaceSitePages.slug })
    .from(workspaceSitePages)
    .where(eq(workspaceSitePages.workspaceId, workspaceId));

  const cmsSlugs = new Map<string, number>();
  for (const page of existingCmsPages) {
    if (page.slug) {
      cmsSlugs.set(page.slug.replace(/^\//, ""), page.id);
    }
  }

  const existingPseoPages = await db
    .select({ id: pseoPages.id, slug: pseoPages.slug })
    .from(pseoPages)
    .where(
      and(
        eq(pseoPages.venueId, workspaceId),
        excludeDeleted(pseoPages as any)
      )
    );

  const pseoSlugs = new Map<string, string>();
  for (const page of existingPseoPages) {
    pseoSlugs.set(page.slug.replace(/^\//, ""), page.id);
  }

  const conflicts: SlugConflict[] = [];

  for (const planned of plannedSlugs) {
    if (cmsSlugs.has(planned.slug)) {
      conflicts.push({
        slug: planned.slug,
        locationName: planned.locationName,
        serviceName: planned.serviceName,
        conflictsWith: "cms_page",
        existingPageId: cmsSlugs.get(planned.slug),
      });
    }

    if (pseoSlugs.has(planned.slug)) {
      conflicts.push({
        slug: planned.slug,
        locationName: planned.locationName,
        serviceName: planned.serviceName,
        conflictsWith: "pseo_page",
        existingPageId: pseoSlugs.get(planned.slug),
      });
    }
  }

  const seen = new Set<string>();
  for (let i = 0; i < plannedSlugs.length; i++) {
    const slug = plannedSlugs[i].slug;
    if (seen.has(slug)) {
      conflicts.push({
        slug,
        locationName: plannedSlugs[i].locationName,
        serviceName: plannedSlugs[i].serviceName,
        conflictsWith: "pseo_page",
      });
    }
    seen.add(slug);
  }

  return conflicts;
}
