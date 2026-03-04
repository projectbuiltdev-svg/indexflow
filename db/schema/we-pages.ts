import { pgTable, serial, varchar, text, jsonb, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { workspaces } from "../../shared/schema";
import { weProjects } from "./we-projects";

export const wePages = pgTable("we_pages", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => weProjects.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  grapejsState: jsonb("grapejs_state").$type<Record<string, any>>(),
  seoMeta: jsonb("seo_meta").$type<Record<string, any>>(),
  accessTag: text("access_tag").notNull().default("public"),
  pageOrder: integer("page_order").notNull().default(0),
  isHome: boolean("is_home").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWePageSchema = createInsertSchema(wePages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWePage = z.infer<typeof insertWePageSchema>;
export type WePage = typeof wePages.$inferSelect;
