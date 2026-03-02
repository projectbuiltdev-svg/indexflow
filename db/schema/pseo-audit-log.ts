import { pgTable, varchar, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { pseoCampaigns, workspaces } from "../../shared/schema";

export const pseoAuditLog = pgTable("pseo_audit_log", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id", { length: 36 })
    .notNull()
    .references(() => pseoCampaigns.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  pageId: varchar("page_id", { length: 36 }),
  level: text("level").notNull().default("info"),
  errorType: text("error_type"),
  action: text("action").notNull(),
  message: text("message").notNull(),
  previousState: text("previous_state"),
  newState: text("new_state"),
  triggeredBy: varchar("triggered_by", { length: 36 }),
  meta: jsonb("meta").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("pseo_audit_log_campaign_idx").on(t.campaignId),
  index("pseo_audit_log_venue_idx").on(t.venueId),
  index("pseo_audit_log_level_idx").on(t.level),
  index("pseo_audit_log_created_idx").on(t.createdAt),
  index("pseo_audit_log_action_idx").on(t.action),
]);

export const insertPseoAuditLogSchema = createInsertSchema(pseoAuditLog).omit({
  id: true,
  createdAt: true,
});
export type InsertPseoAuditLog = z.infer<typeof insertPseoAuditLogSchema>;
export type PseoAuditLog = typeof pseoAuditLog.$inferSelect;
