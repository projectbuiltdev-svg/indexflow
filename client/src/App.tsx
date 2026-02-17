import { useEffect, lazy, Suspense, type ComponentType } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import type { AdminRole } from "@shared/schema";
import { adminRolePermissions } from "@shared/schema";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";


const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/home"));
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
const AdminSeoRankTracker = lazy(() => import("@/pages/admin/seo-rank-tracker"));
const AdminSeoLocalGrid = lazy(() => import("@/pages/admin/seo-local-grid"));
const AdminSeoAIVisibility = lazy(() => import("@/pages/admin/seo-ai-visibility"));
const AdminCallLogs = lazy(() => import("@/pages/admin/call-logs"));
const AdminWidgetConfig = lazy(() => import("@/pages/admin/widget-config"));

const SelectVenue = lazy(() => import("@/pages/dashboard/select-venue"));
const Today = lazy(() => import("@/pages/dashboard/today"));
const CalendarView = lazy(() => import("@/pages/dashboard/calendar"));
const BookingDetail = lazy(() => import("@/pages/dashboard/booking-detail"));
const Calls = lazy(() => import("@/pages/dashboard/calls"));
const CallDetail = lazy(() => import("@/pages/dashboard/call-detail"));
const Analytics = lazy(() => import("@/pages/dashboard/analytics"));
const SettingsHours = lazy(() => import("@/pages/dashboard/settings/hours"));
const SettingsClosures = lazy(() => import("@/pages/dashboard/settings/closures"));
const SettingsResources = lazy(() => import("@/pages/dashboard/settings/resources"));
const SettingsTeam = lazy(() => import("@/pages/dashboard/settings/team"));
const SettingsTrainWidget = lazy(() => import("@/pages/dashboard/settings/train-widget"));
const SettingsWidgetCode = lazy(() => import("@/pages/dashboard/settings/widget-code"));
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
    const session = localStorage.getItem("resto_admin_session");
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

function Router() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" /></div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/how-it-works" component={About} />
        <Route path="/solutions/restaurants" component={SolutionsRestaurants} />
        <Route path="/solutions/cafes" component={SolutionsCafes} />
        <Route path="/solutions/bars" component={SolutionsBars} />
        <Route path="/solutions/hotels" component={SolutionsHotels} />
        <Route path="/solutions/multi-location" component={SolutionsMultiLocation} />

        <Route path="/platform/ai-concierge" component={PlatformAiConcierge} />
        <Route path="/platform/byok" component={PlatformByok} />
        <Route path="/platform/content-marketing" component={PlatformContentMarketing} />
        <Route path="/platform/dashboard" component={PlatformDashboard} />
        <Route path="/platform/hospitality-websites" component={PlatformHospitalityWebsites} />
        <Route path="/platform/integrations" component={PlatformIntegrations} />
        <Route path="/platform/local-search-grid" component={PlatformLocalSearchGrid} />
        <Route path="/platform/rank-tracking" component={PlatformRankTracking} />
        <Route path="/platform/search-console" component={PlatformSearchConsole} />
        <Route path="/platform/seo" component={PlatformSeo} />
        <Route path="/platform/seo-tools" component={PlatformSeoTools} />

        <Route path="/services/local-citations" component={LocalCitations} />

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
        <Route path="/admin">{() => <AdminRoute component={AdminDashboard} permission="dashboard" />}</Route>
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
        <Route path="/admin/notifications">{() => <AdminRoute component={AdminNotifications} permission="notifications" />}</Route>
        <Route path="/admin/settings">{() => <AdminRoute component={AdminSettings} permission="settings" />}</Route>
        <Route path="/admin/seo/rank-tracker">{() => <AdminRoute component={AdminSeoRankTracker} permission="seo" />}</Route>
        <Route path="/admin/seo/local-grid">{() => <AdminRoute component={AdminSeoLocalGrid} permission="seo" />}</Route>
        <Route path="/admin/seo/ai-visibility">{() => <AdminRoute component={AdminSeoAIVisibility} permission="seo" />}</Route>
        <Route path="/admin/call-logs">{() => <AdminRoute component={AdminCallLogs} permission="calls" />}</Route>
        <Route path="/admin/widget-config">{() => <AdminRoute component={AdminWidgetConfig} permission="widgets" />}</Route>
        <Route path="/select-venue" component={SelectVenue} />
        <Route path="/:venueId/today" component={Today} />
        <Route path="/:venueId/calendar" component={CalendarView} />
        <Route path="/:venueId/bookings/:bookingId" component={BookingDetail} />
        <Route path="/:venueId/calls" component={Calls} />
        <Route path="/:venueId/calls/:callId" component={CallDetail} />
        <Route path="/:venueId/analytics" component={Analytics} />
        <Route path="/:venueId/settings/hours" component={SettingsHours} />
        <Route path="/:venueId/settings/closures" component={SettingsClosures} />
        <Route path="/:venueId/settings/resources" component={SettingsResources} />
        <Route path="/:venueId/settings/team" component={SettingsTeam} />
        <Route path="/:venueId/settings/train-widget" component={SettingsTrainWidget} />
        <Route path="/:venueId/settings/widget-code" component={SettingsWidgetCode} />
        <Route path="/:venueId/settings/payments" component={SettingsPayments} />
        <Route path="/:venueId/settings/twilio-setup" component={SettingsTwilioSetup} />
        <Route path="/:venueId/settings/twilio-voice" component={SettingsTwilioVoice} />
        <Route path="/:venueId/settings/twilio-sms" component={SettingsTwilioSms} />
        <Route path="/:venueId/byok/openai" component={ByokOpenai} />
        <Route path="/:venueId/byok/grok" component={ByokGrok} />
        <Route path="/:venueId/byok/anthropic" component={ByokAnthropic} />
        <Route path="/:venueId/byok/google" component={ByokGoogle} />
        <Route path="/:venueId/byok/mistral" component={ByokMistral} />
        <Route path="/:venueId/byok/cohere" component={ByokCohere} />
        <Route path="/:venueId/byok/perplexity" component={ByokPerplexity} />
        <Route path="/:venueId/room-types" component={RoomTypes} />
        <Route path="/:venueId/rooms" component={Rooms} />
        <Route path="/:venueId/room-bookings" component={RoomBookings} />
        <Route path="/:venueId/export-data" component={ExportData} />
        <Route path="/:venueId/rank-tracker/google-search-console" component={GoogleSearchConsole} />
        <Route path="/:venueId/rank-tracker/track-keywords" component={RankTracker} />
        <Route path="/:venueId/rank-tracker/local-search-grid" component={DashboardLocalSearchGrid} />
        <Route path="/:venueId/website-changes" component={WebsiteChanges} />
        <Route path="/:venueId/documentation" component={Documentation} />
        <Route path="/:venueId/support" component={Support} />
        
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
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isDashboard = location.startsWith("/client-login") || 
                      location.startsWith("/select-venue") || 
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
                      location.includes("/rank-tracker/") ||
                      location.includes("/website-changes");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Router />
      {!isDashboard && <AIWidget />}
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
