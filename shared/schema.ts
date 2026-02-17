import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
});

export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  industry: text("industry"),
  status: text("status").notNull().default("active"),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  title: text("title").notNull().default(""),
  slug: text("slug").notNull().default(""),
  description: text("description"),
  category: text("category"),
  tags: jsonb("tags").$type<string[]>().default([]),
  mdxContent: text("mdx_content"),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"),
  primaryKeyword: text("primary_keyword"),
  intent: text("intent"),
  funnel: text("funnel"),
  campaignId: varchar("campaign_id"),
  generationStatus: text("generation_status").default("pending"),
  qualityGateStatus: text("quality_gate_status"),
  qualityFailReasons: jsonb("quality_fail_reasons").$type<string[]>(),
  wordCount: integer("word_count"),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  position: real("position"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const domains = pgTable("domains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  domain: text("domain").notNull(),
  isPrimary: boolean("is_primary").default(false),
  blogTemplate: text("blog_template").default("editorial"),
  accentColor: text("accent_color"),
  accentForeground: text("accent_foreground"),
  sslStatus: text("ssl_status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contentAssets = pgTable("content_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(),
  sourceAssetId: text("source_asset_id").notNull(),
  originalUrl: text("original_url").notNull(),
  publicUrl: text("public_url"),
  width: integer("width"),
  height: integer("height"),
  creditName: text("credit_name"),
  creditUrl: text("credit_url"),
  type: text("type").default("generic"),
  licenseNote: text("license_note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contentAssetUsages = pgTable("content_asset_usages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assetId: varchar("asset_id").notNull(),
  postId: varchar("post_id").notNull(),
  alt: text("alt"),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  name: text("name"),
  status: text("status").notNull().default("pending"),
  totalPosts: integer("total_posts").default(0),
  generatedPosts: integer("generated_posts").default(0),
  failedPosts: integer("failed_posts").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rankTrackerKeywords = pgTable("rank_tracker_keywords", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  keyword: text("keyword").notNull(),
  currentPosition: real("current_position"),
  previousPosition: real("previous_position"),
  searchVolume: integer("search_volume"),
  difficulty: integer("difficulty"),
  url: text("url"),
  trend: text("trend").default("stable"),
  engine: text("engine").default("google"),
  location: text("location"),
  lastCheckedAt: timestamp("last_checked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gridKeywords = pgTable("grid_keywords", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  keyword: text("keyword").notNull(),
  location: text("location").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  radiusKm: real("radius_km").default(5),
  gridSize: integer("grid_size").default(5),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gridScanResults = pgTable("grid_scan_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gridKeywordId: varchar("grid_keyword_id").notNull(),
  workspaceId: varchar("workspace_id").notNull(),
  gridData: jsonb("grid_data").notNull(),
  avgRank: real("avg_rank"),
  visibility: real("visibility"),
  scannedAt: timestamp("scanned_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  source: text("source").notNull(),
  landingPage: text("landing_page"),
  keyword: text("keyword"),
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  bookedAt: timestamp("booked_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gscData = pgTable("gsc_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  date: text("date").notNull(),
  query: text("query").notNull(),
  page: text("page"),
  clicks: integer("clicks").default(0),
  impressions: integer("impressions").default(0),
  ctr: real("ctr"),
  position: real("position"),
});

export const seoSettings = pgTable("seo_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull().unique(),
  defaultTitle: text("default_title"),
  defaultDescription: text("default_description"),
  robotsTxt: text("robots_txt"),
  sitemapEnabled: boolean("sitemap_enabled").default(true),
  schemaMarkupEnabled: boolean("schema_markup_enabled").default(true),
  canonicalBaseUrl: text("canonical_base_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDomainSchema = createInsertSchema(domains).omit({ id: true, createdAt: true });
export const insertContentAssetSchema = createInsertSchema(contentAssets).omit({ id: true, createdAt: true });
export const insertContentAssetUsageSchema = createInsertSchema(contentAssetUsages).omit({ id: true, createdAt: true });
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRankTrackerKeywordSchema = createInsertSchema(rankTrackerKeywords).omit({ id: true, createdAt: true });
export const insertGridKeywordSchema = createInsertSchema(gridKeywords).omit({ id: true, createdAt: true });
export const insertGridScanResultSchema = createInsertSchema(gridScanResults).omit({ id: true, scannedAt: true });
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true });
export const insertGscDataSchema = createInsertSchema(gscData).omit({ id: true });
export const insertSeoSettingsSchema = createInsertSchema(seoSettings).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = typeof workspaces.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type Domain = typeof domains.$inferSelect;
export type InsertContentAsset = z.infer<typeof insertContentAssetSchema>;
export type ContentAsset = typeof contentAssets.$inferSelect;
export type InsertContentAssetUsage = z.infer<typeof insertContentAssetUsageSchema>;
export type ContentAssetUsage = typeof contentAssetUsages.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertRankTrackerKeyword = z.infer<typeof insertRankTrackerKeywordSchema>;
export type RankTrackerKeyword = typeof rankTrackerKeywords.$inferSelect;
export type InsertGridKeyword = z.infer<typeof insertGridKeywordSchema>;
export type GridKeyword = typeof gridKeywords.$inferSelect;
export type InsertGridScanResult = z.infer<typeof insertGridScanResultSchema>;
export type GridScanResult = typeof gridScanResults.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertGscData = z.infer<typeof insertGscDataSchema>;
export type GscData = typeof gscData.$inferSelect;
export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;
