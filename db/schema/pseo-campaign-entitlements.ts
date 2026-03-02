import { pgTable, varchar, integer, text, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { workspaces } from "../../shared/schema";

export const pseoCampaignEntitlements = pgTable("pseo_campaign_entitlements", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: integer("unit_price").notNull(),
  polarOrderId: text("polar_order_id").notNull(),
  polarProductId: text("polar_product_id"),
  grantedAt: timestamp("granted_at").defaultNow(),
}, (t) => [
  index("pseo_entitlements_venue_idx").on(t.venueId),
  index("pseo_entitlements_polar_order_idx").on(t.polarOrderId),
]);

export const insertPseoCampaignEntitlementSchema = createInsertSchema(pseoCampaignEntitlements).omit({
  id: true,
  grantedAt: true,
});
export type InsertPseoCampaignEntitlement = z.infer<typeof insertPseoCampaignEntitlementSchema>;
export type PseoCampaignEntitlement = typeof pseoCampaignEntitlements.$inferSelect;
