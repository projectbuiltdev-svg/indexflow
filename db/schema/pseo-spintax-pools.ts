import { pgTable, varchar, text, integer, timestamp, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { pseoCampaigns, workspaces } from "../../shared/schema";

export const pseoSpintaxPools = pgTable("pseo_spintax_pools", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id", { length: 36 })
    .notNull()
    .references(() => pseoCampaigns.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  poolType: text("pool_type").notNull(),
  zoneId: text("zone_id"),
  variants: jsonb("variants").$type<string[]>().notNull(),
  usageCount: jsonb("usage_count").$type<Record<string, number>>(),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (t) => [
  index("pseo_spintax_campaign_idx").on(t.campaignId),
  index("pseo_spintax_venue_idx").on(t.venueId),
  uniqueIndex("pseo_spintax_campaign_type_zone_uq").on(t.campaignId, t.poolType, t.zoneId),
]);

export const insertPseoSpintaxPoolSchema = createInsertSchema(pseoSpintaxPools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type InsertPseoSpintaxPool = z.infer<typeof insertPseoSpintaxPoolSchema>;
export type PseoSpintaxPool = typeof pseoSpintaxPools.$inferSelect;
