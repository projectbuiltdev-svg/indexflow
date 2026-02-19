import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ArrowRight,
  BarChart3,
  Settings,
  TrendingUp,
  Globe,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  PhoneCall,
  Users,
  Brain,
  Megaphone,
  Search,
  Activity,
  Receipt,
  MapPin,
  Sparkles,
  CircleDot,
  LifeBuoy,
} from "lucide-react";
import { Link } from "wouter";
import { useWorkspace } from "@/lib/workspace-context";

type Trend = "up" | "down" | "neutral";

interface HeroStat {
  label: string;
  value: string;
  suffix?: string;
  icon: typeof FileText;
  bg: string;
  iconBg: string;
}

const heroStats: HeroStat[] = [
  { label: "Content Score", value: "92", suffix: "/100", icon: FileText, bg: "from-blue-600 to-blue-500", iconBg: "bg-white/20" },
  { label: "Keyword Rank Avg", value: "#6", icon: TrendingUp, bg: "from-emerald-600 to-emerald-500", iconBg: "bg-white/20" },
  { label: "Pipeline Value", value: "$34.2k", icon: Receipt, bg: "from-violet-600 to-violet-500", iconBg: "bg-white/20" },
  { label: "AI Interactions", value: "194", icon: Sparkles, bg: "from-amber-600 to-amber-500", iconBg: "bg-white/20" },
];

interface ModuleStat {
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  trend: Trend;
  icon: typeof FileText;
  color: string;
  module: string;
  href: string;
}

const moduleStats: ModuleStat[] = [
  { label: "Content Posts", value: "24", change: "+3", changeLabel: "this week", trend: "up", icon: FileText, color: "text-blue-500", module: "Content Engine", href: "content-engine?tab=posts" },
  { label: "Active Campaigns", value: "4", change: "+1", changeLabel: "new", trend: "up", icon: Megaphone, color: "text-indigo-500", module: "Campaigns", href: "content-engine?tab=campaigns" },
  { label: "Keywords Tracked", value: "142", change: "+12", changeLabel: "this month", trend: "up", icon: TrendingUp, color: "text-emerald-500", module: "Rank Tracker", href: "rank-tracker/track-keywords" },
  { label: "Grid Locations", value: "8", change: "3", changeLabel: "scanned today", trend: "neutral", icon: MapPin, color: "text-teal-500", module: "Local Grid", href: "rank-tracker/local-search-grid" },
  { label: "CRM Contacts", value: "63", change: "+5", changeLabel: "this week", trend: "up", icon: Users, color: "text-violet-500", module: "CRM", href: "crm/contacts" },
  { label: "Pipeline Deals", value: "12", change: "+2", changeLabel: "new deals", trend: "up", icon: Receipt, color: "text-purple-500", module: "Pipeline", href: "crm/pipeline" },
  { label: "Widget Chats", value: "38", change: "7", changeLabel: "last 7 days", trend: "neutral", icon: MessageSquare, color: "text-sky-500", module: "AI Widget", href: "widget/monitoring" },
  { label: "Calls Handled", value: "156", change: "+23", changeLabel: "this month", trend: "up", icon: PhoneCall, color: "text-cyan-500", module: "Twilio", href: "twilio/call-logs" },
  { label: "Knowledge Items", value: "18", change: "+2", changeLabel: "added", trend: "up", icon: Brain, color: "text-fuchsia-500", module: "AI Training", href: "ai-training/knowledge-base" },
  { label: "SEO Score", value: "87", change: "+4", changeLabel: "pts this month", trend: "up", icon: Search, color: "text-amber-500", module: "SEO Health", href: "content-engine?tab=health" },
];

interface ActivityItem {
  action: string;
  detail: string;
  time: string;
  icon: typeof FileText;
  iconColor: string;
}

const recentActivity: ActivityItem[] = [
  { action: "Blog post published", detail: "10 Best SEO Strategies for 2026", time: "2h ago", icon: FileText, iconColor: "text-blue-500" },
  { action: "Keyword rank improved", detail: "\"seo agency\" moved to #3", time: "5h ago", icon: TrendingUp, iconColor: "text-emerald-500" },
  { action: "CRM deal updated", detail: "Acme Corp moved to Negotiation", time: "8h ago", icon: Users, iconColor: "text-violet-500" },
  { action: "Widget chat completed", detail: "Customer pricing inquiry", time: "1d ago", icon: MessageSquare, iconColor: "text-sky-500" },
  { action: "Campaign generated", detail: "Q1 Content Blitz — 12 posts", time: "1d ago", icon: Megaphone, iconColor: "text-indigo-500" },
  { action: "AI call handled", detail: "Inbound call routed", time: "2d ago", icon: PhoneCall, iconColor: "text-cyan-500" },
];

interface HealthItem {
  label: string;
  value: number;
  color: string;
}

const healthMetrics: HealthItem[] = [
  { label: "On-page SEO", value: 92, color: "bg-emerald-500" },
  { label: "Content Quality", value: 87, color: "bg-blue-500" },
  { label: "Link Health", value: 78, color: "bg-amber-500" },
  { label: "CMS Sync", value: 100, color: "bg-violet-500" },
  { label: "Schema Markup", value: 65, color: "bg-rose-500" },
];

function MiniRing({ value, size = 48, strokeWidth = 4, color }: { value: number; size?: number; strokeWidth?: number; color: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={color}
      />
    </svg>
  );
}

export default function Today() {
  const { selectedWorkspace } = useWorkspace();
  const workspaceName = selectedWorkspace?.name || "Your Workspace";

  return (
    <ClientLayout>
      <div className="-m-6 p-4 min-h-[calc(100vh-3rem)] flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-semibold tracking-tight" data-testid="text-page-title">
              {workspaceName}
            </h1>
            <p className="text-xs text-muted-foreground" data-testid="text-page-subtitle">
              Dashboard Overview
            </p>
          </div>
          <Badge variant="outline" className="gap-1.5" data-testid="badge-status">
            <CircleDot className="w-3 h-3 text-emerald-500" />
            All systems healthy
          </Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.bg} rounded-md text-white p-3.5`}
              data-testid={`card-hero-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div className={`p-1 rounded ${stat.iconBg}`}>
                  <stat.icon className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-medium text-white/80">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold tracking-tight leading-none">{stat.value}</span>
                {stat.suffix && <span className="text-xs text-white/60">{stat.suffix}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {moduleStats.map((stat) => {
            const path = selectedWorkspace ? `/${selectedWorkspace.id}/${stat.href}` : `/${stat.href}`;
            return (
              <Link key={stat.label} href={path}>
                <Card
                  className="hover-elevate cursor-pointer h-full"
                  data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <stat.icon className={`w-3 h-3 ${stat.color} shrink-0`} />
                      <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider truncate">
                        {stat.module}
                      </span>
                    </div>
                    <p className="text-lg font-bold tracking-tight leading-none" data-testid={`text-stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate" data-testid={`text-stat-label-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
                      {stat.label}
                    </p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {stat.trend === "up" && <ArrowUpRight className="w-2.5 h-2.5 text-emerald-500 shrink-0" />}
                      {stat.trend === "down" && <ArrowDownRight className="w-2.5 h-2.5 text-rose-500 shrink-0" />}
                      <span className={`text-[9px] font-medium truncate ${stat.trend === "up" ? "text-emerald-600 dark:text-emerald-400" : stat.trend === "down" ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
                        {stat.change} {stat.changeLabel}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
          <Card className="lg:col-span-5" data-testid="card-recent-activity">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-testid="text-recent-activity-title">
                  Recent Activity
                </h2>
                <Badge variant="secondary" data-testid="badge-activity-count">
                  {recentActivity.length}
                </Badge>
              </div>
              <div>
                {recentActivity.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 py-2 px-1.5 rounded-md hover-elevate"
                    data-testid={`activity-item-${index}`}
                  >
                    <div className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center shrink-0">
                      <item.icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium leading-tight" data-testid={`text-activity-action-${index}`}>
                        {item.action}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate" data-testid={`text-activity-detail-${index}`}>
                        {item.detail}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-4" data-testid="card-health-scores">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" data-testid="text-health-title">
                  Health Scores
                </h2>
                <div className="relative flex items-center justify-center">
                  <MiniRing value={87} size={36} strokeWidth={3} color="text-emerald-500" />
                  <span className="absolute text-[9px] font-bold">87</span>
                </div>
              </div>
              <div className="space-y-2.5">
                {healthMetrics.map((metric) => (
                  <div key={metric.label} data-testid={`health-metric-${metric.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[11px] font-medium">{metric.label}</span>
                      <span className="text-[11px] text-muted-foreground font-medium">{metric.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${metric.color} transition-all duration-500`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <Card className="h-full" data-testid="card-quick-actions">
              <CardContent className="p-4">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3" data-testid="text-quick-actions-title">
                  Quick Actions
                </h2>
                <div className="space-y-1.5">
                  {[
                    { label: "New Post", icon: FileText, href: "content-engine?tab=posts", color: "text-blue-500" },
                    { label: "Add Keyword", icon: Search, href: "rank-tracker/track-keywords", color: "text-emerald-500" },
                    { label: "View Pipeline", icon: BarChart3, href: "crm/pipeline", color: "text-violet-500" },
                    { label: "Analytics", icon: BarChart3, href: "analytics/overview", color: "text-amber-500" },
                    { label: "Support", icon: LifeBuoy, href: "support/tickets", color: "text-cyan-500" },
                  ].map((action) => {
                    const path = selectedWorkspace ? `/${selectedWorkspace.id}/${action.href}` : `/${action.href}`;
                    return (
                      <Link key={action.label} href={path}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start gap-2"
                          data-testid={`btn-quick-${action.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <action.icon className={`w-3.5 h-3.5 ${action.color}`} />
                          {action.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
