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

export default function Today() {
  const { selectedWorkspace } = useWorkspace();
  const workspaceName = selectedWorkspace?.name || "Your Workspace";
  const workspaceId = selectedWorkspace?.id;
  const href = (path: string) => workspaceId ? `/${workspaceId}/${path}` : `/${path}`;
  const { postCount, publishedCount, draftCount, contactCount, invoiceCount, keywordCount, isLoading } = useWorkspaceStats(workspaceId);

  const engines = [
    { name: "Content Engine", desc: "AI blog posts, pages, SEO", icon: FileText, path: "content-engine", stat: `${postCount} posts` },
    { name: "pSEO Engine", desc: "Programmatic landing pages", icon: Megaphone, path: "pseo/campaigns", stat: "Campaigns" },
    { name: "Website Engine", desc: "AI website builder", icon: Globe, path: "website-engine", stat: "Projects" },
  ];

  const kpis = [
    { label: "Published", value: publishedCount, icon: CheckCircle2 },
    { label: "Drafts", value: draftCount, icon: Clock },
    { label: "Keywords", value: keywordCount, icon: TrendingUp },
    { label: "Contacts", value: contactCount, icon: Users },
    { label: "Invoices", value: invoiceCount, icon: Receipt },
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
    <div className="-m-6 p-5 sm:p-6 min-h-[calc(100vh-3rem)] space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-page-title">{workspaceName}</h1>
        <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-page-subtitle">
          Here's what's happening across your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {engines.map((e) => (
          <Link key={e.name} href={href(e.path)}>
            <Card className="group hover:border-foreground/20 transition-all cursor-pointer h-full" data-testid={`card-engine-${e.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <e.icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </div>
                <h3 className="text-base font-medium mt-3">{e.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">{isLoading ? "..." : e.stat}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3">
        {kpis.map((k) => (
          <Card key={k.label} data-testid={`card-kpi-${k.label.toLowerCase()}`}>
            <CardContent className="p-4 text-center">
              <k.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-2xl font-semibold tracking-tight">{isLoading ? "–" : k.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-8" data-testid="card-shortcuts">
          <CardContent className="p-5">
            <h2 className="text-sm font-medium mb-4">Quick Access</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {shortcuts.map((s) => (
                <Link key={s.label} href={href(s.path)}>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer" data-testid={`shortcut-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <s.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{s.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4" data-testid="card-setup">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium">Setup Progress</h2>
              <span className="text-xs text-muted-foreground">{completedSteps}/{setupSteps.length}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-4">
              <div
                className="h-full rounded-full bg-foreground/50 transition-all duration-500"
                style={{ width: `${(completedSteps / setupSteps.length) * 100}%` }}
              />
            </div>
            <div className="space-y-2">
              {setupSteps.map((step) => (
                <Link key={step.label} href={href(step.path)}>
                  <div className="flex items-center gap-2.5 py-1.5 cursor-pointer group" data-testid={`setup-${step.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border shrink-0" />
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
