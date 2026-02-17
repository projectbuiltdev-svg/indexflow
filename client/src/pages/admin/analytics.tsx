import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Users, FileText, MessageSquare, PhoneCall, LifeBuoy, Globe, CreditCard } from "lucide-react";

export default function AdminAnalytics() {
  const { data: venues, isLoading: l1 } = useQuery<any[]>({ queryKey: ["/api/venues"] });
  const { data: users, isLoading: l2 } = useQuery<any[]>({ queryKey: ["/api/users"] });
  const { data: posts, isLoading: l3 } = useQuery<any[]>({ queryKey: ["/api/blog-posts"] });
  const { data: messages, isLoading: l4 } = useQuery<any[]>({ queryKey: ["/api/contact-messages"] });
  const { data: callLogs, isLoading: l5 } = useQuery<any[]>({ queryKey: ["/api/admin/call-logs"] });
  const { data: tickets, isLoading: l6 } = useQuery<any[]>({ queryKey: ["/api/admin/support-tickets"] });
  const { data: domains, isLoading: l7 } = useQuery<any[]>({ queryKey: ["/api/domains"] });
  const { data: adminUsers, isLoading: l8 } = useQuery<any[]>({ queryKey: ["/api/admin-users"] });

  const stats = [
    { title: "Total Venues", value: venues?.length ?? 0, icon: Building2, loading: l1 },
    { title: "Total Users", value: users?.length ?? 0, icon: Users, loading: l2 },
    { title: "Admin Users", value: adminUsers?.length ?? 0, icon: CreditCard, loading: l8 },
    { title: "Blog Posts", value: posts?.length ?? 0, icon: FileText, loading: l3 },
    { title: "Published Posts", value: posts?.filter((p: any) => p.status === "published").length ?? 0, icon: FileText, loading: l3 },
    { title: "Draft Posts", value: posts?.filter((p: any) => p.status === "draft").length ?? 0, icon: FileText, loading: l3 },
    { title: "Contact Messages", value: messages?.length ?? 0, icon: MessageSquare, loading: l4 },
    { title: "Call Logs", value: callLogs?.length ?? 0, icon: PhoneCall, loading: l5 },
    { title: "Support Tickets", value: tickets?.length ?? 0, icon: LifeBuoy, loading: l6 },
    { title: "Open Tickets", value: tickets?.filter((t: any) => t.status === "open").length ?? 0, icon: LifeBuoy, loading: l6 },
    { title: "Domains", value: domains?.length ?? 0, icon: Globe, loading: l7 },
    { title: "Active Venues", value: venues?.filter((v: any) => v.status === "active").length ?? 0, icon: Building2, loading: l1 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-analytics-title">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
              <s.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {s.loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold" data-testid={`text-stat-${s.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  {s.value}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
