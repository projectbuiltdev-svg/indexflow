import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  MousePointerClick,
  Eye,
  Percent,
  Globe,
  TrendingUp,
} from "lucide-react";

interface ReportData {
  campaignId: string;
  campaignName: string;
  generatedAt: string;
  contentCoverage: ContentCoverage;
  qualitySummary: QualitySummary;
  indexingStatus: IndexingStatus;
  performance: Performance;
}

interface ContentCoverage {
  total: number;
  published: number;
  draft: number;
  held: number;
  failed: number;
  services: Array<{ id: string; name: string; completionPct: number }>;
  locations: Array<{ id: string; name: string; completionPct: number }>;
  coverageGrid: Array<{
    serviceId: string;
    serviceName: string;
    locations: Array<{ locationId: string; locationName: string; status: string }>;
  }>;
}

interface QualitySummary {
  passRate: number;
  gates: { pass: number; fail: number; pending: number; held: number };
  topFailReasons: Array<{ reason: string; count: number }>;
  avgWordCount: number;
}

interface IndexingStatus {
  totalSubmitted: number;
  submitted: number;
  pending: number;
  failed: number;
  flagged: number;
  resubmitQueue: number;
  avgTimeToIndexHours: number | null;
}

interface Performance {
  connected: boolean;
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number | null;
  averagePosition: number | null;
  top10Pages: Array<{
    pageId: string;
    title: string;
    slug: string;
    clicks: number;
    impressions: number;
    avgPosition: number | null;
    ctr: number;
  }>;
  rankDistribution: Record<string, number>;
}

interface CampaignReportsTabProps {
  campaignId: string;
  campaignName: string;
}

const STATUS_DOT: Record<string, string> = {
  published: "bg-green-500",
  draft: "bg-gray-400",
  held: "bg-amber-500",
  failed: "bg-red-500",
};

export default function CampaignReportsTab({ campaignId, campaignName }: CampaignReportsTabProps) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState("28d");

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const resp = await fetch(`/api/pseo/campaigns/${campaignId}/report`);
      if (!resp.ok) throw new Error("Failed to fetch report");
      const data = await resp.json();
      setReport(data);
    } catch (err: any) {
      console.error("[Reports] Fetch failed:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [campaignId]);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const resp = await fetch(`/api/pseo/campaigns/${campaignId}/report/export`);
      if (!resp.ok) throw new Error("Export failed");
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pseo-report-${campaignName.replace(/\s+/g, "_")}-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("[Reports] Export failed:", err.message);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20" data-testid="report-loading">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12 text-muted-foreground" data-testid="report-error">
        Failed to load report data.
      </div>
    );
  }

  const { contentCoverage, qualitySummary, indexingStatus, performance } = report;
  const allLocations = contentCoverage.locations;

  return (
    <div data-testid="campaign-reports-tab">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold" data-testid="text-report-title">{campaignName} — Report</h3>
          <p className="text-xs text-muted-foreground" data-testid="text-report-generated">
            Generated: {new Date(report.generatedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32 h-9" data-testid="select-date-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="28d">Last 28 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting}
            data-testid="button-export-csv"
          >
            {isExporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
            ) : (
              <Download className="h-3.5 w-3.5 mr-1" />
            )}
            Export CSV
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card data-testid="section-content-coverage">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatusCard label="Published" count={contentCoverage.published} color="text-green-600 dark:text-green-400" icon={CheckCircle2} testId="stat-published" />
              <StatusCard label="Draft" count={contentCoverage.draft} color="text-gray-500" icon={Clock} testId="stat-draft" />
              <StatusCard label="Held" count={contentCoverage.held} color="text-amber-600 dark:text-amber-400" icon={AlertTriangle} testId="stat-held" />
              <StatusCard label="Failed" count={contentCoverage.failed} color="text-red-600 dark:text-red-400" icon={XCircle} testId="stat-failed" />
            </div>

            {contentCoverage.coverageGrid.length > 0 && allLocations.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background z-10 min-w-[140px]">Service</TableHead>
                      {allLocations.map((loc) => (
                        <TableHead key={loc.id} className="text-center text-xs min-w-[80px]">{loc.name}</TableHead>
                      ))}
                      <TableHead className="text-right text-xs">Complete</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contentCoverage.coverageGrid.map((row) => {
                      const locStatusMap = new Map(row.locations.map((l) => [l.locationId, l.status]));
                      const svc = contentCoverage.services.find((s) => s.id === row.serviceId);
                      return (
                        <TableRow key={row.serviceId} data-testid={`row-coverage-${row.serviceId}`}>
                          <TableCell className="sticky left-0 bg-background z-10 font-medium text-sm">{row.serviceName}</TableCell>
                          {allLocations.map((loc) => {
                            const st = locStatusMap.get(loc.id);
                            return (
                              <TableCell key={loc.id} className="text-center p-1">
                                {st ? (
                                  <span className={`inline-block w-3 h-3 rounded-full ${STATUS_DOT[st] || "bg-gray-300"}`} title={st} />
                                ) : (
                                  <span className="inline-block w-3 h-3 rounded-full border border-dashed border-gray-300 dark:border-gray-600" title="not generated" />
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right text-xs font-mono">{svc?.completionPct ?? 0}%</TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow>
                      <TableCell className="sticky left-0 bg-background z-10 text-xs text-muted-foreground font-medium">Completion</TableCell>
                      {allLocations.map((loc) => {
                        const locData = contentCoverage.locations.find((l) => l.id === loc.id);
                        return (
                          <TableCell key={loc.id} className="text-center text-xs font-mono text-muted-foreground">{locData?.completionPct ?? 0}%</TableCell>
                        );
                      })}
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="section-quality-summary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Quality Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Pass Rate</span>
                  <span className="text-sm font-bold" data-testid="text-pass-rate">{qualitySummary.passRate}%</span>
                </div>
                <Progress value={qualitySummary.passRate} className="h-2 mb-4" />

                <div className="space-y-2">
                  <GateBar label="Pass" count={qualitySummary.gates.pass} total={contentCoverage.total} color="bg-green-500" />
                  <GateBar label="Fail" count={qualitySummary.gates.fail} total={contentCoverage.total} color="bg-red-500" />
                  <GateBar label="Pending" count={qualitySummary.gates.pending} total={contentCoverage.total} color="bg-gray-400" />
                  <GateBar label="Held" count={qualitySummary.gates.held} total={contentCoverage.total} color="bg-amber-500" />
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Average Word Count</p>
                  <p className="text-2xl font-bold" data-testid="text-avg-word-count">{qualitySummary.avgWordCount.toLocaleString()}</p>
                </div>
                {qualitySummary.topFailReasons.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Top Failure Reasons</p>
                    <div className="space-y-1.5">
                      {qualitySummary.topFailReasons.map((r, i) => (
                        <div key={i} className="flex items-center justify-between text-sm" data-testid={`text-fail-reason-${i}`}>
                          <span className="truncate mr-2">{r.reason}</span>
                          <Badge variant="secondary" className="text-xs">{r.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="section-indexing-status">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Indexing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <div data-testid="stat-idx-submitted">
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="text-xl font-bold">{indexingStatus.submitted}</p>
              </div>
              <div data-testid="stat-idx-pending">
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{indexingStatus.pending}</p>
              </div>
              <div data-testid="stat-idx-failed">
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-xl font-bold text-red-600 dark:text-red-400">{indexingStatus.failed}</p>
              </div>
              <div data-testid="stat-idx-flagged">
                <p className="text-xs text-muted-foreground">Flagged</p>
                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{indexingStatus.flagged}</p>
              </div>
              <div data-testid="stat-idx-resubmit">
                <p className="text-xs text-muted-foreground">Resubmit Queue</p>
                <p className="text-xl font-bold">{indexingStatus.resubmitQueue}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div data-testid="stat-idx-total">
                <p className="text-xs text-muted-foreground">Total URLs Submitted</p>
                <p className="text-lg font-semibold">{indexingStatus.totalSubmitted}</p>
              </div>
              {indexingStatus.avgTimeToIndexHours !== null && (
                <div data-testid="stat-idx-avg-time">
                  <p className="text-xs text-muted-foreground">Avg Time to Index</p>
                  <p className="text-lg font-semibold">{indexingStatus.avgTimeToIndexHours}h</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {performance.connected && (
          <Card data-testid="section-performance">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Performance (GSC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div data-testid="stat-perf-clicks">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointerClick className="h-4 w-4 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">Total Clicks</p>
                  </div>
                  <p className="text-2xl font-bold">{performance.totalClicks.toLocaleString()}</p>
                </div>
                <div data-testid="stat-perf-impressions">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">Total Impressions</p>
                  </div>
                  <p className="text-2xl font-bold">{performance.totalImpressions.toLocaleString()}</p>
                </div>
                <div data-testid="stat-perf-ctr">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="h-4 w-4 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">Average CTR</p>
                  </div>
                  <p className="text-2xl font-bold">
                    {performance.averageCtr !== null ? `${(performance.averageCtr * 100).toFixed(2)}%` : "-"}
                  </p>
                </div>
                <div data-testid="stat-perf-position">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">Average Position</p>
                  </div>
                  <p className="text-2xl font-bold">{performance.averagePosition?.toFixed(1) ?? "-"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium mb-3">Top 10 Pages by Clicks</p>
                  {performance.top10Pages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No click data available yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {performance.top10Pages.map((page, i) => (
                        <div key={page.pageId} className="flex items-center justify-between text-sm" data-testid={`row-top-page-${i}`}>
                          <div className="flex items-center gap-2 truncate mr-2">
                            <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}.</span>
                            <span className="truncate">{page.title}</span>
                          </div>
                          <span className="font-mono text-xs whitespace-nowrap">{page.clicks.toLocaleString()} clicks</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium mb-3">Rank Distribution</p>
                  <div className="space-y-3">
                    <RankBucket label="Positions 1–3" count={performance.rankDistribution["1-3"] || 0} color="bg-green-500" />
                    <RankBucket label="Positions 4–10" count={performance.rankDistribution["4-10"] || 0} color="bg-blue-500" />
                    <RankBucket label="Positions 11–20" count={performance.rankDistribution["11-20"] || 0} color="bg-amber-500" />
                    <RankBucket label="Positions 20+" count={performance.rankDistribution["20+"] || 0} color="bg-red-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatusCard({ label, count, color, icon: Icon, testId }: { label: string; count: number; color: string; icon: any; testId: string }) {
  return (
    <div className="rounded-lg border p-3" data-testid={testId}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-xl font-bold">{count}</p>
    </div>
  );
}

function GateBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-14 text-muted-foreground">{label}</span>
      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono w-12 text-right">{count} ({pct}%)</span>
    </div>
  );
}

function RankBucket({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-3" data-testid={`rank-bucket-${label}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-sm flex-1">{label}</span>
      <span className="text-sm font-mono font-medium">{count}</span>
    </div>
  );
}
