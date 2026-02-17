import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User, AdminUser } from "@shared/schema";

export default function AdminUsers() {
  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({ queryKey: ["/api/users"] });
  const { data: adminUsers, isLoading: loadingAdmins } = useQuery<AdminUser[]>({ queryKey: ["/api/admin-users"] });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-users-title">Users</h1>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users" data-testid="tab-users">Users ({users?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="admins" data-testid="tab-admins">Admin Users ({adminUsers?.length ?? 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : !users?.length ? (
                <p className="text-muted-foreground text-sm" data-testid="text-no-users">No users yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} data-testid={`row-user-${u.id}`}>
                        <TableCell className="font-medium">{u.email || "—"}</TableCell>
                        <TableCell>{u.firstName || "—"}</TableCell>
                        <TableCell>{u.lastName || "—"}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingAdmins ? (
                <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : !adminUsers?.length ? (
                <p className="text-muted-foreground text-sm" data-testid="text-no-admins">No admin users yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((a) => (
                      <TableRow key={a.id} data-testid={`row-admin-${a.id}`}>
                        <TableCell className="font-medium">{a.name}</TableCell>
                        <TableCell>{a.email}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{a.role}</Badge></TableCell>
                        <TableCell>{a.department}</TableCell>
                        <TableCell>
                          <Badge variant={a.isActive ? "default" : "secondary"} className="text-xs">
                            {a.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
