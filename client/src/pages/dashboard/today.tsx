import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
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
  ArrowRight,
  LifeBuoy,
  Clock,
  CheckCircle2,
  ExternalLink,
  Pencil,
  X,
  Plus,
  LayoutDashboard,
  Download,
  Palette,
  Wallet,
  ListChecks,
  Mic,
  MessageCircle,
  Sparkles,
  ImageIcon,
  CreditCard,
  Phone,
  Kanban,
  Contact,
  Cpu,
  BookOpen,
  Monitor,
  Activity,
  Code,
  HeartPulse,
  LinkIcon,
  RefreshCw,
  ClipboardList,
} from "lucide-react";
import { Link } from "wouter";
import { useWorkspace } from "@/lib/workspace-context";
import { useQuery } from "@tanstack/react-query";

function useWorkspaceStats(workspaceId: string | undefined) {
  const stats = useQuery<{ posts: number; published: number; drafts: number; contacts: number; invoices: number; keywords: number }>({
    queryKey: [`/api/workspaces/${workspaceId}/dashboard-stats`],
    enabled: !!workspaceId,
  });

  const d = stats.data;
  return {
    postCount: d?.posts ?? 0,
    publishedCount: d?.published ?? 0,
    draftCount: d?.drafts ?? 0,
    contactCount: d?.contacts ?? 0,
    invoiceCount: d?.invoices ?? 0,
    keywordCount: d?.keywords ?? 0,
    isLoading: stats.isLoading,
  };
}

const cardShadow = "shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06),0_1px_4px_-1px_rgba(0,0,0,0.04)]";
const cardHover = "hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),0_2px_8px_-2px_rgba(0,0,0,0.06)]";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, FileText, Megaphone, Globe, Kanban, Contact, PhoneCall, Activity, Code,
  BarChart3, TrendingUp, MapPin, Monitor, Download, Sparkles, ImageIcon, CreditCard, Phone,
  Mic, MessageCircle, Brain, Cpu, Users, Palette, Wallet, ListChecks, BookOpen, LifeBuoy,
  HeartPulse, LinkIcon, RefreshCw, ClipboardList, Search, Receipt, MessageSquare, ExternalLink,
};

interface QuickItem {
  label: string;
  icon: string;
  path: string;
}

const allAvailable: { group: string; items: QuickItem[] }[] = [
  {
    group: "Build",
    items: [
      { label: "Content Engine", icon: "FileText", path: "content-engine" },
      { label: "pSEO Engine", icon: "Megaphone", path: "pseo/campaigns" },
      { label: "Website Engine", icon: "Globe", path: "website-engine" },
    ],
  },
  {
    group: "Engage",
    items: [
      { label: "Pipeline", icon: "Kanban", path: "crm/pipeline" },
      { label: "Contacts", icon: "Contact", path: "crm/contacts" },
      { label: "Calls", icon: "PhoneCall", path: "twilio/call-logs" },
      { label: "Website Widget (AI)", icon: "Activity", path: "widget/monitoring" },
      { label: "Widget Code Embed", icon: "Code", path: "widget/code" },
    ],
  },
  {
    group: "Track",
    items: [
      { label: "Analytics", icon: "BarChart3", path: "analytics/overview" },
      { label: "Track Keywords", icon: "TrendingUp", path: "rank-tracker/track-keywords" },
      { label: "Local Search Grid", icon: "MapPin", path: "rank-tracker/local-search-grid" },
      { label: "Search Console", icon: "Monitor", path: "rank-tracker/google-search-console" },
      { label: "Export Data", icon: "Download", path: "analytics/export" },
    ],
  },
  {
    group: "Connect",
    items: [
      { label: "AI Providers", icon: "Sparkles", path: "connections/ai-providers" },
      { label: "Image Banks", icon: "ImageIcon", path: "connections/image-banks" },
      { label: "Payments", icon: "CreditCard", path: "connections/payments" },
      { label: "Twilio Account", icon: "Phone", path: "connections/twilio" },
      { label: "Voice Settings", icon: "Mic", path: "twilio/voice" },
      { label: "SMS Settings", icon: "MessageCircle", path: "twilio/sms" },
      { label: "Knowledge Base", icon: "Brain", path: "ai-training/knowledge-base" },
      { label: "Channels", icon: "Cpu", path: "ai-training/channels" },
    ],
  },
  {
    group: "Workspace",
    items: [
      { label: "Team & Invites", icon: "Users", path: "settings/team" },
      { label: "White Label", icon: "Palette", path: "settings/white-label" },
      { label: "Billing & Usage", icon: "Wallet", path: "settings/billing" },
      { label: "Setup Guide", icon: "ListChecks", path: "settings/setup-guide" },
    ],
  },
  {
    group: "Support",
    items: [
      { label: "Documentation", icon: "BookOpen", path: "support/documentation" },
      { label: "Support Tickets", icon: "LifeBuoy", path: "support/tickets" },
    ],
  },
];

const defaultShortcuts: QuickItem[] = [
  { label: "Content Engine", icon: "FileText", path: "content-engine" },
  { label: "Track Keywords", icon: "TrendingUp", path: "rank-tracker/track-keywords" },
  { label: "Pipeline", icon: "Kanban", path: "crm/pipeline" },
  { label: "Website Widget (AI)", icon: "Activity", path: "widget/monitoring" },
  { label: "Analytics", icon: "BarChart3", path: "analytics/overview" },
  { label: "Calls", icon: "PhoneCall", path: "twilio/call-logs" },
  { label: "Knowledge Base", icon: "Brain", path: "ai-training/knowledge-base" },
  { label: "Search Console", icon: "Monitor", path: "rank-tracker/google-search-console" },
  { label: "Payments", icon: "CreditCard", path: "connections/payments" },
  { label: "Twilio Account", icon: "Phone", path: "connections/twilio" },
  { label: "Documentation", icon: "BookOpen", path: "support/documentation" },
  { label: "Contacts", icon: "Contact", path: "crm/contacts" },
  { label: "Support Tickets", icon: "LifeBuoy", path: "support/tickets" },
  { label: "Local Search Grid", icon: "MapPin", path: "rank-tracker/local-search-grid" },
  { label: "SMS Settings", icon: "MessageCircle", path: "twilio/sms" },
  { label: "Widget Code Embed", icon: "Code", path: "widget/code" },
];

const shortcutColors: Record<string, { bg: string; icon: string }> = {
  "content-engine": { bg: "bg-sky-500/[0.04] dark:bg-sky-400/[0.05]", icon: "text-sky-500/40 dark:text-sky-400/40" },
  "rank-tracker/track-keywords": { bg: "bg-teal-500/[0.04] dark:bg-teal-400/[0.05]", icon: "text-teal-500/40 dark:text-teal-400/40" },
  "crm/pipeline": { bg: "bg-amber-500/[0.04] dark:bg-amber-400/[0.05]", icon: "text-amber-500/40 dark:text-amber-400/40" },
  "widget/monitoring": { bg: "bg-purple-500/[0.04] dark:bg-purple-400/[0.05]", icon: "text-purple-500/40 dark:text-purple-400/40" },
  "analytics/overview": { bg: "bg-rose-500/[0.04] dark:bg-rose-400/[0.05]", icon: "text-rose-500/40 dark:text-rose-400/40" },
  "twilio/call-logs": { bg: "bg-sky-500/[0.04] dark:bg-sky-400/[0.05]", icon: "text-sky-500/40 dark:text-sky-400/40" },
  "ai-training/knowledge-base": { bg: "bg-teal-500/[0.04] dark:bg-teal-400/[0.05]", icon: "text-teal-500/40 dark:text-teal-400/40" },
  "rank-tracker/google-search-console": { bg: "bg-amber-500/[0.04] dark:bg-amber-400/[0.05]", icon: "text-amber-500/40 dark:text-amber-400/40" },
  "connections/payments": { bg: "bg-purple-500/[0.04] dark:bg-purple-400/[0.05]", icon: "text-purple-500/40 dark:text-purple-400/40" },
  "connections/twilio": { bg: "bg-rose-500/[0.04] dark:bg-rose-400/[0.05]", icon: "text-rose-500/40 dark:text-rose-400/40" },
  "support/documentation": { bg: "bg-sky-500/[0.03] dark:bg-sky-400/[0.04]", icon: "text-sky-500/40 dark:text-sky-400/40" },
  "crm/contacts": { bg: "bg-teal-500/[0.03] dark:bg-teal-400/[0.04]", icon: "text-teal-500/40 dark:text-teal-400/40" },
  "support/tickets": { bg: "bg-amber-500/[0.03] dark:bg-amber-400/[0.04]", icon: "text-amber-500/40 dark:text-amber-400/40" },
  "rank-tracker/local-search-grid": { bg: "bg-purple-500/[0.03] dark:bg-purple-400/[0.04]", icon: "text-purple-500/40 dark:text-purple-400/40" },
  "twilio/sms": { bg: "bg-rose-500/[0.03] dark:bg-rose-400/[0.04]", icon: "text-rose-500/40 dark:text-rose-400/40" },
  "widget/code": { bg: "bg-sky-500/[0.03] dark:bg-sky-400/[0.04]", icon: "text-sky-500/40 dark:text-sky-400/40" },
};

const defaultColor = { bg: "bg-sky-500/[0.03] dark:bg-sky-400/[0.04]", icon: "text-sky-500/40 dark:text-sky-400/40" };

const STORAGE_KEY = "indexflow_quick_access";
const STORAGE_VERSION = "2";

function loadShortcuts(): QuickItem[] {
  try {
    const ver = localStorage.getItem(STORAGE_KEY + "_v");
    if (ver === STORAGE_VERSION) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return defaultShortcuts;
}

function saveShortcuts(items: QuickItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  localStorage.setItem(STORAGE_KEY + "_v", STORAGE_VERSION);
}

function QuickIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || FileText;
  return <Icon className={className} />;
}

export default function Today() {
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id;
  const href = (path: string) => workspaceId ? `/${workspaceId}/${path}` : `/${path}`;
  const { postCount, publishedCount, draftCount, contactCount, invoiceCount, keywordCount, isLoading } = useWorkspaceStats(workspaceId);

  const [shortcuts, setShortcuts] = useState<QuickItem[]>(loadShortcuts);
  const [editing, setEditing] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const removeShortcut = useCallback((path: string) => {
    setShortcuts(prev => {
      const next = prev.filter(s => s.path !== path);
      saveShortcuts(next);
      return next;
    });
  }, []);

  const addShortcut = useCallback((item: QuickItem) => {
    setShortcuts(prev => {
      if (prev.some(s => s.path === item.path)) return prev;
      const next = [...prev, item];
      saveShortcuts(next);
      return next;
    });
  }, []);

  const activePaths = new Set(shortcuts.map(s => s.path));

  const engines = [
    { name: "Content Engine", desc: "AI blog posts, pages, SEO", icon: FileText, path: "content-engine", stat: `${postCount} posts`, cta: "Create Post", ctaPath: "content-engine?new=1", accent: "from-sky-500/10 to-sky-400/5 dark:from-sky-500/15 dark:to-sky-400/10", iconBg: "bg-sky-500/15 dark:bg-sky-400/20", iconColor: "text-sky-600 dark:text-sky-300" },
    { name: "pSEO Engine", desc: "Programmatic landing pages", icon: Megaphone, path: "pseo/campaigns", stat: "Campaigns", cta: "New Campaign", ctaPath: "pseo/campaigns?new=1", accent: "from-teal-500/10 to-teal-400/5 dark:from-teal-500/15 dark:to-teal-400/10", iconBg: "bg-teal-500/15 dark:bg-teal-400/20", iconColor: "text-teal-600 dark:text-teal-300" },
    { name: "Website Engine", desc: "AI website builder", icon: Globe, path: "website-engine", stat: "Projects", cta: "New Project", ctaPath: "website-engine?new=1", accent: "from-amber-500/10 to-amber-400/5 dark:from-amber-500/15 dark:to-amber-400/10", iconBg: "bg-amber-500/15 dark:bg-amber-400/20", iconColor: "text-amber-600 dark:text-amber-300" },
  ];

  const kpis = [
    { label: "Published", value: publishedCount, icon: CheckCircle2, color: "text-teal-500 dark:text-teal-400" },
    { label: "Drafts", value: draftCount, icon: Clock, color: "text-amber-500 dark:text-amber-400" },
    { label: "Keywords", value: keywordCount, icon: TrendingUp, color: "text-sky-500 dark:text-sky-400" },
    { label: "Contacts", value: contactCount, icon: Users, color: "text-purple-500 dark:text-purple-400" },
    { label: "Invoices", value: invoiceCount, icon: Receipt, color: "text-rose-500 dark:text-rose-400" },
  ];


  return (
    <div className="-m-6 p-5 sm:p-6 min-h-[calc(100vh-3rem)] space-y-6 bg-gray-50/50 dark:bg-background">
      <h1 className="text-2xl font-semibold tracking-tight" data-testid="text-page-title">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {engines.map((e) => (
          <Card key={e.name} className={`group ${cardShadow} ${cardHover} transition-all duration-200 h-full border-0 bg-gradient-to-br ${e.accent}`} data-testid={`card-engine-${e.name.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardContent className="p-5">
              <Link href={href(e.path)}>
                <div className="cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-xl ${e.iconBg} flex items-center justify-center`}>
                      <e.icon className={`w-5 h-5 ${e.iconColor}`} />
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-1" />
                  </div>
                  <h3 className="text-base font-semibold mt-3">{e.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.desc}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">{isLoading ? "..." : e.stat}</p>
                </div>
              </Link>
              <Link href={href(e.ctaPath)}>
                <Button size="sm" className="mt-3 w-full" data-testid={`button-cta-${e.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  {e.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
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

      <div className="grid grid-cols-1 gap-4">
        <Card className={`${cardShadow} border-0 bg-white dark:bg-card`} data-testid="card-shortcuts">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Quick Access</h2>
              <div className="flex items-center gap-1">
                {editing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setAddOpen(!addOpen)}
                    data-testid="button-add-shortcut"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => { setEditing(!editing); setAddOpen(false); }}
                  data-testid="button-edit-shortcuts"
                >
                  {editing ? (
                    <>Done</>
                  ) : (
                    <><Pencil className="w-3.5 h-3.5 mr-1" />Edit</>
                  )}
                </Button>
              </div>
            </div>

            {addOpen && editing && (
              <div className="mb-4 border border-border rounded-xl p-4 bg-gray-50/50 dark:bg-muted/20" data-testid="panel-add-shortcuts">
                <p className="text-xs font-medium text-muted-foreground mb-3">Add from sidebar</p>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {allAvailable.map((group) => {
                    const available = group.items.filter(i => !activePaths.has(i.path));
                    if (available.length === 0) return null;
                    return (
                      <div key={group.group}>
                        <p className="text-[11px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1.5">{group.group}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {available.map((item) => (
                            <button
                              key={item.path}
                              onClick={() => addShortcut(item)}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-card border border-border hover:border-foreground/20 transition-colors"
                              data-testid={`button-add-${item.path.replace(/\//g, "-")}`}
                            >
                              <Plus className="w-3 h-3 text-muted-foreground" />
                              <QuickIcon name={item.icon} className="w-3.5 h-3.5 text-muted-foreground" />
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {shortcuts.map((s) => (
                <div key={s.path} className="relative">
                  {editing && (
                    <button
                      onClick={() => removeShortcut(s.path)}
                      className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      data-testid={`button-remove-${s.path.replace(/\//g, "-")}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {(() => {
                    const c = shortcutColors[s.path] || defaultColor;
                    return editing ? (
                      <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${c.bg} shadow-[0_1px_6px_-1px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] dark:ring-white/[0.06]`} data-testid={`shortcut-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                        <QuickIcon name={s.icon} className={`w-4 h-4 ${c.icon} shrink-0`} />
                        <span className="text-sm truncate">{s.label}</span>
                      </div>
                    ) : (
                      <Link href={href(s.path)}>
                        <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl ${c.bg} shadow-[0_1px_6px_-1px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] dark:ring-white/[0.06] hover:shadow-[0_2px_10px_-2px_rgba(0,0,0,0.12)] transition-all cursor-pointer`} data-testid={`shortcut-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                          <QuickIcon name={s.icon} className={`w-4 h-4 ${c.icon} shrink-0`} />
                          <span className="text-sm truncate">{s.label}</span>
                        </div>
                      </Link>
                    );
                  })()}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
