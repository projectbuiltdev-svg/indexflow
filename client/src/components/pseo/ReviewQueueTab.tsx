import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

const REVIEW_QUEUE_POLL_INTERVAL_MS = 30000;
const ROWS_PER_PAGE = 25;

interface ReviewItem {
  id: string;
  title: string;
  slug: string;
  serviceName: string;
  locationName: string;
  qualityGateStatus: string;
  qualityFailReasons: string[];
  similarityScore: number | null;
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

interface ReviewQueueTabProps {
  campaignId: string;
  isGenerating?: boolean;
}

export default function ReviewQueueTab({ campaignId, isGenerating }: ReviewQueueTabProps) {
  const [data, setData] = useState<ReviewQueueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"quality" | "similarity">("quality");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<Record<string, string>>({});
  const [comparisonModal, setComparisonModal] = useState<ReviewItem | null>(null);
  const [bulkLoading, setBulkLoading] = useState<string | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      const res = await apiRequest("GET", `/api/pseo/campaigns/${campaignId}/review-queue?page=${currentPage}&limit=${ROWS_PER_PAGE}`);
      const result = await res.json();
      setData(result);
    } catch {
      // silently fail on poll
    } finally {
      setIsLoading(false);
    }
  }, [campaignId, currentPage]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(fetchQueue, REVIEW_QUEUE_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isGenerating, fetchQueue]);

  const handleAction = async (itemId: string, action: "approve" | "reject" | "regenerate") => {
    setActionLoading((prev) => ({ ...prev, [itemId]: action }));
    try {
      await apiRequest("POST", `/api/pseo/review/${itemId}/${action}`);
      await fetchQueue();
    } catch {
      // error handled silently
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
      // error handled silently
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
                    — polling every {REVIEW_QUEUE_POLL_INTERVAL_MS / 1000}s
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
                      onToggleExpand={() => toggleExpand(item.id)}
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
  onToggleExpand,
  onAction,
  loading,
}: {
  item: ReviewItem;
  expanded: boolean;
  onToggleExpand: () => void;
  onAction: (action: "approve" | "reject" | "regenerate") => void;
  loading?: string;
}) {
  return (
    <div className="border rounded-lg" data-testid={`quality-row-${item.id}`}>
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button onClick={onToggleExpand} className="shrink-0 text-muted-foreground hover:text-foreground" data-testid={`button-expand-${item.id}`}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{item.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[10px]">{item.serviceName}</Badge>
              <Badge variant="outline" className="text-[10px]">{item.locationName}</Badge>
              <span className="text-[10px] text-muted-foreground">
                {item.qualityFailReasons.length} failure{item.qualityFailReasons.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
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
          <ul className="space-y-1">
            {item.qualityFailReasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />
                {reason}
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground mt-2">
            Created: {new Date(item.createdAt).toLocaleString()}
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
          <p className="text-sm font-medium truncate">{item.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-[10px]">{item.serviceName}</Badge>
            <Badge variant="outline" className="text-[10px]">{item.locationName}</Badge>
            <Badge variant={item.similarityScore && item.similarityScore >= 0.9 ? "destructive" : "secondary"} className="text-[10px]" data-testid={`badge-score-${item.id}`}>
              {scorePercent}% similar
            </Badge>
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
            <Badge variant="secondary" className="ml-2" data-testid="badge-comparison-score">
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
                <div className="flex gap-1">
                  <Badge variant="outline" className="text-[10px]">{item.serviceName}</Badge>
                  <Badge variant="outline" className="text-[10px]">{item.locationName}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Slug: /{item.slug}</p>
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
                <p className="text-sm text-muted-foreground">
                  The page this content was compared against. The similarity score of {scorePercent}% exceeds the 80% threshold.
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
