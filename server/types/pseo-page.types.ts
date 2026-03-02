import type { PseoPage, InsertPseoPage, PseoLocation, PseoService } from "@shared/schema";

export type { PseoPage, InsertPseoPage };

export type PageType = "location" | "service" | "location-service";

export type QualityGateStatus = "pending" | "pass" | "fail" | "override";

export interface PageWithRelations extends PseoPage {
  location: PseoLocation | null;
  service: PseoService | null;
}

export interface PageGenerationInput {
  campaignId: string;
  workspaceId: string;
  locationId: string | null;
  serviceId: string | null;
  pageType: PageType;
  urlStructure: string;
  templateHtml: string | null;
  language: string;
  aiModel: string;
}

export interface PageGenerationOutput {
  slug: string;
  title: string;
  h1Variant: string;
  paragraphVariants: string[];
  metaTitle: string;
  metaDescription: string;
  schemaJson: Record<string, any>;
  internalLinks: PageInternalLink[];
}

export interface PageInternalLink {
  url: string;
  anchor: string;
}

export interface PageQualityResult {
  pageId: string;
  status: QualityGateStatus;
  failReasons: string[];
  similarityScore: number;
  wordCount: number;
  readabilityScore: number;
  duplicateOf: string | null;
}

export interface PageListFilters {
  campaignId: string;
  workspaceId: string;
  pageType?: PageType;
  qualityGateStatus?: QualityGateStatus;
  isPublished?: boolean;
  search?: string;
  locationId?: string;
  serviceId?: string;
  page?: number;
  limit?: number;
}

export interface PageListResult {
  pages: PageWithRelations[];
  total: number;
  page: number;
  limit: number;
}

export interface PageBulkPublishRequest {
  pageIds: string[];
  campaignId: string;
  workspaceId: string;
}

export interface PageBulkPublishResult {
  total: number;
  published: number;
  failed: number;
  errors: Array<{ pageId: string; reason: string }>;
}

export interface PageRegenerationRequest {
  pageId: string;
  campaignId: string;
  workspaceId: string;
  fieldsToRegenerate: Array<"title" | "h1" | "paragraphs" | "meta" | "schema" | "links">;
}

export interface PageSimilarityCheck {
  pageId: string;
  comparedToPageId: string;
  similarityScore: number;
  flagged: boolean;
}
