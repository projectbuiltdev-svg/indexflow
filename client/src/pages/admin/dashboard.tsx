import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, FileText, CalendarCheck, PhoneCall, LifeBuoy } from "lucide-react";

export default function AdminDashboard() {
  const { data: venues, isLoading: loadingVenues } = useQuery<any[]>({ queryKey: ["/api/venues"] });
  const { data: users, isLoading: loadingUsers } = useQuery<any[]>({ queryKey: ["/api/users"] });
  const { data: posts, isLoading: loadingPosts } = useQuery<any[]>({ queryKey: ["/api/blog-posts"] });
  const { data: messages, isLoading: loadingMessages } = useQuery<any[]>({ queryKey: ["/api/contact-messages"] });
  const { data: callLogs, isLoading: loadingCalls } = useQuery<any[]>({ queryKey: ["/api/admin/call-logs"] });
  const { data: tickets, isLoading: loadingTickets } = useQuery<any[]>({ queryKey: ["/api/admin/support-tickets"] });

  const metrics = [
    { title: "Total Venues", value: venues?.length ?? 0, icon: Building2, loading: loadingVenues },
    { title: "Total Users", value: users?.length ?? 0, icon: Users, loading: loadingUsers },
    { title: "Total Posts", value: posts?.length ?? 0, icon: FileText, loading: loadingPosts },
    { title: "Contact Messages", value: messages?.length ?? 0, icon: CalendarCheck, loading: loadingMessages },
    { title: "Call Logs", value: callLogs?.length ?? 0, icon: PhoneCall, loading: loadingCalls },
    { title: "Support Tickets", value: tickets?.length ?? 0, icon: LifeBuoy, loading: loadingTickets },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-dashboard-title">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <Card key={m.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{m.title}</CardTitle>
              <m.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {m.loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid={`text-metric-${m.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  {m.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
