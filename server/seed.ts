import { db } from "./db";
import { workspaces, workspaceBlogPosts, workspaceDomains, rankTrackerKeywords, gridKeywords, gridScanResults, contentCampaigns, seoSettings, contactMessages, users } from "@shared/schema";
import { sql, eq, ne } from "drizzle-orm";

export async function seedDatabase() {
  const existingUser = await db.select().from(users).where(eq(users.id, "system"));
  if (existingUser.length === 0) {
    await db.insert(users).values({
      id: "system",
      email: "system@indexflow.cloud",
      firstName: "System",
      lastName: "Admin",
    });
  }

  await cleanupNonIndexFlowWorkspaces();
  await ensureIndexFlowWorkspace();
  console.log("Database seeded successfully");
}

async function cleanupNonIndexFlowWorkspaces() {
  const others = await db.select({ id: workspaces.id }).from(workspaces).where(ne(workspaces.id, "indexflow"));
  if (others.length === 0) return;
  const ids = others.map(w => w.id);
  for (const id of ids) {
    await db.delete(workspaceBlogPosts).where(eq(workspaceBlogPosts.workspaceId, id));
    await db.delete(workspaceDomains).where(eq(workspaceDomains.workspaceId, id));
    await db.delete(rankTrackerKeywords).where(eq(rankTrackerKeywords.workspaceId, id));
    await db.delete(gridKeywords).where(eq(gridKeywords.workspaceId, id));
    await db.delete(contentCampaigns).where(eq(contentCampaigns.workspaceId, id));
    await db.delete(seoSettings).where(eq(seoSettings.workspaceId, id));
    await db.delete(workspaces).where(eq(workspaces.id, id));
  }
  console.log(`Cleaned up ${ids.length} non-indexflow workspaces`);
}

async function ensureIndexFlowWorkspace() {
  const existing = await db.select().from(workspaces).where(eq(workspaces.id, "indexflow"));
  if (existing.length > 0) return;

  await db.insert(workspaces).values({
    id: "indexflow",
    ownerId: "system",
    name: "indexflow",
    type: "agency",
    status: "active",
    website: "https://indexflow.cloud",
    plan: "enterprise",
  });

  await db.insert(workspaceDomains).values({
    workspaceId: "indexflow",
    domain: "blog.indexflow.cloud",
    isPrimary: true,
    blogTemplate: "editorial",
    accentColor: "#0ea5e9",
    accentForeground: "#ffffff",
  });

  await db.insert(workspaceBlogPosts).values([
    { workspaceId: "indexflow", title: "How indexFlow Replaces 5 SEO Tools", slug: "indexflow-replaces-5-seo-tools", primaryKeyword: "seo tool consolidation", category: "industry-guides", status: "published", generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-02-10") },
    { workspaceId: "indexflow", title: "White Label SEO Platform - Complete Guide", slug: "white-label-seo-platform-guide", primaryKeyword: "white label seo platform", category: "industry-guides", status: "published", generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-02-15") },
    { workspaceId: "indexflow", title: "Agency Content Workflow Automation", slug: "agency-content-workflow-automation", primaryKeyword: "content workflow automation", category: "industry-guides", status: "draft", generationStatus: "generated", qualityGateStatus: "pass" },
  ]);

  await db.insert(rankTrackerKeywords).values([
    { workspaceId: "indexflow", keyword: "white label seo platform" },
    { workspaceId: "indexflow", keyword: "seo content management" },
    { workspaceId: "indexflow", keyword: "agency seo tools" },
  ]);

  await db.insert(contactMessages).values([
    { name: "Demo User", email: "demo@indexflow.cloud", inquiryType: "demo", message: "Testing the indexFlow platform." },
  ]);

  console.log("indexflow workspace seeded");
}
