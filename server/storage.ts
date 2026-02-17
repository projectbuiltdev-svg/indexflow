import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users, venues, venueBlogPosts, venueDomains, contentCampaigns,
  contentAssets, contentAssetUsage, rankTrackerKeywords, rankTrackerResults,
  rankTrackerCredits, gridKeywords, gridScanResults, gridRefreshCredits,
  contactMessages, seoSettings, reservations, resources,
  callLogs, supportTickets, twilioSettings, widgetSettings, widgetChatLogs,
  websiteChangeRequests, adminUsers, adminSettings, paymentSettings,
  aiProviderSettings, roomTypes, rooms, roomBookings, businessHours,
  closures, knowledgeBaseItems, teamMembers,
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
  type CallLog, type InsertCallLog,
  type SupportTicket, type InsertSupportTicket,
  type TwilioSetting, type InsertTwilioSetting,
  type WidgetSetting, type InsertWidgetSetting,
  type WidgetChatLog,
  type WebsiteChangeRequest, type InsertWebsiteChangeRequest,
  type AdminUser, type InsertAdminUser,
  type AdminSetting, type InsertAdminSetting,
  type PaymentSetting, type InsertPaymentSetting,
  type AiProviderSetting, type InsertAiProviderSetting,
  type RoomType, type InsertRoomType,
  type Room, type InsertRoom,
  type RoomBooking, type InsertRoomBooking,
  type BusinessHour, type InsertBusinessHour,
  type Closure, type InsertClosure,
  type KnowledgeBaseItem, type InsertKnowledgeBaseItem,
  type TeamMember, type InsertTeamMember,
} from "@shared/schema";

export interface IStorage {
  getUsers(): Promise<User[]>;
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

  getCallLogs(venueId: string): Promise<CallLog[]>;
  getAllCallLogs(): Promise<CallLog[]>;
  createCallLog(log: InsertCallLog): Promise<CallLog>;

  getSupportTickets(venueId: string): Promise<SupportTicket[]>;
  getAllSupportTickets(): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: string, data: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined>;

  getTwilioSettings(venueId: string): Promise<TwilioSetting | undefined>;
  upsertTwilioSettings(data: InsertTwilioSetting): Promise<TwilioSetting>;

  getWidgetSettings(venueId: string): Promise<WidgetSetting | undefined>;
  upsertWidgetSettings(data: InsertWidgetSetting): Promise<WidgetSetting>;

  getWidgetChatLogs(venueId: string): Promise<WidgetChatLog[]>;

  getWebsiteChangeRequests(venueId: string): Promise<WebsiteChangeRequest[]>;
  getAllWebsiteChangeRequests(): Promise<WebsiteChangeRequest[]>;
  createWebsiteChangeRequest(req: InsertWebsiteChangeRequest): Promise<WebsiteChangeRequest>;
  updateWebsiteChangeRequest(id: string, data: Partial<InsertWebsiteChangeRequest>): Promise<WebsiteChangeRequest | undefined>;

  getAdminUsers(): Promise<AdminUser[]>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, data: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;

  getAdminSettings(): Promise<AdminSetting[]>;

  getPaymentSettings(venueId: string): Promise<PaymentSetting | undefined>;
  getAllPaymentSettings(): Promise<PaymentSetting[]>;
  upsertPaymentSettings(data: InsertPaymentSetting): Promise<PaymentSetting>;

  getAiProviderSettings(venueId: string): Promise<AiProviderSetting[]>;
  upsertAiProviderSettings(data: InsertAiProviderSetting): Promise<AiProviderSetting>;

  getRoomTypes(venueId: string): Promise<RoomType[]>;
  createRoomType(rt: InsertRoomType): Promise<RoomType>;
  updateRoomType(id: string, data: Partial<InsertRoomType>): Promise<RoomType | undefined>;

  getRooms(venueId: string): Promise<Room[]>;
  createRoom(room: InsertRoom): Promise<Room>;

  getRoomBookings(venueId: string): Promise<RoomBooking[]>;
  createRoomBooking(booking: InsertRoomBooking): Promise<RoomBooking>;
  updateRoomBooking(id: string, data: Partial<InsertRoomBooking>): Promise<RoomBooking | undefined>;

  getBusinessHours(venueId: string): Promise<BusinessHour[]>;
  upsertBusinessHours(venueId: string, hours: InsertBusinessHour[]): Promise<BusinessHour[]>;

  getClosures(venueId: string): Promise<Closure[]>;
  createClosure(closure: InsertClosure): Promise<Closure>;
  deleteClosure(id: number): Promise<void>;

  getKnowledgeBaseItems(venueId: string): Promise<KnowledgeBaseItem[]>;

  getTeamMembers(venueId: string): Promise<TeamMember[]>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
}

export class DatabaseStorage implements IStorage {
  async getUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(users.email);
  }

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

  async getCallLogs(venueId: string): Promise<CallLog[]> {
    return db.select().from(callLogs).where(eq(callLogs.venueId, venueId)).orderBy(desc(callLogs.createdAt));
  }

  async getAllCallLogs(): Promise<CallLog[]> {
    return db.select().from(callLogs).orderBy(desc(callLogs.createdAt));
  }

  async createCallLog(log: InsertCallLog): Promise<CallLog> {
    const [result] = await db.insert(callLogs).values(log).returning();
    return result;
  }

  async getSupportTickets(venueId: string): Promise<SupportTicket[]> {
    return db.select().from(supportTickets).where(eq(supportTickets.venueId, venueId)).orderBy(desc(supportTickets.createdAt));
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [result] = await db.insert(supportTickets).values(ticket).returning();
    return result;
  }

  async updateSupportTicket(id: string, data: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined> {
    const [result] = await db.update(supportTickets).set({ ...data, updatedAt: new Date() } as any).where(eq(supportTickets.id, id)).returning();
    return result;
  }

  async getTwilioSettings(venueId: string): Promise<TwilioSetting | undefined> {
    const [result] = await db.select().from(twilioSettings).where(eq(twilioSettings.venueId, venueId));
    return result;
  }

  async upsertTwilioSettings(data: InsertTwilioSetting): Promise<TwilioSetting> {
    const existing = await this.getTwilioSettings(data.venueId);
    if (existing) {
      const [result] = await db.update(twilioSettings).set({ ...data, updatedAt: new Date() } as any).where(eq(twilioSettings.venueId, data.venueId)).returning();
      return result;
    }
    const [result] = await db.insert(twilioSettings).values(data).returning();
    return result;
  }

  async getWidgetSettings(venueId: string): Promise<WidgetSetting | undefined> {
    const [result] = await db.select().from(widgetSettings).where(eq(widgetSettings.venueId, venueId));
    return result;
  }

  async upsertWidgetSettings(data: InsertWidgetSetting): Promise<WidgetSetting> {
    const existing = await this.getWidgetSettings(data.venueId);
    if (existing) {
      const [result] = await db.update(widgetSettings).set({ ...data, updatedAt: new Date() } as any).where(eq(widgetSettings.venueId, data.venueId)).returning();
      return result;
    }
    const [result] = await db.insert(widgetSettings).values(data).returning();
    return result;
  }

  async getWidgetChatLogs(venueId: string): Promise<WidgetChatLog[]> {
    return db.select().from(widgetChatLogs).where(eq(widgetChatLogs.venueId, venueId)).orderBy(desc(widgetChatLogs.createdAt));
  }

  async getWebsiteChangeRequests(venueId: string): Promise<WebsiteChangeRequest[]> {
    return db.select().from(websiteChangeRequests).where(eq(websiteChangeRequests.venueId, venueId)).orderBy(desc(websiteChangeRequests.createdAt));
  }

  async getAllWebsiteChangeRequests(): Promise<WebsiteChangeRequest[]> {
    return db.select().from(websiteChangeRequests).orderBy(desc(websiteChangeRequests.createdAt));
  }

  async createWebsiteChangeRequest(req: InsertWebsiteChangeRequest): Promise<WebsiteChangeRequest> {
    const [result] = await db.insert(websiteChangeRequests).values(req).returning();
    return result;
  }

  async updateWebsiteChangeRequest(id: string, data: Partial<InsertWebsiteChangeRequest>): Promise<WebsiteChangeRequest | undefined> {
    const [result] = await db.update(websiteChangeRequests).set({ ...data, updatedAt: new Date() } as any).where(eq(websiteChangeRequests.id, id)).returning();
    return result;
  }

  async getAdminUsers(): Promise<AdminUser[]> {
    return db.select().from(adminUsers).orderBy(adminUsers.name);
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [result] = await db.insert(adminUsers).values(user).returning();
    return result;
  }

  async updateAdminUser(id: string, data: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    const [result] = await db.update(adminUsers).set({ ...data, updatedAt: new Date() } as any).where(eq(adminUsers.id, id)).returning();
    return result;
  }

  async getAdminSettings(): Promise<AdminSetting[]> {
    return db.select().from(adminSettings);
  }

  async getPaymentSettings(venueId: string): Promise<PaymentSetting | undefined> {
    const [result] = await db.select().from(paymentSettings).where(eq(paymentSettings.venueId, venueId));
    return result;
  }

  async getAllPaymentSettings(): Promise<PaymentSetting[]> {
    return db.select().from(paymentSettings);
  }

  async upsertPaymentSettings(data: InsertPaymentSetting): Promise<PaymentSetting> {
    const existing = await this.getPaymentSettings(data.venueId);
    if (existing) {
      const [result] = await db.update(paymentSettings).set({ ...data, updatedAt: new Date() } as any).where(eq(paymentSettings.venueId, data.venueId)).returning();
      return result;
    }
    const [result] = await db.insert(paymentSettings).values(data).returning();
    return result;
  }

  async getAiProviderSettings(venueId: string): Promise<AiProviderSetting[]> {
    return db.select().from(aiProviderSettings).where(eq(aiProviderSettings.venueId, venueId));
  }

  async upsertAiProviderSettings(data: InsertAiProviderSetting): Promise<AiProviderSetting> {
    const existing = await db.select().from(aiProviderSettings)
      .where(and(eq(aiProviderSettings.venueId, data.venueId), eq(aiProviderSettings.provider, data.provider)));
    if (existing.length > 0) {
      const [result] = await db.update(aiProviderSettings).set({ ...data, updatedAt: new Date() } as any)
        .where(and(eq(aiProviderSettings.venueId, data.venueId), eq(aiProviderSettings.provider, data.provider))).returning();
      return result;
    }
    const [result] = await db.insert(aiProviderSettings).values(data).returning();
    return result;
  }

  async getRoomTypes(venueId: string): Promise<RoomType[]> {
    return db.select().from(roomTypes).where(eq(roomTypes.venueId, venueId)).orderBy(roomTypes.sortOrder);
  }

  async createRoomType(rt: InsertRoomType): Promise<RoomType> {
    const [result] = await db.insert(roomTypes).values(rt).returning();
    return result;
  }

  async updateRoomType(id: string, data: Partial<InsertRoomType>): Promise<RoomType | undefined> {
    const [result] = await db.update(roomTypes).set({ ...data, updatedAt: new Date() } as any).where(eq(roomTypes.id, id)).returning();
    return result;
  }

  async getRooms(venueId: string): Promise<Room[]> {
    return db.select().from(rooms).where(eq(rooms.venueId, venueId)).orderBy(rooms.roomNumber);
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const [result] = await db.insert(rooms).values(room).returning();
    return result;
  }

  async getRoomBookings(venueId: string): Promise<RoomBooking[]> {
    return db.select().from(roomBookings).where(eq(roomBookings.venueId, venueId)).orderBy(desc(roomBookings.createdAt));
  }

  async createRoomBooking(booking: InsertRoomBooking): Promise<RoomBooking> {
    const [result] = await db.insert(roomBookings).values(booking as any).returning();
    return result;
  }

  async updateRoomBooking(id: string, data: Partial<InsertRoomBooking>): Promise<RoomBooking | undefined> {
    const [result] = await db.update(roomBookings).set({ ...data, updatedAt: new Date() } as any).where(eq(roomBookings.id, id)).returning();
    return result;
  }

  async getBusinessHours(venueId: string): Promise<BusinessHour[]> {
    return db.select().from(businessHours).where(eq(businessHours.venueId, venueId)).orderBy(businessHours.dayOfWeek);
  }

  async upsertBusinessHours(venueId: string, hours: InsertBusinessHour[]): Promise<BusinessHour[]> {
    await db.delete(businessHours).where(eq(businessHours.venueId, venueId));
    if (hours.length === 0) return [];
    const results = await db.insert(businessHours).values(hours).returning();
    return results;
  }

  async getClosures(venueId: string): Promise<Closure[]> {
    return db.select().from(closures).where(eq(closures.venueId, venueId)).orderBy(closures.date);
  }

  async createClosure(closure: InsertClosure): Promise<Closure> {
    const [result] = await db.insert(closures).values(closure).returning();
    return result;
  }

  async deleteClosure(id: number): Promise<void> {
    await db.delete(closures).where(eq(closures.id, id));
  }

  async getKnowledgeBaseItems(venueId: string): Promise<KnowledgeBaseItem[]> {
    return db.select().from(knowledgeBaseItems).where(eq(knowledgeBaseItems.venueId, venueId)).orderBy(desc(knowledgeBaseItems.createdAt));
  }

  async getTeamMembers(venueId: string): Promise<TeamMember[]> {
    return db.select().from(teamMembers).where(eq(teamMembers.venueId, venueId));
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [result] = await db.insert(teamMembers).values(member).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
