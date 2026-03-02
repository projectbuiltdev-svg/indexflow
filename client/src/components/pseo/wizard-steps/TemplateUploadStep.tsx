import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import {
  Lock,
  Unlock,
  Globe,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Eye,
  Palette,
  Type,
  Image,
  RefreshCw,
  FileCode2,
} from "lucide-react";

interface TemplateZoneDescriptor {
  zoneKey: string;
  label: string;
  elementType: string;
  cssSelector: string;
  contentSummary: string;
  confidenceScore: number;
  zoneType: "locked" | "dynamic";
  defaultContent: string;
}

interface TemplateParseResult {
  lockedZones: TemplateZoneDescriptor[];
  dynamicZones: TemplateZoneDescriptor[];
  primaryColour: string | null;
  fonts: string[];
  logoUrl: string | null;
  hasMinimumDynamicZones: boolean;
  error?: string;
}

export interface TemplateData {
  html: string;
  source: "file" | "url";
  sourceValue: string;
  lockedZones: TemplateZoneDescriptor[];
  dynamicZones: TemplateZoneDescriptor[];
  primaryColour: string | null;
  fonts: string[];
  logoUrl: string | null;
  overrides: Record<string, "locked" | "dynamic">;
}

interface TemplateUploadStepProps {
  onComplete: (data: TemplateData) => void;
  initialData?: TemplateData | null;
}

export default function TemplateUploadStep({ onComplete, initialData }: TemplateUploadStepProps) {
  const [inputMethod, setInputMethod] = useState<"file" | "url">(initialData?.source || "file");
  const [url, setUrl] = useState(initialData?.source === "url" ? initialData.sourceValue : "");
  const [fileName, setFileName] = useState(initialData?.source === "file" ? initialData.sourceValue : "");
  const [htmlContent, setHtmlContent] = useState(initialData?.html || "");
  const [parseResult, setParseResult] = useState<TemplateParseResult | null>(
    initialData ? {
      lockedZones: initialData.lockedZones,
      dynamicZones: initialData.dynamicZones,
      primaryColour: initialData.primaryColour,
      fonts: initialData.fonts,
      logoUrl: initialData.logoUrl,
      hasMinimumDynamicZones: initialData.dynamicZones.length > 0,
    } : null
  );
  const [overrides, setOverrides] = useState<Record<string, "locked" | "dynamic">>(initialData?.overrides || {});
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.name.endsWith(".html") && !file.name.endsWith(".htm")) {
      setParseError("Please upload an HTML file (.html or .htm)");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtmlContent(content);
      setFileName(file.name);
      setParseError(null);
      setParseResult(null);
      setOverrides({});
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleParse = async () => {
    setIsParsing(true);
    setParseError(null);

    try {
      const body = inputMethod === "url"
        ? { url }
        : { html: htmlContent };

      const res = await apiRequest("POST", "/api/pseo/template/parse", body);
      const result: TemplateParseResult = await res.json();

      if (result.error) {
        setParseError(result.error);
      }

      setParseResult(result);
      setOverrides({});
    } catch (err: any) {
      setParseError(err.message || "Failed to parse template");
    } finally {
      setIsParsing(false);
    }
  };

  const toggleZone = (zoneKey: string, currentType: "locked" | "dynamic") => {
    const newType = currentType === "locked" ? "dynamic" : "locked";
    setOverrides((prev) => ({ ...prev, [zoneKey]: newType }));
  };

  const getEffectiveType = (zone: TemplateZoneDescriptor): "locked" | "dynamic" => {
    return overrides[zone.zoneKey] || zone.zoneType;
  };

  const getEffectiveZones = () => {
    if (!parseResult) return { locked: [], dynamic: [] };

    const allZones = [...parseResult.lockedZones, ...parseResult.dynamicZones];
    const locked: TemplateZoneDescriptor[] = [];
    const dynamic: TemplateZoneDescriptor[] = [];

    for (const zone of allZones) {
      if (getEffectiveType(zone) === "locked") {
        locked.push(zone);
      } else {
        dynamic.push(zone);
      }
    }

    return { locked, dynamic };
  };

  const { locked: effectiveLocked, dynamic: effectiveDynamic } = getEffectiveZones();
  const hasDynamicZones = effectiveDynamic.length > 0;
  const canConfirm = parseResult && !parseError && hasDynamicZones;

  const handleConfirm = () => {
    if (!parseResult || !canConfirm) return;

    onComplete({
      html: htmlContent,
      source: inputMethod,
      sourceValue: inputMethod === "url" ? url : fileName,
      lockedZones: effectiveLocked,
      dynamicZones: effectiveDynamic,
      primaryColour: parseResult.primaryColour,
      fonts: parseResult.fonts,
      logoUrl: parseResult.logoUrl,
      overrides,
    });
  };

  const canParse = inputMethod === "url" ? url.trim().length > 0 : htmlContent.length > 0;

  return (
    <div className="space-y-6" data-testid="template-upload-step">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode2 className="h-5 w-5" />
            Template Source
          </CardTitle>
          <CardDescription>
            Upload an HTML file or paste a URL to use as the base template for your pSEO pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={inputMethod} onValueChange={(v) => {
            setInputMethod(v as "file" | "url");
            setParseResult(null);
            setParseError(null);
            setOverrides({});
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file" data-testid="tab-file-upload">
                <Upload className="h-4 w-4 mr-2" />
                File Upload
              </TabsTrigger>
              <TabsTrigger value="url" data-testid="tab-url-paste">
                <Globe className="h-4 w-4 mr-2" />
                URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="mt-4">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                data-testid="file-drop-zone"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.htm"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  data-testid="input-file"
                />
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                {fileName ? (
                  <div>
                    <p className="font-medium text-foreground">{fileName}</p>
                    <p className="text-sm text-muted-foreground mt-1">Click or drag to replace</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium text-foreground">Drop your HTML file here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse (.html, .htm)</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="mt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://example.com/template-page"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setParseResult(null);
                      setParseError(null);
                    }}
                    className="pl-9"
                    data-testid="input-url"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Static HTML will be fetched — JavaScript-rendered content is not supported.
              </p>
            </TabsContent>
          </Tabs>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleParse}
              disabled={!canParse || isParsing}
              data-testid="button-parse-template"
            >
              {isParsing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Parse Template
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {parseError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3" data-testid="parse-error">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Parse Error</p>
                <p className="text-sm text-muted-foreground mt-1">{parseError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={handleParse}
                  disabled={isParsing}
                  data-testid="button-retry-parse"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {parseResult && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {parseResult.primaryColour && (
              <Card data-testid="card-primary-colour">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Primary Colour</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: parseResult.primaryColour }}
                      data-testid="colour-swatch"
                    />
                    <code className="text-sm text-muted-foreground">{parseResult.primaryColour}</code>
                  </div>
                </CardContent>
              </Card>
            )}

            {parseResult.fonts.length > 0 && (
              <Card data-testid="card-fonts">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Fonts Detected</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {parseResult.fonts.map((font) => (
                      <Badge key={font} variant="secondary" data-testid={`badge-font-${font}`}>
                        {font}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {parseResult.logoUrl && (
              <Card data-testid="card-logo">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Image className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Logo</span>
                  </div>
                  <div className="mt-3">
                    <img
                      src={parseResult.logoUrl}
                      alt="Detected logo"
                      className="max-h-12 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      data-testid="img-logo-preview"
                    />
                    <p className="text-xs text-muted-foreground mt-1 truncate">{parseResult.logoUrl}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {!hasDynamicZones && (
            <Card className="border-yellow-500 dark:border-yellow-600">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3" data-testid="warning-no-dynamic">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-700 dark:text-yellow-400">No Dynamic Zones</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This template has no dynamic zones. At least one dynamic zone is required for content generation.
                      Unlock a zone below to continue.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Lock className="h-4 w-4" />
                Locked Zones
                <Badge variant="secondary" className="ml-auto">{effectiveLocked.length}</Badge>
              </CardTitle>
              <CardDescription>
                These elements will remain unchanged across all generated pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {effectiveLocked.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center" data-testid="text-no-locked">No locked zones</p>
              ) : (
                <div className="space-y-2" data-testid="list-locked-zones">
                  {effectiveLocked.map((zone) => (
                    <ZoneRow
                      key={zone.zoneKey}
                      zone={zone}
                      effectiveType="locked"
                      isOverridden={!!overrides[zone.zoneKey]}
                      onToggle={() => toggleZone(zone.zoneKey, "locked")}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Unlock className="h-4 w-4" />
                Dynamic Zones
                <Badge variant="secondary" className="ml-auto">{effectiveDynamic.length}</Badge>
              </CardTitle>
              <CardDescription>
                These elements will be populated with generated content for each location/service page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {effectiveDynamic.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center" data-testid="text-no-dynamic">No dynamic zones</p>
              ) : (
                <div className="space-y-2" data-testid="list-dynamic-zones">
                  {effectiveDynamic.map((zone) => (
                    <ZoneRow
                      key={zone.zoneKey}
                      zone={zone}
                      effectiveType="dynamic"
                      isOverridden={!!overrides[zone.zoneKey]}
                      onToggle={() => toggleZone(zone.zoneKey, "dynamic")}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleConfirm}
              disabled={!canConfirm}
              data-testid="button-confirm-template"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Template
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function ZoneRow({
  zone,
  effectiveType,
  isOverridden,
  onToggle,
}: {
  zone: TemplateZoneDescriptor;
  effectiveType: "locked" | "dynamic";
  isOverridden: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
      data-testid={`zone-row-${zone.zoneKey}`}
    >
      <div className="shrink-0">
        {effectiveType === "locked" ? (
          <Lock className="h-4 w-4 text-amber-500" />
        ) : (
          <Unlock className="h-4 w-4 text-sky-500" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{zone.elementType}</span>
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded truncate">{zone.cssSelector}</code>
          {isOverridden && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0" data-testid={`badge-override-${zone.zoneKey}`}>
              Manual Override
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">{zone.contentSummary}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Badge
          variant="outline"
          className="text-xs tabular-nums"
          data-testid={`badge-confidence-${zone.zoneKey}`}
        >
          {Math.round(zone.confidenceScore * 100)}%
        </Badge>
        <Switch
          checked={effectiveType === "locked"}
          onCheckedChange={onToggle}
          data-testid={`switch-zone-${zone.zoneKey}`}
        />
      </div>
    </div>
  );
}
