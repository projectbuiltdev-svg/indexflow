import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Link2, Play, X, Search, Wrench, RefreshCw } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";
import { useWorkspace } from "@/lib/workspace-context";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface LinkSuggestion {
  sourcePostId: string;
  sourceTitle: string;
  sourceSlug: string;
  targetPostId: string;
  targetTitle: string;
  targetSlug: string;
  keyword: string;
  reason: string;
  confidence: number;
}

interface OrphanPost {
  postId: string;
  title: string;
  slug: string;
  inboundLinks: number;
  outboundLinks: number;
}

interface LinkHealthResult {
  postId: string;
  title: string;
  href: string;
  anchorText: string;
  status: "ok" | "broken" | "redirect" | "timeout" | "error";
  statusCode?: number;
  redirectUrl?: string;
}

interface AutoLinkDetail {
  postId: string;
  linksAdded: number;
}

function statusBadgeVariant(status: string): "default" | "secondary" | "destructive" {
  if (status === "ok") return "default";
  if (status === "redirect") return "secondary";
  return "destructive";
}

function statusLabel(result: LinkHealthResult): string {
  if (result.statusCode) return `${result.statusCode}`;
  return result.status.toUpperCase();
}

export default function SeoLinks() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [applyLinkDialogOpen, setApplyLinkDialogOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<LinkSuggestion | null>(null);
  const [maxOccurrences, setMaxOccurrences] = useState("1");

  const suggestionsQuery = useQuery<{ total: number; suggestions: LinkSuggestion[] }>({
    queryKey: ["/api/blog/link-suggestions", `?workspaceId=${workspaceId}`],
    enabled: !!workspaceId,
  });

  const orphanQuery = useQuery<{ totalPosts: number; orphanCount: number; orphans: OrphanPost[] }>({
    queryKey: ["/api/blog/orphan-report", `?workspaceId=${workspaceId}`],
    enabled: !!workspaceId,
  });

  const linkHealthQuery = useQuery<{ totalChecked: number; summary: { ok: number; broken: number; redirects: number; errors: number }; results: LinkHealthResult[] }>({
    queryKey: ["/api/blog/link-health", `?workspaceId=${workspaceId}`],
    enabled: !!workspaceId,
  });

  const applyLinkMutation = useMutation({
    mutationFn: async ({ postId, keyword, targetSlug, maxOcc }: { postId: string; keyword: string; targetSlug: string; maxOcc: number }) => {
      const res = await apiRequest("POST", `/api/blog/posts/${postId}/apply-link`, {
        keyword,
        targetSlug,
        maxOccurrences: maxOcc,
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Link Applied", description: `Applied ${data.linksApplied} link(s) for "${data.keyword}".` });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/link-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/orphan-report"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/link-health"] });
      setApplyLinkDialogOpen(false);
      setSelectedSuggestion(null);
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkAutoLinkMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/blog/bulk-auto-link", {
        workspaceId,
        maxLinksPerPost: 3,
      });
      return res.json();
    },
    onSuccess: (data: { postsUpdated: number; totalLinksAdded: number; details: AutoLinkDetail[] }) => {
      toast({ title: "Auto-Link Complete", description: `${data.totalLinksAdded} links added across ${data.postsUpdated} posts.` });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/link-suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/orphan-report"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog/link-health"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const suggestions = suggestionsQuery.data?.suggestions ?? [];
  const orphans = orphanQuery.data?.orphans ?? [];
  const healthResults = linkHealthQuery.data?.results ?? [];
  const healthSummary = linkHealthQuery.data?.summary;
  const autoLinkDetails = bulkAutoLinkMutation.data?.details ?? [];

  const filteredSuggestions = suggestions
    .filter((s) => !dismissedIds.has(`${s.sourcePostId}-${s.targetPostId}-${s.keyword}`))
    .filter(
      (s) =>
        s.sourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.targetTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.keyword.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredHealth = healthResults.filter(
    (l) =>
      l.href.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.anchorText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDismissSuggestion = (s: LinkSuggestion) => {
    setDismissedIds((prev) => new Set(prev).add(`${s.sourcePostId}-${s.targetPostId}-${s.keyword}`));
    toast({ title: "Suggestion Dismissed", description: "The suggestion has been removed." });
  };

  const handleApplyLinkOpen = (s: LinkSuggestion) => {
    setSelectedSuggestion(s);
    setMaxOccurrences("1");
    setApplyLinkDialogOpen(true);
  };

  const handleApplyLinkConfirm = () => {
    if (!selectedSuggestion) return;
    applyLinkMutation.mutate({
      postId: selectedSuggestion.sourcePostId,
      keyword: selectedSuggestion.keyword,
      targetSlug: selectedSuggestion.targetSlug,
      maxOcc: parseInt(maxOccurrences) || 1,
    });
  };

  const handleRefreshSuggestions = () => {
    suggestionsQuery.refetch();
    toast({ title: "Refreshing", description: "Fetching latest link suggestions..." });
  };

  const handleRefreshHealth = () => {
    linkHealthQuery.refetch();
    toast({ title: "Checking Links", description: "Running link health checks..." });
  };

  const isLoading = suggestionsQuery.isLoading || orphanQuery.isLoading || linkHealthQuery.isLoading;

  return (
    <div className="p-6 space-y-6">
      <ContentEngineTabs />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Link Builder</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[200px]"
              data-testid="input-search-links"
            />
          </div>
          <Button variant="outline" onClick={handleRefreshSuggestions} disabled={suggestionsQuery.isFetching} data-testid="button-suggest-links">
            <Search className="w-4 h-4 mr-2" />
            Suggest Links
          </Button>
        </div>
      </div>

      {!workspaceId && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Please select a workspace to view link data.
          </CardContent>
        </Card>
      )}

      {workspaceId && (
        <Tabs defaultValue="suggestions" data-testid="tabs-links">
          <TabsList>
            <TabsTrigger value="suggestions" data-testid="tab-suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="auto-link" data-testid="tab-auto-link">Auto-Link</TabsTrigger>
            <TabsTrigger value="orphan" data-testid="tab-orphan">Orphan Report</TabsTrigger>
            <TabsTrigger value="health" data-testid="tab-health">Link Health</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions">
            <Card>
              <CardHeader>
                <CardTitle>Link Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                {suggestionsQuery.isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : filteredSuggestions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center" data-testid="text-no-suggestions">No link suggestions found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source Post</TableHead>
                        <TableHead>Target Post</TableHead>
                        <TableHead>Anchor Text</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuggestions.map((s, idx) => (
                        <TableRow key={`${s.sourcePostId}-${s.targetPostId}-${s.keyword}-${idx}`} data-testid={`row-suggestion-${idx}`}>
                          <TableCell className="font-medium">{s.sourceTitle}</TableCell>
                          <TableCell>{s.targetTitle}</TableCell>
                          <TableCell className="text-muted-foreground">{s.keyword}</TableCell>
                          <TableCell data-testid={`text-relevance-${idx}`}>{Math.round(s.confidence * 100)}%</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 flex-wrap">
                              <Button variant="ghost" size="icon" onClick={() => handleApplyLinkOpen(s)} data-testid={`button-apply-link-${idx}`}>
                                <Link2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDismissSuggestion(s)} data-testid={`button-dismiss-${idx}`}>
                                <X className="w-4 h-4" />
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
          </TabsContent>

          <TabsContent value="auto-link">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle>Auto-Link Results</CardTitle>
                <Button onClick={() => bulkAutoLinkMutation.mutate()} disabled={bulkAutoLinkMutation.isPending} data-testid="button-run-auto-link">
                  <Play className="w-4 h-4 mr-2" />
                  {bulkAutoLinkMutation.isPending ? "Running..." : "Run Bulk Auto-Link"}
                </Button>
              </CardHeader>
              <CardContent>
                {bulkAutoLinkMutation.data && (
                  <div className="mb-4 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground" data-testid="text-auto-link-summary">
                    Last run: {bulkAutoLinkMutation.data.totalLinksAdded} links added across {bulkAutoLinkMutation.data.postsUpdated} posts
                  </div>
                )}
                {bulkAutoLinkMutation.isPending && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                )}
                {autoLinkDetails.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Post ID</TableHead>
                        <TableHead>Links Added</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {autoLinkDetails.map((r, idx) => (
                        <TableRow key={r.postId} data-testid={`row-autolink-${idx}`}>
                          <TableCell className="font-medium font-mono text-sm">{r.postId}</TableCell>
                          <TableCell data-testid={`text-links-added-${idx}`}>{r.linksAdded}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {!bulkAutoLinkMutation.data && !bulkAutoLinkMutation.isPending && (
                  <p className="text-sm text-muted-foreground py-4 text-center" data-testid="text-auto-link-empty">
                    Click "Run Bulk Auto-Link" to automatically add internal links across your posts.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orphan">
            <Card>
              <CardHeader>
                <CardTitle>
                  Orphan Report
                  {orphanQuery.data && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({orphanQuery.data.orphanCount} orphans out of {orphanQuery.data.totalPosts} posts)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orphanQuery.isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : orphans.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center" data-testid="text-no-orphans">No orphan posts found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Post Title</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Inbound Links</TableHead>
                        <TableHead>Outbound Links</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orphans.map((o, idx) => (
                        <TableRow key={o.postId} data-testid={`row-orphan-${idx}`}>
                          <TableCell className="font-medium">{o.title}</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-sm">{o.slug}</TableCell>
                          <TableCell data-testid={`text-incoming-links-${idx}`}>{o.inboundLinks}</TableCell>
                          <TableCell>{o.outboundLinks}</TableCell>
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
              <CardHeader className="flex flex-row items-center justify-between gap-2">
                <CardTitle>
                  Link Health
                  {healthSummary && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      ({healthSummary.ok} ok, {healthSummary.broken} broken, {healthSummary.redirects} redirects, {healthSummary.errors} errors)
                    </span>
                  )}
                </CardTitle>
                <Button onClick={handleRefreshHealth} disabled={linkHealthQuery.isFetching} data-testid="button-check-all-links">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check All Links
                </Button>
              </CardHeader>
              <CardContent>
                {linkHealthQuery.isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : filteredHealth.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center" data-testid="text-no-links">No links found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Post</TableHead>
                        <TableHead>Anchor Text</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHealth.map((l, idx) => (
                        <TableRow key={`${l.postId}-${l.href}-${idx}`} data-testid={`row-link-health-${idx}`}>
                          <TableCell className="font-medium text-sm max-w-[200px] truncate">{l.href}</TableCell>
                          <TableCell>
                            <Badge variant={statusBadgeVariant(l.status)} data-testid={`badge-link-status-${idx}`}>
                              {statusLabel(l)}
                            </Badge>
                          </TableCell>
                          <TableCell>{l.title}</TableCell>
                          <TableCell className="text-muted-foreground">{l.anchorText}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={applyLinkDialogOpen} onOpenChange={setApplyLinkDialogOpen}>
        <DialogContent data-testid="dialog-apply-link">
          <DialogHeader>
            <DialogTitle>Apply Link</DialogTitle>
          </DialogHeader>
          {selectedSuggestion && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <p className="text-sm"><span className="text-muted-foreground">Source:</span> {selectedSuggestion.sourceTitle}</p>
                <p className="text-sm"><span className="text-muted-foreground">Target:</span> {selectedSuggestion.targetTitle}</p>
                <p className="text-sm"><span className="text-muted-foreground">Keyword:</span> {selectedSuggestion.keyword}</p>
                <p className="text-sm"><span className="text-muted-foreground">Reason:</span> {selectedSuggestion.reason}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-occurrences">Max Occurrences</Label>
                <Input
                  id="max-occurrences"
                  type="number"
                  min="1"
                  max="10"
                  value={maxOccurrences}
                  onChange={(e) => setMaxOccurrences(e.target.value)}
                  data-testid="input-max-occurrences"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setApplyLinkDialogOpen(false)} data-testid="button-cancel-apply-link">Cancel</Button>
            <Button onClick={handleApplyLinkConfirm} disabled={applyLinkMutation.isPending} data-testid="button-confirm-apply-link">
              {applyLinkMutation.isPending ? "Applying..." : "Apply Link"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
