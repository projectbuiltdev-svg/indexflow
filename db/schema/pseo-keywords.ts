import { pgTable, varchar, text, integer, decimal, boolean, timestamp, index, uniqueIndex, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { pseoCampaigns, pseoPages, workspaces } from "../../shared/schema";

export const pseoKeywords = pgTable("pseo_keywords", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id", { length: 36 })
    .notNull()
    .references(() => pseoCampaigns.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  pageId: varchar("page_id", { length: 36 })
    .references(() => pseoPages.id, { onDelete: "set null" }),
  keyword: text("keyword").notNull(),
  isPrimary: boolean("is_primary").notNull().default(false),
  volume: integer("volume"),
  difficulty: integer("difficulty"),
  cpc: decimal("cpc", { precision: 8, scale: 2 }),
  intent: text("intent").notNull().default("commercial"),
  source: text("source").notNull().default("manual"),
  position: integer("position"),
  previousPosition: integer("previous_position"),
  clicks: integer("clicks").default(0),
  impressions: integer("impressions").default(0),
  ctr: decimal("ctr", { precision: 6, scale: 4 }).default("0"),
  lastCheckedAt: timestamp("last_checked_at"),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (t) => [
  index("pseo_keywords_campaign_idx").on(t.campaignId),
  index("pseo_keywords_page_idx").on(t.pageId),
  index("pseo_keywords_venue_idx").on(t.venueId),
  uniqueIndex("pseo_keywords_campaign_page_keyword_uq").on(t.campaignId, t.pageId, t.keyword),
]);

export const insertPseoKeywordSchema = createInsertSchema(pseoKeywords).omit({
  id: true,
  createdAt: true,
  deletedAt: true,
});
export type InsertPseoKeyword = z.infer<typeof insertPseoKeywordSchema>;
export type PseoKeyword = typeof pseoKeywords.$inferSelect;
