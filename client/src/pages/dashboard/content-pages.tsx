import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Plus, Pencil, Search, Trash2 } from "lucide-react";

const initialPages = [
  { id: 1, title: "Home", url: "/", type: "Landing", seoScore: 92, lastUpdated: "2026-02-15" },
  { id: 2, title: "About", url: "/about", type: "Standard", seoScore: 85, lastUpdated: "2026-02-12" },
  { id: 3, title: "Services", url: "/services", type: "Standard", seoScore: 78, lastUpdated: "2026-02-10" },
  { id: 4, title: "Blog", url: "/blog", type: "Archive", seoScore: 88, lastUpdated: "2026-02-14" },
  { id: 5, title: "Contact", url: "/contact", type: "Standard", seoScore: 71, lastUpdated: "2026-02-08" },
];

type Page = typeof initialPages[number];

export default function ContentPages() {
  const { toast } = useToast();
  const [pages, setPages] = useState(initialPages);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const [addOpen, setAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addType, setAddType] = useState("Standard");
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

  const types = Array.from(new Set(pages.map((p) => p.type)));

  const filtered = pages.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.url.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    return true;
  });

  const handleAddPage = () => {
    if (!addTitle.trim()) return;
    const newId = Math.max(...pages.map((p) => p.id), 0) + 1;
    setPages([...pages, {
      id: newId,
      title: addTitle,
      url: addUrl || `/${addTitle.toLowerCase().replace(/\s+/g, "-")}`,
      type: addType,
      seoScore: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
    }]);
    setAddOpen(false);
    setAddTitle("");
    setAddUrl("");
    setAddType("Standard");
    setAddDescription("");
    toast({ title: "Page created", description: `"${addTitle}" has been added.` });
  };

  const handleEdit = (page: Page) => {
    setEditPage(page);
    setEditTitle(page.title);
    setEditUrl(page.url);
    setEditType(page.type);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editPage || !editTitle.trim()) return;
    setPages(pages.map((p) => (p.id === editPage.id ? { ...p, title: editTitle, url: editUrl, type: editType, lastUpdated: new Date().toISOString().split("T")[0] } : p)));
    setEditOpen(false);
    setEditPage(null);
    toast({ title: "Page updated", description: `"${editTitle}" has been saved.` });
  };

  const handleAudit = (page: Page) => {
    setAuditPage(page);
    setAuditOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletePage) return;
    setPages(pages.filter((p) => p.id !== deletePage.id));
    const title = deletePage.title;
    setDeleteOpen(false);
    setDeletePage(null);
    toast({ title: "Page deleted", description: `"${title}" has been removed.` });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Pages</h1>
        <Button data-testid="button-add-page" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
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
              {filtered.map((page) => (
                <TableRow key={page.id} data-testid={`row-page-${page.id}`}>
                  <TableCell className="font-medium" data-testid={`text-page-title-${page.id}`}>{page.title}</TableCell>
                  <TableCell className="text-muted-foreground" data-testid={`text-page-url-${page.id}`}>{page.url}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" data-testid={`badge-page-type-${page.id}`}>{page.type}</Badge>
                  </TableCell>
                  <TableCell data-testid={`text-seo-score-${page.id}`}>{page.seoScore}/100</TableCell>
                  <TableCell className="text-muted-foreground">{page.lastUpdated}</TableCell>
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
        </CardContent>
      </Card>

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
                  <SelectItem value="Landing">Landing</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Archive">Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-page-description">Meta Description</Label>
              <Textarea id="add-page-description" placeholder="Page meta description..." value={addDescription} onChange={(e) => setAddDescription(e.target.value)} data-testid="input-add-page-description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} data-testid="button-cancel-add-page">Cancel</Button>
            <Button onClick={handleAddPage} data-testid="button-save-add-page">Save</Button>
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
                  <SelectItem value="Landing">Landing</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Archive">Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-page">Cancel</Button>
            <Button onClick={handleEditSave} data-testid="button-save-edit-page">Save</Button>
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
                <div><span className="text-muted-foreground">SEO Score:</span> {auditPage.seoScore}/100</div>
                <div><span className="text-muted-foreground">Last Updated:</span> {auditPage.lastUpdated}</div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Recommendations:</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {auditPage.seoScore < 80 && <li>Improve meta description length and relevance</li>}
                  {auditPage.seoScore < 90 && <li>Add more internal links to this page</li>}
                  {auditPage.seoScore < 85 && <li>Optimize heading structure (H1, H2, H3)</li>}
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
            <Button variant="destructive" onClick={handleDeleteConfirm} data-testid="button-confirm-delete-page">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
