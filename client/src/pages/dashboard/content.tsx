import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DialogTrigger,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  FileText,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useVenue } from "@/lib/venue-context";
import type { BlogPost, Campaign } from "@shared/schema";

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "published":
      return <Badge className="bg-green-600 dark:bg-green-700 text-white" data-testid={`badge-status-${status}`}><CheckCircle2 className="w-3 h-3 mr-1" />{status}</Badge>;
    case "scheduled":
      return <Badge variant="secondary" data-testid={`badge-status-${status}`}><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
    case "review":
      return <Badge variant="secondary" className="bg-blue-600/10 text-blue-700 dark:text-blue-400" data-testid={`badge-status-${status}`}><Eye className="w-3 h-3 mr-1" />review</Badge>;
    case "rejected":
      return <Badge variant="destructive" data-testid={`badge-status-${status}`}><XCircle className="w-3 h-3 mr-1" />{status}</Badge>;
    default:
      return <Badge variant="outline" data-testid={`badge-status-${status}`}><Pencil className="w-3 h-3 mr-1" />{status}</Badge>;
  }
}

function QualityBadge({ status }: { status: string | null }) {
  if (!status) return null;
  if (status === "passed") return <Badge variant="secondary" className="bg-green-600/10 text-green-700 dark:text-green-400 text-xs">QA Pass</Badge>;
  if (status === "failed") return <Badge variant="destructive" className="text-xs">QA Fail</Badge>;
  return <Badge variant="outline" className="text-xs">{status}</Badge>;
}

function CreatePostDialog({ venueId, campaigns }: { venueId: string; campaigns: Campaign[] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [intent, setIntent] = useState("informational");
  const [funnel, setFunnel] = useState("tofu");
  const [category, setCategory] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/blog-posts", {
        venueId,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        primaryKeyword,
        intent,
        funnel,
        category,
        campaignId: campaignId && campaignId !== "none" ? campaignId : undefined,
        status: "draft",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Post created", description: "Your new post is ready for editing." });
      setOpen(false);
      setTitle("");
      setSlug("");
      setPrimaryKeyword("");
      setIntent("informational");
      setFunnel("tofu");
      setCategory("");
      setCampaignId("");
    },
    onError: (err: Error) => {
      toast({ title: "Error creating post", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-post">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              placeholder="e.g. Best Dentist in Austin TX"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-post-title"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="post-slug">Slug</Label>
            <Input
              id="post-slug"
              placeholder="auto-generated from title"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              data-testid="input-post-slug"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="post-keyword">Primary Keyword</Label>
            <Input
              id="post-keyword"
              placeholder="e.g. dentist austin tx"
              value={primaryKeyword}
              onChange={(e) => setPrimaryKeyword(e.target.value)}
              data-testid="input-post-keyword"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Intent</Label>
              <Select value={intent} onValueChange={setIntent}>
                <SelectTrigger data-testid="select-post-intent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informational">Informational</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="navigational">Navigational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Funnel</Label>
              <Select value={funnel} onValueChange={setFunnel}>
                <SelectTrigger data-testid="select-post-funnel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tofu">Top of Funnel</SelectItem>
                  <SelectItem value="mofu">Mid Funnel</SelectItem>
                  <SelectItem value="bofu">Bottom Funnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="post-category">Category</Label>
            <Input
              id="post-category"
              placeholder="e.g. dental-services"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              data-testid="input-post-category"
            />
          </div>
          {campaigns.length > 0 && (
            <div className="space-y-1.5">
              <Label>Campaign (optional)</Label>
              <Select value={campaignId} onValueChange={setCampaignId}>
                <SelectTrigger data-testid="select-post-campaign">
                  <SelectValue placeholder="No campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No campaign</SelectItem>
                  {campaigns.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name || `Campaign ${c.id.slice(0, 6)}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button
            className="w-full"
            onClick={() => createMutation.mutate()}
            disabled={!title || createMutation.isPending}
            data-testid="button-submit-post"
          >
            {createMutation.isPending ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PostEditor({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  const [mdxContent, setMdxContent] = useState(post.mdxContent || "");
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description || "");
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PUT", `/api/blog-posts/${post.id}`, {
        title,
        description,
        mdxContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Saved", description: "Post content updated." });
    },
    onError: (err: Error) => {
      toast({ title: "Error saving", description: err.message, variant: "destructive" });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/blog-posts/${post.id}/publish-now`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Published", description: "Post is now live." });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "Error publishing", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button variant="ghost" onClick={onClose} data-testid="button-back-to-list">
          Back to list
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            data-testid="button-save-post"
          >
            {saveMutation.isPending ? "Saving..." : "Save Draft"}
          </Button>
          {post.status === "draft" && (
            <Button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              data-testid="button-publish-post"
            >
              <Send className="w-4 h-4 mr-2" />
              {publishMutation.isPending ? "Publishing..." : "Publish"}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="editor-title">Title</Label>
        <Input
          id="editor-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold"
          data-testid="input-editor-title"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="editor-description">Meta Description</Label>
        <Input
          id="editor-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="SEO description for this post..."
          data-testid="input-editor-description"
        />
      </div>

      <Tabs defaultValue="write">
        <TabsList>
          <TabsTrigger value="write" data-testid="tab-write">Write</TabsTrigger>
          <TabsTrigger value="preview" data-testid="tab-preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-3">
          <Textarea
            value={mdxContent}
            onChange={(e) => setMdxContent(e.target.value)}
            placeholder="Write your MDX content here...&#10;&#10;# Heading&#10;&#10;Your content with **bold**, *italic*, and [links](url)."
            className="min-h-[400px] font-mono text-sm"
            data-testid="textarea-mdx-content"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {mdxContent.split(/\s+/).filter(Boolean).length} words
          </p>
        </TabsContent>
        <TabsContent value="preview" className="mt-3">
          <Card className="p-6 min-h-[400px] prose dark:prose-invert max-w-none">
            {mdxContent ? (
              <div className="whitespace-pre-wrap text-sm">{mdxContent}</div>
            ) : (
              <p className="text-muted-foreground">Nothing to preview yet.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-4">
        <h4 className="text-sm font-medium mb-3">Post Details</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground block">Status</span>
            <StatusBadge status={post.status} />
          </div>
          <div>
            <span className="text-muted-foreground block">Keyword</span>
            <span className="font-medium">{post.primaryKeyword || "\u2014"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Intent</span>
            <span className="font-medium capitalize">{post.intent || "\u2014"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block">Funnel</span>
            <span className="font-medium uppercase">{post.funnel || "\u2014"}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ContentEngine() {
  const { selectedVenue } = useVenue();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("createdAt");
  const { toast } = useToast();

  const { data: allPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const posts = (allPosts || []).filter((p) => {
    if (selectedVenue && p.venueId !== selectedVenue.id) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  const venueCampaigns = campaigns.filter((c) => !selectedVenue || c.venueId === selectedVenue.id);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortField === "createdAt") {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
    return 0;
  });

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/blog-posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Deleted", description: "Post removed." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/blog-posts/${id}/publish-now`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ title: "Published" });
    },
  });

  if (editingPost) {
    const freshPost = allPosts?.find((p) => p.id === editingPost.id) || editingPost;
    return <PostEditor post={freshPost} onClose={() => setEditingPost(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Content Engine</h1>
          <p className="text-muted-foreground mt-1">
            Manage and deploy programmatic SEO content
            {selectedVenue && (
              <span className="ml-1">
                for <span className="font-medium text-foreground">{selectedVenue.name}</span>
              </span>
            )}
          </p>
        </div>
        {selectedVenue && (
          <CreatePostDialog venueId={selectedVenue.id} campaigns={venueCampaigns} />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Published", value: published, icon: FileText, color: "text-green-600 dark:text-green-400" },
          { label: "Drafts", value: drafts, icon: FileText, color: "text-yellow-600 dark:text-yellow-400" },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold mt-1" data-testid={`text-content-${m.label.toLowerCase().replace(/\s+/g, '-')}`}>{m.value}</p>
              </div>
              <m.icon className={`w-5 h-5 ${m.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32" data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Select value={sortField} onValueChange={setSortField}>
            <SelectTrigger className="w-32" data-testid="select-sort-field">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground ml-auto">
          {sortedPosts.length} post{sortedPosts.length !== 1 ? "s" : ""}
        </span>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Keyword</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {selectedVenue
                      ? "No posts yet. Create your first post to get started."
                      : "Select a venue to view posts."}
                  </TableCell>
                </TableRow>
              ) : (
                sortedPosts.map((post) => (
                  <TableRow key={post.id} data-testid={`row-post-${post.id}`} className="group">
                    <TableCell>
                      <button
                        className="flex items-center gap-2 max-w-xs text-left hover-elevate rounded-md px-1 -mx-1"
                        onClick={() => setEditingPost(post)}
                        data-testid={`button-edit-post-${post.id}`}
                      >
                        <span className="font-medium text-sm truncate">{post.title}</span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                      </button>
                    </TableCell>
                    <TableCell>
                      {post.primaryKeyword && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          {post.primaryKeyword}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={post.status} />
                    </TableCell>
                    <TableCell>
                      <QualityBadge status={post.qualityGateStatus} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" data-testid={`button-post-menu-${post.id}`}>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingPost(post)} data-testid={`menu-edit-post-${post.id}`}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {post.status === "draft" && (
                            <DropdownMenuItem onClick={() => publishMutation.mutate(post.id)} data-testid={`menu-publish-post-${post.id}`}>
                              <Send className="w-4 h-4 mr-2" />
                              Publish Now
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteMutation.mutate(post.id)}
                            data-testid={`menu-delete-post-${post.id}`}
                          >
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
      </Card>
    </div>
  );
}
