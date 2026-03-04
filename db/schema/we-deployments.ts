import { pgTable, serial, varchar, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { workspaces } from "../../shared/schema";
import { weProjects } from "./we-projects";

export const weDeploymentTypeEnum = pgEnum("we_deployment_type", ["test", "staging", "live"]);
export const weDeploymentStatusEnum = pgEnum("we_deployment_status", ["pending", "success", "failed"]);

export const weDeployments = pgTable("we_deployments", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => weProjects.id, { onDelete: "cascade" }),
  venueId: varchar("venue_id", { length: 36 })
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  domain: text("domain"),
  deploymentType: weDeploymentTypeEnum("deployment_type").notNull().default("test"),
  htmlSnapshot: text("html_snapshot"),
  status: weDeploymentStatusEnum("status").notNull().default("pending"),
  deployedAt: timestamp("deployed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWeDeploymentSchema = createInsertSchema(weDeployments).omit({
  id: true,
  createdAt: true,
});
export type InsertWeDeployment = z.infer<typeof insertWeDeploymentSchema>;
export type WeDeployment = typeof weDeployments.$inferSelect;
