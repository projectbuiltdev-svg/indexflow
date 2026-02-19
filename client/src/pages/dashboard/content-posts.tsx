import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
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
import { Plus, Layers, Search, MoreHorizontal, Pencil, Eye, Copy, FileDown, Trash2 } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";

const initialPosts = [
  {
    id: 1,
    title: "How to Improve Your Local SEO Rankings in 2026",
    category: "SEO",
    status: "Published",
    words: 2450,
    images: 6,
    schema: "Article",
    publishedDate: "2026-02-10",
  },
  {
    id: 2,
    title: "Complete Guide to Technical SEO Audits for Agencies",
    category: "Technical SEO",
    status: "Draft",
    words: 3120,
    images: 8,
    schema: "HowTo",
    publishedDate: null,
  },
  {
    id: 3,
    title: "10 Link Building Strategies That Still Work",
    category: "Link Building",
    status: "Review",
    words: 1890,
    images: 4,
    schema: "Article",
    publishedDate: null,
  },
  {
    id: 4,
    title: "Why Content Marketing Drives Organic Growth",
    category: "Content",
    status: "Published",
    words: 2780,
    images: 5,
    schema: "BlogPosting",
    publishedDate: "2026-01-28",
  },
  {
    id: 5,
    title: "Schema Markup Best Practices for E-Commerce Sites",
    category: "Technical SEO",
    status: "Scheduled",
    words: 2100,
    images: 3,
    schema: "FAQPage",
    publishedDate: "2026-02-20",
  },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Published":
      return "default" as const;
    case "Draft":
      return "secondary" as const;
    case "Review":
      return "outline" as const;
    case "Scheduled":
      return "secondary" as const;
    default:
      return "secondary" as const;
  }
};

type Post = typeof initialPosts[number];

export default function ContentPosts() {
  const { selectedWorkspace } = useWorkspace();
  const { toast } = useToast();
  const [posts, setPosts] = useState(initialPosts);
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

  const [editOpen, setEditOpen] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editSchema, setEditSchema] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePost, setDeletePost] = useState<Post | null>(null);

  const filtered = posts.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (schemaFilter !== "all" && p.schema !== schemaFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const schemas = Array.from(new Set(posts.map((p) => p.schema)));

  const handleNewPost = () => {
    if (!newPostTitle.trim()) return;
    const newId = Math.max(...posts.map((p) => p.id), 0) + 1;
    setPosts([
      ...posts,
      {
        id: newId,
        title: newPostTitle,
        category: newPostCategory,
        status: "Draft",
        words: 0,
        images: 0,
        schema: newPostSchema,
        publishedDate: null,
      },
    ]);
    setNewPostOpen(false);
    setNewPostTitle("");
    setNewPostCategory("SEO");
    setNewPostSchema("Article");
    setNewPostContent("");
    toast({ title: "Post created", description: `"${newPostTitle}" has been created as a draft.` });
  };

  const handleBulkGenerate = () => {
    const topics = bulkTopics.split("\n").filter((t) => t.trim());
    if (topics.length === 0) return;
    const maxId = Math.max(...posts.map((p) => p.id), 0);
    const newPosts = topics.map((topic, i) => ({
      id: maxId + i + 1,
      title: topic.trim(),
      category: bulkCategory,
      status: "Draft" as const,
      words: 0,
      images: 0,
      schema: "Article",
      publishedDate: null,
    }));
    setPosts([...posts, ...newPosts]);
    setBulkOpen(false);
    setBulkTopics("");
    setBulkCategory("SEO");
    toast({ title: "Bulk generation started", description: `${topics.length} posts have been queued.` });
  };

  const handleEdit = (post: Post) => {
    setEditPost(post);
    setEditTitle(post.title);
    setEditCategory(post.category);
    setEditSchema(post.schema);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editPost || !editTitle.trim()) return;
    setPosts(posts.map((p) => (p.id === editPost.id ? { ...p, title: editTitle, category: editCategory, schema: editSchema } : p)));
    setEditOpen(false);
    setEditPost(null);
    toast({ title: "Post updated", description: `"${editTitle}" has been saved.` });
  };

  const handlePreview = (post: Post) => {
    setPreviewPost(post);
    setPreviewOpen(true);
  };

  const handleDuplicate = (post: Post) => {
    const newId = Math.max(...posts.map((p) => p.id), 0) + 1;
    setPosts([...posts, { ...post, id: newId, title: `${post.title} (Copy)`, status: "Draft", publishedDate: null }]);
    toast({ title: "Post duplicated", description: `A copy of "${post.title}" has been created.` });
  };

  const handleExportMDX = (post: Post) => {
    toast({ title: "MDX exported", description: `"${post.title}" has been exported as MDX.` });
  };

  const handleDeleteConfirm = () => {
    if (!deletePost) return;
    setPosts(posts.filter((p) => p.id !== deletePost.id));
    const title = deletePost.title;
    setDeleteOpen(false);
    setDeletePost(null);
    toast({ title: "Post deleted", description: `"${title}" has been removed.` });
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
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Review">Review</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
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
              {filtered.map((post) => (
                <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                  <TableCell className="font-medium max-w-[300px] truncate" data-testid={`text-post-title-${post.id}`}>
                    {post.title}
                  </TableCell>
                  <TableCell data-testid={`text-post-category-${post.id}`}>{post.category}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(post.status)} data-testid={`badge-post-status-${post.id}`}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" data-testid={`text-post-words-${post.id}`}>
                    {post.words.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right" data-testid={`text-post-images-${post.id}`}>
                    {post.images}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" data-testid={`badge-post-schema-${post.id}`}>
                      {post.schema}
                    </Badge>
                  </TableCell>
                  <TableCell data-testid={`text-post-date-${post.id}`}>
                    {post.publishedDate || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-post-actions-${post.id}`}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem data-testid={`action-edit-${post.id}`} onClick={() => handleEdit(post)}>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
            <Button onClick={handleNewPost} data-testid="button-save-new-post">Save</Button>
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-testid="dialog-edit-post">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-post-title">Title</Label>
              <Input id="edit-post-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} data-testid="input-edit-post-title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-post-category">Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger data-testid="select-edit-post-category">
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
              <Label htmlFor="edit-post-schema">Schema Type</Label>
              <Select value={editSchema} onValueChange={setEditSchema}>
                <SelectTrigger data-testid="select-edit-post-schema">
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-post">Cancel</Button>
            <Button onClick={handleEditSave} data-testid="button-save-edit-post">Save</Button>
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
                <Badge variant="outline">{previewPost.schema}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Category:</span> {previewPost.category}</div>
                <div><span className="text-muted-foreground">Words:</span> {previewPost.words.toLocaleString()}</div>
                <div><span className="text-muted-foreground">Images:</span> {previewPost.images}</div>
                <div><span className="text-muted-foreground">Published:</span> {previewPost.publishedDate || "Not published"}</div>
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
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{deletePost?.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-post">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} data-testid="button-confirm-delete-post">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
