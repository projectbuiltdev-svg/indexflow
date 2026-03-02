import type { PseoService, InsertPseoService } from "@shared/schema";

export type { PseoService, InsertPseoService };

export interface ServiceWithPageCount extends PseoService {
  pageCount: number;
}

export interface ServiceImportRow {
  name: string;
  slug: string;
  description?: string;
  category?: string;
  keywords?: string[];
}

export interface ServiceImportResult {
  total: number;
  created: number;
  skipped: number;
  errors: ServiceImportError[];
}

export interface ServiceImportError {
  row: number;
  name: string;
  reason: string;
}

export interface ServiceListFilters {
  campaignId: string;
  workspaceId: string;
  search?: string;
  category?: string;
  excludeExcluded?: boolean;
  page?: number;
  limit?: number;
}

export interface ServiceListResult {
  services: ServiceWithPageCount[];
  total: number;
  page: number;
  limit: number;
}

export interface ServiceBulkUpdateRequest {
  serviceIds: string[];
  updates: Partial<Pick<PseoService, "category" | "isExcluded">>;
}

export interface ServiceCategory {
  name: string;
  serviceCount: number;
}
