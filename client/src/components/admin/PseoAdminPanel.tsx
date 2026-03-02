import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Layers,
  BarChart3,
  FileText,
  Globe,
  Clock,
  MoreHorizontal,
  Plus,
  Minus,
  Power,
  PowerOff,
  RotateCcw,
  Loader2,
  ShieldCheck,
  Search,
} from "lucide-react";

interface PseoStats {
  totalActiveCampaigns: number;
  pagesGeneratedToday: number;
  pagesPublishedThisMonth: number;
  pendingReviewItems: number;
}

interface WorkspacePseoSummary {
  id: string;
  name: string;
  plan: string;
  pseoAdminOverride: boolean | null;
  pseoEnabled: boolean;
  tierLimit: number | string;
  campaigns: number;
  totalPages: number;
  pagesPublished: number;
  lastActivityAt: string | null;
}

export default function PseoAdminPanel() {
  const { toast } = useToast();
  const [searchFilter, setSearchFilter] = useState("");
  const [grantDialog, setGrantDialog] = useState<{ workspaceId: string; workspaceName: string } | null>(null);
  const [revokeDialog, setRevokeDialog] = useState<{ workspaceId: string; workspaceName: string } | null>(null);
  const [grantQty, setGrantQty] = useState("1");
  const [grantReason, setGrantReason] = useState("");
  const [revokeQty, setRevokeQty] = useState("1");

  const { data: stats, isLoading: statsLoading } = useQuery<PseoStats>({
    queryKey: ["/api/admin/pseo/stats"],
  });

  const { data: workspacesData, isLoading: workspacesLoading } = useQuery<{ workspaces: WorkspacePseoSummary[] }>({
    queryKey: ["/api/admin/pseo/workspaces"],
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean | null }) =>
      apiRequest("POST", `/api/admin/pseo/workspaces/${id}/toggle`, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pseo/workspaces"] });
      toast({ title: "pSEO access updated" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const grantMutation = useMutation({
    mutationFn: ({ id, quantity, reason }: { id: string; quantity: number; reason: string }) =>
      apiRequest("POST", `/api/admin/pseo/workspaces/${id}/grant-slots`, { quantity, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pseo/workspaces"] });
      setGrantDialog(null);
      setGrantQty("1");
      setGrantReason("");
      toast({ title: "Slots granted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const revokeMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      apiRequest("POST", `/api/admin/pseo/workspaces/${id}/revoke-slots`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pseo/workspaces"] });
      setRevokeDialog(null);
      setRevokeQty("1");
      toast({ title: "Slots revoked" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const allWorkspaces = workspacesData?.workspaces || [];
  const filtered = searchFilter
    ? allWorkspaces.filter(
        (ws) =>
          ws.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          ws.plan.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : allWorkspaces;

  const formatDate = (d: string | null) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-pseo-admin-title">pSEO Management</h1>
        <p className="text-sm text-muted-foreground">Platform-wide programmatic SEO administration</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card data-testid="stat-active-campaigns">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{statsLoading ? "-" : stats?.totalActiveCampaigns ?? 0}</p>
              </div>
              <Layers className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-pages-today">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pages Generated Today</p>
                <p className="text-2xl font-bold">{statsLoading ? "-" : stats?.pagesGeneratedToday ?? 0}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-published-month">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published This Month</p>
                <p className="text-2xl font-bold">{statsLoading ? "-" : stats?.pagesPublishedThisMonth ?? 0}</p>
              </div>
              <Globe className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card data-testid="stat-pending-review">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{statsLoading ? "-" : stats?.pendingReviewItems ?? 0}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Workspaces</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workspaces..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-9 h-9"
                data-testid="input-search-workspaces"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {workspacesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>pSEO Status</TableHead>
                  <TableHead className="text-right">Campaigns</TableHead>
                  <TableHead className="text-right">Pages</TableHead>
                  <TableHead className="text-right">Published</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchFilter ? "No workspaces match your search" : "No workspaces found"}
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((ws) => (
                  <TableRow key={ws.id} data-testid={`row-workspace-${ws.id}`}>
                    <TableCell>
                      <div>
                        <span className="font-medium">{ws.name}</span>
                        <span className="text-xs text-muted-foreground ml-2 font-mono">{ws.id.slice(0, 8)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{ws.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      {ws.pseoAdminOverride === true ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Admin Enabled
                        </Badge>
                      ) : ws.pseoAdminOverride === false ? (
                        <Badge variant="destructive">
                          <PowerOff className="h-3 w-3 mr-1" />
                          Admin Disabled
                        </Badge>
                      ) : ws.pseoEnabled ? (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                          Plan: {ws.tierLimit === "unlimited" ? "\u221e" : ws.tierLimit}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Available</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">{ws.campaigns}</TableCell>
                    <TableCell className="text-right font-mono">{ws.totalPages}</TableCell>
                    <TableCell className="text-right font-mono">{ws.pagesPublished}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(ws.lastActivityAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-actions-${ws.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {ws.pseoAdminOverride !== true && (
                            <DropdownMenuItem
                              onClick={() => toggleMutation.mutate({ id: ws.id, enabled: true })}
                              data-testid={`action-enable-${ws.id}`}
                            >
                              <Power className="h-4 w-4 mr-2" />
                              Enable pSEO (admin override)
                            </DropdownMenuItem>
                          )}
                          {ws.pseoAdminOverride !== false && (
                            <DropdownMenuItem
                              onClick={() => toggleMutation.mutate({ id: ws.id, enabled: false })}
                              data-testid={`action-disable-${ws.id}`}
                            >
                              <PowerOff className="h-4 w-4 mr-2" />
                              Disable pSEO (admin override)
                            </DropdownMenuItem>
                          )}
                          {ws.pseoAdminOverride !== null && (
                            <DropdownMenuItem
                              onClick={() => toggleMutation.mutate({ id: ws.id, enabled: null })}
                              data-testid={`action-reset-${ws.id}`}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Reset to plan default
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setGrantDialog({ workspaceId: ws.id, workspaceName: ws.name })}
                            data-testid={`action-grant-${ws.id}`}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Grant bonus slots
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setRevokeDialog({ workspaceId: ws.id, workspaceName: ws.name })}
                            data-testid={`action-revoke-${ws.id}`}
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            Revoke slots
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!grantDialog} onOpenChange={() => setGrantDialog(null)}>
        <DialogContent data-testid="dialog-grant-slots">
          <DialogHeader>
            <DialogTitle>Grant Bonus Campaign Slots</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Granting slots to <span className="font-medium text-foreground">{grantDialog?.workspaceName}</span>
          </p>
          <div className="space-y-3">
            <div>
              <Label htmlFor="grant-qty">Number of Slots</Label>
              <Input
                id="grant-qty"
                type="number"
                min="1"
                value={grantQty}
                onChange={(e) => setGrantQty(e.target.value)}
                data-testid="input-grant-qty"
              />
            </div>
            <div>
              <Label htmlFor="grant-reason">Reason (optional)</Label>
              <Textarea
                id="grant-reason"
                placeholder="e.g. Trial extension, compensation, partnership..."
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                className="min-h-[80px]"
                data-testid="input-grant-reason"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGrantDialog(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (grantDialog) {
                  grantMutation.mutate({
                    id: grantDialog.workspaceId,
                    quantity: parseInt(grantQty) || 1,
                    reason: grantReason,
                  });
                }
              }}
              disabled={grantMutation.isPending}
              data-testid="button-confirm-grant"
            >
              {grantMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Grant {grantQty} Slot{parseInt(grantQty) !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!revokeDialog} onOpenChange={() => setRevokeDialog(null)}>
        <DialogContent data-testid="dialog-revoke-slots">
          <DialogHeader>
            <DialogTitle>Revoke Campaign Slots</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            Revoking slots from <span className="font-medium text-foreground">{revokeDialog?.workspaceName}</span>
          </p>
          <div>
            <Label htmlFor="revoke-qty">Number of Slots to Revoke</Label>
            <Input
              id="revoke-qty"
              type="number"
              min="1"
              value={revokeQty}
              onChange={(e) => setRevokeQty(e.target.value)}
              data-testid="input-revoke-qty"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialog(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (revokeDialog) {
                  revokeMutation.mutate({
                    id: revokeDialog.workspaceId,
                    quantity: parseInt(revokeQty) || 1,
                  });
                }
              }}
              disabled={revokeMutation.isPending}
              data-testid="button-confirm-revoke"
            >
              {revokeMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Revoke {revokeQty} Slot{parseInt(revokeQty) !== 1 ? "s" : ""}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
