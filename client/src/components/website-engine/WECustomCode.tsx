import { useState, useCallback, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { X, Check, AlertTriangle, Loader2 } from "lucide-react";

const MonacoEditor = lazy(() => import("@monaco-editor/react"));

interface WECustomCodeProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (code: { html: string; css: string; js: string }) => void;
  initialCode?: { html: string; css: string; js: string };
  isAiGenerated?: boolean;
  blockName?: string;
}

type Tab = "html" | "css" | "js";

function validateHtml(html: string): string | null {
  const openTags: string[] = [];
  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*\/?>/g;
  const selfClosing = new Set(["br", "hr", "img", "input", "meta", "link", "area", "base", "col", "embed", "source", "track", "wbr"]);
  let match;
  while ((match = tagRegex.exec(html)) !== null) {
    const full = match[0];
    const tag = match[1].toLowerCase();
    if (selfClosing.has(tag) || full.endsWith("/>")) continue;
    if (full.startsWith("</")) {
      if (openTags.length === 0 || openTags[openTags.length - 1] !== tag) {
        return `Unexpected closing tag </${tag}>`;
      }
      openTags.pop();
    } else {
      openTags.push(tag);
    }
  }
  if (openTags.length > 0) return `Unclosed tag <${openTags[openTags.length - 1]}>`;
  return null;
}

function validateCss(css: string): string | null {
  let depth = 0;
  for (const ch of css) {
    if (ch === "{") depth++;
    if (ch === "}") depth--;
    if (depth < 0) return "Unexpected closing brace";
  }
  if (depth > 0) return "Unclosed brace in CSS";
  return null;
}

function validateJs(js: string): string | null {
  if (!js.trim()) return null;
  let depth = 0;
  for (const ch of js) {
    if (ch === "{" || ch === "(") depth++;
    if (ch === "}" || ch === ")") depth--;
    if (depth < 0) return "Unexpected closing bracket/brace";
  }
  if (depth > 0) return "Unclosed bracket/brace in JavaScript";
  return null;
}

export default function WECustomCode({
  isOpen,
  onClose,
  onApply,
  initialCode,
  isAiGenerated = false,
  blockName,
}: WECustomCodeProps) {
  const [activeTab, setActiveTab] = useState<Tab>("html");
  const [html, setHtml] = useState(initialCode?.html || "");
  const [css, setCss] = useState(initialCode?.css || "");
  const [js, setJs] = useState(initialCode?.js || "");
  const [showBanner, setShowBanner] = useState(isAiGenerated);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const values: Record<Tab, string> = { html, css, js };
  const setters: Record<Tab, (v: string) => void> = { html: setHtml, css: setCss, js: setJs };
  const languages: Record<Tab, string> = { html: "html", css: "css", js: "javascript" };

  const validate = useCallback((): boolean => {
    const htmlErr = validateHtml(html);
    if (htmlErr) { setError(htmlErr); return false; }
    const cssErr = validateCss(css);
    if (cssErr) { setError(cssErr); return false; }
    const jsErr = validateJs(js);
    if (jsErr) { setError(jsErr); return false; }
    setError(null);
    return true;
  }, [html, css, js]);

  const handleApply = useCallback(() => {
    if (!validate()) return;
    onApply({ html, css, js });
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  }, [html, css, js, validate, onApply]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[600px] max-w-full bg-background border-l shadow-2xl flex flex-col" data-testid="we-code-panel">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold">Code Editor</h3>
          {blockName && <span className="text-xs text-muted-foreground">({blockName})</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleApply}
            disabled={!!error}
            data-testid="btn-apply-code"
          >
            {applied ? (
              <><Check className="w-4 h-4 mr-1" /> Applied</>
            ) : (
              "Apply to Page"
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="btn-close-code">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showBanner && (
        <div className="flex items-center justify-between px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b" data-testid="we-ai-code-banner">
          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            AI-generated code — review before applying
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowBanner(false)} data-testid="btn-dismiss-banner">
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <div className="flex border-b">
        {(["html", "css", "js"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setError(null); }}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`tab-${tab}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="px-4 py-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/10 border-b">
        This code applies to the selected block only. It will not affect other blocks or pages.
      </div>

      <div className="flex-1 overflow-hidden" data-testid="we-code-editor">
        <Suspense fallback={<div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin" /></div>}>
          <MonacoEditor
            height="100%"
            language={languages[activeTab]}
            value={values[activeTab]}
            onChange={(v) => { setters[activeTab](v || ""); setError(null); }}
            theme="vs-dark"
            options={{
              fontSize: 13,
              minimap: { enabled: false },
              lineNumbers: "on",
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 8 },
            }}
          />
        </Suspense>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm border-t" data-testid="we-code-error">
          Fix syntax errors before applying: {error}
        </div>
      )}
    </div>
  );
}
