import { useState } from "react";
import { Plus, Search, Mail, Shield, ShieldCheck, Headset, TrendingUp, Globe, DollarSign, Trash2, Pause, Play, Clock, LogIn, LogOut, Users, Target, Presentation, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/admin-layout";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import type { AdminRole, AdminDepartment } from "@shared/schema";
import { adminDepartmentLabels } from "@shared/schema";

const roleConfig: Record<AdminRole, { label: string; description: string; icon: typeof Shield; color: string; bg: string; pages: string[] }> = {
  super_admin: {
    label: "Super Admin",
    description: "Full access to all admin features and system settings",
    icon: ShieldCheck,
    color: "text-primary",
    bg: "bg-primary/10 dark:bg-primary/20",
    pages: ["Everything + System Settings"],
  },
  admin: {
    label: "Admin",
    description: "Full access except system-level configuration",
    icon: Shield,
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-500/10 dark:bg-blue-500/20",
    pages: ["Dashboard", "Clients", "CRM", "Users", "Billing", "Websites", "Website Changes", "Widgets", "Twilio", "Calls", "SEO", "Support", "Analytics", "Export", "Notifications", "Settings"],
  },
  sales: {
    label: "Sales",
    description: "Access to leads, pipeline, CRM, and client analytics",
    icon: DollarSign,
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    pages: ["Dashboard", "Clients", "CRM", "Analytics"],
  },
  seo_production: {
    label: "SEO Production",
    description: "On-page, off-page, technical SEO, and core web vitals",
    icon: TrendingUp,
    color: "text-violet-500 dark:text-violet-400",
    bg: "bg-violet-500/10 dark:bg-violet-500/20",
    pages: ["Dashboard", "SEO", "Clients", "Analytics"],
  },
  website_production: {
    label: "Website Production",
    description: "Website changes, builds, design, and pSEO location setup",
    icon: Globe,
    color: "text-cyan-500 dark:text-cyan-400",
    bg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    pages: ["Dashboard", "Website Changes", "Websites", "Clients"],
  },
  customer_support: {
    label: "Customer Support",
    description: "Support tickets, calls, client communication, and website changes",
    icon: Headset,
    color: "text-orange-500 dark:text-orange-400",
    bg: "bg-orange-500/10 dark:bg-orange-500/20",
    pages: ["Dashboard", "Support Tickets", "Call Logs", "Clients", "Website Changes"],
  },
};

const departmentConfig: Record<AdminDepartment, { label: string; color: string }> = {
  management: { label: "Management", color: "text-primary" },
  the_boiler_room: { label: "The Boiler Room", color: "text-emerald-500 dark:text-emerald-400" },
  seo_production: { label: "SEO Production", color: "text-violet-500 dark:text-violet-400" },
  website_production: { label: "Website Production", color: "text-cyan-500 dark:text-cyan-400" },
  customer_support: { label: "Customer Support", color: "text-orange-500 dark:text-orange-400" },
};

const funnelStages = [
  { name: "Leads", value: 142, fill: "hsl(var(--chart-1))" },
  { name: "Demo", value: 68, fill: "hsl(var(--chart-2))" },
  { name: "Proposal", value: 34, fill: "hsl(var(--chart-3))" },
  { name: "Closed", value: 18, fill: "hsl(var(--chart-4))" },
];

const weeklyFunnelData = [
  { week: "Week 1", leads: 32, demos: 14, proposals: 7, closed: 3 },
  { week: "Week 2", leads: 38, demos: 18, proposals: 9, closed: 5 },
  { week: "Week 3", leads: 35, demos: 16, proposals: 8, closed: 4 },
  { week: "Week 4", leads: 37, demos: 20, proposals: 10, closed: 6 },
];

const repPerformance = [
  { name: "Maria Garcia", leads: 45, demos: 22, proposals: 12, closed: 7 },
  { name: "David Chen", leads: 38, demos: 18, proposals: 9, closed: 5 },
  { name: "John Smith", leads: 30, demos: 14, proposals: 7, closed: 3 },
  { name: "Lisa Brown", leads: 29, demos: 14, proposals: 6, closed: 3 },
];

const users = [
  { id: 1, name: "Admin User", email: "admin@indexflow.io", role: "super_admin" as AdminRole, department: "management" as AdminDepartment, lastActive: "Just now", isActive: true, lastLogin: "Feb 15, 2026 9:02 AM", lastLogout: null, sessionDuration: "2h 14m", funnelActivity: "12 actions" },
  { id: 2, name: "John Smith", email: "john@indexflow.io", role: "admin" as AdminRole, department: "management" as AdminDepartment, lastActive: "2 hours ago", isActive: true, lastLogin: "Feb 15, 2026 7:30 AM", lastLogout: "Feb 15, 2026 9:15 AM", sessionDuration: "1h 45m", funnelActivity: "8 actions" },
  { id: 3, name: "Maria Garcia", email: "maria@indexflow.io", role: "sales" as AdminRole, department: "the_boiler_room" as AdminDepartment, lastActive: "1 hour ago", isActive: true, lastLogin: "Feb 15, 2026 8:10 AM", lastLogout: null, sessionDuration: "3h 06m", funnelActivity: "27 actions" },
  { id: 4, name: "David Chen", email: "david@indexflow.io", role: "sales" as AdminRole, department: "the_boiler_room" as AdminDepartment, lastActive: "5 hours ago", isActive: true, lastLogin: "Feb 14, 2026 4:00 PM", lastLogout: "Feb 14, 2026 6:32 PM", sessionDuration: "2h 32m", funnelActivity: "19 actions" },
  { id: 5, name: "Sarah Johnson", email: "sarah@indexflow.io", role: "seo_production" as AdminRole, department: "seo_production" as AdminDepartment, lastActive: "3 hours ago", isActive: true, lastLogin: "Feb 15, 2026 6:45 AM", lastLogout: "Feb 15, 2026 8:20 AM", sessionDuration: "1h 35m", funnelActivity: "5 actions" },
  { id: 6, name: "Tom Wilson", email: "tom@indexflow.io", role: "website_production" as AdminRole, department: "website_production" as AdminDepartment, lastActive: "1 day ago", isActive: true, lastLogin: "Feb 14, 2026 10:00 AM", lastLogout: "Feb 14, 2026 5:45 PM", sessionDuration: "7h 45m", funnelActivity: "34 actions" },
  { id: 7, name: "Lisa Brown", email: "lisa@indexflow.io", role: "customer_support" as AdminRole, department: "customer_support" as AdminDepartment, lastActive: "30 min ago", isActive: true, lastLogin: "Feb 15, 2026 10:30 AM", lastLogout: null, sessionDuration: "0h 46m", funnelActivity: "3 actions" },
  { id: 8, name: "James Lee", email: "james@indexflow.io", role: "customer_support" as AdminRole, department: "customer_support" as AdminDepartment, lastActive: "1 week ago", isActive: false, lastLogin: "Feb 8, 2026 9:00 AM", lastLogout: "Feb 8, 2026 11:30 AM", sessionDuration: "2h 30m", funnelActivity: "0 actions" },
];

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRole>("customer_support");
  const [inviteDepartment, setInviteDepartment] = useState<AdminDepartment>("customer_support");
  const [deleteUser, setDeleteUser] = useState<typeof users[number] | null>(null);
  const [suspendUser, setSuspendUser] = useState<typeof users[number] | null>(null);

  const handleDeleteUser = (user: typeof users[number]) => {
    setDeleteUser(null);
  };

  const handleToggleSuspend = (user: typeof users[number]) => {
    setSuspendUser(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = !searchQuery ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesDepartment = filterDepartment === "all" || u.department === filterDepartment;
    return matchesSearch && matchesRole && matchesDepartment;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-users-title">Team & Permissions</h1>
            <p className="text-muted-foreground">Manage staff accounts, departments, and role-based access</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button data-testid="button-invite-user">
                <Plus className="h-4 w-4 mr-2" />
                Invite Team Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Add a new person to your team. They'll receive an email invitation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="invite-name">Full Name</Label>
                  <Input
                    id="invite-name"
                    placeholder="Jane Smith"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    data-testid="input-invite-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="jane@indexflow.io"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    data-testid="input-invite-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={inviteDepartment} onValueChange={(v) => setInviteDepartment(v as AdminDepartment)}>
                    <SelectTrigger data-testid="select-invite-department">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(departmentConfig) as [AdminDepartment, typeof departmentConfig[AdminDepartment]][]).map(([key, config]) => (
                        <SelectItem key={key} value={key} data-testid={`option-department-${key}`}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as AdminRole)}>
                    <SelectTrigger data-testid="select-invite-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(roleConfig) as [AdminRole, typeof roleConfig[AdminRole]][]).map(([key, config]) => (
                        <SelectItem key={key} value={key} data-testid={`option-role-${key}`}>
                          <div className="flex items-center gap-2">
                            <config.icon className={`w-3.5 h-3.5 ${config.color}`} />
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {inviteRole && (
                    <p className="text-xs text-muted-foreground">
                      {roleConfig[inviteRole].description}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" data-testid="button-cancel-invite">Cancel</Button>
                </DialogClose>
                <Button
                  disabled={!inviteName.trim() || !inviteEmail.trim()}
                  data-testid="button-send-invite"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Departments</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(Object.entries(departmentConfig) as [AdminDepartment, typeof departmentConfig[AdminDepartment]][]).map(([key, config]) => {
              const count = users.filter(u => u.department === key && u.isActive).length;
              return (
                <Card key={key} data-testid={`card-department-stat-${key}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-2xl font-bold tabular-nums">{count}</p>
                      <p className={`text-xs font-medium ${config.color}`}>{config.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Roles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(Object.entries(roleConfig) as [AdminRole, typeof roleConfig[AdminRole]][]).map(([key, config]) => {
              const count = users.filter(u => u.role === key && u.isActive).length;
              const Icon = config.icon;
              return (
                <Card key={key} data-testid={`card-role-stat-${key}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${config.bg}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold tabular-nums">{count}</p>
                        <p className="text-xs text-muted-foreground">{config.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap space-y-0">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-users"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-[180px]" data-testid="select-filter-department">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="option-filter-dept-all">All Departments</SelectItem>
                  {(Object.entries(departmentConfig) as [AdminDepartment, typeof departmentConfig[AdminDepartment]][]).map(([key, config]) => (
                    <SelectItem key={key} value={key} data-testid={`option-filter-dept-${key}`}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[180px]" data-testid="select-filter-role">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="option-filter-all">All Roles</SelectItem>
                  {(Object.entries(roleConfig) as [AdminRole, typeof roleConfig[AdminRole]][]).map(([key, config]) => (
                    <SelectItem key={key} value={key} data-testid={`option-filter-${key}`}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">User</th>
                    <th className="pb-3 font-medium text-muted-foreground">Department</th>
                    <th className="pb-3 font-medium text-muted-foreground">Role</th>
                    <th className="pb-3 font-medium text-muted-foreground">Access</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Last Login</th>
                    <th className="pb-3 font-medium text-muted-foreground">Last Logout</th>
                    <th className="pb-3 font-medium text-muted-foreground">Session</th>
                    <th className="pb-3 font-medium text-muted-foreground">Funnel Activity</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const config = roleConfig[user.role];
                    const deptConfig = departmentConfig[user.department];
                    const Icon = config.icon;
                    return (
                      <tr key={user.id} className="border-b last:border-0" data-testid={`row-user-${user.id}`}>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-9 w-9 rounded-full flex items-center justify-center ${config.bg}`}>
                              <span className={`text-sm font-medium ${config.color}`}>{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`text-sm font-medium ${deptConfig.color}`}>{deptConfig.label}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                            <span className="text-sm font-medium">{config.label}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1 flex-wrap max-w-[200px]">
                            {config.pages.slice(0, 3).map((page, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px]">{page}</Badge>
                            ))}
                            {config.pages.length > 3 && (
                              <Badge variant="outline" className="text-[10px]">+{config.pages.length - 3}</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          {user.isActive ? (
                            <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground text-xs">Inactive</Badge>
                          )}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5">
                            <LogIn className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground whitespace-nowrap" data-testid={`text-login-${user.id}`}>{user.lastLogin}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5">
                            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground whitespace-nowrap" data-testid={`text-logout-${user.id}`}>
                              {user.lastLogout ?? "Still online"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground whitespace-nowrap" data-testid={`text-session-${user.id}`}>{user.sessionDuration}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm text-muted-foreground whitespace-nowrap" data-testid={`text-funnel-${user.id}`}>{user.funnelActivity}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSuspendUser(user)}
                              data-testid={`button-suspend-${user.id}`}
                            >
                              {user.isActive ? (
                                <Pause className="h-4 w-4 text-amber-500" />
                              ) : (
                                <Play className="h-4 w-4 text-emerald-500" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteUser(user)}
                              data-testid={`button-delete-${user.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-role-overview">
          <CardHeader>
            <CardTitle className="text-base">Role Permissions Overview</CardTitle>
            <CardDescription>Each role has access to specific sections of the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.entries(roleConfig) as [AdminRole, typeof roleConfig[AdminRole]][]).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <div key={key} className="border rounded-md p-4 space-y-2" data-testid={`card-role-detail-${key}`}>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${config.bg}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{config.label}</p>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {config.pages.map((page, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">{page}</Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card data-testid="card-sales-funnel">
          <CardHeader>
            <CardTitle className="text-base">Sales Pipeline Funnel</CardTitle>
            <CardDescription>Current month pipeline stages and conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Leads", value: 142, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10 dark:bg-blue-500/20" },
                { label: "Demos", value: 68, icon: Presentation, color: "text-violet-500", bg: "bg-violet-500/10 dark:bg-violet-500/20", rate: "47.9%" },
                { label: "Proposals", value: 34, icon: Target, color: "text-amber-500", bg: "bg-amber-500/10 dark:bg-amber-500/20", rate: "50.0%" },
                { label: "Closed", value: 18, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 dark:bg-emerald-500/20", rate: "52.9%" },
              ].map((stage) => {
                const StageIcon = stage.icon;
                return (
                  <div key={stage.label} className="border rounded-md p-4 space-y-1" data-testid={`stat-funnel-${stage.label.toLowerCase()}`}>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${stage.bg}`}>
                        <StageIcon className={`w-4 h-4 ${stage.color}`} />
                      </div>
                      <span className="text-sm text-muted-foreground">{stage.label}</span>
                    </div>
                    <p className="text-2xl font-semibold">{stage.value}</p>
                    {stage.rate && (
                      <p className="text-xs text-muted-foreground">Conversion: {stage.rate}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Funnel Overview</h4>
                <div className="space-y-3" data-testid="funnel-bars">
                  {funnelStages.map((stage, i) => {
                    const maxVal = funnelStages[0].value;
                    const pct = Math.round((stage.value / maxVal) * 100);
                    return (
                      <div key={stage.name} className="space-y-1">
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span>{stage.name}</span>
                          <span className="text-muted-foreground">{stage.value} ({pct}%)</span>
                        </div>
                        <div className="h-6 w-full rounded-md bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-md transition-all"
                            style={{ width: `${pct}%`, backgroundColor: stage.fill }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Weekly Pipeline Trend</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyFunnelData} barCategoryGap="20%">
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={30} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                      labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                    />
                    <Bar dataKey="leads" name="Leads" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="demos" name="Demos" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="proposals" name="Proposals" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="closed" name="Closed" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-rep-performance">
          <CardHeader>
            <CardTitle className="text-base">Rep Performance</CardTitle>
            <CardDescription>Individual sales team member pipeline breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={repPerformance} layout="vertical" barCategoryGap="20%">
                <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                  labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                />
                <Bar dataKey="leads" name="Leads" fill="hsl(var(--chart-1))" radius={[0, 2, 2, 0]} stackId="a" />
                <Bar dataKey="demos" name="Demos" fill="hsl(var(--chart-2))" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="proposals" name="Proposals" fill="hsl(var(--chart-3))" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="closed" name="Closed" fill="hsl(var(--chart-4))" radius={[0, 2, 2, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Dialog open={!!suspendUser} onOpenChange={(open) => !open && setSuspendUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{suspendUser?.isActive ? "Suspend Account" : "Reactivate Account"}</DialogTitle>
              <DialogDescription>
                {suspendUser?.isActive
                  ? `This will lock ${suspendUser?.name} (${suspendUser?.email}) out of their account. They won't be able to log in until reactivated.`
                  : `This will restore access for ${suspendUser?.name} (${suspendUser?.email}). They will be able to log in again.`
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSuspendUser(null)} data-testid="button-cancel-suspend">
                Cancel
              </Button>
              <Button
                variant={suspendUser?.isActive ? "destructive" : "default"}
                onClick={() => suspendUser && handleToggleSuspend(suspendUser)}
                data-testid="button-confirm-suspend"
              >
                {suspendUser?.isActive ? (
                  <><Pause className="w-4 h-4 mr-2" />Suspend</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" />Reactivate</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Team Member</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove {deleteUser?.name} ({deleteUser?.email}) from the team? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteUser(null)} data-testid="button-cancel-delete">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteUser && handleDeleteUser(deleteUser)}
                data-testid="button-confirm-delete"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
