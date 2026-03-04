import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Trash2, Download, ChevronDown, ChevronUp, Loader2, Info, Inbox } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WEFormSubmissionsProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  venueId: string;
  projectLanguage: string;
}

function titleCase(s: string): string {
  return s.replace(/([_-])/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(d: string): string {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) +
    " at " + dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function FieldPreview({ value }: { value: string }) {
  const [expanded, setExpanded] = useState(false);
  if (value.length <= 200) return <span>{value}</span>;
  return (
    <span>
      {expanded ? value : value.slice(0, 200) + "..."}
      <button onClick={() => setExpanded(!expanded)} className="text-primary text-xs ml-1 hover:underline">
        {expanded ? "Show less" : "Show more"}
      </button>
    </span>
  );
}

export default function WEFormSubmissions({ isOpen, onClose, projectId, venueId, projectLanguage }: WEFormSubmissionsProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [formFilter, setFormFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const perPage = 20;

  const queryParams = new URLSearchParams({ venueId, page: page.toString(), limit: perPage.toString() });
  if (formFilter !== "all") queryParams.set("formName", formFilter);
  if (dateFrom) queryParams.set("from", dateFrom);
  if (dateTo) queryParams.set("to", dateTo);

  const { data, isLoading } = useQuery<{ submissions: any[]; total: number; formNames: string[] }>({
    queryKey: ["/api/we/forms", projectId, "submissions", venueId, page, formFilter, dateFrom, dateTo],
    queryFn: async () => {
      const res = await fetch(`/api/we/forms/${projectId}/submissions?${queryParams.toString()}`);
      if (!res.ok) return { submissions: [], total: 0, formNames: [] };
      return res.json();
    },
    enabled: isOpen,
  });

  const deleteMut = useMutation({
    mutationFn: async (submissionId: number) => {
      await apiRequest("DELETE", `/api/we/forms/submissions/${submissionId}?venueId=${venueId}`, {});
    },
    onSuccess: () => {
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["/api/we/forms", projectId, "submissions"] });
    },
  });

  const submissions = data?.submissions || [];
  const total = data?.total || 0;
  const formNames = data?.formNames || [];
  const totalPages = Math.ceil(total / perPage);
  const showFrom = (page - 1) * perPage + 1;
  const showTo = Math.min(page * perPage, total);

  const clearFilters = () => {
    setFormFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/we/forms/${projectId}/submissions/export?venueId=${venueId}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `form-submissions-${projectId}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-[600px] max-w-full bg-background border-l shadow-xl flex flex-col" data-testid="we-form-submissions">
      <div className="flex items-center justify-between px-5 py-4 border-b">
        <div>
          <h3 className="font-semibold text-lg">Form Submissions</h3>
          <p className="text-sm text-muted-foreground">Project submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exporting || total === 0}
            title={total === 0 ? "No submissions to export" : ""}
            data-testid="btn-export-csv"
          >
            {exporting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Download className="w-3 h-3 mr-1" />}
            Export CSV
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="btn-close-submissions">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="px-5 py-3 border-b flex items-center gap-3 flex-wrap" data-testid="submissions-filters">
        <Select value={formFilter} onValueChange={(v) => { setFormFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[160px] h-8 text-sm" data-testid="select-form-filter">
            <SelectValue placeholder="All forms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All forms</SelectItem>
            {formNames.map((n) => (
              <SelectItem key={n} value={n}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="w-[140px] h-8 text-sm"
          placeholder="From"
          data-testid="input-date-from"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="w-[140px] h-8 text-sm"
          placeholder="To"
          data-testid="input-date-to"
        />
        {(formFilter !== "all" || dateFrom || dateTo) && (
          <button onClick={clearFilters} className="text-xs text-primary hover:underline" data-testid="btn-clear-filters">
            Clear filters
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-16 px-6" data-testid="submissions-empty">
            <Inbox className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">No submissions yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Submissions will appear here when visitors complete forms on your live site.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {submissions.map((sub: any) => {
              const fields = sub.fields || {};
              const keys = Object.keys(fields);
              const previewFields = keys.slice(0, 2).map((k) => fields[k]).join(" — ");
              const isExpanded = expandedId === sub.id;

              return (
                <div key={sub.id} className="group" data-testid={`submission-row-${sub.id}`}>
                  <div
                    className="flex items-center gap-3 px-5 py-3 cursor-pointer hover:bg-muted/30"
                    onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">{formatDate(sub.createdAt)}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                          {sub.formName || "Form"}
                        </span>
                      </div>
                      <div className="text-sm mt-0.5 truncate">
                        <FieldPreview value={previewFields || "No fields"} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(sub.id); }}
                        data-testid={`btn-delete-${sub.id}`}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-4" data-testid={`submission-detail-${sub.id}`}>
                      <table className="w-full text-sm">
                        <tbody>
                          {keys.map((key) => (
                            <tr key={key} className="border-b last:border-0">
                              <td className="py-1.5 pr-4 text-muted-foreground font-medium w-[140px] align-top">
                                {titleCase(key)}
                              </td>
                              <td className="py-1.5 break-words">
                                <FieldPreview value={String(fields[key] || "")} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="px-5 py-3 border-t flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Showing {showFrom}–{showTo} of {total} submissions</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} data-testid="btn-prev-page">
              Prev
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)} data-testid="btn-next-page">
              Next
            </Button>
          </div>
        </div>
      )}

      <div className="px-5 py-3 border-t" data-testid="retention-notice">
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 rounded p-3">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Submissions are retained for 90 days after project deletion. Export before deleting your project to keep a permanent record.</span>
        </div>
      </div>

      {deleteTarget !== null && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center" data-testid="delete-confirm-modal">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h4 className="font-semibold mb-2">Delete submission?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This cannot be undone. This is a permanent deletion for GDPR compliance.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteMut.mutate(deleteTarget)}
                disabled={deleteMut.isPending}
                data-testid="btn-confirm-delete"
              >
                {deleteMut.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                Delete permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
