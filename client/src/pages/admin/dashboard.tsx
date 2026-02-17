import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, CalendarCheck, MessageSquare, LifeBuoy } from "lucide-react";
import type { Venue, User, ContactMessage, Reservation, SupportTicket } from "@shared/schema";

export default function AdminDashboard() {
  useVenue();

  const { data: allVenues = [], isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: reservations = [], isLoading: reservationsLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/admin/reservations"],
  });

  const { data: contactMessages = [], isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
  });

  const { data: tickets = [], isLoading: ticketsLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/admin/support-tickets"],
  });

  const isLoading = venuesLoading || usersLoading || messagesLoading || reservationsLoading || ticketsLoading;

  const venueMap = new Map(allVenues.map((v) => [v.id, v]));

  const stats = [
    { title: "Total Venues", value: allVenues.length, icon: Building2, testId: "stat-total-venues" },
    { title: "Total Users", value: users.length, icon: Users, testId: "stat-total-users" },
    { title: "Reservations", value: reservations.length, icon: CalendarCheck, testId: "stat-reservations" },
    { title: "Contact Messages", value: contactMessages.length, icon: MessageSquare, testId: "stat-contact-messages" },
    { title: "Support Tickets", value: tickets.length, icon: LifeBuoy, testId: "stat-support-tickets" },
  ];

  const recentReservations = reservations.slice(0, 5);
  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title-dashboard">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.testId} data-testid={stat.testId}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid={`${stat.testId}-value`}>
                  {stat.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            {reservationsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentReservations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8" data-testid="empty-recent-reservations">
                No recent reservations.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentReservations.map((r) => (
                    <TableRow key={r.id} data-testid={`row-recent-reservation-${r.id}`}>
                      <TableCell className="font-medium">{r.guestName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {venueMap.get(r.venueId)?.name || r.venueId}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{r.date}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === "confirmed" ? "default" : "outline"}>
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {ticketsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentTickets.length === 0 ? (
              <p className="text-muted-foreground text-center py-8" data-testid="empty-recent-tickets">
                No recent tickets.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTickets.map((t) => (
                    <TableRow key={t.id} data-testid={`row-recent-ticket-${t.id}`}>
                      <TableCell className="font-medium">{t.subject}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {venueMap.get(t.venueId)?.name || t.venueId}
                      </TableCell>
                      <TableCell>
                        <Badge variant={t.priority === "high" || t.priority === "urgent" ? "destructive" : "secondary"}>
                          {t.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={t.status === "resolved" ? "default" : "outline"}>
                          {t.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
