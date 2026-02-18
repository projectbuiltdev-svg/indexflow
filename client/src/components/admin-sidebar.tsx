import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  Handshake,
  Users,
  CreditCard,
  Globe,
  FileEdit,
  Settings as SettingsIcon,
  Phone,
  PhoneCall,
  PenTool,
  TrendingUp,
  LifeBuoy,
  BarChart3,
  Download,
  Bell,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import indexFlowLogo from "@assets/image_1771351451425.png";

interface NavItem {
  title: string;
  icon: React.ComponentType<any>;
  path: string;
}

const navItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Clients", icon: Building2, path: "/admin/agencies" },
  { title: "CRM", icon: Handshake, path: "/admin/crm" },
  { title: "Users", icon: Users, path: "/admin/users/all" },
  { title: "Billing", icon: CreditCard, path: "/admin/billing/subscriptions" },
  { title: "Websites", icon: Globe, path: "/admin/websites" },
  { title: "Website Changes", icon: FileEdit, path: "/admin/website-changes" },
  { title: "Widget Config", icon: SettingsIcon, path: "/admin/widget-config" },
  { title: "Twilio", icon: Phone, path: "/admin/system/twilio" },
  { title: "Call Logs", icon: PhoneCall, path: "/admin/support/call-logs" },
  { title: "Content Engine", icon: PenTool, path: "/admin/content/posts" },
  { title: "SEO & Rankings", icon: TrendingUp, path: "/admin/platform-seo/keywords" },
  { title: "Support Tickets", icon: LifeBuoy, path: "/admin/support/tickets" },
  { title: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { title: "Export Data", icon: Download, path: "/admin/export-data" },
  { title: "Notifications", icon: Bell, path: "/admin/support/announcements" },
  { title: "Settings", icon: Settings, path: "/admin/settings/config" },
];

export function AdminSidebar() {
  const [location] = useLocation();

  const isItemActive = (path: string) => {
    if (path === "/admin") return location === "/admin";
    return location === path || location.startsWith(path + "/");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-3 py-3">
          <img src={indexFlowLogo} alt="indexFlow" className="h-7" data-testid="img-admin-logo" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={isItemActive(item.path)}
                tooltip={item.title}
                data-testid={`link-admin-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Link href={item.path}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
