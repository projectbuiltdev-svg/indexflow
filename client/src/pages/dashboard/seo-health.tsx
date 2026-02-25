import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, AlertCircle, AlertTriangle, Info, Eye, Search, X, Loader2 } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";
import { useWorkspace } from "@/lib/workspace-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ValidateAllReport {
  postId: string;
  title: string;
  score: number;
  issues: number;
  errors: number;
  warnings: number;
}

interface ValidateAllResponse {
  validated: number;
  avgScore: number;
  reports: ValidateAllReport[];
}

interface ValidationIssue {
  rule: string;
  severity: "error" | "warning" | "info";
  message: string;
  details?: Record<string, any>;
  autoFixable?: boolean;
}

interface ValidationResult {
  id: string;
  postId: string;
  workspaceId: string;
  rule: string;
  severity: string;
  message: string;
  details: Record<string, any> | null;
  autoFixable: boolean;
  createdAt: string;
}

export default function SeoHealth() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [viewAuditOpen, setViewAuditOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<ValidateAllReport | null>(null);
  const [dismissedIssues, setDismissedIssues] = useState<Set<string>>(new Set());
  const [dismissOpen, setDismissOpen] = useState(false);
  const [dismissTarget, setDismissTarget] = useState<{ type: string; key: string } | null>(null);

  const { data: auditData, isLoading: isAuditLoading } = useQuery<ValidateAllResponse>({
    queryKey: ["/api/blog/validate-all", workspaceId],
    enabled: false,
  });

  const validateAllMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/blog/validate-all", { workspaceId });
      return await res.json() as ValidateAllResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/blog/validate-all", workspaceId], data);
      toast({ title: "Audit Complete", description: `SEO health audit completed for ${data.validated} posts. Average score: ${data.avgScore}/100.` });
    },
    onError: (err: Error) => {
      toast({ title: "Audit Failed", description: err.message, variant: "destructive" });
    },
  });

  const validateSingleMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await apiRequest("POST", `/api/blog/posts/${postId}/validate`, { workspaceId });
      return await res.json();
    },
    onSuccess: (_data, postId) => {
      if (auditData) {
        validateAllMutation.mutate();
      }
      toast({ title: "Re-audit Complete", description: "Post has been re-audited." });
    },
    onError: (err: Error) => {
      toast({ title: "Re-audit Failed", description: err.message, variant: "destructive" });
    },
  });

  const { data: selectedPostValidation, isLoading: isValidationLoading } = useQuery<ValidationResult[]>({
    queryKey: ["/api/blog/posts", selectedAudit?.postId, "validation"],
    enabled: viewAuditOpen && !!selectedAudit?.postId,
  });

  const reports = auditData?.reports || [];
  const avgScore = auditData?.avgScore || 0;

  const criticalIssues: Array<{ key: string; postId: string; title: string; errors: number }> = [];
  const warningIssues: Array<{ key: string; postId: string; title: string; warnings: number }> = [];
  const infoIssues: Array<{ key: string; postId: string; title: string; }> = [];

  reports.forEach((r) => {
    if (r.errors > 0 && !dismissedIssues.has(`critical-${r.postId}`)) {
      criticalIssues.push({ key: `critical-${r.postId}`, postId: r.postId, title: `${r.errors} error(s) found in "${r.title}"`, errors: r.errors });
    }
    if (r.warnings > 0 && !dismissedIssues.has(`warning-${r.postId}`)) {
      warningIssues.push({ key: `warning-${r.postId}`, postId: r.postId, title: `${r.warnings} warning(s) found in "${r.title}"`, warnings: r.warnings });
    }
    const infoCount = r.issues - r.errors - r.warnings;
    if (infoCount > 0 && !dismissedIssues.has(`info-${r.postId}`)) {
      infoIssues.push({ key: `info-${r.postId}`, postId: r.postId, title: `${infoCount} info item(s) in "${r.title}"` });
    }
  });

  const filteredPageAudits = reports.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showCritical = filterSeverity === "all" || filterSeverity === "critical";
  const showWarning = filterSeverity === "all" || filterSeverity === "warning";
  const showInfo = filterSeverity === "all" || filterSeverity === "info";

  const getGrade = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B+";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  const handleRunAudit = () => {
    if (!workspaceId) {
      toast({ title: "No Workspace", description: "Please select a workspace first.", variant: "destructive" });
      return;
    }
    validateAllMutation.mutate();
  };

  const handleViewAudit = (audit: ValidateAllReport) => {
    setSelectedAudit(audit);
    setViewAuditOpen(true);
  };

  const handleReaudit = (postId: string) => {
    validateSingleMutation.mutate(postId);
  };

  const handleDismissIssue = (type: string, key: string) => {
    setDismissTarget({ type, key });
    setDismissOpen(true);
  };

  const handleDismissConfirm = () => {
    if (!dismissTarget) return;
    setDismissedIssues((prev) => new Set(prev).add(dismissTarget.key));
    setDismissOpen(false);
    setDismissTarget(null);
    toast({ title: "Issue Dismissed", description: "The issue has been dismissed." });
  };

  const isRunning = validateAllMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      <ContentEngineTabs />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">SEO Health</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[200px]"
              data-testid="input-search-health"
            />
          </div>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-[140px]" data-testid="select-filter-severity">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Issues</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRunAudit} disabled={isRunning || !workspaceId} data-testid="button-run-audit">
            {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {isRunning ? "Running..." : "Run Audit"}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6 flex-wrap">
            {auditData ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold" data-testid="text-overall-score">{avgScore}</div>
                  <div className="text-muted-foreground">/100</div>
                </div>
                <Badge variant="secondary" data-testid="badge-grade" className="text-lg px-3 py-1">{getGrade(avgScore)}</Badge>
                <p className="text-sm text-muted-foreground">Overall SEO health score based on {auditData.validated} validated post(s)</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-muted-foreground" data-testid="text-overall-score">--</div>
                  <div className="text-muted-foreground">/100</div>
                </div>
                <p className="text-sm text-muted-foreground">Run an audit to see your SEO health score</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {auditData && (
        <div className="space-y-4">
          {showCritical && criticalIssues.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                Critical ({criticalIssues.length})
              </h3>
              {criticalIssues.map((issue) => (
                <div key={issue.key} className="pl-4 border-l-4 border-l-red-500 py-2 flex items-start justify-between gap-2" data-testid={`issue-critical-${issue.postId}`}>
                  <div>
                    <p className="font-medium text-sm">{issue.title}</p>
                    <p className="text-xs text-muted-foreground">{issue.errors} error(s) detected during SEO validation</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDismissIssue("critical", issue.key)} data-testid={`button-dismiss-critical-${issue.postId}`}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {showWarning && warningIssues.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Warning ({warningIssues.length})
              </h3>
              {warningIssues.map((issue) => (
                <div key={issue.key} className="pl-4 border-l-4 border-l-yellow-500 py-2 flex items-start justify-between gap-2" data-testid={`issue-warning-${issue.postId}`}>
                  <div>
                    <p className="font-medium text-sm">{issue.title}</p>
                    <p className="text-xs text-muted-foreground">{issue.warnings} warning(s) detected during SEO validation</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDismissIssue("warning", issue.key)} data-testid={`button-dismiss-warning-${issue.postId}`}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {showInfo && infoIssues.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" />
                Info ({infoIssues.length})
              </h3>
              {infoIssues.map((issue) => (
                <div key={issue.key} className="pl-4 border-l-4 border-l-blue-500 py-2 flex items-start justify-between gap-2" data-testid={`issue-info-${issue.postId}`}>
                  <div>
                    <p className="font-medium text-sm">{issue.title}</p>
                    <p className="text-xs text-muted-foreground">Informational items detected during SEO validation</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDismissIssue("info", issue.key)} data-testid={`button-dismiss-info-${issue.postId}`}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Post Audit Results</CardTitle>
        </CardHeader>
        <CardContent>
          {!auditData && !isRunning ? (
            <p className="text-sm text-muted-foreground py-4" data-testid="text-no-audit">Click "Run Audit" to validate all posts in this workspace.</p>
          ) : isRunning ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Warnings</TableHead>
                  <TableHead>Total Issues</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPageAudits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      {searchQuery ? "No posts match your search." : "No posts found in this workspace."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPageAudits.map((p) => (
                    <TableRow key={p.postId} data-testid={`row-audit-${p.postId}`}>
                      <TableCell className="font-medium max-w-[300px] truncate">{p.title}</TableCell>
                      <TableCell data-testid={`text-page-score-${p.postId}`}>{p.score}/100</TableCell>
                      <TableCell>{p.errors > 0 ? <span className="text-red-500 font-medium">{p.errors}</span> : "0"}</TableCell>
                      <TableCell>{p.warnings > 0 ? <span className="text-yellow-600 font-medium">{p.warnings}</span> : "0"}</TableCell>
                      <TableCell>{p.issues > 0 ? <span className="font-medium">{p.issues}</span> : "0"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Button variant="ghost" size="icon" onClick={() => handleViewAudit(p)} data-testid={`button-view-audit-${p.postId}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReaudit(p.postId)}
                            disabled={validateSingleMutation.isPending}
                            data-testid={`button-reaudit-${p.postId}`}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewAuditOpen} onOpenChange={setViewAuditOpen}>
        <DialogContent data-testid="dialog-view-audit">
          <DialogHeader>
            <DialogTitle>Audit Details: {selectedAudit?.title}</DialogTitle>
          </DialogHeader>
          {selectedAudit && (
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Score</Label>
                <span className="font-bold text-lg" data-testid="text-audit-detail-score">{selectedAudit.score}/100</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Errors</Label>
                <span className={selectedAudit.errors > 0 ? "text-red-500 font-medium" : ""}>{selectedAudit.errors}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Warnings</Label>
                <span className={selectedAudit.warnings > 0 ? "text-yellow-600 font-medium" : ""}>{selectedAudit.warnings}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Total Issues</Label>
                <span>{selectedAudit.issues}</span>
              </div>

              {isValidationLoading ? (
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : selectedPostValidation && selectedPostValidation.length > 0 ? (
                <div className="pt-2 space-y-2">
                  <Label className="text-muted-foreground">Detailed Issues</Label>
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {selectedPostValidation.map((v) => (
                      <div key={v.id} className="flex items-start gap-2 text-sm p-2 rounded-md bg-muted/50">
                        {v.severity === "error" && <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
                        {v.severity === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />}
                        {v.severity === "info" && <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />}
                        <div>
                          <p className="font-medium">{v.rule}</p>
                          <p className="text-muted-foreground">{v.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedPostValidation && selectedPostValidation.length === 0 ? (
                <p className="text-sm text-muted-foreground pt-2">No detailed validation results stored for this post.</p>
              ) : null}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewAuditOpen(false)} data-testid="button-close-audit-detail">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dismissOpen} onOpenChange={setDismissOpen}>
        <DialogContent data-testid="dialog-dismiss-issue">
          <DialogHeader>
            <DialogTitle>Dismiss Issue</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">Are you sure you want to dismiss this issue? It will be removed from the list.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDismissOpen(false)} data-testid="button-cancel-dismiss">Cancel</Button>
            <Button variant="destructive" onClick={handleDismissConfirm} data-testid="button-confirm-dismiss">Dismiss</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
