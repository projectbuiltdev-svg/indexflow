import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus } from "lucide-react";
import type { AdminUser, User } from "@shared/schema";

export default function AdminUsers() {
  useVenue();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", role: "customer_support", department: "customer_support" });

  const { data: adminUsers = [], isLoading: adminLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin-users"],
  });

  const { data: clientUsers = [], isLoading: clientLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin-users", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin-users"] });
      setOpen(false);
      setFormData({ name: "", email: "", role: "customer_support", department: "customer_support" });
      toast({ title: "Admin user created" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-semibold" data-testid="page-title-users">
            Users
          </h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-admin-user">
              <Plus className="h-4 w-4 mr-2" />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Admin User</DialogTitle>
            </DialogHeader>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(formData);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="admin-name">Name</Label>
                <Input
                  id="admin-name"
                  data-testid="input-admin-name"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  data-testid="input-admin-email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-role">Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData((p) => ({ ...p, role: v }))}>
                  <SelectTrigger data-testid="select-admin-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="customer_support">Customer Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-department">Department</Label>
                <Select value={formData.department} onValueChange={(v) => setFormData((p) => ({ ...p, department: v }))}>
                  <SelectTrigger data-testid="select-admin-department">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="customer_support">Customer Support</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending} data-testid="button-submit-admin-user">
                {createMutation.isPending ? "Creating..." : "Create Admin User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          {adminLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : adminUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-admin-users">
              No admin users found.
            </p>
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
                {adminUsers.map((user) => (
                  <TableRow key={user.id} data-testid={`row-admin-user-${user.id}`}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "outline"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Users</CardTitle>
        </CardHeader>
        <CardContent>
          {clientLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : clientUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-client-users">
              No client users found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientUsers.map((user) => (
                  <TableRow key={user.id} data-testid={`row-client-user-${user.id}`}>
                    <TableCell className="font-medium">
                      {[user.firstName, user.lastName].filter(Boolean).join(" ") || "-"}
                    </TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
