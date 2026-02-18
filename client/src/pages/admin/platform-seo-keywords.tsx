import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, BarChart3, Target } from "lucide-react";

const stats = [
  { label: "Keywords Tracked", value: "4,821", icon: Search },
  { label: "Avg. Position", value: "14.3", icon: Target },
  { label: "Top 10 Rankings", value: "892", icon: TrendingUp },
  { label: "Agencies Using SEO", value: "18", icon: BarChart3 },
];

const keywords = [
  { keyword: "best seo agency near me", volume: "22,200", avgPos: "8.4", agencies: 12, trend: "up" },
  { keyword: "digital marketing services", volume: "14,800", avgPos: "11.2", agencies: 6, trend: "up" },
  { keyword: "content marketing strategy", volume: "9,900", avgPos: "6.1", agencies: 15, trend: "stable" },
  { keyword: "local seo services NYC", volume: "8,100", avgPos: "4.7", agencies: 3, trend: "up" },
  { keyword: "technical seo audit", volume: "6,600", avgPos: "15.8", agencies: 8, trend: "down" },
  { keyword: "link building services", volume: "5,400", avgPos: "19.3", agencies: 4, trend: "stable" },
  { keyword: "keyword research tools", volume: "4,400", avgPos: "7.9", agencies: 9, trend: "up" },
];

export default function AdminPlatformSeoKeywords() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Platform Keyword Usage</h1>
        <p className="text-muted-foreground">Keyword tracking and SEO performance across all agencies</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Keywords</CardTitle>
          <CardDescription>Most tracked keywords and their aggregate performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keywords.map((kw) => (
              <div key={kw.keyword} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-keyword-${kw.keyword.replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{kw.keyword}</p>
                  <p className="text-sm text-muted-foreground">Volume: {kw.volume}/mo &middot; {kw.agencies} agencies tracking</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">Pos. {kw.avgPos}</span>
                  <Badge variant={kw.trend === "up" ? "default" : kw.trend === "down" ? "destructive" : "secondary"}>
                    {kw.trend === "up" ? "Improving" : kw.trend === "down" ? "Declining" : "Stable"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
