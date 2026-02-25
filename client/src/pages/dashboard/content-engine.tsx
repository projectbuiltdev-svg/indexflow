import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWorkspace } from "@/lib/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  DialogDescription,
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
  Plus, Search, MoreHorizontal, Pencil, Eye, Trash2,
  Globe, X, Download, FileText, Clock,
  DollarSign, AlertTriangle, ArrowLeft, Sparkles,
  ExternalLink, Image, Link as LinkIcon, Key,
  HelpCircle, Maximize2, Tag, Calendar, Save,
  BarChart3, Activity, FileDown, Upload, ChevronDown,
} from "lucide-react";

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
  const [view, setView] = useState<"list" | "editor">("list");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [bulkRows, setBulkRows] = useState([{ title: "", keyword: "", intent: "Informational", funnel: "TOFU", type: "Standard" }]);

  const handleDownloadTemplate = () => {
    const csv = "Title,Primary Keyword,Intent,Funnel,Type\nExample Post Title,target keyword,Informational,TOFU,Standard\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-posts-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadCSV = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const lines = text.split("\n").filter(l => l.trim());
        if (lines.length < 2) {
          toast({ title: "Empty CSV", description: "No data rows found", variant: "destructive" });
          return;
        }
        const rows = lines.slice(1).map(line => {
          const cols = line.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
          return {
            title: cols[0] || "",
            keyword: cols[1] || "",
            intent: cols[2] || "Informational",
            funnel: cols[3] || "TOFU",
            type: cols[4] || "Standard",
          };
        }).filter(r => r.title);
        if (rows.length === 0) {
          toast({ title: "No valid rows", description: "CSV rows need at least a title", variant: "destructive" });
          return;
        }
        setBulkRows(rows);
        toast({ title: `Loaded ${rows.length} rows from CSV` });
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const [editorTitle, setEditorTitle] = useState("");
  const [editorSlug, setEditorSlug] = useState("");
  const [editorCategory, setEditorCategory] = useState("");
  const [editorType, setEditorType] = useState("Standard Article");
  const [editorDescription, setEditorDescription] = useState("");
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [editorTagInput, setEditorTagInput] = useState("");
  const [editorScheduleDate, setEditorScheduleDate] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorSubTab, setEditorSubTab] = useState<"editor" | "images">("editor");
  const [editorPreviewMode, setEditorPreviewMode] = useState<"html" | "preview">("preview");

  const queryKey = `/api/admin/blog/posts?workspaceId=${workspaceId}`;
  const { data: posts = [], isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/blog/posts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setView("list");
      toast({ title: "Post created" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/blog/posts/${id}/publish-now`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setView("list");
      toast({ title: "Post published" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/blog/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Post deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const bulkMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/blog/posts/bulk/create", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setBulkOpen(false);
      setBulkRows([{ title: "", keyword: "", intent: "Informational", funnel: "TOFU", type: "Standard" }]);
      toast({ title: "Drafts created" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const openNewPost = () => {
    setSelectedPost(null);
    setEditorTitle("");
    setEditorSlug("");
    setEditorCategory("");
    setEditorType("Standard Article");
    setEditorDescription("");
    setEditorTags([]);
    setEditorTagInput("");
    setEditorScheduleDate("");
    setEditorContent("");
    setEditorSubTab("editor");
    setView("editor");
  };

  const openEditPost = (post: any) => {
    setSelectedPost(post);
    setEditorTitle(post.title || "");
    setEditorSlug(post.slug || "");
    setEditorCategory(post.category || "");
    setEditorType(post.schemaType || "Standard Article");
    setEditorDescription(post.description || "");
    setEditorTags(post.tags || []);
    setEditorContent(post.mdxContent || "");
    setEditorSubTab("editor");
    setView("editor");
  };

  const handleTagKeyDown = (e: any) => {
    if (e.key === "Enter" && editorTagInput.trim()) {
      e.preventDefault();
      setEditorTags([...editorTags, editorTagInput.trim()]);
      setEditorTagInput("");
    }
  };

  const handleSaveDraft = () => {
    if (!editorTitle.trim()) return;
    const data: any = {
      workspaceId,
      title: editorTitle,
      slug: editorSlug || editorTitle.toLowerCase().replace(/\s+/g, "-"),
      category: editorCategory,
      schemaType: editorType,
      description: editorDescription,
      tags: editorTags,
      mdxContent: editorContent,
      status: "draft",
    };
    if (selectedPost) {
      apiRequest("PUT", `/api/admin/blog/posts/${selectedPost.id}`, data)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
          setView("list");
          toast({ title: "Draft saved" });
        });
    } else {
      createMutation.mutate(data);
    }
  };

  const handlePublishNow = () => {
    if (selectedPost) {
      publishMutation.mutate(selectedPost.id);
    } else if (editorTitle.trim()) {
      const data = {
        workspaceId,
        title: editorTitle,
        slug: editorSlug || editorTitle.toLowerCase().replace(/\s+/g, "-"),
        category: editorCategory,
        schemaType: editorType,
        description: editorDescription,
        tags: editorTags,
        mdxContent: editorContent,
        status: "published",
      };
      createMutation.mutate(data);
    }
  };

  if (view === "editor") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setView("list")} data-testid="button-back-to-posts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft} data-testid="button-save-draft">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handlePublishNow} data-testid="button-publish-now">
              Publish Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <Input placeholder="Post title" value={editorTitle} onChange={(e) => setEditorTitle(e.target.value)} data-testid="input-post-title" />
          <Input placeholder="url-slug" value={editorSlug} onChange={(e) => setEditorSlug(e.target.value)} data-testid="input-post-slug" />
          <Select value={editorCategory} onValueChange={setEditorCategory}>
            <SelectTrigger data-testid="select-post-category"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="seo">SEO</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
            </SelectContent>
          </Select>
          <Select value={editorType} onValueChange={setEditorType}>
            <SelectTrigger data-testid="select-post-type"><SelectValue placeholder="Standard Article" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard Article">Standard Article</SelectItem>
              <SelectItem value="How-To Guide">How-To Guide</SelectItem>
              <SelectItem value="Listicle">Listicle</SelectItem>
              <SelectItem value="Case Study">Case Study</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Input placeholder="Short description" value={editorDescription} onChange={(e) => setEditorDescription(e.target.value)} className="mb-4" data-testid="input-post-description" />

        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1 flex-wrap">
            {editorTags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setEditorTags(editorTags.filter((_, idx) => idx !== i))} />
              </Badge>
            ))}
            <Input
              placeholder="Add tag + Enter"
              value={editorTagInput}
              onChange={(e) => setEditorTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="w-40 h-7 border-dashed"
              data-testid="input-post-tag"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input type="date" value={editorScheduleDate} onChange={(e) => setEditorScheduleDate(e.target.value)} className="w-48" data-testid="input-post-schedule" />
          </div>
          <Button variant="outline" size="sm" disabled={!editorScheduleDate} data-testid="button-schedule">
            <Clock className="h-4 w-4 mr-1" />
            Schedule
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Button
            variant={editorSubTab === "editor" ? "default" : "outline"}
            size="sm"
            onClick={() => setEditorSubTab("editor")}
            data-testid="button-editor-preview-tab"
          >
            <FileText className="h-4 w-4 mr-1" />
            Editor + Preview
          </Button>
          <Button
            variant={editorSubTab === "images" ? "default" : "outline"}
            size="sm"
            onClick={() => setEditorSubTab("images")}
            data-testid="button-images-tab"
          >
            <Image className="h-4 w-4 mr-1" />
            Images
          </Button>
        </div>

        {editorSubTab === "editor" ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">MDX Editor</span>
                <Button variant="ghost" size="icon" data-testid="button-fullscreen-editor"><Maximize2 className="h-4 w-4" /></Button>
              </div>
              <Textarea
                placeholder="Write your MDX content here..."
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                data-testid="textarea-mdx-editor"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
                <div className="flex items-center gap-2">
                  <Select value={editorPreviewMode} onValueChange={(v: any) => setEditorPreviewMode(v)}>
                    <SelectTrigger className="h-7 w-28" data-testid="select-preview-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preview">Preview</SelectItem>
                      <SelectItem value="html">Raw HTML</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" data-testid="button-fullscreen-preview"><Maximize2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <Card className="min-h-[400px]">
                <CardContent className="p-4">
                  {editorContent ? (
                    <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap">{editorContent}</div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Preview will appear here...</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="min-h-[400px]">
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
              <Image className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Drag and drop images or click to upload</p>
              <Button variant="outline" className="mt-3" data-testid="button-upload-image">Upload Images</Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const validBulkRows = bulkRows.filter(r => r.title.trim());

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif italic font-semibold" data-testid="text-posts-title">Posts</h2>
          <p className="text-sm text-muted-foreground" data-testid="text-posts-count">{posts.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setBulkOpen(true)} data-testid="button-bulk-generate">
            <Sparkles className="h-4 w-4 mr-2" />
            Bulk Generate
          </Button>
          <Button onClick={openNewPost} data-testid="button-new-post">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card><CardContent className="p-8"><div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}</div></CardContent></Card>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1" data-testid="text-no-posts">No posts yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Create a post manually or use bulk generate to get started.</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setBulkOpen(true)} data-testid="button-empty-bulk">
                <Sparkles className="h-4 w-4 mr-2" />
                Bulk Generate
              </Button>
              <Button onClick={openNewPost} data-testid="button-empty-new-post">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post: any) => (
                <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell><Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status || "draft"}</Badge></TableCell>
                  <TableCell>{post.category || "—"}</TableCell>
                  <TableCell>{post.schemaType || "Article"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "—"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-post-menu-${post.id}`}><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditPost(post)}><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteMutation.mutate(post.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif italic" data-testid="text-bulk-title">Bulk Generate Blog Drafts</DialogTitle>
            <DialogDescription>Add rows to generate multiple draft posts at once.</DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Primary Keyword</TableHead>
                  <TableHead>Intent</TableHead>
                  <TableHead>Funnel</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bulkRows.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Input
                        placeholder="Post title"
                        value={row.title}
                        onChange={(e) => { const r = [...bulkRows]; r[idx].title = e.target.value; setBulkRows(r); }}
                        data-testid={`input-bulk-title-${idx}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Target keyword"
                        value={row.keyword}
                        onChange={(e) => { const r = [...bulkRows]; r[idx].keyword = e.target.value; setBulkRows(r); }}
                        data-testid={`input-bulk-keyword-${idx}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Select value={row.intent} onValueChange={(v) => { const r = [...bulkRows]; r[idx].intent = v; setBulkRows(r); }}>
                        <SelectTrigger data-testid={`select-bulk-intent-${idx}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Informational">Informational</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Transactional">Transactional</SelectItem>
                          <SelectItem value="Navigational">Navigational</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={row.funnel} onValueChange={(v) => { const r = [...bulkRows]; r[idx].funnel = v; setBulkRows(r); }}>
                        <SelectTrigger data-testid={`select-bulk-funnel-${idx}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TOFU">TOFU</SelectItem>
                          <SelectItem value="MOFU">MOFU</SelectItem>
                          <SelectItem value="BOFU">BOFU</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select value={row.type} onValueChange={(v) => { const r = [...bulkRows]; r[idx].type = v; setBulkRows(r); }}>
                        <SelectTrigger data-testid={`select-bulk-type-${idx}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="How-To">How-To</SelectItem>
                          <SelectItem value="Listicle">Listicle</SelectItem>
                          <SelectItem value="Pillar">Pillar</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setBulkRows(bulkRows.filter((_, i) => i !== idx))} data-testid={`button-remove-bulk-row-${idx}`}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setBulkRows([...bulkRows, { title: "", keyword: "", intent: "Informational", funnel: "TOFU", type: "Standard" }])} data-testid="button-add-row">
              <Plus className="h-4 w-4 mr-1" />
              Add Row
            </Button>
            <Button variant="outline" size="sm" onClick={handleUploadCSV} data-testid="button-upload-csv">
              <Upload className="h-4 w-4 mr-1" />
              Upload CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} data-testid="button-download-template">
              <Download className="h-4 w-4 mr-1" />
              Download Template
            </Button>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={() => setBulkOpen(false)} data-testid="button-cancel-bulk">Cancel</Button>
            <Button
              onClick={() => bulkMutation.mutate({ posts: validBulkRows.map(r => ({ workspaceId, title: r.title, primaryKeyword: r.keyword, intent: r.intent, funnel: r.funnel, schemaType: r.type, status: "draft" })) })}
              disabled={validBulkRows.length === 0 || bulkMutation.isPending}
              data-testid="button-create-drafts"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create {validBulkRows.length} Drafts
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PagesTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [crawlOpen, setCrawlOpen] = useState(false);
  const [crawlUrl, setCrawlUrl] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formKeywords, setFormKeywords] = useState("");
  const [formType, setFormType] = useState("Page");
  const [formPriority, setFormPriority] = useState("5");

  const queryKey = `/api/admin/blog/pages/${workspaceId}`;
  const { data: pages = [], isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/blog/pages", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setAddOpen(false);
      setFormUrl(""); setFormTitle(""); setFormKeywords(""); setFormType("Page"); setFormPriority("5");
      toast({ title: "Page added" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const auditMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/admin/blog/pages/audit-all`, { workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Audit complete" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const crawlMutation = useMutation({
    mutationFn: (url: string) => apiRequest("POST", "/api/admin/blog/pages/crawl", { workspaceId, sitemapUrl: url }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setCrawlOpen(false);
      setCrawlUrl("");
      toast({ title: "Crawl complete" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif italic font-semibold" data-testid="text-pages-title">Pages</h2>
          <p className="text-sm text-muted-foreground">Manage and audit on-page SEO for your website pages.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setCrawlOpen(true)} data-testid="button-crawl-sitemap">
            <Globe className="h-4 w-4 mr-2" />
            Crawl Sitemap
          </Button>
          <Button variant="outline" onClick={() => auditMutation.mutate()} disabled={auditMutation.isPending} data-testid="button-audit-all">
            <Activity className="h-4 w-4 mr-2" />
            Audit All
          </Button>
          <Button onClick={() => setAddOpen(true)} data-testid="button-add-page">
            <Plus className="h-4 w-4 mr-2" />
            Add Page
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card><CardContent className="p-8"><div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}</div></CardContent></Card>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1" data-testid="text-no-pages">No pages tracked yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Add pages manually or crawl your sitemap to get started.</p>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setCrawlOpen(true)} data-testid="button-empty-crawl">
                <Globe className="h-4 w-4 mr-2" />
                Crawl Sitemap
              </Button>
              <Button onClick={() => setAddOpen(true)} data-testid="button-empty-add-page">
                <Plus className="h-4 w-4 mr-2" />
                Add Page
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>SEO Score</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page: any) => (
                <TableRow key={page.id} data-testid={`row-page-${page.id}`}>
                  <TableCell className="font-medium">{page.url}</TableCell>
                  <TableCell>{page.title || "—"}</TableCell>
                  <TableCell>{page.seoScore != null ? <Badge variant={page.seoScore >= 80 ? "default" : "secondary"}>{page.seoScore}</Badge> : "—"}</TableCell>
                  <TableCell>{page.type || "Page"}</TableCell>
                  <TableCell>{page.priority || "5"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <Dialog open={crawlOpen} onOpenChange={setCrawlOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle data-testid="text-crawl-title">Crawl Sitemap</DialogTitle>
            <DialogDescription>Enter a sitemap URL to discover pages.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Sitemap URL</Label>
              <Input placeholder="https://example.com/sitemap.xml" value={crawlUrl} onChange={(e) => setCrawlUrl(e.target.value)} data-testid="input-crawl-url" />
            </div>
            <Button className="w-full" onClick={() => crawlMutation.mutate(crawlUrl)} disabled={!crawlUrl.trim() || crawlMutation.isPending} data-testid="button-crawl-submit">
              <Globe className="h-4 w-4 mr-2" />
              Crawl
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle data-testid="text-add-page-title">Add Page</DialogTitle>
            <DialogDescription>Add a page to track for SEO.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>URL</Label>
              <Input placeholder="https://example.com/page" value={formUrl} onChange={(e) => setFormUrl(e.target.value)} data-testid="input-page-url" />
            </div>
            <div>
              <Label>Title</Label>
              <Input placeholder="Page title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} data-testid="input-page-title" />
            </div>
            <div>
              <Label>Target Keywords (comma-separated)</Label>
              <Textarea placeholder="keyword 1, keyword 2, keyword 3" value={formKeywords} onChange={(e) => setFormKeywords(e.target.value)} data-testid="input-page-keywords" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Page Type</Label>
                <Select value={formType} onValueChange={setFormType}>
                  <SelectTrigger data-testid="select-page-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Page">Page</SelectItem>
                    <SelectItem value="Post">Post</SelectItem>
                    <SelectItem value="Landing">Landing</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority (1-10)</Label>
                <Input type="number" min="1" max="10" value={formPriority} onChange={(e) => setFormPriority(e.target.value)} data-testid="input-page-priority" />
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => createMutation.mutate({ workspaceId, url: formUrl, title: formTitle, keywords: formKeywords, type: formType, priority: parseInt(formPriority) || 5 })}
              disabled={!formUrl.trim() || createMutation.isPending}
              data-testid="button-add-page-submit"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CampaignsTab({ workspaceId }: { workspaceId: string }) {
  const queryKey = `/api/admin/blog/campaigns/${workspaceId}`;
  const { data: campaigns = [], isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-serif italic font-semibold" data-testid="text-campaigns-title">Campaign History</h2>
        <p className="text-sm text-muted-foreground">Browse past bulk generation campaigns</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}</div>
      ) : campaigns.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8" data-testid="text-no-campaigns">No bulk campaigns yet</p>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c: any) => (
            <Card key={c.id} data-testid={`card-campaign-${c.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.name || `Campaign #${c.id}`}</p>
                    <p className="text-sm text-muted-foreground">{c.postsCount || 0} posts &middot; {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}</p>
                  </div>
                  <Badge variant={c.status === "completed" ? "default" : "secondary"}>{c.status || "pending"}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function DomainsTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [domainInput, setDomainInput] = useState("");

  const queryKey = `/api/admin/blog/domains?workspaceId=${workspaceId}`;
  const { data: domains = [], isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  const addMutation = useMutation({
    mutationFn: (domain: string) => apiRequest("POST", "/api/admin/blog/domains", { workspaceId, domain }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDomainInput("");
      toast({ title: "Domain added" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/blog/domains/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Domain removed" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-serif italic" data-testid="text-domains-title">
            <Globe className="h-5 w-5" />
            Domain Mapping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Input
              placeholder="example.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              className="flex-1"
              data-testid="input-domain"
            />
            <Button
              onClick={() => addMutation.mutate(domainInput)}
              disabled={!domainInput.trim() || addMutation.isPending}
              data-testid="button-add-domain"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {domains.length === 0 ? (
            <p className="text-sm text-muted-foreground" data-testid="text-no-domains">No domains mapped. Add a domain to enable the public blog API for this workspace.</p>
          ) : (
            <div className="space-y-2">
              {domains.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between p-3 border rounded-md" data-testid={`row-domain-${d.id}`}>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{d.domain}</span>
                    {d.verified && <Badge variant="default">Verified</Badge>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(d.id)} data-testid={`button-remove-domain-${d.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SeoTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [destUrl, setDestUrl] = useState("");
  const [brandTerms, setBrandTerms] = useState("");
  const [maxInternal, setMaxInternal] = useState("4");
  const [maxExternal, setMaxExternal] = useState("2");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");

  const { data: profile } = useQuery<any>({ queryKey: [`/api/admin/seo/profile/${workspaceId}`] });

  const loaded = profile && destUrl === "" && profile.siteUrl;
  if (loaded) {
    setDestUrl(profile.siteUrl || "");
  }

  const saveMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", `/api/admin/seo/profile`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/seo/profile/${workspaceId}`] });
      toast({ title: "Profile saved" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-serif italic font-semibold" data-testid="text-seo-title">Site Profile</h2>
        <p className="text-sm text-muted-foreground">Configure the client's website for auto-linking and SEO optimization</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Destination URL</Label>
              <Input placeholder="https://example.com" value={destUrl} onChange={(e) => setDestUrl(e.target.value)} data-testid="input-dest-url" />
            </div>
            <div>
              <Label>Brand Terms (comma-separated)</Label>
              <Input placeholder="indexFlow, Your Brand" value={brandTerms} onChange={(e) => setBrandTerms(e.target.value)} data-testid="input-brand-terms" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div>
              <Label>Max Internal Links</Label>
              <Input type="number" value={maxInternal} onChange={(e) => setMaxInternal(e.target.value)} data-testid="input-max-internal" />
            </div>
            <div>
              <Label>Max External Links</Label>
              <Input type="number" value={maxExternal} onChange={(e) => setMaxExternal(e.target.value)} data-testid="input-max-external" />
            </div>
            <div>
              <Label>CTA Text</Label>
              <Input placeholder="Get started today" value={ctaText} onChange={(e) => setCtaText(e.target.value)} data-testid="input-cta-text" />
            </div>
            <div>
              <Label>CTA Page URL</Label>
              <Input placeholder="/contact" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} data-testid="input-cta-url" />
            </div>
          </div>
          <Button
            onClick={() => saveMutation.mutate({ workspaceId, destinationUrl: destUrl, brandTerms, maxInternalLinks: parseInt(maxInternal), maxExternalLinks: parseInt(maxExternal), ctaText, ctaUrl })}
            disabled={saveMutation.isPending}
            data-testid="button-create-profile"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function LinksTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();

  const { data: suggestions = [] } = useQuery<any[]>({ queryKey: [`/api/admin/blog/links/suggestions?workspaceId=${workspaceId}`] });

  const indexMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/admin/blog/links/index-keywords`, { workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/blog/links/suggestions?workspaceId=${workspaceId}`] });
      toast({ title: "Keywords indexed" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const autoLinkMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/admin/blog/links/auto-link`, { workspaceId }),
    onSuccess: () => toast({ title: "Auto-linking complete" }),
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const validateMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/admin/blog/links/validate-all`, { workspaceId }),
    onSuccess: () => toast({ title: "Validation complete" }),
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const applyMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/blog/links/apply/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/blog/links/suggestions?workspaceId=${workspaceId}`] });
      toast({ title: "Link applied" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-serif italic font-semibold" data-testid="text-links-title">Link Builder</h2>
        <p className="text-sm text-muted-foreground">Build cross-post internal links and validate SEO attributes</p>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Button variant="outline" onClick={() => indexMutation.mutate()} disabled={indexMutation.isPending} data-testid="button-index-keywords">
          <Search className="h-4 w-4 mr-2" />
          Index Keywords
        </Button>
        <Button variant="outline" onClick={() => autoLinkMutation.mutate()} disabled={autoLinkMutation.isPending} data-testid="button-bulk-auto-link">
          <LinkIcon className="h-4 w-4 mr-2" />
          Bulk Auto-Link
        </Button>
        <Button variant="outline" onClick={() => validateMutation.mutate()} disabled={validateMutation.isPending} data-testid="button-validate-all-posts">
          <Activity className="h-4 w-4 mr-2" />
          Validate All Posts
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-serif italic font-semibold mb-1" data-testid="text-link-suggestions">Link Suggestions</h3>
        <p className="text-sm text-muted-foreground mb-4">Keywords found in posts that can link to other posts. Run "Index Keywords" first to generate suggestions.</p>

        {suggestions.length === 0 ? (
          <Card>
            <CardContent className="py-12 flex flex-col items-center justify-center">
              <LinkIcon className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No link suggestions available. Index keywords to generate suggestions.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Source Post</TableHead>
                  <TableHead>Target Post</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.keyword}</TableCell>
                    <TableCell>{s.sourceTitle}</TableCell>
                    <TableCell>{s.targetTitle}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => applyMutation.mutate(s.id)} disabled={applyMutation.isPending} data-testid={`button-apply-link-${s.id}`}>Apply</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
}

function HealthTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const { data: orphans = [] } = useQuery<any[]>({ queryKey: [`/api/admin/blog/links/orphans?workspaceId=${workspaceId}`] });

  const healthMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/admin/blog/links/check-health`, { workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/blog/links/orphans?workspaceId=${workspaceId}`] });
      toast({ title: "Health check complete" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-serif italic font-semibold" data-testid="text-health-title">Link Health</h2>
        <p className="text-sm text-muted-foreground">Identify orphan posts and check for broken links</p>
      </div>

      <div className="mb-8">
        <Button variant="outline" onClick={() => healthMutation.mutate()} disabled={healthMutation.isPending} data-testid="button-check-link-health">
          <Activity className="h-4 w-4 mr-2" />
          Check Link Health
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-serif italic font-semibold mb-1" data-testid="text-orphan-report">Orphan Report</h3>
        <p className="text-sm text-muted-foreground mb-4">Posts sorted by inbound link count. Orphan posts (0 inbound) may not be discoverable by search engines.</p>

        {orphans.length === 0 ? (
          <Card>
            <CardContent className="py-12 flex flex-col items-center justify-center">
              <Activity className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground" data-testid="text-no-orphans">No posts to analyze yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Inbound Links</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orphans.map((o: any) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.title}</TableCell>
                    <TableCell>{o.inboundCount || 0}</TableCell>
                    <TableCell>
                      <Badge variant={(o.inboundCount || 0) === 0 ? "destructive" : "default"}>
                        {(o.inboundCount || 0) === 0 ? "Orphan" : "OK"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
}

function CmsTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [platform, setPlatform] = useState("WordPress");
  const [apiLabel, setApiLabel] = useState("");

  const { data: apiKeys = [] } = useQuery<any[]>({ queryKey: [`/api/admin/cms/api-keys?workspaceId=${workspaceId}`] });
  const { data: syncHistory = [] } = useQuery<any[]>({ queryKey: [`/api/admin/cms/sync-logs?workspaceId=${workspaceId}`] });

  const generateKeyMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/cms/generate-key", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/cms/api-keys?workspaceId=${workspaceId}`] });
      setApiLabel("");
      toast({ title: "API key generated" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const plugins: { id: string; name: string; desc: string; status: "available" | "coming_soon" | "api_only"; steps?: string[] }[] = [
    { id: "wordpress", name: "WordPress", desc: "Auto-publish posts via REST API. Generate an API key above, then add your WordPress site URL and credentials in Settings.", status: "available", steps: ["Generate an API key above", "Go to WordPress > Settings > REST API", "Add your indexFlow API key", "Enable auto-sync in CMS settings"] },
    { id: "webflow", name: "Webflow", desc: "Push content to Webflow CMS collections via their REST API. Requires a Webflow API token.", status: "api_only", steps: ["Generate an API key above", "Get your Webflow API token from webflow.com", "Add both keys in your connection settings"] },
    { id: "shopify", name: "Shopify", desc: "Sync blog posts to your Shopify store blog. Uses Shopify Admin API.", status: "api_only", steps: ["Generate an API key above", "Create a Shopify private app with Blog access", "Add your Shopify API credentials in settings"] },
    { id: "ghost", name: "Ghost", desc: "Publish directly to Ghost CMS via the Admin API. Requires a Ghost Admin API key.", status: "api_only", steps: ["Generate an API key above", "Go to Ghost Admin > Integrations > Custom", "Copy your Admin API key", "Add it in your connection settings"] },
    { id: "wix", name: "Wix", desc: "Push content to Wix blog via their REST API. Requires a Wix API key.", status: "api_only", steps: ["Generate an API key above", "Get your Wix API key from dev.wix.com", "Add both keys in your connection settings"] },
  ];
  const [expandedPlugin, setExpandedPlugin] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-serif italic font-semibold" data-testid="text-cms-title">CMS Integrations</h2>
        <p className="text-sm text-muted-foreground">Connect your Content Engine to external CMS platforms</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base" data-testid="text-generate-key">Generate API Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="w-36" data-testid="select-platform"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WordPress">WordPress</SelectItem>
                  <SelectItem value="Webflow">Webflow</SelectItem>
                  <SelectItem value="Shopify">Shopify</SelectItem>
                  <SelectItem value="Ghost">Ghost</SelectItem>
                  <SelectItem value="Wix">Wix</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Label (optional)</Label>
              <Input placeholder="e.g. Production WordPress" value={apiLabel} onChange={(e) => setApiLabel(e.target.value)} data-testid="input-api-label" />
            </div>
            <div className="pt-5">
              <Button onClick={() => generateKeyMutation.mutate({ workspaceId, platform, label: apiLabel })} disabled={generateKeyMutation.isPending} data-testid="button-generate-key">
                <Key className="h-4 w-4 mr-2" />
                Generate Key
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base" data-testid="text-active-keys">Active API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <p className="text-sm text-muted-foreground">No API keys yet. Generate one above to get started.</p>
          ) : (
            <div className="space-y-2">
              {apiKeys.map((k: any) => (
                <div key={k.id} className="flex items-center justify-between p-3 border rounded-md" data-testid={`row-api-key-${k.id}`}>
                  <div>
                    <span className="font-medium">{k.label || k.platform}</span>
                    <span className="text-sm text-muted-foreground ml-2">{k.platform}</span>
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{k.key?.substring(0, 12)}...</code>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base" data-testid="text-download-plugins">CMS Connectors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {plugins.map((p) => (
              <div key={p.id} className="border rounded-md" data-testid={`plugin-${p.id}`}>
                <div className="flex items-center justify-between p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{p.name}</p>
                      {p.status === "available" ? (
                        <Badge variant="default" className="text-[10px]">Ready</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">API Setup</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedPlugin(expandedPlugin === p.id ? null : p.id)}
                    data-testid={`button-plugin-${p.id}`}
                  >
                    {expandedPlugin === p.id ? <X className="h-3 w-3 mr-1" /> : <HelpCircle className="h-3 w-3 mr-1" />}
                    {expandedPlugin === p.id ? "Close" : "Setup Guide"}
                  </Button>
                </div>
                {expandedPlugin === p.id && p.steps && (
                  <div className="px-3 pb-3 border-t pt-3">
                    <p className="text-xs font-medium mb-2">Setup Steps:</p>
                    <ol className="space-y-1.5">
                      {p.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted text-foreground flex items-center justify-center text-[10px] font-medium">{i + 1}</span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base" data-testid="text-sync-history">Sync History</CardTitle>
        </CardHeader>
        <CardContent>
          {syncHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sync activity yet.</p>
          ) : (
            <div className="space-y-2">
              {syncHistory.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <span className="font-medium text-sm">{s.platform}</span>
                    <span className="text-xs text-muted-foreground ml-2">{s.postsCount} posts</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.createdAt ? new Date(s.createdAt).toLocaleString() : ""}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReportsTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const { data: stats } = useQuery<any>({ queryKey: [`/api/admin/reports/content-stats?workspaceId=${workspaceId}`] });
  const { data: savedReports = [] } = useQuery<any[]>({ queryKey: [`/api/admin/reports/saved?workspaceId=${workspaceId}`] });

  const snapshotMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/reports/snapshot", { workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/reports/saved?workspaceId=${workspaceId}`] });
      toast({ title: "Snapshot saved" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const s = stats || {};

  const contentCards = [
    { label: "Total Posts", value: s.totalPosts || 0, icon: FileText },
    { label: "Published", value: s.published || 0, icon: FileText },
    { label: "Draft", value: s.draft || 0, icon: FileText },
    { label: "Avg Words/Post", value: s.avgWords || 0, icon: BarChart3 },
    { label: "Total Images", value: s.totalImages || 0, icon: Image },
    { label: "Schema Coverage", value: `${s.schemaCoverage || 0}%`, icon: ExternalLink },
  ];

  const seoCards = [
    { label: "Pages Audited", value: s.pagesAudited || 0, icon: Globe },
    { label: "Avg SEO Score", value: s.avgSeoScore || 0, icon: BarChart3, badge: true },
    { label: "High (80+)", value: s.highScore || 0, icon: Activity },
    { label: "Medium (50-79)", value: s.mediumScore || 0, icon: AlertTriangle },
    { label: "Low (<50)", value: s.lowScore || 0, icon: AlertTriangle },
  ];

  const invoiceCards = [
    { label: "Total Invoices", value: s.totalInvoices || 0, icon: FileText },
    { label: "Revenue", value: `$${(s.revenue || 0).toFixed(2)}`, icon: DollarSign },
    { label: "Outstanding", value: `$${(s.outstanding || 0).toFixed(2)}`, icon: Clock },
    { label: "Overdue", value: s.overdue || 0, icon: AlertTriangle },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif italic font-semibold" data-testid="text-reports-title">Reports</h2>
          <p className="text-sm text-muted-foreground">Content, SEO, and invoice analytics</p>
        </div>
        <Button onClick={() => snapshotMutation.mutate()} disabled={snapshotMutation.isPending} data-testid="button-save-snapshot">
          Save Current Snapshot
        </Button>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide" data-testid="text-content-stats">Content Stats</h3>
        <div className="grid grid-cols-6 gap-3">
          {contentCards.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                  <c.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{c.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide" data-testid="text-seo-stats">SEO Stats</h3>
        <div className="grid grid-cols-5 gap-3">
          {seoCards.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                  <c.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{c.value}</p>
                  {c.badge && <Badge variant="destructive" className="text-xs">0</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide" data-testid="text-invoice-stats">Invoice Stats</h3>
        <div className="grid grid-cols-4 gap-3">
          {invoiceCards.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{c.label}</span>
                  <c.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-bold">{c.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide" data-testid="text-saved-reports">Saved Reports</h3>
        {savedReports.length === 0 ? (
          <Card>
            <CardContent className="py-12 flex flex-col items-center justify-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No saved reports yet. Save a snapshot to track changes over time.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {savedReports.map((r: any) => (
              <Card key={r.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">{r.name || `Snapshot ${r.id}`}</span>
                  <span className="text-sm text-muted-foreground">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InvoicesTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingInvoice, setEditingInvoice] = useState<any>(null);

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState([{ description: "", qty: 1, unitPrice: 0, category: "" }]);

  const queryKey = `/api/admin/invoices?workspaceId=${workspaceId}`;
  const { data: invoices = [], isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/admin/invoices", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setView("list");
      toast({ title: "Invoice created" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/admin/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Invoice deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const openNewInvoice = () => {
    setEditingInvoice(null);
    setClientName(""); setClientEmail(""); setClientAddress("");
    setDueDate(""); setCurrency("USD"); setTaxRate("0"); setNotes("");
    setLineItems([{ description: "", qty: 1, unitPrice: 0, category: "" }]);
    setView("editor");
  };

  const subtotal = lineItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  const taxAmount = subtotal * (parseFloat(taxRate) || 0) / 100;
  const total = subtotal + taxAmount;

  const handleCreateInvoice = () => {
    createMutation.mutate({
      workspaceId,
      clientName,
      clientEmail,
      clientAddress,
      dueDate,
      currency,
      taxRate: parseFloat(taxRate) || 0,
      notes,
      lineItems,
      subtotal,
      tax: taxAmount,
      total,
      status: "draft",
    });
  };

  if (view === "editor") {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setView("list")} data-testid="button-back-invoices">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
          <Button onClick={handleCreateInvoice} disabled={createMutation.isPending} data-testid="button-create-invoice">
            <DollarSign className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base" data-testid="text-client-info">Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <Label>Name</Label>
                <Input placeholder="Client name" value={clientName} onChange={(e) => setClientName(e.target.value)} data-testid="input-client-name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input placeholder="client@example.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} data-testid="input-client-email" />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input placeholder="Client address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} data-testid="input-client-address" />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base" data-testid="text-invoice-details">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} data-testid="input-due-date" />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger data-testid="select-currency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tax Rate %</Label>
                <Input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} data-testid="input-tax-rate" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base" data-testid="text-line-items">Line Items</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setLineItems([...lineItems, { description: "", qty: 1, unitPrice: 0, category: "" }])} data-testid="button-add-line-item">
              <Plus className="h-4 w-4 mr-1" />
              Add Line Item
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-20">Qty</TableHead>
                  <TableHead className="w-28">Unit Price</TableHead>
                  <TableHead className="w-28">Category</TableHead>
                  <TableHead className="w-24 text-right">Amount</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Input placeholder="Item description" value={item.description} onChange={(e) => { const l = [...lineItems]; l[idx].description = e.target.value; setLineItems(l); }} data-testid={`input-line-desc-${idx}`} />
                    </TableCell>
                    <TableCell>
                      <Input type="number" min="1" value={item.qty} onChange={(e) => { const l = [...lineItems]; l[idx].qty = parseInt(e.target.value) || 1; setLineItems(l); }} data-testid={`input-line-qty-${idx}`} />
                    </TableCell>
                    <TableCell>
                      <Input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => { const l = [...lineItems]; l[idx].unitPrice = parseFloat(e.target.value) || 0; setLineItems(l); }} data-testid={`input-line-price-${idx}`} />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Category" value={item.category} onChange={(e) => { const l = [...lineItems]; l[idx].category = e.target.value; setLineItems(l); }} data-testid={`input-line-category-${idx}`} />
                    </TableCell>
                    <TableCell className="text-right font-medium">${(item.qty * item.unitPrice).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setLineItems(lineItems.filter((_, i) => i !== idx))} data-testid={`button-remove-line-${idx}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col items-end mt-4 space-y-1">
              <div className="flex items-center gap-8">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm font-medium w-20 text-right">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-sm text-muted-foreground">Tax ({taxRate}%)</span>
                <span className="text-sm font-medium w-20 text-right">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-sm font-bold w-20 text-right">${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base" data-testid="text-notes">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea placeholder="Additional notes..." value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[100px]" data-testid="textarea-notes" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif italic font-semibold" data-testid="text-invoices-title">Invoices</h2>
          <p className="text-sm text-muted-foreground">{invoices.length} total</p>
        </div>
        <Button onClick={openNewInvoice} data-testid="button-new-invoice">
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {isLoading ? (
        <Card><CardContent className="p-8"><div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}</div></CardContent></Card>
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1" data-testid="text-no-invoices">No invoices yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Create your first invoice to get started.</p>
            <Button onClick={openNewInvoice} data-testid="button-empty-new-invoice">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv: any) => (
                <TableRow key={inv.id} data-testid={`row-invoice-${inv.id}`}>
                  <TableCell className="font-medium">#{inv.id}</TableCell>
                  <TableCell>{inv.clientName || inv.client || "—"}</TableCell>
                  <TableCell>${(inv.total || 0).toFixed(2)}</TableCell>
                  <TableCell><Badge variant={inv.status === "paid" ? "default" : "secondary"}>{inv.status || "draft"}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.dueDate || "—"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => deleteMutation.mutate(inv.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

const tabConfig = [
  { value: "posts", label: "Posts", icon: FileText },
  { value: "pages", label: "Pages", icon: Globe },
  { value: "campaigns", label: "Campaigns", icon: BarChart3 },
  { value: "domains", label: "Domains", icon: Globe },
  { value: "seo", label: "SEO", icon: Search },
  { value: "links", label: "Links", icon: LinkIcon },
  { value: "health", label: "Health", icon: Activity },
  { value: "cms", label: "CMS", icon: ExternalLink },
  { value: "reports", label: "Reports", icon: FileDown },
  { value: "invoices", label: "Invoices", icon: DollarSign },
];

export default function ContentEngine() {
  const { selectedWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState(getTabFromUrl());
  const workspaceId = selectedWorkspace?.id || "";

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setTabInUrl(tab);
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-content-engine-title">Content Engine</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-content-engine-subtitle">White-label blog management for client workspaces</p>
        </div>
        <Button variant="ghost" size="sm" data-testid="button-how-it-works">
          <HelpCircle className="h-4 w-4 mr-1" />
          How it works
        </Button>
      </div>

      {selectedWorkspace && (
        <div className="flex items-center gap-2 mb-4 p-2 border rounded-md w-fit">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{selectedWorkspace.name}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start h-auto flex-wrap gap-0 bg-transparent border-b rounded-none p-0" data-testid="tabs-content-engine">
          {tabConfig.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 gap-1.5"
              data-testid={`tab-${tab.value}`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="posts" className="mt-0"><PostsTab workspaceId={workspaceId} /></TabsContent>
          <TabsContent value="pages" className="mt-0"><PagesTab workspaceId={workspaceId} /></TabsContent>
          <TabsContent value="campaigns" className="mt-0"><CampaignsTab workspaceId={workspaceId} /></TabsContent>
          <TabsContent value="domains" className="mt-0"><DomainsTab workspaceId={workspaceId} /></TabsContent>
          <TabsContent value="seo" className="mt-0"><SeoTab workspaceId={workspaceId} /></TabsContent>
          <TabsContent value="links" className="mt-0"><LinksTab workspaceId={workspaceId} /></TabsContent>
          <TabsContent value="health" className="mt-0"><HealthTab workspaceId={workspaceId} /></TabsContent>
          <TabsContent value="cms" className="mt-0"><CmsTab workspaceId={workspaceId} /></TabsContent>
          <TabsContent value="reports" className="mt-0"><ReportsTab workspaceId={workspaceId} /></TabsContent>
          <TabsContent value="invoices" className="mt-0"><InvoicesTab workspaceId={workspaceId} /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
