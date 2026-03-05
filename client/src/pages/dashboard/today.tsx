import { Card, CardContent } from "@/components/ui/card";
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
  Receipt,
  ArrowUpRight,
  ArrowRight,
  LifeBuoy,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { Link } from "wouter";
import { useWorkspace } from "@/lib/workspace-context";
import { useQuery } from "@tanstack/react-query";

function useWorkspaceStats(workspaceId: string | undefined) {
  const posts = useQuery({ queryKey: ["/api/blog-posts", { workspaceId }], enabled: !!workspaceId });
  const contacts = useQuery({ queryKey: ["/api/contact-messages", { workspaceId }], enabled: !!workspaceId });
  const invoices = useQuery({ queryKey: ["/api/invoices", { workspaceId }], enabled: !!workspaceId });
  const keywords = useQuery({ queryKey: ["/api/rank-keywords", { workspaceId }], enabled: !!workspaceId });

  const postCount = Array.isArray(posts.data) ? posts.data.length : 0;
  const publishedCount = Array.isArray(posts.data) ? posts.data.filter((p: any) => p.status === "published").length : 0;
  const draftCount = Array.isArray(posts.data) ? posts.data.filter((p: any) => p.status === "draft").length : 0;
  const contactCount = Array.isArray(contacts.data) ? contacts.data.length : 0;
  const invoiceCount = Array.isArray(invoices.data) ? invoices.data.length : 0;
  const keywordCount = Array.isArray(keywords.data) ? keywords.data.length : 0;

  return { postCount, publishedCount, draftCount, contactCount, invoiceCount, keywordCount, isLoading: posts.isLoading };
}

const cardShadow = "shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06),0_1px_4px_-1px_rgba(0,0,0,0.04)]";
const cardHover = "hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),0_2px_8px_-2px_rgba(0,0,0,0.06)]";

export default function Today() {
  const { selectedWorkspace } = useWorkspace();
  const workspaceName = selectedWorkspace?.name || "Your Workspace";
  const workspaceId = selectedWorkspace?.id;
  const href = (path: string) => workspaceId ? `/${workspaceId}/${path}` : `/${path}`;
  const { postCount, publishedCount, draftCount, contactCount, invoiceCount, keywordCount, isLoading } = useWorkspaceStats(workspaceId);

  const engines = [
    { name: "Content Engine", desc: "AI blog posts, pages, SEO", icon: FileText, path: "content-engine", stat: `${postCount} posts`, accent: "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20", iconBg: "bg-amber-100 dark:bg-amber-900/40", iconColor: "text-amber-600 dark:text-amber-400" },
    { name: "pSEO Engine", desc: "Programmatic landing pages", icon: Megaphone, path: "pseo/campaigns", stat: "Campaigns", accent: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20", iconBg: "bg-sky-100 dark:bg-sky-900/40", iconColor: "text-sky-600 dark:text-sky-400" },
    { name: "Website Engine", desc: "AI website builder", icon: Globe, path: "website-engine", stat: "Projects", accent: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20", iconBg: "bg-violet-100 dark:bg-violet-900/40", iconColor: "text-violet-600 dark:text-violet-400" },
  ];

  const kpis = [
    { label: "Published", value: publishedCount, icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Drafts", value: draftCount, icon: Clock, color: "text-amber-500" },
    { label: "Keywords", value: keywordCount, icon: TrendingUp, color: "text-sky-500" },
    { label: "Contacts", value: contactCount, icon: Users, color: "text-violet-500" },
    { label: "Invoices", value: invoiceCount, icon: Receipt, color: "text-rose-400" },
  ];

  const shortcuts = [
    { label: "Content Engine", icon: FileText, path: "content-engine" },
    { label: "Track Keywords", icon: TrendingUp, path: "rank-tracker/track-keywords" },
    { label: "CRM Pipeline", icon: BarChart3, path: "crm/pipeline" },
    { label: "Local Grid", icon: MapPin, path: "rank-tracker/local-search-grid" },
    { label: "AI Widget", icon: MessageSquare, path: "widget/monitoring" },
    { label: "Analytics", icon: BarChart3, path: "analytics/overview" },
    { label: "Call Logs", icon: PhoneCall, path: "twilio/call-logs" },
    { label: "Knowledge Base", icon: Brain, path: "ai-training/knowledge-base" },
  ];

  const setupSteps = [
    { label: "Connect an AI provider", done: false, path: "connections/ai-providers" },
    { label: "Create your first post", done: postCount > 0, path: "content-engine" },
    { label: "Add keywords to track", done: keywordCount > 0, path: "rank-tracker/track-keywords" },
    { label: "Set up white label", done: false, path: "settings/white-label" },
    { label: "Invite your team", done: false, path: "settings/team" },
  ];

  const completedSteps = setupSteps.filter(s => s.done).length;

  return (
    <div className="-m-6 p-5 sm:p-6 min-h-[calc(100vh-3rem)] space-y-6 bg-gray-50/50 dark:bg-background">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-page-title">{workspaceName}</h1>
        <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-page-subtitle">
          Here's what's happening across your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {engines.map((e) => (
          <Link key={e.name} href={href(e.path)}>
            <Card className={`group ${cardShadow} ${cardHover} transition-all duration-200 cursor-pointer h-full border-0 bg-gradient-to-br ${e.accent}`} data-testid={`card-engine-${e.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl ${e.iconBg} flex items-center justify-center`}>
                    <e.icon className={`w-5 h-5 ${e.iconColor}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-1" />
                </div>
                <h3 className="text-base font-semibold mt-3">{e.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">{isLoading ? "..." : e.stat}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} className={`${cardShadow} border-0 bg-white dark:bg-card`} data-testid={`card-kpi-${k.label.toLowerCase()}`}>
            <CardContent className="p-4 text-center">
              <k.icon className={`w-4 h-4 ${k.color} mx-auto mb-1.5`} />
              <p className="text-2xl font-semibold tracking-tight">{isLoading ? "–" : k.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className={`lg:col-span-8 ${cardShadow} border-0 bg-white dark:bg-card`} data-testid="card-shortcuts">
          <CardContent className="p-5">
            <h2 className="text-sm font-semibold mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {shortcuts.map((s) => (
                <Link key={s.label} href={href(s.path)}>
                  <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-muted/30 hover:bg-gray-100 dark:hover:bg-muted/50 transition-colors cursor-pointer shadow-sm`} data-testid={`shortcut-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <s.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{s.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`lg:col-span-4 ${cardShadow} border-0 bg-white dark:bg-card`} data-testid="card-setup">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Setup Progress</h2>
              <span className="text-xs text-muted-foreground font-medium">{completedSteps}/{setupSteps.length}</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-muted overflow-hidden mb-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 dark:from-amber-500 dark:to-yellow-400 transition-all duration-500"
                style={{ width: `${(completedSteps / setupSteps.length) * 100}%` }}
              />
            </div>
            <div className="space-y-1">
              {setupSteps.map((step) => (
                <Link key={step.label} href={href(step.path)}>
                  <div className="flex items-center gap-2.5 py-2 px-2 rounded-lg cursor-pointer group hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors" data-testid={`setup-${step.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 dark:border-muted-foreground/30 shrink-0" />
                    )}
                    <span className={`text-sm ${step.done ? "text-muted-foreground line-through" : ""}`}>{step.label}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
