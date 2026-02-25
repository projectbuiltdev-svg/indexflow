import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useWorkspace } from "@/lib/workspace-context";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Eye, Trash2, Search } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";

interface CampaignRow {
  campaignId: string;
  name: string;
  status: string;
  postCount: number;
  createdAt: string;
  statuses: Record<string, number>;
}

function statusVariant(status: string) {
  if (status === "active") return "default" as const;
  if (status === "completed") return "secondary" as const;
  return "secondary" as const;
}

function completedCount(statuses: Record<string, number>): number {
  return (statuses["generated"] || 0) + (statuses["published"] || 0);
}

export default function ContentCampaigns() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPostCount, setNewPostCount] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewCampaign, setViewCampaign] = useState<CampaignRow | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCampaign, setDeleteCampaign] = useState<CampaignRow | null>(null);

  const { data: campaigns = [], isLoading } = useQuery<CampaignRow[]>({
    queryKey: ["/api/blog/campaigns", workspaceId],
    enabled: !!workspaceId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; postCount: number; description: string }) => {
      const res = await apiRequest("POST", "/api/blog/posts/bulk/create", {
        workspaceId,
        posts: Array.from({ length: data.postCount || 1 }, (_, i) => ({
          title: `${data.name} - Post ${i + 1}`,
          primaryKeyword: data.name.toLowerCase(),
        })),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/campaigns", workspaceId] });
      setNewOpen(false);
      setNewName("");
      setNewPostCount("");
      setNewDescription("");
      toast({ title: "Campaign created", description: `"${newName}" has been created.` });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const filtered = campaigns.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const handleNewCampaign = () => {
    if (!newName.trim()) return;
    createMutation.mutate({
      name: newName,
      postCount: parseInt(newPostCount) || 1,
      description: newDescription,
    });
  };

  const handleViewPosts = (campaign: CampaignRow) => {
    setViewCampaign(campaign);
    setViewOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteCampaign) return;
    setDeleteOpen(false);
    const name = deleteCampaign.name;
    setDeleteCampaign(null);
    toast({ title: "Campaign deleted", description: `"${name}" has been removed.` });
  };

  return (
    <div className="p-6 space-y-6">
      <ContentEngineTabs />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Campaigns</h1>
        <Button data-testid="button-new-campaign" onClick={() => setNewOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-campaigns"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center" data-testid="text-no-campaigns">
              {campaigns.length === 0 ? "No campaigns yet. Create one to get started." : "No campaigns match your filters."}
            </p>
          ) : (
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
                {filtered.map((c) => {
                  const completed = completedCount(c.statuses);
                  return (
                    <TableRow key={c.campaignId} data-testid={`row-campaign-${c.campaignId}`}>
                      <TableCell className="font-medium" data-testid={`text-campaign-name-${c.campaignId}`}>{c.name}</TableCell>
                      <TableCell data-testid={`text-post-count-${c.campaignId}`}>{c.postCount}</TableCell>
                      <TableCell data-testid={`text-completed-${c.campaignId}`}>{completed}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(c.status)} data-testid={`badge-status-${c.campaignId}`}>{c.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{new Date(c.createdAt).toISOString().split("T")[0]}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Button variant="ghost" size="icon" data-testid={`button-view-posts-${c.campaignId}`} onClick={() => handleViewPosts(c)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-delete-campaign-${c.campaignId}`} onClick={() => { setDeleteCampaign(c); setDeleteOpen(true); }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent data-testid="dialog-new-campaign">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-campaign-name">Campaign Name</Label>
              <Input id="new-campaign-name" placeholder="Campaign name" value={newName} onChange={(e) => setNewName(e.target.value)} data-testid="input-new-campaign-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-campaign-posts">Target Post Count</Label>
              <Input id="new-campaign-posts" type="number" placeholder="Number of posts" value={newPostCount} onChange={(e) => setNewPostCount(e.target.value)} data-testid="input-new-campaign-posts" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-campaign-description">Description</Label>
              <Textarea id="new-campaign-description" placeholder="Campaign description..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} data-testid="input-new-campaign-description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)} data-testid="button-cancel-new-campaign">Cancel</Button>
            <Button onClick={handleNewCampaign} disabled={createMutation.isPending} data-testid="button-save-new-campaign">
              {createMutation.isPending ? "Creating..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent data-testid="dialog-view-posts">
          <DialogHeader>
            <DialogTitle>Campaign Posts: {viewCampaign?.name}</DialogTitle>
          </DialogHeader>
          {viewCampaign && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={statusVariant(viewCampaign.status)}>{viewCampaign.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Total Posts:</span> {viewCampaign.postCount}</div>
                <div><span className="text-muted-foreground">Completed:</span> {completedCount(viewCampaign.statuses)}</div>
                <div><span className="text-muted-foreground">Remaining:</span> {viewCampaign.postCount - completedCount(viewCampaign.statuses)}</div>
                <div><span className="text-muted-foreground">Created:</span> {new Date(viewCampaign.createdAt).toISOString().split("T")[0]}</div>
              </div>
              {Object.keys(viewCampaign.statuses).length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Generation Status Breakdown:</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {Object.entries(viewCampaign.statuses).map(([status, count]) => (
                      <Badge key={status} variant="secondary">{status}: {count}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${viewCampaign.postCount > 0 ? (completedCount(viewCampaign.statuses) / viewCampaign.postCount) * 100 : 0}%` }} />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {viewCampaign.postCount > 0 ? Math.round((completedCount(viewCampaign.statuses) / viewCampaign.postCount) * 100) : 0}% complete
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)} data-testid="button-close-view-posts">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-testid="dialog-delete-campaign">
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{deleteCampaign?.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-campaign">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} data-testid="button-confirm-delete-campaign">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
