import { describe, it, expect } from "vitest";
import {
  CAMPAIGN_STATES,
  CampaignState,
  canTransition,
  getTransition,
  getAvailableTransitions,
  assertTransition,
  isTerminalState,
  isActiveState,
  isBackgroundJobState,
  getBackgroundJob,
  BACKGROUND_JOBS,
} from "../../server/pseo/campaign-state-machine";

describe("Campaign State Machine", () => {
  describe("valid transitions", () => {
    const validPairs: [CampaignState, CampaignState, string][] = [
      ["draft", "generating", "Start Generation"],
      ["generating", "reviewing", "Generation Complete"],
      ["generating", "draft", "Cancel Generation"],
      ["generating", "paused", "Pause Generation"],
      ["reviewing", "publishing", "Approve & Publish"],
      ["reviewing", "draft", "Send Back to Draft"],
      ["reviewing", "generating", "Regenerate"],
      ["publishing", "live", "Publishing Complete"],
      ["publishing", "reviewing", "Publishing Failed"],
      ["publishing", "paused", "Pause Publishing"],
      ["live", "monitoring", "Enable Monitoring"],
      ["live", "paused", "Pause Campaign"],
      ["live", "archived", "Archive Campaign"],
      ["monitoring", "live", "Disable Monitoring"],
      ["monitoring", "paused", "Pause Campaign"],
      ["monitoring", "archived", "Archive Campaign"],
      ["paused", "draft", "Back to Draft"],
      ["paused", "generating", "Resume Generation"],
      ["paused", "live", "Resume Live"],
      ["paused", "archived", "Archive Campaign"],
      ["archived", "draft", "Unarchive to Draft"],
    ];

    it.each(validPairs)("%s → %s is allowed (%s)", (from, to, label) => {
      expect(canTransition(from, to)).toBe(true);
      const meta = getTransition(from, to);
      expect(meta).not.toBeNull();
      expect(meta!.label).toBe(label);
    });
  });

  describe("blocked transitions", () => {
    const blockedPairs: [CampaignState, CampaignState][] = [
      ["draft", "reviewing"],
      ["draft", "publishing"],
      ["draft", "live"],
      ["draft", "monitoring"],
      ["draft", "paused"],
      ["draft", "archived"],
      ["draft", "draft"],
      ["generating", "publishing"],
      ["generating", "live"],
      ["generating", "monitoring"],
      ["generating", "archived"],
      ["generating", "generating"],
      ["reviewing", "live"],
      ["reviewing", "monitoring"],
      ["reviewing", "paused"],
      ["reviewing", "archived"],
      ["reviewing", "reviewing"],
      ["publishing", "draft"],
      ["publishing", "generating"],
      ["publishing", "monitoring"],
      ["publishing", "archived"],
      ["publishing", "publishing"],
      ["live", "draft"],
      ["live", "generating"],
      ["live", "reviewing"],
      ["live", "publishing"],
      ["live", "live"],
      ["monitoring", "draft"],
      ["monitoring", "generating"],
      ["monitoring", "reviewing"],
      ["monitoring", "publishing"],
      ["monitoring", "monitoring"],
      ["paused", "reviewing"],
      ["paused", "publishing"],
      ["paused", "monitoring"],
      ["paused", "paused"],
      ["archived", "generating"],
      ["archived", "reviewing"],
      ["archived", "publishing"],
      ["archived", "live"],
      ["archived", "monitoring"],
      ["archived", "paused"],
      ["archived", "archived"],
    ];

    it.each(blockedPairs)("%s → %s is blocked", (from, to) => {
      expect(canTransition(from, to)).toBe(false);
      expect(getTransition(from, to)).toBeNull();
    });
  });

  describe("assertTransition", () => {
    it("returns meta for valid transitions", () => {
      const meta = assertTransition("draft", "generating");
      expect(meta.label).toBe("Start Generation");
      expect(meta.requiresConfirmation).toBe(true);
    });

    it("throws for blocked transitions", () => {
      expect(() => assertTransition("draft", "live")).toThrow(
        "Invalid campaign transition: draft → live"
      );
    });
  });

  describe("getAvailableTransitions", () => {
    it("draft has 1 transition", () => {
      const available = getAvailableTransitions("draft");
      expect(available).toHaveLength(1);
      expect(available[0].to).toBe("generating");
    });

    it("generating has 3 transitions", () => {
      const available = getAvailableTransitions("generating");
      expect(available).toHaveLength(3);
      const targets = available.map((t) => t.to).sort();
      expect(targets).toEqual(["draft", "paused", "reviewing"]);
    });

    it("paused has 4 transitions", () => {
      const available = getAvailableTransitions("paused");
      expect(available).toHaveLength(4);
      const targets = available.map((t) => t.to).sort();
      expect(targets).toEqual(["archived", "draft", "generating", "live"]);
    });

    it("archived has 1 transition", () => {
      const available = getAvailableTransitions("archived");
      expect(available).toHaveLength(1);
      expect(available[0].to).toBe("draft");
    });
  });

  describe("state classification helpers", () => {
    it("archived is terminal", () => {
      expect(isTerminalState("archived")).toBe(true);
    });

    it("non-archived states are not terminal", () => {
      for (const s of CAMPAIGN_STATES) {
        if (s !== "archived") expect(isTerminalState(s)).toBe(false);
      }
    });

    it("live and monitoring are active", () => {
      expect(isActiveState("live")).toBe(true);
      expect(isActiveState("monitoring")).toBe(true);
    });

    it("non-active states", () => {
      for (const s of CAMPAIGN_STATES) {
        if (s !== "live" && s !== "monitoring") expect(isActiveState(s)).toBe(false);
      }
    });

    it("generating, publishing, monitoring are background job states", () => {
      expect(isBackgroundJobState("generating")).toBe(true);
      expect(isBackgroundJobState("publishing")).toBe(true);
      expect(isBackgroundJobState("monitoring")).toBe(true);
    });

    it("non-background-job states", () => {
      for (const s of CAMPAIGN_STATES) {
        if (!["generating", "publishing", "monitoring"].includes(s)) {
          expect(isBackgroundJobState(s)).toBe(false);
        }
      }
    });
  });

  describe("background jobs", () => {
    it("generating has page-generation job", () => {
      const job = getBackgroundJob("generating");
      expect(job).not.toBeNull();
      expect(job!.jobType).toBe("page-generation");
      expect(job!.autoTransitionTo).toBe("reviewing");
      expect(job!.failTransitionTo).toBe("draft");
    });

    it("publishing has page-publish job", () => {
      const job = getBackgroundJob("publishing");
      expect(job).not.toBeNull();
      expect(job!.jobType).toBe("page-publish");
      expect(job!.autoTransitionTo).toBe("live");
      expect(job!.failTransitionTo).toBe("reviewing");
    });

    it("monitoring has rank-check job", () => {
      const job = getBackgroundJob("monitoring");
      expect(job).not.toBeNull();
      expect(job!.jobType).toBe("rank-check");
      expect(job!.autoTransitionTo).toBeNull();
      expect(job!.failTransitionTo).toBeNull();
    });

    it("draft has no background job", () => {
      expect(getBackgroundJob("draft")).toBeNull();
    });

    it("all 3 background jobs are defined", () => {
      expect(BACKGROUND_JOBS).toHaveLength(3);
    });
  });

  describe("confirmation requirements", () => {
    const requiresConfirmation: [CampaignState, CampaignState][] = [
      ["draft", "generating"],
      ["generating", "draft"],
      ["generating", "paused"],
      ["reviewing", "publishing"],
      ["reviewing", "draft"],
      ["reviewing", "generating"],
      ["publishing", "paused"],
      ["live", "paused"],
      ["live", "archived"],
      ["monitoring", "paused"],
      ["monitoring", "archived"],
      ["paused", "generating"],
      ["paused", "live"],
      ["archived", "draft"],
    ];

    it.each(requiresConfirmation)("%s → %s requires confirmation", (from, to) => {
      const meta = getTransition(from, to);
      expect(meta!.requiresConfirmation).toBe(true);
    });

    const noConfirmation: [CampaignState, CampaignState][] = [
      ["generating", "reviewing"],
      ["publishing", "live"],
      ["publishing", "reviewing"],
      ["live", "monitoring"],
      ["monitoring", "live"],
      ["paused", "draft"],
      ["paused", "archived"],
    ];

    it.each(noConfirmation)("%s → %s does not require confirmation", (from, to) => {
      const meta = getTransition(from, to);
      expect(meta!.requiresConfirmation).toBe(false);
    });
  });

  describe("CAMPAIGN_STATES constant", () => {
    it("has exactly 8 states", () => {
      expect(CAMPAIGN_STATES).toHaveLength(8);
    });

    it("includes all expected states", () => {
      expect(CAMPAIGN_STATES).toEqual([
        "draft", "generating", "reviewing", "publishing",
        "live", "monitoring", "paused", "archived",
      ]);
    });
  });
});
