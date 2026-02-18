import { useState, useEffect, useMemo } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Grid3X3, MapPin, Target, Search, CheckCircle, Plus, Trash2,
  Loader2, Clock, Eye, TrendingUp, Upload, AlertCircle, Settings,
  Zap, ShoppingCart, Gift, RefreshCw, History,
} from "lucide-react";
import { useRef } from "react";

const MAX_GRID_KEYWORDS = 25;

const gridSizeOptions = [
  { value: "5", label: "5x5 (25 points)", points: 25 },
];

const distanceOptions = [
  { value: "0.5", label: "0.5 miles" },
  { value: "1", label: "1 mile" },
  { value: "2", label: "2 miles" },
  { value: "3", label: "3 miles" },
  { value: "5", label: "5 miles" },
];

function getGridColor(rank: number | null) {
  if (rank === null) return "bg-muted text-muted-foreground";
  if (rank <= 3) return "bg-green-500 text-white";
  if (rank <= 7) return "bg-yellow-400 text-white";
  if (rank <= 12) return "bg-orange-400 text-white";
  return "bg-red-500 text-white";
}

function generateDemoGrid(size: number): (number | null)[] {
  const total = size * size;
  return Array.from({ length: total }, (_, i) => {
    const centerDist = Math.abs(Math.floor(i / size) - Math.floor(size / 2)) + Math.abs((i % size) - Math.floor(size / 2));
    const base = Math.max(1, centerDist * 2 - 1);
    const jitter = Math.floor(Math.random() * 4) - 1;
    return Math.max(1, Math.min(20, base + jitter));
  });
}

const demoKeywords = [
  "seo agency near me",
  "best digital marketing downtown",
  "content marketing services",
  "local seo company",
  "website optimization near me",
  "social media marketing agency",
  "ppc management services",
  "web design agency near me",
];

export default function LocalSearchGrid() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  const [gridSize, setGridSize] = useState("5");
  const [distance, setDistance] = useState("2");
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gridNum = parseInt(gridSize);
  const demoGrid = useMemo(() => generateDemoGrid(gridNum), [gridNum]);

  useEffect(() => {
    document.title = "Local Search Grid | indexFlow Dashboard";
  }, []);

  const { data: venue } = useQuery<{ id: string; name: string; address: string | null }>({
    queryKey: ["/api/workspaces", workspaceId],
  });

  const { data: gridKeywords = [], isLoading: keywordsLoading } = useQuery<{ id: number; keyword: string }[]>({
    queryKey: ["/api/workspaces", workspaceId, "grid-keywords"],
  });

  const addKeywordsMutation = useMutation({
    mutationFn: async (kws: string[]) => {
      return apiRequest("POST", `/api/workspaces/${workspaceId}/grid-keywords`, { keywords: kws });
    },
    onSuccess: () => {
      setKeywordInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "grid-keywords"] });
      toast({ title: "Added", description: "Keywords added to grid tracking" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add keywords", variant: "destructive" });
    },
  });

  const deleteKeywordMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/workspaces/${workspaceId}/grid-keywords/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "grid-keywords"] });
      toast({ title: "Removed", description: "Keyword removed from grid tracking" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove keyword", variant: "destructive" });
    },
  });

  const { data: refreshCredits, isLoading: creditsLoading } = useQuery<{ balance: number; totalPurchased: number; totalUsed: number }>({
    queryKey: ["/api/workspaces", workspaceId, "grid-refresh-credits"],
  });

  const purchaseCreditsMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("POST", `/api/workspaces/${workspaceId}/grid-refresh-credits/purchase`, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "grid-refresh-credits"] });
      toast({ title: "Credits purchased", description: "Refresh credits have been added to your account" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to purchase credits", variant: "destructive" });
    },
  });

  const useRefreshCreditMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/workspaces/${workspaceId}/grid-refresh-credits/use`);
      const res = await apiRequest("POST", `/api/workspaces/${workspaceId}/grid-scan`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "grid-refresh-credits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "grid-scan-results"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "grid-scan-keywords"] });
      toast({ title: "Grid scanned", description: "Your grid rankings have been updated with live data from Google Maps" });
    },
    onError: (err: any) => {
      toast({ title: "Scan failed", description: err?.message || "Failed to scan grid. Check that your workspace has coordinates set.", variant: "destructive" });
    },
  });

  const remainingSlots = MAX_GRID_KEYWORDS - gridKeywords.length;

  const handleAddKeywords = () => {
    const parsed = keywordInput
      .split(/[\n,]+/)
      .map(k => k.trim())
      .filter(k => k.length > 0);
    if (parsed.length === 0) return;
    if (parsed.length > remainingSlots) {
      toast({ title: "Limit reached", description: `You can add up to ${remainingSlots} more keyword${remainingSlots !== 1 ? "s" : ""} (max ${MAX_GRID_KEYWORDS})`, variant: "destructive" });
      return;
    }
    addKeywordsMutation.mutate(parsed);
  };

  const processCsvFile = (file: File) => {
    if (!file.name.match(/\.(csv|txt)$/i)) {
      toast({ title: "Invalid file", description: "Please upload a .csv or .txt file", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim().length > 0);
      const kws = lines.map(line => line.split(",")[0].trim()).filter(k => k.length > 0);
      if (kws.length === 0) {
        toast({ title: "Empty file", description: "No keywords found", variant: "destructive" });
        return;
      }
      if (kws.length > remainingSlots) {
        toast({ title: "Limit reached", description: `CSV has ${kws.length} keywords but you can only add ${remainingSlots} more`, variant: "destructive" });
        return;
      }
      addKeywordsMutation.mutate(kws);
    };
    reader.readAsText(file);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processCsvFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const { data: scannedKeywords = [] } = useQuery<string[]>({
    queryKey: ["/api/workspaces", workspaceId, "grid-scan-keywords"],
  });

  const activeKeyword = selectedKeyword || (scannedKeywords.length > 0 ? scannedKeywords[0] : (gridKeywords.length > 0 ? gridKeywords[0].keyword : ""));

  const { data: scanResults = [] } = useQuery<{ gridIndex: number; gridSize: number; rank: number | null; businessName: string | null }[]>({
    queryKey: ["/api/workspaces", workspaceId, "grid-scan-results", activeKeyword],
    enabled: !!activeKeyword && scannedKeywords.includes(activeKeyword),
  });

  const hasScanData = scanResults.length > 0;
  const scanGridSize = hasScanData ? (scanResults[0]?.gridSize || gridNum) : gridNum;
  const effectiveGridNum = hasScanData ? scanGridSize : gridNum;
  const displayGrid = hasScanData
    ? Array.from({ length: effectiveGridNum * effectiveGridNum }, (_, i) => {
        const result = scanResults.find(r => r.gridIndex === i);
        return result?.rank ?? null;
      })
    : demoGrid;

  const displayKeywords = scannedKeywords.length > 0
    ? scannedKeywords
    : (gridKeywords.length > 0 ? gridKeywords.map(k => k.keyword) : demoKeywords);
  const hasRealData = hasScanData;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2" data-testid="text-grid-dashboard-title">
            <Grid3X3 className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            Local Search Grid
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            powered by indexFlow
          </p>
        </div>

        {/* How It Works Guide */}
        <Card className="mb-6" data-testid="card-how-it-works">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Eye className="w-4 h-4 shrink-0" />
              How It Works
            </CardTitle>
            <CardDescription>Set up your grid in 3 simple steps</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium text-sm">Add Keywords</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Enter up to 25 keywords that your clients' customers search for — service types, 'near me' terms, and intent-based searches.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium text-sm">Configure Your Grid</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Your 5x5 grid scans 25 points around your location. Adjust the distance between points to cover your service area.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium text-sm">Watch Rankings Improve</p>
                  <p className="text-xs text-muted-foreground mt-0.5">We scan weekly and show your Google Maps ranking at each point. Green = top 3, red = needs work.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* Left Column — Setup */}
          <div className="space-y-4 sm:space-y-6">

            {/* Workspace Location */}
            <div className="rounded-md border border-green-200 dark:border-green-800/50 bg-green-50/80 dark:bg-green-950/30 p-4 sm:p-6" data-testid="card-venue-location">
              <h3 className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                Grid Center: {venue?.name || "Your Workspace"}
              </h3>
              <p className="text-sm text-green-700/80 dark:text-green-400/80 mt-2" data-testid="text-venue-address">
                {venue?.address || "Your workspace address will be used as the center point of the grid."}
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 mt-2">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Grid centered on your Google Business Profile location</span>
              </div>
            </div>

            {/* Grid Configuration */}
            <Card data-testid="card-grid-config">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Settings className="w-4 h-4 shrink-0" />
                  Grid Configuration
                </CardTitle>
                <CardDescription>Adjust the grid to cover your service area</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Grid Size</Label>
                    <div className="flex items-center gap-2 mt-1.5 h-9 px-3 rounded-md border bg-muted/50">
                      <Grid3X3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">5x5 (25 points)</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="grid-distance" className="text-sm">Distance Between Points</Label>

                    <Select value={distance} onValueChange={setDistance}>
                      <SelectTrigger id="grid-distance" data-testid="select-grid-distance">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {distanceOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-4 flex-wrap">
                  <span>5x5 = 25 grid points</span>
                  <span>Coverage: ~{2 * parseFloat(distance)} miles across</span>
                  <span>Scans: Pay-as-you-go (1 credit each)</span>
                </div>
              </CardContent>
            </Card>

            {/* Add Keywords */}
            <Card data-testid="card-grid-add-keywords">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Plus className="w-4 h-4 shrink-0" />
                  Grid Keywords
                </CardTitle>
                <CardDescription>
                  Add up to {MAX_GRID_KEYWORDS} keywords to track across your grid (one per line or comma separated)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                <div>
                  <Label htmlFor="grid-keyword-input" className="sr-only">Keywords</Label>
                  <Textarea
                    id="grid-keyword-input"
                    placeholder={"seo agency near me\nbest digital marketing downtown\ncontent marketing services"}
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    rows={4}
                    data-testid="textarea-grid-keywords"
                  />
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    onClick={handleAddKeywords}
                    disabled={addKeywordsMutation.isPending || !keywordInput.trim()}
                    data-testid="button-add-grid-keywords"
                  >
                    {addKeywordsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span className="ml-1">Add Keywords</span>
                  </Button>
                  <Badge variant="secondary" data-testid="badge-grid-keyword-count">
                    {gridKeywords.length} / {MAX_GRID_KEYWORDS}
                  </Badge>
                </div>

                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 border-t border-dashed" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">or upload CSV</span>
                  <div className="flex-1 border-t border-dashed" />
                </div>

                <div
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) processCsvFile(f); }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-md border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  data-testid="dropzone-grid-csv"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleCsvUpload}
                    className="hidden"
                    data-testid="input-grid-csv-upload"
                  />
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-primary" : "text-muted-foreground/50"}`} />
                  <p className="text-sm font-medium">
                    {isDragging ? "Drop your CSV file here" : "Drag & drop a CSV file here"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or <span className="underline">click to browse</span> (max {MAX_GRID_KEYWORDS} keywords)
                  </p>
                </div>

                {gridKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto mt-2">
                    {gridKeywords.map((kw) => (
                      <Badge key={kw.id} variant="secondary" className="flex items-center gap-1" data-testid={`badge-grid-kw-${kw.id}`}>
                        <span className="text-xs">{kw.keyword}</span>
                        <button className="ml-1 opacity-60 hover:opacity-100" onClick={() => deleteKeywordMutation.mutate(kw.id)} data-testid={`button-delete-grid-kw-${kw.id}`}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instant Refresh */}
            <Card data-testid="card-grid-refresh">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Zap className="w-4 h-4 shrink-0 text-yellow-500" />
                    Scan Grid Rankings
                  </CardTitle>
                  <Badge variant="outline" className="text-xs" data-testid="badge-credit-balance">
                    <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                    {creditsLoading ? "..." : (refreshCredits?.balance ?? 0)} credits
                  </Badge>
                </div>
                <CardDescription>
                  Each scan uses 1 credit. Purchase credit packs below to run scans.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                <Button
                  className="w-full"
                  disabled={useRefreshCreditMutation.isPending || !gridKeywords.length || (refreshCredits?.balance ?? 0) <= 0}
                  onClick={() => useRefreshCreditMutation.mutate()}
                  data-testid="button-refresh-grid"
                >
                  {useRefreshCreditMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Scan Now (1 credit)
                </Button>

                {useRefreshCreditMutation.isPending && (
                  <div className="p-3 rounded-md bg-muted/50 text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    Scanning grid points via Google Maps... This may take a minute.
                  </div>
                )}

                {(refreshCredits?.balance ?? 0) <= 0 && !creditsLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      No credits remaining. Purchase a scan pack below to continue scanning.
                    </p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Buy Scan Credits</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Credits never expire. Use them anytime you need to run grid scans.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      className="flex items-center justify-between w-full"
                      onClick={() => purchaseCreditsMutation.mutate(5)}
                      disabled={purchaseCreditsMutation.isPending}
                      data-testid="button-buy-5-credits"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">5 Scans</span>
                      </span>
                      <span className="text-sm font-bold">$10</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-between w-full"
                      onClick={() => purchaseCreditsMutation.mutate(25)}
                      disabled={purchaseCreditsMutation.isPending}
                      data-testid="button-buy-25-credits"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">25 Scans</span>
                        <Badge variant="secondary" className="text-xs">Save 30%</Badge>
                      </span>
                      <span className="text-sm font-bold">$35</span>
                    </Button>
                  </div>
                </div>

                {refreshCredits && refreshCredits.totalPurchased === 3 && refreshCredits.totalUsed === 0 && refreshCredits.balance === 3 && (
                  <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50">
                    <Gift className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                    <p className="text-xs text-green-700 dark:text-green-400">
                      Welcome! You have a <strong>$5 starter credit</strong> to get started. Credits never expire.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column — Grid Preview */}
          <div className="space-y-4 sm:space-y-6">

            {/* Grid Visualization */}
            <Card data-testid="card-grid-preview">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4 shrink-0" />
                    Grid Preview
                  </CardTitle>
                  {hasRealData ? (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-300 dark:text-green-400 dark:border-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Live Data
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Demo Data
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {hasRealData
                    ? `Showing rankings for: ${selectedKeyword || displayKeywords[0]}`
                    : "Add keywords and configure your grid to see real ranking data"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                {displayKeywords.length > 1 && (
                  <div className="mb-4">
                    <Label className="text-xs text-muted-foreground mb-1 block">Select keyword</Label>
                    <Select value={selectedKeyword || displayKeywords[0]} onValueChange={setSelectedKeyword}>
                      <SelectTrigger data-testid="select-grid-keyword">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {displayKeywords.map(kw => (
                          <SelectItem key={kw} value={kw}>{kw}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-xl p-4 sm:p-6">
                  <div
                    className="grid gap-2 sm:gap-3 mx-auto"
                    style={{
                      gridTemplateColumns: `repeat(${effectiveGridNum}, minmax(0, 1fr))`,
                      maxWidth: `${effectiveGridNum * 52}px`,
                    }}
                  >
                    {displayGrid.map((rank, i) => (
                      <div
                        key={i}
                        className={`${getGridColor(rank)} w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-md`}
                        data-testid={`grid-cell-${i}`}
                      >
                        {rank ?? "–"}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">#1-3</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="text-muted-foreground">#4-7</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-orange-400" />
                    <span className="text-muted-foreground">#8-12</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">#13+</span>
                  </div>
                </div>

                {/* Scan Info */}
                <div className="mt-4 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  {hasRealData
                    ? "Rankings update every Sunday at 20:00"
                    : "Rankings will begin scanning once you add keywords"
                  }
                </div>
              </CardContent>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center" data-testid="card-stat-grid-size">
                <div className="text-2xl font-bold text-primary">5x5</div>
                <p className="text-xs text-muted-foreground">Grid Size</p>
              </Card>
              <Card className="p-4 text-center" data-testid="card-stat-grid-points">
                <div className="text-2xl font-bold text-primary">25</div>
                <p className="text-xs text-muted-foreground">Grid Points</p>
              </Card>
              <Card className="p-4 text-center" data-testid="card-stat-keywords">
                <div className="text-2xl font-bold text-primary">{gridKeywords.length || "0"}</div>
                <p className="text-xs text-muted-foreground">Keywords</p>
              </Card>
              <Card className="p-4 text-center" data-testid="card-stat-coverage">
                <div className="text-2xl font-bold text-primary">{2 * parseFloat(distance)}mi</div>
                <p className="text-xs text-muted-foreground">Coverage</p>
              </Card>
            </div>

            {/* Color Guide */}
            <Card data-testid="card-color-guide">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Eye className="w-4 h-4 shrink-0" />
                  Understanding Your Grid
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold shrink-0">1</div>
                  <div>
                    <p className="text-sm font-medium">Positions #1-3</p>
                    <p className="text-xs text-muted-foreground">You're in the Google Maps 3-pack. Customers see you first.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white text-xs font-bold shrink-0">5</div>
                  <div>
                    <p className="text-sm font-medium">Positions #4-7</p>
                    <p className="text-xs text-muted-foreground">Visible but not in the top 3. Close to breaking through.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold shrink-0">10</div>
                  <div>
                    <p className="text-sm font-medium">Positions #8-12</p>
                    <p className="text-xs text-muted-foreground">Second page territory. Needs attention to move up.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shrink-0">15</div>
                  <div>
                    <p className="text-sm font-medium">Positions #13+</p>
                    <p className="text-xs text-muted-foreground">Not visible to most searchers. Priority area for improvement.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
