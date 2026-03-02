import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
  Rocket,
  FileCode2,
  MapPin,
  Briefcase,
  Search,
  LayoutGrid,
  DollarSign,
  Link2,
  Cpu,
  Shield,
  Image,
  Globe,
} from "lucide-react";
import { calculatePageCount } from "../PageCountCalculator";
import type { TemplateData } from "./TemplateUploadStep";
import type { LocationsData } from "./LocationSetupStep";
import type { ServicesKeywordsData } from "./ServicesKeywordsStep";

interface ByokModel {
  model: string;
  provider: string;
  costPer665Pages: number;
  costPerPage: number;
}

interface ByokValidation {
  hasValidAiKey: boolean;
  aiKeySource: string;
  hasImageBank: boolean;
  gscVerified: boolean;
}

interface ConfirmActivateStepProps {
  templateData: TemplateData;
  locationsData: LocationsData;
  servicesData: ServicesKeywordsData;
  workspaceId: string;
  campaignName: string;
  onComplete: (campaignId: string) => void;
}

export default function ConfirmActivateStep({
  templateData,
  locationsData,
  servicesData,
  workspaceId,
  campaignName,
  onComplete,
}: ConfirmActivateStepProps) {
  const [urlStructure, setUrlStructure] = useState<"location-first" | "service-first" | "">("");
  const [selectedModel, setSelectedModel] = useState("");
  const [models, setModels] = useState<ByokModel[]>([]);
  const [validation, setValidation] = useState<ByokValidation | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [isLoadingValidation, setIsLoadingValidation] = useState(true);
  const [reviewed, setReviewed] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [activateError, setActivateError] = useState<string | null>(null);

  const activeLocations = locationsData.locations.filter((l) => !l.excluded);
  const pageBreakdown = calculatePageCount(servicesData.services.length, activeLocations.length);

  const firstService = servicesData.services[0] || "service";
  const firstLocation = activeLocations[0]?.name || "location";
  const firstLocationSlug = slugify(firstLocation);
  const firstServiceSlug = slugify(firstService);

  const countries = useMemo(() => {
    const set = new Set(activeLocations.map((l) => l.country).filter(Boolean));
    return Array.from(set);
  }, [activeLocations]);

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await apiRequest("GET", `/api/pseo/wizard/byok-models?workspaceId=${workspaceId}`);
        const data = await res.json();
        setModels(data.models || []);
        if (data.models?.length > 0) {
          setSelectedModel(data.models[0].model);
        }
      } catch {
        setModels([]);
      } finally {
        setIsLoadingModels(false);
      }
    }

    async function fetchValidation() {
      try {
        const res = await apiRequest("GET", `/api/pseo/wizard/validate-byok?workspaceId=${workspaceId}`);
        const data = await res.json();
        setValidation(data);
      } catch {
        setValidation({ hasValidAiKey: false, aiKeySource: "platform", hasImageBank: false, gscVerified: false });
      } finally {
        setIsLoadingValidation(false);
      }
    }

    fetchModels();
    fetchValidation();
  }, [workspaceId]);

  const estimatedCost = useMemo(() => {
    if (!selectedModel) return 0;
    const model = models.find((m) => m.model === selectedModel);
    if (!model) return 0;
    return Math.ceil((pageBreakdown.totalPages / 665) * model.costPer665Pages * 100) / 100;
  }, [selectedModel, models, pageBreakdown.totalPages]);

  const canActivate =
    urlStructure !== "" &&
    reviewed &&
    validation?.hasValidAiKey &&
    !isActivating;

  const handleActivate = async () => {
    if (!canActivate) return;
    setIsActivating(true);
    setActivateError(null);

    try {
      const body = {
        workspaceId,
        name: campaignName,
        urlStructure,
        templateHtml: templateData.html,
        templateLockedZones: templateData.lockedZones.map((z) => z.zoneKey),
        aiModel: selectedModel || "gpt-4o-mini",
        totalPages: pageBreakdown.totalPages,
        services: servicesData.services.map((name, i) => ({
          name,
          keywords: servicesData.keywords[i]
            ? [
                servicesData.keywords[i].primary,
                ...servicesData.keywords[i].secondary,
                servicesData.keywords[i].longtail,
              ].filter(Boolean)
            : [],
        })),
        locations: activeLocations.map((l) => ({
          name: l.name,
          lat: l.lat,
          lng: l.lng,
          state: l.state,
          country: l.country,
          excluded: false,
        })),
        matrix: servicesData.matrix,
      };

      const res = await apiRequest("POST", "/api/pseo/campaigns", body);
      const data = await res.json();

      if (data.error) {
        setActivateError(data.error);
        return;
      }

      onComplete(data.id);
    } catch (err: any) {
      setActivateError(err.message || "Failed to activate campaign");
    } finally {
      setIsActivating(false);
    }
  };

  const totalKeywords = servicesData.keywords.reduce((sum, kw) => {
    let count = 0;
    if (kw.primary) count++;
    count += kw.secondary.length;
    if (kw.longtail) count++;
    return sum + count;
  }, 0);

  const activeMatrixCombos = (() => {
    const total = servicesData.services.length * activeLocations.length;
    const deactivated = servicesData.matrix.filter((m) => !m.active).length;
    return total - deactivated;
  })();

  return (
    <div className="space-y-6" data-testid="confirm-activate-step">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Campaign Summary
          </CardTitle>
          <CardDescription>Review your campaign configuration before activation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SummaryCard
              icon={<FileCode2 className="h-4 w-4" />}
              label="Template"
              value={templateData.sourceValue}
              detail={`${templateData.lockedZones.length} locked · ${templateData.dynamicZones.length} dynamic zones`}
              testId="summary-template"
            />
            <SummaryCard
              icon={<MapPin className="h-4 w-4" />}
              label="Locations"
              value={`${activeLocations.length} locations`}
              detail={`${countries.length} countr${countries.length !== 1 ? "ies" : "y"} · ${locationsData.mode} mode`}
              testId="summary-locations"
            />
            <SummaryCard
              icon={<Briefcase className="h-4 w-4" />}
              label="Services"
              value={`${servicesData.services.length} services`}
              detail={servicesData.services.slice(0, 3).join(", ") + (servicesData.services.length > 3 ? ` +${servicesData.services.length - 3}` : "")}
              testId="summary-services"
            />
            <SummaryCard
              icon={<Search className="h-4 w-4" />}
              label="Keywords"
              value={`${totalKeywords} keywords`}
              detail={`${servicesData.services.length} services targeted`}
              testId="summary-keywords"
            />
            <SummaryCard
              icon={<LayoutGrid className="h-4 w-4" />}
              label="Matrix"
              value={`${activeMatrixCombos} active combos`}
              detail={`${servicesData.services.length} × ${activeLocations.length} grid`}
              testId="summary-matrix"
            />
            <SummaryCard
              icon={<Globe className="h-4 w-4" />}
              label="Estimated Pages"
              value={`${pageBreakdown.totalPages.toLocaleString()} pages`}
              detail={`${pageBreakdown.servicePages} service + ${pageBreakdown.locationPages} location + ${pageBreakdown.hubPages} hub`}
              testId="summary-pages"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Link2 className="h-4 w-4" />
            URL Structure
          </CardTitle>
          <CardDescription>
            Choose how page URLs are structured. This cannot be changed after activation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                urlStructure === "location-first"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/30"
              }`}
              data-testid="radio-location-first"
            >
              <input
                type="radio"
                name="urlStructure"
                value="location-first"
                checked={urlStructure === "location-first"}
                onChange={() => setUrlStructure("location-first")}
                className="sr-only"
              />
              <span className="font-medium text-sm">Location First</span>
              <code className="text-xs text-muted-foreground mt-2 bg-muted px-2 py-1 rounded">
                /{firstLocationSlug}/{firstServiceSlug}
              </code>
            </label>

            <label
              className={`flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                urlStructure === "service-first"
                  ? "border-primary bg-primary/5"
                  : "border-muted hover:border-primary/30"
              }`}
              data-testid="radio-service-first"
            >
              <input
                type="radio"
                name="urlStructure"
                value="service-first"
                checked={urlStructure === "service-first"}
                onChange={() => setUrlStructure("service-first")}
                className="sr-only"
              />
              <span className="font-medium text-sm">Service First</span>
              <code className="text-xs text-muted-foreground mt-2 bg-muted px-2 py-1 rounded">
                /{firstServiceSlug}/{firstLocationSlug}
              </code>
            </label>
          </div>

          {urlStructure && (
            <div className="flex items-start gap-2 mt-3 p-2 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-xs">URL structure is permanent after activation and cannot be changed.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cpu className="h-4 w-4" />
            AI Model
          </CardTitle>
          <CardDescription>Select the AI model to generate page content.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingModels ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading available models...
            </div>
          ) : models.length === 0 ? (
            <div className="flex items-start gap-2 p-3 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-sm">
                No AI models available. Configure an AI provider key in Connections → AI Providers.
              </p>
            </div>
          ) : (
            <>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger data-testid="select-ai-model">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((m) => (
                    <SelectItem key={m.model} value={m.model}>
                      {m.provider} — {m.model} (${m.costPer665Pages}/665 pages)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-3 p-3 rounded border bg-muted/30" data-testid="cost-estimator">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Estimated AI Cost</span>
                </div>
                <p className="text-2xl font-bold" data-testid="text-estimated-cost">
                  ${estimatedCost.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pageBreakdown.totalPages.toLocaleString()} pages × ${models.find((m) => m.model === selectedModel)?.costPerPage?.toFixed(4) || "0"}/page
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4" />
            Pre-Activation Checks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingValidation ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              Validating configuration...
            </div>
          ) : validation ? (
            <div className="space-y-3">
              <ValidationRow
                status={validation.hasValidAiKey ? "pass" : "fail"}
                label="AI API Key"
                detail={validation.hasValidAiKey ? `Valid key (${validation.aiKeySource})` : "No valid AI key configured — required to generate content"}
                testId="check-ai-key"
              />
              <ValidationRow
                status={validation.hasImageBank ? "pass" : "warn"}
                label="Image Bank"
                detail={validation.hasImageBank ? "Image provider connected" : "No image provider connected — pages will be generated without images"}
                testId="check-image-bank"
              />
              <ValidationRow
                status={validation.gscVerified ? "pass" : "info"}
                label="Google Search Console"
                detail={validation.gscVerified ? "Property verified" : "GSC not verified — indexing requests will be queued until verified"}
                testId="check-gsc"
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer" data-testid="label-review-checkbox">
              <Checkbox
                checked={reviewed}
                onCheckedChange={(v) => setReviewed(!!v)}
                data-testid="checkbox-reviewed"
              />
              <span className="text-sm">
                I have reviewed the campaign summary and confirm that the template, locations, services, and keywords are correct.
              </span>
            </label>

            {activateError && (
              <div className="flex items-start gap-2 p-3 rounded border border-destructive text-destructive text-sm" data-testid="activate-error">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                {activateError}
              </div>
            )}

            <Button
              size="lg"
              onClick={handleActivate}
              disabled={!canActivate}
              className="w-full"
              data-testid="button-activate-campaign"
            >
              {isActivating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Activating Campaign...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Activate Campaign ({pageBreakdown.totalPages.toLocaleString()} pages)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  testId: string;
}) {
  return (
    <div className="p-3 rounded-lg border bg-card" data-testid={testId}>
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="font-semibold text-sm">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
    </div>
  );
}

function ValidationRow({
  status,
  label,
  detail,
  testId,
}: {
  status: "pass" | "fail" | "warn" | "info";
  label: string;
  detail: string;
  testId: string;
}) {
  const config = {
    pass: { icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, bg: "bg-green-50 dark:bg-green-950/20" },
    fail: { icon: <AlertTriangle className="h-4 w-4 text-red-500" />, bg: "bg-red-50 dark:bg-red-950/20" },
    warn: { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, bg: "bg-yellow-50 dark:bg-yellow-950/20" },
    info: { icon: <Info className="h-4 w-4 text-blue-500" />, bg: "bg-blue-50 dark:bg-blue-950/20" },
  }[status];

  return (
    <div className={`flex items-start gap-3 p-3 rounded ${config.bg}`} data-testid={testId}>
      <div className="shrink-0 mt-0.5">{config.icon}</div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{detail}</p>
      </div>
    </div>
  );
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
