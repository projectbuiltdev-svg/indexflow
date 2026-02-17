import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Globe,
  FileEdit,
  MessageSquare,
  Phone,
  PhoneCall,
  FileText,
  Search,
  LifeBuoy,
  BarChart3,
  Download,
  Bell,
  Settings,
  Puzzle,
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
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Clients", url: "/admin/clients", icon: Building2 },
  { title: "CRM", url: "/admin/crm", icon: MessageSquare },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Billing", url: "/admin/billing", icon: CreditCard },
  { title: "Websites", url: "/admin/websites", icon: Globe },
  { title: "Website Changes", url: "/admin/website-changes", icon: FileEdit },
  { title: "Widget Config", url: "/admin/widget-config", icon: Puzzle },
  { title: "Twilio", url: "/admin/twilio", icon: Phone },
  { title: "Call Logs", url: "/admin/call-logs", icon: PhoneCall },
  { title: "Content Engine", url: "/admin/content", icon: FileText },
  { title: "SEO & Rankings", url: "/admin/seo", icon: Search },
  { title: "Support Tickets", url: "/admin/support", icon: LifeBuoy },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Export Data", url: "/admin/export", icon: Download },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-sm" data-testid="text-admin-title">Super Admin</span>
          <span className="text-xs text-muted-foreground" data-testid="text-admin-email">admin@resto.restaurant</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.url === "/admin"
                    ? location === "/admin"
                    : location.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.url} data-testid={`link-admin-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
