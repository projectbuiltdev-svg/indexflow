import { useState, useRef, useMemo } from "react";
import { TrendingUp, Search, Globe, CheckCircle, AlertCircle, ArrowUp, ArrowDown, Minus, Plus, Upload, Target, Trash2, Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText, Grid3X3, MapPin, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminLayout } from "@/components/admin-layout";

const seoStats = [
  { label: "Total Keywords Tracked", value: "342", change: "Across 38 clients", icon: TrendingUp },
  { label: "Avg. Position", value: "14.3", change: "-2.1 from last week", icon: ArrowUp },
  { label: "GSC Connected", value: "24", change: "of 47 clients", icon: Search },
  { label: "Domains Monitored", value: "38", change: "Active tracking", icon: Globe },
];

const clientRankings = [
  { id: 1, name: "Acme Digital", domain: "acmedigital.com", keywords: 28, avgPosition: 8.4, topKeyword: "seo agency near me", topPosition: 3, gscConnected: true, change: "up" },
  { id: 2, name: "Summit Marketing", domain: "summitmarketing.com", keywords: 35, avgPosition: 12.7, topKeyword: "marketing agency mountain view", topPosition: 5, gscConnected: true, change: "up" },
  { id: 3, name: "Dragon Media", domain: "dragonmedia.com", keywords: 18, avgPosition: 19.2, topKeyword: "web design agency", topPosition: 8, gscConnected: true, change: "down" },
  { id: 4, name: "Coastal SEO", domain: "coastalseo.com", keywords: 22, avgPosition: 15.6, topKeyword: "content writing services", topPosition: 4, gscConnected: false, change: "same" },
  { id: 5, name: "Sakura Digital", domain: "sakuradigital.com", keywords: 15, avgPosition: 21.3, topKeyword: "local seo services", topPosition: 11, gscConnected: true, change: "up" },
  { id: 6, name: "Rustic Creative", domain: "rusticcreative.com", keywords: 12, avgPosition: 28.9, topKeyword: "organic seo services", topPosition: 14, gscConnected: false, change: "down" },
];

const initialClientKeywords: Record<number, string[]> = {
  1: ["seo agency near me", "best seo services", "local seo optimization", "content marketing agency", "digital marketing firm", "link building services", "seo audit services", "keyword research"],
  2: ["marketing agency mountain view", "digital marketing services", "social media management", "brand strategy consultant", "ppc management", "email marketing agency", "lead generation", "conversion optimization"],
  3: ["web design agency", "ecommerce seo services", "technical seo audit", "site speed optimization", "schema markup services", "core web vitals", "mobile seo"],
  4: ["content writing services", "blog writing agency", "copywriting services", "content strategy", "seo content creation", "guest post outreach"],
  5: ["local seo services", "google business profile", "citation building", "local search optimization", "map pack ranking"],
  6: ["organic seo services", "white hat seo", "enterprise seo", "seo consulting"],
};

const aiMentionStats = [
  { engine: "ChatGPT", clientsMentioned: 18, totalMentions: 47 },
  { engine: "Google AI Overview", clientsMentioned: 12, totalMentions: 34 },
  { engine: "Perplexity", clientsMentioned: 9, totalMentions: 22 },
  { engine: "Claude", clientsMentioned: 6, totalMentions: 15 },
];

const ChangeIcon = ({ change }: { change: string }) => {
  if (change === "up") return <ArrowUp className="w-3.5 h-3.5 text-green-500" />;
  if (change === "down") return <ArrowDown className="w-3.5 h-3.5 text-red-500" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

const MAX_KEYWORDS = 1000;

export default function AdminSeo() {
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clientKeywords, setClientKeywords] = useState<Record<number, string[]>>(() => ({ ...initialClientKeywords }));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 6;

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clientRankings;
    return clientRankings.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.domain.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedClients = filteredClients.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const selectedClientData = selectedClient ? clientRankings.find((c) => c.id === selectedClient) : null;
  const selectedClientKws = selectedClient ? (clientKeywords[selectedClient] || []) : [];
  const remainingSlots = MAX_KEYWORDS - selectedClientKws.length;

  const addKeywordsToClient = (kws: string[]) => {
    if (!selectedClient) return;
    const trimmed = kws.slice(0, remainingSlots);
    if (trimmed.length === 0) return;
    setClientKeywords((prev) => ({
      ...prev,
      [selectedClient]: [...(prev[selectedClient] || []), ...trimmed],
    }));
  };

  const handleAddKeywords = () => {
    const parsed = keywordInput
      .split(/[\n,]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);
    if (parsed.length === 0) return;
    addKeywordsToClient(parsed);
    setKeywordInput("");
  };

  const processCsvFile = (file: File) => {
    if (!file.name.match(/\.(csv|txt)$/i)) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim().length > 0);
      const kws = lines
        .map((line) => line.split(",")[0].trim())
        .filter((k) => k.length > 0);
      if (kws.length > 0) addKeywordsToClient(kws);
    };
    reader.readAsText(file);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processCsvFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processCsvFile(file);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">SEO & Rankings</h1>
        <p className="text-sm text-muted-foreground">Monitor keyword rankings, Google Search Console, and AI search visibility</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {seoStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <CardTitle>Client Rankings Overview</CardTitle>
                <CardDescription>Rank Tracker performance per client (DataForSEO powered)</CardDescription>
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  data-testid="input-search-seo-clients"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Client</th>
                    <th className="pb-3 font-medium text-muted-foreground">Domain</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Keywords</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Avg. Pos</th>
                    <th className="pb-3 font-medium text-muted-foreground">Top Keyword</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Pos</th>
                    <th className="pb-3 font-medium text-muted-foreground">Trend</th>
                    <th className="pb-3 font-medium text-muted-foreground">GSC</th>
                    <th className="pb-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.map((client) => (
                    <tr key={client.id} className="border-b last:border-0" data-testid={`row-seo-client-${client.id}`}>
                      <td className="py-3 font-medium text-sm">{client.name}</td>
                      <td className="py-3 text-sm text-muted-foreground">{client.domain}</td>
                      <td className="py-3 text-sm text-right">{client.keywords}</td>
                      <td className="py-3 text-sm text-right font-medium">{client.avgPosition}</td>
                      <td className="py-3 text-sm text-muted-foreground max-w-[180px] truncate">{client.topKeyword}</td>
                      <td className="py-3 text-sm text-right font-medium">{client.topPosition}</td>
                      <td className="py-3">
                        <ChangeIcon change={client.change} />
                      </td>
                      <td className="py-3">
                        {client.gscConnected ? (
                          <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Not Set Up
                          </Badge>
                        )}
                      </td>
                      <td className="py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                          data-testid={`button-manage-keywords-${client.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredClients.length > itemsPerPage && (
              <div className="flex items-center justify-between gap-4 pt-4 border-t mt-4">
                <span className="text-sm text-muted-foreground">
                  Showing {(safePage - 1) * itemsPerPage + 1}–{Math.min(safePage * itemsPerPage, filteredClients.length)} of {filteredClients.length}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground mr-2">Page {safePage} of {totalPages}</span>
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={safePage <= 1} data-testid="button-seo-first-page">
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} data-testid="button-seo-prev-page">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} data-testid="button-seo-next-page">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={safePage >= totalPages} data-testid="button-seo-last-page">
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Search Visibility</CardTitle>
              <CardDescription>Client mentions across AI search engines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiMentionStats.map((engine) => (
                  <div key={engine.engine} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{engine.engine}</p>
                      <p className="text-xs text-muted-foreground">{engine.clientsMentioned} clients mentioned</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{engine.totalMentions}</p>
                      <p className="text-xs text-muted-foreground">mentions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedClientData && (
            <Card data-testid="card-admin-keyword-manager">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="w-4 h-4 shrink-0" />
                      {selectedClientData.name}
                    </CardTitle>
                    <CardDescription>{selectedClientData.domain}</CardDescription>
                  </div>
                  <Badge variant="secondary" data-testid="badge-admin-keyword-count">
                    {selectedClientKws.length} / {MAX_KEYWORDS}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Add keywords, one per line or comma-separated..."
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    rows={3}
                    data-testid="textarea-admin-keywords"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={handleAddKeywords}
                    disabled={!keywordInput.trim()}
                    data-testid="button-admin-add-keywords"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="ml-1">Add</span>
                  </Button>
                </div>

                <div className="relative flex items-center gap-3 py-1">
                  <div className="flex-1 border-t border-dashed" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">or upload CSV</span>
                  <div className="flex-1 border-t border-dashed" />
                </div>

                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-md border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-muted-foreground/50"
                  }`}
                  data-testid="dropzone-admin-csv"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleCsvUpload}
                    className="hidden"
                    data-testid="input-admin-csv-upload"
                  />
                  <Upload className={`w-6 h-6 mx-auto mb-1.5 ${isDragging ? "text-primary" : "text-muted-foreground/50"}`} />
                  <p className="text-xs font-medium">
                    {isDragging ? "Drop CSV here" : "Drag & drop CSV"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    or <span className="underline">browse</span> (max {MAX_KEYWORDS})
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Current Keywords</p>
                  {selectedClientKws.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No keywords yet</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto">
                      {selectedClientKws.map((kw: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs" data-testid={`badge-admin-keyword-${i}`}>
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Local Search Grid Overview */}
      <Card className="mb-6" data-testid="card-admin-local-search-grid">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5" />
                Local Search Grid
              </CardTitle>
              <CardDescription>Geo-grid rank tracking across all client workspaces (DataForSEO powered)</CardDescription>
            </div>
            <Badge variant="secondary">25 keywords per workspace</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="p-4 text-center" data-testid="card-admin-grid-stat-workspaces">
              <div className="text-2xl font-bold text-primary">38</div>
              <p className="text-xs text-muted-foreground">Workspaces with Grids</p>
            </Card>
            <Card className="p-4 text-center" data-testid="card-admin-grid-stat-keywords">
              <div className="text-2xl font-bold text-primary">412</div>
              <p className="text-xs text-muted-foreground">Grid Keywords</p>
            </Card>
            <Card className="p-4 text-center" data-testid="card-admin-grid-stat-avg">
              <div className="text-2xl font-bold text-primary">6.8</div>
              <p className="text-xs text-muted-foreground">Avg. Grid Position</p>
            </Card>
            <Card className="p-4 text-center" data-testid="card-admin-grid-stat-3pack">
              <div className="text-2xl font-bold text-primary">61%</div>
              <p className="text-xs text-muted-foreground">In 3-Pack (Avg)</p>
            </Card>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" data-testid="table-admin-grid-clients">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Client</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Grid Keywords</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Grid Size</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Avg. Position</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">3-Pack %</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Trend</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: "Acme Digital", gridKeywords: 18, gridSize: "5x5", avgPos: 4.2, threePack: 72, status: "active", change: "up" },
                  { id: 2, name: "Summit Marketing", gridKeywords: 22, gridSize: "5x5", avgPos: 6.1, threePack: 58, status: "active", change: "up" },
                  { id: 3, name: "Dragon Media", gridKeywords: 12, gridSize: "5x5", avgPos: 9.8, threePack: 38, status: "active", change: "down" },
                  { id: 4, name: "Coastal SEO", gridKeywords: 15, gridSize: "5x5", avgPos: 5.5, threePack: 65, status: "active", change: "up" },
                  { id: 5, name: "Sakura Digital", gridKeywords: 8, gridSize: "5x5", avgPos: 11.2, threePack: 29, status: "active", change: "same" },
                  { id: 6, name: "Rustic Creative", gridKeywords: 0, gridSize: "—", avgPos: 0, threePack: 0, status: "not_setup", change: "same" },
                ].map((client) => (
                  <tr key={client.id} className="border-b last:border-0" data-testid={`row-grid-client-${client.id}`}>
                    <td className="py-3 font-medium text-sm">{client.name}</td>
                    <td className="py-3 text-sm text-right">{client.gridKeywords} / 25</td>
                    <td className="py-3 text-sm text-right">{client.gridSize}</td>
                    <td className="py-3 text-sm text-right font-medium">
                      {client.avgPos > 0 ? client.avgPos : "—"}
                    </td>
                    <td className="py-3 text-sm text-right font-medium">
                      {client.threePack > 0 ? `${client.threePack}%` : "—"}
                    </td>
                    <td className="py-3">
                      {client.status === "active" ? (
                        <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Not Set Up
                        </Badge>
                      )}
                    </td>
                    <td className="py-3">
                      <ChangeIcon change={client.change} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground flex items-center gap-2">
            <Settings className="w-4 h-4 shrink-0" />
            Grid scans run weekly (Sundays 20:00) via DataForSEO Standard Queue at $0.0006/point
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform SEO Configuration</CardTitle>
          <CardDescription>Platform SEO tools and integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Rank Tracker
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> DataForSEO API (Standard Queue)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Google SERP tracking (depth 100)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> AI search engine mentions</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> CSV keyword upload (max 1,000)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Free weekly scans (all keywords)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> On-demand credits: $10/5, $40/25</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> 5 free starter credits per client</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Credit cap: 250 keywords per scan</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" />
                Google Search Console
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> OAuth-based Google sign-in</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Top search queries & pages</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Clicks, impressions, CTR, position</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Flexible date ranges (24h to 16m)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Per-client GSC property</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-primary" />
                Local Search Grid
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Geo-grid Google Maps tracking</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> 5x5 grid (25 scan points)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> 25 keywords per workspace</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Pay-as-you-go credits ($10/5 scans)</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Color-coded heatmap results</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> DataForSEO Standard Queue</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                AI Visibility
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> ChatGPT mention tracking</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Google AI Overview detection</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Perplexity visibility</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Claude citation tracking</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" /> Fullscreen analysis mode</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
