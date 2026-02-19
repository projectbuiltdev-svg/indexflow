import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  MessageSquare,
  LifeBuoy,
  ArrowRight,
  BarChart3,
  Settings,
  BookOpen,
  TrendingUp,
  Globe,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Link } from "wouter";
import { useWorkspace } from "@/lib/workspace-context";

const stats = [
  {
    label: "Total Posts",
    value: "24",
    icon: FileText,
    change: "+3",
    changeLabel: "this week",
    trend: "up" as const,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    iconColor: "text-blue-500",
  },
  {
    label: "Active Keywords",
    value: "142",
    icon: Search,
    change: "+12",
    changeLabel: "tracked",
    trend: "up" as const,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    iconColor: "text-emerald-500",
  },
  {
    label: "Widget Chats",
    value: "38",
    icon: MessageSquare,
    change: "7",
    changeLabel: "last 7 days",
    trend: "neutral" as const,
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    iconColor: "text-violet-500",
  },
  {
    label: "Support Tickets",
    value: "2",
    icon: LifeBuoy,
    change: "1",
    changeLabel: "open",
    trend: "down" as const,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    iconColor: "text-amber-500",
  },
];

const recentActivity = [
  {
    action: "Published blog post",
    detail: "10 Best SEO Strategies for 2026",
    time: "2 hours ago",
    status: "success" as const,
  },
  {
    action: "Keyword rank improved",
    detail: "\"seo agency\" moved to position #3",
    time: "5 hours ago",
    status: "success" as const,
  },
  {
    action: "Widget chat completed",
    detail: "Customer inquiry about pricing",
    time: "Yesterday",
    status: "info" as const,
  },
  {
    action: "Support ticket resolved",
    detail: "TKT-1021: Webhook configuration",
    time: "2 days ago",
    status: "success" as const,
  },
  {
    action: "New keyword added",
    detail: "\"local seo services\" added to tracker",
    time: "3 days ago",
    status: "info" as const,
  },
];

const quickLinks = [
  { label: "Content Engine", description: "Create & manage posts", href: "content/posts", icon: FileText, iconColor: "text-blue-500" },
  { label: "Rank Tracker", description: "Track keyword positions", href: "rank-tracker/track-keywords", icon: BarChart3, iconColor: "text-emerald-500" },
  { label: "Knowledge Base", description: "Train your AI assistant", href: "ai-training/knowledge-base", icon: BookOpen, iconColor: "text-violet-500" },
  { label: "SEO Health", description: "Audit your site", href: "seo/health", icon: Globe, iconColor: "text-amber-500" },
  { label: "Support Center", description: "Get help & resources", href: "support/tickets", icon: LifeBuoy, iconColor: "text-rose-500" },
  { label: "Settings", description: "Configure workspace", href: "settings/setup-guide", icon: Settings, iconColor: "text-slate-500" },
];

function getStatusIcon(status: string) {
  switch (status) {
    case "success":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    case "warning":
      return <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />;
    default:
      return <Zap className="w-4 h-4 text-blue-500 shrink-0" />;
  }
}

export default function Today() {
  const { selectedWorkspace } = useWorkspace();
  const workspaceName = selectedWorkspace?.name || "Your Workspace";

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-page-title">
              Dashboard Overview
            </h1>
            <p className="text-sm text-muted-foreground mt-1" data-testid="text-page-subtitle">
              {workspaceName} &mdash; at a glance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5" data-testid="badge-last-updated">
              <Clock className="w-3 h-3" />
              Updated just now
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium" data-testid={`text-stat-label-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold tracking-tight" data-testid={`text-stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {stat.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />}
                      {stat.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />}
                      <span className={`text-xs font-medium ${stat.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : stat.trend === "down" ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">{stat.changeLabel}</span>
                    </div>
                  </div>
                  <div className={`p-2.5 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2" data-testid="card-recent-activity">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-2 mb-5">
                <h2 className="font-semibold" data-testid="text-recent-activity-title">Recent Activity</h2>
                <Badge variant="secondary" data-testid="badge-activity-count">
                  {recentActivity.length} events
                </Badge>
              </div>
              <div className="space-y-1">
                {recentActivity.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 py-2.5 px-2 rounded-md hover-elevate"
                    data-testid={`activity-item-${index}`}
                  >
                    {getStatusIcon(item.status)}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium" data-testid={`text-activity-action-${index}`}>
                        {item.action}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" data-testid={`text-activity-detail-${index}`}>
                        {item.detail}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-quick-links">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-2 mb-5">
                <h2 className="font-semibold" data-testid="text-quick-links-title">Quick Links</h2>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                {quickLinks.map((link) => {
                  const basePath = selectedWorkspace ? `/${selectedWorkspace.id}/${link.href}` : `/${link.href}`;
                  return (
                    <Link key={link.href} href={basePath}>
                      <div
                        className="flex items-center gap-3 py-2.5 px-2 rounded-md hover-elevate cursor-pointer"
                        data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <link.icon className={`w-4 h-4 ${link.iconColor} shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{link.label}</p>
                          <p className="text-xs text-muted-foreground">{link.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
}
