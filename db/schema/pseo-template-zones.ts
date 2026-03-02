import { pgTable, varchar, text, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { pseoCampaigns, workspaces } from "../../shared/schema";

export const pseoTemplateZones = pgTable("pseo_template_zones", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id", { length: 36 })
    .notNull()
    .references(() => pseoCampaigns.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  zoneKey: text("zone_key").notNull(),
  label: text("label").notNull(),
  zoneType: text("zone_type").notNull().default("text"),
  defaultContent: text("default_content"),
  isRequired: boolean("is_required").notNull().default(false),
  isLocked: boolean("is_locked").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (t) => [
  index("pseo_template_zones_campaign_idx").on(t.campaignId),
  index("pseo_template_zones_venue_idx").on(t.venueId),
]);

export const insertPseoTemplateZoneSchema = createInsertSchema(pseoTemplateZones).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type InsertPseoTemplateZone = z.infer<typeof insertPseoTemplateZoneSchema>;
export type PseoTemplateZone = typeof pseoTemplateZones.$inferSelect;
