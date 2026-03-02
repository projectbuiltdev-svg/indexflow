import type { QualityGateStatus } from "./pseo-page.types";

export interface CampaignReport {
  campaignId: string;
  generatedAt: Date;
  summary: CampaignReportSummary;
  qualityBreakdown: QualityBreakdown;
  topPerformingPages: PagePerformanceEntry[];
  contentCoverage: ContentCoverageEntry[];
  issues: CampaignIssue[];
}

export interface CampaignReportSummary {
  totalPages: number;
  publishedPages: number;
  indexedPages: number;
  avgQualityScore: number;
  avgSimilarityScore: number;
  totalLocations: number;
  totalServices: number;
  locationCoverage: number;
  serviceCoverage: number;
}

export interface QualityBreakdown {
  pass: number;
  fail: number;
  pending: number;
  override: number;
  failReasonCounts: Record<string, number>;
}

export interface PagePerformanceEntry {
  pageId: string;
  slug: string;
  title: string;
  qualityGateStatus: QualityGateStatus;
  similarityScore: number | null;
  isPublished: boolean;
  isIndexed: boolean;
}

export interface ContentCoverageEntry {
  type: "location" | "service";
  name: string;
  id: string;
  pagesGenerated: number;
  pagesPublished: number;
  covered: boolean;
}

export interface CampaignIssue {
  severity: "error" | "warning" | "info";
  category: CampaignIssueCategory;
  message: string;
  affectedPageIds: string[];
}

export type CampaignIssueCategory =
  | "duplicate-content"
  | "missing-meta"
  | "missing-schema"
  | "quality-fail"
  | "orphan-page"
  | "over-linked"
  | "thin-content"
  | "missing-h1"
  | "slug-conflict";

export interface CampaignReportExport {
  format: "csv" | "json" | "pdf";
  campaignId: string;
  sections: CampaignReportSection[];
}

export type CampaignReportSection =
  | "summary"
  | "quality"
  | "pages"
  | "coverage"
  | "issues"
  | "links";
