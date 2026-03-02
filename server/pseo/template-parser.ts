import { db } from "../db";
import { pseoCampaigns } from "@shared/schema";
import { pseoTemplateZones } from "../../db/schema/pseo-template-zones";
import { pseoAuditLog } from "../../db/schema/pseo-audit-log";
import { eq, and, isNull } from "drizzle-orm";

export interface TemplateZoneDescriptor {
  zoneKey: string;
  label: string;
  elementType: string;
  cssSelector: string;
  contentSummary: string;
  confidenceScore: number;
  zoneType: "locked" | "dynamic";
  defaultContent: string;
}

export interface ParseResult {
  lockedZones: TemplateZoneDescriptor[];
  dynamicZones: TemplateZoneDescriptor[];
}

export interface BrandingInfo {
  primaryColour: string | null;
  fonts: string[];
  logoUrl: string | null;
}

export interface TemplateParseResult {
  lockedZones: TemplateZoneDescriptor[];
  dynamicZones: TemplateZoneDescriptor[];
  primaryColour: string | null;
  fonts: string[];
  logoUrl: string | null;
  hasMinimumDynamicZones: boolean;
  error?: string;
}

export interface DiffEntry {
  zoneKey: string;
  label: string;
  elementType: string;
  cssSelector: string;
  oldContent: string | null;
  newContent: string | null;
}

export interface TemplateDiff {
  unchanged: DiffEntry[];
  modified: DiffEntry[];
  added: DiffEntry[];
  removed: DiffEntry[];
  currentVersion: number;
  nextVersion: number;
}

const LOCKED_ELEMENTS = new Set(["nav", "header", "footer"]);

const LOCKED_SELECTORS = [
  /^nav\b/i,
  /^header\b/i,
  /^footer\b/i,
  /\.nav\b/i,
  /\.navbar\b/i,
  /\.header\b/i,
  /\.footer\b/i,
  /\.logo\b/i,
  /\.brand\b/i,
  /\.cta\b/i,
  /#nav\b/i,
  /#header\b/i,
  /#footer\b/i,
  /#logo\b/i,
];

const DYNAMIC_ELEMENTS = new Set(["h1", "h2", "h3", "main", "article", "section", "p"]);

const LOREM_PATTERNS = [
  /lorem\s+ipsum/i,
  /dolor\s+sit\s+amet/i,
  /consectetur\s+adipiscing/i,
  /placeholder\s+text/i,
  /\[insert\s+/i,
  /\{\{.*?\}\}/,
  /your\s+(text|content|title)\s+here/i,
  /sample\s+(text|content)/i,
];

const CONFIDENCE_THRESHOLD = 0.80;

function isLoremIpsum(text: string): boolean {
  return LOREM_PATTERNS.some((p) => p.test(text));
}

function isLockedSelector(selector: string): boolean {
  return LOCKED_SELECTORS.some((p) => p.test(selector));
}

function extractElements(html: string): Array<{
  tag: string;
  id: string;
  classes: string[];
  content: string;
  index: number;
}> {
  const elements: Array<{
    tag: string;
    id: string;
    classes: string[];
    content: string;
    index: number;
  }> = [];

  const tagRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const attrs = match[2] || "";
    const content = match[3] || "";

    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    const classMatch = attrs.match(/class=["']([^"']+)["']/);

    elements.push({
      tag,
      id: idMatch?.[1] || "",
      classes: classMatch?.[1]?.split(/\s+/) || [],
      content: content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      index: idx++,
    });
  }

  return elements;
}

function buildCssSelector(el: { tag: string; id: string; classes: string[] }): string {
  if (el.id) return `${el.tag}#${el.id}`;
  if (el.classes.length > 0) return `${el.tag}.${el.classes[0]}`;
  return el.tag;
}

function classifyElement(el: {
  tag: string;
  id: string;
  classes: string[];
  content: string;
}): { zoneType: "locked" | "dynamic"; confidence: number } {
  const selector = buildCssSelector(el);

  if (LOCKED_ELEMENTS.has(el.tag)) {
    return { zoneType: "locked", confidence: 0.95 };
  }

  if (isLockedSelector(selector)) {
    return { zoneType: "locked", confidence: 0.90 };
  }

  for (const cls of el.classes) {
    if (/\b(logo|brand|cta|call-to-action|branding)\b/i.test(cls)) {
      return { zoneType: "locked", confidence: 0.85 };
    }
  }

  if (DYNAMIC_ELEMENTS.has(el.tag)) {
    return { zoneType: "dynamic", confidence: 0.90 };
  }

  if (isLoremIpsum(el.content)) {
    return { zoneType: "dynamic", confidence: 0.95 };
  }

  if (el.tag === "div") {
    for (const cls of el.classes) {
      if (/\b(content|body|main|text|copy|article)\b/i.test(cls)) {
        return { zoneType: "dynamic", confidence: 0.80 };
      }
    }
  }

  return { zoneType: "dynamic", confidence: 0.60 };
}

function summarizeContent(content: string): string {
  const trimmed = content.slice(0, 120);
  return content.length > 120 ? trimmed + "…" : trimmed;
}

export function parseTemplate(html: string): ParseResult {
  const elements = extractElements(html);
  const lockedZones: TemplateZoneDescriptor[] = [];
  const dynamicZones: TemplateZoneDescriptor[] = [];
  const seenKeys = new Set<string>();

  for (const el of elements) {
    const { zoneType, confidence } = classifyElement(el);
    const selector = buildCssSelector(el);

    let zoneKey = el.id || el.classes[0] || `${el.tag}-${el.index}`;
    if (seenKeys.has(zoneKey)) {
      zoneKey = `${zoneKey}-${el.index}`;
    }
    seenKeys.add(zoneKey);

    const descriptor: TemplateZoneDescriptor = {
      zoneKey,
      label: `${el.tag.toUpperCase()}${el.id ? `#${el.id}` : el.classes[0] ? `.${el.classes[0]}` : ""}`,
      elementType: el.tag,
      cssSelector: selector,
      contentSummary: summarizeContent(el.content),
      confidenceScore: confidence,
      zoneType,
      defaultContent: el.content,
    };

    if (zoneType === "locked" && confidence >= CONFIDENCE_THRESHOLD) {
      lockedZones.push(descriptor);
    } else {
      dynamicZones.push(descriptor);
    }
  }

  return { lockedZones, dynamicZones };
}

export function extractBranding(html: string): BrandingInfo {
  const hexCounts: Record<string, number> = {};
  const hexRegex = /#([0-9a-fA-F]{3,8})\b/g;
  let hexMatch;
  while ((hexMatch = hexRegex.exec(html)) !== null) {
    const hex = hexMatch[0].toLowerCase();
    if (hex.length === 4 || hex.length === 7 || hex.length === 9) {
      hexCounts[hex] = (hexCounts[hex] || 0) + 1;
    }
  }

  let primaryColour: string | null = null;
  let maxCount = 0;
  for (const [hex, count] of Object.entries(hexCounts)) {
    if (count > maxCount && hex !== "#000" && hex !== "#000000" && hex !== "#fff" && hex !== "#ffffff") {
      primaryColour = hex;
      maxCount = count;
    }
  }

  const fonts: string[] = [];
  const fontRegex = /font-family\s*:\s*([^;}]+)/gi;
  let fontMatch;
  while ((fontMatch = fontRegex.exec(html)) !== null) {
    const families = fontMatch[1]
      .split(",")
      .map((f) => f.trim().replace(/["']/g, ""))
      .filter((f) => f.length > 0 && !["inherit", "initial", "unset"].includes(f.toLowerCase()));
    for (const family of families) {
      if (!fonts.includes(family)) {
        fonts.push(family);
      }
    }
  }

  let logoUrl: string | null = null;
  const headerMatch = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
  if (headerMatch) {
    const imgMatch = headerMatch[1].match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
    if (imgMatch) {
      logoUrl = imgMatch[1];
    }
  }

  return { primaryColour, fonts, logoUrl };
}

export function parseTemplateWithBranding(html: string): TemplateParseResult {
  const { lockedZones, dynamicZones } = parseTemplate(html);
  const branding = extractBranding(html);

  const hasMinimumDynamicZones = dynamicZones.length > 0;

  const result: TemplateParseResult = {
    lockedZones,
    dynamicZones,
    primaryColour: branding.primaryColour,
    fonts: branding.fonts,
    logoUrl: branding.logoUrl,
    hasMinimumDynamicZones,
  };

  if (!hasMinimumDynamicZones) {
    result.error = "Template must contain at least one dynamic zone (h1, h2, main, article, or section)";
  }

  return result;
}

export async function fetchTemplateHtml(
  url: string,
  fetchFn: (url: string) => Promise<Response> = fetch
): Promise<{ html: string | null; error?: string }> {
  try {
    const response = await fetchFn(url);
    if (!response.ok) {
      return { html: null, error: `HTTP ${response.status}: ${response.statusText}` };
    }
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain") && !contentType.includes("application/xhtml")) {
      return { html: null, error: `Unexpected content type: ${contentType}` };
    }
    const html = await response.text();
    return { html };
  } catch (err: any) {
    return { html: null, error: `Fetch failed: ${err.message}` };
  }
}

export async function parseTemplateFromSource(
  source: string,
  fetchFn?: (url: string) => Promise<Response>
): Promise<TemplateParseResult> {
  let html = source;

  if (source.startsWith("http://") || source.startsWith("https://")) {
    const fetched = await fetchTemplateHtml(source, fetchFn);
    if (!fetched.html) {
      return {
        lockedZones: [],
        dynamicZones: [],
        primaryColour: null,
        fonts: [],
        logoUrl: null,
        hasMinimumDynamicZones: false,
        error: fetched.error || "Failed to fetch template HTML",
      };
    }
    html = fetched.html;
  }

  return parseTemplateWithBranding(html);
}

export async function refreshTemplate(
  newHtml: string,
  campaignId: string
): Promise<TemplateDiff> {
  const [campaign] = await db
    .select({ templateVersion: pseoCampaigns.templateVersion })
    .from(pseoCampaigns)
    .where(eq(pseoCampaigns.id, campaignId));

  const currentVersion = campaign?.templateVersion ?? 1;

  const existingZones = await db
    .select()
    .from(pseoTemplateZones)
    .where(
      and(
        eq(pseoTemplateZones.campaignId, campaignId),
        eq(pseoTemplateZones.isLocked, true),
        isNull(pseoTemplateZones.deletedAt)
      )
    );

  const existingByKey = new Map<string, typeof existingZones[0]>();
  for (const zone of existingZones) {
    existingByKey.set(zone.zoneKey, zone);
  }

  const { lockedZones: newLockedZones } = parseTemplate(newHtml);

  const unchanged: DiffEntry[] = [];
  const modified: DiffEntry[] = [];
  const added: DiffEntry[] = [];
  const removed: DiffEntry[] = [];

  const newByKey = new Map<string, TemplateZoneDescriptor>();
  for (const zone of newLockedZones) {
    newByKey.set(zone.zoneKey, zone);
  }

  for (const [key, existing] of existingByKey) {
    if (existing.manuallyOverridden) {
      unchanged.push({
        zoneKey: key,
        label: existing.label,
        elementType: existing.elementType || "",
        cssSelector: existing.cssSelector || "",
        oldContent: existing.defaultContent,
        newContent: existing.defaultContent,
      });
      continue;
    }

    const newZone = newByKey.get(key);
    if (!newZone) {
      removed.push({
        zoneKey: key,
        label: existing.label,
        elementType: existing.elementType || "",
        cssSelector: existing.cssSelector || "",
        oldContent: existing.defaultContent,
        newContent: null,
      });
    } else if (newZone.defaultContent !== existing.defaultContent) {
      modified.push({
        zoneKey: key,
        label: existing.label,
        elementType: newZone.elementType,
        cssSelector: newZone.cssSelector,
        oldContent: existing.defaultContent,
        newContent: newZone.defaultContent,
      });
    } else {
      unchanged.push({
        zoneKey: key,
        label: existing.label,
        elementType: existing.elementType || "",
        cssSelector: existing.cssSelector || "",
        oldContent: existing.defaultContent,
        newContent: existing.defaultContent,
      });
    }
  }

  for (const [key, zone] of newByKey) {
    if (!existingByKey.has(key)) {
      added.push({
        zoneKey: key,
        label: zone.label,
        elementType: zone.elementType,
        cssSelector: zone.cssSelector,
        oldContent: null,
        newContent: zone.defaultContent,
      });
    }
  }

  return {
    unchanged,
    modified,
    added,
    removed,
    currentVersion,
    nextVersion: currentVersion + 1,
  };
}

export async function confirmRefresh(
  campaignId: string,
  diff: TemplateDiff,
  workspaceId: string,
  triggeredBy?: string
): Promise<void> {
  const previousZones = await db
    .select()
    .from(pseoTemplateZones)
    .where(
      and(
        eq(pseoTemplateZones.campaignId, campaignId),
        eq(pseoTemplateZones.isLocked, true),
        isNull(pseoTemplateZones.deletedAt)
      )
    );

  const previousSnapshot = previousZones.map((z) => ({
    zoneKey: z.zoneKey,
    label: z.label,
    content: z.defaultContent,
    manuallyOverridden: z.manuallyOverridden,
  }));

  for (const entry of diff.removed) {
    const existing = previousZones.find((z) => z.zoneKey === entry.zoneKey);
    if (existing && !existing.manuallyOverridden) {
      await db
        .update(pseoTemplateZones)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(pseoTemplateZones.id, existing.id));
    }
  }

  for (const entry of diff.modified) {
    const existing = previousZones.find((z) => z.zoneKey === entry.zoneKey);
    if (existing && !existing.manuallyOverridden) {
      await db
        .update(pseoTemplateZones)
        .set({
          defaultContent: entry.newContent,
          elementType: entry.elementType,
          cssSelector: entry.cssSelector,
          contentSummary: entry.newContent ? entry.newContent.slice(0, 120) : null,
          version: diff.nextVersion,
          updatedAt: new Date(),
        })
        .where(eq(pseoTemplateZones.id, existing.id));
    }
  }

  for (const entry of diff.added) {
    await db.insert(pseoTemplateZones).values({
      campaignId,
      venueId: workspaceId,
      zoneKey: entry.zoneKey,
      label: entry.label,
      zoneType: "text",
      elementType: entry.elementType,
      cssSelector: entry.cssSelector,
      contentSummary: entry.newContent ? entry.newContent.slice(0, 120) : null,
      defaultContent: entry.newContent,
      isLocked: true,
      version: diff.nextVersion,
    });
  }

  await db
    .update(pseoCampaigns)
    .set({
      templateVersion: diff.nextVersion,
      updatedAt: new Date(),
    })
    .where(eq(pseoCampaigns.id, campaignId));

  const newSnapshot = [
    ...diff.unchanged.map((e) => ({ zoneKey: e.zoneKey, label: e.label, content: e.newContent })),
    ...diff.modified.map((e) => ({ zoneKey: e.zoneKey, label: e.label, content: e.newContent })),
    ...diff.added.map((e) => ({ zoneKey: e.zoneKey, label: e.label, content: e.newContent })),
  ];

  try {
    await db.insert(pseoAuditLog).values({
      campaignId,
      venueId: workspaceId,
      action: "template-refresh-confirmed",
      message: `Template refreshed from v${diff.currentVersion} to v${diff.nextVersion}. ${diff.modified.length} modified, ${diff.added.length} added, ${diff.removed.length} removed, ${diff.unchanged.length} unchanged.`,
      level: "info",
      triggeredBy: triggeredBy || null,
      previousState: JSON.stringify({ version: diff.currentVersion, zones: previousSnapshot }),
      newState: JSON.stringify({ version: diff.nextVersion, zones: newSnapshot }),
      meta: {
        modifiedCount: diff.modified.length,
        addedCount: diff.added.length,
        removedCount: diff.removed.length,
        unchangedCount: diff.unchanged.length,
      },
    });
  } catch (err: any) {
    console.error("[pSEO Template] Failed to write audit log:", err.message);
  }
}
