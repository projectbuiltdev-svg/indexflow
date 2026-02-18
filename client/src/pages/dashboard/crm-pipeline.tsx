import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, LayoutGrid, List, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Deal {
  id: number;
  name: string;
  value: number;
  closeDate: string;
  stage: string;
}

const initialDeals: Deal[] = [
  { id: 1, name: "James Carter", value: 4500, closeDate: "2026-03-15", stage: "leads" },
  { id: 2, name: "Olivia Martinez", value: 3200, closeDate: "2026-03-20", stage: "leads" },
  { id: 3, name: "Noah Williams", value: 6800, closeDate: "2026-04-01", stage: "leads" },
  { id: 4, name: "Emma Thompson", value: 12000, closeDate: "2026-03-10", stage: "demo" },
  { id: 5, name: "Liam Anderson", value: 8500, closeDate: "2026-03-25", stage: "demo" },
  { id: 6, name: "Sophia Davis", value: 15000, closeDate: "2026-02-28", stage: "proposal" },
  { id: 7, name: "Mason Garcia", value: 9200, closeDate: "2026-03-05", stage: "proposal" },
  { id: 8, name: "Ava Robinson", value: 22000, closeDate: "2026-02-12", stage: "closed" },
];

const stages = [
  { key: "leads", label: "Leads", color: "text-blue-700 dark:text-blue-400", borderColor: "border-t-blue-500" },
  { key: "demo", label: "Demo", color: "text-purple-700 dark:text-purple-400", borderColor: "border-t-purple-500" },
  { key: "proposal", label: "Proposal", color: "text-orange-700 dark:text-orange-400", borderColor: "border-t-orange-500" },
  { key: "closed", label: "Closed Won", color: "text-green-700 dark:text-green-400", borderColor: "border-t-green-500" },
];

export default function CrmPipeline() {
  const { selectedWorkspace } = useWorkspace();
  const { toast } = useToast();
  const [view, setView] = useState<"board" | "list">("board");
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [formName, setFormName] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formStage, setFormStage] = useState("leads");

  const resetForm = () => {
    setFormName("");
    setFormValue("");
    setFormDate("");
    setFormStage("leads");
  };

  const handleAddOpen = () => {
    resetForm();
    setAddOpen(true);
  };

  const handleAddDeal = () => {
    const newDeal: Deal = {
      id: Math.max(0, ...deals.map((d) => d.id)) + 1,
      name: formName,
      value: parseFloat(formValue) || 0,
      closeDate: formDate,
      stage: formStage,
    };
    setDeals([...deals, newDeal]);
    setAddOpen(false);
    toast({ title: "Deal Added", description: `${formName} has been added to the pipeline.` });
  };

  const handleEditOpen = (deal: Deal) => {
    setSelectedDeal(deal);
    setFormName(deal.name);
    setFormValue(deal.value.toString());
    setFormDate(deal.closeDate);
    setFormStage(deal.stage);
    setEditOpen(true);
  };

  const handleEditDeal = () => {
    if (!selectedDeal) return;
    setDeals(deals.map((d) => d.id === selectedDeal.id ? { ...d, name: formName, value: parseFloat(formValue) || 0, closeDate: formDate, stage: formStage } : d));
    setEditOpen(false);
    toast({ title: "Deal Updated", description: `${formName} has been updated.` });
  };

  const handleDeleteOpen = (deal: Deal) => {
    setSelectedDeal(deal);
    setDeleteOpen(true);
  };

  const handleDeleteDeal = () => {
    if (!selectedDeal) return;
    setDeals(deals.filter((d) => d.id !== selectedDeal.id));
    setDeleteOpen(false);
    toast({ title: "Deal Deleted", description: `${selectedDeal.name} has been removed from the pipeline.` });
  };

  const handleCardClick = (deal: Deal) => {
    handleEditOpen(deal);
  };

  const dealForm = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Contact name" data-testid="input-deal-name" />
      </div>
      <div className="space-y-2">
        <Label>Value ($)</Label>
        <Input type="number" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Deal value" data-testid="input-deal-value" />
      </div>
      <div className="space-y-2">
        <Label>Close Date</Label>
        <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} data-testid="input-deal-date" />
      </div>
      <div className="space-y-2">
        <Label>Stage</Label>
        <Select value={formStage} onValueChange={setFormStage}>
          <SelectTrigger data-testid="select-deal-stage">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stages.map((s) => (
              <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Sales Pipeline</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center border rounded-md">
            <Button
              variant={view === "board" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("board")}
              data-testid="button-board-view"
              className="rounded-r-none"
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              Board
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              data-testid="button-list-view"
              className="rounded-l-none"
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
          </div>
          <Button data-testid="button-add-deal" onClick={handleAddOpen}>
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto" data-testid="pipeline-board">
        <div className="flex gap-4 min-w-[900px]">
          {stages.map((col) => {
            const colDeals = deals.filter((d) => d.stage === col.key);
            const totalValue = colDeals.reduce((s, d) => s + d.value, 0);
            return (
              <div key={col.key} className="flex-1 min-w-[220px]" data-testid={`column-${col.key}`}>
                <Card className={`border-t-4 ${col.borderColor}`}>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-semibold ${col.color}`} data-testid={`text-column-title-${col.key}`}>
                        {col.label}
                      </h3>
                      <span className="text-xs text-muted-foreground" data-testid={`text-column-count-${col.key}`}>
                        {colDeals.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {colDeals.map((deal) => (
                        <Card key={deal.id} className="hover-elevate cursor-pointer" data-testid={`card-deal-${deal.id}`} onClick={() => handleCardClick(deal)}>
                          <CardContent className="p-3 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className="font-medium text-sm" data-testid={`text-deal-name-${deal.id}`}>{deal.name}</p>
                              <div className="flex items-center gap-0.5" style={{ visibility: "visible" }}>
                                <Button variant="ghost" size="icon" className="h-6 w-6" data-testid={`button-edit-deal-${deal.id}`} onClick={(e) => { e.stopPropagation(); handleEditOpen(deal); }}>
                                  <Pencil className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-6 w-6" data-testid={`button-delete-deal-${deal.id}`} onClick={(e) => { e.stopPropagation(); handleDeleteOpen(deal); }}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm font-semibold" data-testid={`text-deal-value-${deal.id}`}>
                              ${deal.value.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground" data-testid={`text-deal-date-${deal.id}`}>
                              Close: {deal.closeDate}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="pt-2 border-t text-xs text-muted-foreground flex items-center justify-between gap-2">
                      <span>{colDeals.length} deal{colDeals.length !== 1 ? "s" : ""}</span>
                      <span className="font-medium" data-testid={`text-column-total-${col.key}`}>
                        ${totalValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
          </DialogHeader>
          {dealForm}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} data-testid="button-cancel-add-deal">Cancel</Button>
            <Button onClick={handleAddDeal} data-testid="button-confirm-add-deal">Add Deal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          {dealForm}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-deal">Cancel</Button>
            <Button onClick={handleEditDeal} data-testid="button-confirm-edit-deal">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Deal</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <span className="font-medium">{selectedDeal?.name}</span>? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-deal">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteDeal} data-testid="button-confirm-delete-deal">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
