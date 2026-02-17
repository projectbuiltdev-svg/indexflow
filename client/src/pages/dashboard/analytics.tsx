import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, MessageSquare, Phone } from "lucide-react";

export default function DashboardAnalytics() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;

  const { data: reservations = [], isLoading: loadingRes } = useQuery<any[]>({
    queryKey: [`/api/reservations?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const { data: chatLogs = [], isLoading: loadingChat } = useQuery<any[]>({
    queryKey: [`/api/widget-chat-logs?venueId=${venueId}`],
    enabled: !!venueId,
  });

  const { data: callLogs = [], isLoading: loadingCalls } = useQuery<any[]>({
    queryKey: [`/api/call-logs?venueId=${venueId}`],
    enabled: !!venueId,
  });

  if (!venueId) {
    return <div className="p-6 text-muted-foreground" data-testid="no-venue-message">Please select a venue from the sidebar to view analytics.</div>;
  }

  const isLoading = loadingRes || loadingChat || loadingCalls;

  const confirmed = reservations.filter((r: any) => r.status === "confirmed").length;
  const pending = reservations.filter((r: any) => r.status === "pending").length;
  const cancelled = reservations.filter((r: any) => r.status === "cancelled").length;
  const completed = reservations.filter((r: any) => r.status === "completed").length;

  const callStatusCounts: Record<string, number> = {};
  const totalDuration = callLogs.reduce((sum: number, c: any) => {
    callStatusCounts[c.status || "unknown"] = (callStatusCounts[c.status || "unknown"] || 0) + 1;
    return sum + (c.duration || 0);
  }, 0);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Analytics</h1>

      <Tabs defaultValue="bookings">
        <TabsList data-testid="analytics-tabs">
          <TabsTrigger value="bookings" data-testid="tab-bookings"><BarChart3 className="h-4 w-4 mr-1" />Bookings</TabsTrigger>
          <TabsTrigger value="widget" data-testid="tab-widget"><MessageSquare className="h-4 w-4 mr-1" />Widget</TabsTrigger>
          <TabsTrigger value="phone" data-testid="tab-phone"><Phone className="h-4 w-4 mr-1" />Phone</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card data-testid="stat-total-reservations">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Reservations</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{reservations.length}</div></CardContent>
            </Card>
            <Card data-testid="stat-status-confirmed">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{confirmed}</div></CardContent>
            </Card>
            <Card data-testid="stat-status-pending">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{pending}</div></CardContent>
            </Card>
            <Card data-testid="stat-status-cancelled">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Cancelled</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{cancelled}</div></CardContent>
            </Card>
          </div>
          <Card data-testid="stat-status-completed">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{completed}</div></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="widget" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card data-testid="stat-chat-sessions">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Chat Sessions</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{chatLogs.length}</div></CardContent>
            </Card>
            <Card data-testid="stat-total-messages">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{chatLogs.reduce((s: number, c: any) => s + (c.messageCount || 0), 0)}</div></CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="phone" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card data-testid="stat-total-calls">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Calls</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{callLogs.length}</div></CardContent>
            </Card>
            <Card data-testid="stat-total-duration">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Duration (s)</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">{totalDuration}</div></CardContent>
            </Card>
            {Object.entries(callStatusCounts).map(([status, count]) => (
              <Card key={status} data-testid={`stat-call-${status}`}>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground capitalize">{status}</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{count}</div></CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
