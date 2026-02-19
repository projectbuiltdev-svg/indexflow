import { useState } from "react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Play, Trash2, Search } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";

const initialCampaigns = [
  { id: 1, name: "Spring Product Launch", postCount: 12, completed: 8, status: "Active", created: "2026-01-15" },
  { id: 2, name: "SEO Content Series", postCount: 20, completed: 20, status: "Completed", created: "2025-11-01" },
  { id: 3, name: "Weekly Blog Updates", postCount: 8, completed: 5, status: "Active", created: "2026-02-01" },
  { id: 4, name: "Social Media Blitz", postCount: 15, completed: 0, status: "Paused", created: "2026-01-20" },
  { id: 5, name: "Customer Success Stories", postCount: 6, completed: 3, status: "Active", created: "2026-02-10" },
];

type Campaign = typeof initialCampaigns[number];

function statusVariant(status: string) {
  if (status === "Active") return "default";
  if (status === "Completed") return "secondary";
  return "secondary";
}

export default function ContentCampaigns() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPostCount, setNewPostCount] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewCampaign, setViewCampaign] = useState<Campaign | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteCampaign, setDeleteCampaign] = useState<Campaign | null>(null);

  const filtered = campaigns.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const handleNewCampaign = () => {
    if (!newName.trim()) return;
    const newId = Math.max(...campaigns.map((c) => c.id), 0) + 1;
    setCampaigns([...campaigns, {
      id: newId,
      name: newName,
      postCount: parseInt(newPostCount) || 0,
      completed: 0,
      status: "Active",
      created: new Date().toISOString().split("T")[0],
    }]);
    setNewOpen(false);
    setNewName("");
    setNewPostCount("");
    setNewDescription("");
    toast({ title: "Campaign created", description: `"${newName}" has been created.` });
  };

  const handleViewPosts = (campaign: Campaign) => {
    setViewCampaign(campaign);
    setViewOpen(true);
  };

  const handleResume = (campaign: Campaign) => {
    setCampaigns(campaigns.map((c) => (c.id === campaign.id ? { ...c, status: c.status === "Paused" ? "Active" : c.status === "Active" ? "Paused" : c.status } : c)));
    const newStatus = campaign.status === "Paused" ? "Active" : campaign.status === "Active" ? "Paused" : campaign.status;
    toast({ title: "Campaign updated", description: `"${campaign.name}" is now ${newStatus}.` });
  };

  const handleDeleteConfirm = () => {
    if (!deleteCampaign) return;
    setCampaigns(campaigns.filter((c) => c.id !== deleteCampaign.id));
    const name = deleteCampaign.name;
    setDeleteOpen(false);
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
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filtered.map((c) => (
                <TableRow key={c.id} data-testid={`row-campaign-${c.id}`}>
                  <TableCell className="font-medium" data-testid={`text-campaign-name-${c.id}`}>{c.name}</TableCell>
                  <TableCell data-testid={`text-post-count-${c.id}`}>{c.postCount}</TableCell>
                  <TableCell data-testid={`text-completed-${c.id}`}>{c.completed}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(c.status)} data-testid={`badge-status-${c.id}`}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.created}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button variant="ghost" size="icon" data-testid={`button-view-posts-${c.id}`} onClick={() => handleViewPosts(c)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`button-resume-${c.id}`} onClick={() => handleResume(c)}>
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`button-delete-campaign-${c.id}`} onClick={() => { setDeleteCampaign(c); setDeleteOpen(true); }}>
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
            <Button onClick={handleNewCampaign} data-testid="button-save-new-campaign">Save</Button>
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
                <div><span className="text-muted-foreground">Completed:</span> {viewCampaign.completed}</div>
                <div><span className="text-muted-foreground">Remaining:</span> {viewCampaign.postCount - viewCampaign.completed}</div>
                <div><span className="text-muted-foreground">Created:</span> {viewCampaign.created}</div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: `${viewCampaign.postCount > 0 ? (viewCampaign.completed / viewCampaign.postCount) * 100 : 0}%` }} />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {viewCampaign.postCount > 0 ? Math.round((viewCampaign.completed / viewCampaign.postCount) * 100) : 0}% complete
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
