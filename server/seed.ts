import { db } from "./db";
import { workspaces, workspaceBlogPosts, workspaceDomains, rankTrackerKeywords, gridKeywords, gridScanResults, contentCampaigns, seoSettings, contactMessages, users } from "@shared/schema";
import { sql, eq } from "drizzle-orm";

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

  await ensureIndexFlowWorkspace();

  const existing = await db.select().from(workspaces);
  if (existing.length > 1) return;

  const [v1, v2, v3, v4] = await db.insert(workspaces).values([
    {
      ownerId: "system",
      name: "Apex Digital Agency",
      type: "agency",
      status: "active",
      website: "https://apexdigital.io",
      city: "Austin",
      state: "TX",
      country: "US",
      timezone: "America/Chicago",
    },
    {
      ownerId: "system",
      name: "Jake Morrison SEO",
      type: "solo-founder",
      status: "active",
      website: "https://jakemorrisonseo.com",
      city: "Denver",
      state: "CO",
      country: "US",
      timezone: "America/Denver",
    },
    {
      ownerId: "system",
      name: "Greenfield Law Firm",
      type: "local-business",
      status: "active",
      website: "https://greenfieldlaw.com",
      city: "Miami",
      state: "FL",
      country: "US",
      timezone: "America/New_York",
    },
    {
      ownerId: "system",
      name: "Meridian Hotels Group",
      type: "enterprise",
      status: "active",
      website: "https://meridianhotels.com",
      city: "Portland",
      state: "OR",
      country: "US",
      timezone: "America/Los_Angeles",
    },
  ]).returning();

  await db.insert(workspaceDomains).values([
    { workspaceId: v1.id, domain: "blog.apexdigital.io", isPrimary: true, blogTemplate: "editorial", accentColor: "#2563eb", accentForeground: "#ffffff" },
    { workspaceId: v2.id, domain: "blog.jakemorrisonseo.com", isPrimary: true, blogTemplate: "minimal", accentColor: "#16a34a", accentForeground: "#ffffff" },
    { workspaceId: v3.id, domain: "blog.greenfieldlaw.com", isPrimary: true, blogTemplate: "classic", accentColor: "#7c3aed", accentForeground: "#ffffff" },
    { workspaceId: v4.id, domain: "blog.meridianhotels.com", isPrimary: true, blogTemplate: "magazine" },
  ]);

  const [campaign1] = await db.insert(contentCampaigns).values([
    { workspaceId: v1.id, name: "Q1 2026 Content Sprint", status: "completed", postsTotal: 4 },
  ]).returning();

  await db.insert(workspaceBlogPosts).values([
    { workspaceId: v1.id, title: "Best SEO Agency in Austin TX - Top Rated Digital Marketing", slug: "best-seo-agency-austin-tx", primaryKeyword: "best seo agency austin tx", category: "local-guides", status: "published", campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-01-15") },
    { workspaceId: v1.id, title: "How to Scale Your SEO Agency to 7 Figures", slug: "scale-seo-agency-7-figures", primaryKeyword: "scale seo agency", category: "industry-guides", status: "published", campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-01-20") },
    { workspaceId: v1.id, title: "White Label SEO Services - Complete Agency Guide", slug: "white-label-seo-services-guide", primaryKeyword: "white label seo services", category: "industry-guides", status: "published", campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-02-01") },
    { workspaceId: v1.id, title: "SEMrush vs Ahrefs vs indexFlow - Agency Comparison", slug: "semrush-vs-ahrefs-vs-indexflow", primaryKeyword: "seo tools comparison", category: "comparisons", status: "draft", campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass" },
    { workspaceId: v2.id, title: "How I Grew My Freelance SEO Business to $10k/mo", slug: "freelance-seo-business-10k", primaryKeyword: "freelance seo business", category: "industry-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-01-10") },
    { workspaceId: v2.id, title: "Solo SEO Consultant Tech Stack - Tools I Use Daily", slug: "solo-seo-consultant-tech-stack", primaryKeyword: "seo consultant tools", category: "industry-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-01-25") },
    { workspaceId: v2.id, title: "Finding Your First SEO Client as a Freelancer", slug: "first-seo-client-freelancer", primaryKeyword: "find seo clients", category: "industry-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-02-05") },
    { workspaceId: v3.id, title: "Personal Injury Lawyer Miami - Free Consultation", slug: "personal-injury-lawyer-miami", primaryKeyword: "personal injury lawyer miami", category: "local-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-01-05") },
    { workspaceId: v3.id, title: "Car Accident Attorney Miami - No Win No Fee", slug: "car-accident-attorney-miami", primaryKeyword: "car accident attorney miami", category: "industry-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-01-18") },
    { workspaceId: v3.id, title: "Slip and Fall Lawyer Miami Beach", slug: "slip-fall-lawyer-miami-beach", primaryKeyword: "slip and fall lawyer miami", category: "local-guides", status: "draft", generationStatus: "generated" },
    { workspaceId: v4.id, title: "Enterprise SEO Strategy for Multi-Location Brands", slug: "enterprise-seo-multi-location", primaryKeyword: "enterprise seo strategy", category: "industry-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-01-12") },
    { workspaceId: v4.id, title: "Hotel SEO - Complete Guide to Hospitality Search Marketing", slug: "hotel-seo-complete-guide", primaryKeyword: "hotel seo", category: "industry-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-02-08") },
  ]);

  await db.insert(rankTrackerKeywords).values([
    { workspaceId: v1.id, keyword: "best seo agency austin tx" },
    { workspaceId: v1.id, keyword: "digital marketing agency austin" },
    { workspaceId: v1.id, keyword: "white label seo services" },
    { workspaceId: v1.id, keyword: "seo agency near me" },
    { workspaceId: v2.id, keyword: "freelance seo consultant" },
    { workspaceId: v2.id, keyword: "seo consultant denver" },
    { workspaceId: v2.id, keyword: "affordable seo services" },
    { workspaceId: v3.id, keyword: "personal injury lawyer miami" },
    { workspaceId: v3.id, keyword: "car accident attorney miami" },
    { workspaceId: v3.id, keyword: "slip and fall lawyer miami" },
    { workspaceId: v4.id, keyword: "enterprise seo strategy" },
    { workspaceId: v4.id, keyword: "hotel seo services" },
  ]);

  await db.insert(gridKeywords).values([
    { workspaceId: v1.id, keyword: "seo agency near me", gridSize: 5, distance: "8.0" },
    { workspaceId: v1.id, keyword: "digital marketing austin", gridSize: 5, distance: "5.0" },
    { workspaceId: v2.id, keyword: "seo consultant near me", gridSize: 5, distance: "10.0" },
    { workspaceId: v3.id, keyword: "injury lawyer near me", gridSize: 5, distance: "8.0" },
    { workspaceId: v4.id, keyword: "hotel near me", gridSize: 5, distance: "6.0" },
  ]);

  await db.insert(contactMessages).values([
    { name: "Sarah Mitchell", email: "sarah.m@email.com", phone: "(512) 555-0142", company: "GrowthStack Agency", inquiryType: "demo", message: "Interested in the White Label Agency plan for our 15-person team." },
    { name: "James Rodriguez", email: "j.rodriguez@email.com", phone: "(512) 555-0198", inquiryType: "pricing", message: "Solo founder looking at the Solo plan. Can I upgrade later?" },
    { name: "Linda Chen", email: "linda.chen@email.com", inquiryType: "pricing", message: "What are the enterprise pricing options for 50+ workspaces?" },
    { name: "Mike Thompson", email: "mike.t@email.com", phone: "(720) 555-0234", company: "Thompson Properties", inquiryType: "service", message: "Need SEO content management for our 12 rental property websites." },
    { name: "Karen Davis", email: "karen.d@email.com", phone: "(720) 555-0187", inquiryType: "quote", message: "Looking for a white-label content solution for my marketing agency." },
  ]);

  await db.insert(seoSettings).values([
    { workspaceId: v1.id, provider: "DataForSEO", siteUrl: "https://blog.apexdigital.io", isConnected: true },
    { workspaceId: v3.id, provider: "SEMrush", siteUrl: "https://blog.greenfieldlaw.com", isConnected: false },
  ]);

  console.log("Database seeded successfully");
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
