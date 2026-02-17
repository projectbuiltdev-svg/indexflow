import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";

import LandingPage from "@/pages/landing";
import NotFound from "@/pages/not-found";

import { AdminLayout } from "@/components/admin-layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminClients from "@/pages/admin/clients";
import AdminCRM from "@/pages/admin/crm";
import AdminUsers from "@/pages/admin/users";
import AdminBilling from "@/pages/admin/billing";
import AdminWebsites from "@/pages/admin/websites";
import AdminWebsiteChanges from "@/pages/admin/website-changes";
import AdminWidgetConfig from "@/pages/admin/widget-config";
import AdminTwilio from "@/pages/admin/twilio";
import AdminCallLogs from "@/pages/admin/call-logs";
import AdminContent from "@/pages/admin/content";
import AdminSEO from "@/pages/admin/seo";
import AdminRankTracker from "@/pages/admin/seo-rank-tracker";
import AdminLocalGrid from "@/pages/admin/seo-local-grid";
import AdminAIVisibility from "@/pages/admin/seo-ai-visibility";
import AdminSupport from "@/pages/admin/support";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminExport from "@/pages/admin/export";
import AdminNotifications from "@/pages/admin/notifications";
import AdminSettings from "@/pages/admin/settings";

import { ClientLayout } from "@/components/client-layout";
import DashboardToday from "@/pages/dashboard/today";
import DashboardCalendar from "@/pages/dashboard/calendar";
import DashboardCalls from "@/pages/dashboard/calls";
import DashboardAnalytics from "@/pages/dashboard/analytics";
import DashboardExport from "@/pages/dashboard/export";
import SettingsHours from "@/pages/dashboard/settings/hours";
import SettingsClosures from "@/pages/dashboard/settings/closures";
import SettingsResources from "@/pages/dashboard/settings/resources";
import SettingsTeam from "@/pages/dashboard/settings/team";
import SettingsPayments from "@/pages/dashboard/settings/payments";
import RoomTypes from "@/pages/dashboard/rooms/types";
import RoomsList from "@/pages/dashboard/rooms/list";
import RoomBookings from "@/pages/dashboard/rooms/bookings";
import RankTracker from "@/pages/dashboard/rank-tracker";
import WebsiteChanges from "@/pages/dashboard/website-changes";
import Documentation from "@/pages/dashboard/docs";
import DashboardSupport from "@/pages/dashboard/support";

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/clients" component={AdminClients} />
        <Route path="/admin/crm" component={AdminCRM} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/billing" component={AdminBilling} />
        <Route path="/admin/websites" component={AdminWebsites} />
        <Route path="/admin/website-changes" component={AdminWebsiteChanges} />
        <Route path="/admin/widget-config" component={AdminWidgetConfig} />
        <Route path="/admin/twilio" component={AdminTwilio} />
        <Route path="/admin/call-logs" component={AdminCallLogs} />
        <Route path="/admin/content" component={AdminContent} />
        <Route path="/admin/seo" component={AdminSEO} />
        <Route path="/admin/seo/rank-tracker" component={AdminRankTracker} />
        <Route path="/admin/seo/local-grid" component={AdminLocalGrid} />
        <Route path="/admin/seo/ai-visibility" component={AdminAIVisibility} />
        <Route path="/admin/support" component={AdminSupport} />
        <Route path="/admin/analytics" component={AdminAnalytics} />
        <Route path="/admin/export" component={AdminExport} />
        <Route path="/admin/notifications" component={AdminNotifications} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function ClientRoutes() {
  return (
    <ClientLayout>
      <Switch>
        <Route path="/dashboard" component={DashboardToday} />
        <Route path="/dashboard/calendar" component={DashboardCalendar} />
        <Route path="/dashboard/calls" component={DashboardCalls} />
        <Route path="/dashboard/analytics" component={DashboardAnalytics} />
        <Route path="/dashboard/export" component={DashboardExport} />
        <Route path="/dashboard/settings/hours" component={SettingsHours} />
        <Route path="/dashboard/settings/closures" component={SettingsClosures} />
        <Route path="/dashboard/settings/resources" component={SettingsResources} />
        <Route path="/dashboard/settings/team" component={SettingsTeam} />
        <Route path="/dashboard/settings/payments" component={SettingsPayments} />
        <Route path="/dashboard/rooms/types" component={RoomTypes} />
        <Route path="/dashboard/rooms/list" component={RoomsList} />
        <Route path="/dashboard/rooms/bookings" component={RoomBookings} />
        <Route path="/dashboard/rank-tracker" component={RankTracker} />
        <Route path="/dashboard/website-changes" component={WebsiteChanges} />
        <Route path="/dashboard/docs" component={Documentation} />
        <Route path="/dashboard/support" component={DashboardSupport} />
        <Route component={NotFound} />
      </Switch>
    </ClientLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/admin" component={AdminRoutes} />
      <Route path="/admin/:rest*" component={AdminRoutes} />
      <Route path="/dashboard" component={ClientRoutes} />
      <Route path="/dashboard/:rest*" component={ClientRoutes} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
