import { pgTable, text, varchar, timestamp, serial, integer, boolean, time, date, jsonb, decimal, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { users } from "./models/auth";

export * from "./models/auth";

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    company: text("company"),
    venueType: text("venue_type"),
    inquiryType: text("inquiry_type"),
    message: text("message").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("contact_messages_created_idx").on(t.createdAt),
    index("contact_messages_email_idx").on(t.email),
  ]
);

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export const workspaces = pgTable(
  "venues",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    shardId: integer("shard_id").notNull().default(1),
    ownerId: varchar("owner_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
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
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    timezone: text("timezone").notNull().default("America/New_York"),
    plan: text("plan").notNull().default("solo"),
    status: text("status").notNull().default("active"),
    aiKeySource: text("ai_key_source").notNull().default("agency"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("venues_owner_idx").on(t.ownerId),
    index("venues_status_idx").on(t.status),
  ]
);

export const insertWorkspaceSchema = createInsertSchema(workspaces).omit({
  id: true,
  shardId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWorkspace = z.infer<typeof insertWorkspaceSchema>;
export type Workspace = typeof workspaces.$inferSelect;

export const reservations = pgTable(
  "reservations",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    guestName: text("guest_name").notNull(),
    guestEmail: text("guest_email"),
    guestPhone: text("guest_phone"),
    partySize: integer("party_size").notNull(),
    date: date("date").notNull(),
    time: time("time").notNull(),
    duration: integer("duration").notNull().default(90),
    status: text("status").default("confirmed"),
    source: text("source").default("widget"),
    notes: text("notes"),
    specialRequests: text("special_requests"),
    confirmationCode: text("confirmation_code"),
    isPrepaid: boolean("is_prepaid").default(false),
    paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }),
    paymentStatus: text("payment_status"),
    resourceId: varchar("resource_id", { length: 36 })
      .references(() => resources.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("reservations_venue_confirmation_uq").on(t.workspaceId, t.confirmationCode),
    index("reservations_venue_date_idx").on(t.workspaceId, t.date),
    index("reservations_venue_date_time_idx").on(t.workspaceId, t.date, t.time),
    index("reservations_venue_resource_date_idx").on(t.workspaceId, t.resourceId, t.date),
  ]
);

export const insertReservationSchema = createInsertSchema(reservations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReservation = z.infer<typeof insertReservationSchema>;
export type Reservation = typeof reservations.$inferSelect;

export const businessHours = pgTable(
  "business_hours",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 }).notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(),
    openTime: time("open_time"),
    closeTime: time("close_time"),
    isClosed: boolean("is_closed").default(false),
  },
  (t) => [uniqueIndex("business_hours_venue_day_uq").on(t.workspaceId, t.dayOfWeek)]
);

export const insertBusinessHoursSchema = createInsertSchema(businessHours).omit({
  id: true,
});

export type InsertBusinessHours = z.infer<typeof insertBusinessHoursSchema>;
export type BusinessHours = typeof businessHours.$inferSelect;

export const closures = pgTable(
  "closures",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [uniqueIndex("closures_venue_date_uq").on(t.workspaceId, t.date)]
);

export const insertClosureSchema = createInsertSchema(closures).omit({
  id: true,
  createdAt: true,
});

export type InsertClosure = z.infer<typeof insertClosureSchema>;
export type Closure = typeof closures.$inferSelect;

export const resources = pgTable(
  "resources",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type").default("table"),
    capacity: integer("capacity").default(4),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("resources_venue_idx").on(t.workspaceId),
    index("resources_venue_active_idx").on(t.workspaceId, t.isActive),
    uniqueIndex("resources_venue_name_uq").on(t.workspaceId, t.name),
  ]
);

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export const teamMembers = pgTable(
  "team_members",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .references(() => users.id, { onDelete: "set null" }),
    email: text("email").notNull(),
    role: text("role").default("staff"),
    status: text("status").default("pending"),
    invitedAt: timestamp("invited_at").defaultNow(),
    acceptedAt: timestamp("accepted_at"),
  },
  (t) => [
    uniqueIndex("team_members_venue_email_uq").on(t.workspaceId, t.email),
    index("team_members_venue_status_idx").on(t.workspaceId, t.status),
  ]
);

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  invitedAt: true,
  acceptedAt: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export const knowledgeBaseItems = pgTable(
  "knowledge_base_items",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
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
  },
  (t) => [
    index("kbi_venue_status_idx").on(t.workspaceId, t.status),
    index("kbi_venue_type_idx").on(t.workspaceId, t.type),
    index("kbi_venue_created_idx").on(t.workspaceId, t.createdAt),
  ]
);

export const insertKnowledgeBaseItemSchema = createInsertSchema(knowledgeBaseItems).omit({
  id: true,
  createdAt: true,
  trainedAt: true,
});

export type InsertKnowledgeBaseItem = z.infer<typeof insertKnowledgeBaseItemSchema>;
export type KnowledgeBaseItem = typeof knowledgeBaseItems.$inferSelect;

export const callLogs = pgTable(
  "call_logs",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    twilioSid: text("twilio_sid"),
    callerPhone: text("caller_phone"),
    duration: integer("duration"),
    status: text("status"),
    transcript: text("transcript"),
    aiSummary: text("ai_summary"),
    reservationId: varchar("reservation_id", { length: 36 })
      .references(() => reservations.id, { onDelete: "set null" }),
    recordingUrl: text("recording_url"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("call_logs_venue_created_idx").on(t.workspaceId, t.createdAt),
    index("call_logs_venue_reservation_idx").on(t.workspaceId, t.reservationId),
  ]
);

export const insertCallLogSchema = createInsertSchema(callLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type CallLog = typeof callLogs.$inferSelect;

export const widgetSettings = pgTable(
  "widget_settings",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .unique()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    primaryColor: text("primary_color").default("#000000"),
    position: text("position").default("bottom-right"),
    welcomeMessage: text("welcome_message"),
    isEnabled: boolean("is_enabled").default(true),
    voiceEnabled: boolean("voice_enabled").default(false),
    autoGreet: boolean("auto_greet").default(true),
    logoUrl: text("logo_url"),
    updatedAt: timestamp("updated_at").defaultNow(),
  }
);

export const insertWidgetSettingsSchema = createInsertSchema(widgetSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertWidgetSettings = z.infer<typeof insertWidgetSettingsSchema>;
export type WidgetSettings = typeof widgetSettings.$inferSelect;

export const twilioSettings = pgTable(
  "twilio_settings",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .unique()
      .references(() => workspaces.id, { onDelete: "cascade" }),
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
  }
);

export const insertTwilioSettingsSchema = createInsertSchema(twilioSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertTwilioSettings = z.infer<typeof insertTwilioSettingsSchema>;
export type TwilioSettings = typeof twilioSettings.$inferSelect;

export const paymentSettings = pgTable(
  "payment_settings",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .unique()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    stripeSecretKey: text("stripe_secret_key"),
    stripePublishableKey: text("stripe_publishable_key"),
    stripeConnected: boolean("stripe_connected").default(false),
    paypalClientId: text("paypal_client_id"),
    paypalClientSecret: text("paypal_client_secret"),
    paypalConnected: boolean("paypal_connected").default(false),
    depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }),
    depositType: text("deposit_type").default("fixed"),
    updatedAt: timestamp("updated_at").defaultNow(),
  }
);

export const insertPaymentSettingsSchema = createInsertSchema(paymentSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertPaymentSettings = z.infer<typeof insertPaymentSettingsSchema>;
export type PaymentSettings = typeof paymentSettings.$inferSelect;

export const aiProviderSettings = pgTable(
  "ai_provider_settings",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    apiKey: text("api_key"),
    isEnabled: boolean("is_enabled").default(false),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("ai_provider_settings_venue_provider_uq").on(t.workspaceId, t.provider),
    index("ai_provider_settings_venue_enabled_idx").on(t.workspaceId, t.isEnabled),
  ]
);

export const insertAiProviderSettingsSchema = createInsertSchema(aiProviderSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertAiProviderSettings = z.infer<typeof insertAiProviderSettingsSchema>;
export type AiProviderSettings = typeof aiProviderSettings.$inferSelect;

export const widgetChatLogs = pgTable(
  "widget_chat_logs",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    sessionId: varchar("session_id", { length: 64 }).notNull(),
    visitorIp: text("visitor_ip"),
    messageCount: integer("message_count").notNull().default(1),
    firstMessage: text("first_message"),
    channel: text("channel").notNull().default("text"),
    createdAt: timestamp("created_at").defaultNow(),
    lastMessageAt: timestamp("last_message_at").defaultNow(),
  },
  (t) => [
    index("widget_chat_logs_venue_idx").on(t.workspaceId),
    index("widget_chat_logs_venue_created_idx").on(t.workspaceId, t.createdAt),
    index("widget_chat_logs_session_idx").on(t.sessionId),
    index("widget_chat_logs_venue_last_idx").on(t.workspaceId, t.lastMessageAt),
  ]
);

export const insertWidgetChatLogSchema = createInsertSchema(widgetChatLogs).omit({
  id: true,
  createdAt: true,
  lastMessageAt: true,
});

export type InsertWidgetChatLog = z.infer<typeof insertWidgetChatLogSchema>;
export type WidgetChatLog = typeof widgetChatLogs.$inferSelect;

export const adminRoles = ["super_admin", "admin", "sales", "seo_production", "website_production", "customer_support"] as const;
export type AdminRole = typeof adminRoles[number];

export const adminDepartments = ["management", "the_boiler_room", "seo_production", "website_production", "customer_support"] as const;
export type AdminDepartment = typeof adminDepartments[number];

export const adminDepartmentLabels: Record<AdminDepartment, string> = {
  management: "Management",
  the_boiler_room: "The Boiler Room",
  seo_production: "SEO Production",
  website_production: "Website Production",
  customer_support: "Customer Support",
};

export const adminRolePermissions: Record<AdminRole, string[]> = {
  super_admin: ["*"],
  admin: ["dashboard", "clients", "crm", "users", "billing", "websites", "website-changes", "widgets", "twilio", "calls", "seo", "support", "analytics", "export-data", "notifications", "settings"],
  sales: ["dashboard", "clients", "crm", "analytics"],
  seo_production: ["dashboard", "seo", "clients", "analytics"],
  website_production: ["dashboard", "website-changes", "websites", "clients"],
  customer_support: ["dashboard", "support", "calls", "clients", "website-changes"],
};

export const adminUsers = pgTable("admin_users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("customer_support"),
  department: text("department").notNull().default("customer_support"),
  isActive: boolean("is_active").notNull().default(true),
  lastActiveAt: timestamp("last_active_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export const adminSettings = pgTable("admin_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAdminSettingsSchema = createInsertSchema(adminSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertAdminSettings = z.infer<typeof insertAdminSettingsSchema>;
export type AdminSettings = typeof adminSettings.$inferSelect;

export const roomTypes = pgTable(
  "room_types",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 }).notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
    maxOccupancy: integer("max_occupancy").notNull().default(2),
    amenities: text("amenities"),
    imageUrl: text("image_url"),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("room_types_venue_name_uq").on(t.workspaceId, t.name),
  ]
);

export const insertRoomTypeSchema = createInsertSchema(roomTypes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRoomType = z.infer<typeof insertRoomTypeSchema>;
export type RoomType = typeof roomTypes.$inferSelect;

export const rooms = pgTable(
  "rooms",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 }).notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    roomTypeId: varchar("room_type_id", { length: 36 }).notNull().references(() => roomTypes.id, { onDelete: "restrict" }),
    roomNumber: text("room_number").notNull(),
    floor: text("floor"),
    notes: text("notes"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("rooms_venue_room_number_uq").on(t.workspaceId, t.roomNumber),
    index("rooms_venue_room_type_idx").on(t.workspaceId, t.roomTypeId),
  ]
);

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export const roomBookings = pgTable(
  "room_bookings",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 }).notNull().references(() => workspaces.id, { onDelete: "cascade" }),
    roomId: varchar("room_id", { length: 36 }).notNull().references(() => rooms.id, { onDelete: "restrict" }),
    roomTypeId: varchar("room_type_id", { length: 36 }).notNull().references(() => roomTypes.id, { onDelete: "restrict" }),
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
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
    depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }),
    isPrepaid: boolean("is_prepaid").notNull().default(false),
    paymentStatus: text("payment_status").notNull().default("none"),
    stripePaymentId: text("stripe_payment_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("room_bookings_venue_room_dates_idx").on(t.workspaceId, t.roomId, t.checkIn, t.checkOut),
    index("room_bookings_venue_dates_idx").on(t.workspaceId, t.checkIn, t.checkOut),
    index("room_bookings_venue_checkin_idx").on(t.workspaceId, t.checkIn),
    uniqueIndex("room_bookings_venue_confirmation_uq").on(t.workspaceId, t.confirmationCode),
    index("room_bookings_venue_checkout_idx").on(t.workspaceId, t.checkOut),
  ]
);

const isoDateString = z.preprocess((v) => {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string") return v.trim().slice(0, 10);
  return v;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

export const insertRoomBookingSchema = createInsertSchema(roomBookings)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    checkIn: isoDateString,
    checkOut: isoDateString,
  });

export type InsertRoomBooking = z.infer<typeof insertRoomBookingSchema>;
export type RoomBooking = typeof roomBookings.$inferSelect;

export const supportTickets = pgTable(
  "support_tickets",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    subject: text("subject").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull().default("general"),
    priority: text("priority").notNull().default("medium"),
    status: text("status").notNull().default("open"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("support_tickets_venue_status_idx").on(t.workspaceId, t.status),
    index("support_tickets_venue_priority_idx").on(t.workspaceId, t.priority),
    index("support_tickets_venue_created_idx").on(t.workspaceId, t.createdAt),
  ]
);

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

export const websiteChangeRequests = pgTable(
  "website_change_requests",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    changeType: text("change_type").notNull().default("text"),
    description: text("description").notNull(),
    pageUrl: text("page_url"),
    attachmentUrl: text("attachment_url"),
    status: text("status").notNull().default("pending"),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("website_changes_venue_status_idx").on(t.workspaceId, t.status),
    index("website_changes_venue_created_idx").on(t.workspaceId, t.createdAt),
  ]
);

export const insertWebsiteChangeRequestSchema = createInsertSchema(websiteChangeRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWebsiteChangeRequest = z.infer<typeof insertWebsiteChangeRequestSchema>;
export type WebsiteChangeRequest = typeof websiteChangeRequests.$inferSelect;

export const seoSettings = pgTable(
  "seo_settings",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    provider: text("provider").notNull(),
    apiKey: text("api_key"),
    apiLogin: text("api_login"),
    apiPassword: text("api_password"),
    siteUrl: text("site_url"),
    isConnected: boolean("is_connected").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("seo_settings_venue_provider_idx").on(t.workspaceId, t.provider),
  ]
);

export const insertSeoSettingsSchema = createInsertSchema(seoSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;

export const rankTrackerKeywords = pgTable(
  "rank_tracker_keywords",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("rank_keywords_venue_idx").on(t.workspaceId),
    uniqueIndex("rank_keywords_venue_keyword_uq").on(t.workspaceId, t.keyword),
  ]
);

export const insertRankTrackerKeywordSchema = createInsertSchema(rankTrackerKeywords).omit({
  id: true,
  createdAt: true,
});
export type InsertRankTrackerKeyword = z.infer<typeof insertRankTrackerKeywordSchema>;
export type RankTrackerKeyword = typeof rankTrackerKeywords.$inferSelect;

export const rankTrackerResults = pgTable(
  "rank_tracker_results",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    keywordId: integer("keyword_id")
      .notNull()
      .references(() => rankTrackerKeywords.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    position: integer("position"),
    previousPosition: integer("previous_position"),
    url: text("url"),
    searchEngine: text("search_engine").notNull().default("google"),
    checkedAt: timestamp("checked_at").defaultNow(),
  },
  (t) => [
    index("rank_results_venue_idx").on(t.workspaceId),
    index("rank_results_keyword_idx").on(t.keywordId),
    index("rank_results_keyword_checked_idx").on(t.keywordId, t.checkedAt),
    index("rank_results_venue_checked_idx").on(t.workspaceId, t.checkedAt),
  ]
);

export const insertRankTrackerResultSchema = createInsertSchema(rankTrackerResults).omit({
  id: true,
  checkedAt: true,
});
export type InsertRankTrackerResult = z.infer<typeof insertRankTrackerResultSchema>;
export type RankTrackerResult = typeof rankTrackerResults.$inferSelect;

export const gridKeywords = pgTable(
  "grid_keywords",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    gridSize: integer("grid_size").notNull().default(5),
    distance: decimal("distance", { precision: 4, scale: 1 }).notNull().default("2.0"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("grid_keywords_venue_idx").on(t.workspaceId),
    uniqueIndex("grid_keywords_venue_keyword_uq").on(t.workspaceId, t.keyword),
  ]
);

export const insertGridKeywordSchema = createInsertSchema(gridKeywords).omit({
  id: true,
  createdAt: true,
});
export type InsertGridKeyword = z.infer<typeof insertGridKeywordSchema>;
export type GridKeyword = typeof gridKeywords.$inferSelect;

export const gridRefreshCredits = pgTable(
  "grid_refresh_credits",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    balance: integer("balance").notNull().default(0),
    totalPurchased: integer("total_purchased").notNull().default(0),
    totalUsed: integer("total_used").notNull().default(0),
    lastFreeScanDate: date("last_free_scan_date"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("grid_refresh_credits_venue_uq").on(t.workspaceId),
  ]
);

export type GridRefreshCredits = typeof gridRefreshCredits.$inferSelect;

export const gridRefreshHistory = pgTable(
  "grid_refresh_history",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    amount: integer("amount").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("grid_refresh_history_venue_idx").on(t.workspaceId),
    index("grid_refresh_history_venue_created_idx").on(t.workspaceId, t.createdAt),
  ]
);

export type GridRefreshHistory = typeof gridRefreshHistory.$inferSelect;

export const rankTrackerCredits = pgTable(
  "rank_tracker_credits",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    balance: integer("balance").notNull().default(5),
    totalPurchased: integer("total_purchased").notNull().default(0),
    totalUsed: integer("total_used").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("rank_tracker_credits_venue_uq").on(t.workspaceId),
  ]
);

export type RankTrackerCredits = typeof rankTrackerCredits.$inferSelect;

export const rankTrackerHistory = pgTable(
  "rank_tracker_history",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    amount: integer("amount").notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("rank_tracker_history_venue_idx").on(t.workspaceId),
    index("rank_tracker_history_venue_created_idx").on(t.workspaceId, t.createdAt),
  ]
);

export type RankTrackerHistory = typeof rankTrackerHistory.$inferSelect;

export const gridScanResults = pgTable(
  "grid_scan_results",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    gridSize: integer("grid_size").notNull(),
    gridIndex: integer("grid_index").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
    longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
    rank: integer("rank"),
    businessName: text("business_name"),
    scanDate: timestamp("scan_date").defaultNow(),
  },
  (t) => [
    index("grid_scan_results_venue_idx").on(t.workspaceId),
    index("grid_scan_results_keyword_idx").on(t.workspaceId, t.keyword),
    index("grid_scan_results_venue_keyword_date_idx").on(t.workspaceId, t.keyword, t.scanDate),
  ]
);

export const insertGridScanResultSchema = createInsertSchema(gridScanResults).omit({
  id: true,
  scanDate: true,
});
export type InsertGridScanResult = z.infer<typeof insertGridScanResultSchema>;
export type GridScanResult = typeof gridScanResults.$inferSelect;

export const blogTemplates = ["editorial", "magazine", "minimal", "classic", "grid", "brutalist"] as const;
export type BlogTemplate = typeof blogTemplates[number];

// Partial unique index managed outside Drizzle (not expressible in Drizzle schema):
//   CREATE UNIQUE INDEX venue_domains_one_primary_per_venue ON venue_domains (venue_id) WHERE is_primary = true;
// Ensures AT MOST one primary domain per venue (0 or 1), while allowing unlimited non-primary domains.
// "At least one primary" must be enforced in application logic / seed / migration.
export const workspaceDomains = pgTable(
  "venue_domains",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    domain: text("domain").notNull().unique(),
    isPrimary: boolean("is_primary").notNull().default(false),
    blogTemplate: text("blog_template").notNull().default("editorial"),
    accentColor: text("accent_color"),
    accentForeground: text("accent_foreground"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("venue_domains_venue_idx").on(t.workspaceId),
  ]
);

export const insertWorkspaceDomainSchema = createInsertSchema(workspaceDomains).omit({
  id: true,
  createdAt: true,
});
export type InsertWorkspaceDomain = z.infer<typeof insertWorkspaceDomainSchema>;
export type WorkspaceDomain = typeof workspaceDomains.$inferSelect;

export const postStatuses = ["draft", "scheduled", "published", "archived"] as const;
export type PostStatus = typeof postStatuses[number];

export const generationStatuses = ["pending", "generating", "generated", "needs_review", "failed"] as const;
export type GenerationStatus = typeof generationStatuses[number];

export const qualityGateStatuses = ["pass", "fail", "unknown"] as const;
export type QualityGateStatus = typeof qualityGateStatuses[number];

export const workspaceBlogPosts = pgTable(
  "venue_blog_posts",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
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
    primaryKeyword: text("primary_keyword"),
    intent: text("intent"),
    funnel: text("funnel"),
    generationStatus: text("generation_status").default("pending"),
    qualityGateStatus: text("quality_gate_status").default("unknown"),
    qualityFailReasons: jsonb("quality_fail_reasons").$type<string[]>(),
    schemaType: text("schema_type"),
    schemaJson: jsonb("schema_json").$type<Record<string, any>>(),
    schemaAutoDetected: boolean("schema_auto_detected").default(false),
    campaignId: varchar("campaign_id", { length: 36 })
      .references(() => contentCampaigns.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    uniqueIndex("venue_blog_posts_venue_slug_uq").on(t.workspaceId, t.slug),
    index("venue_blog_posts_venue_status_idx").on(t.workspaceId, t.status),
    index("venue_blog_posts_gen_status_idx").on(t.workspaceId, t.generationStatus),
    index("venue_blog_posts_venue_publish_at_idx").on(t.workspaceId, t.publishAt),
    index("venue_blog_posts_venue_published_at_idx").on(t.workspaceId, t.publishedAt),
    index("venue_blog_posts_campaign_idx").on(t.campaignId),
    index("venue_blog_posts_venue_status_publish_at_idx").on(t.workspaceId, t.status, t.publishAt),
    index("venue_blog_posts_venue_status_published_at_idx").on(t.workspaceId, t.status, t.publishedAt),
  ]
);

export const insertWorkspaceBlogPostSchema = createInsertSchema(workspaceBlogPosts).omit({
  id: true,
  compiledHtml: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWorkspaceBlogPost = z.infer<typeof insertWorkspaceBlogPostSchema>;
export type WorkspaceBlogPost = typeof workspaceBlogPosts.$inferSelect;

export const campaignStatuses = ["draft", "active", "paused", "completed", "cancelled"] as const;
export type CampaignStatus = typeof campaignStatuses[number];

export const contentCampaigns = pgTable(
  "content_campaigns",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    status: text("status").notNull().default("draft"),
    timezone: text("timezone").notNull().default("UTC"),
    startDate: date("start_date"),
    durationWeeks: integer("duration_weeks"),
    postsTotal: integer("posts_total"),
    publishDays: jsonb("publish_days").$type<string[]>(),
    publishTimeLocal: text("publish_time_local"),
    cadenceJson: jsonb("cadence_json"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("content_campaigns_venue_status_idx").on(t.workspaceId, t.status),
  ]
);

export const insertContentCampaignSchema = createInsertSchema(contentCampaigns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertContentCampaign = z.infer<typeof insertContentCampaignSchema>;
export type ContentCampaign = typeof contentCampaigns.$inferSelect;

export const assetSources = ["pexels", "unsplash", "pixabay", "ai", "upload"] as const;
export type AssetSource = typeof assetSources[number];

export const assetTypes = ["hero", "section", "diagram", "generic"] as const;
export type AssetType = typeof assetTypes[number];

export const contentAssets = pgTable(
  "content_assets",
  {
    id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: varchar("venue_id", { length: 36 })
      .references(() => workspaces.id, { onDelete: "set null" }),
    postId: varchar("post_id", { length: 36 })
      .references(() => workspaceBlogPosts.id, { onDelete: "set null" }),
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
  },
  (t) => [
    index("content_assets_venue_idx").on(t.workspaceId),
    index("content_assets_post_idx").on(t.postId),
    index("content_assets_venue_type_idx").on(t.workspaceId, t.type),
  ]
);

export const insertContentAssetSchema = createInsertSchema(contentAssets).omit({
  id: true,
  createdAt: true,
});
export type InsertContentAsset = z.infer<typeof insertContentAssetSchema>;
export type ContentAsset = typeof contentAssets.$inferSelect;

export const assetPlacements = ["hero", "inline"] as const;
export type AssetPlacement = typeof assetPlacements[number];

export const contentAssetUsage = pgTable(
  "content_asset_usage",
  {
    id: serial("id").primaryKey(),
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => workspaceBlogPosts.id, { onDelete: "cascade" }),
    assetId: varchar("asset_id", { length: 36 })
      .notNull()
      .references(() => contentAssets.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    placement: text("placement").notNull().default("inline"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("content_asset_usage_post_idx").on(t.postId),
    uniqueIndex("content_asset_usage_post_position_uq").on(t.postId, t.position),
    index("content_asset_usage_asset_idx").on(t.assetId),
  ]
);

export const insertContentAssetUsageSchema = createInsertSchema(contentAssetUsage).omit({
  id: true,
  createdAt: true,
});
export type InsertContentAssetUsage = z.infer<typeof insertContentAssetUsageSchema>;
export type ContentAssetUsage = typeof contentAssetUsage.$inferSelect;

export const crmContacts = pgTable(
  "crm_contacts",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("workspace_id", { length: 36 }),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    company: text("company"),
    title: text("title"),
    source: text("source").default("manual"),
    status: text("status").default("active"),
    notes: text("notes"),
    tags: text("tags").array(),
    lastContactedAt: timestamp("last_contacted_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("crm_contacts_workspace_idx").on(t.workspaceId),
    index("crm_contacts_email_idx").on(t.email),
    index("crm_contacts_status_idx").on(t.status),
  ]
);

export const insertCrmContactSchema = createInsertSchema(crmContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCrmContact = z.infer<typeof insertCrmContactSchema>;
export type CrmContact = typeof crmContacts.$inferSelect;

export const crmPipelineStages = pgTable(
  "crm_pipeline_stages",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("workspace_id", { length: 36 }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    color: text("color").default("#3b82f6"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("crm_pipeline_stages_workspace_idx").on(t.workspaceId),
  ]
);

export const insertCrmPipelineStageSchema = createInsertSchema(crmPipelineStages).omit({
  id: true,
  createdAt: true,
});
export type InsertCrmPipelineStage = z.infer<typeof insertCrmPipelineStageSchema>;
export type CrmPipelineStage = typeof crmPipelineStages.$inferSelect;

export const crmDeals = pgTable(
  "crm_deals",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("workspace_id", { length: 36 }),
    contactId: integer("contact_id").references(() => crmContacts.id, { onDelete: "set null" }),
    stageId: integer("stage_id").references(() => crmPipelineStages.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    value: decimal("value", { precision: 12, scale: 2 }).default("0"),
    currency: text("currency").default("USD"),
    stage: text("stage").default("lead"),
    priority: text("priority").default("medium"),
    assignedTo: text("assigned_to"),
    businessName: text("business_name"),
    businessType: text("business_type"),
    contactName: text("contact_name"),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    plan: text("plan"),
    source: text("source"),
    lastActivity: text("last_activity"),
    nextFollowUp: text("next_follow_up"),
    notes: text("notes"),
    closedAt: timestamp("closed_at"),
    expectedCloseDate: date("expected_close_date"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("crm_deals_workspace_idx").on(t.workspaceId),
    index("crm_deals_stage_idx").on(t.stage),
    index("crm_deals_contact_idx").on(t.contactId),
  ]
);

export const insertCrmDealSchema = createInsertSchema(crmDeals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCrmDeal = z.infer<typeof insertCrmDealSchema>;
export type CrmDeal = typeof crmDeals.$inferSelect;

export const invoices = pgTable(
  "invoices",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("workspace_id", { length: 36 }),
    invoiceNumber: text("invoice_number").notNull(),
    clientName: text("client_name").notNull(),
    clientEmail: text("client_email"),
    status: text("status").notNull().default("draft"),
    issueDate: date("issue_date"),
    dueDate: date("due_date"),
    subtotal: decimal("subtotal", { precision: 12, scale: 2 }).default("0"),
    taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).default("0"),
    taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0"),
    discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
    total: decimal("total", { precision: 12, scale: 2 }).default("0"),
    currency: text("currency").default("USD"),
    notes: text("notes"),
    paymentTerms: text("payment_terms"),
    paidAt: timestamp("paid_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("invoices_workspace_idx").on(t.workspaceId),
    index("invoices_status_idx").on(t.status),
    index("invoices_client_idx").on(t.clientName),
  ]
);

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export const invoiceLineItems = pgTable(
  "invoice_line_items",
  {
    id: serial("id").primaryKey(),
    invoiceId: integer("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
    unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull().default("0"),
    amount: decimal("amount", { precision: 12, scale: 2 }).notNull().default("0"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    index("invoice_line_items_invoice_idx").on(t.invoiceId),
  ]
);

export const insertInvoiceLineItemSchema = createInsertSchema(invoiceLineItems).omit({
  id: true,
});
export type InsertInvoiceLineItem = z.infer<typeof insertInvoiceLineItemSchema>;
export type InvoiceLineItem = typeof invoiceLineItems.$inferSelect;

export const contentReports = pgTable(
  "content_reports",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("workspace_id", { length: 36 }),
    title: text("title").notNull(),
    type: text("type").notNull().default("monthly"),
    status: text("status").notNull().default("draft"),
    period: text("period"),
    metrics: jsonb("metrics"),
    summary: text("summary"),
    postsPublished: integer("posts_published").default(0),
    totalWords: integer("total_words").default(0),
    avgWordCount: integer("avg_word_count").default(0),
    topKeywords: text("top_keywords").array(),
    trafficChange: decimal("traffic_change", { precision: 8, scale: 2 }),
    rankingsImproved: integer("rankings_improved").default(0),
    generatedAt: timestamp("generated_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("content_reports_workspace_idx").on(t.workspaceId),
    index("content_reports_venue_idx").on(t.workspaceId),
    index("content_reports_type_idx").on(t.type),
    index("content_reports_status_idx").on(t.status),
  ]
);

export const insertContentReportSchema = createInsertSchema(contentReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertContentReport = z.infer<typeof insertContentReportSchema>;
export type ContentReport = typeof contentReports.$inferSelect;

export const workspaceSiteProfiles = pgTable(
  "venue_site_profiles",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("workspace_id", { length: 36 })
      .references(() => workspaces.id, { onDelete: "cascade" }),
    siteName: text("site_name"),
    siteUrl: text("site_url"),
    logoUrl: text("logo_url"),
    faviconUrl: text("favicon_url"),
    primaryColor: text("primary_color"),
    secondaryColor: text("secondary_color"),
    fontFamily: text("font_family"),
    headerHtml: text("header_html"),
    footerHtml: text("footer_html"),
    customCss: text("custom_css"),
    customJs: text("custom_js"),
    analyticsId: text("analytics_id"),
    socialLinks: jsonb("social_links").$type<Record<string, string>>(),
    metaDefaults: jsonb("meta_defaults").$type<Record<string, string>>(),
    robotsTxt: text("robots_txt"),
    sitemapEnabled: boolean("sitemap_enabled").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("venue_site_profiles_workspace_idx").on(t.workspaceId),
    index("venue_site_profiles_venue_idx").on(t.workspaceId),
  ]
);

export const insertWorkspaceSiteProfileSchema = createInsertSchema(workspaceSiteProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWorkspaceSiteProfile = z.infer<typeof insertWorkspaceSiteProfileSchema>;
export type WorkspaceSiteProfile = typeof workspaceSiteProfiles.$inferSelect;

export const workspaceSitePages = pgTable(
  "venue_site_pages",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("workspace_id", { length: 36 })
      .references(() => workspaces.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    content: text("content"),
    template: text("template").default("default"),
    parentId: integer("parent_id"),
    sortOrder: integer("sort_order").default(0),
    isPublished: boolean("is_published").default(false),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    ogImage: text("og_image"),
    canonicalUrl: text("canonical_url"),
    noIndex: boolean("no_index").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (t) => [
    index("venue_site_pages_workspace_idx").on(t.workspaceId),
    index("venue_site_pages_slug_idx").on(t.slug),
  ]
);

export const insertWorkspaceSitePageSchema = createInsertSchema(workspaceSitePages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWorkspaceSitePage = z.infer<typeof insertWorkspaceSitePageSchema>;
export type WorkspaceSitePage = typeof workspaceSitePages.$inferSelect;

export const postKeywordIndex = pgTable(
  "post_keyword_index",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("workspace_id", { length: 36 })
      .references(() => workspaces.id, { onDelete: "cascade" }),
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => workspaceBlogPosts.id, { onDelete: "cascade" }),
    keyword: text("keyword").notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    frequency: integer("frequency").default(1),
    inTitle: boolean("in_title").default(false),
    inDescription: boolean("in_description").default(false),
    inH1: boolean("in_h1").default(false),
    inH2: boolean("in_h2").default(false),
    position: integer("position"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("post_keyword_index_workspace_idx").on(t.workspaceId),
    index("post_keyword_index_venue_idx").on(t.workspaceId),
    index("post_keyword_index_post_idx").on(t.postId),
    index("post_keyword_index_keyword_idx").on(t.keyword),
  ]
);

export const insertPostKeywordIndexSchema = createInsertSchema(postKeywordIndex).omit({
  id: true,
  createdAt: true,
});
export type InsertPostKeywordIndex = z.infer<typeof insertPostKeywordIndexSchema>;
export type PostKeywordIndex = typeof postKeywordIndex.$inferSelect;

export const validationSeverities = ["error", "warning", "info"] as const;
export type ValidationSeverity = typeof validationSeverities[number];

export const postValidationResults = pgTable(
  "post_validation_results",
  {
    id: serial("id").primaryKey(),
    workspaceId: varchar("workspace_id", { length: 36 })
      .references(() => workspaces.id, { onDelete: "cascade" }),
    postId: varchar("post_id", { length: 36 })
      .notNull()
      .references(() => workspaceBlogPosts.id, { onDelete: "cascade" }),
    rule: text("rule").notNull(),
    severity: text("severity").notNull().default("warning"),
    message: text("message").notNull(),
    details: jsonb("details").$type<Record<string, any>>(),
    autoFixable: boolean("auto_fixable").default(false),
    fixed: boolean("fixed").default(false),
    fixedAt: timestamp("fixed_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [
    index("post_validation_results_workspace_idx").on(t.workspaceId),
    index("post_validation_results_venue_idx").on(t.workspaceId),
    index("post_validation_results_post_idx").on(t.postId),
    index("post_validation_results_rule_idx").on(t.rule),
    index("post_validation_results_severity_idx").on(t.severity),
  ]
)

export const insertPostValidationResultSchema = createInsertSchema(postValidationResults).omit({
  id: true,
  fixedAt: true,
  createdAt: true,
});
export type InsertPostValidationResult = z.infer<typeof insertPostValidationResultSchema>;
export type PostValidationResult = typeof postValidationResults.$inferSelect;
