import { lazy, Suspense, useState, useCallback, useEffect, useRef } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ChevronDown, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";

const WECanvas = lazy(() => import("@/components/website-engine/WECanvas"));
const WEChatPanel = lazy(() => import("@/components/website-engine/WEChatPanel"));
const WEPageManager = lazy(() => import("@/components/website-engine/WEPageManager"));
const WECustomCode = lazy(() => import("@/components/website-engine/WECustomCode"));
const WEVersionHistory = lazy(() => import("@/components/website-engine/WEVersionHistory"));
const WEEmptyState = lazy(() => import("@/components/website-engine/WEEmptyState"));

const Fallback = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
  </div>
);

interface Project {
  id: number;
  name: string;
  slug: string;
  projectLanguage: string;
  status: string;
  tierAtCreation: string;
  buildState?: any;
}

export default function WebsiteEngine() {
  const { selectedWorkspace } = useWorkspace();
  const queryClient = useQueryClient();
  const venueId = selectedWorkspace?.id || "";
  const tier = (selectedWorkspace as any)?.subscriptionTier || selectedWorkspace?.plan || "solo";
  const isOnTrial = (selectedWorkspace as any)?.onTrial || false;

  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [activePageId, setActivePageId] = useState("0");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [codePanel, setCodePanel] = useState<{ isOpen: boolean; code?: { html: string; css: string; js: string }; isAi?: boolean }>({ isOpen: false });
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [subscriptionWarning, setSubscriptionWarning] = useState(false);

  const { data: projectsData, isLoading: projectsLoading } = useQuery<{ projects: Project[]; total: number }>({
    queryKey: ["/api/we/projects", venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/projects?venueId=${venueId}`);
      if (!res.ok) throw new Error("Failed to load projects");
      return res.json();
    },
    enabled: !!venueId,
  });

  const { data: aiStatus } = useQuery<{ hasKey: boolean }>({
    queryKey: ["/api/workspaces", venueId, "ai-status"],
    queryFn: async () => {
      const res = await fetch(`/api/workspaces/${venueId}/ai-status`);
      if (!res.ok) return { hasKey: false };
      return res.json();
    },
    enabled: !!venueId,
  });

  const projects = (projectsData?.projects || []).filter((p) => p.status !== "deleted");
  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  useEffect(() => {
    if (projects.length > 0 && !activeProjectId) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data?.expired || data?.lapsed) {
            setSubscriptionWarning(true);
          }
        }
      } catch {}
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);

  const handleDiffApplied = useCallback(() => {}, []);

  const handleOpenCodePanel = useCallback((code: { html: string; css: string; js: string }) => {
    setCodePanel({ isOpen: true, code, isAi: true });
  }, []);

  const handleProjectCreated = useCallback((project: Project) => {
    queryClient.invalidateQueries({ queryKey: ["/api/we/projects", venueId] });
    setActiveProjectId(project.id);
  }, [queryClient, venueId]);

  const handlePageSelect = useCallback((pageId: string) => {
    setActivePageId(pageId);
  }, []);

  if (projectsLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center" data-testid="page-website-engine">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="h-[calc(100vh-64px)] flex" data-testid="page-website-engine">
        <Suspense fallback={<Fallback />}>
          <WEEmptyState
            venueId={venueId}
            projectLanguage="en"
            hasByokKey={aiStatus?.hasKey ?? true}
            onProjectCreated={handleProjectCreated}
          />
        </Suspense>
      </div>
    );
  }

  const projectLanguage = activeProject?.projectLanguage || "en";
  const projectIdStr = String(activeProjectId || 0);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col" data-testid="page-website-engine">
      {subscriptionWarning && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center justify-between text-sm" data-testid="subscription-warning">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4" />
            Your trial has ended. Subscribe to keep your work.
          </div>
          <Link href={`/${venueId}/settings/billing`}>
            <Button size="sm" variant="outline" data-testid="btn-subscribe">Subscribe</Button>
          </Link>
        </div>
      )}

      <div className="border-b px-4 py-1.5 flex items-center gap-3 bg-background shrink-0" data-testid="we-project-bar">
        <Select value={String(activeProjectId || "")} onValueChange={(v) => { setActiveProjectId(Number(v)); setActivePageId("0"); }}>
          <SelectTrigger className="w-[220px] h-8 text-sm" data-testid="select-project">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeProject && (
          <span className="text-xs text-muted-foreground" data-testid="text-project-info">
            {activeProject.name}
          </span>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Suspense fallback={<Fallback />}>
          <WEPageManager
            projectId={projectIdStr}
            venueId={venueId}
            activePageId={activePageId}
            projectLanguage={projectLanguage}
            onPageSelect={handlePageSelect}
            onPageCreated={() => {}}
            onPageDeleted={() => {}}
          />
        </Suspense>

        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<Fallback />}>
            <WECanvas
              projectId={projectIdStr}
              pageId={activePageId}
              venueId={venueId}
              projectLanguage={projectLanguage}
              projectName={activeProject?.name}
              tier={tier}
              isOnTrial={isOnTrial}
              onOpenVersionHistory={() => setShowVersionHistory(true)}
            />
          </Suspense>
        </div>

        <Suspense fallback={<Fallback />}>
          <WEChatPanel
            projectId={projectIdStr}
            pageId={activePageId}
            venueId={venueId}
            projectLanguage={projectLanguage}
            isOffline={isOffline}
            onDiffApplied={handleDiffApplied}
            onOpenCodePanel={handleOpenCodePanel}
          />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <WECustomCode
          isOpen={codePanel.isOpen}
          onClose={() => setCodePanel({ isOpen: false })}
          onApply={() => {}}
          initialCode={codePanel.code}
          isAiGenerated={codePanel.isAi}
        />
      </Suspense>

      {showVersionHistory && (
        <Suspense fallback={null}>
          <WEVersionHistory
            projectId={projectIdStr}
            pageId={activePageId}
            venueId={venueId}
            projectLanguage={projectLanguage}
            isOpen={showVersionHistory}
            onClose={() => setShowVersionHistory(false)}
            onRestored={() => {}}
          />
        </Suspense>
      )}
    </div>
  );
}
