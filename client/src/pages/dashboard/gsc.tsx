import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, MousePointer, Eye, Percent, Target } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { GscData } from "@shared/schema";

export default function GscAnalytics() {
  const { data: gscData, isLoading } = useQuery<GscData[]>({
    queryKey: ["/api/gsc-data"],
  });

  const totalClicks = gscData?.reduce((sum, d) => sum + (d.clicks || 0), 0) || 0;
  const totalImpressions = gscData?.reduce((sum, d) => sum + (d.impressions || 0), 0) || 0;
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : "0";
  const avgPos = gscData?.length
    ? (gscData.reduce((sum, d) => sum + (d.position || 0), 0) / gscData.length).toFixed(1)
    : "\u2014";

  const dateMap = new Map<string, { clicks: number; impressions: number }>();
  gscData?.forEach((d) => {
    const existing = dateMap.get(d.date) || { clicks: 0, impressions: 0 };
    dateMap.set(d.date, {
      clicks: existing.clicks + (d.clicks || 0),
      impressions: existing.impressions + (d.impressions || 0),
    });
  });
  const chartData = Array.from(dateMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, data]) => ({ date, ...data }));

  const topQueries = gscData
    ?.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 10) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">GSC Analytics</h1>
        <p className="text-muted-foreground mt-1">Google Search Console data across all properties</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: MousePointer },
          { label: "Impressions", value: totalImpressions.toLocaleString(), icon: Eye },
          { label: "Avg CTR", value: `${avgCtr}%`, icon: Percent },
          { label: "Avg Position", value: avgPos, icon: Target },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold mt-1" data-testid={`text-gsc-${m.label.toLowerCase().replace(/[\s.]+/g, '-')}`}>{m.value}</p>
              </div>
              <m.icon className="w-5 h-5 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="font-semibold">Clicks by Date</h3>
          <Badge variant="secondary">All Properties</Badge>
        </div>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No GSC data available
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="clicks" fill="hsl(197, 90%, 50%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card>
        <div className="p-5 border-b">
          <h3 className="font-semibold">Top Queries</h3>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Query</TableHead>
                <TableHead>Page</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topQueries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No search query data available
                  </TableCell>
                </TableRow>
              ) : (
                topQueries.map((q) => (
                  <TableRow key={q.id} data-testid={`row-gsc-${q.id}`}>
                    <TableCell className="font-medium text-sm">{q.query}</TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {q.page || "\u2014"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{q.clicks}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{q.impressions}</TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {q.ctr ? `${(q.ctr * 100).toFixed(1)}%` : "\u2014"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {q.position ? q.position.toFixed(1) : "\u2014"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
