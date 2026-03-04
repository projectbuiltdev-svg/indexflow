import { pgTable, serial, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { workspaces } from "../../shared/schema";
import { weProjects } from "./we-projects";

export const weProjectAssets = pgTable("we_project_assets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => weProjects.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size"),
  altText: text("alt_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWeProjectAssetSchema = createInsertSchema(weProjectAssets).omit({
  id: true,
  createdAt: true,
});
export type InsertWeProjectAsset = z.infer<typeof insertWeProjectAssetSchema>;
export type WeProjectAsset = typeof weProjectAssets.$inferSelect;
