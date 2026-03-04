import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Tablet, Smartphone, Loader2, Check, AlertTriangle, X, Wifi, WifiOff, Clock, Play } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface WECanvasProps {
  projectId: string;
  pageId: string;
  venueId: string;
  initialState?: Record<string, any>;
  projectLanguage: string;
  onStateChange?: (newState: Record<string, any>) => void;
  onSave?: (state: Record<string, any>) => void;
  readOnly?: boolean;
  onOpenVersionHistory?: () => void;
}

interface CanvasState {
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  canUndo: boolean;
  canRedo: boolean;
}

export function useCanvasState() {
  const [state, setState] = useState<CanvasState>({
    isDirty: false,
    isSaving: false,
    lastSaved: null,
    canUndo: false,
    canRedo: false,
  });
  return state;
}

type Breakpoint = "desktop" | "tablet" | "mobile";

const BREAKPOINTS: Record<Breakpoint, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export default function WECanvas({
  projectId,
  pageId,
  venueId,
  initialState,
  projectLanguage,
  onStateChange,
  onSave,
  readOnly = false,
  onOpenVersionHistory,
}: WECanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const isDirtyRef = useRef(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getCurrentState = useCallback((): Record<string, any> => {
    if (!editorRef.current) return initialState || {};
    try {
      return {
        components: JSON.parse(JSON.stringify(editorRef.current.getComponents())),
        styles: JSON.parse(JSON.stringify(editorRef.current.getStyle())),
        html: editorRef.current.getHtml(),
        css: editorRef.current.getCss(),
      };
    } catch {
      return initialState || {};
    }
  }, [initialState]);

  const doSave = useCallback(async () => {
    if (!isDirtyRef.current || !isOnline) return;
    setSaveStatus("saving");
    try {
      const state = getCurrentState();
      await apiRequest("PATCH", `/api/we/pages/${projectId}/${pageId}?venueId=${venueId}`, {
        grapejsState: state,
      });
      isDirtyRef.current = false;
      setSaveStatus("saved");
      onSave?.(state);
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("failed");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }, [projectId, pageId, venueId, isOnline, getCurrentState, onSave]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      if (isDirtyRef.current) doSave();
    };
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, [doSave]);

  useEffect(() => {
    if (isMobile || !containerRef.current) return;

    let mounted = true;

    (async () => {
      const grapesjs = (await import("grapesjs")).default;
      if (!mounted || !containerRef.current) return;

      const editor = grapesjs.init({
        container: containerRef.current,
        fromElement: false,
        height: "100%",
        width: "auto",
        storageManager: false,
        panels: { defaults: [] },
        deviceManager: {
          devices: [
            { name: "Desktop", width: "" },
            { name: "Tablet", width: "768px" },
            { name: "Mobile", width: "375px" },
          ],
        },
        canvas: {
          styles: [
            "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
          ],
        },
      });

      if (initialState) {
        try {
          if (initialState.components) {
            editor.setComponents(initialState.components);
          }
          if (initialState.styles) {
            editor.setStyle(initialState.styles);
          }
          if (initialState.html && !initialState.components) {
            editor.setComponents(initialState.html);
          }
        } catch {}
      }

      editor.on("component:update", () => {
        isDirtyRef.current = true;
        const state = getCurrentState();
        onStateChange?.(state);
      });

      editor.on("component:add", () => {
        isDirtyRef.current = true;
      });

      editor.on("component:remove", () => {
        isDirtyRef.current = true;
      });

      editorRef.current = editor;
      setEditorLoaded(true);
    })();

    return () => {
      mounted = false;
      if (editorRef.current) {
        try { editorRef.current.destroy(); } catch {}
        editorRef.current = null;
      }
      setEditorLoaded(false);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!editorRef.current) return;
    const deviceMap: Record<Breakpoint, string> = {
      desktop: "Desktop",
      tablet: "Tablet",
      mobile: "Mobile",
    };
    try {
      editorRef.current.setDevice(deviceMap[breakpoint]);
    } catch {}
  }, [breakpoint]);

  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      if (isDirtyRef.current && isOnline) doSave();
    }, 30000);
    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [doSave, isOnline]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        doSave();
        return;
      }
      if (e.key === "?") {
        setShowShortcuts((s) => !s);
        return;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [doSave]);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center" data-testid="we-mobile-restriction">
        <div className="max-w-md space-y-4">
          <Monitor className="w-16 h-16 mx-auto text-muted-foreground" />
          <h2 className="text-xl font-semibold">Desktop Required</h2>
          <p className="text-muted-foreground">
            Website Engine requires a desktop browser. Please open on a computer with a screen wider than 1024px.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative" data-testid="we-canvas">
      {!isOnline && (
        <div className="bg-amber-500 text-white px-4 py-2 text-sm flex items-center gap-2" data-testid="we-offline-banner">
          <WifiOff className="w-4 h-4" />
          You are offline. Changes will save when reconnected.
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 border-b bg-background" data-testid="we-toolbar">
        <div className="flex items-center gap-1">
          <Button
            variant={breakpoint === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBreakpoint("desktop")}
            data-testid="btn-breakpoint-desktop"
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </Button>
          <Button
            variant={breakpoint === "tablet" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBreakpoint("tablet")}
            data-testid="btn-breakpoint-tablet"
          >
            <Tablet className="w-4 h-4 mr-1" />
            Tablet
          </Button>
          <Button
            variant={breakpoint === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBreakpoint("mobile")}
            data-testid="btn-breakpoint-mobile"
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {onOpenVersionHistory && (
            <Button variant="ghost" size="sm" onClick={onOpenVersionHistory} data-testid="btn-version-history">
              <Clock className="w-4 h-4 mr-1" />
              History
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm" data-testid="we-save-status">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-green-600">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
          {saveStatus === "failed" && (
            <span className="flex items-center gap-1 text-amber-600">
              <AlertTriangle className="w-3 h-3" /> Save failed
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex justify-center bg-muted/30">
        <div
          ref={containerRef}
          style={{
            width: BREAKPOINTS[breakpoint],
            maxWidth: "100%",
            height: "100%",
            transition: "width 0.3s ease",
          }}
          className="bg-white"
          data-testid="we-canvas-container"
        />
      </div>

      <BuildProgressOverlay projectId={projectId} venueId={venueId} />

      {showShortcuts && (
        <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center" data-testid="we-shortcuts-modal">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Keyboard Shortcuts</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowShortcuts(false)} data-testid="btn-close-shortcuts">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Ctrl+Z", "Undo"],
                ["Ctrl+Shift+Z", "Redo"],
                ["Ctrl+C", "Copy block"],
                ["Ctrl+V", "Paste block"],
                ["Ctrl+S", "Save"],
                ["Delete", "Remove selected"],
                ["Escape", "Deselect"],
                ["?", "Toggle shortcuts"],
              ].map(([key, desc]) => (
                <div key={key} className="flex justify-between">
                  <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">{key}</kbd>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BuildProgressOverlay({ projectId, venueId }: { projectId: string; venueId: string }) {
  const { data } = useQuery<{
    status: string;
    currentStep: number;
    totalSteps: number;
    completedSteps: number[];
    failedStep: number | null;
    percentComplete: number;
  }>({
    queryKey: ["/api/we/build", projectId, "status", venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/build/${projectId}/status?venueId=${venueId}`);
      if (!res.ok) return { status: "idle", currentStep: 0, totalSteps: 21, completedSteps: [], failedStep: null, percentComplete: 0 };
      return res.json();
    },
    refetchInterval: (query) => {
      const d = query.state.data as any;
      return d?.status === "building" ? 3000 : false;
    },
    enabled: !!projectId && projectId !== "0",
  });

  if (!data || data.status === "idle" || data.status === "built") return null;

  const isBuilding = data.status === "building";
  const isPaused = data.status === "paused";

  return (
    <div className="absolute inset-0 z-40 bg-background/90 flex items-center justify-center" data-testid="we-build-overlay">
      <div className="max-w-md w-full p-6 space-y-4 text-center">
        {isBuilding && (
          <>
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
            <h3 className="font-semibold text-lg">Building your website...</h3>
            <p className="text-sm text-muted-foreground">Step {data.currentStep} of {data.totalSteps}</p>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${data.percentComplete}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-1 justify-center">
              {Array.from({ length: data.totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${
                    data.completedSteps.includes(step)
                      ? "bg-green-100 text-green-700"
                      : step === data.currentStep
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {data.completedSteps.includes(step) ? "✓" : step}
                </div>
              ))}
            </div>
          </>
        )}

        {isPaused && (
          <>
            <AlertTriangle className="w-10 h-10 mx-auto text-amber-500" />
            <h3 className="font-semibold text-lg">Build paused at step {data.failedStep} of {data.totalSteps}</h3>
            <p className="text-sm text-muted-foreground">An error occurred. You can retry from where it stopped.</p>
            <Button
              onClick={async () => {
                await apiRequest("POST", `/api/we/build/${projectId}/resume?venueId=${venueId}`, {});
              }}
              data-testid="btn-resume-build"
            >
              <Play className="w-4 h-4 mr-1" />
              Resume Build
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
