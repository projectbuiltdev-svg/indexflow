import { pgTable, serial, varchar, text, integer, jsonb, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { workspaces } from "../../shared/schema";
import { weProjects } from "./we-projects";

export const weAuditSeverityEnum = pgEnum("we_audit_severity", ["info", "warn", "error"]);

export const weAuditLog = pgTable("we_audit_log", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  projectId: integer("project_id")
    .references(() => weProjects.id, { onDelete: "set null" }),
  userId: varchar("user_id", { length: 36 }),
  action: text("action").notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  severity: weAuditSeverityEnum("severity").notNull().default("info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWeAuditLogSchema = createInsertSchema(weAuditLog).omit({
  id: true,
  createdAt: true,
});
export type InsertWeAuditLog = z.infer<typeof insertWeAuditLogSchema>;
export type WeAuditLog = typeof weAuditLog.$inferSelect;
