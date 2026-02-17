import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, CalendarCheck, PhoneCall, FileText, Building2 } from "lucide-react";
import type { Venue, BlogPost as VenueBlogPost } from "@shared/schema";

export default function AdminAnalytics() {
  useVenue();

  const { data: venues = [], isLoading: venuesLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const { data: blogPosts = [], isLoading: postsLoading } = useQuery<VenueBlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const isLoading = venuesLoading || postsLoading;

  const stats = [
    {
      title: "Active Venues",
      value: venues.filter((v) => v.status === "active").length,
      icon: Building2,
      testId: "stat-active-venues",
    },
    {
      title: "Total Venues",
      value: venues.length,
      icon: CalendarCheck,
      testId: "stat-total-venues",
    },
    {
      title: "Blog Posts",
      value: blogPosts.length,
      icon: FileText,
      testId: "stat-blog-posts",
    },
    {
      title: "Published Posts",
      value: blogPosts.filter((p) => p.status === "published").length,
      icon: BarChart3,
      testId: "stat-published-posts",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-analytics">
          Analytics
        </h1>
      </div>

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
