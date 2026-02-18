import { useEffect } from "react";
import { useParams } from "wouter";
import { FileText, TrendingUp, BarChart3, Megaphone, Plus, Search, ClipboardList, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Today() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  useEffect(() => {
    document.title = "Dashboard - indexFlow";
  }, []);

  const stats = [
    { label: "Total Keywords Tracked", value: "0", icon: Search },
    { label: "Content Posts Published", value: "0", icon: FileText },
    { label: "Average Rank Position", value: "--", icon: TrendingUp },
    { label: "Active Campaigns", value: "0", icon: Megaphone },
  ];

  const recentActivity = [
    { id: 1, text: "No recent activity yet", time: "" },
  ];

  const contentDueToday = [
    { id: 1, text: "No content due today", time: "" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border" data-testid={`activity-item-${item.id}`}>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                  {item.time && <span className="text-xs text-muted-foreground">{item.time}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Content Due Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contentDueToday.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-2 p-3 rounded-lg border" data-testid={`content-due-item-${item.id}`}>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                  {item.time && <span className="text-xs text-muted-foreground">{item.time}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href={`/${workspaceId}/content/posts`}>
            <Button data-testid="link-create-post">
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </Link>
          <Link href={`/${workspaceId}/rank-tracker`}>
            <Button variant="outline" data-testid="link-track-keywords">
              <Search className="w-4 h-4 mr-2" />
              Track Keywords
            </Button>
          </Link>
          <Link href={`/${workspaceId}/seo/reports`}>
            <Button variant="outline" data-testid="link-view-reports">
              <ClipboardList className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </Link>
          <Link href={`/${workspaceId}/seo/health`}>
            <Button variant="outline" data-testid="link-seo-health">
              <Heart className="w-4 h-4 mr-2" />
              SEO Health
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
