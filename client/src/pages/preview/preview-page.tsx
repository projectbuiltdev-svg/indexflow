import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Comment {
  id: number;
  elementSelector: string;
  xPercent: number;
  yPercent: number;
  comment: string;
  clientName: string;
  pinNumber: number;
  resolved: boolean;
  replies: { text: string; by: string; at: string }[];
  createdAt: string;
}

export default function PreviewPage() {
  const params = useParams<{ token: string }>();
  const token = params.token || "";
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentMode, setCommentMode] = useState(false);
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [showPopover, setShowPopover] = useState<{ x: number; y: number } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/we/comments/${token}`)
      .then((r) => r.json())
      .then((d) => setComments(d.comments || []))
      .catch(() => {});
  }, [token]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!commentMode || !overlayRef.current) return;
    const rect = overlayRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    setShowPopover({ x: xPercent, y: yPercent });
    setSelectedPin(null);
  };

  const submitComment = async () => {
    if (!name.trim() || !text.trim() || !showPopover) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/we/comments/${token}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elementSelector: "",
          xPercent: showPopover.x,
          yPercent: showPopover.y,
          comment: text,
          clientName: name,
          clientEmail: email || undefined,
        }),
      });
      const data = await res.json();
      setComments((prev) => [...prev, {
        id: data.commentId,
        elementSelector: "",
        xPercent: showPopover.x,
        yPercent: showPopover.y,
        comment: text,
        clientName: name,
        pinNumber: data.pinNumber,
        resolved: false,
        replies: [],
        createdAt: new Date().toISOString(),
      }]);
      setShowPopover(null);
      setText("");
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const selectedComment = selectedPin !== null ? comments.find((c) => c.id === selectedPin) : null;

  return (
    <div className="h-screen flex flex-col" data-testid="preview-page">
      <div className="h-10 bg-background border-b flex items-center justify-between px-4 text-sm flex-shrink-0">
        <span className="font-medium">Preview</span>
        <div className="flex items-center gap-3">
          <Button
            variant={commentMode ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => { setCommentMode(!commentMode); setShowPopover(null); }}
            data-testid="btn-toggle-comment-mode"
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            {commentMode ? "Exit comment mode" : "Leave a comment"}
          </Button>
          <span className="text-muted-foreground">{comments.length} comment{comments.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <iframe
          src="about:blank"
          className="w-full h-full border-0"
          style={{ pointerEvents: commentMode ? "none" : "auto" }}
          data-testid="preview-iframe"
        />

        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            cursor: commentMode ? "crosshair" : "default",
            pointerEvents: commentMode ? "auto" : "none",
          }}
          onClick={handleOverlayClick}
          data-testid="preview-overlay"
        >
          {comments.map((c) => (
            <div
              key={c.id}
              className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-transform"
              style={{ left: `${c.xPercent}%`, top: `${c.yPercent}%`, pointerEvents: "auto" }}
              onClick={(e) => { e.stopPropagation(); setSelectedPin(c.id); setShowPopover(null); }}
              title={`${c.clientName}: ${c.comment.slice(0, 50)}`}
              data-testid={`pin-${c.id}`}
            >
              {c.pinNumber}
            </div>
          ))}

          {showPopover && (
            <div
              className="absolute z-20 bg-background border rounded-lg shadow-xl p-3 w-64"
              style={{ left: `${Math.min(showPopover.x, 70)}%`, top: `${Math.min(showPopover.y, 70)}%` }}
              onClick={(e) => e.stopPropagation()}
              data-testid="comment-popover"
            >
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-2 h-8 text-sm"
                data-testid="input-comment-name"
              />
              <Input
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2 h-8 text-sm"
                data-testid="input-comment-email"
              />
              <Textarea
                placeholder="Leave a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="mb-2 text-sm min-h-[60px]"
                data-testid="input-comment-text"
              />
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 h-7 text-xs" onClick={submitComment} disabled={submitting || !name.trim() || !text.trim()} data-testid="btn-submit-comment">
                  {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3 mr-1" />}
                  Submit
                </Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowPopover(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>

        {selectedComment && (
          <div className="absolute inset-y-0 right-0 w-80 bg-background border-l shadow-xl z-30 flex flex-col" data-testid="comment-thread">
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-medium text-sm">Comment #{selectedComment.pinNumber}</h4>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedPin(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                    {selectedComment.clientName[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium">{selectedComment.clientName}</span>
                  <span className="text-xs text-muted-foreground">{new Date(selectedComment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm mt-2">{selectedComment.comment}</p>
              </div>
              {selectedComment.replies.map((r, i) => (
                <div key={i} className="border-t pt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-xs">{r.by}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm mt-1">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
