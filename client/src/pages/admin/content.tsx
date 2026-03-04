import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Save,
  Eye,
  Send,
  Clock,
  Trash2,
  ArrowLeft,
  Search,
  Image as ImageIcon,
  FileText,
  X,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Calendar,
  Maximize2,
  Minimize2,
  Globe,
  History,
  Tag,
  Upload,
  Download,
  Layout,
  ChevronsUpDown,
  Check,
  ChevronDown,
  Building2,
  HelpCircle,
  Receipt,
  BarChart3,
  DollarSign,
  TrendingUp,
  Mail,
  Hash,
  Code2,
  Wand2,
  Copy,
  Lock,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { WorkspaceBlogPost, Workspace, WorkspaceDomain, Invoice, InvoiceLineItem, ContentReport } from "@shared/schema";

const VENUE_PAGE_SIZE = 50;

const BLOG_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "seo-strategy", label: "SEO Strategy" },
  { value: "ai-automation", label: "AI & Automation" },
  { value: "voice-sms", label: "Voice & SMS" },
  { value: "website-design", label: "Website Design" },
  { value: "payments-deposits", label: "Payments & Deposits" },
  { value: "comparisons", label: "Comparisons" },
  { value: "pricing-cost", label: "Pricing & Cost" },
  { value: "industry-guides", label: "Industry Guides" },
  { value: "local-guides", label: "Local Guides" },
  { value: "operations-management", label: "Operations Management" },
] as const;

function adminFetch(url: string, options?: RequestInit) {
  return fetch(url, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

async function adminApi(method: string, url: string, data?: any) {
  const res = await adminFetch(url, {
    method,
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

function PostsList({
  workspaceId,
  onEdit,
  onNew,
  onBulkGenerate,
}: {
  workspaceId: string;
  onEdit: (post: WorkspaceBlogPost) => void;
  onNew: () => void;
  onBulkGenerate: () => void;
}) {
  const { data: posts = [], isLoading } = useQuery<WorkspaceBlogPost[]>({
    queryKey: ["/api/blog/posts", workspaceId],
    queryFn: () => adminApi("GET", `/api/blog/posts?workspaceId=${workspaceId}`),
    enabled: !!workspaceId,
  });

  const statusColors: Record<string, "default" | "secondary" | "outline"> = {
    draft: "secondary",
    scheduled: "outline",
    published: "default",
    archived: "secondary",
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">Loading posts...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Posts</h2>
          <p className="text-sm text-muted-foreground">{posts.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBulkGenerate} data-testid="button-bulk-generate">
            <Zap className="h-4 w-4 mr-2" />
            Bulk Generate
          </Button>
          <Button onClick={onNew} data-testid="button-new-post">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>
      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-1">No posts yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create a post manually or use bulk generate to get started.</p>
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" onClick={onBulkGenerate} data-testid="button-bulk-generate-empty">
                <Zap className="h-4 w-4 mr-2" /> Bulk Generate
              </Button>
              <Button onClick={onNew} data-testid="button-new-post-empty">
                <Plus className="h-4 w-4 mr-2" /> New Post
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => {
            const wordCount = post.mdxContent ? post.mdxContent.split(/\s+/).filter(Boolean).length : 0;
            const dateLabel = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString()
              : post.updatedAt
              ? new Date(post.updatedAt).toLocaleDateString()
              : null;

            return (
              <Card
                key={post.id}
                className="cursor-pointer hover-elevate"
                onClick={() => onEdit(post)}
                data-testid={`card-post-${post.id}`}
              >
                <CardContent className="flex items-center justify-between gap-4 py-3 px-4">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{post.title || "Untitled"}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                      <span>/{post.slug || "no-slug"}</span>
                      {post.category && <span>{post.category}</span>}
                      {wordCount > 0 && <span>{wordCount.toLocaleString()} words</span>}
                      {dateLabel && <span>{dateLabel}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {post.generationStatus && post.generationStatus !== "pending" && post.campaignId && (
                      <Badge variant={post.generationStatus === "generated" ? "default" : post.generationStatus === "failed" ? "destructive" : "secondary"} data-testid={`badge-gen-status-${post.id}`}>
                        {post.generationStatus === "generating" ? "AI Generating" : post.generationStatus === "needs_review" ? "Needs Review" : post.generationStatus}
                      </Badge>
                    )}
                    <Badge variant={statusColors[post.status] || "secondary"} data-testid={`badge-status-${post.id}`}>
                      {post.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ImageSearchPanel({
  onInsert,
}: {
  onInsert: (snippet: string) => void;
}) {
  const [source, setSource] = useState("pexels");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const { toast } = useToast();

  const doSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const data = await adminApi("GET", `/api/blog/assets/search-external?source=${source}&q=${encodeURIComponent(query)}`);
      setResults(data);
    } catch (err: any) {
      toast({ title: "Search failed", description: err.message, variant: "destructive" });
    } finally {
      setSearching(false);
    }
  };

  const saveAndInsert = async (item: any) => {
    try {
      const asset = await adminApi("POST", "/api/blog/assets/save", {
        source: item.source,
        sourceAssetId: item.source_asset_id,
        originalUrl: item.full_url,
        width: item.width,
        height: item.height,
        creditName: item.credit_name,
        creditUrl: item.credit_url,
        type: "generic",
        licenseNote: item.license_note,
      });
      const url = asset.publicUrl || asset.originalUrl;
      const credit = item.credit_name ? ` (Photo by ${item.credit_name})` : "";
      const snippet = `<BlogImage src="${url}" alt="${query}" credit="${item.credit_name || ""}" creditUrl="${item.credit_url || ""}" />\n`;
      onInsert(snippet);
      toast({ title: "Image added", description: "Snippet inserted into editor" });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-[120px]" data-testid="select-image-source">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pexels">Pexels</SelectItem>
            <SelectItem value="unsplash">Unsplash</SelectItem>
            <SelectItem value="pixabay">Pixabay</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          placeholder="Search images..."
          data-testid="input-image-search"
        />
        <Button onClick={doSearch} disabled={searching} size="icon" data-testid="button-image-search">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {searching && <div className="text-sm text-muted-foreground">Searching...</div>}
      <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
        {results.map((item, i) => (
          <button
            key={`${item.source_asset_id}-${i}`}
            onClick={() => saveAndInsert(item)}
            className="relative rounded-md overflow-visible aspect-video bg-muted hover-elevate"
            data-testid={`button-image-result-${i}`}
          >
            <img
              src={item.thumb_url}
              alt={item.credit_name || "Stock photo"}
              className="w-full h-full object-cover rounded-md"
              loading="lazy"
            />
            {item.credit_name && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate rounded-b-md">
                {item.credit_name}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

interface PlaceholderData {
  index: number;
  prompt: string;
  fullMatch: string;
  resolved?: {
    src: string;
    alt: string;
    caption?: string;
    credit?: string;
    creditUrl?: string;
    thumbUrl?: string;
  };
  seoMeta?: {
    alt: string;
    caption: string;
    searchQuery: string;
    schemaType: string;
  };
}

function ImagePlaceholdersManager({
  postId,
  mdxContent,
  onMdxUpdate,
}: {
  postId: string | undefined;
  mdxContent: string;
  onMdxUpdate: (newMdx: string) => void;
}) {
  const { toast } = useToast();
  const [placeholders, setPlaceholders] = useState<PlaceholderData[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [searchSources, setSearchSources] = useState<Record<number, string>>({});
  const [searchResults, setSearchResults] = useState<Record<number, any[]>>({});
  const [searchingIdx, setSearchingIdx] = useState<number | null>(null);
  const [customQueries, setCustomQueries] = useState<Record<number, string>>({});

  useEffect(() => {
    const regex = /<BlogImage[^>]*\sprompt=["']([^"']+)["'][^>]*\/>/g;
    const found: PlaceholderData[] = [];
    let match;
    while ((match = regex.exec(mdxContent)) !== null) {
      found.push({ index: found.length, prompt: match[1], fullMatch: match[0] });
    }
    setPlaceholders((prev) => {
      return found.map((f, i) => {
        const existing = prev.find((p) => p.prompt === f.prompt && p.index === i);
        return existing ? { ...f, resolved: existing.resolved, seoMeta: existing.seoMeta } : f;
      });
    });
  }, [mdxContent]);

  const searchForPlaceholder = async (idx: number) => {
    const ph = placeholders[idx];
    if (!ph) return;
    const q = customQueries[idx] || ph.seoMeta?.searchQuery || ph.prompt.split(",")[0].trim();
    const source = searchSources[idx] || "pexels";
    setSearchingIdx(idx);
    try {
      const data = await adminApi("GET", `/api/blog/assets/search-external?source=${source}&q=${encodeURIComponent(q)}`);
      setSearchResults((prev) => ({ ...prev, [idx]: data }));
    } catch (err: any) {
      toast({ title: "Search failed", description: err.message, variant: "destructive" });
    } finally {
      setSearchingIdx(null);
    }
  };

  const selectImageForPlaceholder = async (idx: number, item: any) => {
    const ph = placeholders[idx];
    if (!ph) return;
    try {
      const asset = await adminApi("POST", "/api/blog/assets/save", {
        source: item.source,
        sourceAssetId: item.source_asset_id,
        originalUrl: item.full_url,
        width: item.width,
        height: item.height,
        creditName: item.credit_name,
        creditUrl: item.credit_url,
        type: "blog_image",
        licenseNote: item.license_note,
      });
      const url = asset.publicUrl || asset.originalUrl;
      setPlaceholders((prev) =>
        prev.map((p, i) =>
          i === idx
            ? {
                ...p,
                resolved: {
                  src: url,
                  alt: p.seoMeta?.alt || p.prompt.slice(0, 125),
                  caption: p.seoMeta?.caption || "",
                  credit: item.credit_name || "",
                  creditUrl: item.credit_url || "",
                  thumbUrl: item.thumb_url,
                },
              }
            : p
        )
      );
      toast({ title: "Image selected", description: `Placeholder ${idx + 1} resolved` });
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    }
  };

  const processWithAI = async () => {
    if (!postId) {
      toast({ title: "Save the post first", description: "Post must be saved before processing images", variant: "destructive" });
      return;
    }
    setProcessing(true);
    try {
      const data = await adminApi("POST", `/api/blog/posts/${postId}/process-images`);
      if (data.images && data.images.length > 0) {
        setPlaceholders((prev) =>
          prev.map((p, i) => ({
            ...p,
            seoMeta: data.images[i]
              ? {
                  alt: data.images[i].alt,
                  caption: data.images[i].caption,
                  searchQuery: data.images[i].searchQuery,
                  schemaType: data.images[i].schemaType,
                }
              : p.seoMeta,
          }))
        );
        setCustomQueries((prev) => {
          const updated = { ...prev };
          data.images.forEach((img: any, i: number) => {
            if (img.searchQuery) updated[i] = img.searchQuery;
          });
          return updated;
        });
        toast({ title: "AI Processing Complete", description: `Generated SEO metadata for ${data.images.length} images` });
      }
    } catch (err: any) {
      toast({ title: "Processing failed", description: err.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const applyAllResolved = async () => {
    if (!postId) {
      toast({ title: "Save the post first", variant: "destructive" });
      return;
    }
    const resolved = placeholders.filter((p) => p.resolved);
    if (resolved.length === 0) {
      toast({ title: "No images selected", description: "Search and select images for placeholders first", variant: "destructive" });
      return;
    }
    setApplying(true);
    try {
      const images = placeholders.map((p) =>
        p.resolved
          ? {
              src: p.resolved.src,
              alt: p.resolved.alt,
              caption: p.resolved.caption || "",
              credit: p.resolved.credit || "",
              creditUrl: p.resolved.creditUrl || "",
            }
          : { src: "", alt: "", caption: "" }
      );
      const data = await adminApi("POST", `/api/blog/posts/${postId}/apply-images`, { images });
      if (data.post?.mdxContent) {
        onMdxUpdate(data.post.mdxContent);
        setPlaceholders([]);
        toast({ title: "Images Applied", description: `${resolved.length} images inserted into post` });
      }
    } catch (err: any) {
      toast({ title: "Apply failed", description: err.message, variant: "destructive" });
    } finally {
      setApplying(false);
    }
  };

  const clearPlaceholder = (idx: number) => {
    setPlaceholders((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, resolved: undefined } : p))
    );
  };

  if (placeholders.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        No image placeholders found. Add <code className="bg-muted px-1 rounded text-xs">&lt;BlogImage prompt="..." /&gt;</code> tags in your content to use this feature.
      </div>
    );
  }

  const resolvedCount = placeholders.filter((p) => p.resolved).length;
  const hasSeoMeta = placeholders.some((p) => p.seoMeta);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="text-sm text-muted-foreground" data-testid="text-placeholder-summary">
          {placeholders.length} placeholder{placeholders.length !== 1 ? "s" : ""} found
          {resolvedCount > 0 && ` -- ${resolvedCount} resolved`}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={processWithAI}
            disabled={processing || !postId}
            data-testid="button-process-images-ai"
          >
            {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
            {hasSeoMeta ? "Re-process SEO" : "Process with AI"}
          </Button>
          {resolvedCount > 0 && (
            <Button
              size="sm"
              onClick={applyAllResolved}
              disabled={applying}
              data-testid="button-apply-all-images"
            >
              {applying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Apply {resolvedCount} Image{resolvedCount !== 1 ? "s" : ""}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {placeholders.map((ph, idx) => (
          <Card key={idx} className={ph.resolved ? "border-green-500/30" : ""}>
            <button
              type="button"
              className="flex items-start gap-3 p-3 cursor-pointer w-full text-left"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              data-testid={`button-placeholder-toggle-${idx}`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-medium">
                {idx + 1}
              </div>
              {ph.resolved?.thumbUrl ? (
                <img
                  src={ph.resolved.thumbUrl}
                  alt=""
                  className="w-16 h-12 object-cover rounded-md flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" data-testid={`text-placeholder-prompt-${idx}`}>{ph.prompt}</p>
                {ph.seoMeta && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate" data-testid={`text-placeholder-query-${idx}`}>
                    Search: {ph.seoMeta.searchQuery}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {ph.resolved ? (
                  <>
                    <Badge variant="outline" className="text-green-600 border-green-500/30 text-xs">
                      Ready
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => { e.stopPropagation(); clearPlaceholder(idx); }}
                      data-testid={`button-clear-placeholder-${idx}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                ) : (
                  <Badge variant="secondary" className="text-xs">Pending</Badge>
                )}
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedIdx === idx ? "rotate-180" : ""}`} />
              </div>
            </button>

            {expandedIdx === idx && (
              <CardContent className="pt-0 pb-3">
                <div className="border-t pt-3 space-y-3">
                  {ph.seoMeta && (
                    <div className="bg-muted/50 rounded-md p-2 space-y-1 text-xs">
                      <div><span className="font-medium">Alt:</span> {ph.seoMeta.alt}</div>
                      {ph.seoMeta.caption && <div><span className="font-medium">Caption:</span> {ph.seoMeta.caption}</div>}
                      <div><span className="font-medium">Type:</span> {ph.seoMeta.schemaType}</div>
                    </div>
                  )}
                  {ph.resolved && (
                    <div className="bg-green-50 dark:bg-green-950/20 rounded-md p-2 space-y-1 text-xs">
                      <div className="truncate"><span className="font-medium">URL:</span> {ph.resolved.src}</div>
                      <div><span className="font-medium">Alt:</span> {ph.resolved.alt}</div>
                      {ph.resolved.credit && <div><span className="font-medium">Credit:</span> {ph.resolved.credit}</div>}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Select value={searchSources[idx] || "pexels"} onValueChange={(v) => setSearchSources((prev) => ({ ...prev, [idx]: v }))}>
                      <SelectTrigger className="w-[100px]" data-testid={`select-source-${idx}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pexels">Pexels</SelectItem>
                        <SelectItem value="unsplash">Unsplash</SelectItem>
                        <SelectItem value="pixabay">Pixabay</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={customQueries[idx] ?? ph.seoMeta?.searchQuery ?? ph.prompt.split(",")[0].trim()}
                      onChange={(e) => setCustomQueries((prev) => ({ ...prev, [idx]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && searchForPlaceholder(idx)}
                      placeholder="Search query..."
                      className="flex-1"
                      data-testid={`input-search-placeholder-${idx}`}
                    />
                    <Button
                      size="icon"
                      onClick={() => searchForPlaceholder(idx)}
                      disabled={searchingIdx === idx}
                      data-testid={`button-search-placeholder-${idx}`}
                    >
                      {searchingIdx === idx ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                  {searchResults[idx] && searchResults[idx].length > 0 && (
                    <div className="grid grid-cols-4 gap-1.5 max-h-[240px] overflow-y-auto">
                      {searchResults[idx].map((item: any, i: number) => (
                        <button
                          key={`${item.source_asset_id}-${i}`}
                          onClick={() => selectImageForPlaceholder(idx, item)}
                          className="relative rounded-md overflow-visible aspect-video bg-muted hover-elevate"
                          data-testid={`button-pick-image-${idx}-${i}`}
                        >
                          <img
                            src={item.thumb_url}
                            alt={item.credit_name || "Stock photo"}
                            className="w-full h-full object-cover rounded-md"
                            loading="lazy"
                          />
                          {item.credit_name && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate rounded-b-md">
                              {item.credit_name}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults[idx] && searchResults[idx].length === 0 && (
                    <div className="text-xs text-muted-foreground">No results found. Try a different search query.</div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function PostEditor({
  post,
  workspaceId,
  onBack,
}: {
  post: WorkspaceBlogPost | null;
  workspaceId: string;
  onBack: () => void;
}) {
  const { toast } = useToast();
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [description, setDescription] = useState(post?.description || "");
  const [category, setCategory] = useState(post?.category || "");
  const [tags, setTags] = useState<string[]>((post?.tags as string[]) || []);
  const [tagInput, setTagInput] = useState("");
  const [mdxContent, setMdxContent] = useState(post?.mdxContent || "");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewErrors, setPreviewErrors] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [fullscreenPanel, setFullscreenPanel] = useState<"editor" | "preview" | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [schemaType, setSchemaType] = useState(post?.schemaType || "");
  const [schemaJson, setSchemaJson] = useState<Record<string, any> | null>((post?.schemaJson as Record<string, any>) || null);
  const [schemaAutoDetected, setSchemaAutoDetected] = useState(post?.schemaAutoDetected || false);
  const [schemaDetecting, setSchemaDetecting] = useState(false);
  const [schemaJsonEditing, setSchemaJsonEditing] = useState(false);
  const [schemaJsonDraft, setSchemaJsonDraft] = useState("");

  const { data: editorDomains = [] } = useQuery<WorkspaceDomain[]>({
    queryKey: ["/api/blog/domains", workspaceId],
    queryFn: () => adminApi("GET", `/api/blog/domains?workspaceId=${workspaceId}`),
    enabled: !!workspaceId,
  });
  const primaryDomain = editorDomains.find((d) => d.isPrimary) || editorDomains[0];
  const accentColor = primaryDomain?.accentColor || undefined;
  const accentForeground = primaryDomain?.accentForeground || undefined;

  useEffect(() => {
    if (!slug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }, [title]);

  const fetchPreview = useCallback(async (content: string) => {
    if (!content.trim()) {
      setPreviewHtml("");
      setPreviewErrors([]);
      return;
    }
    try {
      const result = await adminApi("POST", "/api/content/preview", { mdx: content });
      setPreviewHtml(result.html || "");
      setPreviewErrors(result.errors || []);
    } catch {
      setPreviewErrors(["Preview request failed"]);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchPreview(mdxContent), 600);
    return () => clearTimeout(timer);
  }, [mdxContent, fetchPreview]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = { workspaceId, title, slug, description, category, tags, mdxContent, status: post?.status || "draft" };
      if (post?.id) {
        return adminApi("PUT", `/api/blog/posts/${post.id}`, data);
      }
      return adminApi("POST", "/api/blog/posts", data);
    },
    onSuccess: () => {
      toast({ title: "Saved" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts", workspaceId] });
    },
    onError: (err: Error) => {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!post?.id) {
        const created = await adminApi("POST", "/api/blog/posts", {
          workspaceId, title, slug, description, category, tags, mdxContent, status: "draft",
        });
        return adminApi("POST", `/api/blog/posts/${created.id}/publish-now`);
      }
      await adminApi("PUT", `/api/blog/posts/${post.id}`, {
        workspaceId, title, slug, description, category, tags, mdxContent,
      });
      return adminApi("POST", `/api/blog/posts/${post.id}/publish-now`);
    },
    onSuccess: () => {
      toast({ title: "Published" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts", workspaceId] });
      onBack();
    },
    onError: (err: Error) => {
      toast({ title: "Publish failed", description: err.message, variant: "destructive" });
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: async () => {
      if (!scheduleDate) throw new Error("Select a date and time");
      let postId = post?.id;
      if (!postId) {
        const created = await adminApi("POST", "/api/blog/posts", {
          workspaceId, title, slug, description, category, tags, mdxContent, status: "draft",
        });
        postId = created.id;
      } else {
        await adminApi("PUT", `/api/blog/posts/${postId}`, {
          workspaceId, title, slug, description, category, tags, mdxContent,
        });
      }
      return adminApi("POST", `/api/blog/posts/${postId}/schedule`, {
        publish_at: new Date(scheduleDate).toISOString(),
      });
    },
    onSuccess: () => {
      toast({ title: "Scheduled" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts", workspaceId] });
      onBack();
    },
    onError: (err: Error) => {
      toast({ title: "Schedule failed", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminApi("DELETE", `/api/blog/posts/${post?.id}`),
    onSuccess: () => {
      toast({ title: "Deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts", workspaceId] });
      onBack();
    },
    onError: (err: Error) => {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    },
  });

  const handleImageInsert = (snippet: string) => {
    setMdxContent((prev) => prev + "\n" + snippet);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <Button variant="ghost" onClick={onBack} data-testid="button-back-to-list">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2 flex-wrap">
          {post?.id && (
            <Button
              variant="outline"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              data-testid="button-delete-post"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            data-testid="button-save-draft"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending}
            data-testid="button-publish-now"
          >
            <Send className="h-4 w-4 mr-2" />
            Publish Now
          </Button>
        </div>
      </div>

      <div className="grid gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          data-testid="input-post-title"
        />
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="url-slug"
          data-testid="input-post-slug"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger data-testid="select-post-category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {BLOG_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          data-testid="input-post-description"
        />
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex items-center gap-1 flex-wrap flex-1">
          {tags.map((t, i) => (
            <Badge key={i} variant="secondary" className="gap-1" data-testid={`badge-tag-${i}`}>
              {t}
              <button
                onClick={() => setTags(tags.filter((_, j) => j !== i))}
                className="ml-0.5"
                data-testid={`button-remove-tag-${i}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tagInput.trim()) {
                e.preventDefault();
                if (!tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                }
                setTagInput("");
              }
            }}
            placeholder="Add tag + Enter"
            className="w-[150px] flex-shrink-0"
            data-testid="input-tag"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Input
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className="w-auto"
          data-testid="input-schedule-date"
        />
        <Button
          variant="outline"
          onClick={() => scheduleMutation.mutate()}
          disabled={scheduleMutation.isPending || !scheduleDate}
          data-testid="button-schedule"
        >
          <Clock className="h-4 w-4 mr-2" />
          Schedule
        </Button>
      </div>

      <Collapsible open={schemaOpen} onOpenChange={setSchemaOpen} className="mb-4">
        <Card>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center justify-between gap-2 w-full px-4 py-3 text-left"
              data-testid="button-toggle-schema-markup"
            >
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Schema Markup</span>
                {schemaType && (
                  <Badge variant="secondary" className="text-xs">
                    {schemaType}
                  </Badge>
                )}
                {schemaAutoDetected && schemaType && (
                  <Badge variant="outline" className="text-xs">Auto-detected</Badge>
                )}
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${schemaOpen ? "rotate-180" : ""}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 pb-4 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  value={schemaType || ""}
                  onValueChange={async (val) => {
                    if (!post?.id) {
                      toast({ title: "Save the post first", variant: "destructive" });
                      return;
                    }
                    try {
                      const result = await adminApi("POST", `/api/blog/posts/${post.id}/schema/override`, { schemaType: val });
                      setSchemaType(result.schemaType);
                      setSchemaJson(result.schemaJson);
                      setSchemaAutoDetected(false);
                      toast({ title: `Schema type set to ${val}` });
                    } catch (err: any) {
                      toast({ title: "Failed to set schema type", description: err.message, variant: "destructive" });
                    }
                  }}
                >
                  <SelectTrigger className="w-[200px]" data-testid="select-schema-type">
                    <SelectValue placeholder="Select schema type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="HowTo">How-To</SelectItem>
                    <SelectItem value="FAQPage">FAQ Page</SelectItem>
                    <SelectItem value="LocalBusiness">Local Business</SelectItem>
                    <SelectItem value="Recipe">Recipe</SelectItem>
                    <SelectItem value="Review">Review</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="BlogPosting">Blog Posting</SelectItem>
                    <SelectItem value="NewsArticle">News Article</SelectItem>
                    <SelectItem value="TechArticle">Tech Article</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={schemaDetecting || !post?.id}
                  onClick={async () => {
                    if (!post?.id) {
                      toast({ title: "Save the post first", variant: "destructive" });
                      return;
                    }
                    setSchemaDetecting(true);
                    try {
                      const result = await adminApi("POST", `/api/blog/posts/${post.id}/schema/detect`);
                      setSchemaType(result.schemaType);
                      setSchemaJson(result.schemaJson);
                      setSchemaAutoDetected(true);
                      toast({
                        title: `Detected: ${result.schemaType}`,
                        description: `Confidence: ${Math.round((result.confidence || 0) * 100)}% (${result.method})`,
                      });
                    } catch (err: any) {
                      toast({ title: "Detection failed", description: err.message, variant: "destructive" });
                    } finally {
                      setSchemaDetecting(false);
                    }
                  }}
                  data-testid="button-auto-detect-schema"
                >
                  {schemaDetecting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                  Auto-Detect
                </Button>
              </div>

              {schemaJson && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-medium text-muted-foreground">JSON-LD Preview</div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(schemaJson, null, 2));
                          toast({ title: "JSON-LD copied to clipboard" });
                        }}
                        data-testid="button-copy-schema-json"
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => {
                          setSchemaJsonDraft(JSON.stringify(schemaJson, null, 2));
                          setSchemaJsonEditing(!schemaJsonEditing);
                        }}
                        data-testid="button-edit-schema-json"
                      >
                        <Code2 className="h-3 w-3 mr-1" />
                        {schemaJsonEditing ? "Cancel Edit" : "Edit JSON"}
                      </Button>
                    </div>
                  </div>

                  {schemaJsonEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={schemaJsonDraft}
                        onChange={(e) => setSchemaJsonDraft(e.target.value)}
                        className="font-mono text-xs min-h-[200px]"
                        data-testid="textarea-schema-json-edit"
                      />
                      <Button
                        size="sm"
                        onClick={async () => {
                          if (!post?.id) return;
                          try {
                            const parsed = JSON.parse(schemaJsonDraft);
                            const result = await adminApi("POST", `/api/blog/posts/${post.id}/schema/edit-json`, { schemaJson: parsed });
                            setSchemaType(result.schemaType);
                            setSchemaJson(result.schemaJson);
                            setSchemaAutoDetected(false);
                            setSchemaJsonEditing(false);
                            toast({ title: "Schema JSON updated" });
                          } catch (err: any) {
                            toast({ title: "Invalid JSON or save failed", description: err.message, variant: "destructive" });
                          }
                        }}
                        data-testid="button-save-schema-json"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save JSON
                      </Button>
                    </div>
                  ) : (
                    <pre className="bg-muted rounded-md p-3 text-xs font-mono overflow-auto max-h-[300px] whitespace-pre-wrap" data-testid="pre-schema-json-preview">
                      {JSON.stringify(schemaJson, null, 2)}
                    </pre>
                  )}
                </div>
              )}

              {!schemaType && !schemaJson && (
                <div className="text-sm text-muted-foreground">
                  No schema markup set. Use Auto-Detect or select a type manually.
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="editor" data-testid="tab-editor">
            <FileText className="h-4 w-4 mr-2" />
            Editor + Preview
          </TabsTrigger>
          <TabsTrigger value="images" data-testid="tab-images">
            <ImageIcon className="h-4 w-4 mr-2" />
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-4">
          {fullscreenPanel && (
            <div className="fixed inset-0 z-50 bg-background flex flex-col" data-testid="div-fullscreen-overlay">
              <div className="flex items-center justify-between gap-4 px-4 py-2 border-b">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">
                    {fullscreenPanel === "editor" ? "MDX Editor" : "Live Preview"}
                  </div>
                  {fullscreenPanel === "preview" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" data-testid="button-preview-template-picker-fs">
                          <Layout className="h-3 w-3" />
                          {previewTemplate ? BLOG_TEMPLATES.find(t => t.value === previewTemplate)?.label || "Template" : "Raw HTML"}
                          <ChevronsUpDown className="h-3 w-3 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[640px] p-3" align="start">
                        <div className="mb-2">
                          <Button
                            variant={!previewTemplate ? "secondary" : "ghost"}
                            size="sm"
                            className="text-xs w-full justify-start"
                            onClick={() => setPreviewTemplate(null)}
                            data-testid="button-preview-raw-fs"
                          >
                            Raw HTML
                          </Button>
                        </div>
                        <TemplateSelectorGrid
                          value={previewTemplate || ""}
                          onSelect={(val) => setPreviewTemplate(val)}
                          title={title}
                          excerpt={mdxContent.slice(0, 100)}
                          columns={2}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setFullscreenPanel(null)}
                  data-testid="button-exit-fullscreen"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {fullscreenPanel === "editor" ? (
                  <Textarea
                    value={mdxContent}
                    onChange={(e) => setMdxContent(e.target.value)}
                    className="h-full min-h-[calc(100vh-80px)] font-mono text-sm"
                    placeholder="Write your MDX content here..."
                    data-testid="textarea-mdx-editor-fullscreen"
                  />
                ) : previewTemplate ? (
                  <>
                    {previewErrors.length > 0 && (
                      <div className="mb-2 p-2 rounded-md bg-destructive/10 text-destructive text-sm">
                        {previewErrors.map((e, i) => (
                          <div key={i}>{e}</div>
                        ))}
                      </div>
                    )}
                    <TemplatePreview
                      html={previewHtml}
                      title={title}
                      category={category}
                      tags={tags}
                      template={previewTemplate}
                      accentColor={accentColor}
                      accentForeground={accentForeground}
                    />
                  </>
                ) : (
                  <>
                    {previewErrors.length > 0 && (
                      <div className="mb-2 p-2 rounded-md bg-destructive/10 text-destructive text-sm">
                        {previewErrors.map((e, i) => (
                          <div key={i}>{e}</div>
                        ))}
                      </div>
                    )}
                    <div className="prose prose-sm max-w-none" data-testid="div-preview-content-fullscreen">
                      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-sm font-medium text-muted-foreground">MDX Editor</div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setFullscreenPanel("editor")}
                  data-testid="button-fullscreen-editor"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={mdxContent}
                onChange={(e) => setMdxContent(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
                placeholder="Write your MDX content here..."
                data-testid="textarea-mdx-editor"
              />
            </div>
            <div>
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-muted-foreground">Live Preview</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1" data-testid="button-preview-template-picker">
                        <Layout className="h-3 w-3" />
                        {previewTemplate ? BLOG_TEMPLATES.find(t => t.value === previewTemplate)?.label || "Template" : "Raw HTML"}
                        <ChevronsUpDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[640px] p-3" align="start">
                      <div className="mb-2">
                        <Button
                          variant={!previewTemplate ? "secondary" : "ghost"}
                          size="sm"
                          className="text-xs w-full justify-start"
                          onClick={() => setPreviewTemplate(null)}
                          data-testid="button-preview-raw"
                        >
                          Raw HTML
                        </Button>
                      </div>
                      <TemplateSelectorGrid
                        value={previewTemplate || ""}
                        onSelect={(val) => setPreviewTemplate(val)}
                        title={title}
                        excerpt={mdxContent.slice(0, 100)}
                        columns={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setFullscreenPanel("preview")}
                  data-testid="button-fullscreen-preview"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              {previewErrors.length > 0 && (
                <div className="mb-2 p-2 rounded-md bg-destructive/10 text-destructive text-sm" data-testid="text-preview-errors">
                  {previewErrors.map((e, i) => (
                    <div key={i}>{e}</div>
                  ))}
                </div>
              )}
              {previewTemplate ? (
                <div className="min-h-[500px] overflow-auto" data-testid="div-template-preview-wrapper">
                  <TemplatePreview
                    html={previewHtml}
                    title={title}
                    category={category}
                    tags={tags}
                    template={previewTemplate}
                    accentColor={accentColor}
                    accentForeground={accentForeground}
                  />
                </div>
              ) : (
                <Card className="min-h-[500px] overflow-auto">
                  <CardContent className="prose prose-sm max-w-none pt-4" data-testid="div-preview-content">
                    <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Image Placeholders</CardTitle>
            </CardHeader>
            <CardContent>
              <ImagePlaceholdersManager
                postId={post?.id}
                mdxContent={mdxContent}
                onMdxUpdate={(newMdx) => setMdxContent(newMdx)}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Stock Image Search</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageSearchPanel onInsert={handleImageInsert} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface BulkPostEntry {
  title: string;
  primaryKeyword: string;
  intent: string;
  funnel: string;
  category: string;
}

function BulkGenerateModal({
  workspaceId,
  open,
  onOpenChange,
  onCreated,
}: {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (campaignId: string) => void;
}) {
  const { toast } = useToast();
  const [entries, setEntries] = useState<BulkPostEntry[]>([
    { title: "", primaryKeyword: "", intent: "informational", funnel: "tofu", category: "general" },
  ]);
  const [creating, setCreating] = useState(false);

  const addRow = () => {
    setEntries([...entries, { title: "", primaryKeyword: "", intent: "informational", funnel: "tofu", category: "general" }]);
  };

  const removeRow = (idx: number) => {
    setEntries(entries.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, field: keyof BulkPostEntry, value: string) => {
    const updated = [...entries];
    updated[idx] = { ...updated[idx], [field]: value };
    setEntries(updated);
  };

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          result.push(current.trim());
          current = "";
        } else {
          current += ch;
        }
      }
    }
    result.push(current.trim());
    return result;
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (!text) return;
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) {
        toast({ title: "CSV must have a header row and at least one data row", variant: "destructive" });
        return;
      }
      const header = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, ""));
      const titleIdx = header.findIndex(h => h === "title");
      const kwIdx = header.findIndex(h => h === "primarykeyword" || h === "keyword" || h === "targetkeyword");
      const intentIdx = header.findIndex(h => h === "intent" || h === "searchintent");
      const funnelIdx = header.findIndex(h => h === "funnel" || h === "funnelstage");
      const catIdx = header.findIndex(h => h === "category");

      if (titleIdx === -1) {
        toast({ title: "CSV must have a 'title' column", variant: "destructive" });
        return;
      }

      const validIntents = ["informational", "commercial", "transactional", "navigational"];
      const validFunnels = ["tofu", "mofu", "bofu"];
      const parsed: BulkPostEntry[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        const title = cols[titleIdx]?.trim() || "";
        if (!title) continue;
        const intent = intentIdx >= 0 ? (cols[intentIdx]?.trim().toLowerCase() || "") : "";
        const funnel = funnelIdx >= 0 ? (cols[funnelIdx]?.trim().toLowerCase() || "") : "";
        parsed.push({
          title,
          primaryKeyword: kwIdx >= 0 ? (cols[kwIdx]?.trim() || "") : "",
          intent: validIntents.includes(intent) ? intent : "informational",
          funnel: validFunnels.includes(funnel) ? funnel : "tofu",
          category: catIdx >= 0 ? (cols[catIdx]?.trim() || "general") : "general",
        });
      }
      if (parsed.length === 0) {
        toast({ title: "No valid rows found in CSV", variant: "destructive" });
        return;
      }
      setEntries(parsed);
      toast({ title: `Imported ${parsed.length} rows from CSV` });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleCreate = async () => {
    const validEntries = entries.filter(e => e.title.trim() && e.primaryKeyword.trim());
    if (validEntries.length === 0) {
      toast({ title: "Add at least one post with title and keyword", variant: "destructive" });
      return;
    }
    setCreating(true);
    try {
      const result = await adminApi("POST", "/api/blog/posts/bulk/create", {
        workspaceId,
        posts: validEntries,
      });
      toast({ title: `Created ${result.posts.length} draft posts` });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts", workspaceId] });
      onOpenChange(false);
      onCreated(result.campaignId);
    } catch (err: any) {
      toast({ title: "Bulk create failed", description: err.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Generate Blog Drafts</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {entries.map((entry, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-2 items-end" data-testid={`row-bulk-entry-${idx}`}>
              <div>
                {idx === 0 && <Label className="text-xs text-muted-foreground">Title</Label>}
                <Input
                  value={entry.title}
                  onChange={(e) => updateRow(idx, "title", e.target.value)}
                  placeholder="Post title"
                  data-testid={`input-bulk-title-${idx}`}
                />
              </div>
              <div>
                {idx === 0 && <Label className="text-xs text-muted-foreground">Primary Keyword</Label>}
                <Input
                  value={entry.primaryKeyword}
                  onChange={(e) => updateRow(idx, "primaryKeyword", e.target.value)}
                  placeholder="Target keyword"
                  data-testid={`input-bulk-keyword-${idx}`}
                />
              </div>
              <div>
                {idx === 0 && <Label className="text-xs text-muted-foreground">Intent</Label>}
                <Select value={entry.intent} onValueChange={(v) => updateRow(idx, "intent", v)}>
                  <SelectTrigger className="w-[130px]" data-testid={`select-bulk-intent-${idx}`}>
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
              <div>
                {idx === 0 && <Label className="text-xs text-muted-foreground">Funnel</Label>}
                <Select value={entry.funnel} onValueChange={(v) => updateRow(idx, "funnel", v)}>
                  <SelectTrigger className="w-[100px]" data-testid={`select-bulk-funnel-${idx}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tofu">TOFU</SelectItem>
                    <SelectItem value="mofu">MOFU</SelectItem>
                    <SelectItem value="bofu">BOFU</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeRow(idx)}
                disabled={entries.length <= 1}
                data-testid={`button-remove-entry-${idx}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={addRow} data-testid="button-add-bulk-row">
              <Plus className="h-4 w-4 mr-2" /> Add Row
            </Button>
            <label>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleCsvUpload}
                data-testid="input-csv-upload"
              />
              <Button variant="outline" asChild>
                <span><Upload className="h-4 w-4 mr-2" /> Upload CSV</span>
              </Button>
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const csv = "title,keyword,intent,funnel,category\nBest SEO Tools for Agencies 2025,seo tools for agencies,informational,tofu,seo-strategy\nHow to Improve Client Retention with Reports,client retention reporting,commercial,mofu,analytics\n";
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "bulk-drafts-template.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
              data-testid="button-download-csv-template"
            >
              <Download className="h-4 w-4 mr-1" /> Download Template
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-bulk">
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={creating} data-testid="button-create-drafts">
            {creating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
            Create {entries.filter(e => e.title.trim() && e.primaryKeyword.trim()).length} Drafts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DraftQueue({
  workspaceId,
  campaignId,
  onEdit,
}: {
  workspaceId: string;
  campaignId: string;
  onEdit: (post: WorkspaceBlogPost) => void;
}) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  const { data: posts = [], isLoading, refetch } = useQuery<WorkspaceBlogPost[]>({
    queryKey: ["/api/blog/posts/campaign", workspaceId, campaignId],
    queryFn: () => adminApi("GET", `/api/blog/posts/campaign/${workspaceId}/${campaignId}`),
    refetchInterval: generating ? 5000 : false,
  });

  const startGeneration = async () => {
    setGenerating(true);
    setProgress({ completed: 0, total: posts.filter(p => p.generationStatus === "pending" || p.generationStatus === "failed").length });
    try {
      const res = await adminFetch("/api/blog/posts/bulk/generate", {
        method: "POST",
        body: JSON.stringify({ workspaceId, campaignId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || "Generation request failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6));
              if (event.type === "progress") {
                setProgress({ completed: event.completed, total: event.total });
              } else if (event.type === "complete") {
                toast({ title: `Generation complete: ${event.generated} passed, ${event.needsReview} need review, ${event.failed} failed` });
              } else if (event.type === "error") {
                toast({ title: "Generation error", description: event.message, variant: "destructive" });
              }
            } catch {}
          }
        }
      }
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally {
      setGenerating(false);
      refetch();
    }
  };

  const regenerateMutation = useMutation({
    mutationFn: async (postId: string) => {
      return adminApi("POST", `/api/blog/posts/${postId}/regenerate`);
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts", workspaceId] });
      toast({ title: "Regeneration complete" });
    },
    onError: (err: Error) => {
      toast({ title: "Regeneration failed", description: err.message, variant: "destructive" });
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ postId, publishAt }: { postId: string; publishAt?: string }) => {
      return adminApi("POST", `/api/blog/posts/${postId}/approve`, {
        publish_at: publishAt || undefined,
      });
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts", workspaceId] });
      toast({ title: "Post approved" });
    },
    onError: (err: Error) => {
      toast({ title: "Approval failed", description: err.message, variant: "destructive" });
    },
  });

  const genStatusBadge = (status: string | null) => {
    switch (status) {
      case "pending": return <Badge variant="secondary">Pending</Badge>;
      case "generating": return <Badge variant="outline"><Loader2 className="h-3 w-3 mr-1 animate-spin" />Generating</Badge>;
      case "generated": return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Generated</Badge>;
      case "needs_review": return <Badge variant="outline"><AlertTriangle className="h-3 w-3 mr-1" />Needs Review</Badge>;
      case "failed": return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const qualityBadge = (status: string | null) => {
    switch (status) {
      case "pass": return <Badge variant="default">QA Pass</Badge>;
      case "fail": return <Badge variant="destructive">QA Fail</Badge>;
      default: return null;
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground py-8 text-center">Loading drafts...</div>;
  }

  const pendingCount = posts.filter(p => p.generationStatus === "pending" || p.generationStatus === "failed").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-draft-queue-title">Draft Queue</h2>
          <p className="text-sm text-muted-foreground">{posts.length} posts in campaign</p>
        </div>
        {pendingCount > 0 && (
          <Button onClick={startGeneration} disabled={generating} data-testid="button-start-generation">
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating {progress.completed}/{progress.total}
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate {pendingCount} Pending
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {posts.map((post) => (
          <Card key={post.id} data-testid={`card-draft-${post.id}`}>
            <CardContent className="py-3 px-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                    <span>{post.primaryKeyword}</span>
                    {post.intent && <span className="text-xs">{post.intent}</span>}
                    {post.funnel && <span className="text-xs uppercase">{post.funnel}</span>}
                  </div>
                  {post.qualityFailReasons && (post.qualityFailReasons as string[]).length > 0 && (
                    <div className="mt-2 text-xs text-destructive space-y-1" data-testid={`text-qa-reasons-${post.id}`}>
                      {(post.qualityFailReasons as string[]).map((r, i) => (
                        <div key={i}>{r}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  {genStatusBadge(post.generationStatus)}
                  {qualityBadge(post.qualityGateStatus)}
                  {(post.generationStatus === "generated" || post.generationStatus === "needs_review") && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(post)}
                        data-testid={`button-edit-draft-${post.id}`}
                      >
                        <Eye className="h-3 w-3 mr-1" /> Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateMutation.mutate(post.id)}
                        disabled={regenerateMutation.isPending}
                        data-testid={`button-regenerate-${post.id}`}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" /> Regen
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => approveMutation.mutate({ postId: post.id })}
                        disabled={approveMutation.isPending}
                        data-testid={`button-approve-${post.id}`}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" /> Approve
                      </Button>
                    </>
                  )}
                  {post.generationStatus === "failed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => regenerateMutation.mutate(post.id)}
                      disabled={regenerateMutation.isPending}
                      data-testid={`button-retry-${post.id}`}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" /> Retry
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const ACCENT_PRESETS = [
  { label: "None", accent: "", foreground: "" },
  { label: "Blue", accent: "#2563eb", foreground: "#ffffff" },
  { label: "Red", accent: "#dc2626", foreground: "#ffffff" },
  { label: "Green", accent: "#16a34a", foreground: "#ffffff" },
  { label: "Purple", accent: "#7c3aed", foreground: "#ffffff" },
  { label: "Orange", accent: "#ea580c", foreground: "#ffffff" },
  { label: "Teal", accent: "#0d9488", foreground: "#ffffff" },
  { label: "Rose", accent: "#e11d48", foreground: "#ffffff" },
  { label: "Amber", accent: "#d97706", foreground: "#1a1a1a" },
  { label: "Slate", accent: "#475569", foreground: "#ffffff" },
];

function AccentColorPicker({
  domainId,
  accentColor,
  accentForeground,
  onSave,
  isPending,
}: {
  domainId: string;
  accentColor: string;
  accentForeground: string;
  onSave: (accent: string, foreground: string) => void;
  isPending: boolean;
}) {
  const [accent, setAccent] = useState(accentColor);
  const [foreground, setForeground] = useState(accentForeground);
  const hasChanged = accent !== accentColor || foreground !== accentForeground;

  useEffect(() => {
    setAccent(accentColor);
    setForeground(accentForeground);
  }, [accentColor, accentForeground]);

  return (
    <div className="space-y-1.5" data-testid={`div-accent-picker-${domainId}`}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Accent colours:</span>
        <div className="flex items-center gap-1 flex-wrap">
          {ACCENT_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setAccent(p.accent); setForeground(p.foreground); }}
              className={`h-6 w-6 rounded-md border transition-all ${
                accent === p.accent && foreground === p.foreground
                  ? "ring-2 ring-primary ring-offset-1"
                  : ""
              }`}
              style={{
                backgroundColor: p.accent || "transparent",
                backgroundImage: !p.accent ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)" : undefined,
                backgroundSize: !p.accent ? "6px 6px" : undefined,
                backgroundPosition: !p.accent ? "0 0, 3px 3px" : undefined,
              }}
              title={p.label}
              data-testid={`button-accent-preset-${p.label.toLowerCase()}`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <label className="text-xs text-muted-foreground">Accent:</label>
          <input
            type="color"
            value={accent || "#2563eb"}
            onChange={(e) => setAccent(e.target.value)}
            className="h-7 w-8 rounded border cursor-pointer"
            data-testid={`input-accent-color-${domainId}`}
          />
          <Input
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            placeholder="#hex"
            className="h-7 w-20 text-xs font-mono"
            data-testid={`input-accent-hex-${domainId}`}
          />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-xs text-muted-foreground">Text:</label>
          <input
            type="color"
            value={foreground || "#ffffff"}
            onChange={(e) => setForeground(e.target.value)}
            className="h-7 w-8 rounded border cursor-pointer"
            data-testid={`input-accent-fg-${domainId}`}
          />
          <Input
            value={foreground}
            onChange={(e) => setForeground(e.target.value)}
            placeholder="#hex"
            className="h-7 w-20 text-xs font-mono"
            data-testid={`input-accent-fg-hex-${domainId}`}
          />
        </div>
        {accent && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
            style={{ backgroundColor: accent, color: foreground || "#fff" }}
            data-testid={`div-accent-preview-${domainId}`}
          >
            Preview
          </div>
        )}
        {hasChanged && (
          <Button
            size="sm"
            onClick={() => onSave(accent, foreground)}
            disabled={isPending}
            data-testid={`button-save-accent-${domainId}`}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
}

const BLOG_TEMPLATES = [
  { value: "editorial", label: "Editorial", description: "Newspaper-style with hero + sidebar layout" },
  { value: "magazine", label: "Magazine", description: "Dark header hero, two-column grid" },
  { value: "minimal", label: "Minimal", description: "Clean centered single-column" },
  { value: "classic", label: "Classic", description: "Serif typography, centered traditional" },
  { value: "grid", label: "Grid", description: "Card-based layout, modern SaaS feel" },
  { value: "brutalist", label: "Brutalist", description: "Bold uppercase, high-contrast numbered" },
] as const;

function TemplateSelectorGrid({
  value,
  onSelect,
  title: postTitle,
  excerpt,
  accentColor,
  accentForeground,
  columns = 3,
}: {
  value: string;
  onSelect: (template: string) => void;
  title?: string;
  excerpt?: string;
  accentColor?: string;
  accentForeground?: string;
  columns?: 2 | 3;
}) {
  const displayTitle = postTitle || "Your Post Title";
  const displayExcerpt = excerpt || "A brief excerpt from your blog post content goes here...";
  const gridCols = columns === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${gridCols} gap-3`} data-testid="grid-template-selector">
      {BLOG_TEMPLATES.map((t) => {
        const isSelected = value === t.value;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onSelect(t.value)}
            className={`relative rounded-md border-2 overflow-hidden text-left transition-all ${
              isSelected
                ? "border-primary ring-1 ring-primary"
                : "border-border hover:border-muted-foreground/40"
            }`}
            data-testid={`button-template-${t.value}`}
          >
            <div className="pointer-events-none select-none" style={{ height: "160px" }}>
              <TemplateMiniPreview
                template={t.value}
                title={displayTitle}
                excerpt={displayExcerpt}
                accentColor={accentColor}
                accentForeground={accentForeground}
              />
            </div>
            <div className={`px-2.5 py-2 border-t ${isSelected ? "bg-primary/5" : "bg-muted/30"}`}>
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-medium truncate">{t.label}</span>
                {isSelected && <Check className="h-3 w-3 text-primary flex-shrink-0" />}
              </div>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{t.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TemplateMiniPreview({
  template,
  title,
  excerpt,
  accentColor,
  accentForeground,
}: {
  template: string;
  title: string;
  excerpt: string;
  accentColor?: string;
  accentForeground?: string;
}) {
  const shortTitle = title.length > 40 ? title.slice(0, 40) + "..." : title;
  const shortExcerpt = excerpt.length > 60 ? excerpt.slice(0, 60) + "..." : excerpt;

  if (template === "editorial") {
    return (
      <div className="h-full bg-stone-50/50 dark:bg-card flex flex-col" style={{ transform: "scale(1)", transformOrigin: "top left" }}>
        <div className="border-b border-stone-200 dark:border-border px-3 py-2 text-center">
          <div className="text-[8px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">The indexFlow Journal</div>
        </div>
        <div className="flex-1 px-3 py-2.5">
          <div className="text-[7px] uppercase tracking-wider text-muted-foreground/60 mb-1">Featured</div>
          <div className="text-[10px] font-bold leading-tight mb-1.5">{shortTitle}</div>
          <div className="text-[7px] text-muted-foreground leading-snug line-clamp-3">{shortExcerpt}</div>
          <div className="mt-2 space-y-1.5">
            {[1, 2].map((i) => (
              <div key={i} className="border-t border-stone-200 dark:border-border pt-1.5">
                <div className="h-1.5 bg-muted/60 rounded-sm" style={{ width: `${85 - i * 20}%` }} />
                <div className="h-1 bg-muted/40 rounded-sm mt-1" style={{ width: `${70 - i * 15}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template === "magazine") {
    const magHeaderStyle = accentColor ? { backgroundColor: accentColor, color: accentForeground || "#fff" } : undefined;
    return (
      <div className="h-full flex flex-col">
        <div className="bg-zinc-900 dark:bg-zinc-950 text-white px-3 py-2" style={magHeaderStyle}>
          <div className="text-[8px] font-bold tracking-tight">indexFlow / Insights</div>
        </div>
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 dark:from-zinc-950 dark:to-zinc-900 text-white px-3 py-3 flex-shrink-0" style={magHeaderStyle}>
          <div className="text-[6px] uppercase tracking-widest opacity-40 mb-1">Featured</div>
          <div className="text-[10px] font-bold leading-tight mb-1">{shortTitle}</div>
          <div className="text-[7px] opacity-50 leading-snug line-clamp-2">{shortExcerpt}</div>
        </div>
        <div className="flex-1 bg-zinc-50 dark:bg-card px-3 py-2">
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-b border-zinc-200 dark:border-border pb-1.5">
                <div className="h-1 bg-muted/40 rounded-sm mb-0.5" style={{ width: "40%" }} />
                <div className="h-1.5 bg-muted/60 rounded-sm" style={{ width: `${90 - i * 10}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template === "minimal") {
    return (
      <div className="h-full bg-white dark:bg-card flex flex-col items-center justify-start px-4 pt-6">
        <div className="text-[10px] font-light tracking-tight text-center mb-1">Writing</div>
        <div className="text-[6px] text-muted-foreground mb-3">Ideas and analysis</div>
        <div className="w-full max-w-[80%]">
          <div className="text-[6px] text-muted-foreground text-center mb-1.5">Jan 15, 2025</div>
          <div className="text-[9px] font-semibold text-center leading-tight mb-1.5">{shortTitle}</div>
          <div className="w-6 h-px mx-auto mb-2" style={{ backgroundColor: accentColor || "hsl(0 0% 50% / 0.2)" }} />
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-1 bg-muted/50 rounded-sm mx-auto" style={{ width: `${90 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template === "classic") {
    return (
      <div className="h-full bg-amber-50/30 dark:bg-card flex flex-col">
        <div className="border-b border-amber-200/60 dark:border-border px-3 py-2 text-center">
          <div className="text-[9px] font-serif font-bold italic">The indexFlow Review</div>
          <div className="w-8 h-px mx-auto mt-1" style={{ backgroundColor: accentColor || "hsl(0 0% 30% / 0.2)" }} />
        </div>
        <div className="flex-1 px-3 py-2.5 text-center">
          <div className="text-[6px] font-serif italic text-muted-foreground/70 mb-0.5">Category</div>
          <div className="text-[10px] font-serif font-bold leading-tight mb-1">{shortTitle}</div>
          <div className="text-[6px] text-muted-foreground/50 font-serif italic mb-2">January 15, 2025</div>
          <div className="border-t-2 border-double border-amber-200/50 dark:border-foreground/20 pt-2">
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-1 bg-muted/40 rounded-sm mx-auto" style={{ width: `${85 - i * 12}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === "grid") {
    return (
      <div className="h-full bg-slate-50/60 dark:bg-card flex flex-col">
        <div className="px-3 py-2">
          <div className="text-[7px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">indexFlow Blog</div>
          <div className="text-[9px] font-bold">Latest from our team</div>
        </div>
        <div className="px-3 pb-2">
          <div className="rounded bg-white dark:bg-muted/30 border border-slate-200 dark:border-border p-2 mb-2">
            <div className="text-[9px] font-bold leading-tight mb-0.5">{shortTitle}</div>
            <div className="text-[6px] text-muted-foreground">{shortExcerpt.slice(0, 40)}...</div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded bg-white dark:bg-muted/20 border border-slate-200 dark:border-border p-1.5">
                <div className="h-1 bg-muted/40 rounded-sm mb-0.5" style={{ width: "50%" }} />
                <div className="h-1.5 bg-muted/60 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template === "brutalist") {
    const brutBorderStyle = accentColor ? { borderColor: accentColor } : undefined;
    const brutHeroStyle = accentColor ? { backgroundColor: accentColor, color: accentForeground || "#fff" } : undefined;
    return (
      <div className="h-full bg-yellow-50/40 dark:bg-zinc-950 flex flex-col">
        <div className="border-b-[3px] border-foreground px-3 py-1.5" style={brutBorderStyle}>
          <div className="text-[9px] font-black uppercase tracking-tight leading-none">RESTO//BLOG</div>
        </div>
        <div className="bg-foreground text-background px-3 py-2.5" style={brutHeroStyle}>
          <div className="text-[5px] font-mono uppercase tracking-widest opacity-40 mb-0.5">[Category]</div>
          <div className="text-[10px] font-black uppercase leading-none mb-1">{shortTitle}</div>
          <div className="text-[6px] opacity-50 line-clamp-1">{shortExcerpt}</div>
        </div>
        <div className="flex-1 px-3 py-2">
          <div className="space-y-1.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-1.5 border-b border-foreground/10 pb-1">
                <span className="text-[8px] font-black text-foreground/10 leading-none">{String(i).padStart(2, "0")}</span>
                <div className="flex-1">
                  <div className="h-1.5 bg-muted/60 rounded-sm" style={{ width: `${80 - i * 15}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function TemplatePreview({
  html,
  title,
  category,
  tags,
  template,
  accentColor,
  accentForeground,
}: {
  html: string;
  title: string;
  category: string;
  tags: string[];
  template: string;
  accentColor?: string;
  accentForeground?: string;
}) {
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const accentStyle = accentColor ? { backgroundColor: accentColor, color: accentForeground || "#fff" } : undefined;
  const accentBorderStyle = accentColor ? { borderColor: accentColor } : undefined;
  const accentTextStyle = accentColor ? { color: accentColor } : undefined;

  if (template === "magazine") {
    return (
      <div className="rounded-md overflow-hidden border" data-testid="div-template-preview-magazine">
        <div className="bg-foreground text-background px-6 py-8" style={accentStyle}>
          <div className="text-xs uppercase tracking-widest opacity-60 mb-2">{category || "Uncategorized"}</div>
          <h1 className="text-2xl font-bold leading-tight mb-3">{title || "Untitled Post"}</h1>
          <div className="flex items-center gap-3 text-xs opacity-60">
            <span>{dateStr}</span>
            {tags.length > 0 && <span>{tags.slice(0, 3).join(" / ")}</span>}
          </div>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
            <div className="hidden md:block">
              <div className="sticky top-0 space-y-4">
                <div className="rounded-md bg-muted/50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Related Posts</div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-3 bg-muted rounded-sm" style={{ width: `${80 - i * 15}%` }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-md bg-muted/50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {(tags.length > 0 ? tags : ["sample-tag"]).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template === "minimal") {
    return (
      <div className="rounded-md border" data-testid="div-template-preview-minimal">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="text-center mb-8">
            <div className="text-xs text-muted-foreground mb-3">{dateStr}</div>
            <h1 className="text-2xl font-semibold leading-tight mb-3">{title || "Untitled Post"}</h1>
            <div className="text-sm text-muted-foreground" style={accentTextStyle}>{category || "Uncategorized"}</div>
          </div>
          <div className="w-12 h-px mx-auto mb-8" style={{ backgroundColor: accentColor || undefined }} />
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          {tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-1 justify-center">
                {tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (template === "classic") {
    return (
      <div className="rounded-md border" data-testid="div-template-preview-classic">
        <div className="border-b text-center py-4 px-6" style={accentBorderStyle}>
          <h2 className="text-lg font-serif font-bold italic">The indexFlow Review</h2>
          <div className="w-16 h-px mx-auto mt-2" style={{ backgroundColor: accentColor || "hsl(var(--foreground) / 0.3)" }} />
        </div>
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
            <span className="text-xs font-serif italic" style={accentTextStyle || { color: "hsl(var(--muted-foreground))" }}>{category || "Uncategorized"}</span>
            <h1 className="text-2xl font-serif font-bold leading-tight mt-1 mb-3">{title || "Untitled Post"}</h1>
            <div className="text-xs text-muted-foreground/60 font-serif italic">
              {dateStr}
            </div>
          </div>
          <div className="border-t-2 border-double border-foreground/20 pt-6">
            <div className="prose prose-sm max-w-none font-serif" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
          {tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-1 justify-center">
                {tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs font-serif">{t}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (template === "grid") {
    return (
      <div className="rounded-md border" data-testid="div-template-preview-grid">
        <div className="px-6 py-5">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">indexFlow Blog</div>
          <Badge variant="secondary" className="text-xs">{category || "Uncategorized"}</Badge>
        </div>
        <div className="px-6 pb-4">
          <div className="rounded-md p-6 mb-6" style={accentStyle || { backgroundColor: "hsl(var(--muted) / 0.5)" }}>
            <h1 className="text-2xl font-bold leading-tight mb-3">{title || "Untitled Post"}</h1>
            <div className="text-xs" style={{ opacity: 0.7 }}>{dateStr}</div>
          </div>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          {tags.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex flex-wrap gap-1">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (template === "brutalist") {
    return (
      <div className="rounded-md border overflow-hidden" data-testid="div-template-preview-brutalist">
        <div className="border-b-4 px-6 py-4" style={{ borderColor: accentColor || "hsl(var(--foreground))" }}>
          <h2 className="text-xl font-black uppercase tracking-tight leading-none">RESTO//BLOG</h2>
        </div>
        <div className="px-6 py-8">
          <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">[{category || "Uncategorized"}]</span>
          <h1 className="text-2xl font-black uppercase leading-none mt-2 mb-4">{title || "Untitled Post"}</h1>
          <div className="text-xs font-mono text-muted-foreground/60 uppercase mb-6">
            {dateStr}
          </div>
          <div className="border-t-2 border-foreground/20 pt-6">
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
          {tags.length > 0 && (
            <div className="mt-6 pt-4 border-t-2 border-foreground/20">
              <div className="flex flex-wrap gap-1">
                {tags.map((t) => (
                  <span key={t} className="text-xs font-mono uppercase px-2 py-0.5" style={accentStyle || { backgroundColor: "hsl(var(--foreground))", color: "hsl(var(--background))" }}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border" data-testid="div-template-preview-editorial">
      <div className="p-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          {accentStyle ? (
            <span className="text-xs font-medium px-2 py-0.5 rounded-md" style={accentStyle}>{category || "Uncategorized"}</span>
          ) : (
            <Badge variant="secondary" className="text-xs">{category || "Uncategorized"}</Badge>
          )}
          <span>{dateStr}</span>
        </div>
        <h1 className="text-2xl font-bold leading-tight mb-4">{title || "Untitled Post"}</h1>
        <div className="grid md:grid-cols-[1fr_200px] gap-6">
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="hidden md:block">
            <div className="sticky top-0 space-y-4">
              <div className="rounded-md bg-muted/50 p-4">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">About</div>
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-3 bg-muted rounded-sm" style={{ width: `${90 - i * 20}%` }} />
                  ))}
                </div>
              </div>
              {tags.length > 0 && (
                <div className="rounded-md bg-muted/50 p-4">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DomainManager({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [newDomain, setNewDomain] = useState("");

  const { data: domains = [], isLoading } = useQuery<WorkspaceDomain[]>({
    queryKey: ["/api/blog/domains", workspaceId],
    queryFn: () => adminApi("GET", `/api/blog/domains?workspaceId=${workspaceId}`),
    enabled: !!workspaceId,
  });

  const firstDomainId = domains[0]?.id;
  const { data: lockStatus } = useQuery<{ locked: boolean; reason: string | null }>({
    queryKey: ["/api/blog/domains", firstDomainId, "lock-status"],
    queryFn: async () => {
      const res = await fetch(`/api/blog/domains/${firstDomainId}/lock-status`, { credentials: "include" });
      if (!res.ok) return { locked: false, reason: null };
      return res.json();
    },
    enabled: !!firstDomainId,
  });

  const isLocked = lockStatus?.locked ?? false;
  const lockReason = lockStatus?.reason ?? null;

  const addMutation = useMutation({
    mutationFn: () => adminApi("POST", "/api/blog/domains", { workspaceId, domain: newDomain.trim().toLowerCase() }),
    onSuccess: () => {
      setNewDomain("");
      toast({ title: "Domain added" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/domains", workspaceId] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to add domain", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi("DELETE", `/api/blog/domains/${id}`),
    onSuccess: () => {
      toast({ title: "Domain removed" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/domains", workspaceId] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to remove domain", description: err.message, variant: "destructive" });
    },
  });

  const templateMutation = useMutation({
    mutationFn: ({ id, blogTemplate }: { id: string; blogTemplate: string }) =>
      adminApi("PATCH", `/api/blog/domains/${id}`, { blogTemplate }),
    onSuccess: () => {
      toast({ title: "Template updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/domains", workspaceId] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update template", description: err.message, variant: "destructive" });
    },
  });

  const accentMutation = useMutation({
    mutationFn: ({ id, accentColor, accentForeground }: { id: string; accentColor: string | null; accentForeground: string | null }) =>
      adminApi("PATCH", `/api/blog/domains/${id}`, { accentColor, accentForeground }),
    onSuccess: () => {
      toast({ title: "Accent colours updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/domains", workspaceId] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update accent colours", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Domain Mapping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="example.com"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newDomain.trim()) {
                  e.preventDefault();
                  addMutation.mutate();
                }
              }}
              data-testid="input-new-domain"
            />
            <Button
              onClick={() => addMutation.mutate()}
              disabled={!newDomain.trim() || addMutation.isPending}
              data-testid="button-add-domain"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : domains.length === 0 ? (
            <div className="text-sm text-muted-foreground">No domains mapped. Add a domain to enable the public blog API for this workspace.</div>
          ) : (
            <div className="space-y-2">
              {domains.map((d) => (
                <div key={d.id} className="rounded-md px-3 py-2.5 bg-muted/50 space-y-2" data-testid={`row-domain-${d.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono">{d.domain}</span>
                      {d.isPrimary && <Badge variant="secondary">Primary</Badge>}
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400" title={lockReason || "Domain locked"} data-testid={`icon-lock-domain-${d.id}`}>
                          <Lock className="h-3 w-3" />
                          Locked
                        </span>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate(d.id)}
                      disabled={deleteMutation.isPending || isLocked}
                      title={isLocked ? (lockReason || "Domain is locked on Solo plan") : "Delete domain"}
                      data-testid={`button-delete-domain-${d.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between gap-2 text-xs text-muted-foreground" data-testid={`button-toggle-template-${d.id}`}>
                        <span>Blog template: <span className="font-medium text-foreground">{BLOG_TEMPLATES.find(t => t.value === (d.blogTemplate || "editorial"))?.label || "Editorial"}</span></span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <TemplateSelectorGrid
                        value={d.blogTemplate || "editorial"}
                        onSelect={(val) => templateMutation.mutate({ id: d.id, blogTemplate: val })}
                        accentColor={d.accentColor || undefined}
                        accentForeground={d.accentForeground || undefined}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                  <AccentColorPicker
                    domainId={d.id}
                    accentColor={d.accentColor || ""}
                    accentForeground={d.accentForeground || ""}
                    onSave={(ac, af) => accentMutation.mutate({ id: d.id, accentColor: ac || null, accentForeground: af || null })}
                    isPending={accentMutation.isPending}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface CampaignSummary {
  campaignId: string;
  postCount: number;
  createdAt: string;
  statuses: Record<string, number>;
}

function CampaignHistory({ workspaceId, onSelect }: { workspaceId: string; onSelect: (campaignId: string) => void }) {
  const { data: campaigns = [], isLoading } = useQuery<CampaignSummary[]>({
    queryKey: ["/api/blog/campaigns", workspaceId],
    queryFn: () => adminApi("GET", `/api/blog/campaigns/${workspaceId}`),
    enabled: !!workspaceId,
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground py-4 text-center">Loading campaigns...</div>;
  }

  if (campaigns.length === 0) {
    return <div className="text-sm text-muted-foreground py-4 text-center">No bulk campaigns yet</div>;
  }

  return (
    <div className="space-y-2">
      {campaigns.map((c) => {
        const date = new Date(c.createdAt);
        const generated = c.statuses["generated"] || 0;
        const pending = c.statuses["pending"] || 0;
        const failed = c.statuses["failed"] || 0;
        const needsReview = c.statuses["needs_review"] || 0;

        return (
          <Card
            key={c.campaignId}
            className="cursor-pointer hover-elevate"
            onClick={() => onSelect(c.campaignId)}
            data-testid={`card-campaign-${c.campaignId}`}
          >
            <CardContent className="py-3 px-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">
                    {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.postCount} posts - {c.campaignId.slice(0, 8)}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {generated > 0 && <Badge variant="default">{generated} done</Badge>}
                  {pending > 0 && <Badge variant="secondary">{pending} pending</Badge>}
                  {needsReview > 0 && <Badge variant="outline">{needsReview} review</Badge>}
                  {failed > 0 && <Badge variant="destructive">{failed} failed</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function WorkspaceCombobox({
  workspaces,
  selectedWorkspaceId,
  onSelect,
}: {
  workspaces: any[];
  selectedWorkspaceId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const platformWorkspace = workspaces.find((v) => v.id === "indexflow-platform");
  const clientWorkspaces = workspaces.filter((v) => v.id !== "indexflow-platform");

  const filtered = useMemo(() => {
    if (!search) return clientWorkspaces;
    const q = search.toLowerCase();
    return clientWorkspaces.filter(
      (v) => v.name.toLowerCase().includes(q) || v.id.includes(q)
    );
  }, [clientWorkspaces, search]);

  const totalPages = Math.ceil(filtered.length / VENUE_PAGE_SIZE);
  const paged = filtered.slice(page * VENUE_PAGE_SIZE, (page + 1) * VENUE_PAGE_SIZE);
  const selectedWorkspace = workspaces.find((v) => v.id === selectedWorkspaceId);

  useEffect(() => {
    setPage(0);
  }, [search, clientWorkspaces.length]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          data-testid="button-workspace-selector"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Building2 className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span className="truncate">
              {selectedWorkspace ? selectedWorkspace.name : "Select a workspace..."}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search workspaces..."
            value={search}
            onValueChange={setSearch}
            data-testid="input-workspace-search"
          />
          <CommandList>
            <CommandEmpty>No workspaces found.</CommandEmpty>

            {platformWorkspace && (
              <CommandGroup heading="Platform">
                <CommandItem
                  value={platformWorkspace.id}
                  onSelect={() => {
                    onSelect(platformWorkspace.id);
                    setOpen(false);
                  }}
                  data-testid={`button-workspace-${platformWorkspace.id}`}
                >
                  <Check className={`h-4 w-4 mr-2 ${selectedWorkspaceId === platformWorkspace.id ? "opacity-100" : "opacity-0"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{platformWorkspace.name}</div>
                    <div className="text-xs text-muted-foreground">{platformWorkspace.type}</div>
                  </div>
                </CommandItem>
              </CommandGroup>
            )}

            {platformWorkspace && paged.length > 0 && <CommandSeparator />}

            <CommandGroup heading={`Client workspaces${filtered.length > 0 ? ` (${filtered.length})` : ""}`}>
              {paged.map((v) => (
                <CommandItem
                  key={v.id}
                  value={v.id}
                  onSelect={() => {
                    onSelect(v.id);
                    setOpen(false);
                  }}
                  data-testid={`button-workspace-${v.id}`}
                >
                  <Check className={`h-4 w-4 mr-2 ${selectedWorkspaceId === v.id ? "opacity-100" : "opacity-0"}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.type}</div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 px-3 py-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page === 0}
                    onClick={(e) => { e.stopPropagation(); setPage((p) => p - 1); }}
                    data-testid="button-workspace-prev"
                  >
                    Prev
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={(e) => { e.stopPropagation(); setPage((p) => p + 1); }}
                    data-testid="button-workspace-next"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function InvoicesTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [editingInvoice, setEditingInvoice] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: invoicesList = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices", workspaceId],
    queryFn: () => adminApi("GET", `/api/invoices?workspaceId=${workspaceId}`),
    enabled: !!workspaceId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi("POST", "/api/invoices", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      setIsCreating(false);
      toast({ title: "Invoice created" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => adminApi("PATCH", `/api/invoices/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      setEditingInvoice(null);
      toast({ title: "Invoice updated" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi("DELETE", `/api/invoices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      toast({ title: "Invoice deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    draft: "secondary",
    sent: "outline",
    paid: "default",
    overdue: "destructive",
    cancelled: "secondary",
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-invoices-title">Invoices</h2>
          <p className="text-sm text-muted-foreground">{invoicesList.length} total</p>
        </div>
        <Button onClick={() => setIsCreating(true)} data-testid="button-new-invoice">
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {invoicesList.length === 0 && !isCreating ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Receipt className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-1">No invoices yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create an invoice for content services.</p>
            <Button onClick={() => setIsCreating(true)} data-testid="button-new-invoice-empty">
              <Plus className="h-4 w-4 mr-2" /> New Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {invoicesList.map((inv) => (
            <Card key={inv.id} className="cursor-pointer hover-elevate" onClick={() => setEditingInvoice(inv)} data-testid={`card-invoice-${inv.id}`}>
              <CardContent className="flex items-center justify-between gap-4 py-3 px-4">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{inv.invoiceNumber}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                    <span>{inv.clientName}</span>
                    {inv.issueDate && <span>{new Date(inv.issueDate).toLocaleDateString()}</span>}
                    {inv.total && <span>${Number(inv.total).toFixed(2)}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={statusColors[inv.status] || "secondary"} data-testid={`badge-invoice-status-${inv.id}`}>{inv.status}</Badge>
                  <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(inv.id); }} data-testid={`button-delete-invoice-${inv.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreating || !!editingInvoice} onOpenChange={(open) => { if (!open) { setIsCreating(false); setEditingInvoice(null); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingInvoice ? "Edit Invoice" : "New Invoice"}</DialogTitle>
          </DialogHeader>
          <InvoiceForm
            workspaceId={workspaceId}
            invoice={editingInvoice}
            onSubmit={(data) => {
              if (editingInvoice) {
                updateMutation.mutate({ id: editingInvoice.id, data });
              } else {
                createMutation.mutate(data);
              }
            }}
            isPending={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvoiceForm({ workspaceId, invoice, onSubmit, isPending }: {
  workspaceId: string;
  invoice: Invoice | null;
  onSubmit: (data: any) => void;
  isPending: boolean;
}) {
  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoiceNumber || `INV-${Date.now().toString(36).toUpperCase()}`);
  const [clientName, setClientName] = useState(invoice?.clientName || "");
  const [clientEmail, setClientEmail] = useState(invoice?.clientEmail || "");
  const [status, setStatus] = useState(invoice?.status || "draft");
  const [issueDate, setIssueDate] = useState(invoice?.issueDate || new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(invoice?.dueDate || "");
  const [subtotal, setSubtotal] = useState(invoice?.subtotal || "0");
  const [taxRate, setTaxRate] = useState(invoice?.taxRate || "0");
  const [discount, setDiscount] = useState(invoice?.discount || "0");
  const [notes, setNotes] = useState(invoice?.notes || "");

  const sub = Number(subtotal) || 0;
  const tax = sub * (Number(taxRate) / 100);
  const disc = Number(discount) || 0;
  const totalVal = sub + tax - disc;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Invoice #</Label>
          <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} data-testid="input-invoice-number" />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger data-testid="select-invoice-status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Client Name</Label>
          <Input value={clientName} onChange={(e) => setClientName(e.target.value)} data-testid="input-invoice-client" />
        </div>
        <div>
          <Label>Client Email</Label>
          <Input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} data-testid="input-invoice-email" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Issue Date</Label>
          <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} data-testid="input-invoice-issue-date" />
        </div>
        <div>
          <Label>Due Date</Label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} data-testid="input-invoice-due-date" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Subtotal</Label>
          <Input type="number" value={subtotal} onChange={(e) => setSubtotal(e.target.value)} data-testid="input-invoice-subtotal" />
        </div>
        <div>
          <Label>Tax Rate (%)</Label>
          <Input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} data-testid="input-invoice-tax" />
        </div>
        <div>
          <Label>Discount</Label>
          <Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} data-testid="input-invoice-discount" />
        </div>
      </div>
      <div className="bg-muted/50 rounded-md p-3 text-sm">
        <div className="flex justify-between"><span>Subtotal:</span><span>${sub.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax:</span><span>${tax.toFixed(2)}</span></div>
        {disc > 0 && <div className="flex justify-between"><span>Discount:</span><span>-${disc.toFixed(2)}</span></div>}
        <div className="flex justify-between font-semibold border-t mt-1 pt-1"><span>Total:</span><span>${totalVal.toFixed(2)}</span></div>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} data-testid="input-invoice-notes" />
      </div>
      <DialogFooter>
        <Button
          onClick={() => onSubmit({
            workspaceId,
            invoiceNumber,
            clientName,
            clientEmail: clientEmail || null,
            status,
            issueDate: issueDate || null,
            dueDate: dueDate || null,
            subtotal: sub.toString(),
            taxRate: (Number(taxRate) || 0).toString(),
            taxAmount: tax.toString(),
            discount: disc.toString(),
            total: totalVal.toString(),
            notes: notes || null,
          })}
          disabled={isPending || !clientName.trim()}
          data-testid="button-save-invoice"
        >
          {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {invoice ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </div>
  );
}

function ReportsTab({ workspaceId }: { workspaceId: string }) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const { data: reportsList = [], isLoading } = useQuery<ContentReport[]>({
    queryKey: ["/api/content-reports", workspaceId],
    queryFn: () => adminApi("GET", `/api/content-reports?workspaceId=${workspaceId}`),
    enabled: !!workspaceId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => adminApi("POST", "/api/content-reports", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-reports"] });
      setIsCreating(false);
      toast({ title: "Report created" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi("DELETE", `/api/content-reports/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content-reports"] });
      toast({ title: "Report deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const statusColors: Record<string, "default" | "secondary" | "outline"> = {
    draft: "secondary",
    generated: "default",
    sent: "outline",
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">Loading reports...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold" data-testid="text-reports-title">Content Reports</h2>
          <p className="text-sm text-muted-foreground">{reportsList.length} total</p>
        </div>
        <Button onClick={() => setIsCreating(true)} data-testid="button-new-report">
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      {reportsList.length === 0 && !isCreating ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-1">No reports yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create a content performance report.</p>
            <Button onClick={() => setIsCreating(true)} data-testid="button-new-report-empty">
              <Plus className="h-4 w-4 mr-2" /> New Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {reportsList.map((report) => (
            <Card key={report.id} className="hover-elevate" data-testid={`card-report-${report.id}`}>
              <CardContent className="flex items-center justify-between gap-4 py-3 px-4">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{report.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                    <span>{report.type}</span>
                    {report.period && <span>{report.period}</span>}
                    {report.postsPublished != null && <span>{report.postsPublished} posts</span>}
                    {report.totalWords != null && <span>{report.totalWords?.toLocaleString()} words</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {report.trafficChange && (
                    <Badge variant="outline" className="text-xs" data-testid={`badge-traffic-${report.id}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {Number(report.trafficChange) > 0 ? "+" : ""}{report.trafficChange}%
                    </Badge>
                  )}
                  <Badge variant={statusColors[report.status] || "secondary"} data-testid={`badge-report-status-${report.id}`}>{report.status}</Badge>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(report.id)} data-testid={`button-delete-report-${report.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Content Report</DialogTitle>
          </DialogHeader>
          <ReportForm
            workspaceId={workspaceId}
            onSubmit={(data) => createMutation.mutate(data)}
            isPending={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReportForm({ workspaceId, onSubmit, isPending }: {
  workspaceId: string;
  onSubmit: (data: any) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("monthly");
  const [period, setPeriod] = useState("");
  const [summary, setSummary] = useState("");
  const [postsPublished, setPostsPublished] = useState("0");
  const [totalWords, setTotalWords] = useState("0");

  return (
    <div className="space-y-4">
      <div>
        <Label>Report Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., February 2026 Content Report" data-testid="input-report-title" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger data-testid="select-report-type"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Period</Label>
          <Input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="e.g., Feb 2026" data-testid="input-report-period" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Posts Published</Label>
          <Input type="number" value={postsPublished} onChange={(e) => setPostsPublished(e.target.value)} data-testid="input-report-posts" />
        </div>
        <div>
          <Label>Total Words</Label>
          <Input type="number" value={totalWords} onChange={(e) => setTotalWords(e.target.value)} data-testid="input-report-words" />
        </div>
      </div>
      <div>
        <Label>Summary</Label>
        <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} placeholder="Performance summary..." data-testid="input-report-summary" />
      </div>
      <DialogFooter>
        <Button
          onClick={() => onSubmit({
            workspaceId,
            title,
            type,
            status: "draft",
            period: period || null,
            summary: summary || null,
            postsPublished: Number(postsPublished) || 0,
            totalWords: Number(totalWords) || 0,
            avgWordCount: Number(postsPublished) > 0 ? Math.round(Number(totalWords) / Number(postsPublished)) : 0,
          })}
          disabled={isPending || !title.trim()}
          data-testid="button-save-report"
        >
          {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Create Report
        </Button>
      </DialogFooter>
    </div>
  );
}

export default function AdminContent() {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("indexflow-platform");
  const [editingPost, setEditingPost] = useState<WorkspaceBlogPost | null | "new">(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"posts" | "domains" | "campaigns">("posts");
  const [guideOpen, setGuideOpen] = useState(false);

  const { data: workspaces = [] } = useQuery<any[]>({
    queryKey: ["/api/workspaces"],
    queryFn: () => adminApi("GET", "/api/workspaces"),
  });

  useEffect(() => {
    if (workspaces.length > 0 && !workspaces.find((v) => v.id === selectedWorkspaceId)) {
      const platform = workspaces.find((v) => v.id === "indexflow-platform");
      setSelectedWorkspaceId(platform ? platform.id : workspaces[0].id);
    }
  }, [workspaces, selectedWorkspaceId]);

  const selectedWorkspace = workspaces.find((v) => v.id === selectedWorkspaceId);
  const hasValidWorkspace = selectedWorkspace !== undefined;

  return (
    <AdminLayout>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Content Engine</h1>
          <p className="text-sm text-muted-foreground">White-label blog management for client workspaces</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setGuideOpen(!guideOpen)}
          data-testid="button-toggle-guide"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          How it works
        </Button>
      </div>

      <Collapsible open={guideOpen} onOpenChange={setGuideOpen}>
        <CollapsibleContent>
          <Card className="mb-6">
            <CardContent className="p-4 text-sm">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-md bg-muted/50 p-3" data-testid="text-reference-title">
                  <p className="font-semibold mb-1">What is this?</p>
                  <p className="text-muted-foreground" data-testid="text-reference-desc">A white-label blog system. Create and publish posts on behalf of client workspaces. Each workspace's blog lives on their own domain.</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="font-semibold mb-1">Creating Content</p>
                  <p className="text-muted-foreground">Write posts manually with MDX editor, or use Bulk Generate to create multiple drafts at once with AI.</p>
                </div>
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="font-semibold mb-1">Review Flow</p>
                  <p className="text-muted-foreground">AI generates ~2000-word posts. Quality gates check word count, headings, FAQ. You review then approve, schedule, or regenerate.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <div className="mb-6 max-w-md">
        <WorkspaceCombobox
          workspaces={workspaces}
          selectedWorkspaceId={selectedWorkspaceId}
          onSelect={(id) => {
            setSelectedWorkspaceId(id);
            setActiveCampaignId(null);
            setEditingPost(null);
          }}
        />
      </div>

      {editingPost !== null && hasValidWorkspace ? (
        <PostEditor
          post={editingPost === "new" ? null : editingPost}
          workspaceId={selectedWorkspaceId}
          onBack={() => {
            setEditingPost(null);
          }}
        />
      ) : hasValidWorkspace ? (
        activeCampaignId ? (
          <div>
            <Button variant="ghost" onClick={() => setActiveCampaignId(null)} className="mb-4" data-testid="button-back-to-posts">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <DraftQueue
              workspaceId={selectedWorkspaceId}
              campaignId={activeCampaignId}
              onEdit={(post) => setEditingPost(post)}
            />
          </div>
        ) : (
          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="posts" data-testid="tab-posts">
                <FileText className="h-4 w-4 mr-2" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="campaigns" data-testid="tab-campaigns">
                <History className="h-4 w-4 mr-2" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="domains" data-testid="tab-domains">
                <Globe className="h-4 w-4 mr-2" />
                Domains
              </TabsTrigger>
              <TabsTrigger value="invoices" data-testid="tab-invoices">
                <Receipt className="h-4 w-4 mr-2" />
                Invoices
              </TabsTrigger>
              <TabsTrigger value="reports" data-testid="tab-reports">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <PostsList
                workspaceId={selectedWorkspaceId}
                onEdit={(post) => setEditingPost(post)}
                onNew={() => setEditingPost("new")}
                onBulkGenerate={() => setBulkModalOpen(true)}
              />
            </TabsContent>

            <TabsContent value="campaigns">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold" data-testid="text-campaigns-title">Campaign History</h2>
                  <p className="text-sm text-muted-foreground">Browse past bulk generation campaigns</p>
                </div>
                <CampaignHistory
                  workspaceId={selectedWorkspaceId}
                  onSelect={(id) => setActiveCampaignId(id)}
                />
              </div>
            </TabsContent>

            <TabsContent value="domains">
              <DomainManager workspaceId={selectedWorkspaceId} />
            </TabsContent>

            <TabsContent value="invoices">
              <InvoicesTab workspaceId={selectedWorkspaceId} />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsTab workspaceId={selectedWorkspaceId} />
            </TabsContent>
          </Tabs>
        )
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-1">Select a workspace</p>
            <p className="text-sm text-muted-foreground">Pick a workspace from the dropdown above to manage its blog.</p>
          </CardContent>
        </Card>
      )}

      {hasValidWorkspace && (
        <BulkGenerateModal
          workspaceId={selectedWorkspaceId}
          open={bulkModalOpen}
          onOpenChange={setBulkModalOpen}
          onCreated={(campaignId) => setActiveCampaignId(campaignId)}
        />
      )}
    </AdminLayout>
  );
}
