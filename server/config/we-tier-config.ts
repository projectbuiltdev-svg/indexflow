export interface TierConfig {
  maxWorkspaces: number;
  maxDomains: number;
  canExport: boolean;
  canWhiteLabel: boolean;
  canCollaborate: boolean;
  maxUsers: number;
  trialDays: number;
  trialPrice: number;
}

export const TIER_CONFIG: Record<string, TierConfig> = {
  solo: {
    maxWorkspaces: 1,
    maxDomains: 1,
    canExport: false,
    canWhiteLabel: false,
    canCollaborate: false,
    maxUsers: 1,
    trialDays: 14,
    trialPrice: 1,
  },
  pro: {
    maxWorkspaces: 25,
    maxDomains: 25,
    canExport: true,
    canWhiteLabel: true,
    canCollaborate: true,
    maxUsers: 5,
    trialDays: 30,
    trialPrice: 0,
  },
  agency: {
    maxWorkspaces: 50,
    maxDomains: 50,
    canExport: true,
    canWhiteLabel: true,
    canCollaborate: true,
    maxUsers: 10,
    trialDays: 30,
    trialPrice: 0,
  },
  enterprise: {
    maxWorkspaces: -1,
    maxDomains: -1,
    canExport: true,
    canWhiteLabel: true,
    canCollaborate: true,
    maxUsers: 20,
    trialDays: 0,
    trialPrice: 0,
  },
};

export function getTierConfig(tier: string): TierConfig {
  return TIER_CONFIG[tier] ?? TIER_CONFIG.solo;
}

export function canDeploy(tier: string, isOnTrial: boolean): boolean {
  if (isOnTrial) return false;
  return true;
}
