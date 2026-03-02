import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, CheckCircle2 } from "lucide-react";

export interface KeywordSuggestion {
  id: string;
  text: string;
  type: "primary" | "secondary" | "longtail";
  serviceName: string;
  accepted: boolean | null;
}

interface KeywordReviewPanelProps {
  suggestions: KeywordSuggestion[];
  onUpdate: (suggestions: KeywordSuggestion[]) => void;
}

export default function KeywordReviewPanel({ suggestions, onUpdate }: KeywordReviewPanelProps) {
  const accepted = suggestions.filter((s) => s.accepted === true);
  const pending = suggestions.filter((s) => s.accepted === null);
  const rejected = suggestions.filter((s) => s.accepted === false);

  const toggleSuggestion = (id: string, value: boolean) => {
    onUpdate(suggestions.map((s) => s.id === id ? { ...s, accepted: value } : s));
  };

  const acceptAll = () => {
    onUpdate(suggestions.map((s) => ({ ...s, accepted: true })));
  };

  const groupedByService = suggestions.reduce<Record<string, KeywordSuggestion[]>>((acc, s) => {
    if (!acc[s.serviceName]) acc[s.serviceName] = [];
    acc[s.serviceName].push(s);
    return acc;
  }, {});

  return (
    <Card data-testid="keyword-review-panel">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Keyword Suggestions</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="default" data-testid="badge-accepted-count">
              {accepted.length} accepted
            </Badge>
            <Badge variant="secondary" data-testid="badge-pending-count">
              {pending.length} pending
            </Badge>
            {rejected.length > 0 && (
              <Badge variant="outline" data-testid="badge-rejected-count">
                {rejected.length} rejected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {pending.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={acceptAll}
            className="mb-3 w-full"
            data-testid="button-accept-all"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Accept All ({suggestions.length})
          </Button>
        )}

        <div className="space-y-4" data-testid="list-keyword-groups">
          {Object.entries(groupedByService).map(([serviceName, keywords]) => (
            <div key={serviceName}>
              <p className="text-sm font-medium mb-2" data-testid={`text-service-group-${serviceName}`}>
                {serviceName}
              </p>
              <div className="space-y-1">
                {keywords.map((kw) => (
                  <div
                    key={kw.id}
                    className={`flex items-center justify-between p-2 rounded text-sm transition-colors ${
                      kw.accepted === true
                        ? "bg-green-50 dark:bg-green-950/20"
                        : kw.accepted === false
                        ? "bg-red-50 dark:bg-red-950/20 opacity-60"
                        : "bg-card hover:bg-accent/30"
                    }`}
                    data-testid={`keyword-row-${kw.id}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{kw.text}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 shrink-0"
                      >
                        {kw.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant={kw.accepted === true ? "default" : "ghost"}
                        size="sm"
                        onClick={() => toggleSuggestion(kw.id, true)}
                        className="h-7 w-7 p-0"
                        data-testid={`button-accept-${kw.id}`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant={kw.accepted === false ? "destructive" : "ghost"}
                        size="sm"
                        onClick={() => toggleSuggestion(kw.id, false)}
                        className="h-7 w-7 p-0"
                        data-testid={`button-reject-${kw.id}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
