import { pgTable, varchar, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { pseoCampaigns, pseoPages, pseoLocations, workspaces } from "../../shared/schema";

export const pseoImageAssignments = pgTable("pseo_image_assignments", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id", { length: 36 })
    .notNull()
    .references(() => pseoCampaigns.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  pageId: varchar("page_id", { length: 36 })
    .references(() => pseoPages.id, { onDelete: "cascade" }),
  locationId: varchar("location_id", { length: 36 })
    .references(() => pseoLocations.id, { onDelete: "set null" }),
  contentAssetId: integer("content_asset_id"),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  source: text("source").notNull().default("pexels"),
  placement: text("placement").notNull().default("hero"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (t) => [
  index("pseo_image_assign_campaign_idx").on(t.campaignId),
  index("pseo_image_assign_page_idx").on(t.pageId),
  index("pseo_image_assign_location_idx").on(t.locationId),
  index("pseo_image_assign_venue_idx").on(t.venueId),
]);

export const insertPseoImageAssignmentSchema = createInsertSchema(pseoImageAssignments).omit({
  id: true,
  createdAt: true,
  deletedAt: true,
});
export type InsertPseoImageAssignment = z.infer<typeof insertPseoImageAssignmentSchema>;
export type PseoImageAssignment = typeof pseoImageAssignments.$inferSelect;
