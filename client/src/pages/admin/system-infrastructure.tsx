import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Server, Database, ListOrdered, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "Server Status", value: "Operational", icon: Server, dot: true },
  { label: "DB Connections", value: "24", icon: Database },
  { label: "Queue Length", value: "3", icon: ListOrdered },
  { label: "Error Rate", value: "0.02%", icon: AlertTriangle },
];

const responseTimeData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  ms: Math.floor(80 + Math.random() * 120),
}));

const errorRateData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  rate: parseFloat((Math.random() * 0.05).toFixed(3)),
}));

const recentErrors = [
  { timestamp: "Feb 18, 2026 14:32", endpoint: "/api/keywords/refresh", statusCode: 500, message: "Timeout connecting to DataForSEO", agency: "Blue Digital Agency" },
  { timestamp: "Feb 18, 2026 13:15", endpoint: "/api/posts/publish", statusCode: 503, message: "Service temporarily unavailable", agency: "Northstar Media" },
  { timestamp: "Feb 18, 2026 11:42", endpoint: "/api/analytics/report", statusCode: 502, message: "Bad gateway from upstream", agency: "Cascade Creative" },
  { timestamp: "Feb 18, 2026 09:08", endpoint: "/api/images/generate", statusCode: 429, message: "Rate limit exceeded for OpenAI", agency: "Vertex Solutions" },
  { timestamp: "Feb 17, 2026 22:55", endpoint: "/api/seo/audit", statusCode: 500, message: "Unexpected null in response", agency: "Lunar Labs" },
];

export default function AdminSystemInfrastructure() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Infrastructure</h1>
        <p className="text-sm text-muted-foreground">Server health and system monitoring</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {"dot" in stat && stat.dot && <span className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" data-testid="indicator-server-status" />}
                <span className="text-2xl font-bold" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time (Last 24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-response-time">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="hour" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip />
                  <Line type="monotone" dataKey="ms" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="Response (ms)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Rate (Last 24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64" data-testid="chart-error-rate">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={errorRateData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="hour" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Error Rate (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Errors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Status Code</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentErrors.map((err, i) => (
                <TableRow key={i} data-testid={`row-error-${i}`}>
                  <TableCell className="text-muted-foreground">{err.timestamp}</TableCell>
                  <TableCell className="font-medium font-mono text-sm">{err.endpoint}</TableCell>
                  <TableCell>
                    <Badge variant={err.statusCode >= 500 ? "destructive" : "outline"}>{err.statusCode}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{err.message}</TableCell>
                  <TableCell>{err.agency}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" data-testid={`button-view-stack-${i}`}>View Stack Trace</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}