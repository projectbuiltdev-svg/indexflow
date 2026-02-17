import { Link, useLocation } from "wouter";
import {
  CalendarCheck,
  Calendar,
  PhoneCall,
  BarChart3,
  Download,
  Settings,
  BedDouble,
  TrendingUp,
  FileEdit,
  BookOpen,
  LifeBuoy,
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

const topNavItems = [
  { title: "Today", icon: CalendarCheck, path: "/dashboard" },
  { title: "Calendar", icon: Calendar, path: "/dashboard/calendar" },
  { title: "Calls", icon: PhoneCall, path: "/dashboard/calls" },
];

const analyticsSubItems = [
  { title: "Bookings", path: "/dashboard/analytics?tab=bookings" },
  { title: "Widget", path: "/dashboard/analytics?tab=widget" },
  { title: "Phone", path: "/dashboard/analytics?tab=phone" },
];

const settingsSubItems = [
  { title: "Hours", path: "/dashboard/settings/hours" },
  { title: "Closures", path: "/dashboard/settings/closures" },
  { title: "Resources", path: "/dashboard/settings/resources" },
  { title: "Team", path: "/dashboard/settings/team" },
  { title: "Payments", path: "/dashboard/settings/payments" },
];

const roomsSubItems = [
  { title: "Room Types", path: "/dashboard/rooms/types" },
  { title: "Rooms", path: "/dashboard/rooms/list" },
  { title: "Room Bookings", path: "/dashboard/rooms/bookings" },
];

const bottomNavItems = [
  { title: "Export Data", icon: Download, path: "/dashboard/export" },
  { title: "Rank Tracker", icon: TrendingUp, path: "/dashboard/rank-tracker" },
  { title: "Website Changes", icon: FileEdit, path: "/dashboard/website-changes" },
  { title: "Documentation", icon: BookOpen, path: "/dashboard/docs" },
  { title: "Support", icon: LifeBuoy, path: "/dashboard/support" },
];

export function ClientSidebar() {
  const [location] = useLocation();
  const { venues, selectedVenue, selectVenue } = useVenue();

  const isActive = (path: string) => {
    if (path === "/dashboard") return location === "/dashboard";
    return location.startsWith(path);
  };

  const isAnalyticsActive = location.startsWith("/dashboard/analytics");
  const isSettingsActive = location.startsWith("/dashboard/settings");
  const isRoomsActive = location.startsWith("/dashboard/rooms");

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <CalendarCheck className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold" data-testid="text-client-title">
            {selectedVenue?.name ?? "Resto"}
          </span>
        </div>
        <Select
          value={selectedVenue?.id ?? ""}
          onValueChange={(val) => {
            const venue = venues.find((v) => v.id === val) ?? null;
            selectVenue(venue);
          }}
        >
          <SelectTrigger data-testid="select-client-venue" className="w-full">
            <SelectValue placeholder="Select venue" />
          </SelectTrigger>
          <SelectContent>
            {venues.map((venue) => (
              <SelectItem
                key={venue.id}
                value={venue.id}
                data-testid={`select-client-venue-option-${venue.id}`}
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
              {topNavItems.map((item) => (
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

              <Collapsible defaultOpen={isAnalyticsActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isAnalyticsActive}
                      tooltip="Analytics"
                      data-testid="link-dashboard-analytics"
                    >
                      <BarChart3 />
                      <span>Analytics</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {analyticsSubItems.map((sub) => (
                        <SidebarMenuSubItem key={sub.path}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location === sub.path || location.startsWith(sub.path)}
                          >
                            <Link
                              href={sub.path}
                              data-testid={`link-analytics-${sub.title.toLowerCase()}`}
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

              {bottomNavItems.slice(0, 1).map((item) => (
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

              <Collapsible defaultOpen={isSettingsActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isSettingsActive}
                      tooltip="Settings"
                      data-testid="link-dashboard-settings"
                    >
                      <Settings />
                      <span>Settings</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {settingsSubItems.map((sub) => (
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

              <Collapsible defaultOpen={isRoomsActive} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isRoomsActive}
                      tooltip="Rooms"
                      data-testid="link-dashboard-rooms"
                    >
                      <BedDouble />
                      <span>Rooms</span>
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {roomsSubItems.map((sub) => (
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

              {bottomNavItems.slice(1).map((item) => (
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
        <div className="px-2 py-1 text-xs text-muted-foreground" data-testid="text-client-footer">
          Resto Platform
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
