import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { X, RotateCcw, Loader2, Info, Clock } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Version {
  id: number;
  pageId: number;
  projectId: number;
  venueId: string;
  versionNumber: number;
  createdBy: string | null;
  createdAt: string;
  grapejsState?: Record<string, any>;
}

interface WEVersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  pageId: string;
  venueId: string;
  projectLanguage: string;
  pageName?: string;
  onRestored: (newState: Record<string, any>) => void;
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Today at ${time}`;
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "short" });
  return `${day} ${month} at ${time}`;
}

function creatorLabel(createdBy: string | null): string {
  if (!createdBy) return "Auto-save";
  if (createdBy === "ai") return "AI change";
  return createdBy;
}

export default function WEVersionHistory({
  isOpen,
  onClose,
  projectId,
  pageId,
  venueId,
  projectLanguage,
  pageName,
  onRestored,
}: WEVersionHistoryProps) {
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState<Version | null>(null);

  const { data, isLoading } = useQuery<{ versions: Version[]; total: number }>({
    queryKey: ["/api/we/versions", projectId, pageId, venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/versions/${projectId}/${pageId}?venueId=${venueId}`);
      if (!res.ok) return { versions: [], total: 0 };
      return res.json();
    },
    enabled: isOpen && !!projectId && pageId !== "0",
  });

  const { data: previewData } = useQuery<Version>({
    queryKey: ["/api/we/versions", projectId, pageId, previewId],
    queryFn: async () => {
      const res = await fetch(`/api/we/versions/${projectId}/${pageId}/${previewId}?venueId=${venueId}`);
      return res.json();
    },
    enabled: !!previewId,
  });

  const restoreMutation = useMutation({
    mutationFn: async (versionId: number) => {
      const res = await apiRequest(
        "POST",
        `/api/we/versions/${projectId}/${pageId}/${versionId}/restore?venueId=${venueId}`,
        {}
      );
      return res.json();
    },
    onSuccess: (restoredPage) => {
      queryClient.invalidateQueries({ queryKey: ["/api/we/versions", projectId, pageId, venueId] });
      if (restoredPage.grapejsState) {
        onRestored(restoredPage.grapejsState);
      }
      setRestoreConfirm(null);
      onClose();
    },
  });

  const versions = data?.versions || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[400px] max-w-full bg-background border-l shadow-2xl flex flex-col" data-testid="we-version-history">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <h3 className="font-semibold">Version History</h3>
          {pageName && <p className="text-xs text-muted-foreground">{pageName}</p>}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="btn-close-versions">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs flex items-start gap-2 border-b">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>Ctrl+Z undoes changes within your current session. Version history saves snapshots across all sessions.</span>
      </div>

      <div className={`flex-1 overflow-y-auto ${previewId ? "max-h-[50%]" : ""}`} data-testid="we-version-list">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && versions.length === 0 && (
          <div className="text-center text-muted-foreground text-sm px-6 py-12 space-y-2">
            <Clock className="w-10 h-10 mx-auto opacity-40" />
            <p>No version history yet.</p>
            <p className="text-xs">Versions are created on every save and AI change.</p>
          </div>
        )}

        {versions.map((v, i) => (
          <div
            key={v.id}
            className={`group flex items-center gap-3 px-4 py-3 border-b cursor-pointer hover:bg-muted/50 ${
              previewId === v.id ? "bg-primary/10" : ""
            }`}
            onClick={() => setPreviewId(v.id)}
            data-testid={`version-row-${v.id}`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium">v{v.versionNumber}</span>
                {i === 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                    Current
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {formatTimestamp(v.createdAt)} · {creatorLabel(v.createdBy)}
              </div>
            </div>

            {i > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 shrink-0 h-7 text-xs"
                onClick={(e) => { e.stopPropagation(); setRestoreConfirm(v); }}
                data-testid={`btn-restore-${v.id}`}
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Restore
              </Button>
            )}
          </div>
        ))}
      </div>

      {previewId && previewData && (
        <div className="border-t flex flex-col" style={{ height: "50%" }}>
          <div className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs border-b flex items-center gap-1">
            <Info className="w-3 h-3" />
            This is a preview — your canvas has not changed
          </div>
          <div className="flex-1 overflow-auto p-3 bg-muted/20">
            <pre className="text-[11px] font-mono text-muted-foreground whitespace-pre-wrap break-all">
              {JSON.stringify(previewData.grapejsState, null, 2)?.slice(0, 2000) || "Empty state"}
            </pre>
          </div>
        </div>
      )}

      {restoreConfirm && (
        <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center p-4" data-testid="we-restore-confirm">
          <div className="bg-background rounded-lg p-5 max-w-sm w-full shadow-xl">
            <h4 className="font-semibold mb-2">Restore version v{restoreConfirm.versionNumber}?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Your current version will be saved as a new version first. This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => restoreMutation.mutate(restoreConfirm.id)}
                disabled={restoreMutation.isPending}
                data-testid="btn-confirm-restore"
              >
                {restoreMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Restore"}
              </Button>
              <Button variant="outline" onClick={() => setRestoreConfirm(null)} data-testid="btn-cancel-restore">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
