import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWorkspace } from "@/lib/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Layers, Search, MoreHorizontal, Pencil, Eye, Copy, FileDown, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Post {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  status: string;
  description: string | null;
  tags: string[] | null;
  mdxContent: string | null;
  schemaType: string | null;
  publishedAt: string | null;
  createdAt: string | null;
  workspaceId: string;
  generationStatus: string | null;
  qualityGateStatus: string | null;
  qualityFailReasons: string[] | null;
}

const statusVariant = (status: string) => {
  switch (status) {
    case "published":
      return "default" as const;
    case "draft":
      return "secondary" as const;
    case "review":
      return "outline" as const;
    case "scheduled":
      return "secondary" as const;
    default:
      return "secondary" as const;
  }
};

export default function ContentPosts() {
  const [, navigate] = useLocation();
  const { selectedWorkspace } = useWorkspace();
  const { toast } = useToast();
  const wsId = selectedWorkspace?.id || "";

  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/admin/blog/posts", wsId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/blog/posts?workspaceId=${wsId}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    enabled: !!wsId,
    refetchInterval: (query) => {
      const data = query.state.data as Post[] | undefined;
      const hasGenerating = data?.some((p) => p.generationStatus === "pending" || p.generationStatus === "generating");
      return hasGenerating ? 5000 : false;
    },
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [schemaFilter, setSchemaFilter] = useState("all");

  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("SEO");
  const [newPostSchema, setNewPostSchema] = useState("Article");
  const [newPostContent, setNewPostContent] = useState("");

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkTopics, setBulkTopics] = useState("");
  const [bulkCategory, setBulkCategory] = useState("SEO");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePost, setDeletePost] = useState<Post | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const createMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/admin/blog/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts", wsId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/blog/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts", wsId] });
    },
  });

  const filtered = posts.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (schemaFilter !== "all" && p.schemaType !== schemaFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / postsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPosts = filtered.slice((safeCurrentPage - 1) * postsPerPage, safeCurrentPage * postsPerPage);

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];
  const schemas = Array.from(new Set(posts.map((p) => p.schemaType).filter(Boolean))) as string[];

  const handleNewPost = async () => {
    if (!newPostTitle.trim()) return;
    const slug = newPostTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    try {
      await createMutation.mutateAsync({
        title: newPostTitle,
        slug,
        category: newPostCategory,
        schemaType: newPostSchema,
        mdxContent: newPostContent,
        status: "draft",
        workspaceId: wsId,
      });
      setNewPostOpen(false);
      setNewPostTitle("");
      setNewPostCategory("SEO");
      setNewPostSchema("Article");
      setNewPostContent("");
      toast({ title: "Post created", description: `"${newPostTitle}" has been created as a draft.` });
    } catch {
      toast({ title: "Failed to create post", variant: "destructive" });
    }
  };

  const handleBulkGenerate = async () => {
    const topics = bulkTopics.split("\n").filter((t) => t.trim());
    if (topics.length === 0) return;
    try {
      const res = await apiRequest("POST", "/api/admin/blog/posts/bulk/create", {
        topics: topics.map((t) => t.trim()),
        category: bulkCategory,
        workspaceId: wsId,
      });
      const created: any = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts", wsId] });
      setBulkOpen(false);
      setBulkTopics("");
      setBulkCategory("SEO");

      if (Array.isArray(created) && created.length > 0) {
        const postIds = created.map((p: any) => p.id);
        toast({ title: "Drafts created", description: `Generating content for ${postIds.length} posts...` });
        await apiRequest("POST", "/api/admin/blog/posts/bulk/generate", { postIds });
        toast({ title: "Generation started", description: `${postIds.length} posts are being written with AI. Refresh in a minute to see results.` });
      } else {
        toast({ title: "Drafts created", description: `${topics.length} posts queued.` });
      }
    } catch {
      toast({ title: "Bulk generation failed", variant: "destructive" });
    }
  };

  const handlePreview = (post: Post) => {
    setPreviewPost(post);
    setPreviewOpen(true);
  };

  const handleDuplicate = async (post: Post) => {
    try {
      await createMutation.mutateAsync({
        title: `${post.title} (Copy)`,
        slug: `${post.slug}-copy`,
        category: post.category,
        schemaType: post.schemaType,
        mdxContent: post.mdxContent,
        description: post.description,
        tags: post.tags,
        status: "draft",
        workspaceId: wsId,
      });
      toast({ title: "Post duplicated", description: `A copy of "${post.title}" has been created.` });
    } catch {
      toast({ title: "Duplicate failed", variant: "destructive" });
    }
  };

  const handleExportMDX = (post: Post) => {
    const blob = new Blob([post.mdxContent || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${post.slug || "post"}.mdx`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "MDX exported", description: `"${post.title}" has been exported as MDX.` });
  };

  const handleDeleteConfirm = async () => {
    if (!deletePost) return;
    const title = deletePost.title;
    try {
      await deleteMutation.mutateAsync(deletePost.id);
      setDeleteOpen(false);
      setDeletePost(null);
      toast({ title: "Post deleted", description: `"${title}" has been removed.` });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString();
  };

  const wordCount = (content: string | null) => {
    if (!content) return 0;
    return content.split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="p-6 space-y-6">
      <ContentEngineTabs />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Posts</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Button data-testid="button-new-post" onClick={() => setNewPostOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
          <Button variant="outline" data-testid="button-bulk-generate" onClick={() => setBulkOpen(true)}>
            <Layers className="w-4 h-4 mr-2" />
            Bulk Generate
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-posts"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-category-filter">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={schemaFilter} onValueChange={setSchemaFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-schema-filter">
            <SelectValue placeholder="Schema Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schemas</SelectItem>
            {schemas.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Words</TableHead>
                  <TableHead>Schema</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {posts.length === 0 ? "No posts yet. Create your first post to get started." : "No posts match your filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPosts.map((post) => (
                    <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                      <TableCell className="font-medium max-w-[300px] truncate" data-testid={`text-post-title-${post.id}`}>
                        <button
                          className="text-left hover:text-sidebar-primary hover:underline transition-colors cursor-pointer"
                          onClick={() => navigate(`/${wsId}/content/posts/${post.id}/edit`)}
                          data-testid={`link-post-title-${post.id}`}
                        >
                          {post.title}
                        </button>
                      </TableCell>
                      <TableCell data-testid={`text-post-category-${post.id}`}>{post.category || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(post.status)} data-testid={`badge-post-status-${post.id}`}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" data-testid={`text-post-words-${post.id}`}>
                        {wordCount(post.mdxContent).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" data-testid={`badge-post-schema-${post.id}`}>
                          {post.schemaType || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`text-post-date-${post.id}`}>
                        {formatDate(post.publishedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-post-actions-${post.id}`}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem data-testid={`action-edit-${post.id}`} onClick={() => navigate(`/${wsId}/content/posts/${post.id}/edit`)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem data-testid={`action-preview-${post.id}`} onClick={() => handlePreview(post)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem data-testid={`action-duplicate-${post.id}`} onClick={() => handleDuplicate(post)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem data-testid={`action-export-${post.id}`} onClick={() => handleExportMDX(post)}>
                              <FileDown className="w-4 h-4 mr-2" />
                              Export MDX
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" data-testid={`action-delete-${post.id}`} onClick={() => { setDeletePost(post); setDeleteOpen(true); }}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {!isLoading && filtered.length > 0 && (
        <div className="flex items-center justify-between gap-4 flex-wrap" data-testid="pagination-posts">
          <p className="text-sm text-muted-foreground">
            Showing {(safeCurrentPage - 1) * postsPerPage + 1}–{Math.min(safeCurrentPage * postsPerPage, filtered.length)} of {filtered.length} posts
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === safeCurrentPage ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                data-testid={`button-page-${page}`}
              >
                {page}
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
      )}

      <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
        <DialogContent data-testid="dialog-new-post">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-post-title">Title</Label>
              <Input id="new-post-title" placeholder="Post title" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} data-testid="input-new-post-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-post-category">Category</Label>
              <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                <SelectTrigger data-testid="select-new-post-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEO">SEO</SelectItem>
                  <SelectItem value="Technical SEO">Technical SEO</SelectItem>
                  <SelectItem value="Link Building">Link Building</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-post-schema">Schema Type</Label>
              <Select value={newPostSchema} onValueChange={setNewPostSchema}>
                <SelectTrigger data-testid="select-new-post-schema">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Article">Article</SelectItem>
                  <SelectItem value="HowTo">HowTo</SelectItem>
                  <SelectItem value="BlogPosting">BlogPosting</SelectItem>
                  <SelectItem value="FAQPage">FAQPage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-post-content">Content</Label>
              <Textarea id="new-post-content" placeholder="Start writing..." value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} data-testid="input-new-post-content" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPostOpen(false)} data-testid="button-cancel-new-post">Cancel</Button>
            <Button onClick={handleNewPost} disabled={createMutation.isPending} data-testid="button-save-new-post">
              {createMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent data-testid="dialog-bulk-generate">
          <DialogHeader>
            <DialogTitle>Bulk Generate Posts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-topics">Topics (one per line)</Label>
              <Textarea id="bulk-topics" placeholder="Enter topics, one per line..." value={bulkTopics} onChange={(e) => setBulkTopics(e.target.value)} className="min-h-[120px]" data-testid="input-bulk-topics" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulk-category">Category</Label>
              <Select value={bulkCategory} onValueChange={setBulkCategory}>
                <SelectTrigger data-testid="select-bulk-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SEO">SEO</SelectItem>
                  <SelectItem value="Technical SEO">Technical SEO</SelectItem>
                  <SelectItem value="Link Building">Link Building</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)} data-testid="button-cancel-bulk">Cancel</Button>
            <Button onClick={handleBulkGenerate} data-testid="button-start-bulk">Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent data-testid="dialog-preview-post">
          <DialogHeader>
            <DialogTitle>Preview: {previewPost?.title}</DialogTitle>
          </DialogHeader>
          {previewPost && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={statusVariant(previewPost.status)}>{previewPost.status}</Badge>
                <Badge variant="outline">{previewPost.schemaType || "-"}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Category:</span> {previewPost.category || "-"}</div>
                <div><span className="text-muted-foreground">Words:</span> {wordCount(previewPost.mdxContent).toLocaleString()}</div>
                <div><span className="text-muted-foreground">Published:</span> {formatDate(previewPost.publishedAt)}</div>
              </div>
              {previewPost.description && (
                <p className="text-sm text-muted-foreground">{previewPost.description}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)} data-testid="button-close-preview">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-testid="dialog-delete-post">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{deletePost?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-post">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-post">
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
