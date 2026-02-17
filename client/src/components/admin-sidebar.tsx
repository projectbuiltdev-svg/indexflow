import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  Kanban,
  Users,
  CreditCard,
  Globe,
  FileEdit,
  MessageSquare,
  Phone,
  PhoneCall,
  PenTool,
  Search,
  LifeBuoy,
  BarChart3,
  Download,
  Bell,
  Settings,
  ChevronDown,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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
import { useVenue } from "@/lib/venue-context";

const navItemsBefore = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Clients", icon: Building2, path: "/admin/clients" },
  { title: "CRM Pipeline", icon: Kanban, path: "/admin/crm" },
  { title: "Users", icon: Users, path: "/admin/users" },
  { title: "Billing", icon: CreditCard, path: "/admin/billing" },
  { title: "Websites", icon: Globe, path: "/admin/websites" },
  { title: "Website Changes", icon: FileEdit, path: "/admin/website-changes" },
  { title: "Widget Config", icon: MessageSquare, path: "/admin/widget-config" },
  { title: "Twilio", icon: Phone, path: "/admin/twilio" },
  { title: "Call Logs", icon: PhoneCall, path: "/admin/call-logs" },
  { title: "Content Engine", icon: PenTool, path: "/admin/content" },
];

const navItemsAfter = [
  { title: "Support Tickets", icon: LifeBuoy, path: "/admin/support" },
  { title: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { title: "Export Data", icon: Download, path: "/admin/export" },
  { title: "Notifications", icon: Bell, path: "/admin/notifications" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];

const seoSubItems = [
  { title: "Rank Tracker", path: "/admin/seo/rank-tracker" },
  { title: "Local Grid", path: "/admin/seo/local-grid" },
  { title: "AI Visibility", path: "/admin/seo/ai-visibility" },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { venues, selectedVenue, selectVenue } = useVenue();

  const isActive = (path: string) => {
    if (path === "/admin") return location === "/admin";
    return location.startsWith(path);
  };

  const isSeoActive = location.startsWith("/admin/seo");

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold" data-testid="text-admin-title">
            Resto Admin
          </span>
        </div>
        <Select
          value={selectedVenue?.id ?? ""}
          onValueChange={(val) => {
            const venue = venues.find((v) => v.id === val) ?? null;
            selectVenue(venue);
          }}
        >
          <SelectTrigger data-testid="select-venue" className="w-full">
            <SelectValue placeholder="Select venue" />
          </SelectTrigger>
          <SelectContent>
            {venues.map((venue) => (
              <SelectItem
                key={venue.id}
                value={venue.id}
                data-testid={`select-venue-option-${venue.id}`}
              >
                {venue.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItemsBefore.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                  >
                    <Link
                      href={item.path}
                      data-testid={`link-${item.path.replace(/\//g, "-").slice(1)}`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <Collapsible defaultOpen={isSeoActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isSeoActive}
                      tooltip="SEO & Rankings"
                      data-testid="link-admin-seo"
                    >
                      <Search />
                      <span>SEO & Rankings</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {seoSubItems.map((sub) => (
                        <SidebarMenuSubItem key={sub.path}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location === sub.path}
                          >
                            <Link
                              href={sub.path}
                              data-testid={`link-${sub.path.replace(/\//g, "-").slice(1)}`}
                            >
                              <span>{sub.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {navItemsAfter.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.title}
                  >
                    <Link
                      href={item.path}
                      data-testid={`link-${item.path.replace(/\//g, "-").slice(1)}`}
                    >
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
        <div className="px-2 py-1 text-xs text-muted-foreground" data-testid="text-admin-footer">
          Resto Platform
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
