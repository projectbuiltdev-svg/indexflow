import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useWorkspace } from "@/lib/workspace-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Search, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";

type Page = {
  id: string | number;
  title: string;
  slug?: string;
  url?: string;
  schemaType?: string;
  type?: string;
  seoScore?: number;
  status?: string;
  description?: string;
  primaryKeyword?: string;
  updatedAt?: string;
  lastUpdated?: string;
};

export default function ContentPages() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id || "";

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [addOpen, setAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addType, setAddType] = useState("Page");
  const [addDescription, setAddDescription] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editPage, setEditPage] = useState<Page | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editType, setEditType] = useState("");

  const [auditOpen, setAuditOpen] = useState(false);
  const [auditPage, setAuditPage] = useState<Page | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePage, setDeletePage] = useState<Page | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pagesPerPage = 10;

  const queryKey = `/api/admin/blog/pages/${workspaceId}`;
  const { data: rawPages = [], isLoading } = useQuery<Page[]>({
    queryKey: [queryKey],
    enabled: !!workspaceId,
  });

  const pages = rawPages.map((p) => ({
    ...p,
    url: p.url || p.slug || "",
    type: p.schemaType || p.type || "Standard",
    seoScore: p.seoScore ?? 0,
    lastUpdated: p.updatedAt || p.lastUpdated || "",
  }));

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/blog/pages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setAddOpen(false);
      setAddTitle("");
      setAddUrl("");
      setAddType("Page");
      setAddDescription("");
      toast({ title: "Page created", description: `"${addTitle}" has been added.` });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const auditAllMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/blog/pages/audit-all", { workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Audit complete", description: "All pages have been audited." });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => apiRequest("DELETE", `/api/blog/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      const title = deletePage?.title;
      setDeleteOpen(false);
      setDeletePage(null);
      toast({ title: "Page deleted", description: `"${title}" has been removed.` });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) => apiRequest("PUT", `/api/blog/posts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setEditOpen(false);
      setEditPage(null);
      toast({ title: "Page updated", description: `"${editTitle}" has been saved.` });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const types = Array.from(new Set(pages.map((p) => p.type)));

  const filtered = pages.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !(p.url || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pagesPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPages = filtered.slice((safeCurrentPage - 1) * pagesPerPage, safeCurrentPage * pagesPerPage);

  const handleAddPage = () => {
    if (!addTitle.trim()) return;
    createMutation.mutate({
      workspaceId,
      title: addTitle,
      url: addUrl || `/${addTitle.toLowerCase().replace(/\s+/g, "-")}`,
      type: addType,
      keywords: addDescription,
    });
  };

  const handleEdit = (page: Page) => {
    setEditPage(page);
    setEditTitle(page.title);
    setEditUrl(page.url || page.slug || "");
    setEditType(page.type || "Standard");
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editPage || !editTitle.trim()) return;
    updateMutation.mutate({
      id: editPage.id,
      data: {
        title: editTitle,
        slug: editUrl,
        schemaType: editType,
      },
    });
  };

  const handleAudit = (page: Page) => {
    setAuditPage(page);
    setAuditOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletePage) return;
    deleteMutation.mutate(deletePage.id);
  };

  if (!workspaceId) {
    return (
      <div className="p-6 space-y-6">
        <ContentEngineTabs />
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center">
            <p className="text-muted-foreground" data-testid="text-no-workspace">Select a workspace to manage pages.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <ContentEngineTabs />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Pages</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => auditAllMutation.mutate()}
            disabled={auditAllMutation.isPending}
            data-testid="button-audit-all"
          >
            {auditAllMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Audit All
          </Button>
          <Button data-testid="button-add-page" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Page
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-pages"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-type-filter">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle>All Pages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page Title</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>SEO Score</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No pages found. Add a page to get started.
                    </TableCell>
                  </TableRow>
                ) : paginatedPages.map((page) => (
                  <TableRow key={page.id} data-testid={`row-page-${page.id}`}>
                    <TableCell className="font-medium" data-testid={`text-page-title-${page.id}`}>
                      <button
                        className="text-left hover:text-sidebar-primary hover:underline transition-colors cursor-pointer"
                        onClick={() => handleEdit(page)}
                        data-testid={`link-page-title-${page.id}`}
                      >
                        {page.title}
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-page-url-${page.id}`}>{page.url}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" data-testid={`badge-page-type-${page.id}`}>{page.type}</Badge>
                    </TableCell>
                    <TableCell data-testid={`text-seo-score-${page.id}`}>{page.seoScore}/100</TableCell>
                    <TableCell className="text-muted-foreground">{page.lastUpdated ? new Date(page.lastUpdated).toLocaleDateString() : ""}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 flex-wrap">
                        <Button variant="ghost" size="icon" data-testid={`button-edit-page-${page.id}`} onClick={() => handleEdit(page)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-audit-page-${page.id}`} onClick={() => handleAudit(page)}>
                          <Search className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-page-${page.id}`} onClick={() => { setDeletePage(page); setDeleteOpen(true); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4 flex-wrap" data-testid="pagination-pages">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length === 0 ? 0 : (safeCurrentPage - 1) * pagesPerPage + 1}–{Math.min(safeCurrentPage * pagesPerPage, filtered.length)} of {filtered.length} pages
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage(safeCurrentPage - 1)}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <Button
              key={pg}
              variant={pg === safeCurrentPage ? "default" : "outline"}
              size="icon"
              onClick={() => setCurrentPage(pg)}
              data-testid={`button-page-${pg}`}
            >
              {pg}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => setCurrentPage(safeCurrentPage + 1)}
            data-testid="button-next-page"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-testid="dialog-add-page">
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-page-title">Page Title</Label>
              <Input id="add-page-title" placeholder="Page title" value={addTitle} onChange={(e) => setAddTitle(e.target.value)} data-testid="input-add-page-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-page-url">URL</Label>
              <Input id="add-page-url" placeholder="/page-url" value={addUrl} onChange={(e) => setAddUrl(e.target.value)} data-testid="input-add-page-url" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-page-type">Type</Label>
              <Select value={addType} onValueChange={setAddType}>
                <SelectTrigger data-testid="select-add-page-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Page">Page</SelectItem>
                  <SelectItem value="Landing">Landing</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Archive">Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-page-description">Keywords / Meta Description</Label>
              <Textarea id="add-page-description" placeholder="Page keywords or meta description..." value={addDescription} onChange={(e) => setAddDescription(e.target.value)} data-testid="input-add-page-description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} data-testid="button-cancel-add-page">Cancel</Button>
            <Button onClick={handleAddPage} disabled={createMutation.isPending} data-testid="button-save-add-page">
              {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-testid="dialog-edit-page">
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-page-title">Page Title</Label>
              <Input id="edit-page-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} data-testid="input-edit-page-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-page-url">URL</Label>
              <Input id="edit-page-url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} data-testid="input-edit-page-url" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-page-type">Type</Label>
              <Select value={editType} onValueChange={setEditType}>
                <SelectTrigger data-testid="select-edit-page-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Page">Page</SelectItem>
                  <SelectItem value="Landing">Landing</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Archive">Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-page">Cancel</Button>
            <Button onClick={handleEditSave} disabled={updateMutation.isPending} data-testid="button-save-edit-page">
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={auditOpen} onOpenChange={setAuditOpen}>
        <DialogContent data-testid="dialog-audit-page">
          <DialogHeader>
            <DialogTitle>SEO Audit: {auditPage?.title}</DialogTitle>
          </DialogHeader>
          {auditPage && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">URL:</span> {auditPage.url}</div>
                <div><span className="text-muted-foreground">Type:</span> {auditPage.type}</div>
                <div><span className="text-muted-foreground">SEO Score:</span> {auditPage.seoScore ?? 0}/100</div>
                <div><span className="text-muted-foreground">Last Updated:</span> {auditPage.lastUpdated ? new Date(auditPage.lastUpdated).toLocaleDateString() : "N/A"}</div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Recommendations:</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {(auditPage.seoScore ?? 0) < 80 && <li>Improve meta description length and relevance</li>}
                  {(auditPage.seoScore ?? 0) < 90 && <li>Add more internal links to this page</li>}
                  {(auditPage.seoScore ?? 0) < 85 && <li>Optimize heading structure (H1, H2, H3)</li>}
                  <li>Ensure all images have alt text</li>
                  <li>Check page load speed</li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAuditOpen(false)} data-testid="button-close-audit">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-testid="dialog-delete-page">
          <DialogHeader>
            <DialogTitle>Delete Page</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{deletePage?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-page">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-page">
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
