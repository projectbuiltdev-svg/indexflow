import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const admins = [
  { name: "Alex Johnson", email: "alex@indexflow.io", role: "super_admin", lastLogin: "10 min ago" },
  { name: "Priya Patel", email: "priya@indexflow.io", role: "admin", lastLogin: "2 hours ago" },
  { name: "James Morrison", email: "james@indexflow.io", role: "admin", lastLogin: "6 hours ago" },
  { name: "Rachel Wong", email: "rachel@indexflow.io", role: "support", lastLogin: "1 day ago" },
];

function roleBadgeVariant(role: string) {
  if (role === "super_admin") return "default" as const;
  if (role === "admin") return "secondary" as const;
  return "outline" as const;
}

export default function AdminUsersAdmins() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Admin Users</h1>
          <p className="text-sm text-muted-foreground">Platform administrators</p>
        </div>
        <Button data-testid="button-add-admin">Add Admin</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.email} data-testid={`row-admin-${admin.email.split("@")[0]}`}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={roleBadgeVariant(admin.role)}>{admin.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{admin.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button variant="outline" size="sm" data-testid={`button-edit-admin-${admin.email.split("@")[0]}`}>Edit</Button>
                      <Button variant="destructive" size="sm" data-testid={`button-remove-admin-${admin.email.split("@")[0]}`}>Remove</Button>
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