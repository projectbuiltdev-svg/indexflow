import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, workspaces, blogPosts, domains, contentAssets, contentAssetUsages,
  campaigns, rankTrackerKeywords, gridKeywords, gridScanResults, leads, gscData, seoSettings,
  type User, type InsertUser,
  type Workspace, type InsertWorkspace,
  type BlogPost, type InsertBlogPost,
  type Domain, type InsertDomain,
  type ContentAsset, type InsertContentAsset,
  type ContentAssetUsage, type InsertContentAssetUsage,
  type Campaign, type InsertCampaign,
  type RankTrackerKeyword, type InsertRankTrackerKeyword,
  type GridKeyword, type InsertGridKeyword,
  type GridScanResult, type InsertGridScanResult,
  type Lead, type InsertLead,
  type GscData, type InsertGscData,
  type SeoSettings, type InsertSeoSettings,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getWorkspaces(): Promise<Workspace[]>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  createWorkspace(ws: InsertWorkspace): Promise<Workspace>;
  updateWorkspace(id: string, data: Partial<InsertWorkspace>): Promise<Workspace | undefined>;

  getBlogPosts(workspaceId?: string): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostsByWorkspace(workspaceId: string): Promise<BlogPost[]>;
  getBlogPostsByCampaign(workspaceId: string, campaignId: string): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;

  getDomains(workspaceId?: string): Promise<Domain[]>;
  getDomain(id: string): Promise<Domain | undefined>;
  createDomain(domain: InsertDomain): Promise<Domain>;
  updateDomain(id: string, data: Partial<InsertDomain>): Promise<Domain | undefined>;
  deleteDomain(id: string): Promise<void>;

  getContentAssets(): Promise<ContentAsset[]>;
  getContentAsset(id: string): Promise<ContentAsset | undefined>;
  createContentAsset(asset: InsertContentAsset): Promise<ContentAsset>;

  createContentAssetUsage(usage: InsertContentAssetUsage): Promise<ContentAssetUsage>;
  getAssetUsagesByPost(postId: string): Promise<ContentAssetUsage[]>;

  getCampaigns(workspaceId: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, data: Partial<InsertCampaign>): Promise<Campaign | undefined>;

  getRankKeywords(workspaceId?: string): Promise<RankTrackerKeyword[]>;
  getRankKeywordsByWorkspace(workspaceId: string): Promise<RankTrackerKeyword[]>;
  createRankKeyword(kw: InsertRankTrackerKeyword): Promise<RankTrackerKeyword>;
  updateRankKeyword(id: string, data: Partial<InsertRankTrackerKeyword>): Promise<RankTrackerKeyword | undefined>;
  deleteRankKeyword(id: string): Promise<void>;

  getGridKeywords(workspaceId?: string): Promise<GridKeyword[]>;
  getGridKeywordsByWorkspace(workspaceId: string): Promise<GridKeyword[]>;
  createGridKeyword(kw: InsertGridKeyword): Promise<GridKeyword>;
  deleteGridKeyword(id: string): Promise<void>;

  getGridScanResults(gridKeywordId: string): Promise<GridScanResult[]>;
  getGridScanResultsByWorkspace(workspaceId: string): Promise<GridScanResult[]>;
  createGridScanResult(result: InsertGridScanResult): Promise<GridScanResult>;

  getLeads(workspaceId?: string): Promise<Lead[]>;
  getLeadsByWorkspace(workspaceId: string): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined>;

  getGscData(workspaceId?: string): Promise<GscData[]>;
  getGscDataByWorkspace(workspaceId: string): Promise<GscData[]>;
  createGscData(data: InsertGscData): Promise<GscData>;

  getSeoSettings(workspaceId: string): Promise<SeoSettings | undefined>;
  upsertSeoSettings(data: InsertSeoSettings): Promise<SeoSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getWorkspaces(): Promise<Workspace[]> {
    return db.select().from(workspaces).orderBy(workspaces.name);
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, id));
    return ws;
  }

  async createWorkspace(ws: InsertWorkspace): Promise<Workspace> {
    const [result] = await db.insert(workspaces).values(ws).returning();
    return result;
  }

  async updateWorkspace(id: string, data: Partial<InsertWorkspace>): Promise<Workspace | undefined> {
    const [result] = await db.update(workspaces).set({ ...data, updatedAt: new Date() }).where(eq(workspaces.id, id)).returning();
    return result;
  }

  async getBlogPosts(workspaceId?: string): Promise<BlogPost[]> {
    if (workspaceId) return this.getBlogPostsByWorkspace(workspaceId);
    return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostsByWorkspace(workspaceId: string): Promise<BlogPost[]> {
    return db.select().from(blogPosts).where(eq(blogPosts.workspaceId, workspaceId)).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostsByCampaign(workspaceId: string, campaignId: string): Promise<BlogPost[]> {
    return db.select().from(blogPosts)
      .where(and(eq(blogPosts.workspaceId, workspaceId), eq(blogPosts.campaignId, campaignId)))
      .orderBy(desc(blogPosts.createdAt));
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [result] = await db.insert(blogPosts).values(post as any).returning();
    return result;
  }

  async updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [result] = await db.update(blogPosts).set({ ...data, updatedAt: new Date() } as any).where(eq(blogPosts.id, id)).returning();
    return result;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  async getDomains(workspaceId?: string): Promise<Domain[]> {
    if (workspaceId) return db.select().from(domains).where(eq(domains.workspaceId, workspaceId));
    return db.select().from(domains);
  }

  async getDomain(id: string): Promise<Domain | undefined> {
    const [d] = await db.select().from(domains).where(eq(domains.id, id));
    return d;
  }

  async createDomain(domain: InsertDomain): Promise<Domain> {
    const [result] = await db.insert(domains).values(domain).returning();
    return result;
  }

  async updateDomain(id: string, data: Partial<InsertDomain>): Promise<Domain | undefined> {
    const [result] = await db.update(domains).set(data).where(eq(domains.id, id)).returning();
    return result;
  }

  async deleteDomain(id: string): Promise<void> {
    await db.delete(domains).where(eq(domains.id, id));
  }

  async getContentAssets(): Promise<ContentAsset[]> {
    return db.select().from(contentAssets).orderBy(desc(contentAssets.createdAt));
  }

  async getContentAsset(id: string): Promise<ContentAsset | undefined> {
    const [a] = await db.select().from(contentAssets).where(eq(contentAssets.id, id));
    return a;
  }

  async createContentAsset(asset: InsertContentAsset): Promise<ContentAsset> {
    const [result] = await db.insert(contentAssets).values(asset).returning();
    return result;
  }

  async createContentAssetUsage(usage: InsertContentAssetUsage): Promise<ContentAssetUsage> {
    const [result] = await db.insert(contentAssetUsages).values(usage).returning();
    return result;
  }

  async getAssetUsagesByPost(postId: string): Promise<ContentAssetUsage[]> {
    return db.select().from(contentAssetUsages).where(eq(contentAssetUsages.postId, postId));
  }

  async getCampaigns(workspaceId: string): Promise<Campaign[]> {
    return db.select().from(campaigns).where(eq(campaigns.workspaceId, workspaceId)).orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [c] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return c;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [result] = await db.insert(campaigns).values(campaign).returning();
    return result;
  }

  async updateCampaign(id: string, data: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const [result] = await db.update(campaigns).set({ ...data, updatedAt: new Date() }).where(eq(campaigns.id, id)).returning();
    return result;
  }

  async getRankKeywords(workspaceId?: string): Promise<RankTrackerKeyword[]> {
    if (workspaceId) return this.getRankKeywordsByWorkspace(workspaceId);
    return db.select().from(rankTrackerKeywords).orderBy(rankTrackerKeywords.keyword);
  }

  async getRankKeywordsByWorkspace(workspaceId: string): Promise<RankTrackerKeyword[]> {
    return db.select().from(rankTrackerKeywords).where(eq(rankTrackerKeywords.workspaceId, workspaceId));
  }

  async createRankKeyword(kw: InsertRankTrackerKeyword): Promise<RankTrackerKeyword> {
    const [result] = await db.insert(rankTrackerKeywords).values(kw).returning();
    return result;
  }

  async updateRankKeyword(id: string, data: Partial<InsertRankTrackerKeyword>): Promise<RankTrackerKeyword | undefined> {
    const [result] = await db.update(rankTrackerKeywords).set(data).where(eq(rankTrackerKeywords.id, id)).returning();
    return result;
  }

  async deleteRankKeyword(id: string): Promise<void> {
    await db.delete(rankTrackerKeywords).where(eq(rankTrackerKeywords.id, id));
  }

  async getGridKeywords(workspaceId?: string): Promise<GridKeyword[]> {
    if (workspaceId) return this.getGridKeywordsByWorkspace(workspaceId);
    return db.select().from(gridKeywords);
  }

  async getGridKeywordsByWorkspace(workspaceId: string): Promise<GridKeyword[]> {
    return db.select().from(gridKeywords).where(eq(gridKeywords.workspaceId, workspaceId));
  }

  async createGridKeyword(kw: InsertGridKeyword): Promise<GridKeyword> {
    const [result] = await db.insert(gridKeywords).values(kw).returning();
    return result;
  }

  async deleteGridKeyword(id: string): Promise<void> {
    await db.delete(gridKeywords).where(eq(gridKeywords.id, id));
  }

  async getGridScanResults(gridKeywordId: string): Promise<GridScanResult[]> {
    return db.select().from(gridScanResults).where(eq(gridScanResults.gridKeywordId, gridKeywordId)).orderBy(desc(gridScanResults.scannedAt));
  }

  async getGridScanResultsByWorkspace(workspaceId: string): Promise<GridScanResult[]> {
    return db.select().from(gridScanResults).where(eq(gridScanResults.workspaceId, workspaceId)).orderBy(desc(gridScanResults.scannedAt));
  }

  async createGridScanResult(result: InsertGridScanResult): Promise<GridScanResult> {
    const [r] = await db.insert(gridScanResults).values(result).returning();
    return r;
  }

  async getLeads(workspaceId?: string): Promise<Lead[]> {
    if (workspaceId) return this.getLeadsByWorkspace(workspaceId);
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadsByWorkspace(workspaceId: string): Promise<Lead[]> {
    return db.select().from(leads).where(eq(leads.workspaceId, workspaceId)).orderBy(desc(leads.createdAt));
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [result] = await db.insert(leads).values(lead).returning();
    return result;
  }

  async updateLead(id: string, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const [result] = await db.update(leads).set(data).where(eq(leads.id, id)).returning();
    return result;
  }

  async getGscData(workspaceId?: string): Promise<GscData[]> {
    if (workspaceId) return this.getGscDataByWorkspace(workspaceId);
    return db.select().from(gscData);
  }

  async getGscDataByWorkspace(workspaceId: string): Promise<GscData[]> {
    return db.select().from(gscData).where(eq(gscData.workspaceId, workspaceId));
  }

  async createGscData(data: InsertGscData): Promise<GscData> {
    const [result] = await db.insert(gscData).values(data).returning();
    return result;
  }

  async getSeoSettings(workspaceId: string): Promise<SeoSettings | undefined> {
    const [s] = await db.select().from(seoSettings).where(eq(seoSettings.workspaceId, workspaceId));
    return s;
  }

  async upsertSeoSettings(data: InsertSeoSettings): Promise<SeoSettings> {
    const existing = await this.getSeoSettings(data.workspaceId);
    if (existing) {
      const [result] = await db.update(seoSettings).set({ ...data, updatedAt: new Date() }).where(eq(seoSettings.id, existing.id)).returning();
      return result;
    }
    const [result] = await db.insert(seoSettings).values(data).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
