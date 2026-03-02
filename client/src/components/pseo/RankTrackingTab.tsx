import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  RefreshCw,
  Loader2,
  Search,
  BarChart3,
  MousePointerClick,
  Eye,
  Percent,
} from "lucide-react";

interface RankEntry {
  id: string;
  pageId: string | null;
  pageTitle: string | null;
  pageSlug: string | null;
  serviceId: string | null;
  locationId: string | null;
  keyword: string;
  isPrimary: boolean;
  position: number | null;
  previousPosition: number | null;
  movement: "improved" | "declined" | "stable" | "new";
  clicks: number;
  impressions: number;
  ctr: number;
  lastCheckedAt: string | null;
}

interface RankSummary {
  averagePosition: number | null;
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number | null;
  keywordsTracked: number;
  lastUpdated: string | null;
}

interface RankTrackingTabProps {
  campaignId: string;
}

const MOVEMENT_CONFIG = {
  improved: { icon: TrendingUp, color: "text-green-600 dark:text-green-400", label: "Improved" },
  declined: { icon: TrendingDown, color: "text-red-600 dark:text-red-400", label: "Declined" },
  stable: { icon: Minus, color: "text-muted-foreground", label: "Stable" },
  new: { icon: Star, color: "text-amber-500", label: "New" },
};

export default function RankTrackingTab({ campaignId }: RankTrackingTabProps) {
  const [ranks, setRanks] = useState<RankEntry[]>([]);
  const [summary, setSummary] = useState<RankSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [movementFilter, setMovementFilter] = useState("all");

  const fetchRanks = async () => {
    try {
      setIsLoading(true);
      const resp = await fetch(`/api/pseo/campaigns/${campaignId}/ranks`);
      if (!resp.ok) throw new Error("Failed to fetch");
      const data = await resp.json();
      setRanks(data.ranks || []);
      setSummary(data.summary || null);
    } catch (err: any) {
      console.error("[RankTracking] Fetch failed:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
  }, [campaignId]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await apiRequest("POST", `/api/pseo/campaigns/${campaignId}/ranks/refresh`);
      await fetchRanks();
    } catch (err: any) {
      console.error("[RankTracking] Refresh failed:", err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filtered = ranks.filter((r) => {
    if (movementFilter !== "all" && r.movement !== movementFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        r.keyword.toLowerCase().includes(q) ||
        (r.pageTitle || "").toLowerCase().includes(q) ||
        (r.pageSlug || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatPosition = (pos: number | null) => {
    if (pos === null || pos === undefined) return "-";
    return pos.toFixed(1);
  };

  const formatCtr = (ctr: number) => {
    return `${(ctr * 100).toFixed(2)}%`;
  };

  const formatDate = (d: string | null) => {
    if (!d) return "Never";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card data-testid="stat-avg-position">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Position</p>
                <p className="text-2xl font-bold">{summary?.averagePosition?.toFixed(1) ?? "-"}</p>
              </div>
              <BarChart3 className="h-6 w-6 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-total-clicks">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{summary?.totalClicks?.toLocaleString() ?? "0"}</p>
              </div>
              <MousePointerClick className="h-6 w-6 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-total-impressions">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold">{summary?.totalImpressions?.toLocaleString() ?? "0"}</p>
              </div>
              <Eye className="h-6 w-6 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-avg-ctr">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg CTR</p>
                <p className="text-2xl font-bold">{summary?.averageCtr ? formatCtr(summary.averageCtr) : "-"}</p>
              </div>
              <Percent className="h-6 w-6 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search keywords or pages..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-9 h-9"
              data-testid="input-rank-search"
            />
          </div>
          <Select value={movementFilter} onValueChange={setMovementFilter}>
            <SelectTrigger className="w-40 h-9" data-testid="select-movement-filter">
              <SelectValue placeholder="Movement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Movements</SelectItem>
              <SelectItem value="improved">Improved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="stable">Stable</SelectItem>
              <SelectItem value="new">New</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          {summary?.lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last updated: {formatDate(summary.lastUpdated)}
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            data-testid="button-refresh-ranks"
          >
            {isRefreshing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
            )}
            Refresh Ranks
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Page</TableHead>
              <TableHead>Keyword</TableHead>
              <TableHead className="text-right">Position</TableHead>
              <TableHead className="text-right">Previous</TableHead>
              <TableHead className="text-center">Movement</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  {ranks.length === 0
                    ? "No rank data yet. Click Refresh Ranks to pull data from Google Search Console."
                    : "No results match your filters"
                  }
                </TableCell>
              </TableRow>
            )}
            {filtered.map((r) => {
              const mvConfig = MOVEMENT_CONFIG[r.movement];
              const MvIcon = mvConfig.icon;
              return (
                <TableRow key={r.id} data-testid={`row-rank-${r.id}`}>
                  <TableCell>
                    <div className="max-w-[180px]">
                      <div className="font-medium text-sm truncate">{r.pageTitle || "-"}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.pageSlug || ""}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{r.keyword}</span>
                      {r.isPrimary && (
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">Primary</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-medium">
                    {formatPosition(r.position)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm text-muted-foreground">
                    {formatPosition(r.previousPosition)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={`flex items-center justify-center gap-1 ${mvConfig.color}`}>
                      <MvIcon className="h-3.5 w-3.5" />
                      <span className="text-xs">{mvConfig.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{r.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{r.impressions.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCtr(r.ctr)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(r.lastCheckedAt)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
