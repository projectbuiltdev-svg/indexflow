import { useState } from "react";
import { useWorkspace } from "@/lib/workspace-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, MoreHorizontal, Eye, Pencil, Send, CheckCircle, Download, Trash2, FileText, Clock, DollarSign, AlertTriangle, Search } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";

const initialInvoices = [
  { id: "INV-2026-042", client: "BrightPath Marketing", amount: 2500, tax: 250, total: 2750, status: "Paid", dueDate: "2026-01-15", notes: "" },
  { id: "INV-2026-043", client: "TechVista Solutions", amount: 4800, tax: 480, total: 5280, status: "Sent", dueDate: "2026-02-20", notes: "" },
  { id: "INV-2026-044", client: "GreenLeaf Organics", amount: 1500, tax: 150, total: 1650, status: "Draft", dueDate: "2026-02-28", notes: "" },
  { id: "INV-2026-045", client: "Nova Design Studio", amount: 3200, tax: 320, total: 3520, status: "Overdue", dueDate: "2026-01-30", notes: "" },
  { id: "INV-2026-046", client: "Summit Legal Group", amount: 6000, tax: 600, total: 6600, status: "Paid", dueDate: "2026-02-10", notes: "" },
];

const statCards = [
  { label: "Draft", icon: FileText, color: "text-muted-foreground" },
  { label: "Sent", icon: Send, color: "text-blue-600" },
  { label: "Paid", icon: DollarSign, color: "text-green-600" },
  { label: "Overdue", icon: AlertTriangle, color: "text-red-600" },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "Draft":
      return "secondary" as const;
    case "Sent":
      return "outline" as const;
    case "Paid":
      return "default" as const;
    case "Overdue":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

export default function SeoInvoices() {
  const { selectedWorkspace } = useWorkspace();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof initialInvoices[0] | null>(null);

  const [formClient, setFormClient] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formTax, setFormTax] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formStatus, setFormStatus] = useState("Draft");
  const [formNotes, setFormNotes] = useState("");

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStats = () => {
    return statCards.map((stat) => {
      const matching = invoices.filter((inv) => inv.status === stat.label);
      const count = matching.length;
      const amount = matching.reduce((sum, inv) => sum + inv.total, 0);
      return { ...stat, count, amount: `$${amount.toLocaleString()}` };
    });
  };

  const stats = getStats();

  const handleCreateInvoice = () => {
    const amount = parseFloat(formAmount) || 0;
    const tax = parseFloat(formTax) || 0;
    if (!formClient || !formAmount || !formDueDate) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    const nextNum = invoices.length + 42 + 1;
    const newInvoice = {
      id: `INV-2026-${String(nextNum).padStart(3, "0")}`,
      client: formClient,
      amount,
      tax,
      total: amount + tax,
      status: formStatus,
      dueDate: formDueDate,
      notes: formNotes,
    };
    setInvoices((prev) => [...prev, newInvoice]);
    setCreateOpen(false);
    resetForm();
    toast({ title: "Invoice Created", description: `Invoice ${newInvoice.id} has been created.` });
  };

  const handleEditOpen = (inv: typeof initialInvoices[0]) => {
    setSelectedInvoice(inv);
    setFormClient(inv.client);
    setFormAmount(String(inv.amount));
    setFormTax(String(inv.tax));
    setFormDueDate(inv.dueDate);
    setFormStatus(inv.status);
    setFormNotes(inv.notes);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedInvoice) return;
    const amount = parseFloat(formAmount) || 0;
    const tax = parseFloat(formTax) || 0;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? { ...inv, client: formClient, amount, tax, total: amount + tax, dueDate: formDueDate, status: formStatus, notes: formNotes }
          : inv
      )
    );
    setEditOpen(false);
    resetForm();
    toast({ title: "Invoice Updated", description: `Invoice ${selectedInvoice.id} has been updated.` });
  };

  const handleDeleteOpen = (inv: typeof initialInvoices[0]) => {
    setSelectedInvoice(inv);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedInvoice) return;
    setInvoices((prev) => prev.filter((inv) => inv.id !== selectedInvoice.id));
    setDeleteOpen(false);
    toast({ title: "Invoice Deleted", description: `Invoice ${selectedInvoice.id} has been deleted.` });
    setSelectedInvoice(null);
  };

  const handleViewOpen = (inv: typeof initialInvoices[0]) => {
    setSelectedInvoice(inv);
    setViewOpen(true);
  };

  const handleSendInvoice = (inv: typeof initialInvoices[0]) => {
    setInvoices((prev) => prev.map((i) => (i.id === inv.id ? { ...i, status: "Sent" } : i)));
    toast({ title: "Invoice Sent", description: `Invoice ${inv.id} has been sent to ${inv.client}.` });
  };

  const handleMarkPaid = (inv: typeof initialInvoices[0]) => {
    setInvoices((prev) => prev.map((i) => (i.id === inv.id ? { ...i, status: "Paid" } : i)));
    toast({ title: "Marked as Paid", description: `Invoice ${inv.id} has been marked as paid.` });
  };

  const handleDownload = (inv: typeof initialInvoices[0]) => {
    toast({ title: "Download Started", description: `Downloading PDF for invoice ${inv.id}.` });
  };

  const resetForm = () => {
    setFormClient("");
    setFormAmount("");
    setFormTax("");
    setFormDueDate("");
    setFormStatus("Draft");
    setFormNotes("");
    setSelectedInvoice(null);
  };

  return (
    <div className="p-6 space-y-6">
      <ContentEngineTabs />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Invoices</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[200px]"
              data-testid="input-search-invoices"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => { resetForm(); setCreateOpen(true); }} data-testid="button-create-invoice">
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold" data-testid={`text-stat-count-${stat.label.toLowerCase()}`}>{stat.count}</p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-stat-amount-${stat.label.toLowerCase()}`}>{stat.amount}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((inv) => (
                <TableRow key={inv.id} data-testid={`row-invoice-${inv.id}`}>
                  <TableCell className="font-medium" data-testid={`text-invoice-id-${inv.id}`}>
                    {inv.id}
                  </TableCell>
                  <TableCell data-testid={`text-invoice-client-${inv.id}`}>{inv.client}</TableCell>
                  <TableCell className="text-right" data-testid={`text-invoice-amount-${inv.id}`}>
                    ${inv.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground" data-testid={`text-invoice-tax-${inv.id}`}>
                    ${inv.tax.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold" data-testid={`text-invoice-total-${inv.id}`}>
                    ${inv.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(inv.status)} data-testid={`badge-invoice-status-${inv.id}`}>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground" data-testid={`text-invoice-due-${inv.id}`}>
                    {inv.dueDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-invoice-actions-${inv.id}`}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewOpen(inv)} data-testid={`action-view-${inv.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditOpen(inv)} data-testid={`action-edit-${inv.id}`}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendInvoice(inv)} data-testid={`action-send-${inv.id}`}>
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMarkPaid(inv)} data-testid={`action-mark-paid-${inv.id}`}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(inv)} data-testid={`action-download-${inv.id}`}>
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteOpen(inv)} data-testid={`action-delete-${inv.id}`}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent data-testid="dialog-create-invoice">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-client">Client Name</Label>
              <Input id="create-client" value={formClient} onChange={(e) => setFormClient(e.target.value)} placeholder="Client name" data-testid="input-create-client" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-amount">Amount</Label>
                <Input id="create-amount" type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} placeholder="0.00" data-testid="input-create-amount" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-tax">Tax</Label>
                <Input id="create-tax" type="number" value={formTax} onChange={(e) => setFormTax(e.target.value)} placeholder="0.00" data-testid="input-create-tax" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-due-date">Due Date</Label>
              <Input id="create-due-date" type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} data-testid="input-create-due-date" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger data-testid="select-create-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-notes">Notes</Label>
              <Textarea id="create-notes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Additional notes..." data-testid="input-create-notes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} data-testid="button-cancel-create-invoice">Cancel</Button>
            <Button onClick={handleCreateInvoice} data-testid="button-confirm-create-invoice">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-testid="dialog-edit-invoice">
          <DialogHeader>
            <DialogTitle>Edit Invoice {selectedInvoice?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-client">Client Name</Label>
              <Input id="edit-client" value={formClient} onChange={(e) => setFormClient(e.target.value)} data-testid="input-edit-client" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount</Label>
                <Input id="edit-amount" type="number" value={formAmount} onChange={(e) => setFormAmount(e.target.value)} data-testid="input-edit-amount" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tax">Tax</Label>
                <Input id="edit-tax" type="number" value={formTax} onChange={(e) => setFormTax(e.target.value)} data-testid="input-edit-tax" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-due-date">Due Date</Label>
              <Input id="edit-due-date" type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} data-testid="input-edit-due-date" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formStatus} onValueChange={setFormStatus}>
                <SelectTrigger data-testid="select-edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea id="edit-notes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} data-testid="input-edit-notes" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit-invoice">Cancel</Button>
            <Button onClick={handleEditSave} data-testid="button-confirm-edit-invoice">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-testid="dialog-delete-invoice">
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Are you sure you want to delete invoice <span className="font-medium text-foreground">{selectedInvoice?.id}</span> for <span className="font-medium text-foreground">{selectedInvoice?.client}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-invoice">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} data-testid="button-confirm-delete-invoice">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent data-testid="dialog-view-invoice">
          <DialogHeader>
            <DialogTitle>Invoice {selectedInvoice?.id}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Client</Label>
                <span className="font-medium">{selectedInvoice.client}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Amount</Label>
                <span>${selectedInvoice.amount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Tax</Label>
                <span>${selectedInvoice.tax.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Total</Label>
                <span className="font-bold">${selectedInvoice.total.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Status</Label>
                <Badge variant={statusVariant(selectedInvoice.status)}>{selectedInvoice.status}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Due Date</Label>
                <span>{selectedInvoice.dueDate}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)} data-testid="button-close-view-invoice">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
