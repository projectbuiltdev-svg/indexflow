import { type ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { VenueProvider } from "@/lib/venue-context";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <VenueProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AdminSidebar />
          <div className="flex flex-col flex-1">
            <header className="flex items-center justify-between gap-2 p-2 border-b">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </VenueProvider>
  );
}
