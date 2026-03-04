import { pgTable, serial, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { workspaces } from "../../shared/schema";
import { weProjects } from "./we-projects";
import { wePages } from "./we-pages";

export const weVersions = pgTable("we_versions", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id")
    .notNull()
    .references(() => wePages.id, { onDelete: "cascade" }),
  projectId: integer("project_id")
    .notNull()
    .references(() => weProjects.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  grapejsState: jsonb("grapejs_state").$type<Record<string, any>>(),
  versionNumber: integer("version_number").notNull().default(1),
  createdBy: varchar("created_by", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWeVersionSchema = createInsertSchema(weVersions).omit({
  id: true,
  createdAt: true,
});
export type InsertWeVersion = z.infer<typeof insertWeVersionSchema>;
export type WeVersion = typeof weVersions.$inferSelect;
