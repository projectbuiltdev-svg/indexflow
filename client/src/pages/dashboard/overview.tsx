import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Search,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Globe,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import type { Workspace, BlogPost, RankTrackerKeyword, Lead } from "@shared/schema";

const chartData = [
  { name: "Jan", impressions: 12400, clicks: 890, leads: 23 },
  { name: "Feb", impressions: 15600, clicks: 1120, leads: 31 },
  { name: "Mar", impressions: 18900, clicks: 1340, leads: 42 },
  { name: "Apr", impressions: 22300, clicks: 1580, leads: 38 },
  { name: "May", impressions: 28100, clicks: 2100, leads: 56 },
  { name: "Jun", impressions: 34500, clicks: 2670, leads: 67 },
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
  const { data: workspaces, isLoading: workspacesLoading } = useQuery<Workspace[]>({
    queryKey: ["/api/workspaces"],
  });

  const { data: posts, isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const { data: keywords, isLoading: keywordsLoading } = useQuery<RankTrackerKeyword[]>({
    queryKey: ["/api/rank-keywords"],
  });

  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const loading = workspacesLoading || postsLoading || keywordsLoading || leadsLoading;

  const totalPosts = posts?.length || 0;
  const totalKeywords = keywords?.length || 0;
  const totalLeads = leads?.length || 0;
  const activeWorkspaces = workspaces?.filter((w) => w.status === "active").length || 0;

  const recentPosts = posts
    ?.filter((p) => p.status === "published")
    .slice(0, 5) || [];

  const topKeywords = keywords
    ?.sort((a, b) => (a.currentPosition || 100) - (b.currentPosition || 100))
    .slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your SEO operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Workspaces"
          value={activeWorkspaces}
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
        <MetricCard
          title="Leads Generated"
          value={totalLeads}
          change={{ value: "+12%", positive: true }}
          icon={Users}
          loading={loading}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold">Impressions & Clicks</h3>
            <Badge variant="secondary">Last 6 months</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="impressionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(197, 90%, 50%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(197, 90%, 50%)" stopOpacity={0} />
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
                  dataKey="impressions"
                  stroke="hsl(197, 90%, 50%)"
                  strokeWidth={2}
                  fill="url(#impressionsGrad)"
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="hsl(160, 70%, 40%)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold">Lead Conversions</h3>
            <Badge variant="secondary">Last 6 months</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="hsl(280, 65%, 50%)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(280, 65%, 50%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
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
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="text-xs">
                      {post.clicks || 0} clicks
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold">Top Keywords</h3>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : topKeywords.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No keywords tracked yet.</p>
          ) : (
            <div className="space-y-3">
              {topKeywords.map((kw) => {
                const diff = kw.previousPosition && kw.currentPosition
                  ? kw.previousPosition - kw.currentPosition
                  : 0;
                return (
                  <div key={kw.id} className="flex items-center justify-between gap-4 py-2 border-b last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" data-testid={`text-keyword-${kw.id}`}>{kw.keyword}</p>
                      <p className="text-xs text-muted-foreground">Vol: {kw.searchVolume?.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-mono font-bold">#{kw.currentPosition?.toFixed(1)}</span>
                      {diff !== 0 && (
                        <span className={`text-xs flex items-center ${diff > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                          {diff > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {Math.abs(diff).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
