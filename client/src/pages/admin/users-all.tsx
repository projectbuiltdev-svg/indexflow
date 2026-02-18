import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

const stats = [
  { label: "Total Users", value: "187", icon: Users },
  { label: "Active Users", value: "164", icon: UserCheck },
  { label: "Inactive", value: "23", icon: UserX },
  { label: "Admin Users", value: "4", icon: Shield },
];

const users = [
  { name: "Sarah Chen", email: "sarah@hospitalitynyc.com", agency: "Hospitality Group NYC", role: "Owner", status: "Active", lastLogin: "2 min ago" },
  { name: "Mark Rivera", email: "mark@coastaldining.com", agency: "Coastal Dining Co.", role: "Owner", status: "Active", lastLogin: "1 hr ago" },
  { name: "Julia Weber", email: "julia@alpinehotels.ch", agency: "Alpine Hotels Ltd.", role: "Owner", status: "Active", lastLogin: "3 hrs ago" },
  { name: "Tom Bradley", email: "tom@hospitalitynyc.com", agency: "Hospitality Group NYC", role: "Admin", status: "Active", lastLogin: "5 hrs ago" },
  { name: "Amy Liu", email: "amy@hospitalitynyc.com", agency: "Hospitality Group NYC", role: "Editor", status: "Active", lastLogin: "1 day ago" },
  { name: "David Kim", email: "david@metrobistro.nyc", agency: "Metro Bistro Group", role: "Owner", status: "Active", lastLogin: "2 days ago" },
  { name: "Lisa Tanaka", email: "lisa@pacificvenues.com", agency: "Pacific Venues Inc.", role: "Owner", status: "Inactive", lastLogin: "30 days ago" },
];

export default function AdminUsersAll() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">All Users</h1>
        <p className="text-muted-foreground">User accounts across all agencies</p>
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
          <CardTitle>User Directory</CardTitle>
          <CardDescription>All registered users and their agency assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.email} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-user-${user.email.split("@")[0]}`}>
                <div className="min-w-0">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email} &middot; {user.agency} &middot; Last login: {user.lastLogin}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{user.role}</Badge>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-view-user-${user.email.split("@")[0]}`}>View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
