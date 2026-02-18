import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWorkspace } from "@/lib/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus, Layers, Search, MoreHorizontal, Pencil, Eye, Copy, FileDown, Trash2,
  Globe, CheckCircle, Play, Pause, Link2, X, RefreshCw, Wrench, Settings,
  Plug, Unplug, RotateCcw, Save, Download, Send, FileText, Clock,
  DollarSign, AlertTriangle, AlertCircle, Info, Target, TrendingUp,
  ExternalLink, Image, Type,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function getTabFromUrl(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("tab") || "posts";
  } catch {
    return "posts";
  }
}

function setTabInUrl(tab: string) {
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tab);
  window.history.replaceState({}, "", url.pathname + url.search);
}

function PostsTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [schemaFilter, setSchemaFilter] = useState("all");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("general");
  const [formSchema, setFormSchema] = useState("Article");
  const [formKeyword, setFormKeyword] = useState("");
  const [formContent, setFormContent] = useState("");
  const [bulkName, setBulkName] = useState("");
  const [bulkTopics, setBulkTopics] = useState("");
  const [bulkCategory, setBulkCategory] = useState("general");
  const [bulkWordCount, setBulkWordCount] = useState([1500]);

  const queryKey = `/api/admin/blog/posts?workspaceId=${workspaceId}`;
  const { data: posts = [], isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/blog/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setNewPostOpen(false);
      resetForm();
      toast({ title: "Post created", description: "New post has been created." });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/blog/posts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setEditOpen(false);
      setSelectedPost(null);
      toast({ title: "Post updated" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/blog/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDeleteOpen(false);
      setSelectedPost(null);
      toast({ title: "Post deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const bulkMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/blog/posts/bulk/create", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setBulkOpen(false);
      setBulkName("");
      setBulkTopics("");
      setBulkCategory("general");
      toast({ title: "Bulk generation started", description: "Posts have been queued for generation." });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setFormTitle("");
    setFormCategory("general");
    setFormSchema("Article");
    setFormKeyword("");
    setFormContent("");
  };

  const filtered = useMemo(() => {
    return posts.filter((p: any) => {
      if (search && !p.title?.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (schemaFilter !== "all" && p.schemaType !== schemaFilter) return false;
      return true;
    });
  }, [posts, search, statusFilter, categoryFilter, schemaFilter]);

  const categories = useMemo(() => Array.from(new Set(posts.map((p: any) => p.category).filter(Boolean))), [posts]);
  const schemas = useMemo(() => Array.from(new Set(posts.map((p: any) => p.schemaType).filter(Boolean))), [posts]);

  const statusBadge = (status: string) => {
    if (status === "published") return "default" as const;
    if (status === "draft") return "secondary" as const;
    if (status === "scheduled") return "outline" as const;
    return "secondary" as const;
  };

  const handleCreate = () => {
    if (!formTitle.trim()) return;
    createMutation.mutate({
      workspaceId,
      title: formTitle,
      category: formCategory,
      schemaType: formSchema,
      primaryKeyword: formKeyword,
      mdxContent: formContent,
      status: "draft",
    });
  };

  const handleBulk = () => {
    const topics = bulkTopics.split("\n").filter((t) => t.trim());
    if (topics.length === 0) return;
    bulkMutation.mutate({
      workspaceId,
      posts: topics.map((t) => ({
        title: t.trim(),
        primaryKeyword: t.trim().toLowerCase(),
        category: bulkCategory,
      })),
    });
  };

  const handleEditOpen = (post: any) => {
    setSelectedPost(post);
    setFormTitle(post.title || "");
    setFormCategory(post.category || "general");
    setFormSchema(post.schemaType || "Article");
    setFormKeyword(post.primaryKeyword || "");
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedPost || !formTitle.trim()) return;
    updateMutation.mutate({
      id: selectedPost.id,
      title: formTitle,
      category: formCategory,
      schemaType: formSchema,
      primaryKeyword: formKeyword,
    });
  };

  const handleDuplicate = (post: any) => {
    createMutation.mutate({
      workspaceId,
      title: `${post.title} (Copy)`,
      category: post.category,
      schemaType: post.schemaType,
      primaryKeyword: post.primaryKeyword,
      mdxContent: post.mdxContent,
      status: "draft",
    });
  };

  const handleExportMDX = (post: any) => {
    const blob = new Blob([post.mdxContent || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${post.slug || post.title || "post"}.mdx`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "MDX exported" });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-muted-foreground" data-testid="text-post-count">{posts.length} posts</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" data-testid="button-bulk-generate" onClick={() => setBulkOpen(true)}>
            <Layers className="w-4 h-4 mr-2" />
            Bulk Generate
          </Button>
          <Button data-testid="button-new-post" onClick={() => { resetForm(); setNewPostOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" data-testid="input-search-posts" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-category-filter"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c: string) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={schemaFilter} onValueChange={setSchemaFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-schema-filter"><SelectValue placeholder="Schema" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schemas</SelectItem>
            {schemas.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-muted-foreground" data-testid="text-empty-posts">No posts yet. Create a post manually or use bulk generate to get started.</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Button variant="outline" onClick={() => setBulkOpen(true)} data-testid="button-empty-bulk">
                <Layers className="w-4 h-4 mr-2" />Bulk Generate
              </Button>
              <Button onClick={() => { resetForm(); setNewPostOpen(true); }} data-testid="button-empty-new-post">
                <Plus className="w-4 h-4 mr-2" />New Post
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Words</TableHead>
                  <TableHead className="text-right">Images</TableHead>
                  <TableHead>Schema</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((post: any) => (
                  <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                    <TableCell className="font-medium max-w-[300px] truncate" data-testid={`text-post-title-${post.id}`}>{post.title}</TableCell>
                    <TableCell data-testid={`text-post-category-${post.id}`}>{post.category || "-"}</TableCell>
                    <TableCell><Badge variant={statusBadge(post.status)} data-testid={`badge-post-status-${post.id}`}>{post.status}</Badge></TableCell>
                    <TableCell className="text-right" data-testid={`text-post-words-${post.id}`}>{(post.wordCount || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right" data-testid={`text-post-images-${post.id}`}>{post.imageCount || 0}</TableCell>
                    <TableCell>{post.schemaType && <Badge variant="outline" data-testid={`badge-post-schema-${post.id}`}>{post.schemaType}</Badge>}</TableCell>
                    <TableCell data-testid={`text-post-date-${post.id}`}>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-post-actions-${post.id}`}><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem data-testid={`action-edit-${post.id}`} onClick={() => handleEditOpen(post)}><Pencil className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem data-testid={`action-preview-${post.id}`} onClick={() => { setSelectedPost(post); setPreviewOpen(true); }}><Eye className="w-4 h-4 mr-2" />Preview</DropdownMenuItem>
                          <DropdownMenuItem data-testid={`action-duplicate-${post.id}`} onClick={() => handleDuplicate(post)}><Copy className="w-4 h-4 mr-2" />Duplicate</DropdownMenuItem>
                          <DropdownMenuItem data-testid={`action-export-${post.id}`} onClick={() => handleExportMDX(post)}><FileDown className="w-4 h-4 mr-2" />Export MDX</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" data-testid={`action-delete-${post.id}`} onClick={() => { setSelectedPost(post); setDeleteOpen(true); }}><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
        <DialogContent data-testid="dialog-new-post">
          <DialogHeader><DialogTitle>Create New Post</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Post title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} data-testid="input-new-post-title" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger data-testid="select-new-post-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="booking-systems">Booking Systems</SelectItem>
                  <SelectItem value="ai-automation">AI Automation</SelectItem>
                  <SelectItem value="website-design">Website Design</SelectItem>
                  <SelectItem value="local-guides">Local Guides</SelectItem>
                  <SelectItem value="industry-guides">Industry Guides</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Schema Type</Label>
              <Select value={formSchema} onValueChange={setFormSchema}>
                <SelectTrigger data-testid="select-new-post-schema"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="HowTo">HowTo</SelectItem>
                  <SelectItem value="BlogPosting">BlogPosting</SelectItem>
                  <SelectItem value="FAQPage">FAQPage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Keyword</Label>
              <Input placeholder="Target keyword" value={formKeyword} onChange={(e) => setFormKeyword(e.target.value)} data-testid="input-new-post-keyword" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea placeholder="Start writing..." value={formContent} onChange={(e) => setFormContent(e.target.value)} data-testid="input-new-post-content" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPostOpen(false)} data-testid="button-cancel-new-post">Cancel</Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending} data-testid="button-save-new-post">{createMutation.isPending ? "Creating..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent data-testid="dialog-bulk-generate">
          <DialogHeader><DialogTitle>Bulk Generate Posts</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input placeholder="Campaign name" value={bulkName} onChange={(e) => setBulkName(e.target.value)} data-testid="input-bulk-name" />
            </div>
            <div className="space-y-2">
              <Label>Topics (one per line)</Label>
              <Textarea placeholder="Enter topics, one per line..." value={bulkTopics} onChange={(e) => setBulkTopics(e.target.value)} className="min-h-[120px]" data-testid="input-bulk-topics" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={bulkCategory} onValueChange={setBulkCategory}>
                <SelectTrigger data-testid="select-bulk-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="booking-systems">Booking Systems</SelectItem>
                  <SelectItem value="ai-automation">AI Automation</SelectItem>
                  <SelectItem value="website-design">Website Design</SelectItem>
                  <SelectItem value="local-guides">Local Guides</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Word Count: {bulkWordCount[0]}</Label>
              <Slider value={bulkWordCount} onValueChange={setBulkWordCount} min={500} max={5000} step={100} data-testid="slider-bulk-word-count" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)} data-testid="button-cancel-bulk">Cancel</Button>
            <Button onClick={handleBulk} disabled={bulkMutation.isPending} data-testid="button-start-bulk">{bulkMutation.isPending ? "Generating..." : "Generate"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-testid="dialog-edit-post">
          <DialogHeader><DialogTitle>Edit Post</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} data-testid="input-edit-post-title" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formCategory} onValueChange={setFormCategory}>
                <SelectTrigger data-testid="select-edit-post-category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="booking-systems">Booking Systems</SelectItem>
                  <SelectItem value="ai-automation">AI Automation</SelectItem>
                  <SelectItem value="website-design">Website Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Schema Type</Label>
              <Select value={formSchema} onValueChange={setFormSchema}>
                <SelectTrigger data-testid="select-edit-post-schema"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="HowTo">HowTo</SelectItem>
                  <SelectItem value="BlogPosting">BlogPosting</SelectItem>
                  <SelectItem value="FAQPage">FAQPage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-post">Cancel</Button>
            <Button onClick={handleEditSave} disabled={updateMutation.isPending} data-testid="button-save-edit-post">{updateMutation.isPending ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent data-testid="dialog-preview-post">
          <DialogHeader><DialogTitle>Preview: {selectedPost?.title}</DialogTitle></DialogHeader>
          {selectedPost && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={statusBadge(selectedPost.status)}>{selectedPost.status}</Badge>
                {selectedPost.schemaType && <Badge variant="outline">{selectedPost.schemaType}</Badge>}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Category:</span> {selectedPost.category || "-"}</div>
                <div><span className="text-muted-foreground">Words:</span> {(selectedPost.wordCount || 0).toLocaleString()}</div>
                <div><span className="text-muted-foreground">Images:</span> {selectedPost.imageCount || 0}</div>
                <div><span className="text-muted-foreground">Published:</span> {selectedPost.publishedAt ? new Date(selectedPost.publishedAt).toLocaleDateString() : "Not published"}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)} data-testid="button-close-preview">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-testid="dialog-delete-post">
          <DialogHeader><DialogTitle>Delete Post</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-post">Cancel</Button>
            <Button variant="destructive" onClick={() => selectedPost && deleteMutation.mutate(selectedPost.id)} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-post">{deleteMutation.isPending ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PagesTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formType, setFormType] = useState("Standard");
  const [formDescription, setFormDescription] = useState("");

  const queryKey = `/api/admin/blog/pages/${workspaceId}`;
  const { data: pages = [], isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/blog/pages", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); setAddOpen(false); toast({ title: "Page created" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/blog/pages/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); setEditOpen(false); toast({ title: "Page updated" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/blog/pages/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); setDeleteOpen(false); toast({ title: "Page deleted" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const auditMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/blog/pages/${id}/audit`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); toast({ title: "Audit complete" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const filtered = useMemo(() => pages.filter((p: any) => {
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase()) && !p.url?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [pages, search]);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search pages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" data-testid="input-search-pages" />
        </div>
        <Button data-testid="button-add-page" onClick={() => { setFormTitle(""); setFormUrl(""); setFormType("Standard"); setFormDescription(""); setAddOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />Add Page
        </Button>
      </div>
      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground" data-testid="text-empty-pages">No pages found.</p></CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
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
                {filtered.map((page: any) => (
                  <TableRow key={page.id} data-testid={`row-page-${page.id}`}>
                    <TableCell className="font-medium" data-testid={`text-page-title-${page.id}`}>{page.title}</TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-page-url-${page.id}`}>{page.url}</TableCell>
                    <TableCell><Badge variant="secondary" data-testid={`badge-page-type-${page.id}`}>{page.type || "Standard"}</Badge></TableCell>
                    <TableCell data-testid={`text-seo-score-${page.id}`}>{page.seoScore || 0}/100</TableCell>
                    <TableCell className="text-muted-foreground">{page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 flex-wrap">
                        <Button variant="ghost" size="icon" data-testid={`button-edit-page-${page.id}`} onClick={() => { setSelected(page); setFormTitle(page.title); setFormUrl(page.url); setFormType(page.type || "Standard"); setEditOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" data-testid={`button-audit-page-${page.id}`} onClick={() => { setSelected(page); setAuditOpen(true); auditMutation.mutate(page.id); }}><Search className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-page-${page.id}`} onClick={() => { setSelected(page); setDeleteOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-testid="dialog-add-page">
          <DialogHeader><DialogTitle>Add New Page</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Page Title</Label><Input placeholder="Page title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} data-testid="input-add-page-title" /></div>
            <div className="space-y-2"><Label>URL</Label><Input placeholder="/page-url" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} data-testid="input-add-page-url" /></div>
            <div className="space-y-2"><Label>Type</Label>
              <Select value={formType} onValueChange={setFormType}><SelectTrigger data-testid="select-add-page-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Landing">Landing</SelectItem><SelectItem value="Standard">Standard</SelectItem><SelectItem value="Archive">Archive</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Meta Description</Label><Textarea placeholder="Page meta description..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} data-testid="input-add-page-description" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} data-testid="button-cancel-add-page">Cancel</Button>
            <Button onClick={() => createMutation.mutate({ workspaceId, title: formTitle, url: formUrl || `/${formTitle.toLowerCase().replace(/\s+/g, "-")}`, type: formType, metaDescription: formDescription })} disabled={createMutation.isPending} data-testid="button-save-add-page">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-testid="dialog-edit-page">
          <DialogHeader><DialogTitle>Edit Page</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Page Title</Label><Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} data-testid="input-edit-page-title" /></div>
            <div className="space-y-2"><Label>URL</Label><Input value={formUrl} onChange={(e) => setFormUrl(e.target.value)} data-testid="input-edit-page-url" /></div>
            <div className="space-y-2"><Label>Type</Label>
              <Select value={formType} onValueChange={setFormType}><SelectTrigger data-testid="select-edit-page-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Landing">Landing</SelectItem><SelectItem value="Standard">Standard</SelectItem><SelectItem value="Archive">Archive</SelectItem></SelectContent></Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-page">Cancel</Button>
            <Button onClick={() => selected && updateMutation.mutate({ id: selected.id, title: formTitle, url: formUrl, type: formType })} disabled={updateMutation.isPending} data-testid="button-save-edit-page">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-testid="dialog-delete-page">
          <DialogHeader><DialogTitle>Delete Page</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{selected?.title}"?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-page">Cancel</Button>
            <Button variant="destructive" onClick={() => selected && deleteMutation.mutate(selected.id)} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-page">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CampaignsTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [newOpen, setNewOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [newTopics, setNewTopics] = useState("");

  const queryKey = `/api/admin/blog/campaigns/${workspaceId}`;
  const { data: campaigns = [], isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  const statusBadge = (status: string) => {
    if (status === "active") return "default" as const;
    if (status === "completed") return "secondary" as const;
    return "outline" as const;
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/blog/posts/bulk/create", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); setNewOpen(false); toast({ title: "Campaign created" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button data-testid="button-new-campaign" onClick={() => { setNewName(""); setNewTopics(""); setNewOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />New Campaign
        </Button>
      </div>
      {campaigns.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground" data-testid="text-empty-campaigns">No campaigns yet.</p></CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Post Count</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((c: any) => (
                  <TableRow key={c.id} data-testid={`row-campaign-${c.id}`}>
                    <TableCell className="font-medium" data-testid={`text-campaign-name-${c.id}`}>{c.name}</TableCell>
                    <TableCell data-testid={`text-post-count-${c.id}`}>{c.postsTotal || 0}</TableCell>
                    <TableCell data-testid={`text-completed-${c.id}`}>{c.postsCompleted || 0}</TableCell>
                    <TableCell><Badge variant={statusBadge(c.status)} data-testid={`badge-status-${c.id}`}>{c.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 flex-wrap">
                        <Button variant="ghost" size="icon" data-testid={`button-view-posts-${c.id}`} onClick={() => { setSelected(c); setViewOpen(true); }}><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-campaign-${c.id}`} onClick={() => { setSelected(c); setDeleteOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent data-testid="dialog-view-campaign">
          <DialogHeader><DialogTitle>Campaign: {selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              <Badge variant={statusBadge(selected.status)}>{selected.status}</Badge>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Total Posts:</span> {selected.postsTotal || 0}</div>
                <div><span className="text-muted-foreground">Completed:</span> {selected.postsCompleted || 0}</div>
              </div>
              <Progress value={selected.postsTotal > 0 ? ((selected.postsCompleted || 0) / selected.postsTotal) * 100 : 0} data-testid="progress-campaign" />
              <p className="text-xs text-muted-foreground text-right">{selected.postsTotal > 0 ? Math.round(((selected.postsCompleted || 0) / selected.postsTotal) * 100) : 0}% complete</p>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewOpen(false)} data-testid="button-close-view-campaign">Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent data-testid="dialog-new-campaign">
          <DialogHeader><DialogTitle>Create New Campaign</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Campaign Name</Label><Input placeholder="Campaign name" value={newName} onChange={(e) => setNewName(e.target.value)} data-testid="input-new-campaign-name" /></div>
            <div className="space-y-2"><Label>Topics (one per line)</Label><Textarea placeholder="Enter topics..." value={newTopics} onChange={(e) => setNewTopics(e.target.value)} className="min-h-[120px]" data-testid="input-new-campaign-topics" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)} data-testid="button-cancel-new-campaign">Cancel</Button>
            <Button onClick={() => { const topics = newTopics.split("\n").filter(t => t.trim()); if (topics.length === 0) return; createMutation.mutate({ workspaceId, posts: topics.map(t => ({ title: t.trim(), primaryKeyword: t.trim().toLowerCase() })) }); }} disabled={createMutation.isPending} data-testid="button-save-new-campaign">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-testid="dialog-delete-campaign">
          <DialogHeader><DialogTitle>Delete Campaign</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{selected?.name}"?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-campaign">Cancel</Button>
            <Button variant="destructive" onClick={() => { setDeleteOpen(false); toast({ title: "Campaign deleted" }); }} data-testid="button-confirm-delete-campaign">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DomainsTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [formDomain, setFormDomain] = useState("");

  const queryKey = `/api/admin/blog/domains?workspaceId=${workspaceId}`;
  const { data: domains = [], isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/blog/domains", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); setAddOpen(false); toast({ title: "Domain added" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PATCH", `/api/admin/blog/domains/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); setEditOpen(false); toast({ title: "Domain updated" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/blog/domains/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); setRemoveOpen(false); toast({ title: "Domain removed" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const statusBadge = (status: string) => {
    if (status === "verified") return "default" as const;
    if (status === "pending") return "secondary" as const;
    return "destructive" as const;
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button data-testid="button-add-domain" onClick={() => { setFormDomain(""); setAddOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />Add Domain
        </Button>
      </div>
      {domains.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground" data-testid="text-empty-domains">No domains configured yet.</p></CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posts Published</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {domains.map((d: any) => (
                  <TableRow key={d.id} data-testid={`row-domain-${d.id}`}>
                    <TableCell className="font-medium" data-testid={`text-domain-${d.id}`}>{d.domain}</TableCell>
                    <TableCell><Badge variant={statusBadge(d.verificationStatus || d.status || "pending")} data-testid={`badge-domain-status-${d.id}`}>{d.verificationStatus || d.status || "pending"}</Badge></TableCell>
                    <TableCell data-testid={`text-posts-published-${d.id}`}>{d.postsPublished || 0}</TableCell>
                    <TableCell className="text-muted-foreground">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 flex-wrap">
                        <Button variant="ghost" size="icon" data-testid={`button-verify-domain-${d.id}`} onClick={() => { updateMutation.mutate({ id: d.id, verificationStatus: "verified" }); }}><CheckCircle className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" data-testid={`button-edit-domain-${d.id}`} onClick={() => { setSelected(d); setFormDomain(d.domain); setEditOpen(true); }}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" data-testid={`button-remove-domain-${d.id}`} onClick={() => { setSelected(d); setRemoveOpen(true); }}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-testid="dialog-add-domain">
          <DialogHeader><DialogTitle>Add Domain</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Domain Name</Label><Input placeholder="example.com" value={formDomain} onChange={(e) => setFormDomain(e.target.value)} data-testid="input-add-domain-name" /></div>
            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">DNS Verification</p>
              <p>Add a CNAME record pointing to <code className="text-xs bg-background px-1 py-0.5 rounded">blog.indexflow.cloud</code></p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} data-testid="button-cancel-add-domain">Cancel</Button>
            <Button onClick={() => createMutation.mutate({ workspaceId, domain: formDomain })} disabled={createMutation.isPending} data-testid="button-save-add-domain">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-testid="dialog-edit-domain">
          <DialogHeader><DialogTitle>Edit Domain</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Domain Name</Label><Input value={formDomain} onChange={(e) => setFormDomain(e.target.value)} data-testid="input-edit-domain-name" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-domain">Cancel</Button>
            <Button onClick={() => selected && updateMutation.mutate({ id: selected.id })} disabled={updateMutation.isPending} data-testid="button-save-edit-domain">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent data-testid="dialog-remove-domain">
          <DialogHeader><DialogTitle>Remove Domain</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to remove "{selected?.domain}"?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveOpen(false)} data-testid="button-cancel-remove-domain">Cancel</Button>
            <Button variant="destructive" onClick={() => selected && deleteMutation.mutate(selected.id)} disabled={deleteMutation.isPending} data-testid="button-confirm-remove-domain">Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SeoTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const postsQueryKey = `/api/admin/blog/posts?workspaceId=${workspaceId}`;
  const { data: posts = [], isLoading } = useQuery<any[]>({ queryKey: [postsQueryKey] });
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);

  const validateMutation = useMutation({
    mutationFn: (postId: string) => apiRequest("POST", `/api/seo/validate/${postId}`).then(r => r.json()),
    onSuccess: (data) => { setValidationResult(data); toast({ title: "Validation complete" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={selectedPostId || ""} onValueChange={setSelectedPostId}>
          <SelectTrigger className="w-[300px]" data-testid="select-seo-post"><SelectValue placeholder="Select a post to validate" /></SelectTrigger>
          <SelectContent>
            {posts.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button onClick={() => selectedPostId && validateMutation.mutate(selectedPostId)} disabled={!selectedPostId || validateMutation.isPending} data-testid="button-validate-seo">
          <Search className="w-4 h-4 mr-2" />{validateMutation.isPending ? "Validating..." : "Validate"}
        </Button>
      </div>
      {posts.length === 0 && (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground" data-testid="text-empty-seo">No posts available for SEO validation.</p></CardContent></Card>
      )}
      {validationResult && (
        <Card>
          <CardHeader><CardTitle>SEO Score</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold" data-testid="text-seo-score">{validationResult.score || 0}</div>
              <div className="text-muted-foreground">/100</div>
            </div>
            {validationResult.checks && (
              <div className="space-y-2">
                {validationResult.checks.map((check: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm" data-testid={`seo-check-${i}`}>
                    {check.passed ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                    <span>{check.message || check.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {!validationResult && posts.length > 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Select a post and click Validate to see SEO scores and recommendations.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LinksTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [subTab, setSubTab] = useState("suggestions");

  const { data: suggestions = [] } = useQuery<any[]>({ queryKey: [`/api/admin/blog/links/suggestions?workspaceId=${workspaceId}`] });
  const { data: orphans = [] } = useQuery<any[]>({ queryKey: [`/api/admin/blog/links/orphans?workspaceId=${workspaceId}`] });
  const { data: linkHealth = [] } = useQuery<any[]>({ queryKey: [`/api/admin/blog/links/health?workspaceId=${workspaceId}`] });

  const autoLinkMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/admin/blog/links/auto-link`, { workspaceId }),
    onSuccess: () => toast({ title: "Auto-Link Complete", description: "Links have been added across posts." }),
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const applyMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/blog/links/apply/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [`/api/admin/blog/links/suggestions?workspaceId=${workspaceId}`] }); toast({ title: "Link applied" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const statusBadge = (status: number) => {
    if (status === 200) return "default" as const;
    if (status === 301) return "secondary" as const;
    return "destructive" as const;
  };

  return (
    <div className="space-y-4">
      <Tabs value={subTab} onValueChange={setSubTab} data-testid="tabs-links">
        <TabsList>
          <TabsTrigger value="suggestions" data-testid="tab-suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="auto-link" data-testid="tab-auto-link">Auto-Link</TabsTrigger>
          <TabsTrigger value="orphan" data-testid="tab-orphan">Orphan Report</TabsTrigger>
          <TabsTrigger value="health" data-testid="tab-health">Link Health</TabsTrigger>
        </TabsList>
        <TabsContent value="suggestions">
          <Card>
            <CardHeader><CardTitle>Link Suggestions</CardTitle></CardHeader>
            <CardContent>
              {suggestions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4" data-testid="text-empty-suggestions">No suggestions available.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Source Post</TableHead><TableHead>Target Post</TableHead><TableHead>Anchor Text</TableHead><TableHead>Relevance</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {suggestions.map((s: any) => (
                      <TableRow key={s.id} data-testid={`row-suggestion-${s.id}`}>
                        <TableCell className="font-medium">{s.sourceTitle || s.source}</TableCell>
                        <TableCell>{s.targetTitle || s.target}</TableCell>
                        <TableCell className="text-muted-foreground">{s.anchorText || s.anchor}</TableCell>
                        <TableCell data-testid={`text-relevance-${s.id}`}>{s.relevanceScore || s.relevance}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 flex-wrap">
                            <Button variant="ghost" size="icon" onClick={() => applyMutation.mutate(s.id)} data-testid={`button-apply-link-${s.id}`}><Link2 className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="icon" data-testid={`button-dismiss-${s.id}`}><X className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="auto-link">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>Auto-Link</CardTitle>
              <Button onClick={() => autoLinkMutation.mutate()} disabled={autoLinkMutation.isPending} data-testid="button-run-auto-link">
                <Play className="w-4 h-4 mr-2" />{autoLinkMutation.isPending ? "Running..." : "Run Bulk Auto-Link"}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm" data-testid="text-auto-link-info">Run bulk auto-link to automatically add internal links across all posts in this workspace.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orphan">
          <Card>
            <CardHeader><CardTitle>Orphan Report</CardTitle></CardHeader>
            <CardContent>
              {orphans.length === 0 ? (
                <p className="text-muted-foreground text-center py-4" data-testid="text-empty-orphans">No orphan posts found.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Post Title</TableHead><TableHead>Published</TableHead><TableHead>Incoming Links</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {orphans.map((o: any, i: number) => (
                      <TableRow key={o.id || i} data-testid={`row-orphan-${o.id || i}`}>
                        <TableCell className="font-medium">{o.title}</TableCell>
                        <TableCell className="text-muted-foreground">{o.publishedAt ? new Date(o.publishedAt).toLocaleDateString() : "-"}</TableCell>
                        <TableCell>0</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="health">
          <Card>
            <CardHeader><CardTitle>Link Health</CardTitle></CardHeader>
            <CardContent>
              {linkHealth.length === 0 ? (
                <p className="text-muted-foreground text-center py-4" data-testid="text-empty-link-health">No link health data available.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>URL</TableHead><TableHead>Status</TableHead><TableHead>Post</TableHead><TableHead>Last Checked</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {linkHealth.map((l: any, i: number) => (
                      <TableRow key={l.id || i} data-testid={`row-link-health-${l.id || i}`}>
                        <TableCell className="font-medium text-sm max-w-[200px] truncate">{l.url}</TableCell>
                        <TableCell><Badge variant={statusBadge(l.status)} data-testid={`badge-link-status-${l.id || i}`}>{l.status}</Badge></TableCell>
                        <TableCell>{l.post || l.postTitle}</TableCell>
                        <TableCell className="text-muted-foreground">{l.lastChecked ? new Date(l.lastChecked).toLocaleDateString() : "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HealthTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const pagesQueryKey = `/api/admin/blog/pages/${workspaceId}`;
  const { data: pages = [], isLoading } = useQuery<any[]>({ queryKey: [pagesQueryKey] });

  const bulkAuditMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/admin/blog/pages/bulk-audit/${workspaceId}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [pagesQueryKey] }); toast({ title: "Audit Complete", description: "All pages have been audited." }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const overallScore = useMemo(() => {
    if (pages.length === 0) return 0;
    const scores = pages.filter((p: any) => p.seoScore != null).map((p: any) => p.seoScore);
    return scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;
  }, [pages]);

  const grade = overallScore >= 90 ? "A" : overallScore >= 80 ? "B" : overallScore >= 70 ? "C" : overallScore >= 60 ? "D" : "F";

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => bulkAuditMutation.mutate()} disabled={bulkAuditMutation.isPending} data-testid="button-run-audit">
          <RefreshCw className="w-4 h-4 mr-2" />{bulkAuditMutation.isPending ? "Running..." : "Run Audit"}
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold" data-testid="text-overall-score">{overallScore}</div>
              <div className="text-muted-foreground">/100</div>
            </div>
            <Badge variant="secondary" data-testid="badge-grade" className="text-lg px-3 py-1">{grade}</Badge>
            <p className="text-sm text-muted-foreground">Overall SEO health score based on the latest audit</p>
          </div>
        </CardContent>
      </Card>
      {pages.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground" data-testid="text-empty-health">No pages to audit yet.</p></CardContent></Card>
      ) : (
        <Card>
          <CardHeader><CardTitle>Page Audit Results</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Last Audited</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((p: any) => (
                  <TableRow key={p.id} data-testid={`row-audit-${p.id}`}>
                    <TableCell className="font-medium">{p.title || p.url}</TableCell>
                    <TableCell data-testid={`text-page-score-${p.id}`}>{p.seoScore || 0}/100</TableCell>
                    <TableCell className="text-muted-foreground">{p.lastAuditedAt ? new Date(p.lastAuditedAt).toLocaleDateString() : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CmsTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [configureOpen, setConfigureOpen] = useState(false);
  const [selectedCms, setSelectedCms] = useState<string | null>(null);
  const [configApiKey, setConfigApiKey] = useState("");
  const [configEndpoint, setConfigEndpoint] = useState("");

  const cmsProviders = [
    { id: "wordpress", name: "WordPress" },
    { id: "webflow", name: "Webflow" },
    { id: "shopify", name: "Shopify" },
    { id: "ghost", name: "Ghost" },
    { id: "wix", name: "Wix" },
  ];

  const { data: integrations = [] } = useQuery<any[]>({ queryKey: [`/api/admin/cms/integrations?workspaceId=${workspaceId}`] });
  const { data: syncLogs = [] } = useQuery<any[]>({ queryKey: [`/api/admin/cms/sync-logs?workspaceId=${workspaceId}`] });

  const isConnected = (cmsId: string) => integrations.some((i: any) => i.cmsType === cmsId && i.connected);

  const syncMutation = useMutation({
    mutationFn: (cmsId: string) => apiRequest("POST", `/api/admin/cms/sync`, { workspaceId, cmsType: cmsId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/cms/sync-logs?workspaceId=${workspaceId}`] });
      toast({ title: "Sync Complete" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const configureMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/admin/cms/configure`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/cms/integrations?workspaceId=${workspaceId}`] });
      setConfigureOpen(false);
      toast({ title: "Configuration Saved" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cmsProviders.map((cms) => {
          const connected = isConnected(cms.id);
          return (
            <Card key={cms.id} data-testid={`card-cms-${cms.id}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-bold">{cms.name}</h3>
                  <Badge variant={connected ? "default" : "secondary"} data-testid={`badge-cms-status-${cms.id}`}>
                    {connected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" size="sm" onClick={() => { setSelectedCms(cms.id); setConfigApiKey(""); setConfigEndpoint(""); setConfigureOpen(true); }} data-testid={`button-configure-${cms.id}`}>
                    <Settings className="w-4 h-4 mr-1" />Configure
                  </Button>
                  {connected && (
                    <Button size="sm" onClick={() => syncMutation.mutate(cms.id)} disabled={syncMutation.isPending} data-testid={`button-sync-${cms.id}`}>
                      <RefreshCw className="w-4 h-4 mr-1" />Sync
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {syncLogs.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Sync Log</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>CMS</TableHead><TableHead>Status</TableHead><TableHead>Posts Synced</TableHead></TableRow></TableHeader>
              <TableBody>
                {syncLogs.map((log: any, i: number) => (
                  <TableRow key={log.id || i} data-testid={`row-sync-log-${log.id || i}`}>
                    <TableCell className="text-muted-foreground">{log.date || (log.createdAt ? new Date(log.createdAt).toLocaleString() : "-")}</TableCell>
                    <TableCell className="font-medium">{log.cms || log.cmsType}</TableCell>
                    <TableCell><Badge variant={log.status === "Success" ? "default" : "destructive"} data-testid={`badge-sync-status-${log.id || i}`}>{log.status}</Badge></TableCell>
                    <TableCell>{log.postsSynced || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      <Dialog open={configureOpen} onOpenChange={setConfigureOpen}>
        <DialogContent data-testid="dialog-configure-cms">
          <DialogHeader><DialogTitle>Configure {cmsProviders.find(c => c.id === selectedCms)?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>API Key</Label><Input type="password" value={configApiKey} onChange={(e) => setConfigApiKey(e.target.value)} placeholder="Enter API key" data-testid="input-config-api-key" /></div>
            <div className="space-y-2"><Label>API Endpoint</Label><Input value={configEndpoint} onChange={(e) => setConfigEndpoint(e.target.value)} placeholder="https://yoursite.com/api" data-testid="input-config-endpoint" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigureOpen(false)} data-testid="button-cancel-configure">Cancel</Button>
            <Button onClick={() => configureMutation.mutate({ workspaceId, cmsType: selectedCms, apiKey: configApiKey, endpoint: configEndpoint })} disabled={configureMutation.isPending} data-testid="button-save-configure">Save & Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportsTab({ workspaceId }: { workspaceId: string }) {
  const [subTab, setSubTab] = useState("content");

  const { data: stats } = useQuery<any>({ queryKey: [`/api/admin/reports/content-stats?workspaceId=${workspaceId}`] });

  const categoryData = stats?.categoryBreakdown || [
    { name: "General", posts: 0 },
  ];
  const monthlyData = stats?.monthlyBreakdown || [
    { name: "This Month", posts: 0 },
  ];

  return (
    <div className="space-y-4">
      <Tabs value={subTab} onValueChange={setSubTab} data-testid="tabs-reports">
        <TabsList>
          <TabsTrigger value="content" data-testid="tab-content">Content</TabsTrigger>
          <TabsTrigger value="seo" data-testid="tab-seo">SEO</TabsTrigger>
          <TabsTrigger value="revenue" data-testid="tab-revenue">Revenue</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Total Posts</p><p className="text-2xl font-bold" data-testid="text-stat-total-posts">{stats?.totalPosts || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Published</p><p className="text-2xl font-bold" data-testid="text-stat-published">{stats?.publishedPosts || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Type className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Avg Word Count</p><p className="text-2xl font-bold" data-testid="text-stat-avg-words">{stats?.avgWordCount?.toLocaleString() || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Image className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Image Coverage</p><p className="text-2xl font-bold" data-testid="text-stat-image-coverage">{stats?.imageCoverage || "0%"}</p></div></div></CardContent></Card>
          </div>
          {categoryData.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Posts by Category</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]" data-testid="chart-posts-by-category">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 12 }} />
                      <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="posts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="seo" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Search className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Pages Audited</p><p className="text-2xl font-bold" data-testid="text-stat-pages-audited">{stats?.pagesAudited || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Target className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Avg SEO Score</p><p className="text-2xl font-bold" data-testid="text-stat-avg-seo-score">{stats?.avgSeoScore || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Keywords</p><p className="text-2xl font-bold" data-testid="text-stat-keywords">{stats?.keywords || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><TrendingUp className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Avg Position</p><p className="text-2xl font-bold" data-testid="text-stat-avg-position">{stats?.avgPosition || "-"}</p></div></div></CardContent></Card>
          </div>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><DollarSign className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Total Invoiced</p><p className="text-2xl font-bold" data-testid="text-stat-total-invoiced">${stats?.totalInvoiced?.toLocaleString() || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Paid</p><p className="text-2xl font-bold" data-testid="text-stat-paid">${stats?.totalPaid?.toLocaleString() || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Clock className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Outstanding</p><p className="text-2xl font-bold" data-testid="text-stat-outstanding">${stats?.totalOutstanding?.toLocaleString() || 0}</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">Overdue</p><p className="text-2xl font-bold" data-testid="text-stat-overdue">${stats?.totalOverdue?.toLocaleString() || 0}</p></div></div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InvoicesTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [formClient, setFormClient] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formTax, setFormTax] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formStatus, setFormStatus] = useState("Draft");
  const [formNotes, setFormNotes] = useState("");

  const queryKey = `/api/admin/invoices?workspaceId=${workspaceId}`;
  const { data: invoices = [], isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/invoices", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); setCreateOpen(false); resetForm(); toast({ title: "Invoice created" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/admin/invoices/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); setEditOpen(false); toast({ title: "Invoice updated" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/invoices/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: [queryKey] }); setDeleteOpen(false); toast({ title: "Invoice deleted" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const resetForm = () => { setFormClient(""); setFormAmount(""); setFormTax(""); setFormDueDate(""); setFormStatus("Draft"); setFormNotes(""); setSelected(null); };

  const filtered = useMemo(() => invoices.filter((inv: any) => {
    const matchesSearch = (inv.invoiceNumber || inv.id || "").toLowerCase().includes(searchQuery.toLowerCase()) || (inv.client || inv.clientName || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [invoices, searchQuery, statusFilter]);

  const statCards = useMemo(() => {
    const getCount = (s: string) => invoices.filter((i: any) => i.status === s);
    return [
      { label: "Draft", icon: FileText, count: getCount("Draft").length, amount: getCount("Draft").reduce((sum: number, i: any) => sum + (i.total || 0), 0) },
      { label: "Sent", icon: Send, count: getCount("Sent").length, amount: getCount("Sent").reduce((sum: number, i: any) => sum + (i.total || 0), 0) },
      { label: "Paid", icon: DollarSign, count: getCount("Paid").length, amount: getCount("Paid").reduce((sum: number, i: any) => sum + (i.total || 0), 0) },
      { label: "Overdue", icon: AlertTriangle, count: getCount("Overdue").length, amount: getCount("Overdue").reduce((sum: number, i: any) => sum + (i.total || 0), 0) },
    ];
  }, [invoices]);

  const statusBadge = (status: string) => {
    if (status === "Draft") return "secondary" as const;
    if (status === "Sent") return "outline" as const;
    if (status === "Paid") return "default" as const;
    if (status === "Overdue") return "destructive" as const;
    return "secondary" as const;
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 w-[200px]" data-testid="input-search-invoices" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-invoice-status-filter"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { resetForm(); setCreateOpen(true); }} data-testid="button-create-invoice">
          <Plus className="w-4 h-4 mr-2" />Create Invoice
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold" data-testid={`text-stat-count-${stat.label.toLowerCase()}`}>{stat.count}</p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-stat-amount-${stat.label.toLowerCase()}`}>${stat.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="p-8 text-center"><p className="text-muted-foreground" data-testid="text-empty-invoices">No invoices found.</p></CardContent></Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv: any) => (
                  <TableRow key={inv.id} data-testid={`row-invoice-${inv.id}`}>
                    <TableCell className="font-medium" data-testid={`text-invoice-id-${inv.id}`}>{inv.invoiceNumber || inv.id}</TableCell>
                    <TableCell data-testid={`text-invoice-client-${inv.id}`}>{inv.client || inv.clientName}</TableCell>
                    <TableCell className="text-right" data-testid={`text-invoice-amount-${inv.id}`}>${(inv.amount || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground" data-testid={`text-invoice-tax-${inv.id}`}>${(inv.tax || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold" data-testid={`text-invoice-total-${inv.id}`}>${(inv.total || 0).toLocaleString()}</TableCell>
                    <TableCell><Badge variant={statusBadge(inv.status)} data-testid={`badge-invoice-status-${inv.id}`}>{inv.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground" data-testid={`text-invoice-due-${inv.id}`}>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" data-testid={`button-invoice-actions-${inv.id}`}><MoreHorizontal className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem data-testid={`action-view-${inv.id}`} onClick={() => { setSelected(inv); setViewOpen(true); }}><Eye className="w-4 h-4 mr-2" />View</DropdownMenuItem>
                          <DropdownMenuItem data-testid={`action-edit-${inv.id}`} onClick={() => { setSelected(inv); setFormClient(inv.client || inv.clientName || ""); setFormAmount(String(inv.amount || 0)); setFormTax(String(inv.tax || 0)); setFormDueDate(inv.dueDate || ""); setFormStatus(inv.status || "Draft"); setFormNotes(inv.notes || ""); setEditOpen(true); }}><Pencil className="w-4 h-4 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem data-testid={`action-send-${inv.id}`} onClick={() => { updateMutation.mutate({ id: inv.id, status: "Sent" }); }}><Send className="w-4 h-4 mr-2" />Send</DropdownMenuItem>
                          <DropdownMenuItem data-testid={`action-mark-paid-${inv.id}`} onClick={() => { updateMutation.mutate({ id: inv.id, status: "Paid" }); }}><CheckCircle className="w-4 h-4 mr-2" />Mark Paid</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" data-testid={`action-delete-${inv.id}`} onClick={() => { setSelected(inv); setDeleteOpen(true); }}><Trash2 className="w-4 h-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent data-testid="dialog-create-invoice">
          <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Client Name</Label><Input value={formClient} onChange={(e) => setFormClient(e.target.value)} placeholder="Client name" data-testid="input-create-client" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Amount</Label><Input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} placeholder="0.00" data-testid="input-create-amount" /></div>
              <div className="space-y-2"><Label>Tax</Label><Input type="number" value={formTax} onChange={(e) => setFormTax(e.target.value)} placeholder="0.00" data-testid="input-create-tax" /></div>
            </div>
            <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} data-testid="input-create-due-date" /></div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}><SelectTrigger data-testid="select-create-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Sent">Sent</SelectItem><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Overdue">Overdue</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Additional notes..." data-testid="input-create-notes" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} data-testid="button-cancel-create-invoice">Cancel</Button>
            <Button onClick={() => { const amount = parseFloat(formAmount) || 0; const tax = parseFloat(formTax) || 0; createMutation.mutate({ workspaceId, client: formClient, amount, tax, total: amount + tax, dueDate: formDueDate, status: formStatus, notes: formNotes }); }} disabled={createMutation.isPending} data-testid="button-confirm-create-invoice">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-testid="dialog-edit-invoice">
          <DialogHeader><DialogTitle>Edit Invoice {selected?.invoiceNumber || selected?.id}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Client Name</Label><Input value={formClient} onChange={(e) => setFormClient(e.target.value)} data-testid="input-edit-client" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Amount</Label><Input type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} data-testid="input-edit-amount" /></div>
              <div className="space-y-2"><Label>Tax</Label><Input type="number" value={formTax} onChange={(e) => setFormTax(e.target.value)} data-testid="input-edit-tax" /></div>
            </div>
            <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} data-testid="input-edit-due-date" /></div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}><SelectTrigger data-testid="select-edit-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Sent">Sent</SelectItem><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Overdue">Overdue</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label>Notes</Label><Textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} data-testid="input-edit-notes" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-invoice">Cancel</Button>
            <Button onClick={() => { const amount = parseFloat(formAmount) || 0; const tax = parseFloat(formTax) || 0; selected && updateMutation.mutate({ id: selected.id, client: formClient, amount, tax, total: amount + tax, dueDate: formDueDate, status: formStatus, notes: formNotes }); }} disabled={updateMutation.isPending} data-testid="button-confirm-edit-invoice">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-testid="dialog-delete-invoice">
          <DialogHeader><DialogTitle>Delete Invoice</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete invoice <span className="font-medium text-foreground">{selected?.invoiceNumber || selected?.id}</span>?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-invoice">Cancel</Button>
            <Button variant="destructive" onClick={() => selected && deleteMutation.mutate(selected.id)} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-invoice">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent data-testid="dialog-view-invoice">
          <DialogHeader><DialogTitle>Invoice {selected?.invoiceNumber || selected?.id}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex items-center gap-4"><Label className="w-24 text-muted-foreground">Client</Label><span className="font-medium">{selected.client || selected.clientName}</span></div>
              <div className="flex items-center gap-4"><Label className="w-24 text-muted-foreground">Amount</Label><span>${(selected.amount || 0).toLocaleString()}</span></div>
              <div className="flex items-center gap-4"><Label className="w-24 text-muted-foreground">Tax</Label><span>${(selected.tax || 0).toLocaleString()}</span></div>
              <div className="flex items-center gap-4"><Label className="w-24 text-muted-foreground">Total</Label><span className="font-bold">${(selected.total || 0).toLocaleString()}</span></div>
              <div className="flex items-center gap-4"><Label className="w-24 text-muted-foreground">Status</Label><Badge variant={statusBadge(selected.status)}>{selected.status}</Badge></div>
              <div className="flex items-center gap-4"><Label className="w-24 text-muted-foreground">Due Date</Label><span>{selected.dueDate ? new Date(selected.dueDate).toLocaleDateString() : "-"}</span></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewOpen(false)} data-testid="button-close-view-invoice">Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ContentEngine() {
  const { selectedWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  const workspaceId = selectedWorkspace?.id || "";

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setTabInUrl(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Content Engine</h1>
            <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">White-label blog management for client workspaces</p>
          </div>
          <Button variant="ghost" className="text-sm" data-testid="link-how-it-works" asChild>
            <a href="#how-it-works"><ExternalLink className="w-4 h-4 mr-1" />How it works</a>
          </Button>
        </div>
        {selectedWorkspace && (
          <div className="flex items-center gap-2 pt-1">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium" data-testid="text-workspace-name">{selectedWorkspace.name}</span>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} data-testid="tabs-content-engine">
        <div className="overflow-x-auto">
          <TabsList className="w-auto" data-testid="tabslist-content-engine">
            <TabsTrigger value="posts" data-testid="tab-posts">Posts</TabsTrigger>
            <TabsTrigger value="pages" data-testid="tab-pages">Pages</TabsTrigger>
            <TabsTrigger value="campaigns" data-testid="tab-campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="domains" data-testid="tab-domains">Domains</TabsTrigger>
            <TabsTrigger value="seo" data-testid="tab-seo">SEO</TabsTrigger>
            <TabsTrigger value="links" data-testid="tab-links">Links</TabsTrigger>
            <TabsTrigger value="health" data-testid="tab-health">Health</TabsTrigger>
            <TabsTrigger value="cms" data-testid="tab-cms">CMS</TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">Reports</TabsTrigger>
            <TabsTrigger value="invoices" data-testid="tab-invoices">Invoices</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="posts" className="mt-4">
          {workspaceId ? <PostsTab workspaceId={workspaceId} /> : <p className="text-muted-foreground">Select a workspace to manage posts.</p>}
        </TabsContent>
        <TabsContent value="pages" className="mt-4">
          {workspaceId ? <PagesTab workspaceId={workspaceId} /> : <p className="text-muted-foreground">Select a workspace to manage pages.</p>}
        </TabsContent>
        <TabsContent value="campaigns" className="mt-4">
          {workspaceId ? <CampaignsTab workspaceId={workspaceId} /> : <p className="text-muted-foreground">Select a workspace to manage campaigns.</p>}
        </TabsContent>
        <TabsContent value="domains" className="mt-4">
          {workspaceId ? <DomainsTab workspaceId={workspaceId} /> : <p className="text-muted-foreground">Select a workspace to manage domains.</p>}
        </TabsContent>
        <TabsContent value="seo" className="mt-4">
          {workspaceId ? <SeoTab workspaceId={workspaceId} /> : <p className="text-muted-foreground">Select a workspace for SEO tools.</p>}
        </TabsContent>
        <TabsContent value="links" className="mt-4">
          {workspaceId ? <LinksTab workspaceId={workspaceId} /> : <p className="text-muted-foreground">Select a workspace to manage links.</p>}
        </TabsContent>
        <TabsContent value="health" className="mt-4">
          {workspaceId ? <HealthTab workspaceId={workspaceId} /> : <p className="text-muted-foreground">Select a workspace for health audits.</p>}
        </TabsContent>
        <TabsContent value="cms" className="mt-4">
          {workspaceId ? <CmsTab workspaceId={workspaceId} /> : <p className="text-muted-foreground">Select a workspace for CMS integration.</p>}
        </TabsContent>
        <TabsContent value="reports" className="mt-4">
          {workspaceId ? <ReportsTab workspaceId={workspaceId} /> : <p className="text-muted-foreground">Select a workspace for reports.</p>}
        </TabsContent>
        <TabsContent value="invoices" className="mt-4">
          {workspaceId ? <InvoicesTab workspaceId={workspaceId} /> : <p className="text-muted-foreground">Select a workspace to manage invoices.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}