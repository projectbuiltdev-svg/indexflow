import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUp,
  PanelRightClose,
  PanelRightOpen,
  Trash2,
  ExternalLink,
  Loader2,
  AlertTriangle,
  WifiOff,
  Code,
  X,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface LangInfo { code: string; name: string; nativeName: string; flag: string; rtl: boolean }
const LANGS: LangInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", rtl: false },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", rtl: false },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", rtl: false },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", rtl: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", rtl: false },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", rtl: false },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", rtl: false },
];
function getLanguage(code: string): LangInfo | undefined { return LANGS.find((l) => l.code === code); }

interface Diff {
  changes: Array<{
    blockId: string;
    action: string;
    data?: Record<string, any>;
    position?: number;
  }>;
  pageLevel?: { title?: string | null; slug?: string | null };
}

interface WEChatPanelProps {
  projectId: string;
  pageId: string;
  venueId: string;
  projectLanguage: string;
  isOffline: boolean;
  onDiffApplied: (diff: Diff) => void;
  onOpenCodePanel: (code: { html: string; css: string; js: string }) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  diff?: Diff;
  code?: { html: string; css: string; js: string };
  timestamp: Date;
}

function diffSummary(diff: Diff): string {
  if (!diff.changes || diff.changes.length === 0) {
    if (diff.pageLevel?.title || diff.pageLevel?.slug) return "Updated page title/slug";
    return "No changes detected";
  }
  const parts: string[] = [];
  for (const c of diff.changes) {
    const name = c.blockId.replace(/-/g, " ");
    switch (c.action) {
      case "update": parts.push(`Updated ${name}`); break;
      case "add": parts.push(`Added ${name}`); break;
      case "remove": parts.push(`Removed ${name}`); break;
      case "reorder": parts.push(`Reordered ${name}`); break;
    }
  }
  return parts.join(", ");
}

export default function WEChatPanel({
  projectId,
  pageId,
  venueId,
  projectLanguage,
  isOffline,
  onDiffApplied,
  onOpenCodePanel,
}: WEChatPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [langDismissed, setLangDismissed] = useState(() => {
    return localStorage.getItem(`we_lang_dismissed_${projectId}`) === "true";
  });
  const [multiPageConfirm, setMultiPageConfirm] = useState<{ diff: Diff; pages: string[] } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: byokStatus } = useQuery<{ hasKey: boolean }>({
    queryKey: ["/api/we/ai/byok-status", venueId],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/workspaces/${venueId}/ai-status`);
        if (!res.ok) return { hasKey: false };
        const data = await res.json();
        return { hasKey: !!data.hasKey || !!data.apiKey || data.status === "connected" };
      } catch {
        return { hasKey: false };
      }
    },
    enabled: !!venueId,
  });

  const hasKey = byokStatus?.hasKey ?? false;
  const lang = getLanguage(projectLanguage);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startCooldown = useCallback(() => {
    setCooldown(5);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const dismissLang = useCallback((choice: string) => {
    setLangDismissed(true);
    localStorage.setItem(`we_lang_dismissed_${projectId}`, "true");
  }, [projectId]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || cooldown > 0 || isOffline || !hasKey) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);
    startCooldown();

    try {
      const history = messages.map((m) => ({ role: m.role === "error" ? "assistant" : m.role, content: m.content }));

      const res = await apiRequest("POST", `/api/we/ai/${projectId}/${pageId}/chat?venueId=${venueId}`, {
        message: currentInput,
        conversationHistory: history,
      });

      const data = await res.json();

      if (data.diff) {
        const diff = data.diff as Diff;
        const affectedPages = diff.changes?.filter((c: any) => c.pageId && c.pageId !== pageId);

        if (affectedPages && affectedPages.length > 0) {
          const pageNames = affectedPages.map((c: any) => c.pageName || c.pageId);
          setMultiPageConfirm({ diff, pages: pageNames });
        } else {
          onDiffApplied(diff);
        }

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: diffSummary(diff),
          diff,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "error",
        content: err.message || "Something went wrong. Your canvas was not changed.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, cooldown, isOffline, hasKey, messages, projectId, pageId, venueId, startCooldown, onDiffApplied]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (collapsed) {
    return (
      <div className="w-10 border-l bg-background flex flex-col items-center pt-2" data-testid="we-chat-collapsed">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(false)} data-testid="btn-expand-chat">
          <PanelRightOpen className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-background flex flex-col relative" data-testid="we-chat-panel">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="font-medium text-sm">AI Assistant</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setMessages([])}
            data-testid="btn-clear-chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCollapsed(true)}
            data-testid="btn-collapse-chat"
          >
            <PanelRightClose className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {!hasKey && (
        <div className="absolute inset-0 z-10 bg-background/95 flex flex-col items-center justify-center p-6 text-center" data-testid="we-byok-overlay">
          <AlertTriangle className="w-10 h-10 text-amber-500 mb-3" />
          <p className="font-medium mb-2">Connect your AI key to start building</p>
          <Button asChild data-testid="btn-connect-key">
            <a href={`/${venueId}/connections/ai-providers`}>
              <ExternalLink className="w-4 h-4 mr-1" />
              Connect API Key
            </a>
          </Button>
        </div>
      )}

      {!langDismissed && (
        <div className="px-3 py-2 border-b">
          {lang ? (
            <div className="flex items-center gap-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded px-2 py-1.5" data-testid="we-lang-badge">
              <span>{lang.flag}</span>
              <span>Building in {lang.name}</span>
            </div>
          ) : (
            <div className="space-y-2" data-testid="we-lang-warning">
              <div className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded px-2 py-1.5">
                No language selected. Defaulting to English.
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs h-7 flex-1" onClick={() => dismissLang("select")} data-testid="btn-select-lang">
                  Select Language
                </Button>
                <Button size="sm" variant="ghost" className="text-xs h-7 flex-1" onClick={() => dismissLang("english")} data-testid="btn-continue-english">
                  Continue in English
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3" data-testid="we-chat-messages">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm mt-8 px-4">
            Describe what you want to change on your page. The AI will update the canvas for you.
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-muted text-foreground"
                  : msg.role === "error"
                  ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  : "bg-primary/10 text-foreground"
              }`}
              data-testid={`chat-msg-${msg.role}-${msg.id}`}
            >
              {msg.content}
              {msg.code && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full text-xs"
                  onClick={() => onOpenCodePanel(msg.code!)}
                  data-testid={`btn-open-code-${msg.id}`}
                >
                  <Code className="w-3 h-3 mr-1" />
                  Open in Code Editor
                </Button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-primary/10 rounded-lg px-3 py-2" data-testid="we-typing-indicator">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-3" data-testid="we-chat-input-area">
        {isOffline && (
          <div className="flex items-center gap-1 text-xs text-amber-600 mb-2" data-testid="we-chat-offline">
            <WifiOff className="w-3 h-3" />
            AI unavailable while offline
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe a change..."
            className="resize-none min-h-[40px] max-h-[120px] text-sm"
            rows={1}
            disabled={isOffline || !hasKey}
            data-testid="input-chat-message"
          />
          <Button
            size="icon"
            className="shrink-0 h-10 w-10"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || cooldown > 0 || isOffline || !hasKey}
            data-testid="btn-send-message"
          >
            {cooldown > 0 ? (
              <span className="text-xs font-mono">{cooldown}s</span>
            ) : isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">Ctrl+Enter to send</p>
      </div>

      {multiPageConfirm && (
        <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center p-4" data-testid="we-multipage-modal">
          <div className="bg-background rounded-lg p-5 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold mb-2">Multi-page change</h3>
            <p className="text-sm text-muted-foreground mb-3">
              This change will affect {multiPageConfirm.pages.length + 1} pages:
              current page, {multiPageConfirm.pages.join(", ")}
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  onDiffApplied(multiPageConfirm.diff);
                  setMultiPageConfirm(null);
                }}
                data-testid="btn-confirm-multipage"
              >
                Apply to all pages
              </Button>
              <Button
                variant="outline"
                onClick={() => setMultiPageConfirm(null)}
                data-testid="btn-cancel-multipage"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
