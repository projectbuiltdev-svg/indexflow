import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useWorkspace } from "@/lib/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Save, Eye, FileText, Image, Tag, X,
  Calendar, Clock, Maximize2, Sparkles, Globe, Loader2,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function PostEditor() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/:workspaceId/content/posts/:postId/edit");
  const { selectedWorkspace } = useWorkspace();
  const { toast } = useToast();
  const postId = params?.postId || "";
  const wsId = selectedWorkspace?.id || params?.workspaceId || "";
  const isNew = postId === "new";

  const { data: allPosts, isLoading } = useQuery<any[]>({
    queryKey: ["/api/blog/posts", wsId],
    queryFn: async () => {
      const res = await fetch(`/api/blog/posts?workspaceId=${wsId}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    },
    enabled: !!wsId && !isNew,
  });

  const existing = allPosts?.find((p: any) => p.id === postId) || null;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("general");
  const [schemaType, setSchemaType] = useState("Article");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [content, setContent] = useState("");
  const [subTab, setSubTab] = useState<"editor" | "images">("editor");
  const [previewMode, setPreviewMode] = useState<"preview" | "html">("preview");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (existing && !initialized) {
      setTitle(existing.title || "");
      setSlug(existing.slug || "");
      setCategory(existing.category || "general");
      setSchemaType(existing.schemaType || "Article");
      setDescription(existing.description || "");
      setTags(existing.tags || []);
      setContent(existing.mdxContent || "");
      setInitialized(true);
    }
  }, [existing, initialized]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isNew) {
        return apiRequest("POST", "/api/blog/posts", data);
      } else {
        return apiRequest("PUT", `/api/blog/posts/${postId}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/blog/posts/${postId}/publish-now`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
      toast({ title: "Post published", description: `"${title}" is now live.` });
    },
  });

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    const payload: any = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      category,
      schemaType,
      description,
      tags,
      mdxContent: content,
      status: "draft",
      workspaceId: wsId,
    };
    try {
      await saveMutation.mutateAsync(payload);
      toast({ title: "Draft saved", description: `"${title}" has been saved.` });
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    if (isNew) {
      await handleSaveDraft();
    }
    try {
      await publishMutation.mutateAsync();
      toast({ title: "Post published", description: `"${title}" is now live.` });
    } catch {
      toast({ title: "Publish failed", variant: "destructive" });
    }
  };

  const autoSlug = () => {
    if (title && !slug) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const [imageGenerating, setImageGenerating] = useState(false);

  const handleAiGenerateImages = async () => {
    if (!content.trim()) {
      toast({ title: "No content", description: "Write some content first before generating images.", variant: "destructive" });
      return;
    }

    setImageGenerating(true);
    try {
      const lines = content.split("\n");
      const alreadyHasImages = lines.some(l => l.includes("<BlogImage") || /!\[.*\]\(http/.test(l));
      if (alreadyHasImages) {
        toast({ title: "Images already present", description: "This post already contains images or image placeholders." });
        setImageGenerating(false);
        return;
      }

      let wordCount = 0;
      const insertions: Array<{ lineIndex: number; prompt: string }> = [];
      let lastHeading = title || "professional business";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(/^#{1,3}\s+/)) {
          lastHeading = line.replace(/^#{1,3}\s+/, "").trim();
        }
        const words = line.trim().split(/\s+/).filter(Boolean).length;
        wordCount += words;

        if (wordCount >= 250 && i < lines.length - 2) {
          const prompt = lastHeading.replace(/[^a-zA-Z0-9\s,]/g, "").trim();
          insertions.push({ lineIndex: i, prompt: prompt || "professional business workplace" });
          wordCount = 0;
        }
      }

      if (insertions.length === 0) {
        toast({ title: "Content too short", description: "Need at least 250 words to insert images." });
        setImageGenerating(false);
        return;
      }

      const newLines = [...lines];
      let offset = 0;
      for (const ins of insertions) {
        const placeholder = `\n<BlogImage prompt="${ins.prompt}" />\n`;
        newLines.splice(ins.lineIndex + 1 + offset, 0, placeholder);
        offset++;
      }
      const updatedContent = newLines.join("\n");
      setContent(updatedContent);

      const savePayload: any = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        category,
        schemaType,
        description,
        tags,
        mdxContent: updatedContent,
        status: existing?.status || "draft",
        workspaceId: wsId,
      };

      if (isNew) {
        await apiRequest("POST", "/api/blog/posts", savePayload);
      } else {
        await apiRequest("PUT", `/api/blog/posts/${postId}`, savePayload);
      }

      toast({ title: "Placeholders inserted", description: `Added ${insertions.length} image placeholder${insertions.length > 1 ? "s" : ""}. Resolving stock images...` });

      if (!isNew && postId) {
        try {
          const resolveRes = await apiRequest("POST", `/api/blog/posts/${postId}/process-images`);
          const data = await resolveRes.json();

          if (data.images && data.images.length > 0) {
            const imagePayload = data.images.map((img: any) => ({
              src: "",
              alt: img.alt,
              caption: img.caption,
              searchQuery: img.searchQuery,
            }));

            const searchResults: Array<{ src: string; alt: string; caption: string; credit: string; creditUrl: string }> = [];
            for (const img of data.images) {
              const query = img.searchQuery || img.prompt;
              const searchRes = await fetch(`/api/workspaces/${wsId}/images/search?source=pixabay&q=${encodeURIComponent(query)}&page=1`);
              if (searchRes.ok) {
                const results = await searchRes.json();
                if (results.length > 0) {
                  const pick = results[Math.floor(Math.random() * Math.min(5, results.length))];
                  searchResults.push({
                    src: pick.full_url || pick.thumb_url,
                    alt: img.alt,
                    caption: img.caption || "",
                    credit: pick.credit_name || "",
                    creditUrl: pick.credit_url || "",
                  });
                  continue;
                }
              }
              searchResults.push({ src: "", alt: img.alt, caption: "", credit: "", creditUrl: "" });
            }

            const validImages = searchResults.filter(i => i.src);
            if (validImages.length > 0) {
              await apiRequest("POST", `/api/blog/posts/${postId}/apply-images`, { images: searchResults });
              queryClient.invalidateQueries({ queryKey: ["/api/blog/posts"] });
              toast({ title: "Images resolved", description: `${validImages.length} stock image${validImages.length > 1 ? "s" : ""} applied to the post.` });

              const refreshRes = await fetch(`/api/blog/posts?workspaceId=${wsId}`);
              if (refreshRes.ok) {
                const posts = await refreshRes.json();
                const updated = posts.find((p: any) => p.id === postId);
                if (updated?.mdxContent) {
                  setContent(updated.mdxContent);
                }
              }
            } else {
              toast({ title: "No stock images found", description: "Placeholders remain — you can manually replace them.", variant: "destructive" });
            }
          }
        } catch (err) {
          toast({ title: "Image processing note", description: "Placeholders added. Stock image resolution requires AI access." });
        }
      }
    } catch (err) {
      toast({ title: "Image generation failed", variant: "destructive" });
    }
    setImageGenerating(false);
  };

  if (isLoading && !isNew) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isNew && !isLoading && !existing) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" onClick={() => navigate(`/${wsId}/content/posts`)} data-testid="button-back-to-posts">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Post not found. It may have been deleted or the ID is invalid.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Button variant="ghost" onClick={() => navigate(`/${wsId}/content/posts`)} data-testid="button-back-to-posts">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>
        <div className="flex items-center gap-2">
          {existing && (
            <Badge variant={existing.status === "published" ? "default" : "secondary"} data-testid="badge-post-status">
              {existing.status}
            </Badge>
          )}
          <Button variant="outline" onClick={handleSaveDraft} disabled={saveMutation.isPending} data-testid="button-save-draft">
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Draft
          </Button>
          <Button onClick={handlePublish} disabled={publishMutation.isPending} data-testid="button-publish-now">
            {publishMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
            Publish Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
          <Input
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={autoSlug}
            data-testid="input-post-title"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Slug</label>
          <Input
            placeholder="url-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            data-testid="input-post-slug"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="select-post-category"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="SEO">SEO</SelectItem>
              <SelectItem value="Technical SEO">Technical SEO</SelectItem>
              <SelectItem value="Content">Content</SelectItem>
              <SelectItem value="Link Building">Link Building</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Schema Markup</label>
          <Select value={schemaType} onValueChange={setSchemaType}>
            <SelectTrigger data-testid="select-post-schema"><SelectValue placeholder="Schema" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Article">Article</SelectItem>
              <SelectItem value="BlogPosting">BlogPosting</SelectItem>
              <SelectItem value="HowTo">HowTo</SelectItem>
              <SelectItem value="FAQPage">FAQPage</SelectItem>
              <SelectItem value="LocalBusiness">LocalBusiness</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Meta Description</label>
        <Input
          placeholder="Short description for SEO"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          data-testid="input-post-description"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
        {tags.map((tag, i) => (
          <Badge key={i} variant="secondary" className="gap-1" data-testid={`badge-tag-${i}`}>
            {tag}
            <X className="h-3 w-3 cursor-pointer" onClick={() => setTags(tags.filter((_, idx) => idx !== i))} />
          </Badge>
        ))}
        <Input
          placeholder="Add tag + Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          className="w-40 h-7 border-dashed"
          data-testid="input-post-tag"
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-48" data-testid="input-post-schedule" />
        </div>
        <Button variant="outline" size="sm" disabled={!scheduleDate} data-testid="button-schedule">
          <Clock className="h-4 w-4 mr-1" />
          Schedule
        </Button>
        <Button variant="outline" size="sm" data-testid="button-ai-assist">
          <Sparkles className="h-4 w-4 mr-1" />
          AI Assist
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={subTab === "editor" ? "default" : "outline"}
          size="sm"
          onClick={() => setSubTab("editor")}
          data-testid="button-tab-editor"
        >
          <FileText className="h-4 w-4 mr-1" />
          Editor + Preview
        </Button>
        <Button
          variant={subTab === "images" ? "default" : "outline"}
          size="sm"
          onClick={() => setSubTab("images")}
          data-testid="button-tab-images"
        >
          <Image className="h-4 w-4 mr-1" />
          Images
        </Button>
      </div>

      {subTab === "editor" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">MDX Editor</span>
              <Button variant="ghost" size="icon" data-testid="button-fullscreen-editor"><Maximize2 className="h-4 w-4" /></Button>
            </div>
            <Textarea
              placeholder="Write your MDX content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[450px] font-mono text-sm"
              data-testid="textarea-mdx-editor"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
              <div className="flex items-center gap-2">
                <Select value={previewMode} onValueChange={(v: any) => setPreviewMode(v)}>
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
            <Card className="min-h-[450px]">
              <CardContent className="p-4">
                {content ? (
                  previewMode === "preview" ? (
                    <div className="prose dark:prose-invert max-w-none text-sm whitespace-pre-wrap" data-testid="preview-content">
                      {content}
                    </div>
                  ) : (
                    <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground" data-testid="preview-html">
                      {content}
                    </pre>
                  )
                ) : (
                  <p className="text-muted-foreground text-sm" data-testid="text-preview-empty">Preview will appear here...</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="min-h-[450px]">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-1">Post Images</h3>
            <p className="text-sm text-muted-foreground mb-4">Upload or generate images for this post</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" data-testid="button-upload-image">Upload Image</Button>
              <Button variant="outline" onClick={handleAiGenerateImages} disabled={imageGenerating} data-testid="button-generate-image">
                {imageGenerating ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Sparkles className="h-4 w-4 mr-1" />}
                {imageGenerating ? "Generating..." : "AI Generate"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
