import { geocode, extractComponent, type GeocodingResult, type AddressComponent } from "../integrations/geocoding-client";
import { getNearbyLandmarks, type NearbyLandmark } from "../integrations/places-api-client";
import { haversineDistance, findNearest, type LocationWithCoords } from "../utils/pseo-haversine";
import { scoreLocation, getBusinessCategoryDemandIndex } from "../utils/pseo-commercial-intent-scorer";
import { MAX_LOCATIONS_PER_CAMPAIGN, MIN_RADIUS_MILES } from "../config/pseo-geographic-divisions";

export interface LocationResult {
  input: string;
  resolved: boolean;
  partial: boolean;
  lat: number | null;
  lng: number | null;
  formattedAddress: string | null;
  town: string | null;
  county: string | null;
  state: string | null;
  country: string | null;
  countryCode: string | null;
  population: number | null;
  commercialIntentScore: number | null;
  neighbours: NeighbourResult[];
  landmarks: NearbyLandmark[];
  imageSearchTerms: string[];
}

export interface NeighbourResult {
  id: string;
  name: string;
  distanceMiles: number;
}

export interface LocationResolverStorage {
  getGeoReferencesWithinRadius(
    lat: number,
    lng: number,
    radiusMiles: number
  ): Promise<LocationWithCoords[]>;
  getGeoReferencesByRegion(
    countryCode: string,
    zones: string[]
  ): Promise<LocationWithCoords[]>;
  getCampaignLocationCount(campaignId: string): Promise<number>;
  getCampaignLocations(campaignId: string): Promise<Array<{ lat: number; lng: number; name: string }>>;
}

export interface GeocodingClient {
  geocode(address: string): Promise<GeocodingResult | null>;
}

export interface PlacesClient {
  getNearbyLandmarks(lat: number, lng: number, category?: string): Promise<NearbyLandmark[]>;
}

const DEFAULT_NEIGHBOUR_RADIUS_MILES = 25;
const DUPLICATE_DISTANCE_THRESHOLD_MILES = 0.5;

export async function resolveLocation(
  input: string,
  workspaceId: string,
  storage: LocationResolverStorage,
  geocodingClient: GeocodingClient = { geocode },
  placesClient: PlacesClient = { getNearbyLandmarks },
  businessCategory?: string
): Promise<LocationResult> {
  const result: LocationResult = {
    input,
    resolved: false,
    partial: false,
    lat: null,
    lng: null,
    formattedAddress: null,
    town: null,
    county: null,
    state: null,
    country: null,
    countryCode: null,
    population: null,
    commercialIntentScore: null,
    neighbours: [],
    landmarks: [],
    imageSearchTerms: [],
  };

  const geoResult = await geocodingClient.geocode(input);
  if (!geoResult) {
    return result;
  }

  result.lat = geoResult.lat;
  result.lng = geoResult.lng;
  result.formattedAddress = geoResult.formattedAddress;

  const components = geoResult.addressComponents;
  result.town = extractComponent(components, "locality")
    || extractComponent(components, "postal_town")
    || extractComponent(components, "sublocality");
  result.county = extractComponent(components, "administrative_area_level_2");
  result.state = extractComponent(components, "administrative_area_level_1");
  result.country = extractComponent(components, "country");
  result.countryCode = extractShortComponent(components, "country");

  result.partial = !result.town || !result.state || !result.country;
  result.resolved = !!(result.lat && result.lng);

  if (businessCategory) {
    const population = result.population || 50000;
    result.commercialIntentScore = scoreLocation({ population }, businessCategory);
  }

  const nearbyLocations = await storage.getGeoReferencesWithinRadius(
    geoResult.lat,
    geoResult.lng,
    DEFAULT_NEIGHBOUR_RADIUS_MILES
  );

  const nearby = findNearest(
    { latitude: geoResult.lat, longitude: geoResult.lng },
    nearbyLocations,
    DEFAULT_NEIGHBOUR_RADIUS_MILES
  );

  result.neighbours = nearby
    .filter((n) => n.distanceMiles > 0.1)
    .map((n) => ({
      id: n.location.id,
      name: n.location.name,
      distanceMiles: Math.round(n.distanceMiles * 10) / 10,
    }));

  try {
    result.landmarks = await placesClient.getNearbyLandmarks(geoResult.lat, geoResult.lng);
  } catch {
    result.landmarks = [];
  }

  result.imageSearchTerms = buildImageSearchTerms(result);

  return result;
}

function extractShortComponent(components: AddressComponent[], type: string): string | null {
  const comp = components.find((c) => c.types.includes(type));
  return comp ? comp.shortName : null;
}

function buildImageSearchTerms(result: LocationResult): string[] {
  const terms: string[] = [];
  if (result.town) {
    terms.push(result.town);
    if (result.state) terms.push(`${result.town} ${result.state}`);
    if (result.country) terms.push(`${result.town} ${result.country}`);
  }
  if (result.landmarks.length > 0) {
    terms.push(...result.landmarks.slice(0, 2).map((l) => l.name));
  }
  return terms;
}

export async function resolveRadius(
  centrePoint: { lat: number; lng: number },
  radiusMiles: number,
  storage: LocationResolverStorage
): Promise<LocationWithCoords[]> {
  const effectiveRadius = Math.max(radiusMiles, MIN_RADIUS_MILES);

  const allLocations = await storage.getGeoReferencesWithinRadius(
    centrePoint.lat,
    centrePoint.lng,
    effectiveRadius
  );

  const nearby = findNearest(
    { latitude: centrePoint.lat, longitude: centrePoint.lng },
    allLocations,
    effectiveRadius
  );

  return nearby
    .map((n) => n.location)
    .sort((a, b) => {
      const popA = (a as any).population || 0;
      const popB = (b as any).population || 0;
      return popB - popA;
    });
}

export async function resolveRegion(
  countryCode: string,
  zones: string[],
  storage: LocationResolverStorage
): Promise<LocationWithCoords[]> {
  return storage.getGeoReferencesByRegion(countryCode, zones);
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  partial: boolean;
}

export async function validateLocation(
  location: LocationResult,
  campaignId: string,
  storage: LocationResolverStorage
): Promise<ValidationResult> {
  if (!location.lat || !location.lng) {
    return { valid: false, reason: "Cannot resolve latitude/longitude for this location", partial: false };
  }

  const count = await storage.getCampaignLocationCount(campaignId);
  if (count >= MAX_LOCATIONS_PER_CAMPAIGN) {
    return {
      valid: false,
      reason: `Campaign has reached maximum of ${MAX_LOCATIONS_PER_CAMPAIGN} locations`,
      partial: false,
    };
  }

  const existing = await storage.getCampaignLocations(campaignId);
  for (const loc of existing) {
    const dist = haversineDistance(location.lat, location.lng, loc.lat, loc.lng);
    if (dist < DUPLICATE_DISTANCE_THRESHOLD_MILES) {
      return {
        valid: false,
        reason: `Duplicate location — within ${DUPLICATE_DISTANCE_THRESHOLD_MILES} miles of existing location "${loc.name}"`,
        partial: false,
      };
    }
  }

  if (location.partial) {
    return { valid: true, reason: "Partial resolution — confirm location details", partial: true };
  }

  return { valid: true, partial: false };
}
