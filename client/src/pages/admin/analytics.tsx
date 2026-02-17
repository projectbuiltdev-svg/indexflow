import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, CalendarCheck, PhoneCall, LifeBuoy } from "lucide-react";
import type { Venue, Reservation, CallLog, SupportTicket } from "@shared/schema";

export default function AdminAnalytics() {
  useVenue();

  const { data: venues = [], isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: reservations = [], isLoading: reservationsLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/admin/reservations"],
  });

  const { data: callLogs = [], isLoading: callsLoading } = useQuery<CallLog[]>({
    queryKey: ["/api/admin/call-logs"],
  });

  const { data: tickets = [], isLoading: ticketsLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/admin/support-tickets"],
  });

  const isLoading = venuesLoading || reservationsLoading || callsLoading || ticketsLoading;

  const stats = [
    { title: "Total Reservations", value: reservations.length, icon: CalendarCheck, testId: "stat-total-reservations" },
    { title: "Total Calls", value: callLogs.length, icon: PhoneCall, testId: "stat-total-calls" },
    { title: "Total Tickets", value: tickets.length, icon: LifeBuoy, testId: "stat-total-tickets" },
    { title: "Active Venues", value: venues.filter((v) => v.status === "active").length, icon: BarChart3, testId: "stat-active-venues" },
  ];

  const venueBreakdown = venues.map((v) => ({
    id: v.id,
    name: v.name,
    reservations: reservations.filter((r) => r.venueId === v.id).length,
    calls: callLogs.filter((c) => c.venueId === v.id).length,
    tickets: tickets.filter((t) => t.venueId === v.id).length,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-analytics">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.testId} data-testid={stat.testId}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid={`${stat.testId}-value`}>{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Breakdown by Venue</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : venueBreakdown.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-analytics">
              No data available.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Reservations</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead>Tickets</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venueBreakdown.map((vb) => (
                  <TableRow key={vb.id} data-testid={`row-analytics-${vb.id}`}>
                    <TableCell className="font-medium">{vb.name}</TableCell>
                    <TableCell data-testid={`text-reservations-${vb.id}`}>{vb.reservations}</TableCell>
                    <TableCell data-testid={`text-calls-${vb.id}`}>{vb.calls}</TableCell>
                    <TableCell data-testid={`text-tickets-${vb.id}`}>{vb.tickets}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
