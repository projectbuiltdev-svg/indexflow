import { getBlock } from "../config/we-block-library";

export type DiffAction = "update" | "add" | "remove" | "reorder";

export interface DiffChange {
  blockId: string;
  action: DiffAction;
  data?: Record<string, any>;
  position?: number;
}

export interface Diff {
  changes: DiffChange[];
  pageLevel?: {
    title?: string | null;
    slug?: string | null;
  };
}

export interface DiffResult {
  valid: boolean;
  diff: Diff | null;
  errors: string[];
}

export interface ApplyResult {
  success: boolean;
  newState: Record<string, any>;
  failedChange: DiffChange | null;
}

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
}

const VALID_ACTIONS = new Set<string>(["update", "add", "remove", "reorder"]);

export function parseDiff(aiResponse: string): DiffResult {
  const errors: string[] = [];

  let cleaned = aiResponse.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { valid: false, diff: null, errors: ["Invalid JSON"] };
  }

  if (!parsed || typeof parsed !== "object") {
    return { valid: false, diff: null, errors: ["Response is not an object"] };
  }

  if (!Array.isArray(parsed.changes)) {
    return { valid: false, diff: null, errors: ["Missing or invalid 'changes' array"] };
  }

  for (let i = 0; i < parsed.changes.length; i++) {
    const c = parsed.changes[i];
    if (!c.blockId || typeof c.blockId !== "string") {
      errors.push(`Change ${i}: missing or invalid blockId`);
      continue;
    }
    if (!VALID_ACTIONS.has(c.action)) {
      errors.push(`Change ${i}: invalid action '${c.action}'`);
      continue;
    }
    if (c.action !== "remove" && c.action !== "reorder") {
      if (!getBlock(c.blockId)) {
        errors.push(`Change ${i}: unknown blockId '${c.blockId}'`);
      }
    }
    if (c.action === "add" && !getBlock(c.blockId)) {
      errors.push(`Change ${i}: unknown blockId '${c.blockId}' for add`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, diff: null, errors };
  }

  const diff: Diff = {
    changes: parsed.changes,
    pageLevel: parsed.pageLevel || undefined,
  };

  return { valid: true, diff, errors: [] };
}

export function validateDiff(diff: Diff, currentState: Record<string, any>): ValidationResult {
  const warnings: string[] = [];
  const blocks: any[] = currentState.components || currentState.blocks || [];
  const blockIds = new Set(blocks.map((b: any) => b.blockId || b.id || b.type));

  for (const change of diff.changes) {
    if (change.action !== "add" && !blockIds.has(change.blockId)) {
      warnings.push(`blockId '${change.blockId}' not found in current state`);
    }
    if ((change.action === "add" || change.action === "reorder") && change.position !== undefined) {
      if (change.position < 0 || change.position > blocks.length) {
        warnings.push(`position ${change.position} out of bounds (0-${blocks.length})`);
      }
    }
  }

  return { valid: warnings.length === 0, warnings };
}

export function applyDiff(currentGrapejsState: Record<string, any>, diff: Diff): ApplyResult {
  const newState = JSON.parse(JSON.stringify(currentGrapejsState));
  const key = Array.isArray(newState.components) ? "components" : "blocks";
  if (!Array.isArray(newState[key])) newState[key] = [];

  for (const change of diff.changes) {
    try {
      const blocks: any[] = newState[key];
      const idx = blocks.findIndex((b: any) => (b.blockId || b.id || b.type) === change.blockId);

      switch (change.action) {
        case "update": {
          if (idx === -1) return { success: false, newState: currentGrapejsState, failedChange: change };
          blocks[idx] = { ...blocks[idx], ...change.data };
          break;
        }
        case "add": {
          const pos = change.position !== undefined ? change.position : blocks.length;
          blocks.splice(pos, 0, { blockId: change.blockId, ...change.data });
          break;
        }
        case "remove": {
          if (idx === -1) return { success: false, newState: currentGrapejsState, failedChange: change };
          blocks.splice(idx, 1);
          break;
        }
        case "reorder": {
          if (idx === -1) return { success: false, newState: currentGrapejsState, failedChange: change };
          const [item] = blocks.splice(idx, 1);
          const newPos = change.position !== undefined ? change.position : blocks.length;
          blocks.splice(newPos, 0, item);
          break;
        }
      }
    } catch {
      return { success: false, newState: currentGrapejsState, failedChange: change };
    }
  }

  if (diff.pageLevel) {
    if (diff.pageLevel.title !== undefined) newState.title = diff.pageLevel.title;
    if (diff.pageLevel.slug !== undefined) newState.slug = diff.pageLevel.slug;
  }

  return { success: true, newState, failedChange: null };
}
