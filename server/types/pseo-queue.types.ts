import type { CampaignState } from "../pseo/campaign-state-machine";

export type JobType = "page-generation" | "page-publish" | "rank-check" | "quality-gate" | "similarity-check";

export type JobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export type JobPriority = "low" | "normal" | "high" | "critical";

export interface QueueJob {
  id: string;
  campaignId: string;
  workspaceId: string;
  jobType: JobType;
  status: JobStatus;
  priority: JobPriority;
  payload: QueueJobPayload;
  result: QueueJobResult | null;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  error: string | null;
}

export type QueueJobPayload =
  | PageGenerationPayload
  | PagePublishPayload
  | RankCheckPayload
  | QualityGatePayload
  | SimilarityCheckPayload;

export interface PageGenerationPayload {
  jobType: "page-generation";
  campaignId: string;
  pageIds: string[];
  aiModel: string;
  language: string;
  batchSize: number;
}

export interface PagePublishPayload {
  jobType: "page-publish";
  campaignId: string;
  pageIds: string[];
  targetCms: string | null;
  domainId: string | null;
}

export interface RankCheckPayload {
  jobType: "rank-check";
  campaignId: string;
  pageIds: string[];
  keywords: string[];
}

export interface QualityGatePayload {
  jobType: "quality-gate";
  campaignId: string;
  pageIds: string[];
  similarityThreshold: number;
}

export interface SimilarityCheckPayload {
  jobType: "similarity-check";
  campaignId: string;
  pageIds: string[];
  threshold: number;
}

export interface QueueJobResult {
  processedCount: number;
  successCount: number;
  failCount: number;
  errors: Array<{ itemId: string; error: string }>;
  duration: number;
}

export interface QueueStats {
  queued: number;
  running: number;
  completed: number;
  failed: number;
  byJobType: Record<JobType, number>;
}

export interface QueueProgressEvent {
  jobId: string;
  campaignId: string;
  jobType: JobType;
  processed: number;
  total: number;
  percent: number;
  currentItem: string | null;
}

export interface CampaignJobTrigger {
  campaignId: string;
  workspaceId: string;
  fromState: CampaignState;
  toState: CampaignState;
  jobType: JobType;
}
