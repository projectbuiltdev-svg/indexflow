import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, AlertCircle, AlertTriangle, Info, Eye, Search, X } from "lucide-react";

const initialCriticalIssues = [
  { id: 1, title: "Missing page titles on 3 pages", description: "Pages /services, /about, /blog are missing title tags" },
  { id: 2, title: "Broken internal links detected", description: "4 broken links found across the site" },
];

const initialWarningIssues = [
  { id: 1, title: "Short meta descriptions", description: "5 pages have meta descriptions under 120 characters" },
  { id: 2, title: "Missing alt text on images", description: "12 images across 4 pages are missing alt attributes" },
  { id: 3, title: "Thin content detected", description: "2 pages have fewer than 300 words of content" },
];

const initialInfoIssues = [
  { id: 1, title: "Consider adding structured data", description: "FAQ and HowTo schema could improve rich results" },
  { id: 2, title: "Optimize image file sizes", description: "8 images could be compressed further for faster load times" },
];

const initialPageAudits = [
  { id: 1, page: "/", score: 92, critical: 0, warnings: 1, info: 1, lastAudited: "2026-02-18" },
  { id: 2, page: "/about", score: 74, critical: 1, warnings: 2, info: 0, lastAudited: "2026-02-18" },
  { id: 3, page: "/services", score: 68, critical: 1, warnings: 1, info: 1, lastAudited: "2026-02-17" },
  { id: 4, page: "/blog", score: 85, critical: 0, warnings: 1, info: 0, lastAudited: "2026-02-18" },
  { id: 5, page: "/contact", score: 79, critical: 0, warnings: 0, info: 2, lastAudited: "2026-02-16" },
];

export default function SeoHealth() {
  const { toast } = useToast();
  const [criticalIssues, setCriticalIssues] = useState(initialCriticalIssues);
  const [warningIssues, setWarningIssues] = useState(initialWarningIssues);
  const [infoIssues, setInfoIssues] = useState(initialInfoIssues);
  const [pageAudits, setPageAudits] = useState(initialPageAudits);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [viewAuditOpen, setViewAuditOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<typeof initialPageAudits[0] | null>(null);
  const [dismissOpen, setDismissOpen] = useState(false);
  const [dismissTarget, setDismissTarget] = useState<{ type: string; id: number } | null>(null);

  const filteredPageAudits = pageAudits.filter((p) =>
    p.page.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showCritical = filterSeverity === "all" || filterSeverity === "critical";
  const showWarning = filterSeverity === "all" || filterSeverity === "warning";
  const showInfo = filterSeverity === "all" || filterSeverity === "info";

  const handleRunAudit = () => {
    setPageAudits((prev) => prev.map((p) => ({ ...p, lastAudited: "2026-02-18" })));
    toast({ title: "Audit Complete", description: "SEO health audit has been completed for all pages." });
  };

  const handleViewAudit = (audit: typeof initialPageAudits[0]) => {
    setSelectedAudit(audit);
    setViewAuditOpen(true);
  };

  const handleReaudit = (id: number) => {
    setPageAudits((prev) => prev.map((p) => (p.id === id ? { ...p, lastAudited: "2026-02-18" } : p)));
    toast({ title: "Re-audit Complete", description: `Page has been re-audited.` });
  };

  const handleDismissIssue = (type: string, id: number) => {
    setDismissTarget({ type, id });
    setDismissOpen(true);
  };

  const handleDismissConfirm = () => {
    if (!dismissTarget) return;
    if (dismissTarget.type === "critical") {
      setCriticalIssues((prev) => prev.filter((i) => i.id !== dismissTarget.id));
    } else if (dismissTarget.type === "warning") {
      setWarningIssues((prev) => prev.filter((i) => i.id !== dismissTarget.id));
    } else {
      setInfoIssues((prev) => prev.filter((i) => i.id !== dismissTarget.id));
    }
    setDismissOpen(false);
    setDismissTarget(null);
    toast({ title: "Issue Dismissed", description: "The issue has been dismissed." });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">SEO Health</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search pages..."
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
          <Button onClick={handleRunAudit} data-testid="button-run-audit">
            <RefreshCw className="w-4 h-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold" data-testid="text-overall-score">78</div>
              <div className="text-muted-foreground">/100</div>
            </div>
            <Badge variant="secondary" data-testid="badge-grade" className="text-lg px-3 py-1">B</Badge>
            <p className="text-sm text-muted-foreground">Overall SEO health score based on the latest audit</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {showCritical && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Critical ({criticalIssues.length})
            </h3>
            {criticalIssues.map((issue) => (
              <div key={issue.id} className="pl-4 border-l-4 border-l-red-500 py-2 flex items-start justify-between gap-2" data-testid={`issue-critical-${issue.id}`}>
                <div>
                  <p className="font-medium text-sm">{issue.title}</p>
                  <p className="text-xs text-muted-foreground">{issue.description}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDismissIssue("critical", issue.id)} data-testid={`button-dismiss-critical-${issue.id}`}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {showWarning && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              Warning ({warningIssues.length})
            </h3>
            {warningIssues.map((issue) => (
              <div key={issue.id} className="pl-4 border-l-4 border-l-yellow-500 py-2 flex items-start justify-between gap-2" data-testid={`issue-warning-${issue.id}`}>
                <div>
                  <p className="font-medium text-sm">{issue.title}</p>
                  <p className="text-xs text-muted-foreground">{issue.description}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDismissIssue("warning", issue.id)} data-testid={`button-dismiss-warning-${issue.id}`}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {showInfo && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              Info ({infoIssues.length})
            </h3>
            {infoIssues.map((issue) => (
              <div key={issue.id} className="pl-4 border-l-4 border-l-blue-500 py-2 flex items-start justify-between gap-2" data-testid={`issue-info-${issue.id}`}>
                <div>
                  <p className="font-medium text-sm">{issue.title}</p>
                  <p className="text-xs text-muted-foreground">{issue.description}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDismissIssue("info", issue.id)} data-testid={`button-dismiss-info-${issue.id}`}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Audit Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Critical</TableHead>
                <TableHead>Warnings</TableHead>
                <TableHead>Info</TableHead>
                <TableHead>Last Audited</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPageAudits.map((p) => (
                <TableRow key={p.id} data-testid={`row-audit-${p.id}`}>
                  <TableCell className="font-medium">{p.page}</TableCell>
                  <TableCell data-testid={`text-page-score-${p.id}`}>{p.score}/100</TableCell>
                  <TableCell>{p.critical > 0 ? <span className="text-red-500 font-medium">{p.critical}</span> : "0"}</TableCell>
                  <TableCell>{p.warnings > 0 ? <span className="text-yellow-600 font-medium">{p.warnings}</span> : "0"}</TableCell>
                  <TableCell>{p.info > 0 ? <span className="text-blue-500 font-medium">{p.info}</span> : "0"}</TableCell>
                  <TableCell className="text-muted-foreground">{p.lastAudited}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button variant="ghost" size="icon" onClick={() => handleViewAudit(p)} data-testid={`button-view-audit-${p.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleReaudit(p.id)} data-testid={`button-reaudit-${p.id}`}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={viewAuditOpen} onOpenChange={setViewAuditOpen}>
        <DialogContent data-testid="dialog-view-audit">
          <DialogHeader>
            <DialogTitle>Audit Details: {selectedAudit?.page}</DialogTitle>
          </DialogHeader>
          {selectedAudit && (
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Score</Label>
                <span className="font-bold text-lg" data-testid="text-audit-detail-score">{selectedAudit.score}/100</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Critical</Label>
                <span className={selectedAudit.critical > 0 ? "text-red-500 font-medium" : ""}>{selectedAudit.critical}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Warnings</Label>
                <span className={selectedAudit.warnings > 0 ? "text-yellow-600 font-medium" : ""}>{selectedAudit.warnings}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Info</Label>
                <span className={selectedAudit.info > 0 ? "text-blue-500 font-medium" : ""}>{selectedAudit.info}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Last Audited</Label>
                <span>{selectedAudit.lastAudited}</span>
              </div>
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
