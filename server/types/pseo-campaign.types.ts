import type { PseoCampaign, InsertPseoCampaign } from "@shared/schema";
import type { CampaignState, TransitionMeta } from "../pseo/campaign-state-machine";

export type { PseoCampaign, InsertPseoCampaign };

export interface CampaignWithCounts extends PseoCampaign {
  serviceCount: number;
  locationCount: number;
  pageCount: number;
  publishedPageCount: number;
  failedPageCount: number;
}

export interface CampaignProgress {
  campaignId: string;
  totalPages: number;
  pagesGenerated: number;
  pagesPublished: number;
  pagesFailed: number;
  percentGenerated: number;
  percentPublished: number;
}

export interface CampaignTransitionRequest {
  campaignId: string;
  workspaceId: string;
  targetState: CampaignState;
  triggeredBy: string;
}

export interface CampaignTransitionResult {
  success: boolean;
  previousState: CampaignState;
  newState: CampaignState;
  transition: TransitionMeta;
  backgroundJobStarted: boolean;
}

export interface CampaignListFilters {
  workspaceId: string;
  status?: CampaignState;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CampaignListResult {
  campaigns: CampaignWithCounts[];
  total: number;
  page: number;
  limit: number;
}

export interface CampaignDuplicateRequest {
  sourceCampaignId: string;
  workspaceId: string;
  newName: string;
  includeServices: boolean;
  includeLocations: boolean;
  includeTemplate: boolean;
}

export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalPagesGenerated: number;
  totalPagesPublished: number;
  byCampaignState: Record<CampaignState, number>;
}
