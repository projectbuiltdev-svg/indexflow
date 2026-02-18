import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const announcements = [
  { title: "Scheduled Maintenance Window", type: "Maintenance", status: "Active", published: "Feb 15, 2026", expires: "Feb 22, 2026" },
  { title: "New Content Editor Features", type: "Feature", status: "Active", published: "Feb 10, 2026", expires: "Mar 10, 2026" },
  { title: "Platform v2.5 Release Notes", type: "Update", status: "Scheduled", published: "Feb 20, 2026", expires: "Mar 20, 2026" },
  { title: "Security Update Required", type: "Alert", status: "Active", published: "Feb 12, 2026", expires: "Feb 28, 2026" },
  { title: "Holiday Support Hours", type: "Maintenance", status: "Expired", published: "Dec 20, 2025", expires: "Jan 5, 2026" },
];

function typeBadgeVariant(type: string) {
  if (type === "Maintenance") return "secondary" as const;
  if (type === "Feature") return "default" as const;
  if (type === "Alert") return "destructive" as const;
  return "outline" as const;
}

function statusBadgeVariant(status: string) {
  if (status === "Active") return "default" as const;
  if (status === "Scheduled") return "outline" as const;
  return "secondary" as const;
}

export default function AdminSupportAnnouncements() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Notifications</h1>
          <p className="text-sm text-muted-foreground">System announcements and alerts</p>
        </div>
        <Button data-testid="button-new-announcement">New Announcement</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((ann, i) => (
                <TableRow key={i} data-testid={`row-announcement-${i}`}>
                  <TableCell className="font-medium">{ann.title}</TableCell>
                  <TableCell>
                    <Badge variant={typeBadgeVariant(ann.type)}>{ann.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(ann.status)}>{ann.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ann.published}</TableCell>
                  <TableCell className="text-muted-foreground">{ann.expires}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button variant="outline" size="sm" data-testid={`button-edit-announcement-${i}`}>Edit</Button>
                      <Button variant="outline" size="sm" data-testid={`button-deactivate-announcement-${i}`}>Deactivate</Button>
                      <Button variant="destructive" size="sm" data-testid={`button-delete-announcement-${i}`}>Delete</Button>
                    </div>
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