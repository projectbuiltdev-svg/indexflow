import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import indexFlowLogo from "@assets/image_1771351451425.png";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard,
  PhoneCall,
  BarChart3,
  Download,
  Users,
  Palette,
  Wallet,
  ListChecks,
  Mic,
  MessageCircle,
  Sparkles,
  ImageIcon,
  CreditCard,
  Phone,
  FileText,
  File,
  Megaphone,
  Globe,
  HeartPulse,
  LinkIcon,
  RefreshCw,
  ClipboardList,
  Receipt,
  TrendingUp,
  MapPin,
  Monitor,
  Activity,
  Code,
  Kanban,
  Contact,
  Brain,
  Cpu,
  BookOpen,
  LifeBuoy,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  collapsible?: boolean;
}

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard Overview", path: "/today", icon: LayoutDashboard },
      { title: "Calls", path: "/twilio/call-logs", icon: PhoneCall },
      { title: "Analytics", path: "/analytics/overview", icon: BarChart3 },
      { title: "Export Data", path: "/analytics/export", icon: Download },
    ],
  },
  {
    label: "Settings",
    collapsible: true,
    items: [
      { title: "Team & Invites", path: "/settings/team", icon: Users },
      { title: "White Label", path: "/settings/white-label", icon: Palette },
      { title: "Billing & Usage", path: "/settings/billing", icon: Wallet },
      { title: "Setup Guide", path: "/settings/setup-guide", icon: ListChecks },
    ],
  },
  {
    label: "Twilio",
    collapsible: true,
    items: [
      { title: "Call Logs", path: "/twilio/call-logs", icon: PhoneCall },
      { title: "Voice Settings", path: "/twilio/voice", icon: Mic },
      { title: "SMS Settings", path: "/twilio/sms", icon: MessageCircle },
    ],
  },
  {
    label: "BYOK API",
    collapsible: true,
    items: [
      { title: "AI Providers", path: "/connections/ai-providers", icon: Sparkles },
      { title: "Image Banks", path: "/connections/image-banks", icon: ImageIcon },
      { title: "Payments", path: "/connections/payments", icon: CreditCard },
      { title: "Twilio Account", path: "/connections/twilio", icon: Phone },
    ],
  },
  {
    label: "Content Engine",
    collapsible: true,
    items: [
      { title: "Posts", path: "/content-engine?tab=posts", icon: FileText },
      { title: "Pages", path: "/content-engine?tab=pages", icon: File },
      { title: "Campaigns", path: "/content-engine?tab=campaigns", icon: Megaphone },
      { title: "Domains", path: "/content-engine?tab=domains", icon: Globe },
      { title: "SEO", path: "/content-engine?tab=seo", icon: HeartPulse },
      { title: "Links", path: "/content-engine?tab=links", icon: LinkIcon },
      { title: "Health", path: "/content-engine?tab=health", icon: HeartPulse },
      { title: "CMS", path: "/content-engine?tab=cms", icon: RefreshCw },
      { title: "Reports", path: "/content-engine?tab=reports", icon: ClipboardList },
      { title: "Invoices", path: "/content-engine?tab=invoices", icon: Receipt },
    ],
  },
  {
    label: "Rank Tracker",
    collapsible: true,
    items: [
      { title: "Track Keywords", path: "/rank-tracker/track-keywords", icon: TrendingUp },
      { title: "Local Search Grid", path: "/rank-tracker/local-search-grid", icon: MapPin },
      { title: "Search Console", path: "/rank-tracker/google-search-console", icon: Monitor },
    ],
  },
  {
    label: "Widget",
    collapsible: true,
    items: [
      { title: "Monitoring", path: "/widget/monitoring", icon: Activity },
      { title: "Widget Code", path: "/widget/code", icon: Code },
    ],
  },
  {
    label: "CRM",
    collapsible: true,
    items: [
      { title: "Pipeline", path: "/crm/pipeline", icon: Kanban },
      { title: "Contacts", path: "/crm/contacts", icon: Contact },
    ],
  },
  {
    label: "AI Training",
    collapsible: true,
    items: [
      { title: "Knowledge Base", path: "/ai-training/knowledge-base", icon: Brain },
      { title: "Channels", path: "/ai-training/channels", icon: Cpu },
    ],
  },
];

const bottomItems: NavItem[] = [
  { title: "Documentation", path: "/support/documentation", icon: BookOpen },
  { title: "Support", path: "/support/tickets", icon: LifeBuoy },
];

export function ClientSidebar() {
  const [location, navigate] = useLocation();
  const { workspaces, selectedWorkspace, selectWorkspace } = useWorkspace();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("indexflow_theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("indexflow_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const base = selectedWorkspace ? `/${selectedWorkspace.id}` : "";

  const isActive = (path: string) => {
    const pathOnly = path.split("?")[0];
    const fullPath = `${base}${pathOnly}`;
    const tabParam = path.includes("?tab=") ? path.split("?tab=")[1] : null;
    if (path === "/today") return location === fullPath;
    if (tabParam) {
      const currentSearch = typeof window !== "undefined" ? window.location.search : "";
      return location === fullPath && currentSearch === `?tab=${tabParam}`;
    }
    return location.startsWith(fullPath);
  };

  const handleSignOut = () => {
    localStorage.removeItem("indexflow_admin_session");
    localStorage.removeItem("indexflow_session");
    localStorage.removeItem("indexflow_workspace_id");
    navigate("/");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className="flex flex-col h-full w-16 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0 overflow-y-auto overflow-x-hidden"
        data-testid="client-sidebar"
      >
        <div className="flex items-center justify-center py-3">
          <img src={indexFlowLogo} alt="indexFlow" className="h-8" data-testid="img-client-logo" />
        </div>

        <div className="flex-1 flex flex-col gap-0.5 px-1.5">
          {navGroups.map((group) => (
            <div key={group.label}>
              {group.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <Tooltip key={item.path + item.title}>
                    <TooltipTrigger asChild>
                      <Link href={`${base}${item.path}`}>
                        <div
                          className={`flex items-center justify-center w-full h-9 rounded-md cursor-pointer transition-colors ${
                            active
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "hover-elevate"
                          }`}
                          data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <item.icon className="h-4 w-4" />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
              {group.label !== "AI Training" && (
                <div className="my-1 mx-2 border-t border-sidebar-border" />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-0.5 px-1.5 pb-1">
          <div className="my-1 mx-2 border-t border-sidebar-border" />
          {bottomItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Tooltip key={item.path + item.title}>
                <TooltipTrigger asChild>
                  <Link href={`${base}${item.path}`}>
                    <div
                      className={`flex items-center justify-center w-full h-9 rounded-md cursor-pointer transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover-elevate"
                      }`}
                      data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          })}

          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center justify-center w-full h-9 rounded-md cursor-pointer hover-elevate"
                onClick={() => setIsDark(!isDark)}
                data-testid="button-client-theme-toggle"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Theme
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center justify-center w-full h-9 rounded-md cursor-pointer text-red-400 hover-elevate"
                onClick={handleSignOut}
                data-testid="button-client-sign-out"
              >
                <LogOut className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Sign Out
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
