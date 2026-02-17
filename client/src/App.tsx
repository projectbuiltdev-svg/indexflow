import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { VenueProvider } from "@/lib/venue-context";
import { DashboardLayout } from "@/components/dashboard-layout";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import DashboardOverview from "@/pages/dashboard/overview";
import ContentEngine from "@/pages/dashboard/content";
import RankTracker from "@/pages/dashboard/keywords";
import LocalGrid from "@/pages/dashboard/grid";
import LeadsCRM from "@/pages/dashboard/leads";
import ReservationsPage from "@/pages/dashboard/reservations";
import SettingsPage from "@/pages/dashboard/settings";

function DashboardRoutes() {
  return (
    <VenueProvider>
      <DashboardLayout>
        <Switch>
          <Route path="/dashboard" component={DashboardOverview} />
          <Route path="/dashboard/content" component={ContentEngine} />
          <Route path="/dashboard/keywords" component={RankTracker} />
          <Route path="/dashboard/grid" component={LocalGrid} />
          <Route path="/dashboard/reservations" component={ReservationsPage} />
          <Route path="/dashboard/leads" component={LeadsCRM} />
          <Route path="/dashboard/settings" component={SettingsPage} />
          <Route component={NotFound} />
        </Switch>
      </DashboardLayout>
    </VenueProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard/:rest*" component={DashboardRoutes} />
      <Route path="/dashboard" component={DashboardRoutes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
