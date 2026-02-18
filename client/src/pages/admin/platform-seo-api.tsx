import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Percent, Cpu, Image } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { label: "DataForSEO Calls Today", value: "847", icon: Activity },
  { label: "Monthly Quota Used", value: "34%", icon: Percent },
  { label: "OpenAI Tokens Used", value: "2.3M", icon: Cpu },
  { label: "Image API Calls", value: "1,256", icon: Image },
];

const chartData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  calls: Math.floor(600 + Math.random() * 500),
}));

const services = [
  { service: "DataForSEO", callsToday: 847, callsMonth: 18420, quota: "50,000", status: "Healthy", cost: "$284.50" },
  { service: "OpenAI", callsToday: 312, callsMonth: 8940, quota: "25,000", status: "Healthy", cost: "$156.20" },
  { service: "Pexels", callsToday: 56, callsMonth: 1230, quota: "10,000", status: "Healthy", cost: "Free" },
  { service: "Pixabay", callsToday: 23, callsMonth: 890, quota: "5,000", status: "Healthy", cost: "Free" },
  { service: "Unsplash", callsToday: 18, callsMonth: 620, quota: "5,000", status: "Warning", cost: "Free" },
];

export default function AdminPlatformSeoApi() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">API Usage</h1>
        <p className="text-sm text-muted-foreground">DataForSEO and third-party API consumption</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Calls Per Day (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80" data-testid="chart-api-calls">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="calls" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Calls Today</TableHead>
                <TableHead>Calls This Month</TableHead>
                <TableHead>Quota</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((svc) => (
                <TableRow key={svc.service} data-testid={`row-service-${svc.service.toLowerCase()}`}>
                  <TableCell className="font-medium">{svc.service}</TableCell>
                  <TableCell>{svc.callsToday}</TableCell>
                  <TableCell>{svc.callsMonth.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{svc.quota}</TableCell>
                  <TableCell>
                    <Badge variant={svc.status === "Healthy" ? "default" : "destructive"}>{svc.status}</Badge>
                  </TableCell>
                  <TableCell>{svc.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}