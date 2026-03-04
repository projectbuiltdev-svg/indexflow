import { db } from "../db";
import { weProjects } from "../../db/schema/we-projects";
import { weDeployments } from "../../db/schema/we-deployments";
import { weDomains } from "../../db/schema/we-domains";
import { wePages } from "../../db/schema/we-pages";
import { weAuditLog } from "../../db/schema/we-audit-log";
import { eq, and, desc, isNull } from "drizzle-orm";
import { minifyHtml, minifyCss, minifyJs, inlineCriticalCss, generateSrcsets } from "./we-optimiser";
import { getTierConfig } from "../config/we-tier-config";

export interface DeployResult {
  url: string;
  deployedAt: string;
  deploymentId: number;
}

export interface PreviewData {
  currentUrl: string;
  previousUrl: string | null;
  hasChanges: boolean;
}

async function getProject(projectId: number, venueId: string) {
  const [p] = await db.select().from(weProjects).where(and(eq(weProjects.id, projectId), eq(weProjects.venueId, venueId)));
  return p;
}

async function buildDistHtml(projectId: number, venueId: string): Promise<string> {
  const pages = await db.select().from(wePages).where(and(eq(wePages.projectId, projectId), isNull(wePages.deletedAt)));
  const parts: string[] = [];

  for (const page of pages) {
    const state = page.grapejsState as any || {};
    const rawHtml = state.html || `<div>${page.name}</div>`;
    const rawCss = state.css || "";
    const rawJs = state.js || "";
    const meta = (page.seoMeta as any) || {};

    let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${meta.title || page.name}</title><meta name="description" content="${meta.description || ""}"><style>${rawCss}</style></head><body>${rawHtml}<script>${rawJs}</script></body></html>`;

    html = minifyHtml(html);
    html = inlineCriticalCss(html, minifyCss(rawCss));
    html = generateSrcsets(html);
    parts.push(html);
  }

  return parts.join("\n<!-- PAGE_BREAK -->\n");
}

export async function deployToTestUrl(projectId: number, venueId: string): Promise<DeployResult> {
  const project = await getProject(projectId, venueId);
  if (!project) throw new Error("Project not found");

  const snapshot = await buildDistHtml(projectId, venueId);
  const cookieBanner = await generateCookieBanner(projectId, venueId);
  const finalSnapshot = snapshot.replace("</body>", `${cookieBanner}</body>`);

  const url = `${venueId}.indexflow.cloud/${project.slug}`;
  const now = new Date();

  const [deployment] = await db.insert(weDeployments).values({
    projectId,
    venueId,
    domain: url,
    deploymentType: "test",
    htmlSnapshot: finalSnapshot,
    status: "success",
    deployedAt: now,
  }).returning();

  await db.insert(weAuditLog).values({
    venueId,
    projectId,
    action: "deployed_test",
    metadata: { url, deploymentId: deployment.id },
    severity: "info",
  });

  return { url: `https://${url}`, deployedAt: now.toISOString(), deploymentId: deployment.id };
}

export async function deployToStaging(projectId: number, venueId: string): Promise<DeployResult> {
  const project = await getProject(projectId, venueId);
  if (!project) throw new Error("Project not found");

  const snapshot = await buildDistHtml(projectId, venueId);
  const cookieBanner = await generateCookieBanner(projectId, venueId);
  const finalSnapshot = snapshot.replace("</body>", `${cookieBanner}</body>`);

  const url = `staging.${venueId}.indexflow.cloud/${project.slug}`;
  const now = new Date();

  const [deployment] = await db.insert(weDeployments).values({
    projectId,
    venueId,
    domain: url,
    deploymentType: "staging",
    htmlSnapshot: finalSnapshot,
    status: "success",
    deployedAt: now,
  }).returning();

  await db.insert(weAuditLog).values({
    venueId,
    projectId,
    action: "deployed_staging",
    metadata: { url, deploymentId: deployment.id },
    severity: "info",
  });

  return { url: `https://${url}`, deployedAt: now.toISOString(), deploymentId: deployment.id };
}

export async function deployToLive(
  projectId: number,
  venueId: string,
  domainId: number,
  stagingConfirmed: boolean
): Promise<DeployResult | { requiresPreviewConfirm: true; preview: PreviewData }> {
  const project = await getProject(projectId, venueId);
  if (!project) throw new Error("Project not found");

  const [domain] = await db.select().from(weDomains).where(and(eq(weDomains.id, domainId), eq(weDomains.venueId, venueId)));
  if (!domain) throw new Error("Domain not found");
  if (domain.verificationStatus !== "verified") throw new Error("Domain not verified");

  if (!stagingConfirmed) {
    const preview = await getStagingPreview(projectId, venueId);
    return { requiresPreviewConfirm: true, preview };
  }

  const snapshot = await buildDistHtml(projectId, venueId);
  const cookieBanner = await generateCookieBanner(projectId, venueId);
  const finalSnapshot = snapshot.replace("</body>", `${cookieBanner}</body>`);

  const now = new Date();

  const [deployment] = await db.insert(weDeployments).values({
    projectId,
    venueId,
    domain: domain.domain,
    deploymentType: "live",
    htmlSnapshot: finalSnapshot,
    status: "success",
    deployedAt: now,
  }).returning();

  await db.insert(weAuditLog).values({
    venueId,
    projectId,
    action: "deployed_live",
    metadata: { domain: domain.domain, deploymentId: deployment.id },
    severity: "info",
  });

  return { url: `https://${domain.domain}`, deployedAt: now.toISOString(), deploymentId: deployment.id };
}

export async function rollbackDeployment(deploymentId: number, venueId: string): Promise<DeployResult> {
  const [prev] = await db.select().from(weDeployments).where(and(eq(weDeployments.id, deploymentId), eq(weDeployments.venueId, venueId)));
  if (!prev) throw new Error("Deployment not found");
  if (!prev.htmlSnapshot) throw new Error("No snapshot to rollback to");

  const now = new Date();

  const [rollback] = await db.insert(weDeployments).values({
    projectId: prev.projectId,
    venueId,
    domain: prev.domain,
    deploymentType: prev.deploymentType,
    htmlSnapshot: prev.htmlSnapshot,
    status: "success",
    deployedAt: now,
  }).returning();

  await db.insert(weAuditLog).values({
    venueId,
    projectId: prev.projectId,
    action: "deployment_rolled_back",
    metadata: { originalId: deploymentId, rollbackId: rollback.id },
    severity: "warn",
  });

  return { url: `https://${prev.domain || "unknown"}`, deployedAt: now.toISOString(), deploymentId: rollback.id };
}

export async function getStagingPreview(projectId: number, venueId: string): Promise<PreviewData> {
  const deployments = await db.select().from(weDeployments)
    .where(and(eq(weDeployments.projectId, projectId), eq(weDeployments.venueId, venueId)))
    .orderBy(desc(weDeployments.deployedAt))
    .limit(2);

  const project = await getProject(projectId, venueId);
  const currentUrl = `https://staging.${venueId}.indexflow.cloud/${project?.slug || ""}`;

  if (deployments.length < 2) {
    return { currentUrl, previousUrl: null, hasChanges: true };
  }

  const hasChanges = deployments[0].htmlSnapshot !== deployments[1].htmlSnapshot;
  return {
    currentUrl,
    previousUrl: deployments[1].domain ? `https://${deployments[1].domain}` : null,
    hasChanges,
  };
}

export async function generateCookieBanner(projectId: number, venueId: string): Promise<string> {
  const project = await getProject(projectId, venueId);
  const lang = project?.projectLanguage || "en";
  const bs = (project?.buildState as any) || {};
  const colors = bs.designTokens?.colors || [];
  const primaryColor = colors[0] || "#0284c7";

  const labels: Record<string, Record<string, string>> = {
    en: { title: "Cookie Consent", necessary: "Necessary", analytics: "Analytics", marketing: "Marketing", accept: "Accept All", reject: "Reject All", save: "Save Preferences" },
    es: { title: "Consentimiento de Cookies", necessary: "Necesarias", analytics: "Analíticas", marketing: "Marketing", accept: "Aceptar Todo", reject: "Rechazar Todo", save: "Guardar" },
    de: { title: "Cookie-Einstellungen", necessary: "Notwendig", analytics: "Analytik", marketing: "Marketing", accept: "Alle akzeptieren", reject: "Alle ablehnen", save: "Speichern" },
    fr: { title: "Consentement aux Cookies", necessary: "Nécessaires", analytics: "Analytiques", marketing: "Marketing", accept: "Tout accepter", reject: "Tout refuser", save: "Enregistrer" },
  };
  const l = labels[lang] || labels.en;

  return `<div id="we-cookie-banner" style="position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #e5e7eb;padding:16px 24px;z-index:9999;font-family:system-ui,sans-serif;font-size:14px;display:flex;align-items:center;justify-content:space-between;gap:16px;box-shadow:0 -2px 8px rgba(0,0,0,.08)"><div style="flex:1"><strong>${l.title}</strong><div style="margin-top:8px;display:flex;gap:12px"><label><input type="checkbox" checked disabled> ${l.necessary}</label><label><input type="checkbox" id="we-ck-analytics"> ${l.analytics}</label><label><input type="checkbox" id="we-ck-marketing"> ${l.marketing}</label></div></div><div style="display:flex;gap:8px"><button onclick="document.getElementById('we-cookie-banner').remove()" style="padding:8px 16px;border:1px solid #d1d5db;border-radius:6px;background:#fff;cursor:pointer">${l.reject}</button><button onclick="document.getElementById('we-cookie-banner').remove()" style="padding:8px 16px;border:none;border-radius:6px;background:${primaryColor};color:#fff;cursor:pointer">${l.accept}</button></div></div>`;
}

export async function getDeploymentHistory(projectId: number, venueId: string) {
  const deployments = await db.select().from(weDeployments)
    .where(and(eq(weDeployments.projectId, projectId), eq(weDeployments.venueId, venueId)))
    .orderBy(desc(weDeployments.deployedAt));

  return { deployments, total: deployments.length };
}
