import { pgTable, varchar, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { pseoCampaigns, pseoPages, workspaces, users } from "../../shared/schema";

export const pseoReviewQueue = pgTable("pseo_review_queue", {
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
  reason: text("reason").notNull(),
  reasonCategory: text("reason_category").notNull().default("quality_fail"),
  failReasons: jsonb("fail_reasons").$type<string[]>(),
  status: text("status").notNull().default("pending"),
  reviewedBy: varchar("reviewed_by", { length: 36 })
    .references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at"),
  reviewNotes: text("review_notes"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (t) => [
  index("pseo_review_queue_campaign_idx").on(t.campaignId),
  index("pseo_review_queue_status_idx").on(t.status),
  index("pseo_review_queue_venue_idx").on(t.venueId),
  index("pseo_review_queue_page_idx").on(t.pageId),
]);

export const insertPseoReviewQueueSchema = createInsertSchema(pseoReviewQueue).omit({
  id: true,
  createdAt: true,
  deletedAt: true,
});
export type InsertPseoReviewQueue = z.infer<typeof insertPseoReviewQueueSchema>;
export type PseoReviewQueue = typeof pseoReviewQueue.$inferSelect;
