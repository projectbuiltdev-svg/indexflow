export interface PseoKeyword {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: KeywordIntent;
  source: KeywordSource;
}

export type KeywordIntent = "informational" | "navigational" | "commercial" | "transactional";

export type KeywordSource = "manual" | "ai-suggested" | "dataforseo" | "gsc";

export interface KeywordCluster {
  primary: string;
  variants: string[];
  totalVolume: number;
  avgDifficulty: number;
  intent: KeywordIntent;
}

export interface KeywordMapping {
  campaignId: string;
  pageId: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  lsiKeywords: string[];
}

export interface KeywordResearchRequest {
  campaignId: string;
  workspaceId: string;
  seedKeywords: string[];
  locationName?: string;
  serviceName?: string;
  language: string;
  country: string;
}

export interface KeywordResearchResult {
  keywords: PseoKeyword[];
  clusters: KeywordCluster[];
  totalVolume: number;
}

export interface KeywordDensityCheck {
  keyword: string;
  expectedDensity: number;
  actualDensity: number;
  status: "ok" | "too-low" | "too-high";
}

export interface KeywordCannibalizationResult {
  keyword: string;
  pages: Array<{ pageId: string; slug: string; position: number | null }>;
  conflictLevel: "none" | "low" | "medium" | "high";
}
