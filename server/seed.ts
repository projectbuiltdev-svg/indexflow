import { db } from "./db";
import { workspaces, workspaceBlogPosts, workspaceDomains, rankTrackerKeywords, gridKeywords, gridScanResults, contentCampaigns, seoSettings, contactMessages, users } from "@shared/schema";
import { sql, eq } from "drizzle-orm";

export async function seedDatabase() {
  const existing = await db.select().from(workspaces);
  if (existing.length > 0) return;

  const existingUser = await db.select().from(users).where(eq(users.id, "system"));
  if (existingUser.length === 0) {
    await db.insert(users).values({
      id: "system",
      email: "system@indexflow.cloud",
      firstName: "System",
      lastName: "Admin",
    });
  }

  const [v1, v2, v3, v4] = await db.insert(workspaces).values([
    {
      ownerId: "system",
      name: "Apex Dental Group",
      type: "dental",
      status: "active",
      website: "https://apexdental.com",
      city: "Austin",
      state: "TX",
      country: "US",
      timezone: "America/Chicago",
    },
    {
      ownerId: "system",
      name: "Summit Plumbing Co",
      type: "home-services",
      status: "active",
      website: "https://summitplumbing.com",
      city: "Denver",
      state: "CO",
      country: "US",
      timezone: "America/Denver",
    },
    {
      ownerId: "system",
      name: "Greenfield Law Firm",
      type: "legal",
      status: "active",
      website: "https://greenfieldlaw.com",
      city: "Miami",
      state: "FL",
      country: "US",
      timezone: "America/New_York",
    },
    {
      ownerId: "system",
      name: "Pacific Auto Repair",
      type: "automotive",
      status: "active",
      website: "https://pacificautorepair.com",
      city: "Portland",
      state: "OR",
      country: "US",
      timezone: "America/Los_Angeles",
    },
  ]).returning();

  await db.insert(workspaceDomains).values([
    { workspaceId: v1.id, domain: "blog.apexdental.com", isPrimary: true, blogTemplate: "editorial", accentColor: "#2563eb", accentForeground: "#ffffff" },
    { workspaceId: v2.id, domain: "blog.summitplumbing.com", isPrimary: true, blogTemplate: "minimal", accentColor: "#16a34a", accentForeground: "#ffffff" },
    { workspaceId: v3.id, domain: "blog.greenfieldlaw.com", isPrimary: true, blogTemplate: "classic", accentColor: "#7c3aed", accentForeground: "#ffffff" },
    { workspaceId: v4.id, domain: "blog.pacificautorepair.com", isPrimary: true, blogTemplate: "magazine" },
  ]);

  const [campaign1] = await db.insert(contentCampaigns).values([
    { workspaceId: v1.id, name: "Q1 2026 Content Sprint", status: "completed", postsTotal: 4 },
  ]).returning();

  await db.insert(workspaceBlogPosts).values([
    { workspaceId: v1.id, title: "Best Dentist in Austin TX - Top Rated Dental Care", slug: "best-dentist-austin-tx", primaryKeyword: "best dentist austin tx", category: "local-guides", status: "published", campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-01-15") },
    { workspaceId: v1.id, title: "Emergency Dental Services Near Downtown Austin", slug: "emergency-dental-austin", primaryKeyword: "emergency dentist austin", category: "industry-guides", status: "published", campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-01-20") },
    { workspaceId: v1.id, title: "Teeth Whitening Cost in Austin - Complete Guide", slug: "teeth-whitening-cost-austin", primaryKeyword: "teeth whitening austin cost", category: "pricing-cost", status: "published", campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-02-01") },
    { workspaceId: v1.id, title: "Invisalign vs Braces - Austin Orthodontist Guide", slug: "invisalign-vs-braces-austin", primaryKeyword: "invisalign austin", category: "comparisons", status: "draft", campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass" },
    { workspaceId: v2.id, title: "24 Hour Plumber in Denver - Emergency Services", slug: "24-hour-plumber-denver", primaryKeyword: "24 hour plumber denver", category: "local-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-01-10") },
    { workspaceId: v2.id, title: "Water Heater Repair Denver - Same Day Service", slug: "water-heater-repair-denver", primaryKeyword: "water heater repair denver", category: "industry-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-01-25") },
    { workspaceId: v2.id, title: "Drain Cleaning Services in Denver Metro Area", slug: "drain-cleaning-denver", primaryKeyword: "drain cleaning denver", category: "industry-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-02-05") },
    { workspaceId: v3.id, title: "Personal Injury Lawyer Miami - Free Consultation", slug: "personal-injury-lawyer-miami", primaryKeyword: "personal injury lawyer miami", category: "local-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-01-05") },
    { workspaceId: v3.id, title: "Car Accident Attorney Miami - No Win No Fee", slug: "car-accident-attorney-miami", primaryKeyword: "car accident attorney miami", category: "industry-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-01-18") },
    { workspaceId: v3.id, title: "Slip and Fall Lawyer Miami Beach", slug: "slip-fall-lawyer-miami-beach", primaryKeyword: "slip and fall lawyer miami", category: "local-guides", status: "draft", generationStatus: "generated" },
    { workspaceId: v4.id, title: "Auto Repair Shop Portland OR - ASE Certified", slug: "auto-repair-portland-or", primaryKeyword: "auto repair portland", category: "local-guides", status: "published", generationStatus: "generated", publishedAt: new Date("2026-01-12") },
    { workspaceId: v4.id, title: "Brake Service Portland - Best Prices Guaranteed", slug: "brake-service-portland", primaryKeyword: "brake service portland", category: "pricing-cost", status: "published", generationStatus: "generated", publishedAt: new Date("2026-02-08") },
  ]);

  await db.insert(rankTrackerKeywords).values([
    { workspaceId: v1.id, keyword: "best dentist austin tx" },
    { workspaceId: v1.id, keyword: "emergency dentist austin" },
    { workspaceId: v1.id, keyword: "teeth whitening austin" },
    { workspaceId: v1.id, keyword: "dental implants austin tx" },
    { workspaceId: v2.id, keyword: "24 hour plumber denver" },
    { workspaceId: v2.id, keyword: "water heater repair denver" },
    { workspaceId: v2.id, keyword: "drain cleaning denver" },
    { workspaceId: v3.id, keyword: "personal injury lawyer miami" },
    { workspaceId: v3.id, keyword: "car accident attorney miami" },
    { workspaceId: v3.id, keyword: "slip and fall lawyer miami" },
    { workspaceId: v4.id, keyword: "auto repair portland or" },
    { workspaceId: v4.id, keyword: "brake service portland" },
  ]);

  await db.insert(gridKeywords).values([
    { workspaceId: v1.id, keyword: "dentist near me", gridSize: 5, distance: "8.0" },
    { workspaceId: v1.id, keyword: "dental clinic austin", gridSize: 5, distance: "5.0" },
    { workspaceId: v2.id, keyword: "plumber near me", gridSize: 5, distance: "10.0" },
    { workspaceId: v3.id, keyword: "injury lawyer near me", gridSize: 5, distance: "8.0" },
    { workspaceId: v4.id, keyword: "auto repair near me", gridSize: 5, distance: "6.0" },
  ]);

  await db.insert(contactMessages).values([
    { name: "Sarah Mitchell", email: "sarah.m@email.com", phone: "(512) 555-0142", company: "Mitchell Family", inquiryType: "appointment", message: "Looking for a new family dentist in Austin area." },
    { name: "James Rodriguez", email: "j.rodriguez@email.com", phone: "(512) 555-0198", inquiryType: "emergency", message: "Need emergency dental care today." },
    { name: "Linda Chen", email: "linda.chen@email.com", inquiryType: "pricing", message: "What is the cost for teeth whitening?" },
    { name: "Mike Thompson", email: "mike.t@email.com", phone: "(720) 555-0234", company: "Thompson Properties", inquiryType: "service", message: "Need 24 hour plumber for burst pipe." },
    { name: "Karen Davis", email: "karen.d@email.com", phone: "(720) 555-0187", inquiryType: "quote", message: "Looking for water heater repair quote." },
  ]);

  await db.insert(seoSettings).values([
    { workspaceId: v1.id, provider: "DataForSEO", siteUrl: "https://blog.apexdental.com", isConnected: true },
    { workspaceId: v3.id, provider: "SEMrush", siteUrl: "https://blog.greenfieldlaw.com", isConnected: false },
  ]);

  console.log("Database seeded successfully with venue schema");
}
