import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Lock, Users, Copy, Check, Loader2, Link2, RefreshCw, Eye, Info } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface WECollabPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  venueId: string;
  tier: string;
  isOnTrial: boolean;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      data-testid="btn-copy-preview"
    >
      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
    </Button>
  );
}

export default function WECollabPanel({ isOpen, onClose, projectId, venueId, tier, isOnTrial }: WECollabPanelProps) {
  const queryClient = useQueryClient();
  const isPro = tier === "pro" || tier === "agency" || tier === "enterprise";

  const { data: locks } = useQuery<{ locks: any[] }>({
    queryKey: ["/api/we/collab", projectId, "locks", venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/collab/${projectId}/locks?venueId=${venueId}`);
      if (!res.ok) return { locks: [] };
      return res.json();
    },
    refetchInterval: isOpen && isPro && !isOnTrial ? 10000 : false,
    enabled: isOpen && isPro && !isOnTrial,
  });

  const { data: previewLink } = useQuery<{ previewUrl: string; expiresAt: string; token: string } | null>({
    queryKey: ["/api/we/collab", projectId, "preview-link", venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/collab/${projectId}/preview-link?venueId=${venueId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: isOpen,
  });

  const generateLink = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/we/collab/${projectId}/preview-link?venueId=${venueId}`, {});
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/collab", projectId, "preview-link"] }),
  });

  const disableLink = useMutation({
    mutationFn: async (token: string) => {
      await apiRequest("DELETE", `/api/we/collab/${projectId}/preview-link/${token}?venueId=${venueId}`, {});
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/collab", projectId, "preview-link"] }),
  });

  if (!isOpen) return null;

  const expiresIn = previewLink?.expiresAt
    ? Math.max(0, Math.ceil((new Date(previewLink.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[360px] max-w-full bg-background border-l shadow-xl flex flex-col" data-testid="we-collab-panel">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <h3 className="font-semibold text-lg">Collaboration</h3>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="btn-close-collab">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-5 border-b space-y-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Users className="w-4 h-4" /> Team
          </h4>

          {!isPro || isOnTrial ? (
            <div className="text-center py-4 space-y-2" data-testid="collab-locked">
              <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Team collaboration is available on Pro and above.</p>
              <Button size="sm" data-testid="btn-upgrade-collab">Upgrade</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {(!locks?.locks?.length) ? (
                <p className="text-sm text-muted-foreground">No active editors right now.</p>
              ) : (
                <div className="space-y-2">
                  {locks.locks.map((l: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded bg-muted/30" data-testid={`lock-row-${i}`}>
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                        {(l.lockedBy || "?")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{l.lockedBy}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Editing page {l.pageId}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" /> Client Preview
          </h4>

          {previewLink ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-muted/50 rounded px-3 py-2" data-testid="preview-link-display">
                <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm truncate flex-1">{previewLink.previewUrl}</span>
                <CopyBtn text={previewLink.previewUrl} />
              </div>
              <p className="text-xs text-muted-foreground">Expires in {expiresIn} day{expiresIn !== 1 ? "s" : ""}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateLink.mutate()}
                  disabled={generateLink.isPending}
                  data-testid="btn-regenerate-preview"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => disableLink.mutate(previewLink.token)}
                  disabled={disableLink.isPending}
                  data-testid="btn-disable-preview"
                >
                  Disable link
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => generateLink.mutate()}
              disabled={generateLink.isPending}
              data-testid="btn-generate-preview"
            >
              {generateLink.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Link2 className="w-3 h-3 mr-1" />}
              Generate Preview Link
            </Button>
          )}

          <div className="flex items-start gap-2 p-3 bg-muted/30 rounded text-xs text-muted-foreground" data-testid="preview-info">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Share this link with your client. No login required. They can view the site and leave comments. Link expires after 7 days.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
