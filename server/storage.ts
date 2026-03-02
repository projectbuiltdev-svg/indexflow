import { 
  type User, 
  type ContactMessage,
  type InsertContactMessage,
  type Workspace,
  type InsertWorkspace,
  type Reservation,
  type InsertReservation,
  type BusinessHours,
  type InsertBusinessHours,
  type Closure,
  type InsertClosure,
  type Resource,
  type InsertResource,
  type TeamMember,
  type InsertTeamMember,
  type KnowledgeBaseItem,
  type InsertKnowledgeBaseItem,
  type CallLog,
  type InsertCallLog,
  type WidgetSettings,
  type InsertWidgetSettings,
  type TwilioSettings,
  type InsertTwilioSettings,
  type PaymentSettings,
  type InsertPaymentSettings,
  type AiProviderSettings,
  type InsertAiProviderSettings,
  type AdminSettings,
  type RoomType,
  type InsertRoomType,
  type Room,
  type InsertRoom,
  type RoomBooking,
  type InsertRoomBooking,
  type SupportTicket,
  type InsertSupportTicket,
  type WidgetChatLog,
  type InsertWidgetChatLog,
  type WebsiteChangeRequest,
  type InsertWebsiteChangeRequest,
  type SeoSettings,
  type InsertSeoSettings,
  type RankTrackerKeyword,
  type InsertRankTrackerKeyword,
  type RankTrackerResult,
  type InsertRankTrackerResult,
  type GridKeyword,
  type InsertGridKeyword,
  type GridRefreshCredits,
  type GridRefreshHistory,
  type RankTrackerCredits,
  type RankTrackerHistory,
  type GridScanResult,
  type InsertGridScanResult,
  type WorkspaceDomain,
  type InsertWorkspaceDomain,
  type WorkspaceBlogPost,
  type InsertWorkspaceBlogPost,
  type ContentAsset,
  type InsertContentAsset,
  type ContentAssetUsage,
  type InsertContentAssetUsage,
  type ContentCampaign,
  type InsertContentCampaign,
  type CrmContact,
  type InsertCrmContact,
  type CrmPipelineStage,
  type InsertCrmPipelineStage,
  type CrmDeal,
  type InsertCrmDeal,
  type Invoice,
  type InsertInvoice,
  type InvoiceLineItem,
  type InsertInvoiceLineItem,
  type ContentReport,
  type InsertContentReport,
  type WorkspaceSiteProfile,
  type InsertWorkspaceSiteProfile,
  type WorkspaceSitePage,
  type InsertWorkspaceSitePage,
  type PostKeywordIndex,
  type InsertPostKeywordIndex,
  type PostValidationResult,
  type InsertPostValidationResult,
  type CmsApiKey,
  type InsertCmsApiKey,
  type CmsSyncLog,
  type InsertCmsSyncLog,
  contactMessages,
  workspaces,
  reservations,
  businessHours,
  closures,
  resources,
  teamMembers,
  knowledgeBaseItems,
  callLogs,
  widgetSettings,
  twilioSettings,
  paymentSettings,
  aiProviderSettings,
  adminSettings,
  users,
  roomTypes,
  rooms,
  roomBookings,
  supportTickets,
  widgetChatLogs,
  websiteChangeRequests,
  seoSettings,
  rankTrackerKeywords,
  rankTrackerResults,
  gridKeywords,
  gridRefreshCredits,
  gridRefreshHistory,
  rankTrackerCredits,
  rankTrackerHistory,
  gridScanResults,
  workspaceDomains,
  workspaceBlogPosts,
  contentAssets,
  contentAssetUsage,
  contentCampaigns,
  crmContacts,
  crmPipelineStages,
  crmDeals,
  invoices,
  invoiceLineItems,
  contentReports,
  workspaceSiteProfiles,
  workspaceSitePages,
  postKeywordIndex,
  postValidationResults,
  cmsApiKeys,
  cmsSyncLogs,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, ne, desc, asc, count, max, lte, sql, inArray, ilike, or } from "drizzle-orm";
import { encryptField, decryptField } from "./crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getWorkspaces(): Promise<Workspace[]>;
  getWorkspacesByOwner(ownerId: string): Promise<Workspace[]>;
  countWorkspacesByOwner(ownerId: string): Promise<number>;
  getWorkspace(id: string): Promise<Workspace | undefined>;
  createWorkspace(data: InsertWorkspace): Promise<Workspace>;
  updateWorkspace(id: string, data: Partial<InsertWorkspace>): Promise<Workspace | undefined>;
  deleteWorkspace(id: string): Promise<boolean>;
  getReservations(workspaceId: string): Promise<Reservation[]>;
  getReservationsByDate(workspaceId: string, date: string): Promise<Reservation[]>;
  getReservation(id: string): Promise<Reservation | undefined>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: string, reservation: Partial<InsertReservation>): Promise<Reservation | undefined>;
  deleteReservation(id: string): Promise<boolean>;
  getBusinessHours(workspaceId: string): Promise<BusinessHours[]>;
  setBusinessHours(workspaceId: string, hours: InsertBusinessHours[]): Promise<BusinessHours[]>;
  getClosures(workspaceId: string): Promise<Closure[]>;
  getClosure(id: number): Promise<Closure | undefined>;
  createClosure(closure: InsertClosure): Promise<Closure>;
  deleteClosure(id: number): Promise<boolean>;
  getResources(workspaceId: string): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: string): Promise<boolean>;
  getTeamMembers(workspaceId: string): Promise<TeamMember[]>;
  getTeamMember(id: number): Promise<TeamMember | undefined>;
  getTeamMemberByUserAndWorkspace(userId: string, workspaceId: string): Promise<TeamMember | undefined>;
  countTeamMembersByOwner(ownerId: string): Promise<number>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  updateTeamMember(id: number, member: Partial<InsertTeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: number): Promise<boolean>;
  getKnowledgeBaseItems(workspaceId: string): Promise<KnowledgeBaseItem[]>;
  getKnowledgeBaseItem(id: string): Promise<KnowledgeBaseItem | undefined>;
  createKnowledgeBaseItem(item: InsertKnowledgeBaseItem): Promise<KnowledgeBaseItem>;
  updateKnowledgeBaseItem(id: string, item: Partial<InsertKnowledgeBaseItem>): Promise<KnowledgeBaseItem | undefined>;
  deleteKnowledgeBaseItem(id: string): Promise<boolean>;
  getCallLogs(workspaceId: string): Promise<CallLog[]>;
  getCallLog(id: string): Promise<CallLog | undefined>;
  createCallLog(log: InsertCallLog): Promise<CallLog>;
  updateCallLogByTwilioSid(twilioSid: string, updates: Partial<InsertCallLog>): Promise<CallLog | undefined>;
  getWidgetSettings(workspaceId: string): Promise<WidgetSettings | undefined>;
  upsertWidgetSettings(settings: InsertWidgetSettings): Promise<WidgetSettings>;
  getTwilioSettings(workspaceId: string): Promise<TwilioSettings | undefined>;
  upsertTwilioSettings(settings: InsertTwilioSettings): Promise<TwilioSettings>;
  getPaymentSettings(workspaceId: string): Promise<PaymentSettings | undefined>;
  upsertPaymentSettings(settings: InsertPaymentSettings): Promise<PaymentSettings>;
  getAiProviderSettings(workspaceId: string): Promise<AiProviderSettings[]>;
  upsertAiProviderSettings(settings: InsertAiProviderSettings): Promise<AiProviderSettings>;
  getAdminSetting(key: string): Promise<AdminSettings | undefined>;
  setAdminSetting(key: string, value: any): Promise<AdminSettings>;
  // Room Types
  getRoomTypes(workspaceId: string): Promise<RoomType[]>;
  getRoomType(id: string): Promise<RoomType | undefined>;
  createRoomType(roomType: InsertRoomType): Promise<RoomType>;
  updateRoomType(id: string, roomType: Partial<InsertRoomType>): Promise<RoomType | undefined>;
  deleteRoomType(id: string): Promise<boolean>;
  // Rooms
  getRooms(workspaceId: string): Promise<Room[]>;
  getRoomsByType(roomTypeId: string): Promise<Room[]>;
  getRoom(id: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: string, room: Partial<InsertRoom>): Promise<Room | undefined>;
  deleteRoom(id: string): Promise<boolean>;
  // Room Bookings
  getRoomBookings(workspaceId: string): Promise<RoomBooking[]>;
  getRoomBookingsByDateRange(workspaceId: string, checkIn: string, checkOut: string): Promise<RoomBooking[]>;
  getRoomBooking(id: string): Promise<RoomBooking | undefined>;
  createRoomBooking(booking: InsertRoomBooking): Promise<RoomBooking>;
  updateRoomBooking(id: string, booking: Partial<InsertRoomBooking>): Promise<RoomBooking | undefined>;
  deleteRoomBooking(id: string): Promise<boolean>;

  getSupportTicketsByWorkspace(workspaceId: string): Promise<SupportTicket[]>;
  getSupportTicketsByUser(userId: string): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  getAllSupportTickets(): Promise<SupportTicket[]>;
  getSupportTicket(id: string): Promise<SupportTicket | undefined>;
  updateSupportTicket(id: string, updates: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined>;
  // Widget Chat Logs
  getWidgetChatLogs(workspaceId: string): Promise<WidgetChatLog[]>;
  createWidgetChatLog(log: InsertWidgetChatLog): Promise<WidgetChatLog>;
  updateWidgetChatLogMessageCount(sessionId: string): Promise<WidgetChatLog | undefined>;
  // Website Change Requests
  getWebsiteChangeRequests(workspaceId: string): Promise<WebsiteChangeRequest[]>;
  createWebsiteChangeRequest(request: InsertWebsiteChangeRequest): Promise<WebsiteChangeRequest>;
  updateWebsiteChangeRequest(id: string, updates: Partial<InsertWebsiteChangeRequest>): Promise<WebsiteChangeRequest | undefined>;
  // SEO Settings
  getSeoSettings(workspaceId: string): Promise<SeoSettings[]>;
  upsertSeoSettings(settings: InsertSeoSettings): Promise<SeoSettings>;
  // Rank Tracker
  getRankTrackerKeywords(workspaceId: string): Promise<RankTrackerKeyword[]>;
  addRankTrackerKeywords(keywords: InsertRankTrackerKeyword[]): Promise<RankTrackerKeyword[]>;
  deleteRankTrackerKeyword(id: number): Promise<void>;
  deleteAllRankTrackerKeywords(workspaceId: string): Promise<void>;
  getRankTrackerResults(workspaceId: string, page?: number, limit?: number): Promise<{ results: RankTrackerResult[]; total: number }>;
  getLatestRankTrackerResults(workspaceId: string): Promise<RankTrackerResult[]>;
  saveRankTrackerResults(results: InsertRankTrackerResult[]): Promise<RankTrackerResult[]>;
  getLastRankCheckDate(workspaceId: string): Promise<Date | null>;
  // Grid Keywords
  getGridKeywords(workspaceId: string): Promise<GridKeyword[]>;
  addGridKeywords(keywords: InsertGridKeyword[]): Promise<GridKeyword[]>;
  deleteGridKeyword(id: number): Promise<void>;
  deleteAllGridKeywords(workspaceId: string): Promise<void>;
  // Grid Refresh Credits
  getGridRefreshCredits(workspaceId: string): Promise<GridRefreshCredits>;
  addGridRefreshCredits(workspaceId: string, amount: number, description: string): Promise<GridRefreshCredits>;
  useGridRefreshCredit(workspaceId: string): Promise<{ success: boolean; balance: number }>;
  getGridRefreshHistory(workspaceId: string): Promise<GridRefreshHistory[]>;
  // Rank Tracker Credits
  getRankTrackerCredits(workspaceId: string): Promise<RankTrackerCredits>;
  addRankTrackerCredits(workspaceId: string, amount: number, description: string): Promise<RankTrackerCredits>;
  useRankTrackerCredit(workspaceId: string): Promise<{ success: boolean; balance: number }>;
  getRankTrackerHistory(workspaceId: string): Promise<RankTrackerHistory[]>;
  saveGridScanResults(results: InsertGridScanResult[]): Promise<GridScanResult[]>;
  getLatestGridScanResults(workspaceId: string, keyword: string): Promise<GridScanResult[]>;
  getGridScanKeywords(workspaceId: string): Promise<string[]>;
  // Workspace Domains
  getWorkspaceDomains(workspaceId: string): Promise<WorkspaceDomain[]>;
  getWorkspaceDomain(id: string): Promise<WorkspaceDomain | undefined>;
  getWorkspaceDomainByDomain(domain: string): Promise<WorkspaceDomain | undefined>;
  createWorkspaceDomain(d: InsertWorkspaceDomain): Promise<WorkspaceDomain>;
  updateWorkspaceDomain(id: string, data: Partial<Pick<WorkspaceDomain, "domain" | "blogTemplate" | "isPrimary" | "accentColor" | "accentForeground">>): Promise<WorkspaceDomain | undefined>;
  deleteWorkspaceDomain(id: string): Promise<boolean>;
  // Workspace Blog Posts
  countBlogPostsThisMonth(workspaceId: string): Promise<number>;
  getWorkspaceBlogPosts(workspaceId: string, status?: string): Promise<WorkspaceBlogPost[]>;
  getWorkspaceBlogPost(id: string): Promise<WorkspaceBlogPost | undefined>;
  getWorkspaceBlogPostBySlug(workspaceId: string, slug: string): Promise<WorkspaceBlogPost | undefined>;
  getPublishedPostsByWorkspace(workspaceId: string): Promise<WorkspaceBlogPost[]>;
  getScheduledPostsDue(): Promise<WorkspaceBlogPost[]>;
  createWorkspaceBlogPost(post: InsertWorkspaceBlogPost): Promise<WorkspaceBlogPost>;
  bulkCreateWorkspaceBlogPosts(posts: InsertWorkspaceBlogPost[]): Promise<WorkspaceBlogPost[]>;
  getWorkspaceBlogPostsByCampaign(workspaceId: string, campaignId: string): Promise<WorkspaceBlogPost[]>;
  getWorkspaceCampaigns(workspaceId: string): Promise<{ campaignId: string; name: string; status: string; postCount: number; createdAt: Date; statuses: Record<string, number> }[]>;
  createContentCampaign(data: InsertContentCampaign): Promise<ContentCampaign>;
  getContentCampaign(id: string): Promise<ContentCampaign | undefined>;
  updateContentCampaign(id: string, data: Partial<ContentCampaign>): Promise<ContentCampaign | undefined>;
  updateWorkspaceBlogPost(id: string, post: Partial<WorkspaceBlogPost>): Promise<WorkspaceBlogPost | undefined>;
  deleteWorkspaceBlogPost(id: string): Promise<boolean>;
  // Content Assets
  getCmsApiKeys(workspaceId: string): Promise<CmsApiKey[]>;
  createCmsApiKey(data: InsertCmsApiKey): Promise<CmsApiKey>;
  deleteCmsApiKey(id: string): Promise<boolean>;
  getCmsSyncLogs(workspaceId: string): Promise<CmsSyncLog[]>;
  getContentAssets(postId: string): Promise<ContentAsset[]>;
  searchContentAssets(workspaceId: string, query?: string): Promise<ContentAsset[]>;
  createContentAsset(asset: InsertContentAsset): Promise<ContentAsset>;
  createContentAssetUsage(usage: InsertContentAssetUsage): Promise<ContentAssetUsage>;
  getContentAssetUsage(postId: string): Promise<ContentAssetUsage[]>;
  getCrmContacts(workspaceId?: string): Promise<CrmContact[]>;
  getCrmContact(id: number): Promise<CrmContact | undefined>;
  createCrmContact(data: InsertCrmContact): Promise<CrmContact>;
  updateCrmContact(id: number, data: Partial<InsertCrmContact>): Promise<CrmContact | undefined>;
  deleteCrmContact(id: number): Promise<boolean>;
  getCrmPipelineStages(workspaceId?: string): Promise<CrmPipelineStage[]>;
  createCrmPipelineStage(data: InsertCrmPipelineStage): Promise<CrmPipelineStage>;
  updateCrmPipelineStage(id: number, data: Partial<InsertCrmPipelineStage>): Promise<CrmPipelineStage | undefined>;
  deleteCrmPipelineStage(id: number): Promise<boolean>;
  getCrmDeals(workspaceId?: string): Promise<CrmDeal[]>;
  getCrmDeal(id: number): Promise<CrmDeal | undefined>;
  createCrmDeal(data: InsertCrmDeal): Promise<CrmDeal>;
  updateCrmDeal(id: number, data: Partial<InsertCrmDeal>): Promise<CrmDeal | undefined>;
  deleteCrmDeal(id: number): Promise<boolean>;
  getInvoices(workspaceId?: string): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(data: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, data: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;
  getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]>;
  createInvoiceLineItem(data: InsertInvoiceLineItem): Promise<InvoiceLineItem>;
  updateInvoiceLineItem(id: number, data: Partial<InsertInvoiceLineItem>): Promise<InvoiceLineItem | undefined>;
  deleteInvoiceLineItem(id: number): Promise<boolean>;
  deleteInvoiceLineItemsByInvoice(invoiceId: number): Promise<void>;
  getContentReports(workspaceId?: string): Promise<ContentReport[]>;
  getContentReport(id: number): Promise<ContentReport | undefined>;
  createContentReport(data: InsertContentReport): Promise<ContentReport>;
  updateContentReport(id: number, data: Partial<InsertContentReport>): Promise<ContentReport | undefined>;
  deleteContentReport(id: number): Promise<boolean>;
  getSiteProfile(workspaceId: string): Promise<WorkspaceSiteProfile | undefined>;
  upsertSiteProfile(data: InsertWorkspaceSiteProfile): Promise<WorkspaceSiteProfile>;
  getSitePages(workspaceId: string): Promise<WorkspaceSitePage[]>;
  getSitePage(id: number): Promise<WorkspaceSitePage | undefined>;
  createSitePage(data: InsertWorkspaceSitePage): Promise<WorkspaceSitePage>;
  updateSitePage(id: number, data: Partial<InsertWorkspaceSitePage>): Promise<WorkspaceSitePage | undefined>;
  deleteSitePage(id: number): Promise<boolean>;
  getPostKeywordIndex(workspaceId: string): Promise<PostKeywordIndex[]>;
  getPostKeywordIndexByPost(postId: string): Promise<PostKeywordIndex[]>;
  getPostKeywordIndexByKeyword(workspaceId: string, keyword: string): Promise<PostKeywordIndex[]>;
  upsertPostKeywordIndex(data: InsertPostKeywordIndex): Promise<PostKeywordIndex>;
  bulkUpsertPostKeywordIndex(items: InsertPostKeywordIndex[]): Promise<PostKeywordIndex[]>;
  deletePostKeywordIndexByPost(postId: string): Promise<void>;
  getPostValidationResults(postId: string): Promise<PostValidationResult[]>;
  getPostValidationResultsByWorkspace(workspaceId: string): Promise<PostValidationResult[]>;
  createPostValidationResult(data: InsertPostValidationResult): Promise<PostValidationResult>;
  bulkCreatePostValidationResults(items: InsertPostValidationResult[]): Promise<PostValidationResult[]>;
  deletePostValidationResultsByPost(postId: string): Promise<void>;
  updatePostValidationResult(id: number, data: Partial<InsertPostValidationResult>): Promise<PostValidationResult | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private contactMessages: Map<string, ContactMessage> = new Map();
  private workspaces: Map<string, Workspace> = new Map();
  private reservations: Map<string, Reservation> = new Map();
  private businessHoursMap: Map<string, BusinessHours[]> = new Map();
  private closures: Map<number, Closure> = new Map();
  private resources: Map<string, Resource> = new Map();
  private teamMembers: Map<number, TeamMember> = new Map();
  private knowledgeBaseItems: Map<string, KnowledgeBaseItem> = new Map();
  private callLogs: Map<string, CallLog> = new Map();
  private widgetSettingsMap: Map<string, WidgetSettings> = new Map();
  private twilioSettingsMap: Map<string, TwilioSettings> = new Map();
  private paymentSettingsMap: Map<string, PaymentSettings> = new Map();
  private aiProviderSettingsMap: Map<string, AiProviderSettings> = new Map();
  private adminSettingsMap: Map<string, AdminSettings> = new Map();
  private roomTypesMap: Map<string, RoomType> = new Map();
  private roomsMap: Map<string, Room> = new Map();
  private roomBookingsMap: Map<string, RoomBooking> = new Map();
  private supportTicketsMap: Map<string, SupportTicket> = new Map();
  private widgetChatLogsMap: Map<string, WidgetChatLog> = new Map();
  private websiteChangeRequestsMap: Map<string, WebsiteChangeRequest> = new Map();
  private seoSettingsMap: Map<string, SeoSettings> = new Map();
  private rankTrackerKeywordsMap: Map<number, RankTrackerKeyword> = new Map();
  private rankTrackerResultsMap: Map<number, RankTrackerResult> = new Map();
  private rankKeywordCounter = 1;
  private gridKeywordsMap: Map<number, GridKeyword> = new Map();
  private gridKeywordCounter = 1;
  private rankResultCounter = 1;
  private closureIdCounter = 1;
  private teamMemberIdCounter = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createContactMessage(data: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const msg: ContactMessage = {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
      venueType: data.venueType ?? null,
      inquiryType: data.inquiryType ?? null,
      message: data.message,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, msg);
    return msg;
  }

  async getWorkspaces(): Promise<Workspace[]> {
    return Array.from(this.workspaces.values());
  }

  async getWorkspacesByOwner(ownerId: string): Promise<Workspace[]> {
    return Array.from(this.workspaces.values()).filter((v) => v.ownerId === ownerId);
  }

  async countWorkspacesByOwner(ownerId: string): Promise<number> {
    return Array.from(this.workspaces.values()).filter((v) => v.ownerId === ownerId).length;
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    return this.workspaces.get(id);
  }

  async createWorkspace(data: InsertWorkspace): Promise<Workspace> {
    const id = randomUUID();
    const ws: Workspace = {
      id,
      ownerId: data.ownerId,
      name: data.name,
      type: data.type,
      address: data.address ?? null,
      city: data.city ?? null,
      state: data.state ?? null,
      postalCode: data.postalCode ?? null,
      country: data.country ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      website: data.website ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      timezone: data.timezone ?? "America/New_York",
      plan: data.plan ?? "solo",
      status: data.status ?? "active",
      shardId: (data as any).shardId ?? 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.workspaces.set(id, ws);
    return ws;
  }

  async updateWorkspace(id: string, update: Partial<InsertWorkspace>): Promise<Workspace | undefined> {
    const ws = this.workspaces.get(id);
    if (!ws) return undefined;
    const updated = { ...ws, ...update, updatedAt: new Date() };
    this.workspaces.set(id, updated);
    return updated;
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    return this.workspaces.delete(id);
  }

  async getReservations(workspaceId: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter((r) => r.workspaceId === workspaceId);
  }

  async getReservationsByDate(workspaceId: string, date: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      (r) => r.workspaceId === workspaceId && r.date === date
    );
  }

  async getReservation(id: string): Promise<Reservation | undefined> {
    return this.reservations.get(id);
  }

  async createReservation(data: InsertReservation): Promise<Reservation> {
    const id = randomUUID();
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const res: Reservation = {
      id,
      workspaceId: data.workspaceId,
      guestName: data.guestName,
      guestEmail: data.guestEmail ?? null,
      guestPhone: data.guestPhone ?? null,
      partySize: data.partySize,
      date: data.date,
      time: data.time,
      duration: data.duration ?? 90,
      status: data.status ?? "confirmed",
      source: data.source ?? "widget",
      notes: data.notes ?? null,
      specialRequests: data.specialRequests ?? null,
      confirmationCode,
      isPrepaid: data.isPrepaid ?? false,
      paymentAmount: data.paymentAmount ?? null,
      paymentStatus: data.paymentStatus ?? "none",
      resourceId: data.resourceId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.reservations.set(id, res);
    return res;
  }

  async updateReservation(id: string, update: Partial<InsertReservation>): Promise<Reservation | undefined> {
    const res = this.reservations.get(id);
    if (!res) return undefined;
    const updated = { ...res, ...update, updatedAt: new Date() };
    this.reservations.set(id, updated);
    return updated;
  }

  async deleteReservation(id: string): Promise<boolean> {
    return this.reservations.delete(id);
  }

  async getBusinessHours(workspaceId: string): Promise<BusinessHours[]> {
    return this.businessHoursMap.get(workspaceId) || [];
  }

  async setBusinessHours(workspaceId: string, hours: InsertBusinessHours[]): Promise<BusinessHours[]> {
    const result: BusinessHours[] = hours.map((h, i) => ({
      id: i + 1,
      workspaceId: h.workspaceId,
      dayOfWeek: h.dayOfWeek,
      openTime: h.openTime ?? null,
      closeTime: h.closeTime ?? null,
      isClosed: h.isClosed ?? false,
    }));
    this.businessHoursMap.set(workspaceId, result);
    return result;
  }

  async getClosures(workspaceId: string): Promise<Closure[]> {
    return Array.from(this.closures.values()).filter((c) => c.workspaceId === workspaceId);
  }

  async getClosure(id: number): Promise<Closure | undefined> {
    return this.closures.get(id);
  }

  async createClosure(data: InsertClosure): Promise<Closure> {
    const id = this.closureIdCounter++;
    const closure: Closure = {
      id,
      workspaceId: data.workspaceId,
      date: data.date,
      reason: data.reason ?? null,
      createdAt: new Date(),
    };
    this.closures.set(id, closure);
    return closure;
  }

  async deleteClosure(id: number): Promise<boolean> {
    return this.closures.delete(id);
  }

  async getResources(workspaceId: string): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter((r) => r.workspaceId === workspaceId)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getResource(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(data: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = {
      id,
      workspaceId: data.workspaceId,
      name: data.name,
      type: data.type ?? "table",
      capacity: data.capacity ?? 4,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
    };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: string, update: Partial<InsertResource>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;
    const updated = { ...resource, ...update };
    this.resources.set(id, updated);
    return updated;
  }

  async deleteResource(id: string): Promise<boolean> {
    return this.resources.delete(id);
  }

  async getTeamMembers(workspaceId: string): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter((t) => t.workspaceId === workspaceId);
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    return this.teamMembers.get(id);
  }

  async getTeamMemberByUserAndWorkspace(userId: string, workspaceId: string): Promise<TeamMember | undefined> {
    return Array.from(this.teamMembers.values()).find(
      (t) => t.userId === userId && t.workspaceId === workspaceId && t.status === "accepted"
    );
  }

  async countTeamMembersByOwner(ownerId: string): Promise<number> {
    const ownerWorkspaces = Array.from(this.workspaces.values()).filter((v) => v.ownerId === ownerId);
    const workspaceIds = new Set(ownerWorkspaces.map((w) => w.id));
    const members = Array.from(this.teamMembers.values()).filter((t) => workspaceIds.has(t.workspaceId));
    const uniqueUserIds = new Set(members.map((m) => m.userId || m.email));
    return uniqueUserIds.size + 1;
  }

  async createTeamMember(data: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberIdCounter++;
    const member: TeamMember = {
      id,
      workspaceId: data.workspaceId,
      userId: data.userId ?? null,
      email: data.email,
      role: data.role ?? "staff",
      status: data.status ?? "pending",
      invitedAt: new Date(),
      acceptedAt: null,
    };
    this.teamMembers.set(id, member);
    return member;
  }

  async updateTeamMember(id: number, update: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const member = this.teamMembers.get(id);
    if (!member) return undefined;
    const updated = { ...member, ...update };
    this.teamMembers.set(id, updated);
    return updated;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    return this.teamMembers.delete(id);
  }

  async getKnowledgeBaseItems(workspaceId: string): Promise<KnowledgeBaseItem[]> {
    return Array.from(this.knowledgeBaseItems.values()).filter((k) => k.workspaceId === workspaceId);
  }

  async getKnowledgeBaseItem(id: string): Promise<KnowledgeBaseItem | undefined> {
    return this.knowledgeBaseItems.get(id);
  }

  async createKnowledgeBaseItem(data: InsertKnowledgeBaseItem): Promise<KnowledgeBaseItem> {
    const id = randomUUID();
    const item: KnowledgeBaseItem = {
      id,
      workspaceId: data.workspaceId,
      type: data.type,
      category: data.category ?? null,
      title: data.title ?? null,
      content: data.content ?? null,
      sourceUrl: data.sourceUrl ?? null,
      fileName: data.fileName ?? null,
      fileType: data.fileType ?? null,
      status: data.status ?? "pending",
      createdAt: new Date(),
      trainedAt: null,
    };
    this.knowledgeBaseItems.set(id, item);
    return item;
  }

  async updateKnowledgeBaseItem(id: string, update: Partial<InsertKnowledgeBaseItem>): Promise<KnowledgeBaseItem | undefined> {
    const item = this.knowledgeBaseItems.get(id);
    if (!item) return undefined;
    const updated = { ...item, ...update };
    this.knowledgeBaseItems.set(id, updated);
    return updated;
  }

  async deleteKnowledgeBaseItem(id: string): Promise<boolean> {
    return this.knowledgeBaseItems.delete(id);
  }

  async getCallLogs(workspaceId: string): Promise<CallLog[]> {
    return Array.from(this.callLogs.values())
      .filter((c) => c.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getCallLog(id: string): Promise<CallLog | undefined> {
    return this.callLogs.get(id);
  }

  async createCallLog(data: InsertCallLog): Promise<CallLog> {
    const id = randomUUID();
    const log: CallLog = {
      id,
      workspaceId: data.workspaceId,
      twilioSid: data.twilioSid ?? null,
      callerPhone: data.callerPhone ?? null,
      duration: data.duration ?? null,
      status: data.status ?? null,
      transcript: data.transcript ?? null,
      aiSummary: data.aiSummary ?? null,
      reservationId: data.reservationId ?? null,
      recordingUrl: data.recordingUrl ?? null,
      createdAt: new Date(),
    };
    this.callLogs.set(id, log);
    return log;
  }

  async updateCallLogByTwilioSid(twilioSid: string, updates: Partial<InsertCallLog>): Promise<CallLog | undefined> {
    for (const [id, log] of Array.from(this.callLogs.entries())) {
      if (log.twilioSid === twilioSid) {
        const updated = { ...log, ...updates };
        this.callLogs.set(id, updated as CallLog);
        return updated as CallLog;
      }
    }
    return undefined;
  }

  async getWidgetSettings(workspaceId: string): Promise<WidgetSettings | undefined> {
    return this.widgetSettingsMap.get(workspaceId);
  }

  async upsertWidgetSettings(data: InsertWidgetSettings): Promise<WidgetSettings> {
    const existing = this.widgetSettingsMap.get(data.workspaceId);
    const settings: WidgetSettings = {
      id: existing?.id || 1,
      workspaceId: data.workspaceId,
      primaryColor: data.primaryColor ?? "#000000",
      position: data.position ?? "bottom-right",
      welcomeMessage: data.welcomeMessage ?? null,
      isEnabled: data.isEnabled ?? true,
      voiceEnabled: data.voiceEnabled ?? false,
      autoGreet: data.autoGreet ?? true,
      logoUrl: data.logoUrl ?? null,
      updatedAt: new Date(),
    };
    this.widgetSettingsMap.set(data.workspaceId, settings);
    return settings;
  }

  async getTwilioSettings(workspaceId: string): Promise<TwilioSettings | undefined> {
    const s = this.twilioSettingsMap.get(workspaceId);
    if (!s) return s;
    return { ...s, authToken: decryptField(s.authToken) };
  }

  async upsertTwilioSettings(data: InsertTwilioSettings): Promise<TwilioSettings> {
    const existing = this.twilioSettingsMap.get(data.workspaceId);
    const settings: TwilioSettings = {
      id: existing?.id || 1,
      workspaceId: data.workspaceId,
      accountSid: data.accountSid ?? null,
      authToken: encryptField(data.authToken) ?? null,
      phoneNumber: data.phoneNumber ?? null,
      voicePersona: data.voicePersona ?? "female",
      phoneGreeting: data.phoneGreeting ?? null,
      maxCallDuration: data.maxCallDuration ?? 5,
      voicemailEnabled: data.voicemailEnabled ?? true,
      smsEnabled: data.smsEnabled ?? false,
      smsTemplate: data.smsTemplate ?? null,
      isConnected: data.isConnected ?? false,
      updatedAt: new Date(),
    };
    this.twilioSettingsMap.set(data.workspaceId, settings);
    return { ...settings, authToken: decryptField(settings.authToken) };
  }

  async getPaymentSettings(workspaceId: string): Promise<PaymentSettings | undefined> {
    const s = this.paymentSettingsMap.get(workspaceId);
    if (!s) return s;
    return { ...s, stripeSecretKey: decryptField(s.stripeSecretKey), paypalClientSecret: decryptField(s.paypalClientSecret) };
  }

  async upsertPaymentSettings(data: InsertPaymentSettings): Promise<PaymentSettings> {
    const existing = this.paymentSettingsMap.get(data.workspaceId);
    const settings: PaymentSettings = {
      id: existing?.id || 1,
      workspaceId: data.workspaceId,
      stripeSecretKey: encryptField(data.stripeSecretKey) ?? null,
      stripePublishableKey: data.stripePublishableKey ?? null,
      stripeConnected: data.stripeConnected ?? false,
      paypalClientId: data.paypalClientId ?? null,
      paypalClientSecret: encryptField(data.paypalClientSecret) ?? null,
      paypalConnected: data.paypalConnected ?? false,
      depositAmount: data.depositAmount ?? null,
      depositType: data.depositType ?? "fixed",
      updatedAt: new Date(),
    };
    this.paymentSettingsMap.set(data.workspaceId, settings);
    return { ...settings, stripeSecretKey: decryptField(settings.stripeSecretKey), paypalClientSecret: decryptField(settings.paypalClientSecret) };
  }

  async getAiProviderSettings(workspaceId: string): Promise<AiProviderSettings[]> {
    return Array.from(this.aiProviderSettingsMap.values()).filter((a) => a.workspaceId === workspaceId).map(r => ({ ...r, apiKey: decryptField(r.apiKey) }));
  }

  async upsertAiProviderSettings(data: InsertAiProviderSettings): Promise<AiProviderSettings> {
    const key = `${data.workspaceId}-${data.provider}`;
    const existing = this.aiProviderSettingsMap.get(key);
    const settings: AiProviderSettings = {
      id: existing?.id || 1,
      workspaceId: data.workspaceId,
      provider: data.provider,
      apiKey: encryptField(data.apiKey) ?? null,
      isEnabled: data.isEnabled ?? false,
      updatedAt: new Date(),
    };
    this.aiProviderSettingsMap.set(key, settings);
    return { ...settings, apiKey: decryptField(settings.apiKey) };
  }

  async getAdminSetting(key: string): Promise<AdminSettings | undefined> {
    return this.adminSettingsMap.get(key);
  }

  async setAdminSetting(key: string, value: any): Promise<AdminSettings> {
    const existing = this.adminSettingsMap.get(key);
    const settings: AdminSettings = {
      id: existing?.id || 1,
      key,
      value,
      updatedAt: new Date(),
    };
    this.adminSettingsMap.set(key, settings);
    return settings;
  }

  // Room Types
  async getRoomTypes(workspaceId: string): Promise<RoomType[]> {
    return Array.from(this.roomTypesMap.values())
      .filter((rt) => rt.workspaceId === workspaceId)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async getRoomType(id: string): Promise<RoomType | undefined> {
    return this.roomTypesMap.get(id);
  }

  async createRoomType(data: InsertRoomType): Promise<RoomType> {
    const id = randomUUID();
    const roomType: RoomType = {
      id,
      workspaceId: data.workspaceId,
      name: data.name,
      description: data.description ?? null,
      basePrice: data.basePrice,
      maxOccupancy: data.maxOccupancy ?? 2,
      amenities: data.amenities ?? null,
      imageUrl: data.imageUrl ?? null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.roomTypesMap.set(id, roomType);
    return roomType;
  }

  async updateRoomType(id: string, update: Partial<InsertRoomType>): Promise<RoomType | undefined> {
    const roomType = this.roomTypesMap.get(id);
    if (!roomType) return undefined;
    const updated = { ...roomType, ...update, updatedAt: new Date() };
    this.roomTypesMap.set(id, updated);
    return updated;
  }

  async deleteRoomType(id: string): Promise<boolean> {
    return this.roomTypesMap.delete(id);
  }

  // Rooms
  async getRooms(workspaceId: string): Promise<Room[]> {
    return Array.from(this.roomsMap.values()).filter((r) => r.workspaceId === workspaceId);
  }

  async getRoomsByType(roomTypeId: string): Promise<Room[]> {
    return Array.from(this.roomsMap.values()).filter((r) => r.roomTypeId === roomTypeId);
  }

  async getRoom(id: string): Promise<Room | undefined> {
    return this.roomsMap.get(id);
  }

  async createRoom(data: InsertRoom): Promise<Room> {
    const id = randomUUID();
    const room: Room = {
      id,
      workspaceId: data.workspaceId,
      roomTypeId: data.roomTypeId,
      roomNumber: data.roomNumber,
      floor: data.floor ?? null,
      notes: data.notes ?? null,
      isActive: data.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.roomsMap.set(id, room);
    return room;
  }

  async updateRoom(id: string, update: Partial<InsertRoom>): Promise<Room | undefined> {
    const room = this.roomsMap.get(id);
    if (!room) return undefined;
    const updated = { ...room, ...update };
    this.roomsMap.set(id, updated);
    return updated;
  }

  async deleteRoom(id: string): Promise<boolean> {
    return this.roomsMap.delete(id);
  }

  // Room Bookings
  async getRoomBookings(workspaceId: string): Promise<RoomBooking[]> {
    return Array.from(this.roomBookingsMap.values())
      .filter((rb) => rb.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getRoomBookingsByDateRange(workspaceId: string, checkIn: string, checkOut: string): Promise<RoomBooking[]> {
    // Overlap formula: new.checkIn < existing.checkOut AND new.checkOut > existing.checkIn
    // Use timestamps for reliable comparison (handles both Date objects and strings)
    const newCheckInTs = new Date(checkIn).getTime();
    const newCheckOutTs = new Date(checkOut).getTime();
    return Array.from(this.roomBookingsMap.values()).filter((rb) => {
      if (rb.workspaceId !== workspaceId) return false;
      const existingCheckInTs = new Date(rb.checkIn).getTime();
      const existingCheckOutTs = new Date(rb.checkOut).getTime();
      return newCheckInTs < existingCheckOutTs && newCheckOutTs > existingCheckInTs;
    });
  }

  async getRoomBooking(id: string): Promise<RoomBooking | undefined> {
    return this.roomBookingsMap.get(id);
  }

  async createRoomBooking(data: InsertRoomBooking): Promise<RoomBooking> {
    const id = randomUUID();
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const booking: RoomBooking = {
      id,
      workspaceId: data.workspaceId,
      roomId: data.roomId,
      roomTypeId: data.roomTypeId,
      guestName: data.guestName,
      guestEmail: data.guestEmail ?? null,
      guestPhone: data.guestPhone ?? null,
      adults: data.adults ?? 1,
      children: data.children ?? 0,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: data.status ?? "confirmed",
      source: data.source ?? "widget",
      notes: data.notes ?? null,
      specialRequests: data.specialRequests ?? null,
      confirmationCode,
      totalAmount: data.totalAmount ?? null,
      depositAmount: data.depositAmount ?? null,
      isPrepaid: data.isPrepaid ?? false,
      paymentStatus: data.paymentStatus ?? "none",
      stripePaymentId: data.stripePaymentId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.roomBookingsMap.set(id, booking);
    return booking;
  }

  async updateRoomBooking(id: string, update: Partial<InsertRoomBooking>): Promise<RoomBooking | undefined> {
    const booking = this.roomBookingsMap.get(id);
    if (!booking) return undefined;
    const updated = { ...booking, ...update, updatedAt: new Date() } as RoomBooking;
    this.roomBookingsMap.set(id, updated);
    return updated;
  }

  async deleteRoomBooking(id: string): Promise<boolean> {
    return this.roomBookingsMap.delete(id);
  }

  async getSupportTicketsByWorkspace(workspaceId: string): Promise<SupportTicket[]> {
    return Array.from(this.supportTicketsMap.values())
      .filter((t) => t.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getSupportTicketsByUser(userId: string): Promise<SupportTicket[]> {
    return Array.from(this.supportTicketsMap.values())
      .filter((t) => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createSupportTicket(data: InsertSupportTicket): Promise<SupportTicket> {
    const id = randomUUID();
    const ticket: SupportTicket = {
      id,
      workspaceId: data.workspaceId,
      userId: data.userId,
      subject: data.subject,
      description: data.description,
      category: data.category ?? "general",
      priority: data.priority ?? "medium",
      status: data.status ?? "open",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.supportTicketsMap.set(id, ticket);
    return ticket;
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return Array.from(this.supportTicketsMap.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    return this.supportTicketsMap.get(id);
  }

  async updateSupportTicket(id: string, updates: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined> {
    const existing = this.supportTicketsMap.get(id);
    if (!existing) return undefined;
    const updated: SupportTicket = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.supportTicketsMap.set(id, updated);
    return updated;
  }

  async getWidgetChatLogs(workspaceId: string): Promise<WidgetChatLog[]> {
    return Array.from(this.widgetChatLogsMap.values()).filter(l => l.workspaceId === workspaceId);
  }

  async createWidgetChatLog(log: InsertWidgetChatLog): Promise<WidgetChatLog> {
    const id = randomUUID();
    const chatLog: WidgetChatLog = {
      id,
      ...log,
      messageCount: log.messageCount ?? 1,
      channel: log.channel ?? "text",
      visitorIp: log.visitorIp ?? null,
      firstMessage: log.firstMessage ?? null,
      createdAt: new Date(),
      lastMessageAt: new Date(),
    };
    this.widgetChatLogsMap.set(id, chatLog);
    return chatLog;
  }

  async updateWidgetChatLogMessageCount(sessionId: string): Promise<WidgetChatLog | undefined> {
    for (const [id, log] of Array.from(this.widgetChatLogsMap.entries())) {
      if (log.sessionId === sessionId) {
        const updated: WidgetChatLog = {
          ...log,
          messageCount: (log.messageCount || 1) + 1,
          lastMessageAt: new Date(),
        };
        this.widgetChatLogsMap.set(id, updated);
        return updated;
      }
    }
    return undefined;
  }

  async getWebsiteChangeRequests(workspaceId: string): Promise<WebsiteChangeRequest[]> {
    return Array.from(this.websiteChangeRequestsMap.values()).filter(r => r.workspaceId === workspaceId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createWebsiteChangeRequest(request: InsertWebsiteChangeRequest): Promise<WebsiteChangeRequest> {
    const id = randomUUID();
    const cr: WebsiteChangeRequest = { id, ...request, changeType: request.changeType ?? "text", status: request.status ?? "pending", pageUrl: request.pageUrl ?? null, attachmentUrl: request.attachmentUrl ?? null, adminNotes: request.adminNotes ?? null, createdAt: new Date(), updatedAt: new Date() };
    this.websiteChangeRequestsMap.set(id, cr);
    return cr;
  }

  async updateWebsiteChangeRequest(id: string, updates: Partial<InsertWebsiteChangeRequest>): Promise<WebsiteChangeRequest | undefined> {
    const existing = this.websiteChangeRequestsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.websiteChangeRequestsMap.set(id, updated);
    return updated;
  }

  async getSeoSettings(workspaceId: string): Promise<SeoSettings[]> {
    return Array.from(this.seoSettingsMap.values()).filter(s => s.workspaceId === workspaceId).map(r => ({ ...r, apiKey: decryptField(r.apiKey), apiLogin: decryptField(r.apiLogin), apiPassword: decryptField(r.apiPassword) }));
  }

  async upsertSeoSettings(settings: InsertSeoSettings): Promise<SeoSettings> {
    const key = `${settings.workspaceId}:${settings.provider}`;
    const existing = this.seoSettingsMap.get(key);
    const encrypted = { ...settings, apiKey: encryptField(settings.apiKey), apiLogin: encryptField(settings.apiLogin), apiPassword: encryptField(settings.apiPassword) };
    if (existing) {
      const updated: SeoSettings = { ...existing, ...encrypted, updatedAt: new Date() };
      this.seoSettingsMap.set(key, updated);
      return { ...updated, apiKey: decryptField(updated.apiKey), apiLogin: decryptField(updated.apiLogin), apiPassword: decryptField(updated.apiPassword) };
    }
    const newSettings: SeoSettings = { id: Math.floor(Math.random() * 100000), ...encrypted, siteUrl: settings.siteUrl ?? null, isConnected: settings.isConnected ?? false, createdAt: new Date(), updatedAt: new Date() };
    this.seoSettingsMap.set(key, newSettings);
    return { ...newSettings, apiKey: decryptField(newSettings.apiKey), apiLogin: decryptField(newSettings.apiLogin), apiPassword: decryptField(newSettings.apiPassword) };
  }

  async getRankTrackerKeywords(workspaceId: string): Promise<RankTrackerKeyword[]> {
    return Array.from(this.rankTrackerKeywordsMap.values())
      .filter(k => k.workspaceId === workspaceId)
      .sort((a, b) => a.keyword.localeCompare(b.keyword));
  }

  async addRankTrackerKeywords(keywords: InsertRankTrackerKeyword[]): Promise<RankTrackerKeyword[]> {
    const results: RankTrackerKeyword[] = [];
    for (const kw of keywords) {
      const id = this.rankKeywordCounter++;
      const item: RankTrackerKeyword = { id, workspaceId: kw.workspaceId, keyword: kw.keyword, createdAt: new Date() };
      this.rankTrackerKeywordsMap.set(id, item);
      results.push(item);
    }
    return results;
  }

  async deleteRankTrackerKeyword(id: number): Promise<void> {
    this.rankTrackerKeywordsMap.delete(id);
  }

  async deleteAllRankTrackerKeywords(workspaceId: string): Promise<void> {
    for (const [id, kw] of Array.from(this.rankTrackerKeywordsMap)) {
      if (kw.workspaceId === workspaceId) this.rankTrackerKeywordsMap.delete(id);
    }
  }

  async getRankTrackerResults(workspaceId: string, page?: number, limit?: number): Promise<{ results: RankTrackerResult[]; total: number }> {
    const all = Array.from(this.rankTrackerResultsMap.values())
      .filter(r => r.workspaceId === workspaceId)
      .sort((a, b) => new Date(b.checkedAt!).getTime() - new Date(a.checkedAt!).getTime());
    const p = page || 1;
    const l = limit || 20;
    const offset = (p - 1) * l;
    return { results: all.slice(offset, offset + l), total: all.length };
  }

  async getLatestRankTrackerResults(workspaceId: string): Promise<RankTrackerResult[]> {
    const lastCheck = await this.getLastRankCheckDate(workspaceId);
    if (!lastCheck) return [];
    return Array.from(this.rankTrackerResultsMap.values())
      .filter(r => r.workspaceId === workspaceId && r.checkedAt?.getTime() === lastCheck.getTime())
      .sort((a, b) => a.keyword.localeCompare(b.keyword));
  }

  async saveRankTrackerResults(results: InsertRankTrackerResult[]): Promise<RankTrackerResult[]> {
    const saved: RankTrackerResult[] = [];
    for (const r of results) {
      const id = this.rankResultCounter++;
      const item: RankTrackerResult = { id, ...r, position: r.position ?? null, previousPosition: r.previousPosition ?? null, url: r.url ?? null, searchEngine: r.searchEngine ?? "google", checkedAt: new Date() };
      this.rankTrackerResultsMap.set(id, item);
      saved.push(item);
    }
    return saved;
  }

  async getLastRankCheckDate(workspaceId: string): Promise<Date | null> {
    let maxDate: Date | null = null;
    for (const r of Array.from(this.rankTrackerResultsMap.values())) {
      if (r.workspaceId === workspaceId && r.checkedAt) {
        if (!maxDate || r.checkedAt > maxDate) maxDate = r.checkedAt;
      }
    }
    return maxDate;
  }

  async getGridKeywords(workspaceId: string): Promise<GridKeyword[]> {
    return Array.from(this.gridKeywordsMap.values())
      .filter(k => k.workspaceId === workspaceId)
      .sort((a, b) => a.keyword.localeCompare(b.keyword));
  }

  async addGridKeywords(keywords: InsertGridKeyword[]): Promise<GridKeyword[]> {
    const results: GridKeyword[] = [];
    for (const kw of keywords) {
      const id = this.gridKeywordCounter++;
      const item: GridKeyword = { id, workspaceId: kw.workspaceId, keyword: kw.keyword, gridSize: kw.gridSize ?? 5, distance: kw.distance ?? "2.0", createdAt: new Date() };
      this.gridKeywordsMap.set(id, item);
      results.push(item);
    }
    return results;
  }

  async deleteGridKeyword(id: number): Promise<void> {
    this.gridKeywordsMap.delete(id);
  }

  async deleteAllGridKeywords(workspaceId: string): Promise<void> {
    for (const [id, kw] of Array.from(this.gridKeywordsMap)) {
      if (kw.workspaceId === workspaceId) this.gridKeywordsMap.delete(id);
    }
  }

  private gridRefreshCreditsMap: Map<string, GridRefreshCredits> = new Map();
  private gridRefreshHistoryList: GridRefreshHistory[] = [];
  private gridRefreshHistoryCounter = 1;

  async getGridRefreshCredits(workspaceId: string): Promise<GridRefreshCredits> {
    let credits = this.gridRefreshCreditsMap.get(workspaceId);
    if (!credits) {
      credits = { id: Date.now(), workspaceId, balance: 3, totalPurchased: 3, totalUsed: 0, lastFreeScanDate: null, createdAt: new Date(), updatedAt: new Date() };
      this.gridRefreshHistoryList.push({ id: this.gridRefreshHistoryCounter++, workspaceId, type: "bonus", amount: 3, description: "Welcome bonus — $5 starter credit", createdAt: new Date() });
      this.gridRefreshCreditsMap.set(workspaceId, credits);
    }
    return credits;
  }

  async addGridRefreshCredits(workspaceId: string, amount: number, description: string): Promise<GridRefreshCredits> {
    const credits = await this.getGridRefreshCredits(workspaceId);
    credits.balance += amount;
    credits.totalPurchased += amount;
    credits.updatedAt = new Date();
    this.gridRefreshHistoryList.push({ id: this.gridRefreshHistoryCounter++, workspaceId, type: "purchase", amount, description, createdAt: new Date() });
    return credits;
  }

  async useGridRefreshCredit(workspaceId: string): Promise<{ success: boolean; balance: number }> {
    const credits = await this.getGridRefreshCredits(workspaceId);
    if (credits.balance <= 0) return { success: false, balance: 0 };
    credits.balance -= 1;
    credits.totalUsed += 1;
    credits.updatedAt = new Date();
    this.gridRefreshHistoryList.push({ id: this.gridRefreshHistoryCounter++, workspaceId, type: "usage", amount: -1, description: "Grid refresh", createdAt: new Date() });
    return { success: true, balance: credits.balance };
  }



  async getGridRefreshHistory(workspaceId: string): Promise<GridRefreshHistory[]> {
    return this.gridRefreshHistoryList.filter(h => h.workspaceId === workspaceId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  private rankTrackerCreditsMap: Map<string, RankTrackerCredits> = new Map();
  private rankTrackerHistoryList: RankTrackerHistory[] = [];
  private rankTrackerHistoryCounter = 1;

  async getRankTrackerCredits(workspaceId: string): Promise<RankTrackerCredits> {
    let credits = this.rankTrackerCreditsMap.get(workspaceId);
    if (!credits) {
      credits = { id: Date.now(), workspaceId, balance: 5, totalPurchased: 0, totalUsed: 0, createdAt: new Date(), updatedAt: new Date() };
      this.rankTrackerCreditsMap.set(workspaceId, credits);
      this.rankTrackerHistoryList.push({ id: this.rankTrackerHistoryCounter++, workspaceId, type: "bonus", amount: 5, description: "Welcome bonus — $5 starter credit", createdAt: new Date() });
    }
    return credits;
  }

  async addRankTrackerCredits(workspaceId: string, amount: number, description: string): Promise<RankTrackerCredits> {
    const credits = await this.getRankTrackerCredits(workspaceId);
    credits.balance += amount;
    credits.totalPurchased += amount;
    credits.updatedAt = new Date();
    this.rankTrackerHistoryList.push({ id: this.rankTrackerHistoryCounter++, workspaceId, type: "purchase", amount, description, createdAt: new Date() });
    return credits;
  }

  async useRankTrackerCredit(workspaceId: string): Promise<{ success: boolean; balance: number }> {
    const credits = await this.getRankTrackerCredits(workspaceId);
    if (credits.balance <= 0) return { success: false, balance: 0 };
    credits.balance -= 1;
    credits.totalUsed += 1;
    credits.updatedAt = new Date();
    this.rankTrackerHistoryList.push({ id: this.rankTrackerHistoryCounter++, workspaceId, type: "usage", amount: -1, description: "Rank check", createdAt: new Date() });
    return { success: true, balance: credits.balance };
  }

  async getRankTrackerHistory(workspaceId: string): Promise<RankTrackerHistory[]> {
    return this.rankTrackerHistoryList.filter(h => h.workspaceId === workspaceId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  private gridScanResultsList: GridScanResult[] = [];
  private gridScanResultsCounter = 1;

  async saveGridScanResults(results: InsertGridScanResult[]): Promise<GridScanResult[]> {
    const saved: GridScanResult[] = results.map(r => ({
      ...r,
      id: this.gridScanResultsCounter++,
      rank: r.rank ?? null,
      businessName: r.businessName ?? null,
      scanDate: new Date(),
    }));
    this.gridScanResultsList.push(...saved);
    return saved;
  }

  async getLatestGridScanResults(workspaceId: string, keyword: string): Promise<GridScanResult[]> {
    const matching = this.gridScanResultsList.filter(r => r.workspaceId === workspaceId && r.keyword === keyword);
    if (matching.length === 0) return [];
    const latestDate = matching.reduce((max, r) => (r.scanDate && r.scanDate > max ? r.scanDate : max), matching[0].scanDate || new Date(0));
    return matching.filter(r => r.scanDate?.getTime() === latestDate?.getTime());
  }

  async getGridScanKeywords(workspaceId: string): Promise<string[]> {
    const keywords = new Set(this.gridScanResultsList.filter(r => r.workspaceId === workspaceId).map(r => r.keyword));
    return Array.from(keywords);
  }

  private workspaceDomainsMap: Map<string, WorkspaceDomain> = new Map();
  private workspaceBlogPostsMap: Map<string, WorkspaceBlogPost> = new Map();
  private contentCampaignsMap: Map<string, ContentCampaign> = new Map();
  private contentAssetsMap: Map<string, ContentAsset> = new Map();
  private contentAssetUsageList: ContentAssetUsage[] = [];

  async getWorkspaceDomains(workspaceId: string): Promise<WorkspaceDomain[]> {
    return Array.from(this.workspaceDomainsMap.values()).filter(d => d.workspaceId === workspaceId);
  }
  async getWorkspaceDomain(id: string): Promise<WorkspaceDomain | undefined> {
    return this.workspaceDomainsMap.get(id);
  }
  async getWorkspaceDomainByDomain(domain: string): Promise<WorkspaceDomain | undefined> {
    return Array.from(this.workspaceDomainsMap.values()).find(d => d.domain === domain.toLowerCase());
  }
  async createWorkspaceDomain(d: InsertWorkspaceDomain): Promise<WorkspaceDomain> {
    const record: WorkspaceDomain = { ...d, id: randomUUID(), isPrimary: d.isPrimary ?? true, blogTemplate: d.blogTemplate ?? "editorial", accentColor: d.accentColor ?? null, accentForeground: d.accentForeground ?? null, domain: d.domain.toLowerCase(), createdAt: new Date() };
    this.workspaceDomainsMap.set(record.id, record);
    return record;
  }
  async updateWorkspaceDomain(id: string, data: Partial<Pick<WorkspaceDomain, "domain" | "blogTemplate" | "isPrimary" | "accentColor" | "accentForeground">>): Promise<WorkspaceDomain | undefined> {
    const existing = this.workspaceDomainsMap.get(id);
    if (!existing) return undefined;
    if (data.isPrimary === true) {
      for (const [k, v] of this.workspaceDomainsMap) {
        if (v.workspaceId === existing.workspaceId && v.isPrimary && k !== id) {
          this.workspaceDomainsMap.set(k, { ...v, isPrimary: false });
        }
      }
    }
    const updated = { ...existing, ...data, ...(data.domain ? { domain: data.domain.toLowerCase() } : {}) };
    this.workspaceDomainsMap.set(id, updated);
    return updated;
  }
  async deleteWorkspaceDomain(id: string): Promise<boolean> {
    return this.workspaceDomainsMap.delete(id);
  }

  async countBlogPostsThisMonth(workspaceId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return Array.from(this.workspaceBlogPostsMap.values()).filter(
      (p) => p.workspaceId === workspaceId && p.createdAt && p.createdAt >= startOfMonth
    ).length;
  }

  async getWorkspaceBlogPosts(workspaceId: string, status?: string): Promise<WorkspaceBlogPost[]> {
    return Array.from(this.workspaceBlogPostsMap.values()).filter(p => p.workspaceId === workspaceId && (!status || p.status === status)).sort((a, b) => ((b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)));
  }
  async getWorkspaceBlogPost(id: string): Promise<WorkspaceBlogPost | undefined> {
    return this.workspaceBlogPostsMap.get(id);
  }
  async getWorkspaceBlogPostBySlug(workspaceId: string, slug: string): Promise<WorkspaceBlogPost | undefined> {
    return Array.from(this.workspaceBlogPostsMap.values()).find(p => p.workspaceId === workspaceId && p.slug === slug);
  }
  async getPublishedPostsByWorkspace(workspaceId: string): Promise<WorkspaceBlogPost[]> {
    return Array.from(this.workspaceBlogPostsMap.values()).filter(p => p.workspaceId === workspaceId && p.status === "published").sort((a, b) => ((b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0)));
  }
  async getScheduledPostsDue(): Promise<WorkspaceBlogPost[]> {
    const now = new Date();
    return Array.from(this.workspaceBlogPostsMap.values()).filter(p => p.status === "scheduled" && p.publishAt && p.publishAt <= now);
  }
  async createWorkspaceBlogPost(post: InsertWorkspaceBlogPost): Promise<WorkspaceBlogPost> {
    const record: WorkspaceBlogPost = { ...post, id: randomUUID(), compiledHtml: null, publishedAt: null, tags: post.tags ?? null, description: post.description ?? null, category: post.category ?? null, publishAt: post.publishAt ?? null, mdxContent: post.mdxContent ?? "", status: post.status ?? "draft", primaryKeyword: post.primaryKeyword ?? null, intent: post.intent ?? null, funnel: post.funnel ?? null, generationStatus: post.generationStatus ?? "pending", qualityGateStatus: post.qualityGateStatus ?? "unknown", qualityFailReasons: post.qualityFailReasons ?? null, campaignId: post.campaignId ?? null, createdAt: new Date(), updatedAt: new Date() };
    this.workspaceBlogPostsMap.set(record.id, record);
    return record;
  }
  async bulkCreateWorkspaceBlogPosts(posts: InsertWorkspaceBlogPost[]): Promise<WorkspaceBlogPost[]> {
    const results: WorkspaceBlogPost[] = [];
    for (const post of posts) {
      results.push(await this.createWorkspaceBlogPost(post));
    }
    return results;
  }
  async getWorkspaceBlogPostsByCampaign(workspaceId: string, campaignId: string): Promise<WorkspaceBlogPost[]> {
    return Array.from(this.workspaceBlogPostsMap.values()).filter(p => p.workspaceId === workspaceId && p.campaignId === campaignId);
  }
  async createContentCampaign(data: InsertContentCampaign): Promise<ContentCampaign> {
    const id = data.id || randomUUID();
    const campaign: ContentCampaign = { id, ...data, timezone: data.timezone ?? "UTC", status: data.status ?? "draft", startDate: data.startDate ?? null, durationWeeks: data.durationWeeks ?? null, postsTotal: data.postsTotal ?? null, publishDays: data.publishDays ?? null, publishTimeLocal: data.publishTimeLocal ?? null, cadenceJson: data.cadenceJson ?? null, createdAt: new Date(), updatedAt: new Date() };
    this.contentCampaignsMap.set(id, campaign);
    return campaign;
  }
  async getContentCampaign(id: string): Promise<ContentCampaign | undefined> {
    return this.contentCampaignsMap.get(id);
  }
  async updateContentCampaign(id: string, data: Partial<ContentCampaign>): Promise<ContentCampaign | undefined> {
    const existing = this.contentCampaignsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.contentCampaignsMap.set(id, updated);
    return updated;
  }
  async getWorkspaceCampaigns(workspaceId: string): Promise<{ campaignId: string; name: string; status: string; postCount: number; createdAt: Date; statuses: Record<string, number> }[]> {
    const posts = Array.from(this.workspaceBlogPostsMap.values()).filter(p => p.workspaceId === workspaceId && p.campaignId);
    const map = new Map<string, WorkspaceBlogPost[]>();
    for (const p of posts) {
      const arr = map.get(p.campaignId!) || [];
      arr.push(p);
      map.set(p.campaignId!, arr);
    }
    return Array.from(map.entries()).map(([campaignId, cPosts]) => {
      const statuses: Record<string, number> = {};
      for (const p of cPosts) {
        const s = p.generationStatus || "pending";
        statuses[s] = (statuses[s] || 0) + 1;
      }
      const earliest = cPosts.reduce((min, p) => (p.createdAt && p.createdAt < min ? p.createdAt : min), cPosts[0].createdAt || new Date());
      const campaign = this.contentCampaignsMap.get(campaignId);
      return { campaignId, name: campaign?.name || `Campaign ${campaignId.slice(0, 8)}`, status: campaign?.status || "active", postCount: cPosts.length, createdAt: earliest, statuses };
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async updateWorkspaceBlogPost(id: string, post: Partial<WorkspaceBlogPost>): Promise<WorkspaceBlogPost | undefined> {
    const existing = this.workspaceBlogPostsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...post, updatedAt: new Date() };
    this.workspaceBlogPostsMap.set(id, updated);
    return updated;
  }
  async deleteWorkspaceBlogPost(id: string): Promise<boolean> {
    return this.workspaceBlogPostsMap.delete(id);
  }

  private cmsApiKeysMap: Map<string, CmsApiKey> = new Map();
  private cmsSyncLogsList: CmsSyncLog[] = [];
  async getCmsApiKeys(workspaceId: string): Promise<CmsApiKey[]> {
    return Array.from(this.cmsApiKeysMap.values()).filter(k => k.workspaceId === workspaceId);
  }
  async createCmsApiKey(data: InsertCmsApiKey): Promise<CmsApiKey> {
    const record: CmsApiKey = { ...data, id: randomUUID(), workspaceId: data.workspaceId ?? null, label: data.label ?? null, isActive: data.isActive ?? true, createdAt: new Date() };
    this.cmsApiKeysMap.set(record.id, record);
    return record;
  }
  async deleteCmsApiKey(id: string): Promise<boolean> {
    return this.cmsApiKeysMap.delete(id);
  }
  async getCmsSyncLogs(workspaceId: string): Promise<CmsSyncLog[]> {
    return this.cmsSyncLogsList.filter(l => l.workspaceId === workspaceId).slice(0, 100);
  }
  async getContentAssets(postId: string): Promise<ContentAsset[]> {
    return Array.from(this.contentAssetsMap.values()).filter(a => a.postId === postId);
  }
  async searchContentAssets(workspaceId: string, query?: string): Promise<ContentAsset[]> {
    let results = Array.from(this.contentAssetsMap.values()).filter(a => a.workspaceId === workspaceId);
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(a => (a.prompt?.toLowerCase().includes(q)) || (a.title?.toLowerCase().includes(q)));
    }
    return results.slice(0, 100);
  }
  async createContentAsset(asset: InsertContentAsset): Promise<ContentAsset> {
    const record: ContentAsset = { ...asset, id: randomUUID(), workspaceId: asset.workspaceId ?? null, postId: asset.postId ?? null, sourceAssetId: asset.sourceAssetId ?? null, type: asset.type ?? "generic", prompt: asset.prompt ?? null, title: asset.title ?? null, width: asset.width ?? null, height: asset.height ?? null, r2Key: asset.r2Key ?? null, publicUrl: asset.publicUrl ?? null, creditName: asset.creditName ?? null, creditUrl: asset.creditUrl ?? null, licenseNote: asset.licenseNote ?? null, createdAt: new Date() };
    this.contentAssetsMap.set(record.id, record);
    return record;
  }
  async createContentAssetUsage(usage: InsertContentAssetUsage): Promise<ContentAssetUsage> {
    const record: ContentAssetUsage = { ...usage, id: this.contentAssetUsageList.length + 1, position: usage.position ?? 0, placement: usage.placement ?? "inline", createdAt: new Date() };
    this.contentAssetUsageList.push(record);
    return record;
  }
  async getContentAssetUsage(postId: string): Promise<ContentAssetUsage[]> {
    return this.contentAssetUsageList.filter(u => u.postId === postId);
  }

  private crmContactsMap: Map<number, CrmContact> = new Map();
  private crmContactIdCounter = 1;
  private crmPipelineStagesMap: Map<number, CrmPipelineStage> = new Map();
  private crmStageIdCounter = 1;
  private crmDealsMap: Map<number, CrmDeal> = new Map();
  private crmDealIdCounter = 1;

  async getCrmContacts(workspaceId?: string): Promise<CrmContact[]> {
    const all = Array.from(this.crmContactsMap.values());
    return workspaceId ? all.filter(c => c.workspaceId === workspaceId) : all;
  }
  async getCrmContact(id: number): Promise<CrmContact | undefined> { return this.crmContactsMap.get(id); }
  async createCrmContact(data: InsertCrmContact): Promise<CrmContact> {
    const record: CrmContact = { ...data, id: this.crmContactIdCounter++, workspaceId: data.workspaceId ?? null, email: data.email ?? null, phone: data.phone ?? null, company: data.company ?? null, title: data.title ?? null, source: data.source ?? "manual", status: data.status ?? "active", notes: data.notes ?? null, tags: data.tags ?? null, lastContactedAt: data.lastContactedAt ?? null, createdAt: new Date(), updatedAt: new Date() };
    this.crmContactsMap.set(record.id, record);
    return record;
  }
  async updateCrmContact(id: number, data: Partial<InsertCrmContact>): Promise<CrmContact | undefined> {
    const existing = this.crmContactsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.crmContactsMap.set(id, updated);
    return updated;
  }
  async deleteCrmContact(id: number): Promise<boolean> { return this.crmContactsMap.delete(id); }

  async getCrmPipelineStages(workspaceId?: string): Promise<CrmPipelineStage[]> {
    const all = Array.from(this.crmPipelineStagesMap.values());
    return workspaceId ? all.filter(s => s.workspaceId === workspaceId) : all;
  }
  async createCrmPipelineStage(data: InsertCrmPipelineStage): Promise<CrmPipelineStage> {
    const record: CrmPipelineStage = { ...data, id: this.crmStageIdCounter++, workspaceId: data.workspaceId ?? null, color: data.color ?? "#3b82f6", createdAt: new Date() };
    this.crmPipelineStagesMap.set(record.id, record);
    return record;
  }
  async updateCrmPipelineStage(id: number, data: Partial<InsertCrmPipelineStage>): Promise<CrmPipelineStage | undefined> {
    const existing = this.crmPipelineStagesMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.crmPipelineStagesMap.set(id, updated);
    return updated;
  }
  async deleteCrmPipelineStage(id: number): Promise<boolean> { return this.crmPipelineStagesMap.delete(id); }

  async getCrmDeals(workspaceId?: string): Promise<CrmDeal[]> {
    const all = Array.from(this.crmDealsMap.values());
    return workspaceId ? all.filter(d => d.workspaceId === workspaceId) : all;
  }
  async getCrmDeal(id: number): Promise<CrmDeal | undefined> { return this.crmDealsMap.get(id); }
  async createCrmDeal(data: InsertCrmDeal): Promise<CrmDeal> {
    const record: CrmDeal = { ...data, id: this.crmDealIdCounter++, workspaceId: data.workspaceId ?? null, contactId: data.contactId ?? null, stageId: data.stageId ?? null, value: data.value ?? "0", currency: data.currency ?? "USD", stage: data.stage ?? "lead", priority: data.priority ?? "medium", assignedTo: data.assignedTo ?? null, businessName: data.businessName ?? null, businessType: data.businessType ?? null, contactName: data.contactName ?? null, contactEmail: data.contactEmail ?? null, contactPhone: data.contactPhone ?? null, plan: data.plan ?? null, source: data.source ?? null, lastActivity: data.lastActivity ?? null, nextFollowUp: data.nextFollowUp ?? null, notes: data.notes ?? null, closedAt: data.closedAt ?? null, expectedCloseDate: data.expectedCloseDate ?? null, createdAt: new Date(), updatedAt: new Date() };
    this.crmDealsMap.set(record.id, record);
    return record;
  }
  async updateCrmDeal(id: number, data: Partial<InsertCrmDeal>): Promise<CrmDeal | undefined> {
    const existing = this.crmDealsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.crmDealsMap.set(id, updated);
    return updated;
  }
  async deleteCrmDeal(id: number): Promise<boolean> { return this.crmDealsMap.delete(id); }

  private invoicesMap: Map<number, Invoice> = new Map();
  private invoiceIdCounter = 1;
  private invoiceLineItemsMap: Map<number, InvoiceLineItem> = new Map();
  private invoiceLineItemIdCounter = 1;
  private contentReportsMap: Map<number, ContentReport> = new Map();
  private contentReportIdCounter = 1;

  async getInvoices(workspaceId?: string): Promise<Invoice[]> {
    const all = Array.from(this.invoicesMap.values());
    return workspaceId ? all.filter(i => i.workspaceId === workspaceId) : all;
  }
  async getInvoice(id: number): Promise<Invoice | undefined> { return this.invoicesMap.get(id); }
  async createInvoice(data: InsertInvoice): Promise<Invoice> {
    const record: Invoice = { ...data, id: this.invoiceIdCounter++, workspaceId: data.workspaceId ?? null, clientEmail: data.clientEmail ?? null, status: data.status ?? "draft", issueDate: data.issueDate ?? null, dueDate: data.dueDate ?? null, subtotal: data.subtotal ?? "0", taxRate: data.taxRate ?? "0", taxAmount: data.taxAmount ?? "0", discount: data.discount ?? "0", total: data.total ?? "0", currency: data.currency ?? "USD", notes: data.notes ?? null, paymentTerms: data.paymentTerms ?? null, paidAt: data.paidAt ?? null, createdAt: new Date(), updatedAt: new Date() };
    this.invoicesMap.set(record.id, record);
    return record;
  }
  async updateInvoice(id: number, data: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const existing = this.invoicesMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.invoicesMap.set(id, updated);
    return updated;
  }
  async deleteInvoice(id: number): Promise<boolean> { return this.invoicesMap.delete(id); }

  async getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]> {
    return Array.from(this.invoiceLineItemsMap.values()).filter(i => i.invoiceId === invoiceId).sort((a, b) => a.sortOrder - b.sortOrder);
  }
  async createInvoiceLineItem(data: InsertInvoiceLineItem): Promise<InvoiceLineItem> {
    const record: InvoiceLineItem = { ...data, id: this.invoiceLineItemIdCounter++ };
    this.invoiceLineItemsMap.set(record.id, record);
    return record;
  }
  async updateInvoiceLineItem(id: number, data: Partial<InsertInvoiceLineItem>): Promise<InvoiceLineItem | undefined> {
    const existing = this.invoiceLineItemsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data };
    this.invoiceLineItemsMap.set(id, updated);
    return updated;
  }
  async deleteInvoiceLineItem(id: number): Promise<boolean> { return this.invoiceLineItemsMap.delete(id); }
  async deleteInvoiceLineItemsByInvoice(invoiceId: number): Promise<void> {
    for (const [id, item] of Array.from(this.invoiceLineItemsMap)) {
      if (item.invoiceId === invoiceId) this.invoiceLineItemsMap.delete(id);
    }
  }

  async getContentReports(workspaceId?: string): Promise<ContentReport[]> {
    const all = Array.from(this.contentReportsMap.values());
    return workspaceId ? all.filter(r => r.workspaceId === workspaceId) : all;
  }
  async getContentReport(id: number): Promise<ContentReport | undefined> { return this.contentReportsMap.get(id); }
  async createContentReport(data: InsertContentReport): Promise<ContentReport> {
    const record: ContentReport = { ...data, id: this.contentReportIdCounter++, workspaceId: data.workspaceId ?? null, type: data.type ?? "monthly", status: data.status ?? "draft", period: data.period ?? null, metrics: data.metrics ?? null, summary: data.summary ?? null, postsPublished: data.postsPublished ?? 0, totalWords: data.totalWords ?? 0, avgWordCount: data.avgWordCount ?? 0, topKeywords: data.topKeywords ?? null, trafficChange: data.trafficChange ?? null, rankingsImproved: data.rankingsImproved ?? 0, generatedAt: data.generatedAt ?? null, createdAt: new Date(), updatedAt: new Date() };
    this.contentReportsMap.set(record.id, record);
    return record;
  }
  async updateContentReport(id: number, data: Partial<InsertContentReport>): Promise<ContentReport | undefined> {
    const existing = this.contentReportsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...data, updatedAt: new Date() };
    this.contentReportsMap.set(id, updated);
    return updated;
  }
  async deleteContentReport(id: number): Promise<boolean> { return this.contentReportsMap.delete(id); }
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db!.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return db!.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(data: InsertContactMessage): Promise<ContactMessage> {
    const [msg] = await db!.insert(contactMessages).values({ id: randomUUID(), ...data }).returning();
    return msg;
  }

  async getWorkspaces(): Promise<Workspace[]> {
    return db!.select().from(workspaces);
  }

  async getWorkspacesByOwner(ownerId: string): Promise<Workspace[]> {
    return db!.select().from(workspaces).where(eq(workspaces.ownerId, ownerId));
  }

  async countWorkspacesByOwner(ownerId: string): Promise<number> {
    const result = await db!.select({ count: sql<number>`count(*)::int` }).from(workspaces).where(eq(workspaces.ownerId, ownerId));
    return result[0]?.count ?? 0;
  }

  async getWorkspace(id: string): Promise<Workspace | undefined> {
    const [ws] = await db!.select().from(workspaces).where(eq(workspaces.id, id));
    return ws;
  }

  async createWorkspace(data: InsertWorkspace): Promise<Workspace> {
    const [ws] = await db!.insert(workspaces).values({ id: randomUUID(), ...data }).returning();
    return ws;
  }

  async updateWorkspace(id: string, update: Partial<InsertWorkspace>): Promise<Workspace | undefined> {
    const [ws] = await db!.update(workspaces).set({ ...update, updatedAt: new Date() }).where(eq(workspaces.id, id)).returning();
    return ws;
  }

  async deleteWorkspace(id: string): Promise<boolean> {
    const result = await db!.delete(workspaces).where(eq(workspaces.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getReservations(workspaceId: string): Promise<Reservation[]> {
    return db!.select().from(reservations).where(eq(reservations.workspaceId, workspaceId));
  }

  async getReservationsByDate(workspaceId: string, date: string): Promise<Reservation[]> {
    return db!.select().from(reservations).where(and(eq(reservations.workspaceId, workspaceId), eq(reservations.date, date)));
  }

  async getReservation(id: string): Promise<Reservation | undefined> {
    const [res] = await db!.select().from(reservations).where(eq(reservations.id, id));
    return res;
  }

  async createReservation(data: InsertReservation): Promise<Reservation> {
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const [res] = await db!.insert(reservations).values({ id: randomUUID(), confirmationCode, ...data }).returning();
    return res;
  }

  async updateReservation(id: string, update: Partial<InsertReservation>): Promise<Reservation | undefined> {
    const [res] = await db!.update(reservations).set({ ...update, updatedAt: new Date() }).where(eq(reservations.id, id)).returning();
    return res;
  }

  async deleteReservation(id: string): Promise<boolean> {
    const result = await db!.delete(reservations).where(eq(reservations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getBusinessHours(workspaceId: string): Promise<BusinessHours[]> {
    return db!.select().from(businessHours).where(eq(businessHours.workspaceId, workspaceId));
  }

  async setBusinessHours(workspaceId: string, hours: InsertBusinessHours[]): Promise<BusinessHours[]> {
    await db!.delete(businessHours).where(eq(businessHours.workspaceId, workspaceId));
    if (hours.length === 0) return [];
    return db!.insert(businessHours).values(hours.map(h => ({ ...h, workspaceId }))).returning();
  }

  async getClosures(workspaceId: string): Promise<Closure[]> {
    return db!.select().from(closures).where(eq(closures.workspaceId, workspaceId));
  }

  async getClosure(id: number): Promise<Closure | undefined> {
    const [c] = await db!.select().from(closures).where(eq(closures.id, id));
    return c;
  }

  async createClosure(data: InsertClosure): Promise<Closure> {
    const [c] = await db!.insert(closures).values(data).returning();
    return c;
  }

  async deleteClosure(id: number): Promise<boolean> {
    const result = await db!.delete(closures).where(eq(closures.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getResources(workspaceId: string): Promise<Resource[]> {
    return db!.select().from(resources).where(eq(resources.workspaceId, workspaceId)).orderBy(asc(resources.sortOrder));
  }

  async getResource(id: string): Promise<Resource | undefined> {
    const [r] = await db!.select().from(resources).where(eq(resources.id, id));
    return r;
  }

  async createResource(data: InsertResource): Promise<Resource> {
    const [r] = await db!.insert(resources).values({ id: randomUUID(), ...data }).returning();
    return r;
  }

  async updateResource(id: string, update: Partial<InsertResource>): Promise<Resource | undefined> {
    const [r] = await db!.update(resources).set(update).where(eq(resources.id, id)).returning();
    return r;
  }

  async deleteResource(id: string): Promise<boolean> {
    const result = await db!.delete(resources).where(eq(resources.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getTeamMembers(workspaceId: string): Promise<TeamMember[]> {
    return db!.select().from(teamMembers).where(eq(teamMembers.workspaceId, workspaceId));
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const [m] = await db!.select().from(teamMembers).where(eq(teamMembers.id, id));
    return m;
  }

  async getTeamMemberByUserAndWorkspace(userId: string, workspaceId: string): Promise<TeamMember | undefined> {
    const [m] = await db!.select().from(teamMembers).where(and(eq(teamMembers.userId, userId), eq(teamMembers.workspaceId, workspaceId), eq(teamMembers.status, "accepted")));
    return m;
  }

  async countTeamMembersByOwner(ownerId: string): Promise<number> {
    const ownerWorkspaceList = await db!.select({ id: workspaces.id }).from(workspaces).where(eq(workspaces.ownerId, ownerId));
    if (ownerWorkspaceList.length === 0) return 1;
    const wsIds = ownerWorkspaceList.map((w) => w.id);
    const result = await db!
      .select({ count: sql<number>`COUNT(DISTINCT COALESCE(${teamMembers.userId}, ${teamMembers.email}))::int` })
      .from(teamMembers)
      .where(inArray(teamMembers.workspaceId, wsIds));
    return (result[0]?.count ?? 0) + 1;
  }

  async createTeamMember(data: InsertTeamMember): Promise<TeamMember> {
    const [m] = await db!.insert(teamMembers).values(data).returning();
    return m;
  }

  async updateTeamMember(id: number, update: Partial<InsertTeamMember>): Promise<TeamMember | undefined> {
    const [m] = await db!.update(teamMembers).set(update).where(eq(teamMembers.id, id)).returning();
    return m;
  }

  async deleteTeamMember(id: number): Promise<boolean> {
    const result = await db!.delete(teamMembers).where(eq(teamMembers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getKnowledgeBaseItems(workspaceId: string): Promise<KnowledgeBaseItem[]> {
    return db!.select().from(knowledgeBaseItems).where(eq(knowledgeBaseItems.workspaceId, workspaceId));
  }

  async getKnowledgeBaseItem(id: string): Promise<KnowledgeBaseItem | undefined> {
    const [k] = await db!.select().from(knowledgeBaseItems).where(eq(knowledgeBaseItems.id, id));
    return k;
  }

  async createKnowledgeBaseItem(data: InsertKnowledgeBaseItem): Promise<KnowledgeBaseItem> {
    const [k] = await db!.insert(knowledgeBaseItems).values({ id: randomUUID(), ...data }).returning();
    return k;
  }

  async updateKnowledgeBaseItem(id: string, update: Partial<InsertKnowledgeBaseItem>): Promise<KnowledgeBaseItem | undefined> {
    const [k] = await db!.update(knowledgeBaseItems).set(update).where(eq(knowledgeBaseItems.id, id)).returning();
    return k;
  }

  async deleteKnowledgeBaseItem(id: string): Promise<boolean> {
    const result = await db!.delete(knowledgeBaseItems).where(eq(knowledgeBaseItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getCallLogs(workspaceId: string): Promise<CallLog[]> {
    return db!.select().from(callLogs).where(eq(callLogs.workspaceId, workspaceId)).orderBy(desc(callLogs.createdAt));
  }

  async getCallLog(id: string): Promise<CallLog | undefined> {
    const [c] = await db!.select().from(callLogs).where(eq(callLogs.id, id));
    return c;
  }

  async createCallLog(data: InsertCallLog): Promise<CallLog> {
    const [c] = await db!.insert(callLogs).values({ id: randomUUID(), ...data }).returning();
    return c;
  }

  async updateCallLogByTwilioSid(twilioSid: string, updates: Partial<InsertCallLog>): Promise<CallLog | undefined> {
    const [c] = await db!.update(callLogs).set(updates).where(eq(callLogs.twilioSid, twilioSid)).returning();
    return c;
  }

  async getWidgetSettings(workspaceId: string): Promise<WidgetSettings | undefined> {
    const [s] = await db!.select().from(widgetSettings).where(eq(widgetSettings.workspaceId, workspaceId));
    return s;
  }

  async upsertWidgetSettings(data: InsertWidgetSettings): Promise<WidgetSettings> {
    const existing = await this.getWidgetSettings(data.workspaceId);
    if (existing) {
      const [s] = await db!.update(widgetSettings).set({ ...data, updatedAt: new Date() }).where(eq(widgetSettings.workspaceId, data.workspaceId)).returning();
      return s;
    }
    const [s] = await db!.insert(widgetSettings).values(data).returning();
    return s;
  }

  async getTwilioSettings(workspaceId: string): Promise<TwilioSettings | undefined> {
    const [s] = await db!.select().from(twilioSettings).where(eq(twilioSettings.workspaceId, workspaceId));
    if (!s) return s;
    return { ...s, authToken: decryptField(s.authToken) };
  }

  async upsertTwilioSettings(data: InsertTwilioSettings): Promise<TwilioSettings> {
    const encrypted = { ...data, authToken: encryptField(data.authToken) };
    const existing = await db!.select({ id: twilioSettings.id }).from(twilioSettings).where(eq(twilioSettings.workspaceId, data.workspaceId)).limit(1);
    if (existing.length) {
      const [s] = await db!.update(twilioSettings).set({ ...encrypted, updatedAt: new Date() }).where(eq(twilioSettings.workspaceId, data.workspaceId)).returning();
      return { ...s, authToken: decryptField(s.authToken) };
    }
    const [s] = await db!.insert(twilioSettings).values(encrypted).returning();
    return { ...s, authToken: decryptField(s.authToken) };
  }

  async getPaymentSettings(workspaceId: string): Promise<PaymentSettings | undefined> {
    const [s] = await db!.select().from(paymentSettings).where(eq(paymentSettings.workspaceId, workspaceId));
    if (!s) return s;
    return { ...s, stripeSecretKey: decryptField(s.stripeSecretKey), paypalClientSecret: decryptField(s.paypalClientSecret) };
  }

  async upsertPaymentSettings(data: InsertPaymentSettings): Promise<PaymentSettings> {
    const encrypted = { ...data, stripeSecretKey: encryptField(data.stripeSecretKey), paypalClientSecret: encryptField(data.paypalClientSecret) };
    const existing = await db!.select({ id: paymentSettings.id }).from(paymentSettings).where(eq(paymentSettings.workspaceId, data.workspaceId)).limit(1);
    if (existing.length) {
      const [s] = await db!.update(paymentSettings).set({ ...encrypted, updatedAt: new Date() }).where(eq(paymentSettings.workspaceId, data.workspaceId)).returning();
      return { ...s, stripeSecretKey: decryptField(s.stripeSecretKey), paypalClientSecret: decryptField(s.paypalClientSecret) };
    }
    const [s] = await db!.insert(paymentSettings).values(encrypted).returning();
    return { ...s, stripeSecretKey: decryptField(s.stripeSecretKey), paypalClientSecret: decryptField(s.paypalClientSecret) };
  }

  async getAiProviderSettings(workspaceId: string): Promise<AiProviderSettings[]> {
    const rows = await db!.select().from(aiProviderSettings).where(eq(aiProviderSettings.workspaceId, workspaceId));
    return rows.map(r => ({ ...r, apiKey: decryptField(r.apiKey) }));
  }

  async upsertAiProviderSettings(data: InsertAiProviderSettings): Promise<AiProviderSettings> {
    const encrypted = { ...data, apiKey: encryptField(data.apiKey) };
    const [existing] = await db!.select().from(aiProviderSettings).where(and(eq(aiProviderSettings.workspaceId, data.workspaceId), eq(aiProviderSettings.provider, data.provider)));
    if (existing) {
      const [s] = await db!.update(aiProviderSettings).set({ ...encrypted, updatedAt: new Date() }).where(eq(aiProviderSettings.id, existing.id)).returning();
      return { ...s, apiKey: decryptField(s.apiKey) };
    }
    const [s] = await db!.insert(aiProviderSettings).values(encrypted).returning();
    return { ...s, apiKey: decryptField(s.apiKey) };
  }

  async getAdminSetting(key: string): Promise<AdminSettings | undefined> {
    const [s] = await db!.select().from(adminSettings).where(eq(adminSettings.key, key));
    return s;
  }

  async setAdminSetting(key: string, value: any): Promise<AdminSettings> {
    const existing = await this.getAdminSetting(key);
    if (existing) {
      const [s] = await db!.update(adminSettings).set({ value, updatedAt: new Date() }).where(eq(adminSettings.key, key)).returning();
      return s;
    }
    const [s] = await db!.insert(adminSettings).values({ key, value }).returning();
    return s;
  }

  // Room Types
  async getRoomTypes(workspaceId: string): Promise<RoomType[]> {
    return db!.select().from(roomTypes).where(eq(roomTypes.workspaceId, workspaceId)).orderBy(asc(roomTypes.sortOrder));
  }

  async getRoomType(id: string): Promise<RoomType | undefined> {
    const [rt] = await db!.select().from(roomTypes).where(eq(roomTypes.id, id));
    return rt;
  }

  async createRoomType(data: InsertRoomType): Promise<RoomType> {
    const [rt] = await db!.insert(roomTypes).values({ id: randomUUID(), ...data }).returning();
    return rt;
  }

  async updateRoomType(id: string, update: Partial<InsertRoomType>): Promise<RoomType | undefined> {
    const [rt] = await db!.update(roomTypes).set({ ...update, updatedAt: new Date() }).where(eq(roomTypes.id, id)).returning();
    return rt;
  }

  async deleteRoomType(id: string): Promise<boolean> {
    const result = await db!.delete(roomTypes).where(eq(roomTypes.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Rooms
  async getRooms(workspaceId: string): Promise<Room[]> {
    return db!.select().from(rooms).where(eq(rooms.workspaceId, workspaceId));
  }

  async getRoomsByType(roomTypeId: string): Promise<Room[]> {
    return db!.select().from(rooms).where(eq(rooms.roomTypeId, roomTypeId));
  }

  async getRoom(id: string): Promise<Room | undefined> {
    const [r] = await db!.select().from(rooms).where(eq(rooms.id, id));
    return r;
  }

  async createRoom(data: InsertRoom): Promise<Room> {
    const [r] = await db!.insert(rooms).values({ id: randomUUID(), ...data }).returning();
    return r;
  }

  async updateRoom(id: string, update: Partial<InsertRoom>): Promise<Room | undefined> {
    const [r] = await db!.update(rooms).set(update).where(eq(rooms.id, id)).returning();
    return r;
  }

  async deleteRoom(id: string): Promise<boolean> {
    const result = await db!.delete(rooms).where(eq(rooms.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Room Bookings
  async getRoomBookings(workspaceId: string): Promise<RoomBooking[]> {
    return db!.select().from(roomBookings).where(eq(roomBookings.workspaceId, workspaceId)).orderBy(desc(roomBookings.createdAt));
  }

  async getRoomBookingsByDateRange(workspaceId: string, checkIn: string, checkOut: string): Promise<RoomBooking[]> {
    // Overlap formula: new.checkIn < existing.checkOut AND new.checkOut > existing.checkIn
    // Use timestamps for reliable comparison (handles both Date objects and strings)
    const newCheckInTs = new Date(checkIn).getTime();
    const newCheckOutTs = new Date(checkOut).getTime();
    const allBookings = await db!.select().from(roomBookings).where(eq(roomBookings.workspaceId, workspaceId));
    return allBookings.filter((rb) => {
      const existingCheckInTs = new Date(rb.checkIn).getTime();
      const existingCheckOutTs = new Date(rb.checkOut).getTime();
      return newCheckInTs < existingCheckOutTs && newCheckOutTs > existingCheckInTs;
    });
  }

  async getRoomBooking(id: string): Promise<RoomBooking | undefined> {
    const [rb] = await db!.select().from(roomBookings).where(eq(roomBookings.id, id));
    return rb;
  }

  async createRoomBooking(data: InsertRoomBooking): Promise<RoomBooking> {
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const [rb] = await db!.insert(roomBookings).values({ id: randomUUID(), confirmationCode, ...data }).returning();
    return rb;
  }

  async updateRoomBooking(id: string, update: Partial<InsertRoomBooking>): Promise<RoomBooking | undefined> {
    const [rb] = await db!.update(roomBookings).set({ ...update, updatedAt: new Date() }).where(eq(roomBookings.id, id)).returning();
    return rb;
  }

  async deleteRoomBooking(id: string): Promise<boolean> {
    const result = await db!.delete(roomBookings).where(eq(roomBookings.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getSupportTicketsByWorkspace(workspaceId: string): Promise<SupportTicket[]> {
    return db!.select().from(supportTickets).where(eq(supportTickets.workspaceId, workspaceId)).orderBy(desc(supportTickets.createdAt));
  }

  async getSupportTicketsByUser(userId: string): Promise<SupportTicket[]> {
    return db!.select().from(supportTickets).where(eq(supportTickets.userId, userId)).orderBy(desc(supportTickets.createdAt));
  }

  async createSupportTicket(data: InsertSupportTicket): Promise<SupportTicket> {
    const [ticket] = await db!.insert(supportTickets).values({ id: randomUUID(), ...data }).returning();
    return ticket;
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return db!.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  }

  async getSupportTicket(id: string): Promise<SupportTicket | undefined> {
    const [ticket] = await db!.select().from(supportTickets).where(eq(supportTickets.id, id));
    return ticket;
  }

  async updateSupportTicket(id: string, updates: Partial<InsertSupportTicket>): Promise<SupportTicket | undefined> {
    const [ticket] = await db!
      .update(supportTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(supportTickets.id, id))
      .returning();
    return ticket;
  }

  async getWidgetChatLogs(workspaceId: string): Promise<WidgetChatLog[]> {
    return db!.select().from(widgetChatLogs).where(eq(widgetChatLogs.workspaceId, workspaceId)).orderBy(desc(widgetChatLogs.createdAt));
  }

  async createWidgetChatLog(log: InsertWidgetChatLog): Promise<WidgetChatLog> {
    const [chatLog] = await db!.insert(widgetChatLogs).values(log).returning();
    return chatLog;
  }

  async updateWidgetChatLogMessageCount(sessionId: string): Promise<WidgetChatLog | undefined> {
    const [existing] = await db!.select().from(widgetChatLogs).where(eq(widgetChatLogs.sessionId, sessionId));
    if (!existing) return undefined;
    const [updated] = await db!
      .update(widgetChatLogs)
      .set({ messageCount: (existing.messageCount || 1) + 1, lastMessageAt: new Date() })
      .where(eq(widgetChatLogs.sessionId, sessionId))
      .returning();
    return updated;
  }

  async getWebsiteChangeRequests(workspaceId: string): Promise<WebsiteChangeRequest[]> {
    return db!.select().from(websiteChangeRequests).where(eq(websiteChangeRequests.workspaceId, workspaceId)).orderBy(desc(websiteChangeRequests.createdAt));
  }

  async createWebsiteChangeRequest(request: InsertWebsiteChangeRequest): Promise<WebsiteChangeRequest> {
    const [cr] = await db!.insert(websiteChangeRequests).values(request).returning();
    return cr;
  }

  async updateWebsiteChangeRequest(id: string, updates: Partial<InsertWebsiteChangeRequest>): Promise<WebsiteChangeRequest | undefined> {
    const [cr] = await db!.update(websiteChangeRequests).set({ ...updates, updatedAt: new Date() }).where(eq(websiteChangeRequests.id, id)).returning();
    return cr;
  }

  async getSeoSettings(workspaceId: string): Promise<SeoSettings[]> {
    const rows = await db!.select().from(seoSettings).where(eq(seoSettings.workspaceId, workspaceId));
    return rows.map(r => ({ ...r, apiKey: decryptField(r.apiKey), apiLogin: decryptField(r.apiLogin), apiPassword: decryptField(r.apiPassword) }));
  }

  async upsertSeoSettings(settings: InsertSeoSettings): Promise<SeoSettings> {
    const encrypted = { ...settings, apiKey: encryptField(settings.apiKey), apiLogin: encryptField(settings.apiLogin), apiPassword: encryptField(settings.apiPassword) };
    const existing = await db!.select().from(seoSettings).where(and(eq(seoSettings.workspaceId, settings.workspaceId), eq(seoSettings.provider, settings.provider)));
    if (existing.length > 0) {
      const [updated] = await db!.update(seoSettings).set({ ...encrypted, updatedAt: new Date() }).where(and(eq(seoSettings.workspaceId, settings.workspaceId), eq(seoSettings.provider, settings.provider))).returning();
      return { ...updated, apiKey: decryptField(updated.apiKey), apiLogin: decryptField(updated.apiLogin), apiPassword: decryptField(updated.apiPassword) };
    }
    const [created] = await db!.insert(seoSettings).values(encrypted).returning();
    return { ...created, apiKey: decryptField(created.apiKey), apiLogin: decryptField(created.apiLogin), apiPassword: decryptField(created.apiPassword) };
  }

  async getRankTrackerKeywords(workspaceId: string): Promise<RankTrackerKeyword[]> {
    return db!.select().from(rankTrackerKeywords).where(eq(rankTrackerKeywords.workspaceId, workspaceId)).orderBy(asc(rankTrackerKeywords.keyword));
  }

  async addRankTrackerKeywords(keywords: InsertRankTrackerKeyword[]): Promise<RankTrackerKeyword[]> {
    return db!.insert(rankTrackerKeywords).values(keywords).returning();
  }

  async deleteRankTrackerKeyword(id: number): Promise<void> {
    await db!.delete(rankTrackerKeywords).where(eq(rankTrackerKeywords.id, id));
  }

  async deleteAllRankTrackerKeywords(workspaceId: string): Promise<void> {
    await db!.delete(rankTrackerKeywords).where(eq(rankTrackerKeywords.workspaceId, workspaceId));
  }

  async getRankTrackerResults(workspaceId: string, page?: number, limit?: number): Promise<{ results: RankTrackerResult[]; total: number }> {
    const offset = ((page || 1) - 1) * (limit || 20);
    const [totalRow] = await db!.select({ count: count() }).from(rankTrackerResults).where(eq(rankTrackerResults.workspaceId, workspaceId));
    const results = await db!.select().from(rankTrackerResults).where(eq(rankTrackerResults.workspaceId, workspaceId)).orderBy(desc(rankTrackerResults.checkedAt)).limit(limit || 20).offset(offset);
    return { results, total: totalRow.count };
  }

  async getLatestRankTrackerResults(workspaceId: string): Promise<RankTrackerResult[]> {
    const lastCheck = await this.getLastRankCheckDate(workspaceId);
    if (!lastCheck) return [];
    return db!.select().from(rankTrackerResults).where(and(eq(rankTrackerResults.workspaceId, workspaceId), eq(rankTrackerResults.checkedAt, lastCheck))).orderBy(asc(rankTrackerResults.keyword));
  }

  async saveRankTrackerResults(results: InsertRankTrackerResult[]): Promise<RankTrackerResult[]> {
    return db!.insert(rankTrackerResults).values(results).returning();
  }

  async getLastRankCheckDate(workspaceId: string): Promise<Date | null> {
    const [row] = await db!.select({ maxDate: max(rankTrackerResults.checkedAt) }).from(rankTrackerResults).where(eq(rankTrackerResults.workspaceId, workspaceId));
    return row?.maxDate || null;
  }

  async getGridKeywords(workspaceId: string): Promise<GridKeyword[]> {
    return db!.select().from(gridKeywords).where(eq(gridKeywords.workspaceId, workspaceId)).orderBy(asc(gridKeywords.keyword));
  }

  async addGridKeywords(keywords: InsertGridKeyword[]): Promise<GridKeyword[]> {
    return db!.insert(gridKeywords).values(keywords).returning();
  }

  async deleteGridKeyword(id: number): Promise<void> {
    await db!.delete(gridKeywords).where(eq(gridKeywords.id, id));
  }

  async deleteAllGridKeywords(workspaceId: string): Promise<void> {
    await db!.delete(gridKeywords).where(eq(gridKeywords.workspaceId, workspaceId));
  }

  async getGridRefreshCredits(workspaceId: string): Promise<GridRefreshCredits> {
    const [existing] = await db!.select().from(gridRefreshCredits).where(eq(gridRefreshCredits.workspaceId, workspaceId));
    if (existing) return existing;
    const [created] = await db!.insert(gridRefreshCredits).values({ workspaceId, balance: 3, totalPurchased: 3, totalUsed: 0 }).returning();
    await db!.insert(gridRefreshHistory).values({ workspaceId, type: "bonus", amount: 3, description: "Welcome bonus — $5 starter credit" });
    return created;
  }

  async addGridRefreshCredits(workspaceId: string, amount: number, description: string): Promise<GridRefreshCredits> {
    const credits = await this.getGridRefreshCredits(workspaceId);
    const [updated] = await db!.update(gridRefreshCredits)
      .set({ balance: credits.balance + amount, totalPurchased: credits.totalPurchased + amount, updatedAt: new Date() })
      .where(eq(gridRefreshCredits.workspaceId, workspaceId))
      .returning();
    await db!.insert(gridRefreshHistory).values({ workspaceId, type: "purchase", amount, description });
    return updated;
  }

  async useGridRefreshCredit(workspaceId: string): Promise<{ success: boolean; balance: number }> {
    const credits = await this.getGridRefreshCredits(workspaceId);
    if (credits.balance <= 0) return { success: false, balance: 0 };
    const [updated] = await db!.update(gridRefreshCredits)
      .set({ balance: credits.balance - 1, totalUsed: credits.totalUsed + 1, updatedAt: new Date() })
      .where(eq(gridRefreshCredits.workspaceId, workspaceId))
      .returning();
    await db!.insert(gridRefreshHistory).values({ workspaceId, type: "usage", amount: -1, description: "Grid refresh" });
    return { success: true, balance: updated.balance };
  }

  async getGridRefreshHistory(workspaceId: string): Promise<GridRefreshHistory[]> {
    return db!.select().from(gridRefreshHistory).where(eq(gridRefreshHistory.workspaceId, workspaceId)).orderBy(desc(gridRefreshHistory.createdAt));
  }

  async getRankTrackerCredits(workspaceId: string): Promise<RankTrackerCredits> {
    const [existing] = await db!.select().from(rankTrackerCredits).where(eq(rankTrackerCredits.workspaceId, workspaceId));
    if (existing) return existing;
    const [created] = await db!.insert(rankTrackerCredits).values({ workspaceId, balance: 5, totalPurchased: 0, totalUsed: 0 }).returning();
    await db!.insert(rankTrackerHistory).values({ workspaceId, type: "bonus", amount: 5, description: "Welcome bonus — $5 starter credit" });
    return created;
  }

  async addRankTrackerCredits(workspaceId: string, amount: number, description: string): Promise<RankTrackerCredits> {
    const credits = await this.getRankTrackerCredits(workspaceId);
    const [updated] = await db!.update(rankTrackerCredits)
      .set({ balance: credits.balance + amount, totalPurchased: credits.totalPurchased + amount, updatedAt: new Date() })
      .where(eq(rankTrackerCredits.workspaceId, workspaceId))
      .returning();
    await db!.insert(rankTrackerHistory).values({ workspaceId, type: "purchase", amount, description });
    return updated;
  }

  async useRankTrackerCredit(workspaceId: string): Promise<{ success: boolean; balance: number }> {
    const credits = await this.getRankTrackerCredits(workspaceId);
    if (credits.balance <= 0) return { success: false, balance: 0 };
    const [updated] = await db!.update(rankTrackerCredits)
      .set({ balance: credits.balance - 1, totalUsed: credits.totalUsed + 1, updatedAt: new Date() })
      .where(eq(rankTrackerCredits.workspaceId, workspaceId))
      .returning();
    await db!.insert(rankTrackerHistory).values({ workspaceId, type: "usage", amount: -1, description: "Rank check" });
    return { success: true, balance: updated.balance };
  }

  async getRankTrackerHistory(workspaceId: string): Promise<RankTrackerHistory[]> {
    return db!.select().from(rankTrackerHistory).where(eq(rankTrackerHistory.workspaceId, workspaceId)).orderBy(desc(rankTrackerHistory.createdAt));
  }

  async saveGridScanResults(results: InsertGridScanResult[]): Promise<GridScanResult[]> {
    if (results.length === 0) return [];
    const saved = await db!.insert(gridScanResults).values(results).returning();
    return saved;
  }

  async getLatestGridScanResults(workspaceId: string, keyword: string): Promise<GridScanResult[]> {
    const [latest] = await db!.select({ scanDate: max(gridScanResults.scanDate) })
      .from(gridScanResults)
      .where(and(eq(gridScanResults.workspaceId, workspaceId), eq(gridScanResults.keyword, keyword)));
    if (!latest?.scanDate) return [];
    return db!.select().from(gridScanResults)
      .where(and(
        eq(gridScanResults.workspaceId, workspaceId),
        eq(gridScanResults.keyword, keyword),
        eq(gridScanResults.scanDate, latest.scanDate)
      ))
      .orderBy(asc(gridScanResults.gridIndex));
  }

  async getGridScanKeywords(workspaceId: string): Promise<string[]> {
    const rows = await db!.selectDistinct({ keyword: gridScanResults.keyword })
      .from(gridScanResults)
      .where(eq(gridScanResults.workspaceId, workspaceId));
    return rows.map(r => r.keyword);
  }

  async getWorkspaceDomains(workspaceId: string): Promise<WorkspaceDomain[]> {
    return db!.select().from(workspaceDomains).where(eq(workspaceDomains.workspaceId, workspaceId));
  }
  async getWorkspaceDomain(id: string): Promise<WorkspaceDomain | undefined> {
    const [row] = await db!.select().from(workspaceDomains).where(eq(workspaceDomains.id, id));
    return row;
  }
  async getWorkspaceDomainByDomain(domain: string): Promise<WorkspaceDomain | undefined> {
    const [row] = await db!.select().from(workspaceDomains).where(eq(workspaceDomains.domain, domain.toLowerCase()));
    return row;
  }
  async createWorkspaceDomain(data: InsertWorkspaceDomain): Promise<WorkspaceDomain> {
    const normalizedDomain = data.domain.toLowerCase();

    return await db!.transaction(async (tx) => {
      const existing = await tx
        .select({ id: workspaceDomains.id })
        .from(workspaceDomains)
        .where(eq(workspaceDomains.workspaceId, data.workspaceId))
        .limit(1);

      if (existing.length === 0) {
        const [row] = await tx
          .insert(workspaceDomains)
          .values({
            ...data,
            domain: normalizedDomain,
            isPrimary: true,
          })
          .returning();
        return row;
      }

      if (data.isPrimary === true) {
        await tx
          .update(workspaceDomains)
          .set({ isPrimary: false })
          .where(and(
            eq(workspaceDomains.workspaceId, data.workspaceId),
            eq(workspaceDomains.isPrimary, true)
          ));

        const [row] = await tx
          .insert(workspaceDomains)
          .values({
            ...data,
            domain: normalizedDomain,
            isPrimary: true,
          })
          .returning();
        return row;
      }

      const [row] = await tx
        .insert(workspaceDomains)
        .values({
          ...data,
          domain: normalizedDomain,
          isPrimary: false,
        })
        .returning();

      return row;
    });
  }
  async updateWorkspaceDomain(id: string, data: Partial<Pick<WorkspaceDomain, "domain" | "blogTemplate" | "isPrimary" | "accentColor" | "accentForeground">>): Promise<WorkspaceDomain | undefined> {
    if (data.isPrimary === true) {
      const existing = await db!.select({ workspaceId: workspaceDomains.workspaceId }).from(workspaceDomains).where(eq(workspaceDomains.id, id)).limit(1);
      if (!existing.length) return undefined;
      const workspaceId = existing[0].workspaceId;
      const { isPrimary, ...otherFields } = data;
      if (otherFields.domain) otherFields.domain = otherFields.domain.toLowerCase();
      // Atomic swap: partial unique index (venue_domains_one_primary_per_venue)
      // allows only one isPrimary=true per workspace. Unset others first, then set
      // the target, all inside one transaction for concurrency safety.
      return await db!.transaction(async (tx) => {
        await tx.update(workspaceDomains)
          .set({ isPrimary: false })
          .where(and(
            eq(workspaceDomains.workspaceId, workspaceId),
            eq(workspaceDomains.isPrimary, true),
            ne(workspaceDomains.id, id)
          ));
        const [row] = await tx.update(workspaceDomains)
          .set({ ...otherFields, isPrimary: true })
          .where(and(eq(workspaceDomains.id, id), eq(workspaceDomains.workspaceId, workspaceId)))
          .returning();
        return row ?? undefined;
      });
    }
    const updateSet = { ...data };
    if (updateSet.domain) updateSet.domain = updateSet.domain.toLowerCase();
    const [row] = await db!.update(workspaceDomains).set(updateSet).where(eq(workspaceDomains.id, id)).returning();
    return row ?? undefined;
  }
  async deleteWorkspaceDomain(id: string): Promise<boolean> {
    return await db!.transaction(async (tx) => {
      const existing = await tx
        .select({
          workspaceId: workspaceDomains.workspaceId,
          isPrimary: workspaceDomains.isPrimary,
        })
        .from(workspaceDomains)
        .where(eq(workspaceDomains.id, id))
        .limit(1);

      if (!existing.length) return false;

      const { workspaceId, isPrimary } = existing[0];

      const [{ count }] = await tx
        .select({ count: sql<number>`count(*)` })
        .from(workspaceDomains)
        .where(eq(workspaceDomains.workspaceId, workspaceId));

      if (isPrimary && Number(count) > 1) {
        const replacement = await tx
          .select({ id: workspaceDomains.id })
          .from(workspaceDomains)
          .where(and(
            eq(workspaceDomains.workspaceId, workspaceId),
            ne(workspaceDomains.id, id)
          ))
          .limit(1);

        if (replacement.length) {
          await tx
            .update(workspaceDomains)
            .set({ isPrimary: true })
            .where(eq(workspaceDomains.id, replacement[0].id));
        }
      }

      const deleted = await tx
        .delete(workspaceDomains)
        .where(eq(workspaceDomains.id, id))
        .returning();

      return deleted.length > 0;
    });
  }

  async countBlogPostsThisMonth(workspaceId: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const result = await db!
      .select({ count: sql<number>`count(*)::int` })
      .from(workspaceBlogPosts)
      .where(and(
        eq(workspaceBlogPosts.workspaceId, workspaceId),
        lte(sql`${startOfMonth}`, workspaceBlogPosts.createdAt)
      ));
    return result[0]?.count ?? 0;
  }

  async getWorkspaceBlogPosts(workspaceId: string, status?: string): Promise<WorkspaceBlogPost[]> {
    if (status) {
      return db!.select().from(workspaceBlogPosts).where(and(eq(workspaceBlogPosts.workspaceId, workspaceId), eq(workspaceBlogPosts.status, status))).orderBy(desc(workspaceBlogPosts.createdAt));
    }
    return db!.select().from(workspaceBlogPosts).where(eq(workspaceBlogPosts.workspaceId, workspaceId)).orderBy(desc(workspaceBlogPosts.createdAt));
  }
  async getWorkspaceBlogPost(id: string): Promise<WorkspaceBlogPost | undefined> {
    const [row] = await db!.select().from(workspaceBlogPosts).where(eq(workspaceBlogPosts.id, id));
    return row;
  }
  async getWorkspaceBlogPostBySlug(workspaceId: string, slug: string): Promise<WorkspaceBlogPost | undefined> {
    const [row] = await db!.select().from(workspaceBlogPosts).where(and(eq(workspaceBlogPosts.workspaceId, workspaceId), eq(workspaceBlogPosts.slug, slug)));
    return row;
  }
  async getPublishedPostsByWorkspace(workspaceId: string): Promise<WorkspaceBlogPost[]> {
    return db!.select().from(workspaceBlogPosts).where(and(eq(workspaceBlogPosts.workspaceId, workspaceId), eq(workspaceBlogPosts.status, "published"))).orderBy(desc(workspaceBlogPosts.publishedAt));
  }
  async getScheduledPostsDue(): Promise<WorkspaceBlogPost[]> {
    return db!.select().from(workspaceBlogPosts).where(and(eq(workspaceBlogPosts.status, "scheduled"), lte(workspaceBlogPosts.publishAt, new Date())));
  }
  async createWorkspaceBlogPost(post: InsertWorkspaceBlogPost): Promise<WorkspaceBlogPost> {
    const [row] = await db!.insert(workspaceBlogPosts).values(post).returning();
    return row;
  }
  async bulkCreateWorkspaceBlogPosts(posts: InsertWorkspaceBlogPost[]): Promise<WorkspaceBlogPost[]> {
    if (posts.length === 0) return [];
    const rows = await db!.insert(workspaceBlogPosts).values(posts).returning();
    return rows;
  }
  async getWorkspaceBlogPostsByCampaign(workspaceId: string, campaignId: string): Promise<WorkspaceBlogPost[]> {
    return db!.select().from(workspaceBlogPosts).where(and(eq(workspaceBlogPosts.workspaceId, workspaceId), eq(workspaceBlogPosts.campaignId, campaignId))).orderBy(desc(workspaceBlogPosts.createdAt));
  }
  async createContentCampaign(data: InsertContentCampaign): Promise<ContentCampaign> {
    const [row] = await db!.insert(contentCampaigns).values(data).returning();
    return row;
  }
  async getContentCampaign(id: string): Promise<ContentCampaign | undefined> {
    const [row] = await db!.select().from(contentCampaigns).where(eq(contentCampaigns.id, id));
    return row;
  }
  async updateContentCampaign(id: string, data: Partial<ContentCampaign>): Promise<ContentCampaign | undefined> {
    const [row] = await db!.update(contentCampaigns).set({ ...data, updatedAt: new Date() }).where(eq(contentCampaigns.id, id)).returning();
    return row;
  }
  async getWorkspaceCampaigns(workspaceId: string): Promise<{ campaignId: string; name: string; status: string; postCount: number; createdAt: Date; statuses: Record<string, number> }[]> {
    const posts = await db!.select().from(workspaceBlogPosts).where(and(eq(workspaceBlogPosts.workspaceId, workspaceId), sql`${workspaceBlogPosts.campaignId} IS NOT NULL`)).orderBy(desc(workspaceBlogPosts.createdAt));
    const campaignIds = [...new Set(posts.map(p => p.campaignId!))];
    const campaignRecords = campaignIds.length > 0
      ? await db!.select().from(contentCampaigns).where(sql`${contentCampaigns.id} IN (${sql.join(campaignIds.map(id => sql`${id}`), sql`, `)})`)
      : [];
    const campaignMap = new Map(campaignRecords.map(c => [c.id, c]));
    const map = new Map<string, WorkspaceBlogPost[]>();
    for (const p of posts) {
      const arr = map.get(p.campaignId!) || [];
      arr.push(p);
      map.set(p.campaignId!, arr);
    }
    return Array.from(map.entries()).map(([campaignId, cPosts]) => {
      const statuses: Record<string, number> = {};
      for (const p of cPosts) {
        const s = p.generationStatus || "pending";
        statuses[s] = (statuses[s] || 0) + 1;
      }
      const earliest = cPosts.reduce((min, p) => (p.createdAt && p.createdAt < min ? p.createdAt : min), cPosts[0].createdAt || new Date());
      const campaign = campaignMap.get(campaignId);
      return { campaignId, name: campaign?.name || `Campaign ${campaignId.slice(0, 8)}`, status: campaign?.status || "active", postCount: cPosts.length, createdAt: earliest, statuses };
    }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  async updateWorkspaceBlogPost(id: string, post: Partial<WorkspaceBlogPost>): Promise<WorkspaceBlogPost | undefined> {
    const { id: _id, createdAt: _c, ...updates } = post as any;
    const [row] = await db!.update(workspaceBlogPosts).set({ ...updates, updatedAt: new Date() }).where(eq(workspaceBlogPosts.id, id)).returning();
    return row;
  }
  async deleteWorkspaceBlogPost(id: string): Promise<boolean> {
    const result = await db!.delete(workspaceBlogPosts).where(eq(workspaceBlogPosts.id, id)).returning();
    return result.length > 0;
  }

  async getCmsApiKeys(workspaceId: string): Promise<CmsApiKey[]> {
    return db!.select().from(cmsApiKeys).where(eq(cmsApiKeys.workspaceId, workspaceId)).orderBy(desc(cmsApiKeys.createdAt));
  }
  async createCmsApiKey(data: InsertCmsApiKey): Promise<CmsApiKey> {
    const [row] = await db!.insert(cmsApiKeys).values(data).returning();
    return row;
  }
  async deleteCmsApiKey(id: string): Promise<boolean> {
    const result = await db!.delete(cmsApiKeys).where(eq(cmsApiKeys.id, id)).returning();
    return result.length > 0;
  }
  async getCmsSyncLogs(workspaceId: string): Promise<CmsSyncLog[]> {
    return db!.select().from(cmsSyncLogs).where(eq(cmsSyncLogs.workspaceId, workspaceId)).orderBy(desc(cmsSyncLogs.createdAt)).limit(100);
  }
  async getContentAssets(postId: string): Promise<ContentAsset[]> {
    return db!.select().from(contentAssets).where(eq(contentAssets.postId, postId));
  }
  async searchContentAssets(workspaceId: string, query?: string): Promise<ContentAsset[]> {
    const conditions = [eq(contentAssets.workspaceId, workspaceId)];
    if (query) {
      const pattern = `%${query}%`;
      conditions.push(or(ilike(contentAssets.prompt, pattern), ilike(contentAssets.title, pattern))!);
    }
    return db!.select().from(contentAssets).where(and(...conditions)).orderBy(desc(contentAssets.createdAt)).limit(100);
  }
  async createContentAsset(asset: InsertContentAsset): Promise<ContentAsset> {
    const [row] = await db!.insert(contentAssets).values(asset).returning();
    return row;
  }
  async createContentAssetUsage(usage: InsertContentAssetUsage): Promise<ContentAssetUsage> {
    const [row] = await db!.insert(contentAssetUsage).values(usage).returning();
    return row;
  }
  async getContentAssetUsage(postId: string): Promise<ContentAssetUsage[]> {
    return db!.select().from(contentAssetUsage).where(eq(contentAssetUsage.postId, postId));
  }

  async getCrmContacts(workspaceId?: string): Promise<CrmContact[]> {
    if (workspaceId) return db!.select().from(crmContacts).where(eq(crmContacts.workspaceId, workspaceId)).orderBy(desc(crmContacts.createdAt));
    return db!.select().from(crmContacts).orderBy(desc(crmContacts.createdAt));
  }
  async getCrmContact(id: number): Promise<CrmContact | undefined> {
    const [row] = await db!.select().from(crmContacts).where(eq(crmContacts.id, id));
    return row;
  }
  async createCrmContact(data: InsertCrmContact): Promise<CrmContact> {
    const [row] = await db!.insert(crmContacts).values(data).returning();
    return row;
  }
  async updateCrmContact(id: number, data: Partial<InsertCrmContact>): Promise<CrmContact | undefined> {
    const [row] = await db!.update(crmContacts).set({ ...data, updatedAt: new Date() }).where(eq(crmContacts.id, id)).returning();
    return row;
  }
  async deleteCrmContact(id: number): Promise<boolean> {
    const result = await db!.delete(crmContacts).where(eq(crmContacts.id, id)).returning();
    return result.length > 0;
  }

  async getCrmPipelineStages(workspaceId?: string): Promise<CrmPipelineStage[]> {
    if (workspaceId) return db!.select().from(crmPipelineStages).where(eq(crmPipelineStages.workspaceId, workspaceId)).orderBy(asc(crmPipelineStages.position));
    return db!.select().from(crmPipelineStages).orderBy(asc(crmPipelineStages.position));
  }
  async createCrmPipelineStage(data: InsertCrmPipelineStage): Promise<CrmPipelineStage> {
    const [row] = await db!.insert(crmPipelineStages).values(data).returning();
    return row;
  }
  async updateCrmPipelineStage(id: number, data: Partial<InsertCrmPipelineStage>): Promise<CrmPipelineStage | undefined> {
    const [row] = await db!.update(crmPipelineStages).set(data).where(eq(crmPipelineStages.id, id)).returning();
    return row;
  }
  async deleteCrmPipelineStage(id: number): Promise<boolean> {
    const result = await db!.delete(crmPipelineStages).where(eq(crmPipelineStages.id, id)).returning();
    return result.length > 0;
  }

  async getCrmDeals(workspaceId?: string): Promise<CrmDeal[]> {
    if (workspaceId) return db!.select().from(crmDeals).where(eq(crmDeals.workspaceId, workspaceId)).orderBy(desc(crmDeals.createdAt));
    return db!.select().from(crmDeals).orderBy(desc(crmDeals.createdAt));
  }
  async getCrmDeal(id: number): Promise<CrmDeal | undefined> {
    const [row] = await db!.select().from(crmDeals).where(eq(crmDeals.id, id));
    return row;
  }
  async createCrmDeal(data: InsertCrmDeal): Promise<CrmDeal> {
    const [row] = await db!.insert(crmDeals).values(data).returning();
    return row;
  }
  async updateCrmDeal(id: number, data: Partial<InsertCrmDeal>): Promise<CrmDeal | undefined> {
    const [row] = await db!.update(crmDeals).set({ ...data, updatedAt: new Date() }).where(eq(crmDeals.id, id)).returning();
    return row;
  }
  async deleteCrmDeal(id: number): Promise<boolean> {
    const result = await db!.delete(crmDeals).where(eq(crmDeals.id, id)).returning();
    return result.length > 0;
  }

  async getInvoices(workspaceId?: string): Promise<Invoice[]> {
    if (workspaceId) return db!.select().from(invoices).where(eq(invoices.workspaceId, workspaceId)).orderBy(desc(invoices.createdAt));
    return db!.select().from(invoices).orderBy(desc(invoices.createdAt));
  }
  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [row] = await db!.select().from(invoices).where(eq(invoices.id, id));
    return row;
  }
  async createInvoice(data: InsertInvoice): Promise<Invoice> {
    const [row] = await db!.insert(invoices).values(data).returning();
    return row;
  }
  async updateInvoice(id: number, data: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const [row] = await db!.update(invoices).set({ ...data, updatedAt: new Date() }).where(eq(invoices.id, id)).returning();
    return row;
  }
  async deleteInvoice(id: number): Promise<boolean> {
    const result = await db!.delete(invoices).where(eq(invoices.id, id)).returning();
    return result.length > 0;
  }

  async getInvoiceLineItems(invoiceId: number): Promise<InvoiceLineItem[]> {
    return db!.select().from(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, invoiceId)).orderBy(asc(invoiceLineItems.sortOrder));
  }
  async createInvoiceLineItem(data: InsertInvoiceLineItem): Promise<InvoiceLineItem> {
    const [row] = await db!.insert(invoiceLineItems).values(data).returning();
    return row;
  }
  async updateInvoiceLineItem(id: number, data: Partial<InsertInvoiceLineItem>): Promise<InvoiceLineItem | undefined> {
    const [row] = await db!.update(invoiceLineItems).set(data).where(eq(invoiceLineItems.id, id)).returning();
    return row;
  }
  async deleteInvoiceLineItem(id: number): Promise<boolean> {
    const result = await db!.delete(invoiceLineItems).where(eq(invoiceLineItems.id, id)).returning();
    return result.length > 0;
  }
  async deleteInvoiceLineItemsByInvoice(invoiceId: number): Promise<void> {
    await db!.delete(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, invoiceId));
  }

  async getContentReports(workspaceId?: string): Promise<ContentReport[]> {
    if (workspaceId) return db!.select().from(contentReports).where(eq(contentReports.workspaceId, workspaceId)).orderBy(desc(contentReports.createdAt));
    return db!.select().from(contentReports).orderBy(desc(contentReports.createdAt));
  }
  async getContentReport(id: number): Promise<ContentReport | undefined> {
    const [row] = await db!.select().from(contentReports).where(eq(contentReports.id, id));
    return row;
  }
  async createContentReport(data: InsertContentReport): Promise<ContentReport> {
    const [row] = await db!.insert(contentReports).values(data).returning();
    return row;
  }
  async updateContentReport(id: number, data: Partial<InsertContentReport>): Promise<ContentReport | undefined> {
    const [row] = await db!.update(contentReports).set({ ...data, updatedAt: new Date() }).where(eq(contentReports.id, id)).returning();
    return row;
  }
  async deleteContentReport(id: number): Promise<boolean> {
    const result = await db!.delete(contentReports).where(eq(contentReports.id, id)).returning();
    return result.length > 0;
  }

  async getSiteProfile(workspaceId: string): Promise<WorkspaceSiteProfile | undefined> {
    const [row] = await db!.select().from(workspaceSiteProfiles).where(eq(workspaceSiteProfiles.workspaceId, workspaceId));
    return row;
  }
  async upsertSiteProfile(data: InsertWorkspaceSiteProfile): Promise<WorkspaceSiteProfile> {
    if (data.workspaceId) {
      const existing = await this.getSiteProfile(data.workspaceId);
      if (existing) {
        const [row] = await db!.update(workspaceSiteProfiles).set({ ...data, updatedAt: new Date() }).where(eq(workspaceSiteProfiles.id, existing.id)).returning();
        return row;
      }
    }
    const [row] = await db!.insert(workspaceSiteProfiles).values(data).returning();
    return row;
  }

  async getSitePages(workspaceId: string): Promise<WorkspaceSitePage[]> {
    return db!.select().from(workspaceSitePages).where(eq(workspaceSitePages.workspaceId, workspaceId)).orderBy(asc(workspaceSitePages.sortOrder));
  }
  async getSitePage(id: number): Promise<WorkspaceSitePage | undefined> {
    const [row] = await db!.select().from(workspaceSitePages).where(eq(workspaceSitePages.id, id));
    return row;
  }
  async createSitePage(data: InsertWorkspaceSitePage): Promise<WorkspaceSitePage> {
    const [row] = await db!.insert(workspaceSitePages).values(data).returning();
    return row;
  }
  async updateSitePage(id: number, data: Partial<InsertWorkspaceSitePage>): Promise<WorkspaceSitePage | undefined> {
    const [row] = await db!.update(workspaceSitePages).set({ ...data, updatedAt: new Date() }).where(eq(workspaceSitePages.id, id)).returning();
    return row;
  }
  async deleteSitePage(id: number): Promise<boolean> {
    const result = await db!.delete(workspaceSitePages).where(eq(workspaceSitePages.id, id)).returning();
    return result.length > 0;
  }

  async getPostKeywordIndex(workspaceId: string): Promise<PostKeywordIndex[]> {
    return db!.select().from(postKeywordIndex).where(eq(postKeywordIndex.workspaceId, workspaceId)).orderBy(desc(postKeywordIndex.frequency));
  }
  async getPostKeywordIndexByPost(postId: string): Promise<PostKeywordIndex[]> {
    return db!.select().from(postKeywordIndex).where(eq(postKeywordIndex.postId, postId));
  }
  async getPostKeywordIndexByKeyword(workspaceId: string, keyword: string): Promise<PostKeywordIndex[]> {
    return db!.select().from(postKeywordIndex).where(and(eq(postKeywordIndex.workspaceId, workspaceId), eq(postKeywordIndex.keyword, keyword)));
  }
  async upsertPostKeywordIndex(data: InsertPostKeywordIndex): Promise<PostKeywordIndex> {
    const [row] = await db!.insert(postKeywordIndex).values(data).returning();
    return row;
  }
  async bulkUpsertPostKeywordIndex(items: InsertPostKeywordIndex[]): Promise<PostKeywordIndex[]> {
    if (items.length === 0) return [];
    const rows = await db!.insert(postKeywordIndex).values(items).returning();
    return rows;
  }
  async deletePostKeywordIndexByPost(postId: string): Promise<void> {
    await db!.delete(postKeywordIndex).where(eq(postKeywordIndex.postId, postId));
  }

  async getPostValidationResults(postId: string): Promise<PostValidationResult[]> {
    return db!.select().from(postValidationResults).where(eq(postValidationResults.postId, postId)).orderBy(desc(postValidationResults.createdAt));
  }
  async getPostValidationResultsByWorkspace(workspaceId: string): Promise<PostValidationResult[]> {
    return db!.select().from(postValidationResults).where(eq(postValidationResults.workspaceId, workspaceId)).orderBy(desc(postValidationResults.createdAt));
  }
  async createPostValidationResult(data: InsertPostValidationResult): Promise<PostValidationResult> {
    const [row] = await db!.insert(postValidationResults).values(data).returning();
    return row;
  }
  async bulkCreatePostValidationResults(items: InsertPostValidationResult[]): Promise<PostValidationResult[]> {
    if (items.length === 0) return [];
    const rows = await db!.insert(postValidationResults).values(items).returning();
    return rows;
  }
  async deletePostValidationResultsByPost(postId: string): Promise<void> {
    await db!.delete(postValidationResults).where(eq(postValidationResults.postId, postId));
  }
  async updatePostValidationResult(id: number, data: Partial<InsertPostValidationResult>): Promise<PostValidationResult | undefined> {
    const [row] = await db!.update(postValidationResults).set(data).where(eq(postValidationResults.id, id)).returning();
    return row;
  }
}

export const storage: IStorage = process.env.DATABASE_URL ? new DbStorage() : new MemStorage();
