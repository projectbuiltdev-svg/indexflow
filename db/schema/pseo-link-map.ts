import { pgTable, varchar, text, decimal, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { pseoCampaigns, pseoPages, workspaces } from "../../shared/schema";

export const pseoLinkMap = pgTable("pseo_link_map", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id", { length: 36 })
    .notNull()
    .references(() => pseoCampaigns.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  sourcePageId: varchar("source_page_id", { length: 36 })
    .notNull()
    .references(() => pseoPages.id, { onDelete: "cascade" }),
  targetPageId: varchar("target_page_id", { length: 36 })
    .notNull()
    .references(() => pseoPages.id, { onDelete: "cascade" }),
  anchorText: text("anchor_text").notNull(),
  linkType: text("link_type").notNull().default("contextual"),
  relevanceScore: decimal("relevance_score", { precision: 4, scale: 3 }),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (t) => [
  index("pseo_link_map_campaign_idx").on(t.campaignId),
  index("pseo_link_map_source_idx").on(t.sourcePageId),
  index("pseo_link_map_target_idx").on(t.targetPageId),
  index("pseo_link_map_venue_idx").on(t.venueId),
  uniqueIndex("pseo_link_map_source_target_uq").on(t.campaignId, t.sourcePageId, t.targetPageId),
]);

export const insertPseoLinkMapSchema = createInsertSchema(pseoLinkMap).omit({
  id: true,
  createdAt: true,
  deletedAt: true,
});
export type InsertPseoLinkMap = z.infer<typeof insertPseoLinkMapSchema>;
export type PseoLinkMap = typeof pseoLinkMap.$inferSelect;
