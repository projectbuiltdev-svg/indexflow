import { pgTable, serial, text, jsonb, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const weTemplates = pgTable("we_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  styleTags: jsonb("style_tags").$type<string[]>(),
  featureTags: jsonb("feature_tags").$type<string[]>(),
  grapejsState: jsonb("grapejs_state").$type<Record<string, any>>(),
  version: integer("version").notNull().default(1),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWeTemplateSchema = createInsertSchema(weTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWeTemplate = z.infer<typeof insertWeTemplateSchema>;
export type WeTemplate = typeof weTemplates.$inferSelect;
