import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Check, X, Upload, Trash2, Shield, BarChart3, FileText,
  ChevronDown, ChevronRight, Download, Eye,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Tab = "templates" | "workspaces" | "stats" | "audit";

export default function WEAdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("templates");

  const tabs: { key: Tab; label: string }[] = [
    { key: "templates", label: "Templates" },
    { key: "workspaces", label: "Workspaces" },
    { key: "stats", label: "Stats" },
    { key: "audit", label: "Audit Log" },
  ];

  return (
    <div className="p-6 space-y-6" data-testid="we-admin-panel">
      <div>
        <h1 className="text-2xl font-bold">Website Engine Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage templates, workspaces, and platform stats.</p>
      </div>
      <div className="flex gap-1 border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            data-testid={`tab-${t.key}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "templates" && <TemplatesTab />}
      {activeTab === "workspaces" && <WorkspacesTab />}
      {activeTab === "stats" && <StatsTab />}
      {activeTab === "audit" && <AuditTab />}
    </div>
  );
}

function TemplatesTab() {
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newStyleTags, setNewStyleTags] = useState("");
  const [newFeatureTags, setNewFeatureTags] = useState("");
  const [newJson, setNewJson] = useState("");
  const [validationResult, setValidationResult] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data, isLoading } = useQuery<{ templates: any[]; total: number }>({
    queryKey: ["/api/we/admin/templates"],
  });

  const createMut = useMutation({
    mutationFn: async () => {
      let grapejsState = {};
      try { if (newJson.trim()) grapejsState = JSON.parse(newJson); } catch { throw new Error("Invalid JSON"); }
      await apiRequest("POST", "/api/we/admin/templates", {
        name: newName, category: newCategory,
        styleTags: newStyleTags.split(",").map((s) => s.trim()).filter(Boolean),
        featureTags: newFeatureTags.split(",").map((s) => s.trim()).filter(Boolean),
        grapejsState,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/we/admin/templates"] });
      setShowUpload(false); setNewName(""); setNewCategory(""); setNewJson("");
    },
  });

  const toggleMut = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      await apiRequest("PATCH", `/api/we/admin/templates/${id}`, { isActive });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/we/admin/templates"] }),
  });

  const editMut = useMutation({
    mutationFn: async () => {
      await apiRequest("PATCH", `/api/we/admin/templates/${editId}`, { name: editName, category: editCategory });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/we/admin/templates"] }); setEditId(null); },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/we/admin/templates/${id}`);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/we/admin/templates"] }); setDeleteConfirm(null); },
  });

  const validateMut = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/we/admin/templates/${id}/validate`);
      return res.json();
    },
    onSuccess: (data) => setValidationResult(data),
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  return (
    <div className="space-y-4" data-testid="templates-tab">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{data?.total || 0} templates</span>
        <Button size="sm" onClick={() => setShowUpload(!showUpload)} data-testid="btn-upload-template">
          <Upload className="w-4 h-4 mr-1" /> Upload Template
        </Button>
      </div>

      {showUpload && (
        <div className="border rounded-lg p-4 space-y-3 bg-muted/30" data-testid="upload-template-form">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} data-testid="input-template-name" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="e.g. agency, ecommerce" data-testid="input-template-category" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Style Tags (comma-separated)</label>
              <Input value={newStyleTags} onChange={(e) => setNewStyleTags(e.target.value)} placeholder="bold, minimal" data-testid="input-template-style" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Feature Tags (comma-separated)</label>
              <Input value={newFeatureTags} onChange={(e) => setNewFeatureTags(e.target.value)} placeholder="blog, gallery" data-testid="input-template-features" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">GrapesJS JSON</label>
            <Textarea value={newJson} onChange={(e) => setNewJson(e.target.value)} rows={4} className="font-mono text-xs" data-testid="input-template-json" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => createMut.mutate()} disabled={!newName || !newCategory || createMut.isPending} data-testid="btn-save-template">
              {createMut.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null} Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowUpload(false)}>Cancel</Button>
          </div>
          {createMut.isError && <p className="text-xs text-red-600">{(createMut.error as Error).message}</p>}
        </div>
      )}

      {validationResult && (
        <div className={`border rounded p-3 text-sm ${validationResult.valid ? "bg-green-50 border-green-200 dark:bg-green-950/20" : "bg-red-50 border-red-200 dark:bg-red-950/20"}`} data-testid="validation-result">
          <div className="flex justify-between">
            <span>{validationResult.valid ? "✓ Valid — all blocks recognized" : `✗ ${validationResult.unknownBlocks.length} unknown block(s)`}</span>
            <button onClick={() => setValidationResult(null)} className="text-muted-foreground"><X className="w-3 h-3" /></button>
          </div>
          {!validationResult.valid && <p className="text-xs mt-1 font-mono">{validationResult.unknownBlocks.join(", ")}</p>}
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Name</th>
              <th className="text-left px-3 py-2 font-medium">Category</th>
              <th className="text-left px-3 py-2 font-medium">Version</th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-left px-3 py-2 font-medium">Usage</th>
              <th className="text-left px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(data?.templates || []).map((t: any) => (
              <tr key={t.id} className="border-t" data-testid={`template-row-${t.id}`}>
                <td className="px-3 py-2">
                  {editId === t.id ? (
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-7 text-xs" />
                  ) : t.name}
                </td>
                <td className="px-3 py-2">
                  {editId === t.id ? (
                    <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="h-7 text-xs" />
                  ) : t.category}
                </td>
                <td className="px-3 py-2">v{t.version}</td>
                <td className="px-3 py-2">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${t.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {t.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 py-2">{t.usageCount}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"
                      onClick={() => toggleMut.mutate({ id: t.id, isActive: !t.isActive })}
                      data-testid={`btn-toggle-${t.id}`}
                    >
                      {t.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    {editId === t.id ? (
                      <>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => editMut.mutate()} data-testid={`btn-save-edit-${t.id}`}>
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setEditId(null)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"
                        onClick={() => { setEditId(t.id); setEditName(t.name); setEditCategory(t.category); }}
                        data-testid={`btn-edit-${t.id}`}
                      >
                        Edit
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs"
                      onClick={() => validateMut.mutate(t.id)}
                      disabled={validateMut.isPending}
                      data-testid={`btn-validate-${t.id}`}
                    >
                      Validate
                    </Button>
                    {deleteConfirm === t.id ? (
                      <>
                        <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={() => deleteMut.mutate(t.id)} data-testid={`btn-confirm-delete-${t.id}`}>Confirm</Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-600" onClick={() => setDeleteConfirm(t.id)} data-testid={`btn-delete-${t.id}`}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {(!data?.templates || data.templates.length === 0) && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No templates yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorkspacesTab() {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [accessModal, setAccessModal] = useState(false);
  const [accessReason, setAccessReason] = useState("");
  const [accessDataType, setAccessDataType] = useState("grapesjs_state");

  const { data: wsList, isLoading } = useQuery<any[]>({ queryKey: ["/api/we/admin/workspaces"] });

  const { data: wsDetail } = useQuery<any>({
    queryKey: ["/api/we/admin/workspaces", selectedVenue],
    queryFn: async () => {
      const res = await fetch(`/api/we/admin/workspaces/${selectedVenue}`);
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    enabled: !!selectedVenue,
  });

  const accessMut = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/we/admin/workspaces/${selectedVenue}/access`, {
        reason: accessReason, dataType: accessDataType,
      });
      return res.json();
    },
    onSuccess: () => { setAccessModal(false); setAccessReason(""); },
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" /></div>;

  return (
    <div className="space-y-4" data-testid="workspaces-tab">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Name</th>
                <th className="text-left px-3 py-2 font-medium">Tier</th>
                <th className="text-left px-3 py-2 font-medium">Projects</th>
                <th className="text-left px-3 py-2 font-medium">Deploys</th>
                <th className="text-left px-3 py-2 font-medium">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {(wsList || []).map((ws: any) => (
                <tr
                  key={ws.venueId}
                  className={`border-t cursor-pointer hover:bg-muted/30 ${selectedVenue === ws.venueId ? "bg-muted/40" : ""}`}
                  onClick={() => setSelectedVenue(ws.venueId)}
                  data-testid={`ws-row-${ws.venueId}`}
                >
                  <td className="px-3 py-2">{ws.name}</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">{ws.tier}</span>
                  </td>
                  <td className="px-3 py-2">{ws.projectCount}</td>
                  <td className="px-3 py-2">{ws.deploymentCount}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{ws.lastActive ? new Date(ws.lastActive).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          {selectedVenue && wsDetail ? (
            <>
              <h3 className="font-medium">{wsDetail.name}</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div>Tier: <span className="text-foreground">{wsDetail.tier}</span></div>
                <div>Projects: <span className="text-foreground">{wsDetail.projectCount}</span></div>
                <div>Deployments: <span className="text-foreground">{wsDetail.deployments?.length || 0}</span></div>
                <div>Form Submissions: <span className="text-foreground">{wsDetail.formSubmissionCount}</span></div>
                <div>BYOK: <span className="text-foreground">{wsDetail.byokStatus}</span></div>
              </div>
              {wsDetail.projects?.length > 0 && (
                <div className="space-y-1">
                  <span className="text-xs font-medium">Projects:</span>
                  {wsDetail.projects.map((p: any) => (
                    <div key={p.id} className="text-xs flex justify-between bg-muted/30 rounded px-2 py-1">
                      <span>{p.name}</span>
                      <span className="text-muted-foreground">{p.status}</span>
                    </div>
                  ))}
                </div>
              )}
              <Button size="sm" variant="outline" onClick={() => setAccessModal(true)} data-testid="btn-access-data">
                <Shield className="w-3 h-3 mr-1" /> Access workspace data
              </Button>

              {accessModal && (
                <div className="border rounded p-3 space-y-2 bg-amber-50/50 dark:bg-amber-950/20" data-testid="access-modal">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300">This access will be logged and the workspace owner will be notified by email.</p>
                  <Select value={accessDataType} onValueChange={setAccessDataType}>
                    <SelectTrigger className="h-8 text-xs" data-testid="select-data-type"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grapesjs_state">GrapesJS State</SelectItem>
                      <SelectItem value="version_history">Version History</SelectItem>
                      <SelectItem value="analytics_config">Analytics Config</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea value={accessReason} onChange={(e) => setAccessReason(e.target.value)} placeholder="Reason for accessing this data..." rows={2} className="text-xs" data-testid="input-access-reason" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => accessMut.mutate()} disabled={!accessReason.trim() || accessMut.isPending} data-testid="btn-confirm-access">
                      {accessMut.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null} Confirm Access
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setAccessModal(false)}>Cancel</Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">Select a workspace to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsTab() {
  const { data, isLoading } = useQuery<{
    totalProjects: number; totalDeployments: number; activeWorkspaces: number;
    formSubmissionCount: number; deploymentsByType: Record<string, number>;
    topTemplates: { templateId: number; name: string; count: number }[];
  }>({ queryKey: ["/api/we/admin/stats"] });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" /></div>;
  if (!data) return null;

  const maxCount = Math.max(...(data.topTemplates?.map((t) => t.count) || [1]), 1);

  return (
    <div className="space-y-6" data-testid="stats-tab">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Projects", value: data.totalProjects },
          { label: "Total Deployments", value: data.totalDeployments },
          { label: "Active Workspaces", value: data.activeWorkspaces },
          { label: "Form Submissions", value: data.formSubmissionCount },
        ].map((s) => (
          <div key={s.label} className="border rounded-lg p-4 text-center" data-testid={`stat-${s.label.toLowerCase().replace(/\s/g, "-")}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-sm">Top Templates</h3>
          {(data.topTemplates || []).map((t) => (
            <div key={t.templateId} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{t.name}</span>
                <span className="text-muted-foreground">{t.count}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(t.count / maxCount) * 100}%` }} />
              </div>
            </div>
          ))}
          {(!data.topTemplates || data.topTemplates.length === 0) && (
            <p className="text-xs text-muted-foreground">No template usage yet</p>
          )}
        </div>

        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-sm">Deployments by Type</h3>
          {Object.entries(data.deploymentsByType || {}).map(([type, cnt]) => (
            <div key={type} className="flex justify-between items-center text-sm">
              <span className="capitalize">{type}</span>
              <span className="font-medium">{cnt}</span>
            </div>
          ))}
          {Object.keys(data.deploymentsByType || {}).length === 0 && (
            <p className="text-xs text-muted-foreground">No deployments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  const [actionFilter, setActionFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [venueFilter, setVenueFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const queryStr = new URLSearchParams();
  if (!venueFilter) queryStr.set("venueId", "system");

  const { data: allLogs, isLoading } = useQuery<any[]>({
    queryKey: ["/api/we/admin/audit-logs", actionFilter, severityFilter, venueFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (actionFilter) params.set("action", actionFilter);
      if (severityFilter) params.set("severity", severityFilter);
      const vid = venueFilter || "system";
      const res = await fetch(`/api/we/admin/workspaces/${vid}/audit?${params}`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const handleExportCsv = () => {
    if (!allLogs?.length) return;
    const header = "Timestamp,Venue ID,Action,Severity,Metadata\n";
    const rows = allLogs.map((l: any) =>
      `"${l.createdAt}","${l.venueId}","${l.action}","${l.severity}","${JSON.stringify(l.metadata || {}).replace(/"/g, '""')}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "we-audit-log.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const severityColor: Record<string, string> = {
    info: "bg-blue-100 text-blue-700",
    warn: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4" data-testid="audit-tab">
      <div className="flex gap-2 items-center">
        <Input value={venueFilter} onChange={(e) => setVenueFilter(e.target.value)} placeholder="Venue ID filter" className="max-w-[200px] h-8 text-xs" data-testid="input-audit-venue" />
        <Input value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} placeholder="Action filter" className="max-w-[200px] h-8 text-xs" data-testid="input-audit-action" />
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[120px] h-8 text-xs" data-testid="select-audit-severity"><SelectValue placeholder="Severity" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warn">Warn</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={handleExportCsv} data-testid="btn-export-audit">
          <Download className="w-3 h-3 mr-1" /> Export CSV
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin" /></div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-3 py-2 font-medium w-8"></th>
                <th className="text-left px-3 py-2 font-medium">Timestamp</th>
                <th className="text-left px-3 py-2 font-medium">Venue ID</th>
                <th className="text-left px-3 py-2 font-medium">Action</th>
                <th className="text-left px-3 py-2 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody>
              {(allLogs || []).map((log: any) => (
                <>
                  <tr key={log.id} className="border-t cursor-pointer hover:bg-muted/30" onClick={() => setExpandedId(expandedId === log.id ? null : log.id)} data-testid={`audit-row-${log.id}`}>
                    <td className="px-3 py-2">
                      {expandedId === log.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}</td>
                    <td className="px-3 py-2 font-mono text-xs">{log.venueId}</td>
                    <td className="px-3 py-2">{log.action}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityColor[log.severity] || "bg-gray-100"}`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                  {expandedId === log.id && (
                    <tr key={`${log.id}-meta`} className="bg-muted/20">
                      <td colSpan={5} className="px-6 py-2">
                        <pre className="text-xs font-mono whitespace-pre-wrap">{JSON.stringify(log.metadata, null, 2)}</pre>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {(!allLogs || allLogs.length === 0) && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">No audit log entries</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
