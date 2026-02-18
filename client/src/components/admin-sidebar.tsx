import { Link, useLocation } from "wouter";
import logoImage from "@assets/image_1771330330596.png";
import {
  LayoutDashboard,
  Building2,
  PenTool,
  Search,
  CreditCard,
  Server,
  Users,
  LifeBuoy,
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
import { useWorkspace } from "@/lib/workspace-context";

interface CollapsibleSection {
  title: string;
  icon: React.ComponentType<any>;
  path: string;
  items: Array<{
    title: string;
    path: string;
  }>;
}

const collapsibleSections: CollapsibleSection[] = [
  {
    title: "Agencies",
    icon: Building2,
    path: "/admin/agencies",
    items: [
      { title: "All Agencies", path: "/admin/agencies" },
      { title: "Agency Detail", path: "/admin/agencies/detail" },
      { title: "Pending Approvals", path: "/admin/agencies/pending" },
    ],
  },
  {
    title: "Content",
    icon: PenTool,
    path: "/admin/content",
    items: [
      { title: "All Posts", path: "/admin/content/posts" },
      { title: "All Campaigns", path: "/admin/content/campaigns" },
      { title: "Content Moderation", path: "/admin/content/moderation" },
    ],
  },
  {
    title: "Platform SEO",
    icon: Search,
    path: "/admin/platform-seo",
    items: [
      { title: "Keyword Usage", path: "/admin/platform-seo/keywords" },
      { title: "API Usage", path: "/admin/platform-seo/api-usage" },
    ],
  },
  {
    title: "Billing",
    icon: CreditCard,
    path: "/admin/billing",
    items: [
      { title: "Subscriptions", path: "/admin/billing/subscriptions" },
      { title: "Revenue", path: "/admin/billing/revenue" },
      { title: "Invoices", path: "/admin/billing/invoices" },
      { title: "Payouts", path: "/admin/billing/payouts" },
    ],
  },
  {
    title: "System",
    icon: Server,
    path: "/admin/system",
    items: [
      { title: "API Keys", path: "/admin/system/api-keys" },
      { title: "Twilio", path: "/admin/system/twilio" },
      { title: "Email", path: "/admin/system/email" },
      { title: "Infrastructure", path: "/admin/system/infrastructure" },
    ],
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
    items: [
      { title: "All Users", path: "/admin/users/all" },
      { title: "Admin Users", path: "/admin/users/admins" },
    ],
  },
  {
    title: "Support",
    icon: LifeBuoy,
    path: "/admin/support",
    items: [
      { title: "All Tickets", path: "/admin/support/tickets" },
      { title: "Call Logs", path: "/admin/support/call-logs" },
      { title: "System Announcements", path: "/admin/support/announcements" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
    items: [
      { title: "Platform Config", path: "/admin/settings/config" },
      { title: "Branding", path: "/admin/settings/branding" },
    ],
  },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { workspaces, selectedWorkspace, selectWorkspace } = useWorkspace();

  const isActive = (path: string) => {
    if (path === "/admin") return location === "/admin";
    return location.startsWith(path);
  };

  const isSectionActive = (path: string) => {
    return location.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <img src={logoImage} alt="indexFlow" className="h-6" />
          <span className="text-base font-semibold" data-testid="text-admin-title">
            Admin
          </span>
        </div>
        <Select
          value={selectedWorkspace?.id ?? ""}
          onValueChange={(val) => {
            const workspace = workspaces.find((w) => w.id === val) ?? null;
            selectWorkspace(workspace);
          }}
        >
          <SelectTrigger data-testid="select-workspace" className="w-full">
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent>
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
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard - Top level item */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin")}
                  tooltip="Dashboard"
                  data-testid="link-admin"
                >
                  <Link href="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Collapsible sections */}
              {collapsibleSections.map((section) => (
                <Collapsible
                  key={section.path}
                  defaultOpen={isSectionActive(section.path)}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={isSectionActive(section.path)}
                        tooltip={section.title}
                        data-testid={`link-${section.path.replace(/\//g, "-").slice(1)}`}
                      >
                        <section.icon />
                        <span>{section.title}</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {section.items.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={location === item.path}
                              data-testid={`link-${item.path.replace(/\//g, "-").slice(1)}`}
                            >
                              <Link href={item.path}>
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-2 py-1 text-xs text-muted-foreground" data-testid="text-admin-footer">
          indexFlow Platform
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
