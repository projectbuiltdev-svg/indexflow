import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  FileText,
  Search,
  Grid3X3,
  CalendarDays,
  Users,
  Settings,
  ChevronsUpDown,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVenue } from "@/lib/venue-context";
import logoPath from "@assets/image_1771294424707.png";

const menuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Content Engine", url: "/admin/content", icon: FileText },
  { title: "Rank Tracker", url: "/admin/keywords", icon: Search },
  { title: "Local Grid", url: "/admin/grid", icon: Grid3X3 },
  { title: "Reservations", url: "/admin/reservations", icon: CalendarDays },
  { title: "Leads & CRM", url: "/admin/leads", icon: Users },
  { title: "Venues", url: "/admin/venues", icon: Building2 },
];

const bottomItems = [
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { venues, selectedVenue, selectVenue } = useVenue();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 space-y-3">
        <Link href="/">
          <img src={logoPath} alt="Resto" className="w-full max-h-full object-contain" data-testid="img-admin-sidebar-logo" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 w-full rounded-md border px-3 py-2 text-sm hover-elevate"
              data-testid="button-admin-venue-selector"
            >
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate flex-1 text-left">
                {selectedVenue?.name || "Select venue"}
              </span>
              <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">
            {venues.map((v) => (
              <DropdownMenuItem
                key={v.id}
                onClick={() => selectVenue(v)}
                data-testid={`menu-admin-venue-${v.id}`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-sm">{v.name}</span>
                  {v.type && (
                    <span className="text-xs text-muted-foreground">{v.type}</span>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.url === "/admin"
                        ? location === "/admin"
                        : location.startsWith(item.url)
                    }
                  >
                    <Link href={item.url} data-testid={`link-admin-sidebar-${item.title.replace(/\s+/g, '-').toLowerCase()}`}>
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
                    <Link href={item.url} data-testid={`link-admin-sidebar-${item.title.toLowerCase()}`}>
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
