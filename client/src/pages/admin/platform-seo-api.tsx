import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, DollarSign, Clock } from "lucide-react";

const stats = [
  { label: "API Calls Today", value: "3,241", icon: Activity },
  { label: "Monthly Usage", value: "87,432", icon: Zap },
  { label: "Monthly Cost", value: "$284.50", icon: DollarSign },
  { label: "Avg Response Time", value: "1.2s", icon: Clock },
];

const apiUsage = [
  { endpoint: "SERP Rankings", calls: "34,210", cost: "$102.63", lastCall: "2 min ago", status: "Healthy" },
  { endpoint: "Keyword Research", calls: "18,442", cost: "$55.33", lastCall: "5 min ago", status: "Healthy" },
  { endpoint: "Competitor Analysis", calls: "12,890", cost: "$51.56", lastCall: "12 min ago", status: "Healthy" },
  { endpoint: "Local Grid Checks", calls: "15,320", cost: "$45.96", lastCall: "1 min ago", status: "Healthy" },
  { endpoint: "Backlink Analysis", calls: "4,280", cost: "$17.12", lastCall: "32 min ago", status: "Degraded" },
  { endpoint: "On-Page Audit", calls: "2,290", cost: "$11.90", lastCall: "1 hr ago", status: "Healthy" },
];

export default function AdminPlatformSeoApi() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">API Usage</h1>
        <p className="text-muted-foreground">DataForSEO API consumption and cost tracking</p>
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
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>Usage breakdown by DataForSEO endpoint this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiUsage.map((api) => (
              <div key={api.endpoint} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-api-${api.endpoint.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{api.endpoint}</p>
                  <p className="text-sm text-muted-foreground">{api.calls} calls &middot; {api.cost} &middot; Last call: {api.lastCall}</p>
                </div>
                <Badge variant={api.status === "Healthy" ? "default" : "destructive"}>{api.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
