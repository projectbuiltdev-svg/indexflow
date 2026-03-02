import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import {
  Plus,
  X,
  Loader2,
  Sparkles,
  PenLine,
  AlertTriangle,
  CheckCircle2,
  Briefcase,
  Search,
} from "lucide-react";
import ServiceLocationMatrix, { type MatrixEntry } from "../ServiceLocationMatrix";
import KeywordReviewPanel, { type KeywordSuggestion } from "../KeywordReviewPanel";
import type { ResolvedLocation } from "../location-modes/RadiusMode";

const MAX_SERVICES = 20;
const MAX_KEYWORDS_PER_PAGE = 5;

export interface ServiceKeyword {
  serviceName: string;
  primary: string;
  secondary: string[];
  longtail: string;
}

export interface ServicesKeywordsData {
  services: string[];
  keywords: ServiceKeyword[];
  matrix: MatrixEntry[];
}

interface ServicesKeywordsStepProps {
  onComplete: (data: ServicesKeywordsData) => void;
  initialData?: ServicesKeywordsData | null;
  locations: ResolvedLocation[];
  workspaceId?: string;
  businessCategory?: string;
}

export default function ServicesKeywordsStep({
  onComplete,
  initialData,
  locations,
  workspaceId,
  businessCategory,
}: ServicesKeywordsStepProps) {
  const [services, setServices] = useState<string[]>(initialData?.services || []);
  const [newService, setNewService] = useState("");
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<ServiceKeyword[]>(initialData?.keywords || []);
  const [matrix, setMatrix] = useState<MatrixEntry[]>(initialData?.matrix || []);
  const [keywordMode, setKeywordMode] = useState<"manual" | "suggest">("manual");
  const [suggestions, setSuggestions] = useState<KeywordSuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const addService = useCallback(() => {
    const name = newService.trim();
    if (!name) return;

    if (services.some((s) => s.toLowerCase() === name.toLowerCase())) {
      setServiceError("This service already exists");
      return;
    }

    if (services.length >= MAX_SERVICES) {
      setServiceError(`Maximum ${MAX_SERVICES} services per campaign`);
      return;
    }

    setServices([...services, name]);
    setKeywords([...keywords, { serviceName: name, primary: "", secondary: [], longtail: "" }]);
    setNewService("");
    setServiceError(null);
  }, [newService, services, keywords]);

  const removeService = useCallback((index: number) => {
    const updated = services.filter((_, i) => i !== index);
    const updatedKw = keywords.filter((_, i) => i !== index);
    const updatedMatrix = matrix.filter((m) => m.serviceIndex !== index).map((m) => ({
      ...m,
      serviceIndex: m.serviceIndex > index ? m.serviceIndex - 1 : m.serviceIndex,
    }));
    setServices(updated);
    setKeywords(updatedKw);
    setMatrix(updatedMatrix);
  }, [services, keywords, matrix]);

  const updateKeyword = useCallback((index: number, field: keyof ServiceKeyword, value: string | string[]) => {
    setKeywords(keywords.map((kw, i) => i === index ? { ...kw, [field]: value } : kw));
  }, [keywords]);

  const handleSuggest = useCallback(async () => {
    setIsSuggesting(true);
    setSuggestError(null);

    try {
      const res = await apiRequest("POST", "/api/pseo/keywords/suggest", {
        services,
        locations: locations.filter((l) => !l.excluded).slice(0, 5).map((l) => l.name),
        businessCategory: businessCategory || "general",
        workspaceId: workspaceId || "",
      });
      const data = await res.json();

      if (data.error) {
        setSuggestError(data.error);
        return;
      }

      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      setSuggestError(err.message || "Failed to generate keyword suggestions");
    } finally {
      setIsSuggesting(false);
    }
  }, [services, locations, businessCategory, workspaceId]);

  const applyAcceptedSuggestions = useCallback(() => {
    const accepted = suggestions.filter((s) => s.accepted === true);
    const updatedKeywords = [...keywords];

    for (const sug of accepted) {
      const idx = services.findIndex((s) => s === sug.serviceName);
      if (idx === -1) continue;

      const kw = updatedKeywords[idx];
      if (sug.type === "primary" && !kw.primary) {
        kw.primary = sug.text;
      } else if (sug.type === "secondary") {
        if (!kw.secondary.includes(sug.text)) {
          kw.secondary = [...kw.secondary, sug.text];
        }
      } else if (sug.type === "longtail" && !kw.longtail) {
        kw.longtail = sug.text;
      }
    }

    setKeywords(updatedKeywords);
  }, [suggestions, keywords, services]);

  const getKeywordCount = (kw: ServiceKeyword): number => {
    let count = 0;
    if (kw.primary) count++;
    count += kw.secondary.length;
    if (kw.longtail) count++;
    return count;
  };

  const allKeywordsValid = services.length > 0 && keywords.every((kw) => {
    return kw.primary.trim().length > 0 && getKeywordCount(kw) <= MAX_KEYWORDS_PER_PAGE;
  });

  const canConfirm = services.length > 0 && allKeywordsValid;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onComplete({ services, keywords, matrix });
  };

  return (
    <div className="space-y-6" data-testid="services-keywords-step">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Services
          </CardTitle>
          <CardDescription>
            Add the services your campaign will target. Each service will be combined with every location to create unique pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Plumbing, Emergency Locksmith, SEO Consulting"
              value={newService}
              onChange={(e) => { setNewService(e.target.value); setServiceError(null); }}
              onKeyDown={(e) => e.key === "Enter" && addService()}
              data-testid="input-new-service"
            />
            <Button
              onClick={addService}
              disabled={!newService.trim() || services.length >= MAX_SERVICES}
              data-testid="button-add-service"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {serviceError && (
            <div className="flex items-center gap-2 text-sm text-destructive mt-2" data-testid="service-error">
              <AlertTriangle className="h-4 w-4" />
              {serviceError}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-muted-foreground">
              {services.length} / {MAX_SERVICES} services
            </span>
          </div>

          {services.length > 0 && (
            <div className="space-y-2 mt-3" data-testid="list-services">
              {services.map((service, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg border bg-card"
                  data-testid={`service-row-${i}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Briefcase className="h-4 w-4 text-primary shrink-0" />
                    <span className="font-medium text-sm truncate">{service}</span>
                    {keywords[i]?.primary && (
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        <Search className="h-3 w-3 mr-0.5" />
                        {keywords[i].primary}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(i)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                    data-testid={`button-remove-service-${i}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {services.length > 0 && locations.length > 0 && (
        <ServiceLocationMatrix
          services={services}
          locations={locations}
          matrix={matrix}
          onMatrixChange={setMatrix}
        />
      )}

      {services.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-5 w-5" />
              Keywords
            </CardTitle>
            <CardDescription>
              Assign target keywords for each service. Maximum {MAX_KEYWORDS_PER_PAGE} keywords per page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={keywordMode} onValueChange={(v) => setKeywordMode(v as "manual" | "suggest")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual" data-testid="tab-manual-keywords">
                  <PenLine className="h-4 w-4 mr-2" />
                  Manual Input
                </TabsTrigger>
                <TabsTrigger value="suggest" data-testid="tab-suggest-keywords">
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Suggest
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="mt-4">
                <div className="space-y-4" data-testid="list-manual-keywords">
                  {services.map((service, i) => {
                    const kw = keywords[i];
                    if (!kw) return null;
                    const count = getKeywordCount(kw);
                    const overLimit = count > MAX_KEYWORDS_PER_PAGE;

                    return (
                      <Card key={i} className={overLimit ? "border-destructive" : ""}>
                        <CardContent className="pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{service}</span>
                            <Badge
                              variant={overLimit ? "destructive" : "secondary"}
                              className="text-xs"
                              data-testid={`badge-keyword-count-${i}`}
                            >
                              {count} / {MAX_KEYWORDS_PER_PAGE}
                            </Badge>
                          </div>

                          <div>
                            <label className="text-xs text-muted-foreground">Primary keyword *</label>
                            <Input
                              placeholder="Main keyword for this service"
                              value={kw.primary}
                              onChange={(e) => updateKeyword(i, "primary", e.target.value)}
                              className="mt-1"
                              data-testid={`input-primary-keyword-${i}`}
                            />
                          </div>

                          <div>
                            <label className="text-xs text-muted-foreground">Secondary keywords (comma separated)</label>
                            <Input
                              placeholder="keyword 2, keyword 3"
                              value={kw.secondary.join(", ")}
                              onChange={(e) => {
                                const parts = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                                updateKeyword(i, "secondary", parts);
                              }}
                              className="mt-1"
                              data-testid={`input-secondary-keywords-${i}`}
                            />
                          </div>

                          <div>
                            <label className="text-xs text-muted-foreground">Longtail keyword (optional)</label>
                            <Input
                              placeholder="Long-tail keyword phrase"
                              value={kw.longtail}
                              onChange={(e) => updateKeyword(i, "longtail", e.target.value)}
                              className="mt-1"
                              data-testid={`input-longtail-keyword-${i}`}
                            />
                          </div>

                          {overLimit && (
                            <p className="text-xs text-destructive flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Too many keywords — remove some to continue
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="suggest" className="mt-4 space-y-4">
                <Button
                  onClick={handleSuggest}
                  disabled={isSuggesting || services.length === 0}
                  className="w-full"
                  data-testid="button-suggest-keywords"
                >
                  {isSuggesting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Suggestions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Suggest Keywords for {services.length} Service{services.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>

                {suggestError && (
                  <div className="flex items-center gap-2 text-sm text-destructive" data-testid="suggest-error">
                    <AlertTriangle className="h-4 w-4" />
                    {suggestError}
                  </div>
                )}

                {suggestions.length > 0 && (
                  <>
                    <KeywordReviewPanel suggestions={suggestions} onUpdate={setSuggestions} />
                    {suggestions.some((s) => s.accepted === true) && (
                      <Button
                        onClick={applyAcceptedSuggestions}
                        variant="outline"
                        className="w-full"
                        data-testid="button-apply-suggestions"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Apply Accepted Keywords
                      </Button>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleConfirm}
          disabled={!canConfirm}
          data-testid="button-confirm-services"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Confirm Services & Keywords
        </Button>
      </div>
    </div>
  );
}
