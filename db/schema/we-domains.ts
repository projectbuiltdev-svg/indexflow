import { pgTable, serial, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { workspaces } from "../../shared/schema";

export const weVerificationStatusEnum = pgEnum("we_verification_status", ["pending", "verified", "failed"]);

export const weDomains = pgTable("we_domains", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  domain: text("domain").notNull(),
  txtRecord: text("txt_record"),
  verificationStatus: weVerificationStatusEnum("verification_status").notNull().default("pending"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWeDomainSchema = createInsertSchema(weDomains).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWeDomain = z.infer<typeof insertWeDomainSchema>;
export type WeDomain = typeof weDomains.$inferSelect;
