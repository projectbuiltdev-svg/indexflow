import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, Users, Clock, CheckCircle } from "lucide-react";

function statusVariant(status: string) {
  switch (status) {
    case "confirmed": return "default";
    case "seated": return "secondary";
    case "completed": return "outline";
    case "cancelled": return "destructive";
    case "no-show": return "destructive";
    default: return "default";
  }
}

export default function DashboardToday() {
  const { selectedVenue } = useVenue();
  const venueId = selectedVenue?.id;

  const { data: reservations = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/reservations", { venueId }],
    queryFn: async () => {
      const res = await fetch(`/api/reservations?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!venueId,
  });

  if (!venueId) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayReservations = reservations.filter((r: any) => r.date === today);
  const upcoming = todayReservations.filter((r: any) => r.status === "confirmed").length;
  const completed = todayReservations.filter((r: any) => r.status === "completed").length;
  const totalGuests = todayReservations.reduce((sum: number, r: any) => sum + (r.partySize || 0), 0);

  const stats = [
    { label: "Today's Bookings", value: todayReservations.length, icon: CalendarCheck },
    { label: "Upcoming", value: upcoming, icon: Clock },
    { label: "Completed", value: completed, icon: CheckCircle },
    { label: "Total Guests", value: totalGuests, icon: Users },
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Today</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Today</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} data-testid={`stat-card-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          {todayReservations.length === 0 ? (
            <p className="text-muted-foreground" data-testid="empty-state">No reservations for today.</p>
          ) : (
            <Table data-testid="reservations-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todayReservations.map((r: any) => (
                  <TableRow key={r.id} data-testid={`reservation-row-${r.id}`}>
                    <TableCell>{r.guestName}</TableCell>
                    <TableCell>{r.partySize}</TableCell>
                    <TableCell>{r.time}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(r.status)} data-testid={`status-badge-${r.id}`}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{r.source}</TableCell>
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
