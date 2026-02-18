import {
  Building2,
  CreditCard,
  Calendar,
  BedDouble,
  PhoneCall,
  MessageSquare,
  Mic,
  TrendingUp,
  FileEdit,
  LifeBuoy,
  Plus,
  Globe,
  Eye,
  Settings,
  Receipt,
  Phone,
  Headphones,
  Download,
  ChevronRight,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin-layout";

const statCards = [
  { title: "Total Clients", value: "47", subtitle: "+3 this month", icon: Building2 },
  { title: "Active Subscriptions", value: "43", subtitle: "$12,857/mo", icon: CreditCard },
  { title: "Content Posts", value: "2,847", subtitle: "+234 this week", icon: Calendar },
  { title: "SEO Keywords", value: "156", subtitle: "+18 this week", icon: TrendingUp },
  { title: "AI Calls Handled", value: "1,293", subtitle: "This month", icon: PhoneCall },
  { title: "SMS Sent", value: "3,847", subtitle: "+312 this week", icon: MessageSquare },
  { title: "Widget Voice", value: "179", subtitle: "+47 this month", icon: Mic },
  { title: "Keywords Tracked", value: "342", subtitle: "Across 38 clients", icon: TrendingUp },
  { title: "Website Changes", value: "23", subtitle: "8 pending review", icon: FileEdit },
  { title: "Support Tickets", value: "12", subtitle: "3 open", icon: LifeBuoy },
];

const recentClients = [
  { name: "Apex Digital Agency", plan: "White Label Agency", status: "Active", date: "Jan 28, 2026" },
  { name: "Jake Morrison SEO", plan: "Solo", status: "Active", date: "Jan 25, 2026" },
  { name: "Greenfield Law Firm", plan: "Professional", status: "Pending Setup", date: "Jan 24, 2026" },
  { name: "Meridian Hotels Group", plan: "Enterprise", status: "Active", date: "Jan 20, 2026" },
];

const quickActions = [
  { label: "Add New Client", icon: Plus, path: "/admin/agencies" },
  { label: "Create Website", icon: Globe, path: "/admin/websites" },
  { label: "Review Website Changes", icon: Eye, path: "/admin/website-changes" },
  { label: "Configure Widget", icon: Settings, path: "/admin/widget-config" },
  { label: "SEO & Rankings", icon: TrendingUp, path: "/admin/platform-seo/keywords" },
  { label: "View Billing Reports", icon: Receipt, path: "/admin/billing/subscriptions" },
  { label: "Twilio Management", icon: Phone, path: "/admin/system/twilio" },
  { label: "Support Tickets", icon: Headphones, path: "/admin/support/tickets" },
  { label: "Export Data", icon: Download, path: "/admin/export-data" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "Active": return "text-emerald-600";
    case "Pending Setup": return "text-amber-500";
    default: return "text-muted-foreground";
  }
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Dashboard</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Platform overview and management</p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {statCards.map((card, index) => (
            <Card key={card.title} data-testid={`card-stat-${index}`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</p>
                  </div>
                  <card.icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card data-testid="card-recent-clients">
            <CardContent className="pt-5">
              <div className="mb-4">
                <h2 className="text-lg font-serif italic font-semibold" data-testid="text-recent-clients-title">Recent Clients</h2>
                <p className="text-xs text-muted-foreground">Latest signups and their status</p>
              </div>
              <div className="space-y-4">
                {recentClients.map((client, index) => (
                  <div key={client.name} className="flex items-center justify-between" data-testid={`row-recent-client-${index}`}>
                    <div>
                      <p className="text-sm font-medium" data-testid={`text-client-name-${index}`}>{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.plan}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${getStatusColor(client.status)}`} data-testid={`text-client-status-${index}`}>{client.status}</p>
                      <p className="text-xs text-muted-foreground">{client.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t">
                <Link href="/admin/agencies">
                  <Button variant="ghost" className="text-xs p-0 h-auto" data-testid="link-view-all-clients">
                    View All Clients <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-quick-actions">
            <CardContent className="pt-5">
              <div className="mb-4">
                <h2 className="text-lg font-serif italic font-semibold" data-testid="text-quick-actions-title">Quick Actions</h2>
                <p className="text-xs text-muted-foreground">Common administrative tasks</p>
              </div>
              <div className="space-y-1">
                {quickActions.map((action, index) => (
                  <Link key={action.label} href={action.path}>
                    <div
                      className="flex items-center gap-3 py-2 px-2 rounded-md hover-elevate cursor-pointer"
                      data-testid={`link-quick-action-${index}`}
                    >
                      <action.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{action.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
