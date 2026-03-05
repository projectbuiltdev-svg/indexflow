import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BarChart3,
  TrendingUp,
  Globe,
  Megaphone,
  Search,
  Users,
  MessageSquare,
  PhoneCall,
  Brain,
  MapPin,
  Sparkles,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  LifeBuoy,
} from "lucide-react";
import { Link } from "wouter";
import { useWorkspace } from "@/lib/workspace-context";

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: typeof FileText;
  href: string;
}

const stats: StatCard[] = [
  { label: "Content Posts", value: "24", change: "+3 this week", trend: "up", icon: FileText, href: "content-engine" },
  { label: "Active Campaigns", value: "4", change: "+1 new", trend: "up", icon: Megaphone, href: "pseo/campaigns" },
  { label: "Keywords Tracked", value: "142", change: "+12 this month", trend: "up", icon: TrendingUp, href: "rank-tracker/track-keywords" },
  { label: "Grid Locations", value: "8", change: "3 scanned today", trend: "neutral", icon: MapPin, href: "rank-tracker/local-search-grid" },
  { label: "CRM Contacts", value: "63", change: "+5 this week", trend: "up", icon: Users, href: "crm/contacts" },
  { label: "Pipeline Deals", value: "12", change: "+2 new deals", trend: "up", icon: Receipt, href: "crm/pipeline" },
  { label: "Widget Chats", value: "38", change: "7 last 7 days", trend: "neutral", icon: MessageSquare, href: "widget/monitoring" },
  { label: "Calls Handled", value: "156", change: "+23 this month", trend: "up", icon: PhoneCall, href: "twilio/call-logs" },
  { label: "Knowledge Items", value: "18", change: "+2 added", trend: "up", icon: Brain, href: "ai-training/knowledge-base" },
  { label: "SEO Score", value: "87", change: "+4 pts", trend: "up", icon: Search, href: "seo/health" },
];

interface ActivityItem {
  action: string;
  detail: string;
  time: string;
  icon: typeof FileText;
}

const recentActivity: ActivityItem[] = [
  { action: "Blog post published", detail: "10 Best SEO Strategies for 2026", time: "2h ago", icon: FileText },
  { action: "Keyword rank improved", detail: "\"seo agency\" moved to #3", time: "5h ago", icon: TrendingUp },
  { action: "CRM deal updated", detail: "Acme Corp moved to Negotiation", time: "8h ago", icon: Users },
  { action: "Widget chat completed", detail: "Customer pricing inquiry", time: "1d ago", icon: MessageSquare },
  { action: "Campaign generated", detail: "Q1 Content Blitz — 12 posts", time: "1d ago", icon: Megaphone },
  { action: "AI call handled", detail: "Inbound call routed", time: "2d ago", icon: PhoneCall },
];

interface HealthItem {
  label: string;
  value: number;
}

const healthMetrics: HealthItem[] = [
  { label: "On-page SEO", value: 92 },
  { label: "Content Quality", value: 87 },
  { label: "Link Health", value: 78 },
  { label: "CMS Sync", value: 100 },
  { label: "Schema Markup", value: 65 },
];

function HealthBar({ value }: { value: number }) {
  const color = value >= 90 ? "bg-foreground/70" : value >= 70 ? "bg-foreground/50" : "bg-foreground/30";
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function Today() {
  const { selectedWorkspace } = useWorkspace();
  const workspaceName = selectedWorkspace?.name || "Your Workspace";
  const href = (path: string) => selectedWorkspace ? `/${selectedWorkspace.id}/${path}` : `/${path}`;

  return (
    <div className="-m-6 p-4 sm:p-6 min-h-[calc(100vh-3rem)] flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight" data-testid="text-page-title">{workspaceName}</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Dashboard Overview</p>
        </div>
        <Badge variant="outline" className="text-xs gap-1.5 font-normal" data-testid="badge-status">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 inline-block" />
          All systems healthy
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={href(stat.href)}>
            <Card className="hover:bg-muted/40 transition-colors cursor-pointer h-full" data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
                </div>
                <p className="text-xl font-semibold tracking-tight" data-testid={`text-stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" && <ArrowUpRight className="w-3 h-3 text-muted-foreground shrink-0" />}
                  {stat.trend === "down" && <ArrowDownRight className="w-3 h-3 text-muted-foreground shrink-0" />}
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        <Card className="lg:col-span-5" data-testid="card-recent-activity">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium" data-testid="text-recent-activity-title">Recent Activity</h2>
              <span className="text-xs text-muted-foreground">{recentActivity.length} events</span>
            </div>
            <div className="space-y-0.5">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-muted/40 transition-colors" data-testid={`activity-item-${i}`}>
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-tight" data-testid={`text-activity-action-${i}`}>{item.action}</p>
                    <p className="text-xs text-muted-foreground truncate" data-testid={`text-activity-detail-${i}`}>{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4" data-testid="card-health-scores">
          <CardContent className="p-4">
            <h2 className="text-sm font-medium mb-4" data-testid="text-health-title">Health Scores</h2>
            <div className="space-y-3.5">
              {healthMetrics.map((m) => (
                <div key={m.label} data-testid={`health-metric-${m.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.value}%</span>
                  </div>
                  <HealthBar value={m.value} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <Card className="h-full" data-testid="card-quick-actions">
            <CardContent className="p-4">
              <h2 className="text-sm font-medium mb-3" data-testid="text-quick-actions-title">Quick Actions</h2>
              <div className="space-y-1.5">
                {[
                  { label: "New Post", icon: FileText, path: "content-engine" },
                  { label: "Add Keyword", icon: Search, path: "rank-tracker/track-keywords" },
                  { label: "View Pipeline", icon: BarChart3, path: "crm/pipeline" },
                  { label: "Analytics", icon: BarChart3, path: "analytics/overview" },
                  { label: "Support", icon: LifeBuoy, path: "support/tickets" },
                ].map((a) => (
                  <Link key={a.label} href={href(a.path)}>
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2 font-normal" data-testid={`btn-quick-${a.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      <a.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      {a.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
