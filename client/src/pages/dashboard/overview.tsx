import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Search,
  ArrowUp,
  ArrowDown,
  Globe,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useVenue } from "@/lib/venue-context";
import type { Venue, BlogPost, RankKeyword } from "@shared/schema";

const chartData = [
  { name: "Jan", posts: 4, keywords: 12 },
  { name: "Feb", posts: 7, keywords: 18 },
  { name: "Mar", posts: 11, keywords: 24 },
  { name: "Apr", posts: 15, keywords: 30 },
  { name: "May", posts: 22, keywords: 38 },
  { name: "Jun", posts: 28, keywords: 45 },
];

function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon: typeof FileText;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1" data-testid={`text-metric-${title.replace(/\s+/g, '-').toLowerCase()}`}>{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {change.positive ? (
                <ArrowUp className="w-3 h-3 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  change.positive ? "text-green-600 dark:text-green-400" : "text-red-500"
                }`}
              >
                {change.value}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardOverview() {
  const { selectedVenue, venues } = useVenue();

  const { data: allPosts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts", { venueId: selectedVenue?.id }],
    enabled: !!selectedVenue,
  });

  const { data: allKeywords, isLoading: keywordsLoading } = useQuery<RankKeyword[]>({
    queryKey: ["/api/rank-keywords", selectedVenue?.id],
    enabled: !!selectedVenue,
  });

  const loading = postsLoading || keywordsLoading;

  const posts = selectedVenue
    ? (allPosts || []).filter((p) => p.venueId === selectedVenue.id)
    : allPosts || [];
  const keywords = selectedVenue
    ? (allKeywords || []).filter((k) => k.venueId === selectedVenue.id)
    : allKeywords || [];

  const totalPosts = posts.length;
  const totalKeywords = keywords.length;
  const activeVenues = venues.filter((v) => v.status === "active").length;

  const recentPosts = posts
    .filter((p) => p.status === "published")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your SEO operations
          {selectedVenue && (
            <span className="ml-1">
              for <span className="font-medium text-foreground">{selectedVenue.name}</span>
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Active Venues"
          value={activeVenues}
          change={{ value: "+2", positive: true }}
          icon={Globe}
          loading={loading}
        />
        <MetricCard
          title="Blog Posts"
          value={totalPosts}
          change={{ value: "+18%", positive: true }}
          icon={FileText}
          loading={loading}
        />
        <MetricCard
          title="Keywords Tracked"
          value={totalKeywords}
          change={{ value: "+24", positive: true }}
          icon={Search}
          loading={loading}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold">Content & Keywords Growth</h3>
            <Badge variant="secondary">Last 6 months</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="postsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(197, 90%, 50%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(197, 90%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="keywordsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 70%, 40%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(160, 70%, 40%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="posts"
                  stroke="hsl(197, 90%, 50%)"
                  strokeWidth={2}
                  fill="url(#postsGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="keywords"
                  stroke="hsl(160, 70%, 40%)"
                  strokeWidth={2}
                  fill="url(#keywordsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold">Recent Posts</h3>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No published posts yet.</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate" data-testid={`text-post-${post.id}`}>{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.primaryKeyword}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
