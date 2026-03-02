import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  GitCompare,
  CheckCheck,
  Trash2,
  Pencil,
  Save,
} from "lucide-react";

const FALLBACK_POLL_INTERVAL_MS = 30000;
const FALLBACK_ROWS_PER_PAGE = 25;

interface ReviewItem {
  id: string;
  title: string;
  slug: string;
  serviceName: string;
  locationName: string;
  qualityGateStatus: string;
  qualityFailReasons: string[];
  similarityScore: number | null;
  comparisonPageId: string | null;
  comparisonPageTitle: string | null;
  wordCount: number;
  paragraphVariants: string[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  h1Variant: string | null;
  createdAt: string;
  type: "quality_gate" | "similarity_hold";
}

interface ReviewQueueData {
  items: ReviewItem[];
  total: number;
  qualityFailCount: number;
  similarityHoldCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ReviewConfig {
  pollIntervalMs: number;
  rowsPerPage: number;
}

interface ReviewQueueTabProps {
  campaignId: string;
  isGenerating?: boolean;
}

export default function ReviewQueueTab({ campaignId, isGenerating }: ReviewQueueTabProps) {
  const [data, setData] = useState<ReviewQueueData | null>(null);
  const [config, setConfig] = useState<ReviewConfig>({ pollIntervalMs: FALLBACK_POLL_INTERVAL_MS, rowsPerPage: FALLBACK_ROWS_PER_PAGE });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"quality" | "similarity">("quality");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});
  const [comparisonModal, setComparisonModal] = useState<ReviewItem | null>(null);
  const [bulkLoading, setBulkLoading] = useState<string | null>(null);

  useEffect(() => {
    apiRequest("GET", "/api/pseo/review/config")
      .then((res) => res.json())
      .then((cfg) => setConfig(cfg))
      .catch(() => {});
  }, []);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await apiRequest("GET", `/api/pseo/campaigns/${campaignId}/review-queue?page=${currentPage}&limit=${config.rowsPerPage}`);
      const result = await res.json();
      setData(result);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, currentPage, config.rowsPerPage]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(fetchQueue, config.pollIntervalMs);
    return () => clearInterval(interval);
  }, [isGenerating, fetchQueue, config.pollIntervalMs]);

  const handleAction = async (itemId: string, action: "approve" | "reject" | "regenerate") => {
    setActionLoading((prev) => ({ ...prev, [itemId]: action }));
    try {
      await apiRequest("POST", `/api/pseo/review/${itemId}/${action}`);
      await fetchQueue();
    } catch {
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }
  };

  const handleBulkAction = async (action: "approve" | "reject") => {
    setBulkLoading(action);
    try {
      await apiRequest("POST", `/api/pseo/review/bulk-${action}`, { campaignId });
      await fetchQueue();
    } catch {
    } finally {
      setBulkLoading(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading review queue...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.total === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8" data-testid="text-queue-empty">
            <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-green-500" />
            <p className="font-medium">Review Queue Empty</p>
            <p className="text-sm text-muted-foreground mt-1">All pages have passed quality gates and similarity checks.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const qualityItems = data.items.filter((i) => i.type === "quality_gate");
  const similarityItems = data.items.filter((i) => i.type === "similarity_hold");

  return (
    <div className="space-y-4" data-testid="review-queue-tab">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                Review Queue
              </CardTitle>
              <CardDescription className="mt-1">
                {data.total} page{data.total !== 1 ? "s" : ""} require review
                {isGenerating && (
                  <span className="ml-2 text-amber-500">
                    — polling every {config.pollIntervalMs / 1000}s
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("approve")}
                disabled={!!bulkLoading}
                data-testid="button-bulk-approve"
              >
                {bulkLoading === "approve" ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5 mr-1" />}
                Approve All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("reject")}
                disabled={!!bulkLoading}
                data-testid="button-bulk-reject"
              >
                {bulkLoading === "reject" ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 mr-1" />}
                Reject All
              </Button>
              <Button variant="ghost" size="sm" onClick={fetchQueue} data-testid="button-refresh-queue">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "quality" | "similarity")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quality" data-testid="tab-quality-failures">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Quality Failures
                <Badge variant="secondary" className="ml-2">{data.qualityFailCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="similarity" data-testid="tab-similarity-holds">
                <GitCompare className="h-4 w-4 mr-2" />
                Similarity Holds
                <Badge variant="secondary" className="ml-2">{data.similarityHoldCount}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quality" className="mt-4">
              {qualityItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6" data-testid="text-no-quality">
                  No quality gate failures on this page
                </p>
              ) : (
                <div className="space-y-2" data-testid="list-quality-items">
                  {qualityItems.map((item) => (
                    <QualityRow
                      key={item.id}
                      item={item}
                      expanded={expandedRows.has(item.id)}
                      isEditing={editingRow === item.id}
                      onToggleExpand={() => toggleExpand(item.id)}
                      onStartEdit={() => { setEditingRow(item.id); if (!expandedRows.has(item.id)) toggleExpand(item.id); }}
                      onCancelEdit={() => setEditingRow(null)}
                      onSaveEdit={async (updates) => {
                        setActionLoading((prev) => ({ ...prev, [item.id]: "save" }));
                        try {
                          await apiRequest("POST", `/api/pseo/review/${item.id}/update`, updates);
                          setEditingRow(null);
                          await fetchQueue();
                        } catch {} finally {
                          setActionLoading((prev) => { const next = { ...prev }; delete next[item.id]; return next; });
                        }
                      }}
                      onAction={(action) => handleAction(item.id, action)}
                      loading={actionLoading[item.id]}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="similarity" className="mt-4">
              {similarityItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6" data-testid="text-no-similarity">
                  No similarity holds on this page
                </p>
              ) : (
                <div className="space-y-2" data-testid="list-similarity-items">
                  {similarityItems.map((item) => (
                    <SimilarityRow
                      key={item.id}
                      item={item}
                      onAction={(action) => handleAction(item.id, action)}
                      onCompare={() => setComparisonModal(item)}
                      loading={actionLoading[item.id]}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-xs text-muted-foreground" data-testid="text-page-info">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= data.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                data-testid="button-next-page"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {comparisonModal && (
        <ComparisonModal
          item={comparisonModal}
          onClose={() => setComparisonModal(null)}
          onAction={(action) => {
            handleAction(comparisonModal.id, action);
            setComparisonModal(null);
          }}
        />
      )}
    </div>
  );
}

function QualityRow({
  item,
  expanded,
  isEditing,
  onToggleExpand,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onAction,
  loading,
}: {
  item: ReviewItem;
  expanded: boolean;
  isEditing: boolean;
  onToggleExpand: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: (updates: Record<string, any>) => Promise<void>;
  onAction: (action: "approve" | "reject" | "regenerate") => void;
  loading?: string;
}) {
  const [editTitle, setEditTitle] = useState(item.title);
  const [editMeta, setEditMeta] = useState(item.metaTitle || "");
  const [editDesc, setEditDesc] = useState(item.metaDescription || "");
  const [editH1, setEditH1] = useState(item.h1Variant || "");

  return (
    <div className="border rounded-lg" data-testid={`quality-row-${item.id}`}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button onClick={onToggleExpand} className="shrink-0 text-muted-foreground hover:text-foreground" data-testid={`button-expand-${item.id}`}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" data-testid={`text-title-${item.id}`}>{item.title}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <Badge variant="outline" className="text-[10px]">{item.locationName}</Badge>
              <Badge variant="outline" className="text-[10px]">{item.serviceName}</Badge>
              <span className="text-[10px] text-muted-foreground" data-testid={`text-wordcount-${item.id}`}>
                {item.wordCount} words
              </span>
              <span className="text-[10px] text-muted-foreground">
                {item.qualityFailReasons.length} failure{item.qualityFailReasons.length !== 1 ? "s" : ""}
              </span>
              <span className="text-[10px] text-muted-foreground" data-testid={`text-date-${item.id}`}>
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <Button variant="ghost" size="sm" onClick={onStartEdit} disabled={!!loading || isEditing} className="h-7 px-2 text-xs" data-testid={`button-edit-${item.id}`}>
            <Pencil className="h-3 w-3 mr-1" />
            Fix
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction("approve")} disabled={!!loading} className="h-7 px-2 text-xs" data-testid={`button-approve-${item.id}`}>
            {loading === "approve" ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />}
            Approve
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction("regenerate")} disabled={!!loading} className="h-7 px-2 text-xs" data-testid={`button-regenerate-${item.id}`}>
            {loading === "regenerate" ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Regen
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction("reject")} disabled={!!loading} className="h-7 px-2 text-xs text-destructive" data-testid={`button-reject-${item.id}`}>
            {loading === "reject" ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3 mr-1" />}
            Reject
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t" data-testid={`details-${item.id}`}>
          <p className="text-xs font-medium text-muted-foreground mb-2 mt-2">Failure Reasons:</p>
          <ul className="space-y-1 mb-3">
            {item.qualityFailReasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                {reason}
              </li>
            ))}
          </ul>

          {isEditing && (
            <div className="space-y-3 p-3 rounded-lg bg-muted/50 border" data-testid={`editor-${item.id}`}>
              <p className="text-xs font-medium">Fix and Resubmit</p>
              <div>
                <Label className="text-xs">Title</Label>
                <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="mt-1 h-8 text-xs" data-testid={`input-title-${item.id}`} />
              </div>
              <div>
                <Label className="text-xs">H1 Variant</Label>
                <Input value={editH1} onChange={(e) => setEditH1(e.target.value)} className="mt-1 h-8 text-xs" data-testid={`input-h1-${item.id}`} />
              </div>
              <div>
                <Label className="text-xs">Meta Title</Label>
                <Input value={editMeta} onChange={(e) => setEditMeta(e.target.value)} className="mt-1 h-8 text-xs" data-testid={`input-meta-${item.id}`} />
              </div>
              <div>
                <Label className="text-xs">Meta Description</Label>
                <Textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="mt-1 text-xs min-h-[60px]" data-testid={`input-desc-${item.id}`} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={onCancelEdit} className="h-7 text-xs" data-testid={`button-cancel-edit-${item.id}`}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs"
                  disabled={loading === "save"}
                  onClick={() => onSaveEdit({ title: editTitle, metaTitle: editMeta, metaDescription: editDesc, h1Variant: editH1 })}
                  data-testid={`button-save-edit-${item.id}`}
                >
                  {loading === "save" ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Save className="h-3 w-3 mr-1" />}
                  Save & Resubmit
                </Button>
              </div>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground mt-2">
            Added: {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

function SimilarityRow({
  item,
  onAction,
  onCompare,
  loading,
}: {
  item: ReviewItem;
  onAction: (action: "approve" | "reject" | "regenerate") => void;
  onCompare: () => void;
  loading?: string;
}) {
  const scorePercent = item.similarityScore != null ? (item.similarityScore * 100).toFixed(1) : "—";

  return (
    <div className="border rounded-lg p-3" data-testid={`similarity-row-${item.id}`}>
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate" data-testid={`text-title-${item.id}`}>{item.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="outline" className="text-[10px]">{item.locationName}</Badge>
            <Badge variant="outline" className="text-[10px]">{item.serviceName}</Badge>
            <Badge variant={item.similarityScore && item.similarityScore >= 0.9 ? "destructive" : "secondary"} className="text-[10px]" data-testid={`badge-score-${item.id}`}>
              {scorePercent}% similar
            </Badge>
            {item.comparisonPageTitle && (
              <span className="text-[10px] text-muted-foreground" data-testid={`text-comparison-${item.id}`}>
                vs "{item.comparisonPageTitle}"
              </span>
            )}
            <span className="text-[10px] text-muted-foreground" data-testid={`text-date-${item.id}`}>
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <Button variant="ghost" size="sm" onClick={onCompare} className="h-7 px-2 text-xs" data-testid={`button-compare-${item.id}`}>
            <Eye className="h-3 w-3 mr-1" />
            Compare
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction("approve")} disabled={!!loading} className="h-7 px-2 text-xs" data-testid={`button-approve-${item.id}`}>
            {loading === "approve" ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />}
            Approve
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction("regenerate")} disabled={!!loading} className="h-7 px-2 text-xs" data-testid={`button-regenerate-${item.id}`}>
            {loading === "regenerate" ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            Regen
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onAction("reject")} disabled={!!loading} className="h-7 px-2 text-xs text-destructive" data-testid={`button-reject-${item.id}`}>
            {loading === "reject" ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3 mr-1" />}
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

function ComparisonModal({
  item,
  onClose,
  onAction,
}: {
  item: ReviewItem;
  onClose: () => void;
  onAction: (action: "approve" | "reject" | "regenerate") => void;
}) {
  const scorePercent = item.similarityScore != null ? (item.similarityScore * 100).toFixed(1) : "—";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" data-testid="comparison-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Similarity Comparison
            <Badge variant="destructive" className="ml-2 text-sm" data-testid="badge-comparison-score">
              {scorePercent}% similar
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Held Page</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2" data-testid="panel-held-page">
                <p className="font-medium text-sm">{item.title}</p>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="outline" className="text-[10px]">{item.locationName}</Badge>
                  <Badge variant="outline" className="text-[10px]">{item.serviceName}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Slug: /{item.slug}</p>
                <p className="text-xs text-muted-foreground">{item.wordCount} words</p>
                {item.qualityFailReasons.length > 0 && (
                  <div className="mt-2 p-2 rounded bg-muted text-xs space-y-1">
                    {item.qualityFailReasons.map((r, i) => (
                      <p key={i} className="text-muted-foreground">{r}</p>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Comparison Page</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2" data-testid="panel-comparison-page">
                {item.comparisonPageTitle ? (
                  <p className="font-medium text-sm">{item.comparisonPageTitle}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Comparison page title unavailable</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  The similarity score of {scorePercent}% exceeds the 80% threshold between these two pages.
                </p>
                <div className="mt-4 p-3 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-xs">
                  <p>Consider regenerating this page to produce more unique content, or approve if the similarity is acceptable for these locations.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onAction("reject")} data-testid="button-modal-reject">
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button variant="outline" onClick={() => onAction("regenerate")} data-testid="button-modal-regenerate">
            <RefreshCw className="h-4 w-4 mr-2" />
            Regenerate
          </Button>
          <Button onClick={() => onAction("approve")} data-testid="button-modal-approve">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
