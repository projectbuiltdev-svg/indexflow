import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Users, TrendingDown, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

const chartData = [
  { date: "Feb 1", views: 820 },
  { date: "Feb 3", views: 950 },
  { date: "Feb 5", views: 880 },
  { date: "Feb 7", views: 1100 },
  { date: "Feb 9", views: 1020 },
  { date: "Feb 11", views: 1200 },
  { date: "Feb 13", views: 1150 },
  { date: "Feb 15", views: 1350 },
  { date: "Feb 17", views: 1280 },
  { date: "Feb 18", views: 1400 },
];

const topPages = [
  { id: 1, title: "Home", views: 8200, unique: 5100, bounceRate: "38.2%" },
  { id: 2, title: "Services", views: 5400, unique: 3200, bounceRate: "42.1%" },
  { id: 3, title: "Blog", views: 4800, unique: 2900, bounceRate: "35.8%" },
  { id: 4, title: "Pricing", views: 3600, unique: 2400, bounceRate: "45.3%" },
  { id: 5, title: "Contact", views: 2500, unique: 1800, bounceRate: "52.1%" },
];

const trafficSources = [
  { source: "Direct", pct: "40%" },
  { source: "Search", pct: "35%" },
  { source: "Social", pct: "15%" },
  { source: "Referral", pct: "10%" },
];

const dateRanges = ["7d", "28d", "3mo"];

export default function AnalyticsOverview() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("28d");

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    toast({ title: "Date Range Updated", description: `Showing analytics for the last ${range}.` });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Analytics Overview</h1>

      <div className="flex items-center gap-2 flex-wrap">
        {dateRanges.map((r) => (
          <Button
            key={r}
            variant={dateRange === r ? "default" : "outline"}
            size="sm"
            onClick={() => handleDateRangeChange(r)}
            data-testid={`button-range-${r}`}
          >
            {r}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-page-views">24,500</p>
                <p className="text-xs text-muted-foreground">Page Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-unique-visitors">8,300</p>
                <p className="text-xs text-muted-foreground">Unique Visitors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-bounce-rate">42.3%</p>
                <p className="text-xs text-muted-foreground">Bounce Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-avg-session">3m 24s</p>
                <p className="text-xs text-muted-foreground">Avg Session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Traffic Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]" data-testid="chart-traffic">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} name="Page Views" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Unique</TableHead>
                  <TableHead>Bounce Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.map((p) => (
                  <TableRow key={p.id} data-testid={`row-top-page-${p.id}`}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>{p.views.toLocaleString()}</TableCell>
                    <TableCell>{p.unique.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{p.bounceRate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((s) => (
                <div key={s.source} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-source-${s.source.toLowerCase()}`}>
                  <span className="font-medium text-sm">{s.source}</span>
                  <span className="text-muted-foreground text-sm">{s.pct}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
