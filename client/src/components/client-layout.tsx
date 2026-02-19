import { type ReactNode } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClientSidebar } from "@/components/client-sidebar";
import { WorkspaceProvider } from "@/lib/workspace-context";

const sidebarStyle = {
  "--sidebar-width": "15rem",
  "--sidebar-width-icon": "3rem",
};

interface ClientLayoutProps {
  children: ReactNode;
}

function SidebarOpenTab() {
  const { state, toggleSidebar } = useSidebar();
  if (state === "expanded") return null;
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={toggleSidebar}
      className="fixed top-1/2 -translate-y-1/2 left-0 z-50 h-10 w-5 rounded-l-none rounded-r-md border-l-0"
      data-testid="button-open-sidebar"
    >
      <ChevronRight className="w-4 h-4" />
    </Button>
  );
}

function ClientLayoutInner({ children }: ClientLayoutProps) {
  return (
    <SidebarProvider defaultOpen={false} style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <ClientSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <SidebarOpenTab />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <WorkspaceProvider>
      <ClientLayoutInner>{children}</ClientLayoutInner>
    </WorkspaceProvider>
  );
}
