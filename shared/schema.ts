import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, serial, jsonb, numeric, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const venues = pgTable("venues", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id", { length: 36 }).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  timezone: text("timezone").notNull().default("America/New_York"),
  plan: text("plan").notNull().default("complete"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  shardId: integer("shard_id").notNull().default(1),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
});

export const venueBlogPosts = pgTable("venue_blog_posts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  tags: jsonb("tags").$type<string[]>(),
  mdxContent: text("mdx_content").notNull().default(""),
  compiledHtml: text("compiled_html"),
  status: text("status").notNull().default("draft"),
  publishAt: timestamp("publish_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  primaryKeyword: text("primary_keyword"),
  intent: text("intent"),
  funnel: text("funnel"),
  generationStatus: text("generation_status").default("pending"),
  qualityGateStatus: text("quality_gate_status").default("unknown"),
  qualityFailReasons: jsonb("quality_fail_reasons").$type<string[]>(),
  campaignId: varchar("campaign_id", { length: 36 }),
});

export const venueDomains = pgTable("venue_domains", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  domain: text("domain").notNull().unique(),
  isPrimary: boolean("is_primary").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  blogTemplate: text("blog_template").notNull().default("editorial"),
  accentColor: text("accent_color"),
  accentForeground: text("accent_foreground"),
});

export const contentCampaigns = pgTable("content_campaigns", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  name: text("name").notNull(),
  status: text("status").notNull().default("draft"),
  timezone: text("timezone").notNull().default("UTC"),
  startDate: date("start_date"),
  durationWeeks: integer("duration_weeks"),
  postsTotal: integer("posts_total"),
  publishDays: jsonb("publish_days"),
  publishTimeLocal: text("publish_time_local"),
  cadenceJson: jsonb("cadence_json"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contentAssets = pgTable("content_assets", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }),
  postId: varchar("post_id", { length: 36 }),
  source: text("source").notNull(),
  sourceAssetId: text("source_asset_id"),
  type: text("type").notNull().default("generic"),
  prompt: text("prompt"),
  title: text("title"),
  width: integer("width"),
  height: integer("height"),
  originalUrl: text("original_url").notNull(),
  r2Key: text("r2_key"),
  publicUrl: text("public_url"),
  creditName: text("credit_name"),
  creditUrl: text("credit_url"),
  licenseNote: text("license_note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contentAssetUsage = pgTable("content_asset_usage", {
  id: serial("id").primaryKey(),
  postId: varchar("post_id", { length: 36 }).notNull(),
  assetId: varchar("asset_id", { length: 36 }).notNull(),
  position: integer("position").notNull().default(0),
  placement: text("placement").notNull().default("inline"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rankTrackerKeywords = pgTable("rank_tracker_keywords", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  keyword: text("keyword").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rankTrackerResults = pgTable("rank_tracker_results", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  keywordId: integer("keyword_id").notNull(),
  keyword: text("keyword").notNull(),
  position: integer("position"),
  previousPosition: integer("previous_position"),
  url: text("url"),
  searchEngine: text("search_engine").notNull().default("google"),
  checkedAt: timestamp("checked_at").defaultNow(),
});

export const rankTrackerCredits = pgTable("rank_tracker_credits", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  balance: integer("balance").notNull().default(5),
  totalPurchased: integer("total_purchased").notNull().default(0),
  totalUsed: integer("total_used").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rankTrackerHistory = pgTable("rank_tracker_history", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  type: text("type").notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gridKeywords = pgTable("grid_keywords", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  keyword: text("keyword").notNull(),
  gridSize: integer("grid_size").notNull().default(5),
  distance: numeric("distance", { precision: 4, scale: 1 }).notNull().default("2.0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gridScanResults = pgTable("grid_scan_results", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  keyword: text("keyword").notNull(),
  gridSize: integer("grid_size").notNull(),
  gridIndex: integer("grid_index").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }).notNull(),
  longitude: numeric("longitude", { precision: 10, scale: 7 }).notNull(),
  rank: integer("rank"),
  businessName: text("business_name"),
  scanDate: timestamp("scan_date").defaultNow(),
});

export const gridRefreshCredits = pgTable("grid_refresh_credits", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  balance: integer("balance").notNull().default(0),
  totalPurchased: integer("total_purchased").notNull().default(0),
  totalUsed: integer("total_used").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastFreeScanDate: date("last_free_scan_date"),
});

export const gridRefreshHistory = pgTable("grid_refresh_history", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  type: text("type").notNull(),
  amount: integer("amount").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  venueType: text("venue_type"),
  inquiryType: text("inquiry_type"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const seoSettings = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  provider: text("provider").notNull(),
  apiKey: text("api_key"),
  apiLogin: text("api_login"),
  apiPassword: text("api_password"),
  siteUrl: text("site_url"),
  isConnected: boolean("is_connected").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reservations = pgTable("reservations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  partySize: integer("party_size").notNull(),
  date: date("date").notNull(),
  time: time("time").notNull(),
  status: text("status").default("confirmed"),
  source: text("source").default("widget"),
  notes: text("notes"),
  specialRequests: text("special_requests"),
  confirmationCode: text("confirmation_code"),
  isPrepaid: boolean("is_prepaid").default(false),
  paymentAmount: numeric("payment_amount", { precision: 10, scale: 2 }),
  paymentStatus: text("payment_status"),
  resourceId: varchar("resource_id", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  duration: integer("duration").notNull().default(90),
});

export const resources = pgTable("resources", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  name: text("name").notNull(),
  type: text("type").default("table"),
  capacity: integer("capacity").default(4),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomTypes = pgTable("room_types", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  maxOccupancy: integer("max_occupancy").notNull().default(2),
  amenities: text("amenities"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rooms = pgTable("rooms", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  roomTypeId: varchar("room_type_id", { length: 36 }).notNull(),
  roomNumber: text("room_number").notNull(),
  floor: text("floor"),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const roomBookings = pgTable("room_bookings", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  roomId: varchar("room_id", { length: 36 }).notNull(),
  roomTypeId: varchar("room_type_id", { length: 36 }).notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  adults: integer("adults").notNull().default(1),
  children: integer("children").notNull().default(0),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  status: text("status").notNull().default("confirmed"),
  source: text("source").notNull().default("widget"),
  notes: text("notes"),
  specialRequests: text("special_requests"),
  confirmationCode: text("confirmation_code"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }),
  depositAmount: numeric("deposit_amount", { precision: 10, scale: 2 }),
  isPrepaid: boolean("is_prepaid").notNull().default(false),
  paymentStatus: text("payment_status").notNull().default("none"),
  stripePaymentId: text("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

export const supportTickets = pgTable("support_tickets", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }),
  email: text("email").notNull(),
  role: text("role").default("staff"),
  status: text("status").default("pending"),
  invitedAt: timestamp("invited_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
});

export const twilioSettings = pgTable("twilio_settings", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull().unique(),
  accountSid: text("account_sid"),
  authToken: text("auth_token"),
  phoneNumber: text("phone_number"),
  voicePersona: text("voice_persona").default("female"),
  phoneGreeting: text("phone_greeting"),
  maxCallDuration: integer("max_call_duration").default(5),
  voicemailEnabled: boolean("voicemail_enabled").default(true),
  smsEnabled: boolean("sms_enabled").default(false),
  smsTemplate: text("sms_template"),
  isConnected: boolean("is_connected").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const callLogs = pgTable("call_logs", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  twilioSid: text("twilio_sid"),
  callerPhone: text("caller_phone"),
  duration: integer("duration"),
  status: text("status"),
  transcript: text("transcript"),
  aiSummary: text("ai_summary"),
  reservationId: varchar("reservation_id", { length: 36 }),
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businessHours = pgTable("business_hours", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  openTime: time("open_time"),
  closeTime: time("close_time"),
  isClosed: boolean("is_closed").default(false),
});

export const closures = pgTable("closures", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  date: text("date").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const knowledgeBaseItems = pgTable("knowledge_base_items", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  type: text("type").notNull(),
  category: text("category"),
  title: text("title"),
  content: text("content"),
  sourceUrl: text("source_url"),
  fileName: text("file_name"),
  fileType: text("file_type"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  trainedAt: timestamp("trained_at"),
});

export const paymentSettings = pgTable("payment_settings", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull().unique(),
  stripeSecretKey: text("stripe_secret_key"),
  stripePublishableKey: text("stripe_publishable_key"),
  stripeConnected: boolean("stripe_connected").default(false),
  paypalClientId: text("paypal_client_id"),
  paypalClientSecret: text("paypal_client_secret"),
  paypalConnected: boolean("paypal_connected").default(false),
  depositAmount: numeric("deposit_amount", { precision: 10, scale: 2 }),
  depositType: text("deposit_type").default("fixed"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const widgetSettings = pgTable("widget_settings", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull().unique(),
  primaryColor: text("primary_color").default("#000000"),
  position: text("position").default("bottom-right"),
  welcomeMessage: text("welcome_message"),
  isEnabled: boolean("is_enabled").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
  voiceEnabled: boolean("voice_enabled").default(false),
  autoGreet: boolean("auto_greet").default(true),
  logoUrl: text("logo_url"),
});

export const widgetChatLogs = pgTable("widget_chat_logs", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  visitorIp: text("visitor_ip"),
  messageCount: integer("message_count").notNull().default(1),
  firstMessage: text("first_message"),
  channel: text("channel").notNull().default("text"),
  createdAt: timestamp("created_at").defaultNow(),
  lastMessageAt: timestamp("last_message_at").defaultNow(),
});

export const websiteChangeRequests = pgTable("website_change_requests", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  changeType: text("change_type").notNull().default("text"),
  description: text("description").notNull(),
  pageUrl: text("page_url"),
  attachmentUrl: text("attachment_url"),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminSettings = pgTable("admin_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("customer_support"),
  isActive: boolean("is_active").notNull().default(true),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  department: text("department").notNull().default("customer_support"),
});

export const aiProviderSettings = pgTable("ai_provider_settings", {
  id: serial("id").primaryKey(),
  venueId: varchar("venue_id", { length: 36 }).notNull(),
  provider: text("provider").notNull(),
  apiKey: text("api_key"),
  isEnabled: boolean("is_enabled").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertVenueSchema = createInsertSchema(venues).omit({ id: true, createdAt: true, updatedAt: true });
export const insertBlogPostSchema = createInsertSchema(venueBlogPosts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDomainSchema = createInsertSchema(venueDomains).omit({ id: true, createdAt: true });
export const insertCampaignSchema = createInsertSchema(contentCampaigns).omit({ id: true, createdAt: true, updatedAt: true });
export const insertContentAssetSchema = createInsertSchema(contentAssets).omit({ id: true, createdAt: true });
export const insertContentAssetUsageSchema = createInsertSchema(contentAssetUsage).omit({ id: true, createdAt: true });
export const insertRankKeywordSchema = createInsertSchema(rankTrackerKeywords).omit({ id: true, createdAt: true });
export const insertRankResultSchema = createInsertSchema(rankTrackerResults).omit({ id: true, checkedAt: true });
export const insertGridKeywordSchema = createInsertSchema(gridKeywords).omit({ id: true, createdAt: true });
export const insertGridScanResultSchema = createInsertSchema(gridScanResults).omit({ id: true, scanDate: true });
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({ id: true, createdAt: true });
export const insertSeoSettingsSchema = createInsertSchema(seoSettings).omit({ id: true, createdAt: true, updatedAt: true });
export const insertReservationSchema = createInsertSchema(reservations).omit({ id: true, createdAt: true, updatedAt: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true, createdAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVenue = z.infer<typeof insertVenueSchema>;
export type Venue = typeof venues.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof venueBlogPosts.$inferSelect;
export type InsertDomain = z.infer<typeof insertDomainSchema>;
export type Domain = typeof venueDomains.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof contentCampaigns.$inferSelect;
export type InsertContentAsset = z.infer<typeof insertContentAssetSchema>;
export type ContentAsset = typeof contentAssets.$inferSelect;
export type InsertContentAssetUsage = z.infer<typeof insertContentAssetUsageSchema>;
export type ContentAssetUsage = typeof contentAssetUsage.$inferSelect;
export type InsertRankKeyword = z.infer<typeof insertRankKeywordSchema>;
export type RankKeyword = typeof rankTrackerKeywords.$inferSelect;
export type InsertRankResult = z.infer<typeof insertRankResultSchema>;
export type RankResult = typeof rankTrackerResults.$inferSelect;
export type InsertGridKeyword = z.infer<typeof insertGridKeywordSchema>;
export type GridKeyword = typeof gridKeywords.$inferSelect;
export type InsertGridScanResult = z.infer<typeof insertGridScanResultSchema>;
export type GridScanResult = typeof gridScanResults.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservations.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;
export type RankTrackerCredits = typeof rankTrackerCredits.$inferSelect;
export type GridRefreshCredits = typeof gridRefreshCredits.$inferSelect;
