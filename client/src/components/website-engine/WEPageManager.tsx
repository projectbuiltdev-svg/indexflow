import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Trash2,
  Home,
  AlertTriangle,
  GripVertical,
  FileText,
  Layers,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Page {
  id: number;
  projectId: number;
  venueId: string;
  name: string;
  slug: string;
  accessTag: string;
  pageOrder: number;
  isHome: boolean;
}

interface WEPageManagerProps {
  projectId: string;
  venueId: string;
  activePageId: string;
  projectLanguage: string;
  onPageSelect: (pageId: string) => void;
  onPageCreated: (page: Page) => void;
  onPageDeleted: (pageId: string) => void;
}

const ACCESS_COLORS: Record<string, string> = {
  public: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  admin: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "super-admin": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function WEPageManager({
  projectId,
  venueId,
  activePageId,
  projectLanguage,
  onPageSelect,
  onPageCreated,
  onPageDeleted,
}: WEPageManagerProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"pages" | "programmatic">("pages");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newPageAccess, setNewPageAccess] = useState("public");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data: pagesData, isLoading } = useQuery<{ pages: Page[]; total: number }>({
    queryKey: ["/api/we/pages", projectId, venueId],
    queryFn: async () => {
      const res = await fetch(`/api/we/pages/${projectId}?venueId=${venueId}`);
      if (!res.ok) return { pages: [], total: 0 };
      return res.json();
    },
    enabled: !!projectId && projectId !== "0",
  });

  const pages = pagesData?.pages || [];

  const createPage = useMutation({
    mutationFn: async (data: { name: string; slug: string; accessTag: string }) => {
      const res = await apiRequest("POST", `/api/we/pages/${projectId}?venueId=${venueId}`, data);
      return res.json();
    },
    onSuccess: (page: Page) => {
      queryClient.invalidateQueries({ queryKey: ["/api/we/pages", projectId, venueId] });
      onPageCreated(page);
      onPageSelect(page.id.toString());
      setShowAddForm(false);
      setNewPageName("");
      setNewPageAccess("public");
    },
  });

  const updatePage = useMutation({
    mutationFn: async ({ pageId, data }: { pageId: number; data: Record<string, any> }) => {
      const res = await apiRequest("PATCH", `/api/we/pages/${projectId}/${pageId}?venueId=${venueId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/we/pages", projectId, venueId] });
      setEditingId(null);
    },
  });

  const deletePage = useMutation({
    mutationFn: async (pageId: number) => {
      await apiRequest("DELETE", `/api/we/pages/${projectId}/${pageId}?venueId=${venueId}`);
      return pageId;
    },
    onSuccess: (pageId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/we/pages", projectId, venueId] });
      onPageDeleted(pageId.toString());
      setDeleteConfirm(null);
    },
  });

  const handleAddPage = useCallback(() => {
    if (!newPageName.trim()) return;
    const slug = "/" + newPageName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    createPage.mutate({ name: newPageName.trim(), slug, accessTag: newPageAccess });
  }, [newPageName, newPageAccess, createPage]);

  const handleRename = useCallback((pageId: number) => {
    if (!editName.trim()) { setEditingId(null); return; }
    updatePage.mutate({ pageId, data: { name: editName.trim() } });
  }, [editName, updatePage]);

  if (collapsed) {
    return (
      <div className="w-10 border-r bg-background flex flex-col items-center pt-2" data-testid="we-pages-collapsed">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(false)} data-testid="btn-expand-pages">
          <PanelLeftOpen className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-60 border-r bg-background flex flex-col" data-testid="we-page-manager">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("pages")}
            className={`px-2 py-1 text-xs font-medium rounded ${activeTab === "pages" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
            data-testid="tab-pages"
          >
            <FileText className="w-3 h-3 inline mr-1" />
            Pages
          </button>
          <button
            onClick={() => setActiveTab("programmatic")}
            className={`px-2 py-1 text-xs font-medium rounded ${activeTab === "programmatic" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
            data-testid="tab-programmatic"
          >
            <Layers className="w-3 h-3 inline mr-1" />
            Programmatic
          </button>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCollapsed(true)} data-testid="btn-collapse-pages">
          <PanelLeftClose className="w-3.5 h-3.5" />
        </Button>
      </div>

      {activeTab === "pages" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto" data-testid="we-page-list">
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {pages.map((page) => (
              <div
                key={page.id}
                className={`group flex items-center gap-1 px-2 py-1.5 text-sm cursor-pointer border-b border-transparent hover:bg-muted/50 ${
                  activePageId === page.id.toString() ? "bg-primary/10 border-l-2 border-l-primary" : ""
                }`}
                onClick={() => onPageSelect(page.id.toString())}
                data-testid={`page-row-${page.id}`}
              >
                <GripVertical className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 cursor-grab" />

                {page.isHome && <Home className="w-3 h-3 text-primary shrink-0" />}

                {editingId === page.id ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleRename(page.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleRename(page.id); if (e.key === "Escape") setEditingId(null); }}
                    className="h-6 text-xs px-1"
                    autoFocus
                    data-testid={`input-rename-${page.id}`}
                  />
                ) : (
                  <span
                    className="flex-1 truncate text-xs"
                    onDoubleClick={() => { setEditingId(page.id); setEditName(page.name); }}
                  >
                    {page.name}
                  </span>
                )}

                <span className={`text-[10px] px-1 py-0.5 rounded shrink-0 ${ACCESS_COLORS[page.accessTag] || ACCESS_COLORS.public}`}>
                  {page.accessTag}
                </span>

                {!page.isHome && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0"
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(page.id); }}
                    data-testid={`btn-delete-page-${page.id}`}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                )}
              </div>
            ))}

            <div
              className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground border-t cursor-pointer hover:bg-muted/50"
              onClick={() => onPageSelect("404")}
              data-testid="page-row-404"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>404 Page</span>
            </div>
          </div>

          {showAddForm ? (
            <div className="p-2 border-t space-y-2" data-testid="we-add-page-form">
              <Input
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="Page name"
                className="h-8 text-xs"
                onKeyDown={(e) => { if (e.key === "Enter") handleAddPage(); if (e.key === "Escape") setShowAddForm(false); }}
                autoFocus
                data-testid="input-new-page-name"
              />
              <Select value={newPageAccess} onValueChange={setNewPageAccess}>
                <SelectTrigger className="h-7 text-xs" data-testid="select-access-tag">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button size="sm" className="flex-1 h-7 text-xs" onClick={handleAddPage} disabled={createPage.isPending} data-testid="btn-create-page">
                  {createPage.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Create"}
                </Button>
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowAddForm(false)} data-testid="btn-cancel-add">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-2 border-t">
              <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={() => setShowAddForm(true)} data-testid="btn-add-page">
                <Plus className="w-3 h-3 mr-1" />
                Add Page
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === "programmatic" && (
        <div className="flex-1 overflow-y-auto p-3" data-testid="we-programmatic-tab">
          <div className="text-center text-muted-foreground text-xs mt-8 space-y-3">
            <Layers className="w-10 h-10 mx-auto opacity-40" />
            <p>No location pages yet.</p>
            <Button size="sm" variant="outline" className="text-xs" data-testid="btn-generate-locations">
              Generate Location Pages
            </Button>
          </div>
        </div>
      )}

      {deleteConfirm !== null && (
        <div className="absolute inset-0 z-20 bg-black/50 flex items-center justify-center p-4" data-testid="we-delete-confirm">
          <div className="bg-background rounded-lg p-4 max-w-xs w-full shadow-xl">
            <p className="text-sm mb-3">
              Delete {pages.find((p) => p.id === deleteConfirm)?.name}? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => deletePage.mutate(deleteConfirm)}
                disabled={deletePage.isPending}
                data-testid="btn-confirm-delete"
              >
                {deletePage.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Delete"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)} data-testid="btn-cancel-delete">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
