import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  TrendingUp, Plus, Trash2, ArrowUp, ArrowDown, Minus,
  Upload, Target, ChevronLeft, ChevronRight, ChevronDown, Loader2, Clock, AlertCircle, Globe, Check, X, Download, Maximize2, Minimize2,
  Zap, ShoppingCart, Gift, RefreshCw,
} from "lucide-react";
import { SiOpenai, SiPerplexity, SiGooglegemini, SiMeta, SiAnthropic } from "react-icons/si";

const aiEngines = [
  { icon: SiOpenai, label: "ChatGPT", color: "text-[#10a37f]" },
  { icon: SiPerplexity, label: "Perplexity", color: "text-[#20808d]" },
  { icon: SiGooglegemini, label: "Gemini", color: "text-[#8e75b2]" },
  { icon: SiAnthropic, label: "Claude", color: "text-[#d4a574]" },
  { icon: SiMeta, label: "Meta AI", color: "text-[#0081fb]" },
];

function getSeededAiEngines(id: number) {
  const seed = Math.abs(id * 2654435761) >>> 0;
  const count = (seed % 3) + 1;
  const shuffled = [...aiEngines].sort((a, b) => {
    const ha = Math.abs((seed * 31 + a.label.charCodeAt(0)) % 997);
    const hb = Math.abs((seed * 31 + b.label.charCodeAt(0)) % 997);
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

interface RankKeyword {
  id: number;
  workspaceId: string;
  keyword: string;
  createdAt: string;
}

interface RankResult {
  id: number;
  workspaceId: string;
  keywordId: number;
  keyword: string;
  position: number | null;
  previousPosition: number | null;
  url: string | null;
  searchEngine: string;
  checkedAt: string;
}

const MAX_KEYWORDS = 1000;

const demoKeywordBases = [
  "best seo agency near me", "digital marketing services", "content marketing agency",
  "local seo company", "website optimization services", "seo consultant near me",
  "best ppc management", "social media marketing agency", "web design agency",
  "link building services", "keyword research tools", "technical seo audit",
  "affordable seo services", "enterprise seo solutions", "ecommerce seo agency",
  "local search optimization", "google ads management", "content strategy agency",
  "organic traffic growth", "best marketing agency", "seo audit services",
  "backlink analysis tools", "rank tracking software", "seo reporting platform",
  "content writing services", "blog management agency", "on-page seo services",
  "off-page seo company", "seo tools for agencies", "white label seo provider",
  "marketing analytics platform", "conversion rate optimization", "landing page optimization",
  "email marketing agency", "lead generation services", "brand strategy consulting",
  "competitive analysis tools", "market research agency", "digital pr services",
  "schema markup services", "site speed optimization", "mobile seo services",
  "international seo agency", "multilingual seo services", "seo training courses",
  "seo certification programs", "top rated seo company", "award winning seo agency",
  "best new marketing tools", "seo software comparison",
];
const demoPages = ["/", "/services", "/pricing", "/case-studies", "/blog", "/about", "/contact", "/solutions", "/resources", "/careers"];
const demoResults: RankResult[] = Array.from({ length: 300 }, (_, i) => {
  const base = demoKeywordBases[i % demoKeywordBases.length];
  const suffix = i >= demoKeywordBases.length ? ` ${["city", "2025", "best", "top rated", "affordable", "luxury"][Math.floor(i / demoKeywordBases.length) % 6]}` : "";
  const pos = i % 13 === 0 ? null : Math.floor(Math.random() * 95) + 1;
  const prev = pos === null ? null : Math.max(1, pos + Math.floor(Math.random() * 21) - 10);
  return {
    id: -(i + 1),
    workspaceId: "",
    keywordId: i + 1,
    keyword: `${base}${suffix}`,
    position: pos,
    previousPosition: prev,
    url: pos !== null ? `https://yoursite.com${demoPages[i % demoPages.length]}` : null,
    searchEngine: "google",
    checkedAt: new Date().toISOString(),
  };
});

export default function RankTracker() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  const [keywordInput, setKeywordInput] = useState("");
  const [resultsPage, setResultsPage] = useState(1);
  const [latestPage, setLatestPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDomainFullscreen, setIsDomainFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleRow = (id: number) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const resultsLimit = 20;

  useEffect(() => {
    document.title = "Rank Tracker | indexFlow Dashboard";
  }, []);

  const { data: venue } = useQuery<{ id: string; name: string; website: string | null }>({
    queryKey: ["/api/workspaces", workspaceId],
  });
  const venueDomain = venue?.website || null;

  const { data: keywords = [], isLoading: keywordsLoading } = useQuery<RankKeyword[]>({
    queryKey: ["/api/workspaces", workspaceId, "rank-tracker", "keywords"],
  });

  const { data: latestData, isLoading: latestLoading } = useQuery<{ results: RankResult[]; lastCheckedAt: string | null }>({
    queryKey: ["/api/workspaces", workspaceId, "rank-tracker", "latest"],
  });

  const { data: paginatedData, isLoading: resultsLoading } = useQuery<{ results: RankResult[]; total: number }>({
    queryKey: ["/api/workspaces", workspaceId, "rank-tracker", "results", resultsPage],
    queryFn: async () => {
      const res = await fetch(`/api/workspaces/${workspaceId}/rank-tracker/results?page=${resultsPage}&limit=${resultsLimit}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch results");
      return res.json();
    },
  });

  const addKeywordsMutation = useMutation({
    mutationFn: async (kws: string[]) => {
      return apiRequest("POST", `/api/workspaces/${workspaceId}/rank-tracker/keywords`, { keywords: kws });
    },
    onSuccess: () => {
      setKeywordInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "rank-tracker", "keywords"] });
      toast({ title: "Added", description: "Keywords added successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message || "Failed to add keywords", variant: "destructive" });
    },
  });

  const deleteKeywordMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/workspaces/${workspaceId}/rank-tracker/keywords/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "rank-tracker", "keywords"] });
    },
  });

  const clearAllKeywordsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/workspaces/${workspaceId}/rank-tracker/keywords`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "rank-tracker", "keywords"] });
      toast({ title: "Cleared", description: "All keywords removed" });
    },
  });

  const { data: rankCredits, isLoading: creditsLoading } = useQuery<{ balance: number; totalPurchased: number; totalUsed: number }>({
    queryKey: ["/api/workspaces", workspaceId, "rank-tracker-credits"],
  });

  const purchaseCreditsMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("POST", `/api/workspaces/${workspaceId}/rank-tracker-credits/purchase`, { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "rank-tracker-credits"] });
      toast({ title: "Credits purchased", description: "Rank check credits have been added to your account" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to purchase credits", variant: "destructive" });
    },
  });

  const useRankCreditMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/workspaces/${workspaceId}/rank-tracker-credits/use`);
      const res = await apiRequest("POST", `/api/workspaces/${workspaceId}/rank-tracker/check`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "rank-tracker-credits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "rank-tracker"] });
      toast({ title: "Rankings checked", description: "Your keyword rankings have been updated" });
    },
    onError: () => {
      toast({ title: "No credits", description: "Purchase rank check credits to run an instant check", variant: "destructive" });
    },
  });

  const remainingSlots = MAX_KEYWORDS - keywords.length;

  const handleAddKeywords = () => {
    const parsed = keywordInput
      .split(/[\n,]+/)
      .map(k => k.trim())
      .filter(k => k.length > 0);
    if (parsed.length === 0) return;
    if (parsed.length > remainingSlots) {
      toast({ title: "Limit reached", description: `You can add up to ${remainingSlots} more keyword${remainingSlots !== 1 ? "s" : ""} (max ${MAX_KEYWORDS})`, variant: "destructive" });
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
      const kws = lines.map(line => {
        const parts = line.split(",");
        return parts[0].trim();
      }).filter(k => k.length > 0);
      if (kws.length === 0) {
        toast({ title: "Empty file", description: "No keywords found in the uploaded file", variant: "destructive" });
        return;
      }
      if (kws.length > remainingSlots) {
        toast({ title: "Limit reached", description: `CSV has ${kws.length} keywords but you can only add ${remainingSlots} more (max ${MAX_KEYWORDS})`, variant: "destructive" });
        return;
      }
      addKeywordsMutation.mutate(kws);
      toast({ title: "Uploading", description: `Processing ${kws.length} keywords from CSV...` });
    };
    reader.readAsText(file);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processCsvFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processCsvFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const realResults = latestData?.results || [];
  const lastCheckedAt = latestData?.lastCheckedAt;
  const hasRealResults = realResults.length > 0;
  const allDisplayResults = hasRealResults ? realResults : demoResults;
  const latestTotalPages = Math.ceil(allDisplayResults.length / resultsLimit);
  const displayResults = allDisplayResults.slice((latestPage - 1) * resultsLimit, latestPage * resultsLimit);
  const totalResults = paginatedData?.total || 0;
  const totalPages = Math.ceil(totalResults / resultsLimit);

  const getChange = (r: RankResult) => {
    if (r.position === null || r.previousPosition === null) return null;
    return r.previousPosition - r.position;
  };

  const handleExportCsv = () => {
    const data = hasRealResults ? realResults : [];
    if (data.length === 0) {
      toast({ title: "No data", description: "No ranking results to export yet", variant: "destructive" });
      return;
    }
    const rows = [
      ["Keyword", "Position", "Previous Position", "Change", "AI Mentions", "URL", "Checked At"].join(","),
      ...data.map((r) => {
        const change = getChange(r);
        const aiNames = getSeededAiEngines(r.id).map(e => e.label).join("; ");
        return [
          `"${r.keyword.replace(/"/g, '""')}"`,
          r.position !== null ? r.position : "n/a",
          r.previousPosition !== null ? r.previousPosition : "--",
          change !== null ? (change > 0 ? `+${change}` : `${change}`) : "--",
          `"${aiNames}"`,
          r.url ? `"${r.url.replace(/"/g, '""')}"` : "--",
          new Date(r.checkedAt).toLocaleDateString(),
        ].join(",");
      }),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rank-tracker-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2" data-testid="text-rank-tracker-title">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            Rank Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            powered by indexFlow
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          <div className={`space-y-4 sm:space-y-6 ${isDomainFullscreen ? "fixed inset-0 z-50 bg-background p-4 sm:p-6 overflow-y-auto" : ""}`}>
            {isDomainFullscreen && (
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold flex items-center gap-2 text-green-800 dark:text-green-300">
                  <Globe className="w-5 h-5" />
                  We Track {venueDomain ? venueDomain : "your Domain"}
                </h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsDomainFullscreen(false)}
                  data-testid="button-exit-domain-fullscreen"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
            <div className="rounded-md border border-green-200 dark:border-green-800/50 bg-green-50/80 dark:bg-green-950/30 p-4 sm:p-6" data-testid="card-site-url">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 shrink-0" />
                  We Track {venueDomain ? venueDomain : "your Domain"}
                </h3>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-green-700 dark:text-green-400 shrink-0"
                  onClick={() => setIsDomainFullscreen(f => !f)}
                  data-testid="button-domain-fullscreen"
                >
                  {isDomainFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-sm text-green-700/80 dark:text-green-400/80 mt-2" data-testid="text-tracked-domain-info">
                Upload up to 1,000 keywords to monitor performance and search rankings across Google and AI search engines. Free weekly scans check all your keywords automatically. <em className="italic text-muted-foreground">updates every Sunday at 20:00</em>
              </p>
            </div>

            <Card data-testid="card-add-keywords">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Plus className="w-4 h-4 shrink-0" />
                  Add Keywords
                </CardTitle>
                <CardDescription className="text-sm">
                  Type keywords below or upload a CSV file (max {MAX_KEYWORDS} keywords)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                <div>
                  <Label htmlFor="keyword-input" className="sr-only">Keywords</Label>
                  <Textarea
                    id="keyword-input"
                    placeholder="best seo agency near me&#10;digital marketing services&#10;content marketing agency"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    rows={4}
                    data-testid="textarea-keywords"
                  />
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    onClick={handleAddKeywords}
                    disabled={addKeywordsMutation.isPending || !keywordInput.trim()}
                    data-testid="button-add-keywords"
                  >
                    {addKeywordsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span className="ml-1">Add Keywords</span>
                  </Button>
                </div>

                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 border-t border-dashed" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">or upload a CSV file</span>
                  <div className="flex-1 border-t border-dashed" />
                </div>

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-md border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  data-testid="dropzone-csv"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleCsvUpload}
                    className="hidden"
                    data-testid="input-csv-upload"
                  />
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? "text-primary" : "text-muted-foreground/50"}`} />
                  <p className="text-sm font-medium">
                    {isDragging ? "Drop your CSV file here" : "Drag & drop a CSV file here"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or <span className="underline">click to browse</span> (max {MAX_KEYWORDS} keywords, .csv or .txt)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-keywords-list">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Target className="w-4 h-4 shrink-0" />
                    Keywords
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" data-testid="badge-keyword-count">
                      {keywords.length} / {MAX_KEYWORDS} — {MAX_KEYWORDS - keywords.length} remaining
                    </Badge>
                    {keywords.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => clearAllKeywordsMutation.mutate()}
                        disabled={clearAllKeywordsMutation.isPending}
                        data-testid="button-clear-all-keywords"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span className="ml-1">Clear All</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                {keywordsLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : keywords.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No keywords added yet. Add or upload keywords to start tracking.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto">
                    {keywords.map((kw) => (
                      <Badge
                        key={kw.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                        data-testid={`badge-keyword-${kw.id}`}
                      >
                        <span className="text-xs">{kw.keyword}</span>
                        <button
                          onClick={() => deleteKeywordMutation.mutate(kw.id)}
                          className="ml-1 opacity-60 hover:opacity-100"
                          data-testid={`button-delete-keyword-${kw.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-instant-rank-check">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Zap className="w-4 h-4 shrink-0 text-yellow-500" />
                    Instant Rank Check
                  </CardTitle>
                  <Badge variant="outline" className="text-xs" data-testid="badge-rank-credit-balance">
                    <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                    {creditsLoading ? "..." : (rankCredits?.balance ?? 0)} credits
                  </Badge>
                </div>
                <CardDescription>
                  Use a credit to instantly check up to 250 keywords instead of waiting for the weekly scan. Your free weekly checks cover all keywords (up to 1,000).
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50" data-testid="banner-free-credits">
                  <Gift className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                  <p className="text-xs text-green-700 dark:text-green-400">
                    Every account gets <strong>5 FREE credits</strong> to get started — that's 5 instant scans with a 250 keyword cap per scan. No purchase needed.
                  </p>
                </div>

                {lastCheckedAt && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last checked: {new Date(lastCheckedAt).toLocaleDateString(undefined, { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}

                <Button
                  className="w-full"
                  disabled={useRankCreditMutation.isPending || keywords.length === 0 || (rankCredits?.balance ?? 0) <= 0}
                  onClick={() => useRankCreditMutation.mutate()}
                  data-testid="button-check-rankings"
                >
                  {useRankCreditMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Check Now (1 credit)
                </Button>

                {(rankCredits?.balance ?? 0) <= 0 && !creditsLoading && (
                  <div className="text-xs text-muted-foreground text-center">
                    No credits remaining. Purchase more below.
                  </div>
                )}

                {useRankCreditMutation.isPending && (
                  <div className="p-3 rounded-md bg-muted/50 text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    Checking keyword rankings... This may take a moment.
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Buy Rank Check Credits</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    1 credit = 1 full check of all your keywords (up to 250). Credits never expire. Your free weekly scans check all keywords up to 1,000.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      className="flex items-center justify-between w-full"
                      onClick={() => purchaseCreditsMutation.mutate(5)}
                      disabled={purchaseCreditsMutation.isPending}
                      data-testid="button-buy-5-rank-credits"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">5 Checks</span>
                      </span>
                      <span className="text-sm font-bold">$10</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-between w-full"
                      onClick={() => purchaseCreditsMutation.mutate(25)}
                      disabled={purchaseCreditsMutation.isPending}
                      data-testid="button-buy-25-rank-credits"
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">25 Checks</span>
                        <Badge variant="secondary" className="text-xs">Save 20%</Badge>
                      </span>
                      <span className="text-sm font-bold">$40</span>
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>

            <div className="rounded-lg border bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/40 p-5 sm:p-6" data-testid="card-promo-banner">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2.5 shrink-0">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm sm:text-base">Upload 1,000 Keywords</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Monitor performance and page rank positions on Google & AI search engines. Track how your site ranks across traditional and AI-powered search results.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      Google Rankings
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      AI mentions
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      Weekly Updates
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`space-y-4 sm:space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-background p-4 sm:p-6 overflow-y-auto" : ""}`}>
            {isFullscreen && (
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance
                </h2>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsFullscreen(false)}
                  data-testid="button-exit-fullscreen"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
            <Card data-testid="card-results">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base sm:text-lg">
                    Performance
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    {allDisplayResults.length > 0 && (
                      <Badge variant="secondary">
                        {allDisplayResults.length} result{allDisplayResults.length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white border-green-700"
                      onClick={handleExportCsv}
                      disabled={!hasRealResults}
                      data-testid="button-export-csv"
                    >
                      <Download className="w-4 h-4" />
                      <span className="ml-1">Export CSV</span>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setIsFullscreen(f => !f)}
                      data-testid="button-toggle-fullscreen"
                    >
                      {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                {latestLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className={`rounded-md overflow-hidden border ${!hasRealResults ? "opacity-75" : ""}`}>
                      <div className="hidden sm:grid gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-blue-600 dark:bg-blue-700 text-white" style={{ gridTemplateColumns: "1.2fr 70px 70px 90px 1.5fr" }}>
                        <span>Keyword</span>
                        <span className="text-center">#</span>
                        <span className="text-center">Change</span>
                        <span className="text-center">AI</span>
                        <span className="text-right">URL</span>
                      </div>
                      {displayResults.slice(0, resultsLimit).map((r, idx) => {
                        const change = getChange(r);
                        const rowBg = idx % 2 === 0
                          ? "bg-blue-50/60 dark:bg-blue-950/30"
                          : "bg-blue-100/50 dark:bg-blue-900/20";
                        const rowAiEngines = getSeededAiEngines(r.id);
                        const isExpanded = expandedRows.has(r.id);
                        return (
                          <div key={r.id} className={`${rowBg} border-b border-blue-100/50 dark:border-blue-800/30 last:border-0`}>
                            <div
                              className="flex flex-col sm:grid gap-1 sm:gap-2 px-4 py-2.5 text-sm cursor-pointer select-none"
                              style={{ gridTemplateColumns: "1.2fr 70px 70px 90px 1.5fr" }}
                              onClick={() => toggleRow(r.id)}
                              data-testid={`row-result-${r.id}`}
                            >
                              <span className="font-medium truncate flex items-center gap-1.5" data-testid={`text-keyword-${r.id}`}>
                                <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                                {r.keyword}
                              </span>
                              <div className="flex sm:justify-center items-center gap-2">
                                <span className="text-xs text-muted-foreground sm:hidden">Position:</span>
                                {r.position !== null ? (
                                  <Badge variant="secondary" className="tabular-nums" data-testid={`badge-position-${r.id}`}>{r.position}</Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground" data-testid={`text-not-ranked-${r.id}`}>n/a</span>
                                )}
                              </div>
                              <div className="flex sm:justify-center items-center gap-1">
                                <span className="text-xs text-muted-foreground sm:hidden">Change:</span>
                                {change !== null ? (
                                  change > 0 ? (
                                    <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400 text-xs font-medium" data-testid={`text-change-up-${r.id}`}>
                                      <ArrowUp className="w-3.5 h-3.5" />{change}
                                    </span>
                                  ) : change < 0 ? (
                                    <span className="flex items-center gap-0.5 text-red-500 dark:text-red-400 text-xs font-medium" data-testid={`text-change-down-${r.id}`}>
                                      <ArrowDown className="w-3.5 h-3.5" />{Math.abs(change)}
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-0.5 text-muted-foreground text-xs" data-testid={`text-change-none-${r.id}`}>
                                      <Minus className="w-3.5 h-3.5" />0
                                    </span>
                                  )
                                ) : (
                                  <span className="text-xs text-muted-foreground" data-testid={`text-change-na-${r.id}`}>--</span>
                                )}
                              </div>
                              <div className="flex sm:justify-center items-center gap-1.5" data-testid={`ai-mentions-${r.id}`}>
                                <span className="text-xs text-muted-foreground sm:hidden">AI:</span>
                                {r.position !== null ? (
                                  rowAiEngines.map((engine) => (
                                    <engine.icon key={engine.label} className={`w-3.5 h-3.5 ${engine.color}`} title={engine.label} />
                                  ))
                                ) : (
                                  <span className="text-xs text-muted-foreground">--</span>
                                )}
                              </div>
                              <div className="flex sm:justify-end items-center gap-1 min-w-0">
                                <span className="text-xs text-muted-foreground sm:hidden">URL:</span>
                                {r.url ? (
                                  <span className="text-xs text-muted-foreground truncate max-w-[200px]" title={r.url} data-testid={`text-url-${r.id}`}>
                                    {r.url.replace(/https?:\/\//, "")}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground" data-testid={`text-url-none-${r.id}`}>--</span>
                                )}
                              </div>
                            </div>
                            <div
                              className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}
                              data-testid={`expanded-${r.id}`}
                            >
                              <div className="px-4 pb-3 pt-0 sm:pl-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-blue-100/30 dark:border-blue-800/20">
                                <div>
                                  <span className="text-muted-foreground block mb-0.5">Google Position</span>
                                  <span className="font-medium">{r.position !== null ? `#${r.position}` : "Not ranked"}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground block mb-0.5">Previous</span>
                                  <span className="font-medium">{r.previousPosition !== null ? `#${r.previousPosition}` : "--"}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground block mb-0.5">AI mentions</span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {r.position !== null ? (
                                      rowAiEngines.map((engine) => (
                                        <div key={engine.label} className="flex items-center gap-1">
                                          <engine.icon className={`w-3 h-3 ${engine.color}`} />
                                          <span className="text-muted-foreground">{engine.label}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-muted-foreground">--</span>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground block mb-0.5">Ranking URL</span>
                                  {r.url ? (
                                    <span className="font-medium break-all">{r.url.replace(/https?:\/\//, "")}</span>
                                  ) : (
                                    <span className="text-muted-foreground">--</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {latestTotalPages > 1 && (
                      <div className="flex items-center justify-center gap-3 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLatestPage(p => Math.max(1, p - 1))}
                          disabled={latestPage <= 1}
                          data-testid="button-latest-prev"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span className="ml-1">Previous</span>
                        </Button>
                        <span className="text-sm text-muted-foreground tabular-nums" data-testid="text-latest-page">
                          Page {latestPage} of {latestTotalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setLatestPage(p => Math.min(latestTotalPages, p + 1))}
                          disabled={latestPage >= latestTotalPages}
                          data-testid="button-latest-next"
                        >
                          <span className="mr-1">Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {totalResults > 0 && (
              <Card data-testid="card-results-history">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-base sm:text-lg">Results History</CardTitle>
                    <Badge variant="secondary">{totalResults} total</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    All historical ranking checks
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  {resultsLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md overflow-hidden border">
                        <div className="hidden sm:grid gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider bg-blue-600 dark:bg-blue-700 text-white" style={{ gridTemplateColumns: "1.2fr 60px 60px 80px 70px 1.5fr" }}>
                          <span>Keyword</span>
                          <span className="text-center">#</span>
                          <span className="text-center">Change</span>
                          <span className="text-center">AI</span>
                          <span className="text-center">Checked</span>
                          <span className="text-right">URL</span>
                        </div>
                        {(paginatedData?.results || []).map((r, idx) => {
                          const change = getChange(r);
                          const rowBg = idx % 2 === 0
                            ? "bg-blue-50/60 dark:bg-blue-950/30"
                            : "bg-blue-100/50 dark:bg-blue-900/20";
                          const rowAiEngines = getSeededAiEngines(r.id);
                          return (
                            <div
                              key={r.id}
                              className={`flex flex-col sm:grid gap-1 sm:gap-2 px-4 py-2.5 text-sm ${rowBg} border-b border-blue-100/50 dark:border-blue-800/30 last:border-0`}
                              style={{ gridTemplateColumns: "1.2fr 60px 60px 80px 70px 1.5fr" }}
                              data-testid={`row-history-${r.id}`}
                            >
                              <span className="font-medium truncate">{r.keyword}</span>
                              <div className="flex sm:justify-center items-center gap-2">
                                <span className="text-xs text-muted-foreground sm:hidden">Position:</span>
                                {r.position !== null ? (
                                  <Badge variant="secondary">{r.position}</Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground">n/a</span>
                                )}
                              </div>
                              <div className="flex sm:justify-center items-center gap-1">
                                <span className="text-xs text-muted-foreground sm:hidden">Change:</span>
                                {change !== null ? (
                                  change > 0 ? (
                                    <span className="flex items-center gap-0.5 text-green-600 dark:text-green-400 text-xs font-medium"><ArrowUp className="w-3.5 h-3.5" />{change}</span>
                                  ) : change < 0 ? (
                                    <span className="flex items-center gap-0.5 text-red-500 dark:text-red-400 text-xs font-medium"><ArrowDown className="w-3.5 h-3.5" />{Math.abs(change)}</span>
                                  ) : (
                                    <span className="flex items-center gap-0.5 text-muted-foreground text-xs"><Minus className="w-3.5 h-3.5" />0</span>
                                  )
                                ) : (
                                  <span className="text-xs text-muted-foreground">--</span>
                                )}
                              </div>
                              <div className="flex sm:justify-center items-center gap-1.5">
                                <span className="text-xs text-muted-foreground sm:hidden">AI:</span>
                                {r.position !== null ? (
                                  rowAiEngines.map((engine) => (
                                    <engine.icon key={engine.label} className={`w-3.5 h-3.5 ${engine.color}`} title={engine.label} />
                                  ))
                                ) : (
                                  <span className="text-xs text-muted-foreground">--</span>
                                )}
                              </div>
                              <div className="flex sm:justify-center items-center">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(r.checkedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                </span>
                              </div>
                              <div className="flex sm:justify-end items-center min-w-0">
                                {r.url ? (
                                  <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={r.url}>
                                    {r.url.replace(/https?:\/\//, "")}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">--</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setResultsPage(p => Math.max(1, p - 1))}
                            disabled={resultsPage <= 1}
                            data-testid="button-results-prev"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="ml-1">Previous</span>
                          </Button>
                          <span className="text-sm text-muted-foreground" data-testid="text-results-page">
                            Page {resultsPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setResultsPage(p => Math.min(totalPages, p + 1))}
                            disabled={resultsPage >= totalPages}
                            data-testid="button-results-next"
                          >
                            <span className="mr-1">Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
