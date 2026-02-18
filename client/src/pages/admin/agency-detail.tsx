import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Globe, FileText, Search, DollarSign } from "lucide-react";

const overviewStats = [
  { label: "Workspaces", value: "5", icon: Globe },
  { label: "Total Posts", value: "234", icon: FileText },
  { label: "Keywords Tracked", value: "89", icon: Search },
  { label: "Revenue", value: "$29,900", icon: DollarSign },
];

const recentActivity = [
  { description: "New workspace 'Tech Blog' created", time: "2 hours ago" },
  { description: "Published 3 new posts in 'Marketing Hub'", time: "5 hours ago" },
  { description: "Added 12 keywords to rank tracker", time: "1 day ago" },
  { description: "User sarah@bluedigital.com joined", time: "2 days ago" },
  { description: "Upgraded plan from Starter to Professional", time: "5 days ago" },
];

const workspaces = [
  { name: "Marketing Hub", domain: "marketing.bluedigital.com", posts: 89, keywords: 34, status: "Active", created: "Jan 10, 2026" },
  { name: "Tech Blog", domain: "tech.bluedigital.com", posts: 56, keywords: 22, status: "Active", created: "Feb 1, 2026" },
  { name: "Client Portal", domain: "portal.bluedigital.com", posts: 45, keywords: 18, status: "Active", created: "Dec 15, 2025" },
  { name: "SEO Landing Pages", domain: "seo.bluedigital.com", posts: 32, keywords: 10, status: "Paused", created: "Nov 20, 2025" },
  { name: "Newsletter Archive", domain: "news.bluedigital.com", posts: 12, keywords: 5, status: "Active", created: "Jan 25, 2026" },
];

const users = [
  { name: "Sarah Chen", email: "sarah@bluedigital.com", role: "Owner", lastLogin: "10 min ago", status: "Online" },
  { name: "Tom Bradley", email: "tom@bluedigital.com", role: "Admin", lastLogin: "2 hours ago", status: "Online" },
  { name: "Amy Liu", email: "amy@bluedigital.com", role: "Editor", lastLogin: "1 day ago", status: "Offline" },
  { name: "Jake Morris", email: "jake@bluedigital.com", role: "Viewer", lastLogin: "3 days ago", status: "Offline" },
];

const invoices = [
  { id: "INV-2026-0042", amount: "$299.00", date: "Feb 1, 2026", status: "Paid" },
  { id: "INV-2026-0031", amount: "$299.00", date: "Jan 1, 2026", status: "Paid" },
  { id: "INV-2025-0284", amount: "$299.00", date: "Dec 1, 2025", status: "Paid" },
  { id: "INV-2025-0241", amount: "$199.00", date: "Nov 1, 2025", status: "Paid" },
  { id: "INV-2025-0198", amount: "$199.00", date: "Oct 1, 2025", status: "Paid" },
];

export default function AdminAgencyDetail() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Blue Digital Agency</h1>
          <p className="text-sm text-muted-foreground">Client workspace information</p>
          <Badge data-testid="badge-plan">Professional</Badge>
          <Badge variant="outline" data-testid="badge-status">Active</Badge>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button data-testid="button-edit">Edit</Button>
          <Button variant="outline" data-testid="button-suspend">Suspend</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList data-testid="tabs-agency">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="workspaces" data-testid="tab-workspaces">Workspaces</TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          <TabsTrigger value="usage" data-testid="tab-usage">Usage</TabsTrigger>
          <TabsTrigger value="billing" data-testid="tab-billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewStats.map((stat) => (
              <Card key={stat.label} data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3" data-testid={`activity-item-${i}`}>
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm">{item.description}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspaces" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspaces</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workspace Name</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Keywords</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workspaces.map((ws) => (
                    <TableRow key={ws.name} data-testid={`row-workspace-${ws.name.toLowerCase().replace(/\s+/g, "-")}`}>
                      <TableCell className="font-medium">{ws.name}</TableCell>
                      <TableCell className="text-muted-foreground">{ws.domain}</TableCell>
                      <TableCell>{ws.posts}</TableCell>
                      <TableCell>{ws.keywords}</TableCell>
                      <TableCell>
                        <Badge variant={ws.status === "Active" ? "default" : "secondary"}>{ws.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{ws.created}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" data-testid={`button-view-workspace-${ws.name.toLowerCase().replace(/\s+/g, "-")}`}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.email} data-testid={`row-user-${user.email.split("@")[0]}`}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell className="text-muted-foreground">{user.status}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" data-testid={`button-edit-user-${user.email.split("@")[0]}`}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed usage analytics for this agency.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-muted-foreground">Plan</span>
                  <Badge data-testid="badge-current-plan">Professional</Badge>
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-muted-foreground">Monthly Cost</span>
                  <span className="font-medium" data-testid="text-monthly-cost">$299.00</span>
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-muted-foreground">Next Invoice</span>
                  <span className="font-medium">Mar 1, 2026</span>
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">Visa ending 4242</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id} data-testid={`row-invoice-${inv.id}`}>
                      <TableCell className="font-medium">{inv.id}</TableCell>
                      <TableCell>{inv.amount}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.date}</TableCell>
                      <TableCell>
                        <Badge variant="default">{inv.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" data-testid={`button-view-invoice-${inv.id}`}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}