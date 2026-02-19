import { pgTable, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const PLAN_TIERS = {
  solo: {
    id: "solo",
    name: "Solo",
    price: 99,
    maxWorkspaces: 1,
    maxUsers: 1,
    maxDomains: 1,
    whiteLabel: false,
    customDomain: false,
    teamRoles: false,
    bulkCampaigns: false,
    contentModeration: false,
    apiAccess: false,
    ssoSaml: false,
  },
  professional: {
    id: "professional",
    name: "Professional",
    price: 299,
    maxWorkspaces: 50,
    defaultWorkspaces: 3,
    maxUsers: 3,
    maxDomains: 5,
    whiteLabel: false,
    customDomain: false,
    teamRoles: true,
    bulkCampaigns: true,
    contentModeration: false,
    apiAccess: false,
    ssoSaml: false,
  },
  white_label: {
    id: "white_label",
    name: "White Label Agency",
    price: 499,
    maxWorkspaces: 150,
    defaultWorkspaces: 100,
    maxUsers: 6,
    maxDomains: 150,
    whiteLabel: true,
    customDomain: true,
    teamRoles: true,
    bulkCampaigns: true,
    contentModeration: true,
    apiAccess: false,
    ssoSaml: false,
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    maxWorkspaces: Infinity,
    maxUsers: Infinity,
    maxDomains: Infinity,
    whiteLabel: true,
    customDomain: true,
    teamRoles: true,
    bulkCampaigns: true,
    contentModeration: true,
    apiAccess: true,
    ssoSaml: true,
  },
} as const;

export type PlanTierId = keyof typeof PLAN_TIERS;

export function getPlanTier(planId: string) {
  return PLAN_TIERS[planId as PlanTierId] || PLAN_TIERS.solo;
}

export const users = pgTable(
  "users",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    email: varchar("email"),
    firstName: varchar("first_name"),
    lastName: varchar("last_name"),
    profileImageUrl: varchar("profile_image_url"),
    plan: varchar("plan", { length: 50 }).notNull().default("solo"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("users_email_unique").on(t.email),
  ]
);

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
