import { type ReactNode, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { WorkspaceProvider } from "@/lib/workspace-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sun, Moon, Bell, LogOut } from "lucide-react";

const sidebarStyle = {
  "--sidebar-width": "15rem",
  "--sidebar-width-icon": "3rem",
};

function AdminHeader() {
  const [, navigate] = useLocation();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("indexflow_theme");
      if (saved) return saved === "dark";
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("indexflow_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleSignOut = () => {
    localStorage.removeItem("indexflow_admin_session");
    localStorage.removeItem("indexflow_session");
    localStorage.removeItem("indexflow_workspace_id");
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between gap-2 px-4 py-2 border-b sticky top-0 z-50 bg-background">
      <div className="flex items-center gap-2 flex-wrap">
        <SidebarTrigger data-testid="button-admin-sidebar-toggle" />
        <span className="text-sm text-muted-foreground" data-testid="text-admin-portal-label">Admin Portal</span>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground hidden sm:inline" data-testid="text-management-label">Management</span>
        <Badge variant="default" className="text-xs" data-testid="badge-super-admin">Super Admin</Badge>
        <span className="text-sm text-muted-foreground hidden md:inline" data-testid="text-admin-email">admin@indexflow.cloud</span>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsDark(!isDark)}
          data-testid="button-theme-toggle"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button size="icon" variant="ghost" data-testid="button-notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleSignOut} data-testid="button-logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <SidebarProvider style={sidebarStyle as React.CSSProperties}>
        <div className="flex h-screen w-full" data-testid="admin-layout">
          <AdminSidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </WorkspaceProvider>
  );
}
