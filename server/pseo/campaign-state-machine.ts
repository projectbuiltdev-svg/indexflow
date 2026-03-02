export const CAMPAIGN_STATES = [
  "draft",
  "generating",
  "reviewing",
  "publishing",
  "live",
  "monitoring",
  "paused",
  "archived",
] as const;

export type CampaignState = (typeof CAMPAIGN_STATES)[number];

export interface TransitionMeta {
  from: CampaignState;
  to: CampaignState;
  label: string;
  requiresConfirmation: boolean;
}

const TRANSITIONS: TransitionMeta[] = [
  { from: "draft", to: "generating", label: "Start Generation", requiresConfirmation: true },
  { from: "generating", to: "reviewing", label: "Generation Complete", requiresConfirmation: false },
  { from: "generating", to: "draft", label: "Cancel Generation", requiresConfirmation: true },
  { from: "generating", to: "paused", label: "Pause Generation", requiresConfirmation: true },
  { from: "reviewing", to: "publishing", label: "Approve & Publish", requiresConfirmation: true },
  { from: "reviewing", to: "draft", label: "Send Back to Draft", requiresConfirmation: true },
  { from: "reviewing", to: "generating", label: "Regenerate", requiresConfirmation: true },
  { from: "publishing", to: "live", label: "Publishing Complete", requiresConfirmation: false },
  { from: "publishing", to: "reviewing", label: "Publishing Failed", requiresConfirmation: false },
  { from: "publishing", to: "paused", label: "Pause Publishing", requiresConfirmation: true },
  { from: "live", to: "monitoring", label: "Enable Monitoring", requiresConfirmation: false },
  { from: "live", to: "paused", label: "Pause Campaign", requiresConfirmation: true },
  { from: "live", to: "archived", label: "Archive Campaign", requiresConfirmation: true },
  { from: "monitoring", to: "live", label: "Disable Monitoring", requiresConfirmation: false },
  { from: "monitoring", to: "paused", label: "Pause Campaign", requiresConfirmation: true },
  { from: "monitoring", to: "archived", label: "Archive Campaign", requiresConfirmation: true },
  { from: "paused", to: "draft", label: "Back to Draft", requiresConfirmation: false },
  { from: "paused", to: "generating", label: "Resume Generation", requiresConfirmation: true },
  { from: "paused", to: "live", label: "Resume Live", requiresConfirmation: true },
  { from: "paused", to: "archived", label: "Archive Campaign", requiresConfirmation: false },
  { from: "archived", to: "draft", label: "Unarchive to Draft", requiresConfirmation: true },
];

const transitionMap = new Map<string, TransitionMeta>();
for (const t of TRANSITIONS) {
  transitionMap.set(`${t.from}->${t.to}`, t);
}

export function canTransition(from: CampaignState, to: CampaignState): boolean {
  return transitionMap.has(`${from}->${to}`);
}

export function getTransition(from: CampaignState, to: CampaignState): TransitionMeta | null {
  return transitionMap.get(`${from}->${to}`) ?? null;
}

export function getAvailableTransitions(from: CampaignState): TransitionMeta[] {
  return TRANSITIONS.filter((t) => t.from === from);
}

export function assertTransition(from: CampaignState, to: CampaignState): TransitionMeta {
  const meta = getTransition(from, to);
  if (!meta) {
    throw new Error(`Invalid campaign transition: ${from} → ${to}`);
  }
  return meta;
}

export function isTerminalState(state: CampaignState): boolean {
  return state === "archived";
}

export function isActiveState(state: CampaignState): boolean {
  return state === "live" || state === "monitoring";
}

export function isBackgroundJobState(state: CampaignState): boolean {
  return state === "generating" || state === "publishing" || state === "monitoring";
}

export type BackgroundJobBehaviour = {
  state: CampaignState;
  jobType: string;
  description: string;
  autoTransitionTo: CampaignState | null;
  failTransitionTo: CampaignState | null;
};

export const BACKGROUND_JOBS: BackgroundJobBehaviour[] = [
  {
    state: "generating",
    jobType: "page-generation",
    description: "AI generates landing pages for each location×service pair",
    autoTransitionTo: "reviewing",
    failTransitionTo: "draft",
  },
  {
    state: "publishing",
    jobType: "page-publish",
    description: "Pages pushed to CMS or deployed to target domains",
    autoTransitionTo: "live",
    failTransitionTo: "reviewing",
  },
  {
    state: "monitoring",
    jobType: "rank-check",
    description: "Periodic rank checks and performance monitoring for published pages",
    autoTransitionTo: null,
    failTransitionTo: null,
  },
];

export function getBackgroundJob(state: CampaignState): BackgroundJobBehaviour | null {
  return BACKGROUND_JOBS.find((j) => j.state === state) ?? null;
}
