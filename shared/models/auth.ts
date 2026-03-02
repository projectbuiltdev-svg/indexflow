import { pgTable, varchar, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const PLAN_TIERS = {
  solo: {
    name: "Solo",
    price: 99,
    users: 1,
    workspaces: 1,
    postsPerWorkspacePerMonth: 40,
    pseoCampaigns: 1,
    features: [
      "all_tools",
      "google_indexing",
      "rank_tracker",
      "email_support",
    ],
  },
  pro: {
    name: "Pro",
    price: 199,
    users: 5,
    workspaces: 25,
    postsPerWorkspacePerMonth: 40,
    pseoCampaigns: 1,
    features: [
      "all_tools",
      "google_indexing",
      "rank_tracker",
      "white_label",
      "client_dashboards",
      "reseller_licence",
      "bulk_campaigns",
      "priority_support",
    ],
  },
  agency: {
    name: "Agency",
    price: 349,
    users: 10,
    workspaces: 50,
    postsPerWorkspacePerMonth: 40,
    pseoCampaigns: 1,
    features: [
      "all_tools",
      "google_indexing",
      "rank_tracker",
      "white_label",
      "client_dashboards",
      "reseller_licence",
      "bulk_campaigns",
      "priority_support",
      "advanced_api",
      "onboarding_call",
      "account_manager",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 999,
    users: 20,
    workspaces: Infinity,
    postsPerWorkspacePerMonth: 40,
    pseoCampaigns: 1,
    features: [
      "all_tools",
      "google_indexing",
      "rank_tracker",
      "white_label",
      "client_dashboards",
      "reseller_licence",
      "bulk_campaigns",
      "priority_support",
      "advanced_api",
      "onboarding_call",
      "account_manager",
      "super_admin",
      "sla",
      "custom_contracts",
      "comarketing",
    ],
  },
} as const;

export type PlanTierId = keyof typeof PLAN_TIERS;
export type PlanFeature = (typeof PLAN_TIERS)[PlanTierId]["features"][number];

export function getPlanTier(planId: string) {
  return PLAN_TIERS[planId as PlanTierId] || PLAN_TIERS.solo;
}

export function hasFeature(planId: string, feature: string): boolean {
  const tier = getPlanTier(planId);
  return (tier.features as readonly string[]).includes(feature);
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
