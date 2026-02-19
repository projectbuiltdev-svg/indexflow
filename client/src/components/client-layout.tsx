import { type ReactNode } from "react";
import { ClientSidebar } from "@/components/client-sidebar";
import { WorkspaceProvider, useWorkspace } from "@/lib/workspace-context";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

interface ClientLayoutProps {
  children: ReactNode;
}

function BackToDashboard() {
  const [location] = useLocation();
  const { selectedWorkspace } = useWorkspace();
  const wsId = selectedWorkspace?.id;
  const todayPath = wsId ? `/${wsId}/today` : "/today";
  const isTodayPage = location.endsWith("/today") || location === `/${wsId}`;
  if (isTodayPage) return null;

  return (
    <Link href={todayPath}>
      <a className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3" data-testid="link-back-dashboard">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </a>
    </Link>
  );
}

function ClientLayoutInner({ children }: ClientLayoutProps) {
  return (
    <div className="flex h-screen w-full">
      <ClientSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 overflow-auto p-6">
          <BackToDashboard />
          {children}
        </main>
      </div>
    </div>
  );
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <WorkspaceProvider>
      <ClientLayoutInner>{children}</ClientLayoutInner>
    </WorkspaceProvider>
  );
}
