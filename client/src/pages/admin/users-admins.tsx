import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, UserCheck, Clock, Key } from "lucide-react";

const stats = [
  { label: "Platform Admins", value: "4", icon: Shield },
  { label: "Active Now", value: "2", icon: UserCheck },
  { label: "Last Login", value: "2 min ago", icon: Clock },
  { label: "API Access", value: "3", icon: Key },
];

const admins = [
  { name: "Alex Johnson", email: "alex@indexflow.io", role: "Super Admin", status: "Online", lastLogin: "Now", permissions: "Full Access" },
  { name: "Priya Patel", email: "priya@indexflow.io", role: "Super Admin", status: "Online", lastLogin: "5 min ago", permissions: "Full Access" },
  { name: "James Morrison", email: "james@indexflow.io", role: "Platform Admin", status: "Offline", lastLogin: "6 hrs ago", permissions: "Manage Agencies" },
  { name: "Rachel Wong", email: "rachel@indexflow.io", role: "Support Admin", status: "Offline", lastLogin: "1 day ago", permissions: "View Only + Support" },
];

export default function AdminUsersAdmins() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Admin Users</h1>
        <p className="text-muted-foreground">Platform staff and administrator accounts</p>
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
          <CardTitle>Admin Directory</CardTitle>
          <CardDescription>Platform administrators and their access levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {admins.map((admin) => (
              <div key={admin.email} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-admin-${admin.email.split("@")[0]}`}>
                <div className="min-w-0">
                  <p className="font-medium">{admin.name}</p>
                  <p className="text-sm text-muted-foreground">{admin.email} &middot; {admin.permissions} &middot; Last login: {admin.lastLogin}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{admin.role}</Badge>
                  <Badge variant={admin.status === "Online" ? "default" : "secondary"}>{admin.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-edit-admin-${admin.email.split("@")[0]}`}>Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
