import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Cpu, HardDrive, Activity } from "lucide-react";

const stats = [
  { label: "Uptime", value: "99.97%", icon: Activity },
  { label: "CPU Usage", value: "34%", icon: Cpu },
  { label: "Memory Usage", value: "62%", icon: Server },
  { label: "Storage Used", value: "48 GB", icon: HardDrive },
];

const services = [
  { name: "Web Server (Primary)", region: "US-East", uptime: "99.99%", cpu: "28%", memory: "4.2 GB / 8 GB", status: "Healthy" },
  { name: "Database (PostgreSQL)", region: "US-East", uptime: "99.98%", cpu: "42%", memory: "12.8 GB / 16 GB", status: "Healthy" },
  { name: "Redis Cache", region: "US-East", uptime: "99.99%", cpu: "8%", memory: "1.2 GB / 4 GB", status: "Healthy" },
  { name: "CDN Edge Nodes", region: "Global", uptime: "99.95%", cpu: "N/A", memory: "N/A", status: "Healthy" },
  { name: "Background Workers", region: "US-East", uptime: "99.90%", cpu: "56%", memory: "3.8 GB / 8 GB", status: "Warning" },
  { name: "File Storage (S3)", region: "US-East", uptime: "99.99%", cpu: "N/A", memory: "48 GB used", status: "Healthy" },
];

export default function AdminSystemInfrastructure() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Infrastructure</h1>
        <p className="text-muted-foreground">Server health, performance metrics, and service status</p>
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
          <CardTitle>Service Status</CardTitle>
          <CardDescription>Current health of all platform infrastructure services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-service-${svc.name.toLowerCase().replace(/[\s()]/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{svc.name}</p>
                  <p className="text-sm text-muted-foreground">{svc.region} &middot; CPU: {svc.cpu} &middot; Mem: {svc.memory} &middot; Uptime: {svc.uptime}</p>
                </div>
                <Badge variant={svc.status === "Healthy" ? "default" : "destructive"}>{svc.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
