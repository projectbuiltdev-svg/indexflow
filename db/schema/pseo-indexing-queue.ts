import { pgTable, varchar, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { pseoCampaigns, pseoPages, workspaces } from "../../shared/schema";

export const pseoIndexingQueue = pgTable("pseo_indexing_queue", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id", { length: 36 })
    .notNull()
    .references(() => pseoCampaigns.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  pageId: varchar("page_id", { length: 36 })
    .notNull()
    .references(() => pseoPages.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  status: text("status").notNull().default("pending"),
  method: text("method").notNull().default("google-indexing-api"),
  attempts: integer("attempts").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(3),
  lastAttemptAt: timestamp("last_attempt_at"),
  nextRetryAt: timestamp("next_retry_at"),
  submittedAt: timestamp("submitted_at"),
  indexedAt: timestamp("indexed_at"),
  priority: integer("priority").notNull().default(4),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (t) => [
  index("pseo_indexing_queue_campaign_idx").on(t.campaignId),
  index("pseo_indexing_queue_status_idx").on(t.status),
  index("pseo_indexing_queue_venue_idx").on(t.venueId),
  index("pseo_indexing_queue_next_retry_idx").on(t.nextRetryAt),
]);

export const insertPseoIndexingQueueSchema = createInsertSchema(pseoIndexingQueue).omit({
  id: true,
  createdAt: true,
  deletedAt: true,
});
export type InsertPseoIndexingQueue = z.infer<typeof insertPseoIndexingQueueSchema>;
export type PseoIndexingQueue = typeof pseoIndexingQueue.$inferSelect;
