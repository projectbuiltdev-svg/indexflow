import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  File,
  PhoneCall,
  BarChart3,
  Download,
  Settings,
  Phone,
  ChevronDown,
  Brain,
  Cpu,
  ImageIcon,
  CreditCard,
  Sparkles,
  Globe,
  Code,
  BookOpen,
  LifeBuoy,
  FileText,
  Megaphone,
  LinkIcon,
  HeartPulse,
  RefreshCw,
  ClipboardList,
  Receipt,
  TrendingUp,
  MapPin,
  Monitor,
  Mic,
  MessageCircle,
  Activity,
  Kanban,
  Contact,
  Users,
  Palette,
  Wallet,
  ListChecks,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/lib/workspace-context";
import indexFlowLogo from "@assets/image_1771351451425.png";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
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

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => {
      const pathOnly = item.path.split("?")[0];
      const fullPath = `${base}${pathOnly}`;
      return location.startsWith(fullPath);
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem("indexflow_admin_session");
    localStorage.removeItem("indexflow_session");
    localStorage.removeItem("indexflow_workspace_id");
    navigate("/");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-3 py-2">
          <img src={indexFlowLogo} alt="indexFlow" className="h-7" data-testid="img-client-logo" />
        </div>
        <div className="px-2 pb-1">
          <Collapsible defaultOpen className="group/workspace">
            <CollapsibleTrigger className="flex w-full items-center gap-1 px-2 py-1.5 text-sm text-sidebar-foreground cursor-pointer" data-testid="trigger-workspace">
              <Globe className="h-4 w-4 mr-1" />
              <span className="truncate">Workspace</span>
              <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform group-data-[state=open]/workspace:rotate-180" />
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
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-0">
            {group.collapsible ? (
              <Collapsible
                defaultOpen={isGroupActive(group)}
                className="group/collapsible"
              >
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger
                    className="flex w-full items-center gap-1 cursor-pointer"
                    data-testid={`trigger-${group.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {group.label}
                    <ChevronDown className="ml-auto h-3.5 w-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.path + item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(item.path)}
                            tooltip={item.title}
                            data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <Link href={`${base}${item.path}`}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.path + item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                        tooltip={item.title}
                        data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <Link href={`${base}${item.path}`}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}

        <SidebarGroup className="py-0 mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.path + item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Link href={`${base}${item.path}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-3 py-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsDark(!isDark)}
            className="text-sidebar-foreground"
            data-testid="button-client-theme-toggle"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <span className="text-xs text-sidebar-foreground">Theme</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSignOut}
            className="text-red-400"
            data-testid="button-client-sign-out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-red-400">Sign Out</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
