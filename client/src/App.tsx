import { useState, useEffect, lazy, Suspense, type ComponentType } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import type { AdminRole } from "@shared/schema";
import { adminRolePermissions } from "@shared/schema";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClientLayout } from "@/components/client-layout";

const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/home2"));
const HomeArchive = lazy(() => import("@/pages/home-archive"));
const AIWidget = lazy(() => import("@/components/ai-widget").then(m => ({ default: m.AIWidget })));

const About = lazy(() => import("@/pages/about"));
const Gallery = lazy(() => import("@/pages/gallery"));
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const Templates = lazy(() => import("@/pages/templates"));
const Contact = lazy(() => import("@/pages/contact"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const Testimonials = lazy(() => import("@/pages/testimonials"));
const CaseStudies = lazy(() => import("@/pages/case-studies"));
const Pricing = lazy(() => import("@/pages/pricing"));
const FAQ = lazy(() => import("@/pages/faq"));
const Docs = lazy(() => import("@/pages/docs"));
const Login = lazy(() => import("@/pages/login"));
const DevClient = lazy(() => import("@/pages/dev-client"));
const DevAdmin = lazy(() => import("@/pages/dev-admin"));

const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminAgencies = lazy(() => import("@/pages/admin/agencies"));
const AdminAgencyDetail = lazy(() => import("@/pages/admin/agency-detail"));
const AdminAgenciesPending = lazy(() => import("@/pages/admin/agencies-pending"));
const AdminContentPosts = lazy(() => import("@/pages/admin/content-posts"));
const AdminContentCampaigns = lazy(() => import("@/pages/admin/content-campaigns"));
const AdminContentModeration = lazy(() => import("@/pages/admin/content-moderation"));
const AdminPlatformSeoKeywords = lazy(() => import("@/pages/admin/platform-seo-keywords"));
const AdminPlatformSeoApi = lazy(() => import("@/pages/admin/platform-seo-api"));
const AdminBillingSubscriptions = lazy(() => import("@/pages/admin/billing-subscriptions"));
const AdminBillingRevenue = lazy(() => import("@/pages/admin/billing-revenue"));
const AdminBillingPayouts = lazy(() => import("@/pages/admin/billing-payouts"));
const AdminSystemApiKeys = lazy(() => import("@/pages/admin/system-api-keys"));
const AdminSystemTwilio = lazy(() => import("@/pages/admin/system-twilio"));
const AdminSystemEmail = lazy(() => import("@/pages/admin/system-email"));
const AdminSystemInfrastructure = lazy(() => import("@/pages/admin/system-infrastructure"));
const AdminUsersAll = lazy(() => import("@/pages/admin/users-all"));
const AdminUsersAdmins = lazy(() => import("@/pages/admin/users-admins"));
const AdminSupportTickets = lazy(() => import("@/pages/admin/support-tickets"));
const AdminSupportCallLogs = lazy(() => import("@/pages/admin/support-call-logs"));
const AdminSupportAnnouncements = lazy(() => import("@/pages/admin/support-announcements"));
const AdminSettingsConfig = lazy(() => import("@/pages/admin/settings-config"));
const AdminSettingsBranding = lazy(() => import("@/pages/admin/settings-branding"));

const AdminClients = lazy(() => import("@/pages/admin/clients"));
const AdminUsers = lazy(() => import("@/pages/admin/users"));
const AdminBilling = lazy(() => import("@/pages/admin/billing"));
const AdminWebsites = lazy(() => import("@/pages/admin/websites"));
const AdminWidgets = lazy(() => import("@/pages/admin/widgets"));
const AdminCalls = lazy(() => import("@/pages/admin/calls"));
const AdminTwilio = lazy(() => import("@/pages/admin/twilio"));
const AdminAnalytics = lazy(() => import("@/pages/admin/analytics"));
const AdminNotifications = lazy(() => import("@/pages/admin/notifications"));
const AdminSettings = lazy(() => import("@/pages/admin/settings"));
const AdminSupport = lazy(() => import("@/pages/admin/support"));
const AdminExportData = lazy(() => import("@/pages/admin/export-data"));
const AdminSeo = lazy(() => import("@/pages/admin/seo"));
const AdminWebsiteChanges = lazy(() => import("@/pages/admin/website-changes"));
const AdminCrm = lazy(() => import("@/pages/admin/crm"));
const AdminContent = lazy(() => import("@/pages/admin/content"));
const AdminPseo = lazy(() => import("@/pages/admin/pseo"));
const AdminWebsiteEngine = lazy(() => import("@/pages/admin/website-engine"));
const AdminSeoRankTracker = lazy(() => import("@/pages/admin/seo-rank-tracker"));
const AdminSeoLocalGrid = lazy(() => import("@/pages/admin/seo-local-grid"));
const AdminSeoAIVisibility = lazy(() => import("@/pages/admin/seo-ai-visibility"));
const AdminCallLogs = lazy(() => import("@/pages/admin/call-logs"));
const AdminWidgetConfig = lazy(() => import("@/pages/admin/widget-config"));

const SelectWorkspace = lazy(() => import("@/pages/dashboard/select-workspace"));
const Today = lazy(() => import("@/pages/dashboard/today"));
const CalendarView = lazy(() => import("@/pages/dashboard/calendar"));
const BookingDetail = lazy(() => import("@/pages/dashboard/booking-detail"));
const Calls = lazy(() => import("@/pages/dashboard/calls"));
const CallDetail = lazy(() => import("@/pages/dashboard/call-detail"));
const Analytics = lazy(() => import("@/pages/dashboard/analytics"));

const ContentPosts = lazy(() => import("@/pages/dashboard/content-posts"));
const ContentPages = lazy(() => import("@/pages/dashboard/content-pages"));
const ContentCampaigns = lazy(() => import("@/pages/dashboard/content-campaigns"));
const ContentDomains = lazy(() => import("@/pages/dashboard/content-domains"));

const SeoLinks = lazy(() => import("@/pages/dashboard/seo-links"));
const SeoHealth = lazy(() => import("@/pages/dashboard/seo-health"));
const SeoCms = lazy(() => import("@/pages/dashboard/seo-cms"));
const SeoReports = lazy(() => import("@/pages/dashboard/seo-reports"));
const ContentEngine = lazy(() => import("@/pages/dashboard/content-engine"));
const WebsiteEngine = lazy(() => import("@/pages/dashboard/website-engine"));
const WebsiteEngineSettings = lazy(() => import("@/pages/dashboard/website-engine-settings"));
const PostEditor = lazy(() => import("@/pages/dashboard/post-editor"));

const TwilioCallLogs = lazy(() => import("@/pages/dashboard/twilio-call-logs"));
const TwilioVoice = lazy(() => import("@/pages/dashboard/twilio-voice"));
const TwilioSms = lazy(() => import("@/pages/dashboard/twilio-sms"));

const WidgetMonitoring = lazy(() => import("@/pages/dashboard/widget-monitoring"));
const WidgetCode = lazy(() => import("@/pages/dashboard/widget-code"));

const CrmPipeline = lazy(() => import("@/pages/dashboard/crm-pipeline"));
const CrmContacts = lazy(() => import("@/pages/dashboard/crm-contacts"));

const AnalyticsOverview = lazy(() => import("@/pages/dashboard/analytics-overview"));
const AnalyticsExport = lazy(() => import("@/pages/dashboard/analytics-export"));

const ConnectionsAi = lazy(() => import("@/pages/dashboard/connections-ai"));
const ConnectionsImages = lazy(() => import("@/pages/dashboard/connections-images"));
const ConnectionsPayments = lazy(() => import("@/pages/dashboard/connections-payments"));
const ConnectionsTwilio = lazy(() => import("@/pages/dashboard/connections-twilio"));

const AiTrainingKb = lazy(() => import("@/pages/dashboard/ai-training-kb"));
const AiTrainingChannels = lazy(() => import("@/pages/dashboard/ai-training-channels"));

const SettingsTeamNew = lazy(() => import("@/pages/dashboard/settings-team"));
const SettingsWhiteLabel = lazy(() => import("@/pages/dashboard/settings-white-label"));
const SettingsBilling = lazy(() => import("@/pages/dashboard/settings-billing"));
const SettingsSetup = lazy(() => import("@/pages/dashboard/settings-setup"));

const SupportDocs = lazy(() => import("@/pages/dashboard/support-docs"));
const SupportTickets = lazy(() => import("@/pages/dashboard/support-tickets"));

const SettingsTeam = lazy(() => import("@/pages/dashboard/settings/team"));
const SettingsTrainWidget = lazy(() => import("@/pages/dashboard/settings/train-widget"));
const SettingsWidgetCodeOld = lazy(() => import("@/pages/dashboard/settings/widget-code"));
const SettingsPayments = lazy(() => import("@/pages/dashboard/settings/payments"));
const SettingsTwilioSetup = lazy(() => import("@/pages/dashboard/settings/twilio-setup"));
const SettingsTwilioVoice = lazy(() => import("@/pages/dashboard/settings/twilio-voice"));
const SettingsTwilioSms = lazy(() => import("@/pages/dashboard/settings/twilio-sms"));
const ByokOpenai = lazy(() => import("@/pages/dashboard/byok/openai"));
const ByokGrok = lazy(() => import("@/pages/dashboard/byok/grok"));
const ByokAnthropic = lazy(() => import("@/pages/dashboard/byok/anthropic"));
const ByokGoogle = lazy(() => import("@/pages/dashboard/byok/google"));
const ByokMistral = lazy(() => import("@/pages/dashboard/byok/mistral"));
const ByokCohere = lazy(() => import("@/pages/dashboard/byok/cohere"));
const ByokPerplexity = lazy(() => import("@/pages/dashboard/byok/perplexity"));
const RoomTypes = lazy(() => import("@/pages/dashboard/room-types"));
const Rooms = lazy(() => import("@/pages/dashboard/rooms"));
const RoomBookings = lazy(() => import("@/pages/dashboard/room-bookings"));
const Documentation = lazy(() => import("@/pages/dashboard/documentation"));
const Support = lazy(() => import("@/pages/dashboard/support"));
const ExportData = lazy(() => import("@/pages/dashboard/export-data"));
const GoogleSearchConsole = lazy(() => import("@/pages/dashboard/google-search-console"));
const RankTracker = lazy(() => import("@/pages/dashboard/rank-tracker"));
const DashboardLocalSearchGrid = lazy(() => import("@/pages/dashboard/local-search-grid"));
const WebsiteChanges = lazy(() => import("@/pages/dashboard/website-changes"));
const WidgetDemo = lazy(() => import("@/pages/widget-demo"));
const DemoSmsConfirmation = lazy(() => import("@/pages/demo-sms-confirmation"));
const DemoEmailConfirmation = lazy(() => import("@/pages/demo-email-confirmation"));
const DemoReminder = lazy(() => import("@/pages/demo-reminder"));
const DemoCMSLogos = lazy(() => import("@/pages/demo-cms-logos"));
const DemoChatWidget = lazy(() => import("@/pages/demo-chat-widget"));

const SolutionsRestaurants = lazy(() => import("@/pages/solutions/restaurants"));
const SolutionsCafes = lazy(() => import("@/pages/solutions/cafes"));
const SolutionsBars = lazy(() => import("@/pages/solutions/bars"));
const SolutionsHotels = lazy(() => import("@/pages/solutions/hotels"));
const SolutionsMultiLocation = lazy(() => import("@/pages/solutions/multi-location"));

const PlatformAiConcierge = lazy(() => import("@/pages/platform/ai-concierge"));
const PlatformByok = lazy(() => import("@/pages/platform/byok"));
const PlatformContentMarketing = lazy(() => import("@/pages/platform/content-marketing"));
const PlatformDashboard = lazy(() => import("@/pages/platform/dashboard"));
const PlatformHospitalityWebsites = lazy(() => import("@/pages/platform/hospitality-websites"));
const PlatformIntegrations = lazy(() => import("@/pages/platform/integrations"));
const PlatformLocalSearchGrid = lazy(() => import("@/pages/platform/local-search-grid"));
const PlatformRankTracking = lazy(() => import("@/pages/platform/rank-tracking"));
const PlatformSearchConsole = lazy(() => import("@/pages/platform/search-console"));
const PlatformSeo = lazy(() => import("@/pages/platform/seo"));
const PlatformSeoTools = lazy(() => import("@/pages/platform/seo-tools"));

const LocalCitations = lazy(() => import("@/pages/services/local-citations"));

const ComparisonOpenTable = lazy(() => import("@/pages/comparisons/opentable"));
const ComparisonResy = lazy(() => import("@/pages/comparisons/resy"));
const ComparisonBestBooking = lazy(() => import("@/pages/comparisons/best-booking-systems"));
const ComparisonPricing = lazy(() => import("@/pages/comparisons/pricing"));
const ComparisonPlatform = lazy(() => import("@/pages/comparisons/platform"));

const AnalyticsFeature = lazy(() => import("@/pages/features/analytics"));
const MultiLanguageFeature = lazy(() => import("@/pages/features/multi-language"));
const PrepaidReservationsFeature = lazy(() => import("@/pages/features/prepaid-reservations"));
const SmsConfirmationsFeature = lazy(() => import("@/pages/features/sms-confirmations"));
const VoiceBookingFeature = lazy(() => import("@/pages/features/voice-booking"));
const WaitlistFeature = lazy(() => import("@/pages/features/waitlist"));

const Locations = lazy(() => import("@/pages/locations"));
const LocationLanding = lazy(() => import("@/pages/location-landing"));

const ClientPreviewPage = lazy(() => import("@/pages/preview/preview-page"));
const RestaurantBold = lazy(() => import("@/pages/templates/restaurant-bold"));
const RestaurantVibrant = lazy(() => import("@/pages/templates/restaurant-vibrant"));
const RestaurantSimple = lazy(() => import("@/pages/templates/restaurant-simple"));
const RestaurantMinimalistic = lazy(() => import("@/pages/templates/restaurant-minimalistic"));
const CafeBold = lazy(() => import("@/pages/templates/cafe-bold"));
const CafeVibrant = lazy(() => import("@/pages/templates/cafe-vibrant"));
const CafeSimple = lazy(() => import("@/pages/templates/cafe-simple"));
const CafeMinimalistic = lazy(() => import("@/pages/templates/cafe-minimalistic"));
const BarBold = lazy(() => import("@/pages/templates/bar-bold"));
const BarVibrant = lazy(() => import("@/pages/templates/bar-vibrant"));
const BarSimple = lazy(() => import("@/pages/templates/bar-simple"));
const BarMinimalistic = lazy(() => import("@/pages/templates/bar-minimalistic"));
const HotelBold = lazy(() => import("@/pages/templates/hotel-bold"));
const HotelVibrant = lazy(() => import("@/pages/templates/hotel-vibrant"));
const HotelSimple = lazy(() => import("@/pages/templates/hotel-simple"));
const HotelMinimalistic = lazy(() => import("@/pages/templates/hotel-minimalistic"));

function getAdminRole(): AdminRole {
  try {
    const session = typeof window !== 'undefined' ? localStorage.getItem("indexflow_admin_session") : null;
    if (session) {
      const parsed = JSON.parse(session);
      return (parsed.role as AdminRole) || "super_admin";
    }
  } catch {}
  return "super_admin";
}

function hasAdminPermission(role: AdminRole, permission: string): boolean {
  const perms = adminRolePermissions[role];
  if (!perms) return false;
  if (perms.includes("*")) return true;
  return perms.includes(permission);
}

function WorkspaceRedirect() {
  const savedId = typeof window !== "undefined"
    ? localStorage.getItem("indexflow_workspace_id")
    : null;
  const [, navigate] = useLocation();
  const currentPath = window.location.pathname;

  if (savedId) {
    navigate(`/${savedId}${currentPath}`, { replace: true });
  } else {
    navigate("/select-workspace", { replace: true });
  }
  return null;
}

function ClientRoute({ component: Component }: { component: ComponentType }) {
  return (
    <ClientLayout>
      <Component />
    </ClientLayout>
  );
}

function AdminRoute({ component: Component, permission }: { component: ComponentType; permission: string }) {
  const role = getAdminRole();
  if (!hasAdminPermission(role, permission)) {
    const firstAllowed = adminRolePermissions[role]?.[0];
    if (firstAllowed && firstAllowed !== "*") {
      const target = firstAllowed === "dashboard" ? "/admin" : `/admin/${firstAllowed}`;
      return <Redirect to={target} />;
    }
    return <Redirect to="/admin" />;
  }
  return <Component />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-background"><div className="flex flex-col items-center gap-3"><div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" /><p className="text-sm text-muted-foreground">Loading...</p></div></div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/home-archive" component={HomeArchive} />
        <Route path="/founder-statement" component={About} />
        <Route path="/how-it-works" component={About} />
        <Route path="/solutions/seo-agencies" component={SolutionsRestaurants} />
        <Route path="/solutions/content-agencies" component={SolutionsCafes} />
        <Route path="/solutions/marketing-agencies" component={SolutionsBars} />
        <Route path="/solutions/freelancers" component={SolutionsHotels} />
        <Route path="/solutions/enterprise" component={SolutionsMultiLocation} />
        <Route path="/solutions/restaurants" component={SolutionsRestaurants} />
        <Route path="/solutions/cafes" component={SolutionsCafes} />
        <Route path="/solutions/bars" component={SolutionsBars} />
        <Route path="/solutions/hotels" component={SolutionsHotels} />
        <Route path="/solutions/multi-location" component={SolutionsMultiLocation} />

        <Route path="/platform/ai-widget-voice" component={PlatformAiConcierge} />
        <Route path="/platform/ai-widget" component={PlatformAiConcierge} />
        <Route path="/platform/ai-concierge" component={PlatformAiConcierge} />
        <Route path="/platform/byok" component={PlatformByok} />
        <Route path="/platform/content-engine" component={PlatformContentMarketing} />
        <Route path="/platform/content-marketing" component={PlatformContentMarketing} />
        <Route path="/platform/dashboard" component={PlatformDashboard} />
        <Route path="/platform/cms-integration" component={PlatformHospitalityWebsites} />
        <Route path="/platform/hospitality-websites" component={PlatformHospitalityWebsites} />
        <Route path="/platform/crm-pipeline" component={PlatformIntegrations} />
        <Route path="/platform/integrations" component={PlatformIntegrations} />
        <Route path="/platform/local-search-grid" component={PlatformLocalSearchGrid} />
        <Route path="/platform/rank-tracking" component={PlatformRankTracking} />
        <Route path="/platform/search-console" component={PlatformSearchConsole} />
        <Route path="/platform/seo" component={PlatformSeo} />
        <Route path="/platform/seo-tools" component={PlatformSeoTools} />
        <Route path="/platform/seo-audit" component={PlatformSeoTools} />
        <Route path="/platform/schema-markup" component={PlatformSeo} />
        <Route path="/platform/link-builder" component={PlatformSeoTools} />
        <Route path="/platform/white-label" component={PlatformByok} />
        <Route path="/platform/invoices-reports" component={PlatformDashboard} />

        <Route path="/services/local-citations" component={LocalCitations} />

        <Route path="/comparisons/semrush" component={ComparisonOpenTable} />
        <Route path="/comparisons/ahrefs" component={ComparisonResy} />
        <Route path="/comparisons/best-seo-platforms" component={ComparisonBestBooking} />
        <Route path="/comparisons/opentable" component={ComparisonOpenTable} />
        <Route path="/comparisons/resy" component={ComparisonResy} />
        <Route path="/comparisons/best-booking-systems" component={ComparisonBestBooking} />
        <Route path="/comparisons/pricing" component={ComparisonPricing} />
        <Route path="/comparisons/platform" component={ComparisonPlatform} />

        <Route path="/features/analytics" component={AnalyticsFeature} />
        <Route path="/features/multi-language" component={MultiLanguageFeature} />
        <Route path="/features/prepaid-reservations" component={PrepaidReservationsFeature} />
        <Route path="/features/sms-confirmations" component={SmsConfirmationsFeature} />
        <Route path="/features/voice-booking" component={VoiceBookingFeature} />
        <Route path="/features/waitlist" component={WaitlistFeature} />
        <Route path="/locations" component={Locations} />
        <Route path="/locations/:city" component={LocationLanding} />
        <Route path="/locations/:city/:service" component={LocationLanding} />
        <Route path="/portfolio" component={Gallery} />
        <Route path="/testimonials" component={Testimonials} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/faq" component={FAQ} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:category/:slug" component={BlogPost} />
        <Route path="/templates" component={Templates} />
        <Route path="/contact" component={Contact} />
        <Route path="/book-demo" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/docs" component={Docs} />
        <Route path="/widget-demo" component={WidgetDemo} />
        <Route path="/demo-sms" component={DemoSmsConfirmation} />
        <Route path="/demo-email" component={DemoEmailConfirmation} />
        <Route path="/demo-reminder" component={DemoReminder} />
        <Route path="/demo-cms" component={DemoCMSLogos} />
        <Route path="/demo-chat" component={DemoChatWidget} />
        <Route path="/client-login" component={Login} />
        <Route path="/dev/client" component={DevClient} />
        <Route path="/dev/admin" component={DevAdmin} />

        {/* Super Admin Dashboard Routes */}
        <Route path="/admin">{() => <AdminRoute component={AdminDashboard} permission="dashboard" />}</Route>
        <Route path="/admin/agencies">{() => <AdminRoute component={AdminAgencies} permission="*" />}</Route>
        <Route path="/admin/agencies/detail">{() => <AdminRoute component={AdminAgencyDetail} permission="*" />}</Route>
        <Route path="/admin/agencies/pending">{() => <AdminRoute component={AdminAgenciesPending} permission="*" />}</Route>
        <Route path="/admin/content/posts">{() => <AdminRoute component={AdminContentPosts} permission="*" />}</Route>
        <Route path="/admin/content/campaigns">{() => <AdminRoute component={AdminContentCampaigns} permission="*" />}</Route>
        <Route path="/admin/content/moderation">{() => <AdminRoute component={AdminContentModeration} permission="*" />}</Route>
        <Route path="/admin/platform-seo/keywords">{() => <AdminRoute component={AdminPlatformSeoKeywords} permission="*" />}</Route>
        <Route path="/admin/platform-seo/api-usage">{() => <AdminRoute component={AdminPlatformSeoApi} permission="*" />}</Route>
        <Route path="/admin/billing/subscriptions">{() => <AdminRoute component={AdminBillingSubscriptions} permission="*" />}</Route>
        <Route path="/admin/billing/revenue">{() => <AdminRoute component={AdminBillingRevenue} permission="*" />}</Route>
        <Route path="/admin/billing/payouts">{() => <AdminRoute component={AdminBillingPayouts} permission="*" />}</Route>
        <Route path="/admin/system/api-keys">{() => <AdminRoute component={AdminSystemApiKeys} permission="*" />}</Route>
        <Route path="/admin/system/twilio">{() => <AdminRoute component={AdminSystemTwilio} permission="*" />}</Route>
        <Route path="/admin/system/email">{() => <AdminRoute component={AdminSystemEmail} permission="*" />}</Route>
        <Route path="/admin/system/infrastructure">{() => <AdminRoute component={AdminSystemInfrastructure} permission="*" />}</Route>
        <Route path="/admin/users/all">{() => <AdminRoute component={AdminUsersAll} permission="*" />}</Route>
        <Route path="/admin/users/admins">{() => <AdminRoute component={AdminUsersAdmins} permission="*" />}</Route>
        <Route path="/admin/support/tickets">{() => <AdminRoute component={AdminSupportTickets} permission="*" />}</Route>
        <Route path="/admin/support/call-logs">{() => <AdminRoute component={AdminSupportCallLogs} permission="*" />}</Route>
        <Route path="/admin/support/announcements">{() => <AdminRoute component={AdminSupportAnnouncements} permission="*" />}</Route>
        <Route path="/admin/settings/config">{() => <AdminRoute component={AdminSettingsConfig} permission="*" />}</Route>
        <Route path="/admin/settings/branding">{() => <AdminRoute component={AdminSettingsBranding} permission="*" />}</Route>

        {/* Legacy admin routes for backward compatibility */}
        <Route path="/admin/clients">{() => <AdminRoute component={AdminClients} permission="clients" />}</Route>
        <Route path="/admin/users">{() => <AdminRoute component={AdminUsers} permission="users" />}</Route>
        <Route path="/admin/billing">{() => <AdminRoute component={AdminBilling} permission="billing" />}</Route>
        <Route path="/admin/websites">{() => <AdminRoute component={AdminWebsites} permission="websites" />}</Route>
        <Route path="/admin/widgets">{() => <AdminRoute component={AdminWidgets} permission="widgets" />}</Route>
        <Route path="/admin/calls">{() => <AdminRoute component={AdminCalls} permission="calls" />}</Route>
        <Route path="/admin/twilio">{() => <AdminRoute component={AdminTwilio} permission="twilio" />}</Route>
        <Route path="/admin/support">{() => <AdminRoute component={AdminSupport} permission="support" />}</Route>
        <Route path="/admin/analytics">{() => <AdminRoute component={AdminAnalytics} permission="analytics" />}</Route>
        <Route path="/admin/export-data">{() => <AdminRoute component={AdminExportData} permission="export-data" />}</Route>
        <Route path="/admin/seo">{() => <AdminRoute component={AdminSeo} permission="seo" />}</Route>
        <Route path="/admin/website-changes">{() => <AdminRoute component={AdminWebsiteChanges} permission="website-changes" />}</Route>
        <Route path="/admin/crm">{() => <AdminRoute component={AdminCrm} permission="crm" />}</Route>
        <Route path="/admin/content">{() => <AdminRoute component={AdminContent} permission="*" />}</Route>
        <Route path="/admin/pseo">{() => <AdminRoute component={AdminPseo} permission="*" />}</Route>
        <Route path="/admin/website-engine">{() => <AdminRoute component={AdminWebsiteEngine} permission="*" />}</Route>
        <Route path="/admin/notifications">{() => <AdminRoute component={AdminNotifications} permission="notifications" />}</Route>
        <Route path="/admin/settings">{() => <AdminRoute component={AdminSettings} permission="settings" />}</Route>
        <Route path="/admin/seo/rank-tracker">{() => <AdminRoute component={AdminSeoRankTracker} permission="seo" />}</Route>
        <Route path="/admin/seo/local-grid">{() => <AdminRoute component={AdminSeoLocalGrid} permission="seo" />}</Route>
        <Route path="/admin/seo/ai-visibility">{() => <AdminRoute component={AdminSeoAIVisibility} permission="seo" />}</Route>
        <Route path="/admin/call-logs">{() => <AdminRoute component={AdminCallLogs} permission="calls" />}</Route>
        <Route path="/admin/widget-config">{() => <AdminRoute component={AdminWidgetConfig} permission="widgets" />}</Route>

        {/* Bare path redirects — prepend saved workspace ID */}
        <Route path="/content/:rest*" component={WorkspaceRedirect} />
        <Route path="/seo/:rest*" component={WorkspaceRedirect} />
        <Route path="/rank-tracker/:rest*" component={WorkspaceRedirect} />
        <Route path="/crm/:rest*" component={WorkspaceRedirect} />
        <Route path="/settings/:rest*" component={WorkspaceRedirect} />
        <Route path="/connections/:rest*" component={WorkspaceRedirect} />
        <Route path="/analytics/:rest*" component={WorkspaceRedirect} />
        <Route path="/widget/:rest*" component={WorkspaceRedirect} />
        <Route path="/twilio/:rest*" component={WorkspaceRedirect} />
        <Route path="/ai-training/:rest*" component={WorkspaceRedirect} />
        <Route path="/support/:rest*" component={WorkspaceRedirect} />
        <Route path="/today" component={WorkspaceRedirect} />

        {/* Client Dashboard Routes */}
        <Route path="/select-workspace" component={SelectWorkspace} />
        <Route path="/:workspaceId/today">{() => <ClientRoute component={Today} />}</Route>
        <Route path="/:workspaceId/calendar">{() => <ClientRoute component={CalendarView} />}</Route>
        <Route path="/:workspaceId/bookings/:bookingId">{() => <ClientRoute component={BookingDetail} />}</Route>
        <Route path="/:workspaceId/calls">{() => <ClientRoute component={Calls} />}</Route>
        <Route path="/:workspaceId/calls/:callId">{() => <ClientRoute component={CallDetail} />}</Route>
        <Route path="/:workspaceId/analytics">{() => <ClientRoute component={Analytics} />}</Route>

        {/* Content Engine */}
        <Route path="/:workspaceId/content/posts">{() => <ClientRoute component={ContentPosts} />}</Route>
        <Route path="/:workspaceId/content/pages">{() => <ClientRoute component={ContentPages} />}</Route>
        <Route path="/:workspaceId/content/campaigns">{() => <ClientRoute component={ContentCampaigns} />}</Route>
        <Route path="/:workspaceId/content/domains">{() => <ClientRoute component={ContentDomains} />}</Route>

        {/* Content Engine (unified) */}
        <Route path="/:workspaceId/content-engine">{() => <ClientRoute component={ContentEngine} />}</Route>
        <Route path="/:workspaceId/website-engine">{() => <ClientRoute component={WebsiteEngine} />}</Route>
        <Route path="/:workspaceId/website-engine/settings">{() => <ClientRoute component={WebsiteEngineSettings} />}</Route>
        <Route path="/:workspaceId/content/posts/:postId/edit">{() => <ClientRoute component={PostEditor} />}</Route>

        {/* SEO */}
        <Route path="/:workspaceId/seo/links">{() => <ClientRoute component={SeoLinks} />}</Route>
        <Route path="/:workspaceId/seo/health">{() => <ClientRoute component={SeoHealth} />}</Route>
        <Route path="/:workspaceId/seo/cms">{() => <ClientRoute component={SeoCms} />}</Route>
        <Route path="/:workspaceId/seo/reports">{() => <ClientRoute component={SeoReports} />}</Route>

        {/* Rank Tracker */}
        <Route path="/:workspaceId/rank-tracker/track-keywords">{() => <ClientRoute component={RankTracker} />}</Route>
        <Route path="/:workspaceId/rank-tracker/local-search-grid">{() => <ClientRoute component={DashboardLocalSearchGrid} />}</Route>
        <Route path="/:workspaceId/rank-tracker/google-search-console">{() => <ClientRoute component={GoogleSearchConsole} />}</Route>

        {/* Twilio */}
        <Route path="/:workspaceId/twilio/call-logs">{() => <ClientRoute component={TwilioCallLogs} />}</Route>
        <Route path="/:workspaceId/twilio/voice">{() => <ClientRoute component={TwilioVoice} />}</Route>
        <Route path="/:workspaceId/twilio/sms">{() => <ClientRoute component={TwilioSms} />}</Route>

        {/* Widget */}
        <Route path="/:workspaceId/widget/monitoring">{() => <ClientRoute component={WidgetMonitoring} />}</Route>
        <Route path="/:workspaceId/widget/code">{() => <ClientRoute component={WidgetCode} />}</Route>

        {/* CRM */}
        <Route path="/:workspaceId/crm/pipeline">{() => <ClientRoute component={CrmPipeline} />}</Route>
        <Route path="/:workspaceId/crm/contacts">{() => <ClientRoute component={CrmContacts} />}</Route>

        {/* Analytics */}
        <Route path="/:workspaceId/analytics/overview">{() => <ClientRoute component={AnalyticsOverview} />}</Route>
        <Route path="/:workspaceId/analytics/export">{() => <ClientRoute component={AnalyticsExport} />}</Route>

        {/* Connections */}
        <Route path="/:workspaceId/connections/ai-providers">{() => <ClientRoute component={ConnectionsAi} />}</Route>
        <Route path="/:workspaceId/connections/image-banks">{() => <ClientRoute component={ConnectionsImages} />}</Route>
        <Route path="/:workspaceId/connections/payments">{() => <ClientRoute component={ConnectionsPayments} />}</Route>
        <Route path="/:workspaceId/connections/twilio">{() => <ClientRoute component={ConnectionsTwilio} />}</Route>

        {/* AI Training */}
        <Route path="/:workspaceId/ai-training/knowledge-base">{() => <ClientRoute component={AiTrainingKb} />}</Route>
        <Route path="/:workspaceId/ai-training/channels">{() => <ClientRoute component={AiTrainingChannels} />}</Route>

        {/* Settings */}
        <Route path="/:workspaceId/settings/team">{() => <ClientRoute component={SettingsTeamNew} />}</Route>
        <Route path="/:workspaceId/settings/white-label">{() => <ClientRoute component={SettingsWhiteLabel} />}</Route>
        <Route path="/:workspaceId/settings/billing">{() => <ClientRoute component={SettingsBilling} />}</Route>
        <Route path="/:workspaceId/settings/setup-guide">{() => <ClientRoute component={SettingsSetup} />}</Route>

        {/* Support */}
        <Route path="/:workspaceId/support/documentation">{() => <ClientRoute component={SupportDocs} />}</Route>
        <Route path="/:workspaceId/support/tickets">{() => <ClientRoute component={SupportTickets} />}</Route>

        {/* Legacy client dashboard routes */}
        <Route path="/:workspaceId/settings/train-widget">{() => <ClientRoute component={SettingsTrainWidget} />}</Route>
        <Route path="/:workspaceId/settings/widget-code">{() => <ClientRoute component={SettingsWidgetCodeOld} />}</Route>
        <Route path="/:workspaceId/settings/payments">{() => <ClientRoute component={SettingsPayments} />}</Route>
        <Route path="/:workspaceId/settings/twilio-setup">{() => <ClientRoute component={SettingsTwilioSetup} />}</Route>
        <Route path="/:workspaceId/settings/twilio-voice">{() => <ClientRoute component={SettingsTwilioVoice} />}</Route>
        <Route path="/:workspaceId/settings/twilio-sms">{() => <ClientRoute component={SettingsTwilioSms} />}</Route>
        <Route path="/:workspaceId/byok/openai">{() => <ClientRoute component={ByokOpenai} />}</Route>
        <Route path="/:workspaceId/byok/grok">{() => <ClientRoute component={ByokGrok} />}</Route>
        <Route path="/:workspaceId/byok/anthropic">{() => <ClientRoute component={ByokAnthropic} />}</Route>
        <Route path="/:workspaceId/byok/google">{() => <ClientRoute component={ByokGoogle} />}</Route>
        <Route path="/:workspaceId/byok/mistral">{() => <ClientRoute component={ByokMistral} />}</Route>
        <Route path="/:workspaceId/byok/cohere">{() => <ClientRoute component={ByokCohere} />}</Route>
        <Route path="/:workspaceId/byok/perplexity">{() => <ClientRoute component={ByokPerplexity} />}</Route>
        <Route path="/:workspaceId/room-types">{() => <ClientRoute component={RoomTypes} />}</Route>
        <Route path="/:workspaceId/rooms">{() => <ClientRoute component={Rooms} />}</Route>
        <Route path="/:workspaceId/room-bookings">{() => <ClientRoute component={RoomBookings} />}</Route>
        <Route path="/:workspaceId/export-data">{() => <ClientRoute component={ExportData} />}</Route>
        <Route path="/:workspaceId/website-changes">{() => <ClientRoute component={WebsiteChanges} />}</Route>
        <Route path="/:workspaceId/documentation">{() => <ClientRoute component={Documentation} />}</Route>
        <Route path="/:workspaceId/support" >{() => <ClientRoute component={Support} />}</Route>

        {/* Template previews */}
        <Route path="/preview/restaurant-bold" component={RestaurantBold} />
        <Route path="/preview/restaurant-vibrant" component={RestaurantVibrant} />
        <Route path="/preview/restaurant-simple" component={RestaurantSimple} />
        <Route path="/preview/restaurant-minimalistic" component={RestaurantMinimalistic} />
        <Route path="/preview/cafe-bold" component={CafeBold} />
        <Route path="/preview/cafe-vibrant" component={CafeVibrant} />
        <Route path="/preview/cafe-simple" component={CafeSimple} />
        <Route path="/preview/cafe-minimalistic" component={CafeMinimalistic} />
        <Route path="/preview/bar-bold" component={BarBold} />
        <Route path="/preview/bar-vibrant" component={BarVibrant} />
        <Route path="/preview/bar-simple" component={BarSimple} />
        <Route path="/preview/bar-minimalistic" component={BarMinimalistic} />
        <Route path="/preview/hotel-bold" component={HotelBold} />
        <Route path="/preview/hotel-vibrant" component={HotelVibrant} />
        <Route path="/preview/hotel-simple" component={HotelSimple} />
        <Route path="/preview/hotel-minimalistic" component={HotelMinimalistic} />
        <Route path="/preview/client/:token" component={ClientPreviewPage} />
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AppContent() {
  const [location] = useLocation();
  const [mounted, setMounted] = useState(false);
  const isAppRoute = location.startsWith("/client-login") || 
                      location.startsWith("/select-workspace") || 
                      location.startsWith("/preview/") ||
                      location.startsWith("/widget-demo") ||
                      location.startsWith("/demo-") ||
                      location.startsWith("/admin") ||
                      location.includes("/today") ||
                      location.includes("/calendar") ||
                      location.includes("/bookings") ||
                      location.includes("/calls") ||
                      location.includes("/analytics") ||
                      location.includes("/settings") ||
                      location.includes("/byok") ||
                      location.includes("/room-types") ||
                      location.includes("/rooms") ||
                      location.includes("/room-bookings") ||
                      location.includes("/documentation") ||
                      location.includes("/support") ||
                      location.includes("/export-data") ||
                      location.includes("/ai-training") ||
                      location.includes("/rank-tracker") ||
                      location.includes("/website-changes") ||
                      location.includes("/content/") ||
                      location.includes("/seo/") ||
                      location.includes("/twilio/") ||
                      location.includes("/widget/") ||
                      location.includes("/crm/") ||
                      location.includes("/connections/");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <AppRoutes />
      {mounted && !isAppRoute && <AIWidget />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
          <Toaster />
          <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
