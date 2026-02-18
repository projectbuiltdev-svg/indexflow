import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Eye, Clock, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

const mockMetrics = [
  { label: "Page Views", value: "12,847", change: "+14.2%", up: true },
  { label: "Unique Visitors", value: "3,291", change: "+8.7%", up: true },
  { label: "Avg. Session Duration", value: "2m 34s", change: "-3.1%", up: false },
  { label: "Bounce Rate", value: "42.8%", change: "-5.4%", up: true },
];

const mockTopPages = [
  { page: "/", views: 4210, visitors: 2100 },
  { page: "/services", views: 2890, visitors: 1450 },
  { page: "/pricing", views: 2340, visitors: 1170 },
  { page: "/about", views: 1580, visitors: 890 },
  { page: "/contact", views: 1120, visitors: 620 },
];

export default function AnalyticsOverview() {
  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Analytics Overview</h1>
          <p className="text-muted-foreground">Track website performance and visitor behavior</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {mockMetrics.map((metric, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-2xl font-bold" data-testid={`text-metric-${i}`}>{metric.value}</p>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    {metric.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {metric.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Pages
              </CardTitle>
              <CardDescription>Most visited pages this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTopPages.map((page, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-top-page-${i}`}>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm">{page.page}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{page.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{page.visitors.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Traffic Sources
              </CardTitle>
              <CardDescription>Where your visitors come from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { source: "Direct", visitors: 1240, pct: "37.7%" },
                  { source: "Google Search", visitors: 980, pct: "29.8%" },
                  { source: "Social Media", visitors: 520, pct: "15.8%" },
                  { source: "Referral", visitors: 340, pct: "10.3%" },
                  { source: "Email", visitors: 211, pct: "6.4%" },
                ].map((source, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg border flex-wrap" data-testid={`row-traffic-source-${i}`}>
                    <p className="font-medium text-sm">{source.source}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{source.visitors.toLocaleString()} visitors</span>
                      <Badge variant="secondary" className="text-xs">{source.pct}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
