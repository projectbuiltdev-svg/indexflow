export interface PseoTemplate {
  html: string;
  version: number;
  lockedZones: string[];
  editableZones: TemplateZone[];
}

export interface TemplateZone {
  id: string;
  label: string;
  type: TemplateZoneType;
  defaultContent: string;
  required: boolean;
}

export type TemplateZoneType = "text" | "html" | "image" | "cta" | "map" | "reviews" | "faq";

export interface TemplateVariable {
  name: string;
  source: TemplateVariableSource;
  fallback: string;
}

export type TemplateVariableSource =
  | "location.name"
  | "location.state"
  | "location.zone"
  | "location.country"
  | "location.landmarks"
  | "location.neighbours"
  | "service.name"
  | "service.category"
  | "service.description"
  | "campaign.name"
  | "workspace.name"
  | "page.title"
  | "page.h1"
  | "page.metaTitle"
  | "page.metaDescription"
  | "custom";

export interface TemplateRenderInput {
  template: PseoTemplate;
  variables: Record<string, string>;
  paragraphs: string[];
  schemaJson: Record<string, any> | null;
  internalLinks: Array<{ url: string; anchor: string }>;
}

export interface TemplateRenderOutput {
  html: string;
  usedVariables: string[];
  missingVariables: string[];
}

export interface TemplateValidationResult {
  valid: boolean;
  errors: TemplateValidationError[];
  warnings: string[];
  zoneCount: number;
  variableCount: number;
}

export interface TemplateValidationError {
  zone: string;
  message: string;
  line: number | null;
}

export interface TemplatePreviewRequest {
  html: string;
  lockedZones: string[];
  sampleLocationName: string;
  sampleServiceName: string;
}
