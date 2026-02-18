import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, MessageSquare, LifeBuoy, ArrowRight, BarChart3, Settings, BookOpen } from "lucide-react";
import { Link } from "wouter";

const stats = [
  { label: "Total Posts", value: "24", icon: FileText, change: "+3 this week" },
  { label: "Active Keywords", value: "142", icon: Search, change: "+12 tracked" },
  { label: "Widget Chats", value: "38", icon: MessageSquare, change: "Last 7 days" },
  { label: "Support Tickets", value: "2", icon: LifeBuoy, change: "1 open" },
];

const recentActivity = [
  { action: "Published blog post", detail: "10 Best SEO Strategies for 2026", time: "2 hours ago" },
  { action: "Keyword rank improved", detail: "\"seo agency\" moved to position #3", time: "5 hours ago" },
  { action: "Widget chat completed", detail: "Customer inquiry about pricing", time: "Yesterday" },
  { action: "Support ticket resolved", detail: "TKT-1021: Webhook configuration", time: "2 days ago" },
  { action: "New keyword added", detail: "\"local seo services\" added to tracker", time: "3 days ago" },
];

const quickLinks = [
  { label: "Rank Tracker", href: "/dashboard/rank-tracker", icon: BarChart3 },
  { label: "Knowledge Base", href: "/dashboard/ai-training-kb", icon: BookOpen },
  { label: "Support Center", href: "/dashboard/support-tickets", icon: LifeBuoy },
  { label: "Settings", href: "/dashboard/settings-setup", icon: Settings },
];

export default function Today() {
  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Your workspace at a glance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground" data-testid={`text-stat-label-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.label}</p>
                    <p className="text-2xl font-bold mt-1" data-testid={`text-stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2" data-testid="card-recent-activity">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-4" data-testid="text-recent-activity-title">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((item, index) => (
                  <div key={index} className="flex items-start justify-between gap-3" data-testid={`activity-item-${index}`}>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium" data-testid={`text-activity-action-${index}`}>{item.action}</p>
                      <p className="text-xs text-muted-foreground truncate" data-testid={`text-activity-detail-${index}`}>{item.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-quick-links">
            <CardContent className="p-4">
              <h2 className="font-semibold mb-4" data-testid="text-quick-links-title">Quick Links</h2>
              <div className="space-y-2">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button variant="ghost" className="w-full justify-between" data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      <span className="flex items-center gap-2">
                        <link.icon className="w-4 h-4" />
                        {link.label}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
