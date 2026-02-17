import { type ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { VenueProvider } from "@/lib/venue-context";
import { ThemeToggle } from "@/components/theme-toggle";

const sidebarStyle = {
  "--sidebar-width": "16rem",
  "--sidebar-width-icon": "3rem",
};

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <VenueProvider>
      <SidebarProvider style={sidebarStyle as React.CSSProperties}>
        <div className="flex h-screen w-full" data-testid="admin-layout">
          <AdminSidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <header className="flex items-center justify-between gap-2 p-2 border-b sticky top-0 z-50 bg-background">
              <SidebarTrigger data-testid="button-admin-sidebar-toggle" />
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </VenueProvider>
  );
}
