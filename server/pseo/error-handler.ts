import type { CampaignState } from "./campaign-state-machine";
import type { QualityGateStatus } from "../types/pseo-page.types";
import type { JobType } from "../types/pseo-queue.types";

// Placeholder imports — config files created in Pre-Build Step 5
// import { PSEO_CONFIG } from "./pseo-config";

export enum PseoErrorType {
  AI_GENERATION_FAILED = "AI_GENERATION_FAILED",
  AI_TIMEOUT = "AI_TIMEOUT",
  AI_KEY_INVALID = "AI_KEY_INVALID",
  AI_QUOTA_EXCEEDED = "AI_QUOTA_EXCEEDED",

  PLACES_API_FAILED = "PLACES_API_FAILED",
  GEOCODING_FAILED = "GEOCODING_FAILED",
  IMAGE_BANK_FAILED = "IMAGE_BANK_FAILED",

  CMS_PUBLISH_FAILED = "CMS_PUBLISH_FAILED",
  INDEXING_API_FAILED = "INDEXING_API_FAILED",
  GSC_API_FAILED = "GSC_API_FAILED",

  DATABASE_WRITE_FAILED = "DATABASE_WRITE_FAILED",
  DATABASE_READ_FAILED = "DATABASE_READ_FAILED",

  QUALITY_GATE_FAILED = "QUALITY_GATE_FAILED",
  SIMILARITY_THRESHOLD_EXCEEDED = "SIMILARITY_THRESHOLD_EXCEEDED",

  CAMPAIGN_LIMIT_REACHED = "CAMPAIGN_LIMIT_REACHED",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  PAYMENT_FAILED = "PAYMENT_FAILED",

  BYOK_KEY_MISSING = "BYOK_KEY_MISSING",
  BYOK_VALIDATION_FAILED = "BYOK_VALIDATION_FAILED",

  URL_CONFLICT = "URL_CONFLICT",
  SLUG_DUPLICATE = "SLUG_DUPLICATE",
  TEMPLATE_PARSE_FAILED = "TEMPLATE_PARSE_FAILED",

  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  CONCURRENT_LIMIT_EXCEEDED = "CONCURRENT_LIMIT_EXCEEDED",

  INVALID_STATE_TRANSITION = "INVALID_STATE_TRANSITION",
  CAMPAIGN_NOT_FOUND = "CAMPAIGN_NOT_FOUND",
  PAGE_NOT_FOUND = "PAGE_NOT_FOUND",
}

export interface PseoErrorMeta {
  campaignId?: string;
  workspaceId?: string;
  pageId?: string;
  locationId?: string;
  serviceId?: string;
  jobId?: string;
  jobType?: JobType;
  fromState?: CampaignState;
  toState?: CampaignState;
  retryable?: boolean;
  originalError?: string;
  [key: string]: unknown;
}

export interface PseoErrorResponse {
  error: true;
  type: PseoErrorType;
  message: string;
  meta: PseoErrorMeta;
  timestamp: string;
  httpStatus: number;
}

const ERROR_HTTP_STATUS: Record<PseoErrorType, number> = {
  [PseoErrorType.AI_GENERATION_FAILED]: 502,
  [PseoErrorType.AI_TIMEOUT]: 504,
  [PseoErrorType.AI_KEY_INVALID]: 401,
  [PseoErrorType.AI_QUOTA_EXCEEDED]: 429,
  [PseoErrorType.PLACES_API_FAILED]: 502,
  [PseoErrorType.GEOCODING_FAILED]: 502,
  [PseoErrorType.IMAGE_BANK_FAILED]: 502,
  [PseoErrorType.CMS_PUBLISH_FAILED]: 502,
  [PseoErrorType.INDEXING_API_FAILED]: 502,
  [PseoErrorType.GSC_API_FAILED]: 502,
  [PseoErrorType.DATABASE_WRITE_FAILED]: 500,
  [PseoErrorType.DATABASE_READ_FAILED]: 500,
  [PseoErrorType.QUALITY_GATE_FAILED]: 422,
  [PseoErrorType.SIMILARITY_THRESHOLD_EXCEEDED]: 422,
  [PseoErrorType.CAMPAIGN_LIMIT_REACHED]: 403,
  [PseoErrorType.PERMISSION_DENIED]: 403,
  [PseoErrorType.PAYMENT_FAILED]: 402,
  [PseoErrorType.BYOK_KEY_MISSING]: 400,
  [PseoErrorType.BYOK_VALIDATION_FAILED]: 400,
  [PseoErrorType.URL_CONFLICT]: 409,
  [PseoErrorType.SLUG_DUPLICATE]: 409,
  [PseoErrorType.TEMPLATE_PARSE_FAILED]: 422,
  [PseoErrorType.RATE_LIMIT_EXCEEDED]: 429,
  [PseoErrorType.CONCURRENT_LIMIT_EXCEEDED]: 429,
  [PseoErrorType.INVALID_STATE_TRANSITION]: 409,
  [PseoErrorType.CAMPAIGN_NOT_FOUND]: 404,
  [PseoErrorType.PAGE_NOT_FOUND]: 404,
};

const RETRYABLE_ERRORS = new Set<PseoErrorType>([
  PseoErrorType.AI_GENERATION_FAILED,
  PseoErrorType.AI_TIMEOUT,
  PseoErrorType.PLACES_API_FAILED,
  PseoErrorType.GEOCODING_FAILED,
  PseoErrorType.IMAGE_BANK_FAILED,
  PseoErrorType.CMS_PUBLISH_FAILED,
  PseoErrorType.INDEXING_API_FAILED,
  PseoErrorType.GSC_API_FAILED,
  PseoErrorType.DATABASE_WRITE_FAILED,
  PseoErrorType.DATABASE_READ_FAILED,
  PseoErrorType.RATE_LIMIT_EXCEEDED,
]);

const CAMPAIGN_PAUSE_ERRORS = new Set<PseoErrorType>([
  PseoErrorType.AI_KEY_INVALID,
  PseoErrorType.AI_QUOTA_EXCEEDED,
  PseoErrorType.BYOK_KEY_MISSING,
  PseoErrorType.BYOK_VALIDATION_FAILED,
  PseoErrorType.PAYMENT_FAILED,
  PseoErrorType.CAMPAIGN_LIMIT_REACHED,
  PseoErrorType.PERMISSION_DENIED,
  PseoErrorType.CONCURRENT_LIMIT_EXCEEDED,
]);

export function createPseoError(
  type: PseoErrorType,
  message: string,
  meta: PseoErrorMeta = {}
): PseoErrorResponse {
  return {
    error: true,
    type,
    message,
    meta: {
      ...meta,
      retryable: meta.retryable ?? RETRYABLE_ERRORS.has(type),
    },
    timestamp: new Date().toISOString(),
    httpStatus: ERROR_HTTP_STATUS[type],
  };
}

export interface PageErrorContext {
  pageId: string;
  campaignId: string;
  workspaceId: string;
  slug: string;
  locationId?: string;
  serviceId?: string;
}

export interface PageErrorResult {
  handled: true;
  errorType: PseoErrorType;
  action: "route-to-review" | "log-only";
  qualityGateStatus: QualityGateStatus;
  failReasons: string[];
  auditLogEntry: AuditLogEntry;
}

export interface AuditLogEntry {
  timestamp: string;
  level: "error" | "warn" | "info";
  errorType: PseoErrorType;
  message: string;
  campaignId: string;
  workspaceId: string;
  pageId: string | null;
  meta: PseoErrorMeta;
}

const ROUTE_TO_REVIEW_ERRORS = new Set<PseoErrorType>([
  PseoErrorType.AI_GENERATION_FAILED,
  PseoErrorType.AI_TIMEOUT,
  PseoErrorType.QUALITY_GATE_FAILED,
  PseoErrorType.SIMILARITY_THRESHOLD_EXCEEDED,
  PseoErrorType.TEMPLATE_PARSE_FAILED,
]);

export function handlePageError(
  errorType: PseoErrorType,
  message: string,
  context: PageErrorContext,
  originalError?: Error
): PageErrorResult {
  const action: PageErrorResult["action"] = ROUTE_TO_REVIEW_ERRORS.has(errorType)
    ? "route-to-review"
    : "log-only";

  const qualityGateStatus: QualityGateStatus = action === "route-to-review" ? "fail" : "pending";

  const failReasons: string[] = action === "route-to-review"
    ? [`[${errorType}] ${message}`]
    : [];

  const auditLogEntry = buildAuditLogEntry(
    "error",
    errorType,
    message,
    context.campaignId,
    context.workspaceId,
    context.pageId,
    {
      locationId: context.locationId,
      serviceId: context.serviceId,
      originalError: originalError?.message,
    }
  );

  console.error(
    `[pSEO] Page error [${errorType}] campaign=${context.campaignId} page=${context.pageId}: ${message}`
  );

  return {
    handled: true,
    errorType,
    action,
    qualityGateStatus,
    failReasons,
    auditLogEntry,
  };
}

export interface CampaignErrorContext {
  campaignId: string;
  workspaceId: string;
  currentState: CampaignState;
  jobId?: string;
  jobType?: JobType;
}

export interface CampaignErrorResult {
  handled: true;
  errorType: PseoErrorType;
  action: "pause-campaign" | "continue" | "abort-job";
  shouldTransitionTo: CampaignState | null;
  auditLogEntry: AuditLogEntry;
}

export function handleCampaignError(
  errorType: PseoErrorType,
  message: string,
  context: CampaignErrorContext,
  originalError?: Error
): CampaignErrorResult {
  const shouldPause = CAMPAIGN_PAUSE_ERRORS.has(errorType);

  let action: CampaignErrorResult["action"];
  let shouldTransitionTo: CampaignState | null = null;

  if (shouldPause) {
    action = "pause-campaign";
    shouldTransitionTo = "paused";
  } else if (
    errorType === PseoErrorType.DATABASE_WRITE_FAILED ||
    errorType === PseoErrorType.DATABASE_READ_FAILED
  ) {
    action = "abort-job";
    shouldTransitionTo = context.currentState === "generating" ? "draft" : "reviewing";
  } else {
    action = "continue";
  }

  const auditLogEntry = buildAuditLogEntry(
    shouldPause ? "error" : "warn",
    errorType,
    message,
    context.campaignId,
    context.workspaceId,
    null,
    {
      jobId: context.jobId,
      jobType: context.jobType,
      fromState: context.currentState,
      toState: shouldTransitionTo ?? undefined,
      originalError: originalError?.message,
    }
  );

  const logLevel = shouldPause ? "error" : "warn";
  console[logLevel](
    `[pSEO] Campaign ${shouldPause ? "PAUSE" : "continue"} [${errorType}] campaign=${context.campaignId}: ${message}`
  );

  return {
    handled: true,
    errorType,
    action,
    shouldTransitionTo,
    auditLogEntry,
  };
}

function buildAuditLogEntry(
  level: AuditLogEntry["level"],
  errorType: PseoErrorType,
  message: string,
  campaignId: string,
  workspaceId: string,
  pageId: string | null,
  meta: PseoErrorMeta
): AuditLogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    errorType,
    message,
    campaignId,
    workspaceId,
    pageId,
    meta,
  };
}

export function isRetryable(errorType: PseoErrorType): boolean {
  return RETRYABLE_ERRORS.has(errorType);
}

export function shouldPauseCampaign(errorType: PseoErrorType): boolean {
  return CAMPAIGN_PAUSE_ERRORS.has(errorType);
}

export class PseoError extends Error {
  public readonly type: PseoErrorType;
  public readonly meta: PseoErrorMeta;
  public readonly httpStatus: number;
  public readonly retryable: boolean;

  constructor(type: PseoErrorType, message: string, meta: PseoErrorMeta = {}) {
    super(message);
    this.name = "PseoError";
    this.type = type;
    this.meta = meta;
    this.httpStatus = ERROR_HTTP_STATUS[type];
    this.retryable = RETRYABLE_ERRORS.has(type);
  }

  toResponse(): PseoErrorResponse {
    return createPseoError(this.type, this.message, this.meta);
  }
}
