import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import indexFlowLogo from "@assets/image_1771351451425.webp";
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
  Settings,
} from "lucide-react";

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
    label: "Home",
    items: [
      { title: "Dashboard Overview", path: "/today", icon: LayoutDashboard },
    ],
  },
  {
    label: "Build",
    items: [
      { title: "Content Engine", path: "/content-engine", icon: FileText },
      { title: "pSEO Engine", path: "/pseo/campaigns", icon: Megaphone },
      { title: "Website Engine", path: "/website-engine", icon: Globe },
    ],
  },
  {
    label: "Engage",
    collapsible: true,
    items: [
      { title: "Pipeline", path: "/crm/pipeline", icon: Kanban },
      { title: "Contacts", path: "/crm/contacts", icon: Contact },
      { title: "Calls", path: "/twilio/call-logs", icon: PhoneCall },
      { title: "Website Widget (AI)", path: "/widget/monitoring", icon: Activity },
      { title: "Widget Code Embed", path: "/widget/code", icon: Code },
    ],
  },
  {
    label: "Track",
    collapsible: true,
    items: [
      { title: "Analytics", path: "/analytics/overview", icon: BarChart3 },
      { title: "Track Keywords", path: "/rank-tracker/track-keywords", icon: TrendingUp },
      { title: "Local Search Grid", path: "/rank-tracker/local-search-grid", icon: MapPin },
      { title: "Search Console", path: "/rank-tracker/google-search-console", icon: Monitor },
      { title: "Export Data", path: "/analytics/export", icon: Download },
    ],
  },
  {
    label: "Connect",
    collapsible: true,
    items: [
      { title: "AI Providers", path: "/connections/ai-providers", icon: Sparkles },
      { title: "Image Banks", path: "/connections/image-banks", icon: ImageIcon },
      { title: "Payments", path: "/connections/payments", icon: CreditCard },
      { title: "Twilio Account", path: "/connections/twilio", icon: Phone },
      { title: "Voice Settings", path: "/twilio/voice", icon: Mic },
      { title: "SMS Settings", path: "/twilio/sms", icon: MessageCircle },
      { title: "Knowledge Base", path: "/ai-training/knowledge-base", icon: Brain },
      { title: "Channels", path: "/ai-training/channels", icon: Cpu },
    ],
  },
  {
    label: "Workspace",
    collapsible: true,
    items: [
      { title: "Team & Invites", path: "/settings/team", icon: Users },
      { title: "White Label", path: "/settings/white-label", icon: Palette },
      { title: "Billing & Usage", path: "/settings/billing", icon: Wallet },
      { title: "Setup Guide", path: "/settings/setup-guide", icon: ListChecks },
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
    <div
      className="flex flex-col h-full w-56 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0"
      data-testid="client-sidebar"
    >
      <div className="px-3 pt-3 pb-1">
        <img src={indexFlowLogo} alt="indexFlow" className="w-full object-contain" data-testid="img-client-logo" />
      </div>

      <div className="px-2 pb-1">
        <Collapsible defaultOpen className="group/workspace">
          <CollapsibleTrigger className="flex w-full items-center gap-1 px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70 cursor-pointer" data-testid="trigger-workspace">
            <Globe className="h-3.5 w-3.5 mr-1" />
            <span>Workspace</span>
            <ChevronDown className="ml-auto h-3 w-3 transition-transform group-data-[state=open]/workspace:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-1 pb-1">
              <Select
                value={selectedWorkspace?.id ?? ""}
                onValueChange={(val) => {
                  const workspace = workspaces.find((w) => w.id === val) ?? null;
                  selectWorkspace(workspace);
                }}
              >
                <SelectTrigger data-testid="select-workspace" className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground text-xs">
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {workspaces.map((workspace) => (
                    <SelectItem
                      key={workspace.id}
                      value={workspace.id}
                      data-testid={`select-workspace-option-${workspace.id}`}
                    >
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {navGroups.map((group) => (
          <div key={group.label} className="px-2">
            {group.collapsible ? (
              <Collapsible defaultOpen={true} className="group/collapsible">
                <CollapsibleTrigger
                  className="flex w-full items-center gap-1 px-2 py-1.5 text-sm font-medium text-sidebar-foreground cursor-pointer"
                  data-testid={`trigger-${group.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {group.label === "Engage" && <MessageCircle className="h-4 w-4 shrink-0 mr-1" />}
                  {group.label === "Track" && <BarChart3 className="h-4 w-4 shrink-0 mr-1" />}
                  {group.label === "Connect" && <Sparkles className="h-4 w-4 shrink-0 mr-1" />}
                  {group.label === "Workspace" && <Settings className="h-4 w-4 shrink-0 mr-1" />}
                  {group.label}
                  <ChevronDown className="ml-auto h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <Link key={item.path + item.title} href={`${base}${item.path}`}>
                          <div
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                              active
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "hover-elevate"
                            }`}
                            data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.title}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path + item.title} href={`${base}${item.path}`}>
                      <div
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "hover-elevate"
                        }`}
                        data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-2 pb-2 mt-auto">
        <div className="flex flex-col gap-0.5">
          {bottomItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path + item.title} href={`${base}${item.path}`}>
                <div
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover-elevate"
                  }`}
                  data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </div>
              </Link>
            );
          })}

          <div
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer hover-elevate"
            onClick={() => setIsDark(!isDark)}
            data-testid="button-client-theme-toggle"
          >
            {isDark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
            <span>Theme</span>
          </div>

          <div
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer text-red-400 hover-elevate"
            onClick={handleSignOut}
            data-testid="button-client-sign-out"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </div>
        </div>
      </div>
    </div>
  );
}
