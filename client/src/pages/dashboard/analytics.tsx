import { useEffect, useState, useMemo } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Phone, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/dashboard-layout";

interface CallLog {
  id: string;
  workspaceId: string;
  callerPhone: string | null;
  duration: number | null;
  status: string | null;
  aiSummary: string | null;
  createdAt: string;
}

function BarChart({ data, color = "bg-primary" }: { data: { label: string; value: number }[]; color?: string }) {
  const maxValue = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end justify-between gap-2 h-48 px-2">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs text-muted-foreground">{item.value}</span>
          <div 
            className={`w-full ${color} rounded-t transition-all duration-500`}
            style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`, minHeight: '4px' }}
          />
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function DualBarChart({ data }: { data: { label: string; impressions: number; conversions: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.impressions));
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded" /> Impressions</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded" /> Conversions</div>
      </div>
      <div className="flex items-end justify-between gap-4 h-40 px-2">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-end gap-1 w-full justify-center h-32">
              <div 
                className="w-6 bg-blue-500 rounded-t transition-all duration-500"
                style={{ height: `${maxValue > 0 ? (item.impressions / maxValue) * 100 : 0}%`, minHeight: '4px' }}
              />
              <div 
                className="w-6 bg-green-500 rounded-t transition-all duration-500"
                style={{ height: `${maxValue > 0 ? (item.conversions / maxValue) * 100 : 0}%`, minHeight: '4px' }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    document.title = "Analytics - indexFlow Dashboard";
  }, []);

  const { data: calls = [] } = useQuery<CallLog[]>({
    queryKey: ["/api/workspaces", workspaceId, "calls"],
  });

  const phoneStats = useMemo(() => {
    const totalCalls = calls.length;
    const answered = calls.filter(c => c.status === "completed").length;
    const missed = calls.filter(c => c.status === "missed").length;
    const durations = calls.filter(c => c.duration).map(c => c.duration!);
    const avgSec = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    const avgDuration = `${Math.floor(avgSec / 60)}:${String(avgSec % 60).padStart(2, "0")}`;
    const inquiriesConverted = calls.filter(c => c.aiSummary?.toLowerCase().includes("inquiry") || c.aiSummary?.toLowerCase().includes("converted")).length;
    const successRate = totalCalls > 0 ? `${((inquiriesConverted / totalCalls) * 100).toFixed(1)}%` : "0%";
    return { totalCalls, answered, missed, avgDuration, inquiriesConverted, successRate };
  }, [calls]);

  const phoneChartData = useMemo(() => {
    const hours = [
      { label: "9a", hour: 9 },
      { label: "11a", hour: 11 },
      { label: "1p", hour: 13 },
      { label: "3p", hour: 15 },
      { label: "5p", hour: 17 },
      { label: "7p", hour: 19 },
    ];
    const counts: Record<number, number> = {};
    hours.forEach(h => counts[h.hour] = 0);
    calls.forEach(c => {
      const h = new Date(c.createdAt).getHours();
      const nearest = hours.reduce((prev, curr) =>
        Math.abs(curr.hour - h) < Math.abs(prev.hour - h) ? curr : prev
      );
      counts[nearest.hour]++;
    });
    return hours.map(h => ({ label: h.label, value: counts[h.hour] }));
  }, [calls]);

  const widgetStats = {
    impressions: 0,
    interactions: 0,
    conversions: 0,
    conversionRate: "0%",
  };

  const widgetChartData = [
    { label: "Week 1", impressions: 0, conversions: 0 },
    { label: "Week 2", impressions: 0, conversions: 0 },
    { label: "Week 3", impressions: 0, conversions: 0 },
    { label: "Week 4", impressions: 0, conversions: 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track performance across all channels</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3" data-testid="tab-overview">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="widget" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3" data-testid="tab-widget">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Widget</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3" data-testid="tab-phone">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Phone</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total Calls</p>
                  <p className="text-3xl font-bold">{phoneStats.totalCalls}</p>
                  <p className="text-sm text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Answered</p>
                  <p className="text-3xl font-bold">{phoneStats.answered}</p>
                  <p className="text-sm text-muted-foreground mt-1">{phoneStats.totalCalls > 0 ? `${((phoneStats.answered / phoneStats.totalCalls) * 100).toFixed(1)}%` : "0%"} answer rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Widget Impressions</p>
                  <p className="text-3xl font-bold">{widgetStats.impressions.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-3xl font-bold">{widgetStats.conversionRate}</p>
                  <p className="text-sm text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="widget" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Impressions</p>
                  <p className="text-3xl font-bold">{widgetStats.impressions.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Interactions</p>
                  <p className="text-3xl font-bold">{widgetStats.interactions.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">widget opens</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-3xl font-bold">{widgetStats.conversions}</p>
                  <p className="text-sm text-muted-foreground mt-1">leads generated</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-3xl font-bold">{widgetStats.conversionRate}</p>
                  <p className="text-sm text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Widget Performance (Last 4 Weeks)</CardTitle>
              </CardHeader>
              <CardContent>
                <DualBarChart data={widgetChartData} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phone" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Total Calls</p>
                  <p className="text-3xl font-bold">{phoneStats.totalCalls}</p>
                  <p className="text-sm text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Answered</p>
                  <p className="text-3xl font-bold">{phoneStats.answered}</p>
                  <p className="text-sm text-muted-foreground mt-1">{phoneStats.totalCalls > 0 ? `${((phoneStats.answered / phoneStats.totalCalls) * 100).toFixed(1)}%` : "0%"} answer rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Inquiries Converted</p>
                  <p className="text-3xl font-bold">{phoneStats.inquiriesConverted}</p>
                  <p className="text-sm text-muted-foreground mt-1">via phone</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold">{phoneStats.successRate}</p>
                  <p className="text-sm text-muted-foreground mt-1">conversion rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Call Volume by Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={phoneChartData} color="bg-orange-500" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
