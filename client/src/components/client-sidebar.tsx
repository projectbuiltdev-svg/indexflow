import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  FileText,
  Search,
  Grid3X3,
  CalendarDays,
  Users,
  Settings,
  Building2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useVenue } from "@/lib/venue-context";
import logoPath from "@assets/image_1771294424707.png";

const menuItems = [
  { title: "Dashboard", url: "/client", icon: LayoutDashboard },
  { title: "My Content", url: "/client/content", icon: FileText },
  { title: "Rankings", url: "/client/keywords", icon: Search },
  { title: "Local Grid", url: "/client/grid", icon: Grid3X3 },
  { title: "Reservations", url: "/client/reservations", icon: CalendarDays },
  { title: "Messages", url: "/client/leads", icon: Users },
];

const bottomItems = [
  { title: "Settings", url: "/client/settings", icon: Settings },
];

export function ClientSidebar() {
  const [location] = useLocation();
  const { selectedVenue } = useVenue();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 space-y-3">
        <Link href="/">
          <img src={logoPath} alt="Resto" className="w-full max-h-full object-contain" data-testid="img-client-sidebar-logo" />
        </Link>
        <div
          className="flex items-center gap-2 w-full rounded-md border px-3 py-2 text-sm"
          data-testid="text-client-venue-name"
        >
          <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="truncate flex-1 text-left font-medium">
            {selectedVenue?.name || "My Venue"}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>My Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.url === "/client"
                        ? location === "/client"
                        : location.startsWith(item.url)
                    }
                  >
                    <Link href={item.url} data-testid={`link-client-sidebar-${item.title.replace(/\s+/g, '-').toLowerCase()}`}>
                      <item.icon className="w-4 h-4" />
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
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.startsWith(item.url)}
                  >
                    <Link href={item.url} data-testid={`link-client-sidebar-${item.title.toLowerCase()}`}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
