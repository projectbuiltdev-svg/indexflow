import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  BarChart3,
  Building2,
  Users,
  Palette,
  ToggleLeft,
  CreditCard,
  FileText,
  RefreshCw,
  PenTool,
  Megaphone,
  ImageIcon,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Code2,
  Link as LinkIcon,
  Globe,
  Kanban,
  Contact,
  Handshake,
  LifeBuoy,
  Bell,
  Settings,
  Terminal,
  ChevronDown,
  Zap,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  icon: React.ComponentType<any>;
  path: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
      { title: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    ],
  },
  {
    label: "Platform",
    items: [
      { title: "Workspaces", icon: Building2, path: "/admin/agencies" },
      { title: "Users", icon: Users, path: "/admin/users/all" },
      { title: "White Label", icon: Palette, path: "/admin/settings/branding" },
      { title: "Feature Flags", icon: ToggleLeft, path: "/admin/settings/config" },
    ],
  },
  {
    label: "Revenue",
    items: [
      { title: "Billing", icon: CreditCard, path: "/admin/billing/subscriptions" },
      { title: "Invoices", icon: FileText, path: "/admin/billing/invoices" },
      { title: "Subscriptions", icon: RefreshCw, path: "/admin/billing/revenue" },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Content Engine", icon: PenTool, path: "/admin/content/posts" },
      { title: "Campaigns", icon: Megaphone, path: "/admin/content/campaigns" },
      { title: "Image Pipeline", icon: ImageIcon, path: "/admin/content/moderation" },
      { title: "Quality Gates", icon: ShieldCheck, path: "/admin/platform-seo/keywords" },
    ],
  },
  {
    label: "SEO",
    items: [
      { title: "Rank Tracker", icon: TrendingUp, path: "/admin/platform-seo/api-usage" },
      { title: "Local Grid", icon: MapPin, path: "/admin/support/call-logs" },
      { title: "Schema Markup", icon: Code2, path: "/admin/system/api-keys" },
      { title: "Link Builder", icon: LinkIcon, path: "/admin/system/email" },
      { title: "Site Profiles", icon: Globe, path: "/admin/system/infrastructure" },
    ],
  },
  {
    label: "CRM",
    items: [
      { title: "Pipeline", icon: Kanban, path: "/admin/billing/payouts" },
      { title: "Contacts", icon: Contact, path: "/admin/users/admins" },
      { title: "Deals", icon: Handshake, path: "/admin/agencies/pending" },
    ],
  },
  {
    label: "Support",
    items: [
      { title: "Tickets", icon: LifeBuoy, path: "/admin/support/tickets" },
      { title: "Announcements", icon: Bell, path: "/admin/support/announcements" },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", icon: Settings, path: "/admin/system/twilio" },
      { title: "API Logs", icon: Terminal, path: "/admin/billing/revenue" },
    ],
  },
];

export function AdminSidebar() {
  const [location] = useLocation();
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

  const isItemActive = (path: string) => {
    if (path === "/admin") return location === "/admin";
    return location === path || location.startsWith(path + "/");
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => isItemActive(item.path));
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Zap className="h-5 w-5 text-sidebar-primary" />
          <span className="text-base font-bold tracking-tight" data-testid="text-admin-title">
            IndexFlow
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-0">
            <Collapsible
              defaultOpen={isGroupActive(group) || group.label === "Overview"}
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
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          asChild
                          isActive={isItemActive(item.path)}
                          tooltip={item.title}
                          data-testid={`link-${item.path.replace(/\//g, "-").slice(1)}`}
                        >
                          <Link href={item.path}>
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
        <div className="flex items-center gap-2 px-2 py-1">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-sidebar-accent text-sidebar-accent-foreground">
              SA
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium truncate" data-testid="text-admin-user">
              Super Admin
            </span>
            <Badge variant="secondary" className="w-fit text-[10px] px-1.5 py-0">
              Admin
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsDark(!isDark)}
            data-testid="button-theme-toggle"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
