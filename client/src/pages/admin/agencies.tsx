import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Users, Globe, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Agencies", value: "24", icon: Building2 },
  { label: "Active Agencies", value: "21", icon: TrendingUp },
  { label: "Total Users", value: "187", icon: Users },
  { label: "Total Workspaces", value: "312", icon: Globe },
];

const agencies = [
  { name: "Digital Growth NYC", owner: "Sarah Chen", workspaces: 14, users: 23, plan: "Enterprise", status: "Active" },
  { name: "Coastal Marketing Co.", owner: "Mark Rivera", workspaces: 8, users: 12, plan: "Professional", status: "Active" },
  { name: "Alpine Digital Ltd.", owner: "Julia Weber", workspaces: 22, users: 34, plan: "Enterprise", status: "Active" },
  { name: "Metro Creative Group", owner: "David Kim", workspaces: 5, users: 8, plan: "Starter", status: "Active" },
  { name: "Pacific Media Inc.", owner: "Lisa Tanaka", workspaces: 11, users: 18, plan: "Professional", status: "Suspended" },
  { name: "Urban Content Network", owner: "Carlos Mendez", workspaces: 3, users: 5, plan: "Starter", status: "Pending" },
];

export default function AdminAgencies() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">All Agencies</h1>
        <p className="text-muted-foreground">Manage all agencies on the platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agency Directory</CardTitle>
          <CardDescription>All registered agencies and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agencies.map((agency) => (
              <div key={agency.name} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-agency-${agency.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{agency.name}</p>
                  <p className="text-sm text-muted-foreground">Owner: {agency.owner} &middot; {agency.workspaces} workspaces &middot; {agency.users} users</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{agency.plan}</Badge>
                  <Badge variant={agency.status === "Active" ? "default" : agency.status === "Suspended" ? "destructive" : "secondary"}>
                    {agency.status}
                  </Badge>
                  <Button variant="outline" size="sm" data-testid={`button-view-agency-${agency.name.toLowerCase().replace(/\s+/g, "-")}`}>View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
