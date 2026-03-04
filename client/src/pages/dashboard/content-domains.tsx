import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/lib/workspace-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
import { Plus, CheckCircle, Pencil, Trash2, Search, Lock } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";
import type { WorkspaceDomain } from "@shared/schema";

function statusFromDomain(d: WorkspaceDomain): string {
  if (d.isPrimary) return "Verified";
  return "Pending";
}

function statusVariant(status: string): "default" | "secondary" | "destructive" {
  if (status === "Verified") return "default";
  if (status === "Pending") return "secondary";
  return "destructive";
}

export default function ContentDomains() {
  const { toast } = useToast();
  const { selectedWorkspace } = useWorkspace();
  const workspaceId = selectedWorkspace?.id || "";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [addOpen, setAddOpen] = useState(false);
  const [addDomain, setAddDomain] = useState("");
  const [addNotes, setAddNotes] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editDomainItem, setEditDomainItem] = useState<WorkspaceDomain | null>(null);
  const [editDomainName, setEditDomainName] = useState("");

  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeDomain, setRemoveDomain] = useState<WorkspaceDomain | null>(null);

  const { data: domains = [], isLoading } = useQuery<WorkspaceDomain[]>({
    queryKey: ["/api/blog/domains", `?workspaceId=${workspaceId}`],
    enabled: !!workspaceId,
  });

  const firstDomainId = domains.length > 0 ? domains[0].id : null;
  const { data: lockStatus } = useQuery<{ locked: boolean; reason: string | null }>({
    queryKey: [`/api/blog/domains/${firstDomainId}/lock-status`],
    enabled: !!firstDomainId,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { domain: string; workspaceId: string }) => {
      const res = await apiRequest("POST", "/api/blog/domains", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/domains"] });
      setAddOpen(false);
      setAddDomain("");
      setAddNotes("");
      toast({ title: "Domain added", description: `"${addDomain}" has been added and is pending verification.` });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to add domain", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await apiRequest("PATCH", `/api/blog/domains/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/domains"] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to update domain", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/blog/domains/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog/domains"] });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to remove domain", description: err.message, variant: "destructive" });
    },
  });

  const domainsWithStatus = domains.map((d) => ({
    ...d,
    displayStatus: statusFromDomain(d),
  }));

  const filtered = domainsWithStatus.filter((d) => {
    if (search && !d.domain.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && d.displayStatus !== statusFilter) return false;
    return true;
  });

  const handleAddDomain = () => {
    if (!addDomain.trim() || !workspaceId) return;
    createMutation.mutate({ domain: addDomain.trim(), workspaceId });
  };

  const handleVerify = (domain: WorkspaceDomain) => {
    updateMutation.mutate(
      { id: domain.id, data: { isPrimary: true } },
      {
        onSuccess: () => {
          toast({ title: "Verification initiated", description: `DNS verification started for "${domain.domain}".` });
        },
      },
    );
  };

  const handleEditDomain = (domain: WorkspaceDomain) => {
    setEditDomainItem(domain);
    setEditDomainName(domain.domain);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editDomainItem || !editDomainName.trim()) return;
    updateMutation.mutate(
      { id: editDomainItem.id, data: {} },
      {
        onSuccess: () => {
          setEditOpen(false);
          setEditDomainItem(null);
          toast({ title: "Domain updated", description: `Domain settings have been updated.` });
        },
      },
    );
  };

  const handleRemoveConfirm = () => {
    if (!removeDomain) return;
    const domainName = removeDomain.domain;
    deleteMutation.mutate(removeDomain.id, {
      onSuccess: () => {
        setRemoveOpen(false);
        setRemoveDomain(null);
        toast({ title: "Domain removed", description: `"${domainName}" has been removed.` });
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <ContentEngineTabs />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Domains</h1>
        <Button data-testid="button-add-domain" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Domain
        </Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search domains..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-domains"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Domains</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {workspaceId ? "No domains found" : "Select a workspace to view domains"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((d) => (
                    <TableRow key={d.id} data-testid={`row-domain-${d.id}`}>
                      <TableCell className="font-medium" data-testid={`text-domain-${d.id}`}>
                        <span className="flex items-center gap-1.5">
                          {d.domain}
                          {lockStatus?.locked && (
                            <Lock className="w-3.5 h-3.5 text-amber-500" data-testid={`icon-lock-domain-${d.id}`} />
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(d.displayStatus)} data-testid={`badge-domain-status-${d.id}`}>{d.displayStatus}</Badge>
                      </TableCell>
                      <TableCell data-testid={`text-template-${d.id}`}>{d.blogTemplate}</TableCell>
                      <TableCell className="text-muted-foreground">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : ""}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Button variant="ghost" size="icon" data-testid={`button-verify-domain-${d.id}`} onClick={() => handleVerify(d)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-edit-domain-${d.id}`} onClick={() => handleEditDomain(d)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-remove-domain-${d.id}`} disabled={lockStatus?.locked} title={lockStatus?.locked ? "Domain locked — upgrade to Pro to change your domain" : undefined} onClick={() => { setRemoveDomain(d); setRemoveOpen(true); }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-testid="dialog-add-domain">
          <DialogHeader>
            <DialogTitle>Add Domain</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-domain-name">Domain Name</Label>
              <Input id="add-domain-name" placeholder="example.com" value={addDomain} onChange={(e) => setAddDomain(e.target.value)} data-testid="input-add-domain-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-domain-notes">Notes</Label>
              <Textarea id="add-domain-notes" placeholder="Optional notes..." value={addNotes} onChange={(e) => setAddNotes(e.target.value)} data-testid="input-add-domain-notes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} data-testid="button-cancel-add-domain">Cancel</Button>
            <Button onClick={handleAddDomain} disabled={createMutation.isPending} data-testid="button-save-add-domain">
              {createMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-testid="dialog-edit-domain">
          <DialogHeader>
            <DialogTitle>Edit Domain</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-domain-name">Domain Name</Label>
              <Input id="edit-domain-name" value={editDomainName} onChange={(e) => setEditDomainName(e.target.value)} data-testid="input-edit-domain-name" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-domain">Cancel</Button>
            <Button onClick={handleEditSave} disabled={updateMutation.isPending} data-testid="button-save-edit-domain">
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent data-testid="dialog-remove-domain">
          <DialogHeader>
            <DialogTitle>Remove Domain</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to remove "{removeDomain?.domain}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveOpen(false)} data-testid="button-cancel-remove-domain">Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveConfirm} disabled={deleteMutation.isPending} data-testid="button-confirm-remove-domain">
              {deleteMutation.isPending ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
