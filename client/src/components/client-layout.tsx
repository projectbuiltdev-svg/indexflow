import { type ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/client-sidebar";
import { WorkspaceProvider } from "@/lib/workspace-context";

const sidebarStyle = {
  "--sidebar-width": "15rem",
  "--sidebar-width-icon": "3rem",
};

interface ClientLayoutProps {
  children: ReactNode;
}

function ClientLayoutInner({ children }: ClientLayoutProps) {
  return (
    <SidebarProvider open={true} onOpenChange={() => {}} style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <ClientSidebar />
        <div className="flex flex-col flex-1 min-w-0">
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
