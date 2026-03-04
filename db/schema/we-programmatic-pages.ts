import { pgTable, serial, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { workspaces, pseoCampaigns } from "../../shared/schema";
import { weProjects } from "./we-projects";

export const weProgrammaticPages = pgTable("we_programmatic_pages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => weProjects.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  pseoCampaignId: varchar("pseo_campaign_id", { length: 36 })
    .references(() => pseoCampaigns.id, { onDelete: "set null" }),
  designTokenSnapshot: jsonb("design_token_snapshot").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWeProgrammaticPageSchema = createInsertSchema(weProgrammaticPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWeProgrammaticPage = z.infer<typeof insertWeProgrammaticPageSchema>;
export type WeProgrammaticPage = typeof weProgrammaticPages.$inferSelect;
