import { pgTable, serial, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { workspaces } from "../../shared/schema";
import { weProjects } from "./we-projects";

export const weFormSubmissions = pgTable("we_form_submissions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => weProjects.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  formName: text("form_name").notNull(),
  fields: jsonb("fields").$type<Record<string, any>>(),
  pageUrl: text("page_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWeFormSubmissionSchema = createInsertSchema(weFormSubmissions).omit({
  id: true,
  createdAt: true,
});
export type InsertWeFormSubmission = z.infer<typeof insertWeFormSubmissionSchema>;
export type WeFormSubmission = typeof weFormSubmissions.$inferSelect;
