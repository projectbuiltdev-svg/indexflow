import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import ReviewQueueTab from "./ReviewQueueTab";
import RankTrackingTab from "./RankTrackingTab";
import {
  Plus,
  ArrowLeft,
  Loader2,
  BarChart3,
  FileText,
  ShieldAlert,
  Settings,
  Search,
  Eye,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Pause,
  Archive,
  RotateCcw,
  Activity,
  Globe,
  MapPin,
  Briefcase,
  Calendar,
  Cpu,
  ShoppingCart,
  LineChart,
} from "lucide-react";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-300" },
  generating: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  reviewing: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
  publishing: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
  live: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
  monitoring: { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-300" },
  paused: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300" },
  archived: { bg: "bg-gray-100 dark:bg-gray-800/50", text: "text-gray-500 dark:text-gray-500" },
  active: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
};

interface TransitionMeta {
  from: string;
  to: string;
  label: string;
  requiresConfirmation: boolean;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  urlStructure: string;
  aiModel: string;
  totalPages: number;
  pagesGenerated: number;
  pagesPublished: number;
  servicesCount: number;
  locationsCount: number;
  createdAt: string;
  availableTransitions: TransitionMeta[];
}

interface CampaignStats {
  totalPages: number;
  pagesGenerated: number;
  published: number;
  inReview: number;
  failed: number;
  similarityHolds: number;
  qualityGateFailures: number;
  deleted: number;
}

interface ActivityEntry {
  id: string;
  action: string;
  message: string;
  level: string;
  createdAt: string;
}

interface PageItem {
  id: string;
  title: string;
  slug: string;
  serviceName: string;
  locationName: string;
  qualityGateStatus: string;
  similarityScore: number | null;
  isPublished: boolean;
  createdAt: string;
}

interface CampaignDashboardProps {
  workspaceId: string;
  onOpenWizard?: () => void;
}

export default function CampaignDashboard({ workspaceId, onOpenWizard }: CampaignDashboardProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});
  const [confirmDialog, setConfirmDialog] = useState<{ campaignId: string; transition: TransitionMeta } | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await apiRequest("GET", `/api/pseo/campaigns?workspaceId=${workspaceId}`);
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch {} finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleTransition = async (campaignId: string, newStatus: string) => {
    setActionLoading((prev) => ({ ...prev, [campaignId]: newStatus }));
    try {
      await apiRequest("PATCH", `/api/pseo/campaigns/${campaignId}/status`, { status: newStatus });
      await fetchCampaigns();
    } catch {} finally {
      setActionLoading((prev) => { const n = { ...prev }; delete n[campaignId]; return n; });
      setConfirmDialog(null);
    }
  };

  const onTransitionClick = (campaignId: string, transition: TransitionMeta) => {
    if (transition.requiresConfirmation) {
      setConfirmDialog({ campaignId, transition });
    } else {
      handleTransition(campaignId, transition.to);
    }
  };

  if (selectedCampaignId) {
    return (
      <CampaignDetailView
        campaignId={selectedCampaignId}
        onBack={() => { setSelectedCampaignId(null); fetchCampaigns(); }}
        onTransitionClick={onTransitionClick}
        actionLoading={actionLoading}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="campaign-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">pSEO Campaigns</h2>
          <p className="text-sm text-muted-foreground">{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {}} data-testid="button-add-addon">
            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
            Add Campaign Slot
          </Button>
          {onOpenWizard && (
            <Button size="sm" onClick={onOpenWizard} data-testid="button-new-campaign">
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Campaign
            </Button>
          )}
        </div>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Globe className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium">No Campaigns Yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first pSEO campaign to generate location pages at scale.</p>
              {onOpenWizard && (
                <Button className="mt-4" onClick={onOpenWizard} data-testid="button-create-first">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm" data-testid="table-campaigns">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-center p-3 font-medium">Locations</th>
                <th className="text-center p-3 font-medium">Services</th>
                <th className="text-center p-3 font-medium">Generated</th>
                <th className="text-center p-3 font-medium">Published</th>
                <th className="text-left p-3 font-medium">Created</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-muted/30 cursor-pointer"
                  onClick={() => setSelectedCampaignId(c.id)}
                  data-testid={`row-campaign-${c.id}`}
                >
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="p-3 text-center">{c.locationsCount}</td>
                  <td className="p-3 text-center">{c.servicesCount}</td>
                  <td className="p-3 text-center">{c.pagesGenerated || 0}</td>
                  <td className="p-3 text-center">{c.pagesPublished || 0}</td>
                  <td className="p-3 text-muted-foreground text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setSelectedCampaignId(c.id)} data-testid={`button-view-${c.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {c.availableTransitions.filter((t) => ["paused", "archived"].includes(t.to) || t.label.includes("Resume") || t.label.includes("Pause")).slice(0, 2).map((t) => (
                        <Button
                          key={t.to}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          disabled={!!actionLoading[c.id]}
                          onClick={() => onTransitionClick(c.id, t)}
                          data-testid={`button-transition-${c.id}-${t.to}`}
                        >
                          {actionLoading[c.id] === t.to ? <Loader2 className="h-3 w-3 animate-spin" /> : getTransitionIcon(t.to)}
                          <span className="ml-1">{t.label.split(" ")[0]}</span>
                        </Button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDialog && (
        <Dialog open onOpenChange={() => setConfirmDialog(null)}>
          <DialogContent data-testid="dialog-confirm-transition">
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to "{confirmDialog.transition.label}"?
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialog(null)}>Cancel</Button>
              <Button
                onClick={() => handleTransition(confirmDialog.campaignId, confirmDialog.transition.to)}
                disabled={!!actionLoading[confirmDialog.campaignId]}
              >
                {actionLoading[confirmDialog.campaignId] ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function CampaignDetailView({
  campaignId,
  onBack,
  onTransitionClick,
  actionLoading,
}: {
  campaignId: string;
  onBack: () => void;
  onTransitionClick: (campaignId: string, transition: TransitionMeta) => void;
  actionLoading: Record<string, string>;
}) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDetail = useCallback(async () => {
    try {
      const res = await apiRequest("GET", `/api/pseo/campaigns/${campaignId}/detail`);
      const data = await res.json();
      setCampaign(data.campaign);
      setStats(data.stats);
    } catch {} finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  if (isLoading || !campaign || !stats) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading campaign...
      </div>
    );
  }

  const progressPercent = stats.totalPages > 0 ? Math.round((stats.pagesGenerated / stats.totalPages) * 100) : 0;

  return (
    <div className="space-y-4" data-testid="campaign-detail">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2" data-testid="text-campaign-name">
                {campaign.name}
                <StatusBadge status={campaign.status} />
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(campaign.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{stats.totalPages} pages</span>
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" />{campaign.aiModel}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{campaign.locationsCount} locations</span>
                <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{campaign.servicesCount} services</span>
              </CardDescription>
            </div>
            <div className="flex gap-1">
              {campaign.availableTransitions.slice(0, 3).map((t) => (
                <Button
                  key={t.to}
                  variant="outline"
                  size="sm"
                  disabled={!!actionLoading[campaign.id]}
                  onClick={() => onTransitionClick(campaign.id, t)}
                  data-testid={`button-detail-transition-${t.to}`}
                >
                  {actionLoading[campaign.id] === t.to ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : getTransitionIcon(t.to)}
                  <span className="ml-1">{t.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="pages" data-testid="tab-pages">
            <FileText className="h-4 w-4 mr-2" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="review" data-testid="tab-review">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Review Queue
            {stats.inReview > 0 && <Badge variant="secondary" className="ml-2">{stats.inReview}</Badge>}
          </TabsTrigger>
          {campaign.status === "monitoring" && (
            <TabsTrigger value="rankings" data-testid="tab-rankings">
              <LineChart className="h-4 w-4 mr-2" />
              Rankings
            </TabsTrigger>
          )}
          <TabsTrigger value="settings" data-testid="tab-settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab campaign={campaign} stats={stats} campaignId={campaignId} onRefresh={fetchDetail} />
        </TabsContent>
        <TabsContent value="pages" className="mt-4">
          <PagesTab campaignId={campaignId} />
        </TabsContent>
        <TabsContent value="review" className="mt-4">
          <ReviewQueueTab campaignId={campaignId} isGenerating={campaign.status === "generating"} />
        </TabsContent>
        {campaign.status === "monitoring" && (
          <TabsContent value="rankings" className="mt-4">
            <RankTrackingTab campaignId={campaignId} />
          </TabsContent>
        )}
        <TabsContent value="settings" className="mt-4">
          <SettingsTab campaign={campaign} campaignId={campaignId} onRefresh={fetchDetail} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab({ campaign, stats, campaignId, onRefresh }: { campaign: Campaign; stats: CampaignStats; campaignId: string; onRefresh: () => void }) {
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [actLoading, setActLoading] = useState(true);
  const [generateLoading, setGenerateLoading] = useState(false);

  useEffect(() => {
    apiRequest("GET", `/api/pseo/campaigns/${campaignId}/activity`)
      .then((r) => r.json())
      .then((d) => setActivity(d.entries || []))
      .catch(() => {})
      .finally(() => setActLoading(false));
  }, [campaignId]);

  const progressPercent = stats.totalPages > 0 ? Math.round((stats.pagesGenerated / stats.totalPages) * 100) : 0;

  const handleGenerate = async () => {
    setGenerateLoading(true);
    try {
      await apiRequest("POST", `/api/pseo/campaigns/${campaignId}/generate`);
      onRefresh();
    } catch {} finally {
      setGenerateLoading(false);
    }
  };

  return (
    <div className="space-y-4" data-testid="overview-tab">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Generation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-3" data-testid="progress-bar" />
          <p className="text-xs text-muted-foreground mt-2" data-testid="text-progress">
            {stats.pagesGenerated} / {stats.totalPages} pages generated ({progressPercent}%)
          </p>
          <div className="flex gap-2 mt-3">
            {(campaign.status === "reviewing" || campaign.status === "draft" || campaign.status === "active") && (
              <Button size="sm" onClick={handleGenerate} disabled={generateLoading} data-testid="button-generate">
                {generateLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Play className="h-3.5 w-3.5 mr-1" />}
                Generate Pages
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3" data-testid="stats-grid">
        <StatCard label="Total Pages" value={stats.totalPages} />
        <StatCard label="Published" value={stats.published} color="green" />
        <StatCard label="In Review" value={stats.inReview} color="amber" />
        <StatCard label="Failed" value={stats.failed} color="red" />
        <StatCard label="Similarity Holds" value={stats.similarityHolds} color="orange" />
        <StatCard label="QG Failures" value={stats.qualityGateFailures} color="red" />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {actLoading ? (
            <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading activity...
            </div>
          ) : activity.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No recent activity</p>
          ) : (
            <div className="space-y-2" data-testid="list-activity">
              {activity.map((entry) => (
                <div key={entry.id} className="flex items-start gap-2 text-xs border-b pb-2 last:border-0">
                  <Badge
                    variant={entry.level === "error" ? "destructive" : "secondary"}
                    className="text-[10px] shrink-0 mt-0.5"
                  >
                    {entry.level}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{entry.message}</p>
                    <p className="text-muted-foreground mt-0.5">{new Date(entry.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PagesTab({ campaignId }: { campaignId: string }) {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});

  const fetchPages = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(currentPage), limit: "50" });
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchQuery) params.append("search", searchQuery);
      const res = await apiRequest("GET", `/api/pseo/campaigns/${campaignId}/pages?${params}`);
      const data = await res.json();
      setPages(data.pages || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch {} finally {
      setIsLoading(false);
    }
  }, [campaignId, currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handlePageAction = async (pageId: string, action: "regenerate" | "delete") => {
    setActionLoading((prev) => ({ ...prev, [pageId]: action }));
    try {
      if (action === "regenerate") {
        await apiRequest("POST", `/api/pseo/review/${pageId}/regenerate`);
      } else {
        await apiRequest("POST", `/api/pseo/review/${pageId}/reject`);
      }
      await fetchPages();
    } catch {} finally {
      setActionLoading((prev) => { const n = { ...prev }; delete n[pageId]; return n; });
    }
  };

  return (
    <div className="space-y-4" data-testid="pages-tab">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or slug..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-9 h-8 text-sm"
            data-testid="input-search-pages"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[140px] h-8 text-sm" data-testid="select-status-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="held">Held</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="deleted">Deleted</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground" data-testid="text-total-pages">{total} pages</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading pages...
        </div>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-8 text-sm text-muted-foreground">
            No pages match the current filters.
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm" data-testid="table-pages">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Title</th>
                <th className="text-left p-3 font-medium">Slug</th>
                <th className="text-left p-3 font-medium">Service</th>
                <th className="text-left p-3 font-medium">Location</th>
                <th className="text-center p-3 font-medium">Status</th>
                <th className="text-center p-3 font-medium">Similarity</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id} className="border-t" data-testid={`row-page-${p.id}`}>
                  <td className="p-3 font-medium max-w-[200px] truncate" data-testid={`text-page-title-${p.id}`}>{p.title}</td>
                  <td className="p-3 text-muted-foreground text-xs max-w-[150px] truncate">/{p.slug}</td>
                  <td className="p-3"><Badge variant="outline" className="text-[10px]">{p.serviceName}</Badge></td>
                  <td className="p-3"><Badge variant="outline" className="text-[10px]">{p.locationName}</Badge></td>
                  <td className="p-3 text-center">
                    <PageStatusBadge status={p.qualityGateStatus} isPublished={p.isPublished} />
                  </td>
                  <td className="p-3 text-center text-xs text-muted-foreground">
                    {p.similarityScore != null ? `${(p.similarityScore * 100).toFixed(0)}%` : "—"}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handlePageAction(p.id, "regenerate")} disabled={!!actionLoading[p.id]} data-testid={`button-regen-${p.id}`}>
                        {actionLoading[p.id] === "regenerate" ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                        Regen
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive" onClick={() => handlePageAction(p.id, "delete")} disabled={!!actionLoading[p.id]} data-testid={`button-delete-${p.id}`}>
                        {actionLoading[p.id] === "delete" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3 mr-1" />}
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-2">
          <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => p - 1)} data-testid="button-pages-prev">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-xs text-muted-foreground" data-testid="text-pages-page-info">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)} data-testid="button-pages-next">
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

function SettingsTab({ campaign, campaignId, onRefresh }: { campaign: Campaign; campaignId: string; onRefresh: () => void }) {
  const [name, setName] = useState(campaign.name);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || name === campaign.name) return;
    setSaving(true);
    try {
      await apiRequest("PATCH", `/api/pseo/campaigns/${campaignId}/status`, { name });
      onRefresh();
    } catch {} finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4" data-testid="settings-tab">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Campaign Name</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-sm h-8 text-sm" data-testid="input-campaign-name" />
            <Button size="sm" onClick={handleSave} disabled={saving || name === campaign.name} data-testid="button-save-name">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">URL Structure</CardTitle>
          <CardDescription className="text-xs">Read-only after campaign activation</CardDescription>
        </CardHeader>
        <CardContent>
          <code className="text-xs bg-muted px-2 py-1 rounded" data-testid="text-url-structure">{campaign.urlStructure}</code>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">AI Model</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm" data-testid="text-ai-model">{campaign.aiModel}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Campaign Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Locations:</span> {campaign.locationsCount}</div>
            <div><span className="text-muted-foreground">Services:</span> {campaign.servicesCount}</div>
            <div><span className="text-muted-foreground">Total Pages:</span> {campaign.totalPages}</div>
            <div><span className="text-muted-foreground">Status:</span> {campaign.status}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  const colorClasses = {
    green: "text-green-600 dark:text-green-400",
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
    orange: "text-orange-600 dark:text-orange-400",
  };

  return (
    <Card>
      <CardContent className="pt-4 pb-3 px-4">
        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`text-xl font-bold mt-0.5 ${color ? colorClasses[color as keyof typeof colorClasses] || "" : ""}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.draft;
  const isSpinning = status === "generating" || status === "publishing";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${colors.bg} ${colors.text}`} data-testid={`badge-status-${status}`}>
      {isSpinning && <Loader2 className="h-3 w-3 animate-spin" />}
      {status}
    </span>
  );
}

function PageStatusBadge({ status, isPublished }: { status: string; isPublished: boolean }) {
  if (isPublished) return <Badge variant="default" className="text-[10px] bg-green-600">published</Badge>;
  if (status === "fail") return <Badge variant="destructive" className="text-[10px]">failed</Badge>;
  if (status === "review") return <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">held</Badge>;
  if (status === "pass") return <Badge variant="secondary" className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">pass</Badge>;
  return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
}

function getTransitionIcon(to: string) {
  switch (to) {
    case "paused": return <Pause className="h-3 w-3" />;
    case "archived": return <Archive className="h-3 w-3" />;
    case "generating": return <Play className="h-3 w-3" />;
    case "live": return <Globe className="h-3 w-3" />;
    case "draft": return <RotateCcw className="h-3 w-3" />;
    default: return <Play className="h-3 w-3" />;
  }
}
