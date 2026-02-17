import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, CalendarCheck, MessageSquare } from "lucide-react";
import type { Venue, User, ContactMessage } from "@shared/schema";

export default function AdminDashboard() {
  const { venues } = useVenue();

  const { data: allVenues = [], isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: contactMessages = [], isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
  });

  const isLoading = venuesLoading || usersLoading || messagesLoading;

  const stats = [
    {
      title: "Total Venues",
      value: allVenues.length,
      icon: Building2,
      testId: "stat-total-venues",
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      testId: "stat-total-users",
    },
    {
      title: "Active Venues",
      value: allVenues.filter((v) => v.status === "active").length,
      icon: CalendarCheck,
      testId: "stat-active-venues",
    },
    {
      title: "Contact Messages",
      value: contactMessages.length,
      icon: MessageSquare,
      testId: "stat-contact-messages",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title-dashboard">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
