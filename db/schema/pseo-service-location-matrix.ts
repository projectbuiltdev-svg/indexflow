import { pgTable, varchar, boolean, timestamp, index, uniqueIndex, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { pseoCampaigns, pseoServices, pseoLocations } from "../../shared/schema";

export const pseoServiceLocationMatrix = pgTable("pseo_service_location_matrix", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id", { length: 36 })
    .notNull()
    .references(() => pseoCampaigns.id, { onDelete: "cascade" }),
  serviceId: varchar("service_id", { length: 36 })
    .notNull()
    .references(() => pseoServices.id, { onDelete: "cascade" }),
  locationId: varchar("location_id", { length: 36 })
    .notNull()
    .references(() => pseoLocations.id, { onDelete: "cascade" }),
  isEnabled: boolean("is_enabled").notNull().default(true),
  pageId: varchar("page_id", { length: 36 }),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (t) => [
  uniqueIndex("pseo_slm_campaign_service_location_uq").on(t.campaignId, t.serviceId, t.locationId),
  index("pseo_slm_campaign_idx").on(t.campaignId),
  index("pseo_slm_service_idx").on(t.serviceId),
  index("pseo_slm_location_idx").on(t.locationId),
]);

export const insertPseoServiceLocationMatrixSchema = createInsertSchema(pseoServiceLocationMatrix).omit({
  id: true,
  createdAt: true,
  deletedAt: true,
});
export type InsertPseoServiceLocationMatrix = z.infer<typeof insertPseoServiceLocationMatrixSchema>;
export type PseoServiceLocationMatrix = typeof pseoServiceLocationMatrix.$inferSelect;
