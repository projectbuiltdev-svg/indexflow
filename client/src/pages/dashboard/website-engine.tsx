import { lazy, Suspense, useState, useCallback } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { Loader2 } from "lucide-react";

const WECanvas = lazy(() => import("@/components/website-engine/WECanvas"));
const WEChatPanel = lazy(() => import("@/components/website-engine/WEChatPanel"));
const WEPageManager = lazy(() => import("@/components/website-engine/WEPageManager"));
const WECustomCode = lazy(() => import("@/components/website-engine/WECustomCode"));

const Fallback = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
  </div>
);

export default function WebsiteEngine() {
  const { selectedWorkspace } = useWorkspace();
  const venueId = selectedWorkspace?.id || "";
  const [activePageId, setActivePageId] = useState("0");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [codePanel, setCodePanel] = useState<{ isOpen: boolean; code?: { html: string; css: string; js: string }; isAi?: boolean }>({ isOpen: false });

  const handleDiffApplied = useCallback(() => {}, []);

  const handleOpenCodePanel = useCallback((code: { html: string; css: string; js: string }) => {
    setCodePanel({ isOpen: true, code, isAi: true });
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] flex" data-testid="page-website-engine">
      <Suspense fallback={<Fallback />}>
        <WEPageManager
          projectId="0"
          venueId={venueId}
          activePageId={activePageId}
          projectLanguage="en"
          onPageSelect={setActivePageId}
          onPageCreated={() => {}}
          onPageDeleted={() => {}}
        />
      </Suspense>

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<Fallback />}>
          <WECanvas
            projectId="0"
            pageId={activePageId}
            venueId={venueId}
            projectLanguage="en"
          />
        </Suspense>
      </div>

      <Suspense fallback={<Fallback />}>
        <WEChatPanel
          projectId="0"
          pageId={activePageId}
          venueId={venueId}
          projectLanguage="en"
          isOffline={isOffline}
          onDiffApplied={handleDiffApplied}
          onOpenCodePanel={handleOpenCodePanel}
        />
      </Suspense>

      <Suspense fallback={<Fallback />}>
        <WECustomCode
          isOpen={codePanel.isOpen}
          onClose={() => setCodePanel({ isOpen: false })}
          onApply={() => {}}
          initialCode={codePanel.code}
          isAiGenerated={codePanel.isAi}
        />
      </Suspense>
    </div>
  );
}
