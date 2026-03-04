import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Check, MessageCircle, Copy, RefreshCw, Loader2, Send, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface WEClientPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  venueId: string;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-7 w-7"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      data-testid="btn-copy-preview-link"
    >
      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
    </Button>
  );
}

export default function WEClientPreview({ isOpen, onClose, projectId, venueId }: WEClientPreviewProps) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unresolved" | "resolved">("all");
  const [replyTarget, setReplyTarget] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: previewLink } = useQuery<{ previewUrl: string; token: string; expiresAt: string } | null>({
    queryKey: ["/api/we/collab", projectId, "preview-link", venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/collab/${projectId}/preview-link?venueId=${venueId}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: isOpen,
  });

  const resolvedParam = filter === "all" ? "" : `&resolved=${filter === "resolved"}`;
  const { data: commentsData } = useQuery<{ comments: any[]; total: number }>({
    queryKey: ["/api/we/comments/project", projectId, venueId, filter],
    queryFn: async () => {
      const res = await fetch(`/api/we/comments/project/${projectId}?venueId=${venueId}${resolvedParam}`);
      if (!res.ok) return { comments: [], total: 0 };
      return res.json();
    },
    enabled: isOpen,
    refetchInterval: 15000,
  });

  const resolveMut = useMutation({
    mutationFn: async (commentId: number) => {
      await apiRequest("PATCH", `/api/we/comments/${commentId}/resolve?venueId=${venueId}`, {});
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/comments/project", projectId] }),
  });

  const replyMut = useMutation({
    mutationFn: async ({ commentId, text }: { commentId: number; text: string }) => {
      await apiRequest("POST", `/api/we/comments/${commentId}/reply?venueId=${venueId}`, { text });
    },
    onSuccess: () => {
      setReplyTarget(null);
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["/api/we/comments/project", projectId] });
    },
  });

  const regenerateLink = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/we/collab/${projectId}/preview-link?venueId=${venueId}`, {});
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/collab", projectId, "preview-link"] }),
  });

  if (!isOpen) return null;

  const comments = commentsData?.comments || [];

  return (
    <div className="fixed inset-0 z-50 flex" data-testid="we-client-preview">
      <div className="flex-1 bg-muted/30 relative">
        <iframe
          src={previewLink?.previewUrl || "about:blank"}
          className="w-full h-full border-0"
          data-testid="agency-preview-iframe"
        />
        {comments.filter((c) => !c.resolved).map((c: any) => (
          <div
            key={c.id}
            className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-md"
            style={{ left: `${c.xPercent}%`, top: `${c.yPercent}%` }}
            data-testid={`agency-pin-${c.id}`}
          >
            {c.pinNumber}
          </div>
        ))}
      </div>

      <div className="w-80 bg-background border-l flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Comments ({commentsData?.total || 0})</h3>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="btn-close-preview">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {previewLink && (
          <div className="px-4 py-2 border-b bg-muted/30 flex items-center gap-2 text-xs">
            <span className="truncate flex-1 text-muted-foreground">{previewLink.previewUrl}</span>
            <CopyBtn text={previewLink.previewUrl} />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => regenerateLink.mutate()}
              disabled={regenerateLink.isPending}
              data-testid="btn-regen-preview"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        )}

        <div className="flex border-b text-xs">
          {(["all", "unresolved", "resolved"] as const).map((f) => (
            <button
              key={f}
              className={`flex-1 py-2 text-center capitalize ${filter === f ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}
              onClick={() => setFilter(f)}
              data-testid={`filter-${f}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto divide-y">
          {comments.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground" data-testid="no-comments">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No comments yet
            </div>
          )}
          {comments.map((c: any) => (
            <div key={c.id} className={`p-3 space-y-2 ${c.resolved ? "opacity-60" : ""}`} data-testid={`comment-row-${c.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{c.pinNumber}</span>
                  <span className="font-medium text-xs">{c.clientName}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className={`text-sm ${c.resolved ? "line-through" : ""}`}>{c.comment}</p>

              {c.replies?.map((r: any, i: number) => (
                <div key={i} className="pl-4 border-l-2 border-primary/20 text-xs space-y-0.5">
                  <span className="font-medium">{r.by}</span>
                  <p>{r.text}</p>
                </div>
              ))}

              <div className="flex gap-1">
                {!c.resolved && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] px-2"
                    onClick={() => resolveMut.mutate(c.id)}
                    disabled={resolveMut.isPending}
                    data-testid={`btn-resolve-${c.id}`}
                  >
                    <Check className="w-3 h-3 mr-1" /> Resolve
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[10px] px-2"
                  onClick={() => setReplyTarget(replyTarget === c.id ? null : c.id)}
                  data-testid={`btn-reply-${c.id}`}
                >
                  Reply
                </Button>
              </div>

              {replyTarget === c.id && (
                <div className="flex gap-1" data-testid={`reply-form-${c.id}`}>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Reply..."
                    className="text-xs min-h-[40px] flex-1"
                    data-testid={`input-reply-${c.id}`}
                  />
                  <Button
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => replyMut.mutate({ commentId: c.id, text: replyText })}
                    disabled={!replyText.trim() || replyMut.isPending}
                    data-testid={`btn-send-reply-${c.id}`}
                  >
                    {replyMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
