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
import { Plus, Pencil, Search, Trash2, ChevronLeft, ChevronRight, Loader2, Bold, Italic, Heading2, Heading3, List, ListOrdered, Link, Undo, Redo, Code } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";
import { useRef, useCallback, useEffect } from "react";

function RichTextEditor({ value, onChange, id, testId }: { value: string; onChange: (html: string) => void; id?: string; testId?: string }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalUpdate.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternalUpdate.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalUpdate.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const exec = useCallback((command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val);
    handleInput();
  }, [handleInput]);

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) exec("createLink", url);
  }, [exec]);

  const toolbarButtons = [
    { icon: <Bold className="w-3.5 h-3.5" />, cmd: () => exec("bold"), label: "Bold" },
    { icon: <Italic className="w-3.5 h-3.5" />, cmd: () => exec("italic"), label: "Italic" },
    { icon: <Code className="w-3.5 h-3.5" />, cmd: () => exec("formatBlock", "pre"), label: "Code" },
    { icon: <Heading2 className="w-3.5 h-3.5" />, cmd: () => exec("formatBlock", "h2"), label: "H2" },
    { icon: <Heading3 className="w-3.5 h-3.5" />, cmd: () => exec("formatBlock", "h3"), label: "H3" },
    { icon: <List className="w-3.5 h-3.5" />, cmd: () => exec("insertUnorderedList"), label: "Bullet List" },
    { icon: <ListOrdered className="w-3.5 h-3.5" />, cmd: () => exec("insertOrderedList"), label: "Numbered List" },
    { icon: <Link className="w-3.5 h-3.5" />, cmd: insertLink, label: "Insert Link" },
    { icon: <Undo className="w-3.5 h-3.5" />, cmd: () => exec("undo"), label: "Undo" },
    { icon: <Redo className="w-3.5 h-3.5" />, cmd: () => exec("redo"), label: "Redo" },
  ];

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center gap-0.5 p-1.5 border-b bg-muted/50 flex-wrap" data-testid={`${testId}-toolbar`}>
        {toolbarButtons.map((btn) => (
          <Button
            key={btn.label}
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => { e.preventDefault(); btn.cmd(); }}
            title={btn.label}
            data-testid={`${testId}-btn-${btn.label.toLowerCase().replace(/\s/g, "-")}`}
          >
            {btn.icon}
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        id={id}
        contentEditable
        className="min-h-[200px] max-h-[400px] overflow-y-auto p-3 text-sm focus:outline-none prose prose-sm dark:prose-invert max-w-none"
        onInput={handleInput}
        data-testid={testId}
      />
    </div>
  );
}

type Page = {
  id: number;
  workspaceId?: string;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  template?: string | null;
  parentId?: number | null;
  sortOrder?: number | null;
  isPublished?: boolean | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export default function ContentPages() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id || "";

  const [search, setSearch] = useState("");
  const [templateFilter, setTemplateFilter] = useState("all");

  const [addOpen, setAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addSlug, setAddSlug] = useState("");
  const [addTemplate, setAddTemplate] = useState("default");
  const [addDescription, setAddDescription] = useState("");
  const [addContent, setAddContent] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editPage, setEditPage] = useState<Page | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editTemplate, setEditTemplate] = useState("");
  const [editContent, setEditContent] = useState("");

  const [auditOpen, setAuditOpen] = useState(false);
  const [auditPage, setAuditPage] = useState<Page | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePage, setDeletePage] = useState<Page | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pagesPerPage = 10;

  const queryKey = ["/api/site-pages", workspaceId];
  const { data: pages = [], isLoading } = useQuery<Page[]>({
    queryKey,
    queryFn: () => fetch(`/api/site-pages/${workspaceId}`).then(r => r.json()),
    enabled: !!workspaceId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/site-pages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setAddOpen(false);
      setAddTitle("");
      setAddSlug("");
      setAddTemplate("default");
      setAddDescription("");
      setAddContent("");
      toast({ title: "Page created", description: `"${addTitle}" has been added.` });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/site-pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      const title = deletePage?.title;
      setDeleteOpen(false);
      setDeletePage(null);
      toast({ title: "Page deleted", description: `"${title}" has been removed.` });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/site-pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setEditOpen(false);
      setEditPage(null);
      toast({ title: "Page updated", description: `"${editTitle}" has been saved.` });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: number; isPublished: boolean }) =>
      apiRequest("PUT", `/api/site-pages/${id}`, { isPublished }),
    onMutate: async ({ id, isPublished }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Page[]>(queryKey);
      queryClient.setQueryData<Page[]>(queryKey, (old) =>
        old?.map((p) => (p.id === id ? { ...p, isPublished } : p))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
      toast({ title: "Error", description: "Failed to update publish status", variant: "destructive" });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const templates = Array.from(new Set(pages.map((p) => p.template || "default")));

  const filtered = pages.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.slug.toLowerCase().includes(search.toLowerCase())) return false;
    if (templateFilter !== "all" && (p.template || "default") !== templateFilter) return false;
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
      slug: addSlug || undefined,
      template: addTemplate,
      description: addDescription,
      content: addContent || undefined,
    });
  };

  const handleEdit = (page: Page) => {
    setEditPage(page);
    setEditTitle(page.title);
    setEditSlug(page.slug);
    setEditTemplate(page.template || "default");
    setEditContent(page.content || "");
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editPage || !editTitle.trim()) return;
    updateMutation.mutate({
      id: editPage.id,
      data: {
        title: editTitle,
        slug: editSlug,
        template: editTemplate,
        content: editContent,
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

  const toggleSelectRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const visibleIds = paginatedPages.map((p) => p.id);
    const allSelected = visibleIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const [bulkActing, setBulkActing] = useState(false);

  const handleBulkPublish = async (publish: boolean) => {
    setBulkActing(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          apiRequest("PUT", `/api/site-pages/${id}`, { isPublished: publish })
        )
      );
      queryClient.invalidateQueries({ queryKey });
      setSelectedIds(new Set());
      toast({ title: publish ? "Pages published" : "Pages unpublished", description: `${selectedIds.size} page(s) updated.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setBulkActing(false);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    setBulkActing(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          apiRequest("DELETE", `/api/site-pages/${id}`)
        )
      );
      queryClient.invalidateQueries({ queryKey });
      const count = selectedIds.size;
      setSelectedIds(new Set());
      setBulkDeleteOpen(false);
      toast({ title: "Pages deleted", description: `${count} page(s) removed.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setBulkActing(false);
    }
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
        <Select value={templateFilter} onValueChange={setTemplateFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-template-filter">
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            {templates.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-muted/60 border rounded-md" data-testid="bulk-action-bar">
          <span className="text-sm font-medium">{selectedIds.size} page(s) selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <Button size="sm" variant="outline" disabled={bulkActing} onClick={() => handleBulkPublish(true)} data-testid="button-bulk-publish">
              {bulkActing && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              Bulk Publish
            </Button>
            <Button size="sm" variant="outline" disabled={bulkActing} onClick={() => handleBulkPublish(false)} data-testid="button-bulk-unpublish">
              {bulkActing && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              Bulk Unpublish
            </Button>
            <Button size="sm" variant="destructive" disabled={bulkActing} onClick={() => setBulkDeleteOpen(true)} data-testid="button-bulk-delete">
              Bulk Delete
            </Button>
          </div>
        </div>
      )}

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
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-muted-foreground/50 cursor-pointer"
                      checked={paginatedPages.length > 0 && paginatedPages.every((p) => selectedIds.has(p.id))}
                      onChange={toggleSelectAll}
                      data-testid="checkbox-select-all"
                    />
                  </TableHead>
                  <TableHead>Page Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No pages found. Add a page to get started.
                    </TableCell>
                  </TableRow>
                ) : paginatedPages.map((page) => (
                  <TableRow key={page.id} data-testid={`row-page-${page.id}`}>
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-muted-foreground/50 cursor-pointer"
                        checked={selectedIds.has(page.id)}
                        onChange={() => toggleSelectRow(page.id)}
                        data-testid={`checkbox-page-${page.id}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium" data-testid={`text-page-title-${page.id}`}>
                      <button
                        className="text-left hover:text-sidebar-primary hover:underline transition-colors cursor-pointer"
                        onClick={() => handleEdit(page)}
                        data-testid={`link-page-title-${page.id}`}
                      >
                        {page.title}
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs" data-testid={`text-page-slug-${page.id}`}>{page.slug}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" data-testid={`badge-page-template-${page.id}`}>{page.template || "default"}</Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        className="inline-flex items-center cursor-pointer"
                        onClick={() => togglePublishMutation.mutate({ id: page.id, isPublished: !page.isPublished })}
                        data-testid={`button-toggle-publish-${page.id}`}
                      >
                        <Badge variant={page.isPublished ? "default" : "outline"} className="transition-colors">
                          {page.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : ""}</TableCell>
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
        <DialogContent className="max-w-2xl" data-testid="dialog-add-page">
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-page-title">Page Title</Label>
              <Input id="add-page-title" placeholder="Page title" value={addTitle} onChange={(e) => setAddTitle(e.target.value)} data-testid="input-add-page-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-page-slug">Slug</Label>
              <Input id="add-page-slug" placeholder="/about-us (auto-generated if blank)" value={addSlug} onChange={(e) => setAddSlug(e.target.value)} data-testid="input-add-page-slug" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-page-template">Template</Label>
              <Select value={addTemplate} onValueChange={setAddTemplate}>
                <SelectTrigger data-testid="select-add-page-template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="landing">Landing</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-page-description">Description</Label>
              <Textarea id="add-page-description" placeholder="Page description or meta summary..." value={addDescription} onChange={(e) => setAddDescription(e.target.value)} data-testid="input-add-page-description" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor value={addContent} onChange={setAddContent} id="add-page-content" testId="editor-add-page-content" />
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
        <DialogContent className="max-w-2xl" data-testid="dialog-edit-page">
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-page-title">Page Title</Label>
              <Input id="edit-page-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} data-testid="input-edit-page-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-page-slug">Slug</Label>
              <Input id="edit-page-slug" value={editSlug} onChange={(e) => setEditSlug(e.target.value)} data-testid="input-edit-page-slug" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-page-template">Template</Label>
              <Select value={editTemplate} onValueChange={setEditTemplate}>
                <SelectTrigger data-testid="select-edit-page-template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="landing">Landing</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <RichTextEditor value={editContent} onChange={setEditContent} id="edit-page-content" testId="editor-edit-page-content" />
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
                <div><span className="text-muted-foreground">Slug:</span> {auditPage.slug}</div>
                <div><span className="text-muted-foreground">Template:</span> {auditPage.template || "default"}</div>
                <div><span className="text-muted-foreground">Status:</span> {auditPage.isPublished ? "Published" : "Draft"}</div>
                <div><span className="text-muted-foreground">Last Updated:</span> {auditPage.updatedAt ? new Date(auditPage.updatedAt).toLocaleDateString() : "N/A"}</div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium">SEO Checklist:</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {!auditPage.metaTitle && <li>Add a meta title</li>}
                  {!auditPage.metaDescription && <li>Add a meta description</li>}
                  {!auditPage.canonicalUrl && <li>Set a canonical URL</li>}
                  {!auditPage.ogImage && <li>Add an Open Graph image</li>}
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

      <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <DialogContent data-testid="dialog-bulk-delete">
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.size} Pages</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Delete {selectedIds.size} page(s)? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkDeleteOpen(false)} data-testid="button-cancel-bulk-delete">Cancel</Button>
            <Button variant="destructive" onClick={handleBulkDeleteConfirm} disabled={bulkActing} data-testid="button-confirm-bulk-delete">
              {bulkActing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete {selectedIds.size} Pages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
