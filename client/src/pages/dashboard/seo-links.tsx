import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link2, Play, X, Search, Wrench, Trash2, RefreshCw, Plus, Pencil } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";

const initialSuggestions = [
  { id: 1, source: "10 SEO Tips for 2026", target: "Keyword Research Guide", anchor: "keyword research", relevance: 92 },
  { id: 2, source: "Content Marketing 101", target: "Blog Writing Best Practices", anchor: "writing tips", relevance: 87 },
  { id: 3, source: "Technical SEO Checklist", target: "Site Speed Optimization", anchor: "page speed", relevance: 85 },
  { id: 4, source: "Link Building Strategies", target: "Outreach Templates", anchor: "outreach guide", relevance: 80 },
  { id: 5, source: "Local SEO Guide", target: "Google Business Profile Tips", anchor: "GBP optimization", relevance: 78 },
];

const initialAutoLinkResults = [
  { id: 1, post: "Getting Started with SEO", linksAdded: 4, details: "Added links to Keyword Research, On-Page SEO, Technical SEO, Analytics" },
  { id: 2, post: "Content Strategy Framework", linksAdded: 3, details: "Added links to Editorial Calendar, Content Types, Distribution" },
  { id: 3, post: "Social Media Integration", linksAdded: 2, details: "Added links to Platform Guide, Analytics Dashboard" },
];

const initialOrphanPosts = [
  { id: 1, title: "Advanced Schema Markup", published: "2026-01-28", incomingLinks: 0 },
  { id: 2, title: "Voice Search Optimization", published: "2026-01-15", incomingLinks: 0 },
  { id: 3, title: "E-commerce SEO Tips", published: "2025-12-20", incomingLinks: 0 },
];

const initialLinkHealth = [
  { id: 1, url: "https://example.com/services", status: 200, post: "About Our Services", anchor: "our services", lastChecked: "2026-02-18" },
  { id: 2, url: "https://example.com/old-page", status: 301, post: "Company History", anchor: "learn more", lastChecked: "2026-02-18" },
  { id: 3, url: "https://external.com/resource", status: 404, post: "Resource Guide", anchor: "external resource", lastChecked: "2026-02-17" },
  { id: 4, url: "https://example.com/blog/tips", status: 200, post: "SEO Blog", anchor: "read tips", lastChecked: "2026-02-18" },
];

function statusBadgeVariant(status: number): "default" | "secondary" | "destructive" {
  if (status === 200) return "default";
  if (status === 301) return "secondary";
  return "destructive";
}

export default function SeoLinks() {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [autoLinkResults, setAutoLinkResults] = useState(initialAutoLinkResults);
  const [orphanPosts, setOrphanPosts] = useState(initialOrphanPosts);
  const [linkHealth, setLinkHealth] = useState(initialLinkHealth);
  const [searchQuery, setSearchQuery] = useState("");

  const [addLinkOpen, setAddLinkOpen] = useState(false);
  const [editLinkOpen, setEditLinkOpen] = useState(false);
  const [deleteLinkOpen, setDeleteLinkOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<typeof initialLinkHealth[0] | null>(null);

  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkPost, setNewLinkPost] = useState("");
  const [newLinkAnchor, setNewLinkAnchor] = useState("");
  const [newLinkStatus, setNewLinkStatus] = useState("200");

  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [editLinkPost, setEditLinkPost] = useState("");
  const [editLinkAnchor, setEditLinkAnchor] = useState("");

  const filteredLinkHealth = linkHealth.filter(
    (l) =>
      l.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.post.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.anchor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.anchor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuggestLinks = () => {
    toast({ title: "Suggestions Generated", description: "5 new link suggestions have been found." });
  };

  const handleApplyLink = (id: number) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Link Applied", description: "The suggested link has been added to your content." });
  };

  const handleDismissSuggestion = (id: number) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    toast({ title: "Suggestion Dismissed", description: "The suggestion has been removed." });
  };

  const handleRunAutoLink = () => {
    toast({ title: "Auto-Link Complete", description: "9 links added across 3 posts." });
  };

  const handleFindOpportunities = (id: number) => {
    toast({ title: "Opportunities Found", description: `Found 3 linking opportunities for this post.` });
  };

  const handleCheckAllLinks = () => {
    setLinkHealth((prev) => prev.map((l) => ({ ...l, lastChecked: "2026-02-18" })));
    toast({ title: "Link Check Complete", description: `Checked ${linkHealth.length} links.` });
  };

  const handleAddLink = () => {
    if (!newLinkUrl || !newLinkPost || !newLinkAnchor) return;
    const newId = Math.max(...linkHealth.map((l) => l.id), 0) + 1;
    setLinkHealth((prev) => [
      ...prev,
      { id: newId, url: newLinkUrl, status: parseInt(newLinkStatus), post: newLinkPost, anchor: newLinkAnchor, lastChecked: "2026-02-18" },
    ]);
    setAddLinkOpen(false);
    setNewLinkUrl("");
    setNewLinkPost("");
    setNewLinkAnchor("");
    setNewLinkStatus("200");
    toast({ title: "Link Added", description: "New link has been added successfully." });
  };

  const handleEditLinkOpen = (link: typeof initialLinkHealth[0]) => {
    setSelectedLink(link);
    setEditLinkUrl(link.url);
    setEditLinkPost(link.post);
    setEditLinkAnchor(link.anchor);
    setEditLinkOpen(true);
  };

  const handleEditLinkSave = () => {
    if (!selectedLink) return;
    setLinkHealth((prev) =>
      prev.map((l) =>
        l.id === selectedLink.id ? { ...l, url: editLinkUrl, post: editLinkPost, anchor: editLinkAnchor } : l
      )
    );
    setEditLinkOpen(false);
    setSelectedLink(null);
    toast({ title: "Link Updated", description: "The link has been updated successfully." });
  };

  const handleDeleteLinkOpen = (link: typeof initialLinkHealth[0]) => {
    setSelectedLink(link);
    setDeleteLinkOpen(true);
  };

  const handleDeleteLinkConfirm = () => {
    if (!selectedLink) return;
    setLinkHealth((prev) => prev.filter((l) => l.id !== selectedLink.id));
    setDeleteLinkOpen(false);
    setSelectedLink(null);
    toast({ title: "Link Removed", description: "The link has been removed successfully." });
  };

  const handleFixLink = (id: number) => {
    setLinkHealth((prev) => prev.map((l) => (l.id === id ? { ...l, status: 200 } : l)));
    toast({ title: "Link Fixed", description: "The link has been repaired." });
  };

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
          <Button variant="outline" onClick={handleSuggestLinks} data-testid="button-suggest-links">
            <Search className="w-4 h-4 mr-2" />
            Suggest Links
          </Button>
          <Button onClick={() => setAddLinkOpen(true)} data-testid="button-add-link">
            <Plus className="w-4 h-4 mr-2" />
            Add Link
          </Button>
        </div>
      </div>

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source Post</TableHead>
                    <TableHead>Target Post</TableHead>
                    <TableHead>Anchor Text</TableHead>
                    <TableHead>Relevance Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuggestions.map((s) => (
                    <TableRow key={s.id} data-testid={`row-suggestion-${s.id}`}>
                      <TableCell className="font-medium">{s.source}</TableCell>
                      <TableCell>{s.target}</TableCell>
                      <TableCell className="text-muted-foreground">{s.anchor}</TableCell>
                      <TableCell data-testid={`text-relevance-${s.id}`}>{s.relevance}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Button variant="ghost" size="icon" onClick={() => handleApplyLink(s.id)} data-testid={`button-apply-link-${s.id}`}>
                            <Link2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDismissSuggestion(s.id)} data-testid={`button-dismiss-${s.id}`}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-link">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>Auto-Link Results</CardTitle>
              <Button onClick={handleRunAutoLink} data-testid="button-run-auto-link">
                <Play className="w-4 h-4 mr-2" />
                Run Bulk Auto-Link
              </Button>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground" data-testid="text-auto-link-summary">
                Last run: 9 links added across 3 posts
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post</TableHead>
                    <TableHead>Links Added</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {autoLinkResults.map((r) => (
                    <TableRow key={r.id} data-testid={`row-autolink-${r.id}`}>
                      <TableCell className="font-medium">{r.post}</TableCell>
                      <TableCell data-testid={`text-links-added-${r.id}`}>{r.linksAdded}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{r.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orphan">
          <Card>
            <CardHeader>
              <CardTitle>Orphan Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post Title</TableHead>
                    <TableHead>Published Date</TableHead>
                    <TableHead>Incoming Links</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orphanPosts.map((o) => (
                    <TableRow key={o.id} data-testid={`row-orphan-${o.id}`}>
                      <TableCell className="font-medium">{o.title}</TableCell>
                      <TableCell className="text-muted-foreground">{o.published}</TableCell>
                      <TableCell data-testid={`text-incoming-links-${o.id}`}>{o.incomingLinks}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleFindOpportunities(o.id)} data-testid={`button-find-opportunities-${o.id}`}>
                          <Search className="w-4 h-4 mr-1" />
                          Find Opportunities
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>Link Health</CardTitle>
              <Button onClick={handleCheckAllLinks} data-testid="button-check-all-links">
                <RefreshCw className="w-4 h-4 mr-2" />
                Check All Links
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Post</TableHead>
                    <TableHead>Anchor Text</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinkHealth.map((l) => (
                    <TableRow key={l.id} data-testid={`row-link-health-${l.id}`}>
                      <TableCell className="font-medium text-sm max-w-[200px] truncate">{l.url}</TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(l.status)} data-testid={`badge-link-status-${l.id}`}>{l.status}</Badge>
                      </TableCell>
                      <TableCell>{l.post}</TableCell>
                      <TableCell className="text-muted-foreground">{l.anchor}</TableCell>
                      <TableCell className="text-muted-foreground">{l.lastChecked}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Button variant="ghost" size="icon" onClick={() => handleFixLink(l.id)} data-testid={`button-fix-link-${l.id}`}>
                            <Wrench className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditLinkOpen(l)} data-testid={`button-edit-link-${l.id}`}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteLinkOpen(l)} data-testid={`button-remove-link-${l.id}`}>
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
        </TabsContent>
      </Tabs>

      <Dialog open={addLinkOpen} onOpenChange={setAddLinkOpen}>
        <DialogContent data-testid="dialog-add-link">
          <DialogHeader>
            <DialogTitle>Add Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-link-url">URL</Label>
              <Input id="new-link-url" value={newLinkUrl} onChange={(e) => setNewLinkUrl(e.target.value)} placeholder="https://example.com/page" data-testid="input-new-link-url" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-link-post">Post</Label>
              <Input id="new-link-post" value={newLinkPost} onChange={(e) => setNewLinkPost(e.target.value)} placeholder="Post title" data-testid="input-new-link-post" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-link-anchor">Anchor Text</Label>
              <Input id="new-link-anchor" value={newLinkAnchor} onChange={(e) => setNewLinkAnchor(e.target.value)} placeholder="click here" data-testid="input-new-link-anchor" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newLinkStatus} onValueChange={setNewLinkStatus}>
                <SelectTrigger data-testid="select-new-link-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="200">200 OK</SelectItem>
                  <SelectItem value="301">301 Redirect</SelectItem>
                  <SelectItem value="404">404 Not Found</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddLinkOpen(false)} data-testid="button-cancel-add-link">Cancel</Button>
            <Button onClick={handleAddLink} data-testid="button-save-add-link">Add Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editLinkOpen} onOpenChange={setEditLinkOpen}>
        <DialogContent data-testid="dialog-edit-link">
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-link-url">URL</Label>
              <Input id="edit-link-url" value={editLinkUrl} onChange={(e) => setEditLinkUrl(e.target.value)} data-testid="input-edit-link-url" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-link-post">Post</Label>
              <Input id="edit-link-post" value={editLinkPost} onChange={(e) => setEditLinkPost(e.target.value)} data-testid="input-edit-link-post" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-link-anchor">Anchor Text</Label>
              <Input id="edit-link-anchor" value={editLinkAnchor} onChange={(e) => setEditLinkAnchor(e.target.value)} data-testid="input-edit-link-anchor" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLinkOpen(false)} data-testid="button-cancel-edit-link">Cancel</Button>
            <Button onClick={handleEditLinkSave} data-testid="button-save-edit-link">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteLinkOpen} onOpenChange={setDeleteLinkOpen}>
        <DialogContent data-testid="dialog-delete-link">
          <DialogHeader>
            <DialogTitle>Delete Link</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Are you sure you want to remove the link to <span className="font-medium text-foreground">{selectedLink?.url}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteLinkOpen(false)} data-testid="button-cancel-delete-link">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteLinkConfirm} data-testid="button-confirm-delete-link">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
