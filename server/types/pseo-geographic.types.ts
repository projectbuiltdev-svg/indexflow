export interface GeoRegion {
  name: string;
  type: GeoRegionType;
  locations: string[];
}

export type GeoRegionType = "zone" | "state" | "country" | "metro" | "custom";

export interface GeoCluster {
  centroid: GeoPoint;
  radius: number;
  locationIds: string[];
  name: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface GeoDistance {
  fromLocationId: string;
  toLocationId: string;
  distanceKm: number;
}

export interface GeoHeatmapCell {
  lat: number;
  lng: number;
  value: number;
  locationCount: number;
}

export interface GeoBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeoExpansionSuggestion {
  locationName: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  population: number | null;
  commercialIntentScore: number | null;
  reason: GeoExpansionReason;
}

export type GeoExpansionReason =
  | "gap-fill"
  | "high-population"
  | "high-commercial-intent"
  | "competitor-presence"
  | "neighbour-coverage";

export interface GeoServiceArea {
  campaignId: string;
  bounds: GeoBounds;
  totalLocations: number;
  coveredStates: string[];
  coveredZones: string[];
  gaps: GeoExpansionSuggestion[];
}

export interface GeoUrlParams {
  locationSlug: string;
  serviceSlug: string | null;
  stateSlug: string | null;
  zoneSlug: string | null;
}
