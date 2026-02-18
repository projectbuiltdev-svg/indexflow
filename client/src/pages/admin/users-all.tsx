import { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, UserPlus, Users, Shield, Building2, Briefcase, Target, Presentation, CheckCircle2 } from "lucide-react";

const departments = [
  { name: "Sales", count: 4, icon: Briefcase },
  { name: "Marketing", count: 3, icon: Target },
  { name: "Support", count: 2, icon: Users },
  { name: "Engineering", count: 3, icon: Building2 },
];

const roles = [
  { name: "Super Admin", count: 1, icon: Shield },
  { name: "Admin", count: 3, icon: Shield },
  { name: "Manager", count: 4, icon: Users },
  { name: "Staff", count: 4, icon: Users },
];

const users = [
  { id: 1, name: "Maria Garcia", email: "maria@indexflow.cloud", department: "Sales", role: "Super Admin", access: "Full Access", status: "Active", lastLogin: "2 min ago", lastLogout: "-", session: "Active", funnelActivity: "3 deals" },
  { id: 2, name: "James Park", email: "james@indexflow.cloud", department: "Support", role: "Admin", access: "Full Access", status: "Active", lastLogin: "1 hr ago", lastLogout: "Yesterday", session: "Active", funnelActivity: "5 tickets" },
  { id: 3, name: "Sarah Lin", email: "sarah@indexflow.cloud", department: "Engineering", role: "Admin", access: "Full Access", status: "Active", lastLogin: "3 hrs ago", lastLogout: "2 days ago", session: "Inactive", funnelActivity: "-" },
  { id: 4, name: "Alex Porter", email: "alex@indexflow.cloud", department: "Marketing", role: "Manager", access: "Limited", status: "Active", lastLogin: "1 day ago", lastLogout: "1 day ago", session: "Inactive", funnelActivity: "2 campaigns" },
  { id: 5, name: "Liam Chen", email: "liam@indexflow.cloud", department: "Sales", role: "Staff", access: "Limited", status: "Suspended", lastLogin: "14 days ago", lastLogout: "14 days ago", session: "Expired", funnelActivity: "1 deal" },
];

const rolePermissions = [
  { role: "Super Admin", permissions: ["Full Access", "User Management", "Billing", "Settings", "API Keys", "Danger Zone"] },
  { role: "Admin", permissions: ["Full Access", "User Management", "Billing", "Settings"] },
  { role: "Manager", permissions: ["View All", "Edit Content", "Manage Team", "Reports"] },
  { role: "Staff", permissions: ["View Assigned", "Edit Own", "Submit Reports"] },
];

const pipelineStats = [
  { stage: "Leads", count: 12, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10 dark:bg-blue-500/20" },
  { stage: "Demo", count: 5, icon: Presentation, color: "text-violet-500", bg: "bg-violet-500/10 dark:bg-violet-500/20" },
  { stage: "Proposal", count: 3, icon: Target, color: "text-amber-500", bg: "bg-amber-500/10 dark:bg-amber-500/20" },
  { stage: "Closed", count: 8, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 dark:bg-emerald-500/20" },
];

export default function AdminUsersAll() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchDepartment = departmentFilter === "all" || u.department === departmentFilter;
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchDepartment && matchRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Team & Permissions</h1>
            <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Manage staff accounts, departments, and role-based access</p>
          </div>
          <Button data-testid="button-invite-member">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Team Member
          </Button>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Departments</p>
          <div className="grid gap-4 md:grid-cols-4">
            {departments.map((dept) => (
              <Card key={dept.name} data-testid={`card-dept-${dept.name.toLowerCase()}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">{dept.name}</p>
                    <dept.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold mt-1">{dept.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground mb-3">Roles</p>
          <div className="grid gap-4 md:grid-cols-4">
            {roles.map((role) => (
              <Card key={role.name} data-testid={`card-role-${role.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-muted-foreground">{role.name}</p>
                    <role.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold mt-1">{role.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-users"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-department-filter">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(d => (
                <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-role-filter">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {roles.map(r => (
                <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Last Logout</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Funnel Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id} data-testid={`row-user-${user.id}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline" data-testid={`badge-role-${user.id}`}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={user.access === "Full Access" ? "text-emerald-600 border-emerald-500/30 text-xs" : "text-muted-foreground text-xs"}
                      >
                        {user.access}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={user.status === "Active" ? "text-emerald-600 border-emerald-500/30 text-xs" : "text-red-500 border-red-500/30 text-xs"}
                        data-testid={`badge-status-${user.id}`}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.lastLogout}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.session === "Active" ? "text-emerald-600 border-emerald-500/30 text-xs" :
                          user.session === "Expired" ? "text-red-500 border-red-500/30 text-xs" :
                          "text-muted-foreground text-xs"
                        }
                      >
                        {user.session}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.funnelActivity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-semibold mb-4" data-testid="text-section-permissions">Role Permissions Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {rolePermissions.map((rp) => (
              <Card key={rp.role} data-testid={`card-permissions-${rp.role.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardHeader>
                  <CardTitle className="text-base">{rp.role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {rp.permissions.map((perm) => (
                      <Badge key={perm} variant="secondary" className="text-xs">{perm}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4" data-testid="text-section-funnel">Sales Pipeline Funnel</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {pipelineStats.map((ps) => (
              <Card key={ps.stage} data-testid={`card-funnel-${ps.stage.toLowerCase()}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-md ${ps.bg}`}>
                      <ps.icon className={`w-4 h-4 ${ps.color}`} />
                    </div>
                    <span className="text-sm text-muted-foreground">{ps.stage}</span>
                  </div>
                  <p className="text-2xl font-bold">{ps.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
