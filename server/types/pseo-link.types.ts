export interface InternalLinkSuggestion {
  sourcePageId: string;
  targetPageId: string;
  targetSlug: string;
  anchorText: string;
  relevanceScore: number;
  reason: InternalLinkReason;
}

export type InternalLinkReason =
  | "same-service"
  | "same-location"
  | "neighbour-location"
  | "same-zone"
  | "parent-child"
  | "keyword-overlap";

export interface InternalLinkGraph {
  nodes: InternalLinkNode[];
  edges: InternalLinkEdge[];
}

export interface InternalLinkNode {
  pageId: string;
  slug: string;
  title: string;
  inboundCount: number;
  outboundCount: number;
}

export interface InternalLinkEdge {
  source: string;
  target: string;
  anchor: string;
}

export interface InternalLinkAuditResult {
  totalPages: number;
  totalLinks: number;
  orphanPages: string[];
  overlinkedPages: Array<{ pageId: string; outboundCount: number }>;
  avgLinksPerPage: number;
  maxLinksPerPage: number;
}

export interface SiloStructure {
  campaignId: string;
  silos: Silo[];
}

export interface Silo {
  name: string;
  type: "service" | "location" | "zone";
  hubPageId: string | null;
  spokePageIds: string[];
  crossLinks: Array<{ from: string; to: string }>;
}

export interface LinkBuildingConfig {
  maxLinksPerPage: number;
  preferSameService: boolean;
  preferNeighbourLocations: boolean;
  enableCrossServiceLinks: boolean;
  enableHubSpokeModel: boolean;
}
