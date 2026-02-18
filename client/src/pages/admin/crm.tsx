import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Plus, Search, Users, Target, Presentation, CheckCircle2,
  Phone, Mail, Calendar, Clock, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/admin-layout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CrmDeal } from "@shared/schema";

type PipelineStage = "lead" | "demo" | "proposal" | "closed";

const stageConfig: Record<PipelineStage, { label: string; icon: typeof Users; color: string; bg: string; border: string }> = {
  lead: { label: "Leads", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10 dark:bg-blue-500/20", border: "border-blue-500/30" },
  demo: { label: "Demo Scheduled", icon: Presentation, color: "text-violet-500", bg: "bg-violet-500/10 dark:bg-violet-500/20", border: "border-violet-500/30" },
  proposal: { label: "Proposal Sent", icon: Target, color: "text-amber-500", bg: "bg-amber-500/10 dark:bg-amber-500/20", border: "border-amber-500/30" },
  closed: { label: "Closed Won", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 dark:bg-emerald-500/20", border: "border-emerald-500/30" },
};

const stages: PipelineStage[] = ["lead", "demo", "proposal", "closed"];

export default function AdminCrm() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [selectedDeal, setSelectedDeal] = useState<CrmDeal | null>(null);
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const [newDeal, setNewDeal] = useState({
    businessName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    businessType: "Agency",
    plan: "Complete Solution",
    source: "Website",
    notes: "",
  });

  const { data: deals = [], isLoading } = useQuery<CrmDeal[]>({
    queryKey: ["/api/crm/deals"],
  });

  const createDealMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/crm/deals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      setShowAddDeal(false);
      setNewDeal({ businessName: "", contactName: "", contactEmail: "", contactPhone: "", businessType: "Agency", plan: "Complete Solution", source: "Website", notes: "" });
      toast({ title: "Deal added to pipeline" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to create deal", description: err.message, variant: "destructive" });
    },
  });

  const updateDealMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/crm/deals/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      setSelectedDeal(null);
      toast({ title: "Deal updated" });
    },
  });

  const deleteDealMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/crm/deals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/deals"] });
      setSelectedDeal(null);
      toast({ title: "Deal deleted" });
    },
  });

  const filteredDeals = deals.filter((d: CrmDeal) => {
    const matchesSearch = !searchQuery ||
      (d.businessName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.contactName ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAssignee = filterAssignee === "all" || d.assignedTo === filterAssignee;
    const matchesSource = filterSource === "all" || d.source === filterSource;
    return matchesSearch && matchesAssignee && matchesSource;
  });

  const getStageDeals = (stage: PipelineStage) => filteredDeals.filter((d: CrmDeal) => d.stage === stage);
  const getStageValue = (stage: PipelineStage) => getStageDeals(stage).reduce((sum, d) => sum + Number(d.value || 0), 0);

  const moveDeal = (dealId: number, newStage: PipelineStage) => {
    updateDealMutation.mutate({ id: dealId, data: { stage: newStage } });
  };

  const handleAddDeal = () => {
    const value = newDeal.plan === "Complete Solution" ? "299" : "149";
    createDealMutation.mutate({
      title: newDeal.businessName,
      businessName: newDeal.businessName,
      contactName: newDeal.contactName,
      contactEmail: newDeal.contactEmail,
      contactPhone: newDeal.contactPhone,
      businessType: newDeal.businessType,
      plan: newDeal.plan,
      source: newDeal.source,
      notes: newDeal.notes,
      value,
      stage: "lead",
      assignedTo: "Maria Garcia",
      lastActivity: "Just created",
      nextFollowUp: "TBD",
    });
  };

  const assignees = Array.from(new Set(deals.map((d: CrmDeal) => d.assignedTo).filter(Boolean)));
  const sources = Array.from(new Set(deals.map((d: CrmDeal) => d.source).filter(Boolean)));
  const totalPipelineValue = filteredDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-crm-title">Sales CRM</h1>
            <p className="text-muted-foreground">Manage your sales pipeline and track deals</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "board" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("board")}
                data-testid="button-view-board"
              >
                Board
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                data-testid="button-view-list"
              >
                List
              </Button>
            </div>
            <Button onClick={() => setShowAddDeal(true)} data-testid="button-add-deal">
              <Plus className="h-4 w-4 mr-2" />
              Add Deal
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {stages.map(stage => {
            const config = stageConfig[stage];
            const stageDeals = getStageDeals(stage);
            const value = getStageValue(stage);
            const Icon = config.icon;
            return (
              <div key={stage} className="border rounded-md p-4 space-y-1" data-testid={`stat-stage-${stage}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <span className="text-sm text-muted-foreground">{config.label}</span>
                </div>
                <p className="text-2xl font-semibold">{stageDeals.length}</p>
                <p className="text-xs text-muted-foreground">${value}/mo pipeline</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-deals"
            />
          </div>
          <Select value={filterAssignee} onValueChange={setFilterAssignee}>
            <SelectTrigger className="w-[180px]" data-testid="select-filter-assignee">
              <SelectValue placeholder="All Reps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reps</SelectItem>
              {assignees.map(a => (
                <SelectItem key={a} value={a!}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-[180px]" data-testid="select-filter-source">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sources.map(s => (
                <SelectItem key={s} value={s!}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            Total pipeline: <span className="font-medium text-foreground">${totalPipelineValue}/mo</span>
          </div>
        </div>

        {viewMode === "board" ? (
          <div className="grid grid-cols-4 gap-4" data-testid="pipeline-board">
            {stages.map(stage => {
              const config = stageConfig[stage];
              const stageDeals = getStageDeals(stage);
              const Icon = config.icon;
              return (
                <div key={stage} className="space-y-3">
                  <div className={`flex items-center gap-2 p-2 rounded-md ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                    <span className="text-sm font-medium">{config.label}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">{stageDeals.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {stageDeals.map(deal => (
                      <Card
                        key={deal.id}
                        className="cursor-pointer hover-elevate"
                        onClick={() => setSelectedDeal(deal)}
                        data-testid={`card-deal-${deal.id}`}
                      >
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm">{deal.businessName}</p>
                            <Badge variant="outline" className="text-[10px] shrink-0">{deal.businessType}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{deal.contactName}</p>
                          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                            <span>${Number(deal.value || 0)}/mo</span>
                            <span>{deal.plan}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{deal.lastActivity}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Follow up: {deal.nextFollowUp}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {stageDeals.length === 0 && (
                      <div className="border border-dashed rounded-md p-6 text-center text-xs text-muted-foreground">
                        No deals in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card data-testid="pipeline-list">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3 font-medium text-muted-foreground">Business</th>
                      <th className="p-3 font-medium text-muted-foreground">Contact</th>
                      <th className="p-3 font-medium text-muted-foreground">Stage</th>
                      <th className="p-3 font-medium text-muted-foreground">Plan</th>
                      <th className="p-3 font-medium text-muted-foreground">Value</th>
                      <th className="p-3 font-medium text-muted-foreground">Assigned</th>
                      <th className="p-3 font-medium text-muted-foreground">Follow Up</th>
                      <th className="p-3 font-medium text-muted-foreground">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeals.map(deal => {
                      const config = stageConfig[(deal.stage as PipelineStage) || "lead"];
                      return (
                        <tr
                          key={deal.id}
                          className="border-b last:border-0 cursor-pointer hover-elevate"
                          onClick={() => setSelectedDeal(deal)}
                          data-testid={`row-deal-${deal.id}`}
                        >
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-sm">{deal.businessName}</p>
                              <p className="text-xs text-muted-foreground">{deal.businessType}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="text-sm">{deal.contactName}</p>
                              <p className="text-xs text-muted-foreground">{deal.contactEmail}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className={`text-xs ${config.color} ${config.border}`}>
                              {config.label}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm">{deal.plan}</td>
                          <td className="p-3 text-sm">${Number(deal.value || 0)}/mo</td>
                          <td className="p-3 text-sm text-muted-foreground">{deal.assignedTo}</td>
                          <td className="p-3 text-sm text-muted-foreground whitespace-nowrap">{deal.nextFollowUp}</td>
                          <td className="p-3">
                            <Badge variant="secondary" className="text-xs">{deal.source}</Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={!!selectedDeal} onOpenChange={(open) => !open && setSelectedDeal(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedDeal?.businessName}</DialogTitle>
              <DialogDescription>{selectedDeal?.businessType} - {selectedDeal?.plan}</DialogDescription>
            </DialogHeader>
            {selectedDeal && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="text-sm font-medium">{selectedDeal.contactName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Value</p>
                    <p className="text-sm font-medium">${Number(selectedDeal.value || 0)}/mo</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm">{selectedDeal.contactEmail}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <p className="text-sm">{selectedDeal.contactPhone}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Source</p>
                    <Badge variant="secondary" className="text-xs">{selectedDeal.source}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Assigned To</p>
                    <p className="text-sm">{selectedDeal.assignedTo}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm">{selectedDeal.createdAt ? new Date(selectedDeal.createdAt).toLocaleDateString() : "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Next Follow Up</p>
                    <p className="text-sm">{selectedDeal.nextFollowUp}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Last Activity</p>
                  <p className="text-sm">{selectedDeal.lastActivity}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="text-sm">{selectedDeal.notes}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Move to Stage</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {stages.filter(s => s !== selectedDeal.stage).map(stage => {
                      const config = stageConfig[stage];
                      const Icon = config.icon;
                      return (
                        <Button
                          key={stage}
                          variant="outline"
                          size="sm"
                          onClick={() => moveDeal(selectedDeal.id, stage)}
                          disabled={updateDealMutation.isPending}
                          data-testid={`button-move-${stage}`}
                        >
                          <Icon className={`w-3.5 h-3.5 mr-1.5 ${config.color}`} />
                          {config.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => deleteDealMutation.mutate(selectedDeal.id)}
                    disabled={deleteDealMutation.isPending}
                    data-testid="button-delete-deal"
                  >
                    Delete Deal
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showAddDeal} onOpenChange={setShowAddDeal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Deal</DialogTitle>
              <DialogDescription>Add a new prospect to your sales pipeline</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input
                    value={newDeal.businessName}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="e.g. The Blue Lagoon"
                    data-testid="input-deal-business"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select value={newDeal.businessType} onValueChange={(v) => setNewDeal(prev => ({ ...prev, businessType: v }))}>
                    <SelectTrigger data-testid="select-deal-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agency">Agency</SelectItem>
                      <SelectItem value="Freelancer">Freelancer</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                      <SelectItem value="Startup">Startup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    value={newDeal.contactName}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Full name"
                    data-testid="input-deal-contact"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input
                    value={newDeal.contactEmail}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, contactEmail: e.target.value }))}
                    placeholder="email@example.com"
                    data-testid="input-deal-email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    value={newDeal.contactPhone}
                    onChange={(e) => setNewDeal(prev => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+1 (555) 000-0000"
                    data-testid="input-deal-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Select value={newDeal.plan} onValueChange={(v) => setNewDeal(prev => ({ ...prev, plan: v }))}>
                    <SelectTrigger data-testid="select-deal-plan">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Complete Solution">Complete Solution - $299/mo</SelectItem>
                      <SelectItem value="Widget Only">Widget Only - $149/mo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Lead Source</Label>
                <Select value={newDeal.source} onValueChange={(v) => setNewDeal(prev => ({ ...prev, source: v }))}>
                  <SelectTrigger data-testid="select-deal-source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Cold Call">Cold Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any initial notes about this prospect..."
                  data-testid="input-deal-notes"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDeal(false)} data-testid="button-cancel-deal">
                Cancel
              </Button>
              <Button
                onClick={handleAddDeal}
                disabled={!newDeal.businessName || !newDeal.contactName || createDealMutation.isPending}
                data-testid="button-save-deal"
              >
                {createDealMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add to Pipeline
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
