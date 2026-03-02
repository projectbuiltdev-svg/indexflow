import { pgTable, varchar, text, decimal, integer, timestamp, index, uniqueIndex, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const pseoGeographicReference = pgTable("pseo_geographic_reference", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  country: text("country").notNull(),
  countryCode: text("country_code").notNull(),
  zone: text("zone").notNull(),
  state: text("state").notNull(),
  city: text("city"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  population: integer("population"),
  commercialIntentScore: decimal("commercial_intent_score", { precision: 4, scale: 2 }),
  landmarks: jsonb("landmarks").$type<string[]>(),
  neighbours: jsonb("neighbours").$type<string[]>(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("pseo_geo_ref_country_idx").on(t.countryCode),
  index("pseo_geo_ref_zone_idx").on(t.countryCode, t.zone),
  index("pseo_geo_ref_state_idx").on(t.countryCode, t.state),
  uniqueIndex("pseo_geo_ref_country_zone_state_city_uq").on(t.countryCode, t.zone, t.state, t.city),
]);

export const insertPseoGeographicReferenceSchema = createInsertSchema(pseoGeographicReference).omit({
  id: true,
  createdAt: true,
});
export type InsertPseoGeographicReference = z.infer<typeof insertPseoGeographicReferenceSchema>;
export type PseoGeographicReference = typeof pseoGeographicReference.$inferSelect;
