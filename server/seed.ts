import { db } from "./db";
import { workspaces, blogPosts, domains, rankTrackerKeywords, gridKeywords, gridScanResults, leads, gscData, campaigns, seoSettings } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const existing = await db.select().from(workspaces);
  if (existing.length > 0) return;

  const [ws1, ws2, ws3, ws4] = await db.insert(workspaces).values([
    {
      name: "Apex Dental Group",
      slug: "apex-dental",
      industry: "Dental",
      status: "active",
      websiteUrl: "https://apexdental.com",
      description: "Multi-location dental practice in Austin, TX",
    },
    {
      name: "Summit Plumbing Co",
      slug: "summit-plumbing",
      industry: "Home Services",
      status: "active",
      websiteUrl: "https://summitplumbing.com",
      description: "Emergency and residential plumbing services in Denver, CO",
    },
    {
      name: "Greenfield Law Firm",
      slug: "greenfield-law",
      industry: "Legal",
      status: "active",
      websiteUrl: "https://greenfieldlaw.com",
      description: "Personal injury and accident law firm in Miami, FL",
    },
    {
      name: "Pacific Auto Repair",
      slug: "pacific-auto",
      industry: "Automotive",
      status: "active",
      websiteUrl: "https://pacificautorepair.com",
      description: "ASE certified auto repair shop in Portland, OR",
    },
  ]).returning();

  await db.insert(domains).values([
    { workspaceId: ws1.id, domain: "blog.apexdental.com", isPrimary: true, blogTemplate: "editorial", accentColor: "#2563eb", accentForeground: "#ffffff" },
    { workspaceId: ws2.id, domain: "blog.summitplumbing.com", isPrimary: true, blogTemplate: "minimal", accentColor: "#16a34a", accentForeground: "#ffffff" },
    { workspaceId: ws3.id, domain: "blog.greenfieldlaw.com", isPrimary: true, blogTemplate: "classic", accentColor: "#7c3aed", accentForeground: "#ffffff" },
    { workspaceId: ws4.id, domain: "blog.pacificautorepair.com", isPrimary: true, blogTemplate: "magazine" },
  ]);

  const [campaign1] = await db.insert(campaigns).values([
    { workspaceId: ws1.id, name: "Q1 2026 Content Sprint", status: "completed", totalPosts: 4, generatedPosts: 4 },
  ]).returning();

  await db.insert(blogPosts).values([
    { workspaceId: ws1.id, title: "Best Dentist in Austin TX - Top Rated Dental Care", slug: "best-dentist-austin-tx", primaryKeyword: "best dentist austin tx", category: "local-guides", status: "published", wordCount: 1850, impressions: 4200, clicks: 310, position: 3.2, campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-01-15") },
    { workspaceId: ws1.id, title: "Emergency Dental Services Near Downtown Austin", slug: "emergency-dental-austin", primaryKeyword: "emergency dentist austin", category: "industry-guides", status: "published", wordCount: 1420, impressions: 2800, clicks: 195, position: 5.1, campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-01-20") },
    { workspaceId: ws1.id, title: "Teeth Whitening Cost in Austin - Complete Guide", slug: "teeth-whitening-cost-austin", primaryKeyword: "teeth whitening austin cost", category: "pricing-cost", status: "published", wordCount: 2100, impressions: 3600, clicks: 245, position: 4.8, campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass", publishedAt: new Date("2026-02-01") },
    { workspaceId: ws1.id, title: "Invisalign vs Braces - Austin Orthodontist Guide", slug: "invisalign-vs-braces-austin", primaryKeyword: "invisalign austin", category: "comparisons", status: "draft", wordCount: 1900, campaignId: campaign1.id, generationStatus: "generated", qualityGateStatus: "pass" },
    { workspaceId: ws2.id, title: "24 Hour Plumber in Denver - Emergency Services", slug: "24-hour-plumber-denver", primaryKeyword: "24 hour plumber denver", category: "local-guides", status: "published", wordCount: 1650, impressions: 5100, clicks: 420, position: 2.8, generationStatus: "generated", publishedAt: new Date("2026-01-10") },
    { workspaceId: ws2.id, title: "Water Heater Repair Denver - Same Day Service", slug: "water-heater-repair-denver", primaryKeyword: "water heater repair denver", category: "industry-guides", status: "published", wordCount: 1380, impressions: 2300, clicks: 178, position: 6.4, generationStatus: "generated", publishedAt: new Date("2026-01-25") },
    { workspaceId: ws2.id, title: "Drain Cleaning Services in Denver Metro Area", slug: "drain-cleaning-denver", primaryKeyword: "drain cleaning denver", category: "industry-guides", status: "published", wordCount: 1200, impressions: 1800, clicks: 134, position: 7.9, generationStatus: "generated", publishedAt: new Date("2026-02-05") },
    { workspaceId: ws3.id, title: "Personal Injury Lawyer Miami - Free Consultation", slug: "personal-injury-lawyer-miami", primaryKeyword: "personal injury lawyer miami", category: "local-guides", status: "published", wordCount: 2400, impressions: 8900, clicks: 670, position: 1.9, generationStatus: "generated", publishedAt: new Date("2026-01-05") },
    { workspaceId: ws3.id, title: "Car Accident Attorney Miami - No Win No Fee", slug: "car-accident-attorney-miami", primaryKeyword: "car accident attorney miami", category: "industry-guides", status: "published", wordCount: 2100, impressions: 6200, clicks: 490, position: 3.4, generationStatus: "generated", publishedAt: new Date("2026-01-18") },
    { workspaceId: ws3.id, title: "Slip and Fall Lawyer Miami Beach", slug: "slip-fall-lawyer-miami-beach", primaryKeyword: "slip and fall lawyer miami", category: "local-guides", status: "scheduled", wordCount: 1800, generationStatus: "generated", scheduledAt: new Date("2026-03-01") },
    { workspaceId: ws4.id, title: "Auto Repair Shop Portland OR - ASE Certified", slug: "auto-repair-portland-or", primaryKeyword: "auto repair portland", category: "local-guides", status: "published", wordCount: 1550, impressions: 3100, clicks: 210, position: 5.6, generationStatus: "generated", publishedAt: new Date("2026-01-12") },
    { workspaceId: ws4.id, title: "Brake Service Portland - Best Prices Guaranteed", slug: "brake-service-portland", primaryKeyword: "brake service portland", category: "pricing-cost", status: "published", wordCount: 1300, impressions: 1900, clicks: 145, position: 8.2, generationStatus: "generated", publishedAt: new Date("2026-02-08") },
  ]);

  await db.insert(rankTrackerKeywords).values([
    { workspaceId: ws1.id, keyword: "best dentist austin tx", currentPosition: 3.2, previousPosition: 5.8, searchVolume: 2400, difficulty: 42, url: "/best-dentist-austin-tx", trend: "up" },
    { workspaceId: ws1.id, keyword: "emergency dentist austin", currentPosition: 5.1, previousPosition: 7.3, searchVolume: 1800, difficulty: 38, url: "/emergency-dental-austin", trend: "up" },
    { workspaceId: ws1.id, keyword: "teeth whitening austin", currentPosition: 4.8, previousPosition: 4.2, searchVolume: 1200, difficulty: 35, url: "/teeth-whitening-cost-austin", trend: "down" },
    { workspaceId: ws1.id, keyword: "dental implants austin tx", currentPosition: 8.9, previousPosition: 12.4, searchVolume: 900, difficulty: 55, url: "/dental-implants-austin", trend: "up" },
    { workspaceId: ws2.id, keyword: "24 hour plumber denver", currentPosition: 2.8, previousPosition: 4.1, searchVolume: 3200, difficulty: 48, url: "/24-hour-plumber-denver", trend: "up" },
    { workspaceId: ws2.id, keyword: "water heater repair denver", currentPosition: 6.4, previousPosition: 6.8, searchVolume: 1600, difficulty: 32, url: "/water-heater-repair-denver", trend: "up" },
    { workspaceId: ws2.id, keyword: "drain cleaning denver", currentPosition: 7.9, previousPosition: 9.2, searchVolume: 1100, difficulty: 28, url: "/drain-cleaning-denver", trend: "up" },
    { workspaceId: ws3.id, keyword: "personal injury lawyer miami", currentPosition: 1.9, previousPosition: 3.1, searchVolume: 8800, difficulty: 78, url: "/personal-injury-lawyer-miami", trend: "up" },
    { workspaceId: ws3.id, keyword: "car accident attorney miami", currentPosition: 3.4, previousPosition: 5.6, searchVolume: 5400, difficulty: 72, url: "/car-accident-attorney-miami", trend: "up" },
    { workspaceId: ws3.id, keyword: "slip and fall lawyer miami", currentPosition: 11.2, previousPosition: 14.8, searchVolume: 2200, difficulty: 65, url: "/slip-fall-lawyer-miami-beach", trend: "up" },
    { workspaceId: ws4.id, keyword: "auto repair portland or", currentPosition: 5.6, previousPosition: 7.1, searchVolume: 2100, difficulty: 40, url: "/auto-repair-portland-or", trend: "up" },
    { workspaceId: ws4.id, keyword: "brake service portland", currentPosition: 8.2, previousPosition: 8.5, searchVolume: 800, difficulty: 25, url: "/brake-service-portland", trend: "stable" },
  ]);

  const [gk1, gk2, gk3, gk4, gk5] = await db.insert(gridKeywords).values([
    { workspaceId: ws1.id, keyword: "dentist near me", location: "Austin, TX", latitude: 30.2672, longitude: -97.7431, radiusKm: 8 },
    { workspaceId: ws1.id, keyword: "dental clinic austin", location: "Austin, TX", latitude: 30.2672, longitude: -97.7431, radiusKm: 5 },
    { workspaceId: ws2.id, keyword: "plumber near me", location: "Denver, CO", latitude: 39.7392, longitude: -104.9903, radiusKm: 10 },
    { workspaceId: ws3.id, keyword: "injury lawyer near me", location: "Miami, FL", latitude: 25.7617, longitude: -80.1918, radiusKm: 8 },
    { workspaceId: ws4.id, keyword: "auto repair near me", location: "Portland, OR", latitude: 45.5152, longitude: -122.6784, radiusKm: 6 },
  ]).returning();

  function generateGrid(): number[][] {
    return Array.from({ length: 5 }, () =>
      Array.from({ length: 5 }, () => Math.floor(Math.random() * 18) + 1)
    );
  }

  await db.insert(gridScanResults).values([
    { gridKeywordId: gk1.id, workspaceId: ws1.id, gridData: [[2, 3, 1, 4, 6], [3, 1, 2, 5, 8], [5, 4, 3, 7, 9], [8, 6, 5, 4, 11], [12, 9, 7, 6, 14]], avgRank: 5.6, visibility: 72 },
    { gridKeywordId: gk2.id, workspaceId: ws1.id, gridData: [[1, 2, 3, 5, 7], [2, 1, 4, 6, 9], [4, 3, 5, 8, 11], [6, 5, 7, 10, 13], [9, 8, 10, 12, 15]], avgRank: 6.3, visibility: 64 },
    { gridKeywordId: gk3.id, workspaceId: ws2.id, gridData: [[3, 2, 4, 7, 10], [2, 1, 3, 5, 8], [4, 3, 2, 6, 9], [7, 5, 4, 3, 11], [10, 8, 6, 5, 14]], avgRank: 5.2, visibility: 68 },
    { gridKeywordId: gk4.id, workspaceId: ws3.id, gridData: [[1, 1, 2, 3, 5], [1, 2, 1, 4, 6], [2, 3, 3, 5, 8], [4, 4, 5, 7, 10], [6, 5, 7, 9, 12]], avgRank: 4.2, visibility: 80 },
    { gridKeywordId: gk5.id, workspaceId: ws4.id, gridData: generateGrid(), avgRank: 8.1, visibility: 48 },
  ]);

  await db.insert(leads).values([
    { workspaceId: ws1.id, name: "Sarah Mitchell", email: "sarah.m@email.com", phone: "(512) 555-0142", source: "organic", landingPage: "/best-dentist-austin-tx", keyword: "best dentist austin tx", status: "booked", bookedAt: new Date("2026-02-11"), createdAt: new Date("2026-02-10") },
    { workspaceId: ws1.id, name: "James Rodriguez", email: "j.rodriguez@email.com", phone: "(512) 555-0198", source: "form", landingPage: "/emergency-dental-austin", keyword: "emergency dentist austin", status: "contacted", createdAt: new Date("2026-02-12") },
    { workspaceId: ws1.id, name: "Linda Chen", email: "linda.chen@email.com", source: "organic", landingPage: "/teeth-whitening-cost-austin", keyword: "teeth whitening austin", status: "new", createdAt: new Date("2026-02-15") },
    { workspaceId: ws2.id, name: "Mike Thompson", phone: "(720) 555-0234", source: "phone", keyword: "24 hour plumber denver", status: "booked", bookedAt: new Date("2026-02-09"), createdAt: new Date("2026-02-08") },
    { workspaceId: ws2.id, name: "Karen Davis", email: "karen.d@email.com", phone: "(720) 555-0187", source: "form", landingPage: "/water-heater-repair-denver", keyword: "water heater repair denver", status: "qualified", createdAt: new Date("2026-02-11") },
    { workspaceId: ws3.id, name: "Robert Garcia", email: "r.garcia@email.com", phone: "(305) 555-0321", source: "organic", landingPage: "/personal-injury-lawyer-miami", keyword: "personal injury lawyer miami", status: "booked", bookedAt: new Date("2026-02-01"), createdAt: new Date("2026-01-28") },
    { workspaceId: ws3.id, name: "Patricia Wilson", email: "p.wilson@email.com", source: "chat", keyword: "car accident attorney miami", status: "contacted", createdAt: new Date("2026-02-13") },
    { workspaceId: ws3.id, name: "David Lee", phone: "(305) 555-0456", source: "referral", keyword: "slip and fall lawyer miami", status: "new", createdAt: new Date("2026-02-16") },
    { workspaceId: ws4.id, name: "Jennifer Brown", email: "j.brown@email.com", phone: "(503) 555-0189", source: "organic", landingPage: "/auto-repair-portland-or", keyword: "auto repair portland", status: "qualified", createdAt: new Date("2026-02-09") },
    { workspaceId: ws4.id, name: "Chris Anderson", email: "chris.a@email.com", source: "form", landingPage: "/brake-service-portland", keyword: "brake service portland", status: "new", createdAt: new Date("2026-02-14") },
  ]);

  const dates = ["2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04", "2026-02-05", "2026-02-06", "2026-02-07", "2026-02-08", "2026-02-09", "2026-02-10"];
  const gscEntries = [];
  for (const date of dates) {
    gscEntries.push(
      { workspaceId: ws1.id, date, query: "best dentist austin tx", page: "/best-dentist-austin-tx", clicks: Math.floor(Math.random() * 40) + 20, impressions: Math.floor(Math.random() * 400) + 200, ctr: 0.08 + Math.random() * 0.05, position: 2.5 + Math.random() * 2 },
      { workspaceId: ws1.id, date, query: "emergency dentist austin", page: "/emergency-dental-austin", clicks: Math.floor(Math.random() * 25) + 10, impressions: Math.floor(Math.random() * 300) + 150, ctr: 0.06 + Math.random() * 0.04, position: 4 + Math.random() * 3 },
      { workspaceId: ws2.id, date, query: "24 hour plumber denver", page: "/24-hour-plumber-denver", clicks: Math.floor(Math.random() * 50) + 30, impressions: Math.floor(Math.random() * 500) + 300, ctr: 0.07 + Math.random() * 0.05, position: 2 + Math.random() * 2 },
      { workspaceId: ws3.id, date, query: "personal injury lawyer miami", page: "/personal-injury-lawyer-miami", clicks: Math.floor(Math.random() * 80) + 50, impressions: Math.floor(Math.random() * 800) + 500, ctr: 0.06 + Math.random() * 0.06, position: 1.5 + Math.random() * 2 },
    );
  }
  await db.insert(gscData).values(gscEntries);

  await db.insert(seoSettings).values([
    { workspaceId: ws1.id, defaultTitle: "Apex Dental Group Blog", defaultDescription: "Expert dental care tips and guides from Austin's top dental practice", sitemapEnabled: true, schemaMarkupEnabled: true, canonicalBaseUrl: "https://blog.apexdental.com" },
    { workspaceId: ws3.id, defaultTitle: "Greenfield Law Blog", defaultDescription: "Legal insights from Miami's trusted personal injury attorneys", sitemapEnabled: true, schemaMarkupEnabled: true, canonicalBaseUrl: "https://blog.greenfieldlaw.com" },
  ]);

  console.log("Database seeded successfully with production schema");
}
