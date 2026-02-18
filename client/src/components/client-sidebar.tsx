import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  ImageIcon,
  RefreshCw,
  TrendingUp,
  MapPin,
  Search,
  Code2,
  Link as LinkIcon,
  Globe,
  Monitor,
  Kanban,
  Contact,
  BarChart3,
  MessageSquare,
  Brain,
  Code,
  Settings,
  Users,
  Key,
  Phone,
  CreditCard,
  Coins,
  BookOpen,
  LifeBuoy,
  ChevronDown,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/lib/workspace-context";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  prefix: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    prefix: "/today",
    items: [
      { title: "Dashboard", path: "/today", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    prefix: "/content",
    items: [
      { title: "Posts", path: "/content/posts", icon: FileText },
      { title: "Campaigns", path: "/content/campaigns", icon: Megaphone },
      { title: "Media Library", path: "/content/domains", icon: ImageIcon },
      { title: "CMS Sync", path: "/seo/cms", icon: RefreshCw },
    ],
  },
  {
    label: "SEO",
    prefix: "/seo",
    items: [
      { title: "Rank Tracker", path: "/rank-tracker/track-keywords", icon: TrendingUp },
      { title: "Local Search Grid", path: "/rank-tracker/local-search-grid", icon: MapPin },
      { title: "Site Audit", path: "/seo/health", icon: Search },
      { title: "Schema Markup", path: "/seo/links", icon: Code2 },
      { title: "Link Builder", path: "/seo/reports", icon: LinkIcon },
      { title: "Site Profile", path: "/content/pages", icon: Globe },
      { title: "Search Console", path: "/rank-tracker/google-search-console", icon: Monitor },
    ],
  },
  {
    label: "CRM",
    prefix: "/crm",
    items: [
      { title: "Pipeline", path: "/crm/pipeline", icon: Kanban },
      { title: "Contacts", path: "/crm/contacts", icon: Contact },
    ],
  },
  {
    label: "Business",
    prefix: "/business",
    items: [
      { title: "Invoices", path: "/seo/invoices", icon: FileText },
      { title: "Reports", path: "/analytics/overview", icon: BarChart3 },
    ],
  },
  {
    label: "Widget",
    prefix: "/widget",
    items: [
      { title: "Chat Widget", path: "/widget/monitoring", icon: MessageSquare },
      { title: "Training Data", path: "/ai-training/knowledge-base", icon: Brain },
      { title: "Embed Code", path: "/widget/code", icon: Code },
    ],
  },
  {
    label: "Settings",
    prefix: "/settings",
    items: [
      { title: "General", path: "/settings/white-label", icon: Settings },
      { title: "Team", path: "/settings/team", icon: Users },
      { title: "API Keys (BYOK)", path: "/connections/ai-providers", icon: Key },
      { title: "Twilio", path: "/connections/twilio", icon: Phone },
      { title: "Payments", path: "/connections/payments", icon: CreditCard },
      { title: "Credits", path: "/settings/billing", icon: Coins },
    ],
  },
  {
    label: "Help",
    prefix: "/support",
    items: [
      { title: "Documentation", path: "/support/documentation", icon: BookOpen },
      { title: "Support", path: "/support/tickets", icon: LifeBuoy },
    ],
  },
];

export function ClientSidebar() {
  const [location] = useLocation();
  const { workspaces, selectedWorkspace, selectWorkspace } = useWorkspace();

  const base = selectedWorkspace ? `/${selectedWorkspace.id}` : "";

  const isActive = (path: string) => {
    const fullPath = `${base}${path}`;
    if (path.endsWith("/today")) return location === fullPath;
    return location.startsWith(fullPath);
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => isActive(item.path));
  };

  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem("indexflow_theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("dark");
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("indexflow_theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <span className="text-sm font-semibold truncate" data-testid="text-client-title">
            {selectedWorkspace?.name ?? "indexFlow"}
          </span>
        </div>
        <Select
          value={selectedWorkspace?.id ?? ""}
          onValueChange={(val) => {
            const workspace = workspaces.find((w) => w.id === val) ?? null;
            selectWorkspace(workspace);
          }}
        >
          <SelectTrigger data-testid="select-workspace" className="w-full bg-sidebar border-sidebar-border text-sidebar-foreground text-xs h-8">
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
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <Collapsible defaultOpen={isGroupActive(group)} className="group/collapsible">
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="cursor-pointer" data-testid={`group-${group.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  {group.label}
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.path)}
                          tooltip={item.title}
                          data-testid={`link-${item.path.split("/").filter(Boolean).join("-")}`}
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
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <Separator className="bg-sidebar-border" />
        <div className="flex items-center gap-2 px-1 py-1">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
              {selectedWorkspace?.name?.charAt(0)?.toUpperCase() ?? "W"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium truncate text-sidebar-foreground" data-testid="text-footer-workspace">
              {selectedWorkspace?.name ?? "Workspace"}
            </span>
            <span className="text-[10px] text-sidebar-foreground/60" data-testid="text-footer-role">
              Owner
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 justify-between flex-wrap">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsDark(!isDark)}
            className="text-sidebar-foreground"
            data-testid="button-theme-toggle"
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-sidebar-foreground"
            data-testid="button-logout"
          >
            <LogOut />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
