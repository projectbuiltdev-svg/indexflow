import type { PseoLocation, InsertPseoLocation } from "@shared/schema";

export type { PseoLocation, InsertPseoLocation };

export interface LocationWithImageCount extends PseoLocation {
  imageCount: number;
  pageCount: number;
}

export interface LocationImportRow {
  name: string;
  slug: string;
  latitude: string;
  longitude: string;
  state?: string;
  zone?: string;
  country?: string;
  population?: number;
  neighbours?: string[];
  landmarks?: string[];
}

export interface LocationImportResult {
  total: number;
  created: number;
  skipped: number;
  errors: LocationImportError[];
}

export interface LocationImportError {
  row: number;
  name: string;
  reason: string;
}

export interface LocationListFilters {
  campaignId: string;
  workspaceId: string;
  search?: string;
  excludeExcluded?: boolean;
  page?: number;
  limit?: number;
}

export interface LocationListResult {
  locations: LocationWithImageCount[];
  total: number;
  page: number;
  limit: number;
}

export interface LocationBulkUpdateRequest {
  locationIds: string[];
  updates: Partial<Pick<PseoLocation, "zone" | "state" | "country" | "isExcluded">>;
}

export interface LocationNeighbourSuggestion {
  locationId: string;
  suggestedNeighbours: string[];
  basedOn: "proximity" | "same-zone" | "same-state";
}

export interface LocationCoordinates {
  latitude: string;
  longitude: string;
}

export interface LocationBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
