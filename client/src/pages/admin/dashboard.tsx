import { Link } from "wouter";
import { 
  Building2, 
  CreditCard, 
  BarChart3, 
  ChevronRight,
  Globe,
  MessageSquare,
  Phone,
  Headset,
  Download,
  Volume2,
  TrendingUp,
  FileEdit,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin-layout";

const stats = [
  { label: "Total Clients", value: "47", change: "+3 this month", icon: Building2 },
  { label: "Active Subscriptions", value: "43", change: "$12,857/mo", icon: CreditCard },
  { label: "Total Leads", value: "2,847", change: "+234 this week", icon: BarChart3 },
  { label: "Active Projects", value: "156", change: "+18 this week", icon: BarChart3 },
  { label: "AI Calls Handled", value: "1,293", change: "This month", icon: Phone },
  { label: "SMS Sent", value: "3,847", change: "+312 this week", icon: MessageSquare },
  { label: "Widget Voice", value: "179", change: "+47 this week", icon: Volume2 },
  { label: "Keywords Tracked", value: "342", change: "Across 38 clients", icon: TrendingUp },
  { label: "Website Changes", value: "23", change: "8 pending review", icon: FileEdit },
  { label: "Support Tickets", value: "12", change: "3 open", icon: Headset },
];

const recentClients = [
  { name: "Acme Digital", plan: "Complete Solution", status: "Active", date: "Jan 28, 2026" },
  { name: "Dragon Media", plan: "Professional", status: "Active", date: "Jan 25, 2026" },
  { name: "Coastal SEO", plan: "Complete Solution", status: "Pending Setup", date: "Jan 24, 2026" },
  { name: "Summit Marketing", plan: "Complete Solution", status: "Active", date: "Jan 20, 2026" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
            <CardDescription>Latest signups and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div key={client.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.plan}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      client.status === "Active" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}>
                      {client.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{client.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/clients">
              <Button variant="ghost" className="w-full mt-4" data-testid="button-view-all-clients">
                View All Clients <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/clients">
              <Button variant="outline" className="w-full justify-start" data-testid="button-add-client">
                <Building2 className="h-4 w-4 mr-2" />
                Add New Client
              </Button>
            </Link>
            <Link href="/admin/websites">
              <Button variant="outline" className="w-full justify-start" data-testid="button-create-website">
                <Globe className="h-4 w-4 mr-2" />
                Create Website
              </Button>
            </Link>
            <Link href="/admin/website-changes">
              <Button variant="outline" className="w-full justify-start" data-testid="button-review-changes">
                <FileEdit className="h-4 w-4 mr-2" />
                Review Website Changes
              </Button>
            </Link>
            <Link href="/admin/widgets">
              <Button variant="outline" className="w-full justify-start" data-testid="button-configure-widget">
                <MessageSquare className="h-4 w-4 mr-2" />
                Configure Widget
              </Button>
            </Link>
            <Link href="/admin/seo">
              <Button variant="outline" className="w-full justify-start" data-testid="button-seo-rankings">
                <TrendingUp className="h-4 w-4 mr-2" />
                SEO & Rankings
              </Button>
            </Link>
            <Link href="/admin/billing">
              <Button variant="outline" className="w-full justify-start" data-testid="button-view-billing">
                <CreditCard className="h-4 w-4 mr-2" />
                View Billing Reports
              </Button>
            </Link>
            <Link href="/admin/twilio">
              <Button variant="outline" className="w-full justify-start" data-testid="button-manage-twilio">
                <Phone className="h-4 w-4 mr-2" />
                Twilio Management
              </Button>
            </Link>
            <Link href="/admin/support">
              <Button variant="outline" className="w-full justify-start" data-testid="button-view-support">
                <Headset className="h-4 w-4 mr-2" />
                Support Tickets
              </Button>
            </Link>
            <Link href="/admin/export-data">
              <Button variant="outline" className="w-full justify-start" data-testid="button-export-data">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
