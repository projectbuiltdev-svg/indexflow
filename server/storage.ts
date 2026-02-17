import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, venues, venueBlogPosts, venueDomains, contentCampaigns,
  contentAssets, contentAssetUsage, rankTrackerKeywords, rankTrackerResults,
  rankTrackerCredits, gridKeywords, gridScanResults, gridRefreshCredits,
  contactMessages, seoSettings, reservations, resources,
  type User, type InsertUser,
  type Venue, type InsertVenue,
  type BlogPost, type InsertBlogPost,
  type Domain, type InsertDomain,
  type Campaign, type InsertCampaign,
  type ContentAsset, type InsertContentAsset,
  type ContentAssetUsage, type InsertContentAssetUsage,
  type RankKeyword, type InsertRankKeyword,
  type RankResult, type InsertRankResult,
  type GridKeyword, type InsertGridKeyword,
  type GridScanResult, type InsertGridScanResult,
  type ContactMessage, type InsertContactMessage,
  type SeoSettings, type InsertSeoSettings,
  type Reservation, type InsertReservation,
  type Resource, type InsertResource,
  type RankTrackerCredits, type GridRefreshCredits,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getVenues(): Promise<Venue[]>;
  getVenue(id: string): Promise<Venue | undefined>;
  getVenuesByOwner(ownerId: string): Promise<Venue[]>;
  createVenue(venue: InsertVenue): Promise<Venue>;
  updateVenue(id: string, data: Partial<InsertVenue>): Promise<Venue | undefined>;

  getBlogPosts(venueId?: string): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<void>;

  getDomains(venueId?: string): Promise<Domain[]>;
  createDomain(domain: InsertDomain): Promise<Domain>;
  updateDomain(id: string, data: Partial<InsertDomain>): Promise<Domain | undefined>;
  deleteDomain(id: string): Promise<void>;

  getCampaigns(venueId: string): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;

  getContentAssets(venueId?: string): Promise<ContentAsset[]>;
  createContentAsset(asset: InsertContentAsset): Promise<ContentAsset>;
  createContentAssetUsage(usage: InsertContentAssetUsage): Promise<ContentAssetUsage>;

  getRankKeywords(venueId: string): Promise<RankKeyword[]>;
  createRankKeyword(kw: InsertRankKeyword): Promise<RankKeyword>;
  deleteRankKeyword(id: number): Promise<void>;
  getRankResults(venueId: string): Promise<RankResult[]>;

  getGridKeywords(venueId: string): Promise<GridKeyword[]>;
  createGridKeyword(kw: InsertGridKeyword): Promise<GridKeyword>;
  deleteGridKeyword(id: number): Promise<void>;
  getGridScanResults(venueId: string, keyword?: string): Promise<GridScanResult[]>;

  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(msg: InsertContactMessage): Promise<ContactMessage>;

  getSeoSettings(venueId: string): Promise<SeoSettings[]>;

  getReservations(venueId: string): Promise<Reservation[]>;
  createReservation(res: InsertReservation): Promise<Reservation>;
  updateReservation(id: string, data: Partial<InsertReservation>): Promise<Reservation | undefined>;

  getResources(venueId: string): Promise<Resource[]>;
  createResource(res: InsertResource): Promise<Resource>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getVenues(): Promise<Venue[]> {
    return db.select().from(venues).orderBy(venues.name);
  }

  async getVenue(id: string): Promise<Venue | undefined> {
    const [v] = await db.select().from(venues).where(eq(venues.id, id));
    return v;
  }

  async getVenuesByOwner(ownerId: string): Promise<Venue[]> {
    return db.select().from(venues).where(eq(venues.ownerId, ownerId)).orderBy(venues.name);
  }

  async createVenue(venue: InsertVenue): Promise<Venue> {
    const [result] = await db.insert(venues).values(venue).returning();
    return result;
  }

  async updateVenue(id: string, data: Partial<InsertVenue>): Promise<Venue | undefined> {
    const [result] = await db.update(venues).set({ ...data, updatedAt: new Date() }).where(eq(venues.id, id)).returning();
    return result;
  }

  async getBlogPosts(venueId?: string): Promise<BlogPost[]> {
    if (venueId) {
      return db.select().from(venueBlogPosts).where(eq(venueBlogPosts.venueId, venueId)).orderBy(desc(venueBlogPosts.createdAt));
    }
    return db.select().from(venueBlogPosts).orderBy(desc(venueBlogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(venueBlogPosts).where(eq(venueBlogPosts.id, id));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [result] = await db.insert(venueBlogPosts).values(post as any).returning();
    return result;
  }

  async updateBlogPost(id: string, data: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [result] = await db.update(venueBlogPosts).set({ ...data, updatedAt: new Date() } as any).where(eq(venueBlogPosts.id, id)).returning();
    return result;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(venueBlogPosts).where(eq(venueBlogPosts.id, id));
  }

  async getDomains(venueId?: string): Promise<Domain[]> {
    if (venueId) return db.select().from(venueDomains).where(eq(venueDomains.venueId, venueId));
    return db.select().from(venueDomains);
  }

  async createDomain(domain: InsertDomain): Promise<Domain> {
    const [result] = await db.insert(venueDomains).values(domain).returning();
    return result;
  }

  async updateDomain(id: string, data: Partial<InsertDomain>): Promise<Domain | undefined> {
    const [result] = await db.update(venueDomains).set(data).where(eq(venueDomains.id, id)).returning();
    return result;
  }

  async deleteDomain(id: string): Promise<void> {
    await db.delete(venueDomains).where(eq(venueDomains.id, id));
  }

  async getCampaigns(venueId: string): Promise<Campaign[]> {
    return db.select().from(contentCampaigns).where(eq(contentCampaigns.venueId, venueId)).orderBy(desc(contentCampaigns.createdAt));
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [result] = await db.insert(contentCampaigns).values(campaign).returning();
    return result;
  }

  async getContentAssets(venueId?: string): Promise<ContentAsset[]> {
    if (venueId) return db.select().from(contentAssets).where(eq(contentAssets.venueId, venueId)).orderBy(desc(contentAssets.createdAt));
    return db.select().from(contentAssets).orderBy(desc(contentAssets.createdAt));
  }

  async createContentAsset(asset: InsertContentAsset): Promise<ContentAsset> {
    const [result] = await db.insert(contentAssets).values(asset).returning();
    return result;
  }

  async createContentAssetUsage(usage: InsertContentAssetUsage): Promise<ContentAssetUsage> {
    const [result] = await db.insert(contentAssetUsage).values(usage).returning();
    return result;
  }

  async getRankKeywords(venueId: string): Promise<RankKeyword[]> {
    return db.select().from(rankTrackerKeywords).where(eq(rankTrackerKeywords.venueId, venueId)).orderBy(rankTrackerKeywords.keyword);
  }

  async createRankKeyword(kw: InsertRankKeyword): Promise<RankKeyword> {
    const [result] = await db.insert(rankTrackerKeywords).values(kw).returning();
    return result;
  }

  async deleteRankKeyword(id: number): Promise<void> {
    await db.delete(rankTrackerKeywords).where(eq(rankTrackerKeywords.id, id));
  }

  async getRankResults(venueId: string): Promise<RankResult[]> {
    return db.select().from(rankTrackerResults).where(eq(rankTrackerResults.venueId, venueId)).orderBy(desc(rankTrackerResults.checkedAt));
  }

  async getGridKeywords(venueId: string): Promise<GridKeyword[]> {
    return db.select().from(gridKeywords).where(eq(gridKeywords.venueId, venueId));
  }

  async createGridKeyword(kw: InsertGridKeyword): Promise<GridKeyword> {
    const [result] = await db.insert(gridKeywords).values(kw).returning();
    return result;
  }

  async deleteGridKeyword(id: number): Promise<void> {
    await db.delete(gridKeywords).where(eq(gridKeywords.id, id));
  }

  async getGridScanResults(venueId: string, keyword?: string): Promise<GridScanResult[]> {
    if (keyword) {
      return db.select().from(gridScanResults)
        .where(and(eq(gridScanResults.venueId, venueId), eq(gridScanResults.keyword, keyword)))
        .orderBy(desc(gridScanResults.scanDate));
    }
    return db.select().from(gridScanResults).where(eq(gridScanResults.venueId, venueId)).orderBy(desc(gridScanResults.scanDate));
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(msg: InsertContactMessage): Promise<ContactMessage> {
    const [result] = await db.insert(contactMessages).values(msg).returning();
    return result;
  }

  async getSeoSettings(venueId: string): Promise<SeoSettings[]> {
    return db.select().from(seoSettings).where(eq(seoSettings.venueId, venueId));
  }

  async getReservations(venueId: string): Promise<Reservation[]> {
    return db.select().from(reservations).where(eq(reservations.venueId, venueId)).orderBy(desc(reservations.createdAt));
  }

  async createReservation(res: InsertReservation): Promise<Reservation> {
    const [result] = await db.insert(reservations).values(res as any).returning();
    return result;
  }

  async updateReservation(id: string, data: Partial<InsertReservation>): Promise<Reservation | undefined> {
    const [result] = await db.update(reservations).set({ ...data, updatedAt: new Date() } as any).where(eq(reservations.id, id)).returning();
    return result;
  }

  async getResources(venueId: string): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.venueId, venueId)).orderBy(resources.sortOrder);
  }

  async createResource(res: InsertResource): Promise<Resource> {
    const [result] = await db.insert(resources).values(res).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
