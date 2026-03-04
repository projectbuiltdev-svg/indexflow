import { pgTable, serial, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { workspaces } from "../../shared/schema";

export const weProjects = pgTable("we_projects", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  intakeAnswers: jsonb("intake_answers").$type<Record<string, any>>(),
  selectedTemplateId: serial("selected_template_id"),
  projectLanguage: text("project_language").notNull().default("en"),
  tierAtCreation: text("tier_at_creation").notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWeProjectSchema = createInsertSchema(weProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWeProject = z.infer<typeof insertWeProjectSchema>;
export type WeProject = typeof weProjects.$inferSelect;
