import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Send, Archive, Clock } from "lucide-react";

const stats = [
  { label: "Total Announcements", value: "34", icon: Bell },
  { label: "Active", value: "3", icon: Send },
  { label: "Scheduled", value: "2", icon: Clock },
  { label: "Archived", value: "29", icon: Archive },
];

const announcements = [
  { title: "Scheduled Maintenance - Feb 22", type: "Maintenance", audience: "All Agencies", status: "Active", created: "Feb 17, 2026" },
  { title: "New SEO Features Released", type: "Feature Update", audience: "All Agencies", status: "Active", created: "Feb 14, 2026" },
  { title: "Holiday Hours Update", type: "Informational", audience: "All Agencies", status: "Active", created: "Feb 10, 2026" },
  { title: "API Rate Limit Changes", type: "Technical", audience: "Enterprise Only", status: "Scheduled", created: "Feb 18, 2026" },
  { title: "New Billing Dashboard", type: "Feature Update", audience: "All Agencies", status: "Scheduled", created: "Feb 19, 2026" },
  { title: "Q4 2025 Platform Report", type: "Report", audience: "All Agencies", status: "Archived", created: "Jan 15, 2026" },
];

export default function AdminSupportAnnouncements() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">System Announcements</h1>
        <p className="text-muted-foreground">Manage platform-wide announcements and notifications</p>
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
        <CardHeader className="flex flex-row items-center justify-between gap-2 flex-wrap">
          <div>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>All system announcements and their current status</CardDescription>
          </div>
          <Button data-testid="button-create-announcement">New Announcement</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div key={ann.title} className="flex items-center justify-between gap-4 flex-wrap" data-testid={`row-announcement-${ann.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="min-w-0">
                  <p className="font-medium">{ann.title}</p>
                  <p className="text-sm text-muted-foreground">{ann.type} &middot; {ann.audience} &middot; {ann.created}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={ann.status === "Active" ? "default" : ann.status === "Scheduled" ? "outline" : "secondary"}>{ann.status}</Badge>
                  <Button variant="outline" size="sm" data-testid={`button-edit-announcement-${ann.title.toLowerCase().replace(/\s+/g, "-")}`}>Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
