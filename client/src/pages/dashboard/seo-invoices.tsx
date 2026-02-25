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
import { Plus, MoreHorizontal, Eye, Pencil, Send, CheckCircle, Download, Trash2, FileText, DollarSign, AlertTriangle, Search, Loader2 } from "lucide-react";
import { ContentEngineTabs } from "@/components/content-engine-tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { Invoice } from "@shared/schema";

const statCards = [
  { label: "Draft", dbStatus: "draft", icon: FileText, color: "text-muted-foreground" },
  { label: "Sent", dbStatus: "sent", icon: Send, color: "text-blue-600" },
  { label: "Paid", dbStatus: "paid", icon: DollarSign, color: "text-green-600" },
  { label: "Overdue", dbStatus: "overdue", icon: AlertTriangle, color: "text-red-600" },
];

const statusVariant = (status: string) => {
  switch (status) {
    case "draft":
      return "secondary" as const;
    case "sent":
      return "outline" as const;
    case "paid":
      return "default" as const;
    case "overdue":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

const statusDisplay = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function SeoInvoices() {
  const { selectedWorkspace } = useWorkspace();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [formClient, setFormClient] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formTax, setFormTax] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formStatus, setFormStatus] = useState("draft");
  const [formNotes, setFormNotes] = useState("");

  const workspaceId = selectedWorkspace?.id;

  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices", workspaceId ? `?workspaceId=${workspaceId}` : ""],
    enabled: true,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/invoices", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      setCreateOpen(false);
      resetForm();
      toast({ title: "Invoice Created", description: "New invoice has been created." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Record<string, unknown> }) => {
      const res = await apiRequest("PATCH", `/api/invoices/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      setEditOpen(false);
      resetForm();
      toast({ title: "Invoice Updated", description: "Invoice has been updated." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      setDeleteOpen(false);
      setSelectedInvoice(null);
      toast({ title: "Invoice Deleted", description: "Invoice has been deleted." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStats = () => {
    return statCards.map((stat) => {
      const matching = invoices.filter((inv) => inv.status === stat.dbStatus);
      const count = matching.length;
      const amount = matching.reduce((sum, inv) => sum + parseFloat(String(inv.total || "0")), 0);
      return { ...stat, count, amount: `$${amount.toLocaleString()}` };
    });
  };

  const stats = getStats();

  const handleCreateInvoice = () => {
    const subtotal = parseFloat(formAmount) || 0;
    const taxAmount = parseFloat(formTax) || 0;
    if (!formClient || !formAmount || !formDueDate) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    const total = subtotal + taxAmount;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    createMutation.mutate({
      workspaceId: workspaceId || undefined,
      invoiceNumber,
      clientName: formClient,
      subtotal: String(subtotal),
      taxAmount: String(taxAmount),
      total: String(total),
      status: formStatus,
      dueDate: formDueDate,
      issueDate: new Date().toISOString().slice(0, 10),
      notes: formNotes || undefined,
    });
  };

  const handleEditOpen = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setFormClient(inv.clientName);
    setFormAmount(String(inv.subtotal || "0"));
    setFormTax(String(inv.taxAmount || "0"));
    setFormDueDate(inv.dueDate || "");
    setFormStatus(inv.status);
    setFormNotes(inv.notes || "");
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedInvoice) return;
    const subtotal = parseFloat(formAmount) || 0;
    const taxAmount = parseFloat(formTax) || 0;
    const total = subtotal + taxAmount;

    updateMutation.mutate({
      id: selectedInvoice.id,
      data: {
        clientName: formClient,
        subtotal: String(subtotal),
        taxAmount: String(taxAmount),
        total: String(total),
        dueDate: formDueDate,
        status: formStatus,
        notes: formNotes || undefined,
      },
    });
  };

  const handleDeleteOpen = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedInvoice) return;
    deleteMutation.mutate(selectedInvoice.id);
  };

  const handleViewOpen = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setViewOpen(true);
  };

  const handleSendInvoice = (inv: Invoice) => {
    updateMutation.mutate({
      id: inv.id,
      data: { status: "sent" },
    });
  };

  const handleMarkPaid = (inv: Invoice) => {
    updateMutation.mutate({
      id: inv.id,
      data: { status: "paid", paidAt: new Date().toISOString() },
    });
  };

  const handleDownload = (inv: Invoice) => {
    toast({ title: "Download Started", description: `Downloading PDF for invoice ${inv.invoiceNumber}.` });
  };

  const resetForm = () => {
    setFormClient("");
    setFormAmount("");
    setFormTax("");
    setFormDueDate("");
    setFormStatus("draft");
    setFormNotes("");
    setSelectedInvoice(null);
  };

  const formatCurrency = (value: string | number | null | undefined) => {
    const num = parseFloat(String(value || "0"));
    return `$${num.toLocaleString()}`;
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
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
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
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
                <TableRow key={inv.id} data-testid={`row-invoice-${inv.invoiceNumber}`}>
                  <TableCell className="font-medium" data-testid={`text-invoice-id-${inv.invoiceNumber}`}>
                    {inv.invoiceNumber}
                  </TableCell>
                  <TableCell data-testid={`text-invoice-client-${inv.invoiceNumber}`}>{inv.clientName}</TableCell>
                  <TableCell className="text-right" data-testid={`text-invoice-amount-${inv.invoiceNumber}`}>
                    {formatCurrency(inv.subtotal)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground" data-testid={`text-invoice-tax-${inv.invoiceNumber}`}>
                    {formatCurrency(inv.taxAmount)}
                  </TableCell>
                  <TableCell className="text-right font-semibold" data-testid={`text-invoice-total-${inv.invoiceNumber}`}>
                    {formatCurrency(inv.total)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(inv.status)} data-testid={`badge-invoice-status-${inv.invoiceNumber}`}>
                      {statusDisplay(inv.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground" data-testid={`text-invoice-due-${inv.invoiceNumber}`}>
                    {inv.dueDate || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-invoice-actions-${inv.invoiceNumber}`}>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewOpen(inv)} data-testid={`action-view-${inv.invoiceNumber}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditOpen(inv)} data-testid={`action-edit-${inv.invoiceNumber}`}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendInvoice(inv)} data-testid={`action-send-${inv.invoiceNumber}`}>
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMarkPaid(inv)} data-testid={`action-mark-paid-${inv.invoiceNumber}`}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(inv)} data-testid={`action-download-${inv.invoiceNumber}`}>
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteOpen(inv)} data-testid={`action-delete-${inv.invoiceNumber}`}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInvoices.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No invoices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
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
            <Button onClick={handleCreateInvoice} disabled={createMutation.isPending} data-testid="button-confirm-create-invoice">
              {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent data-testid="dialog-edit-invoice">
          <DialogHeader>
            <DialogTitle>Edit Invoice {selectedInvoice?.invoiceNumber}</DialogTitle>
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
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
            <Button onClick={handleEditSave} disabled={updateMutation.isPending} data-testid="button-confirm-edit-invoice">
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent data-testid="dialog-delete-invoice">
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Are you sure you want to delete invoice <span className="font-medium text-foreground">{selectedInvoice?.invoiceNumber}</span> for <span className="font-medium text-foreground">{selectedInvoice?.clientName}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} data-testid="button-cancel-delete-invoice">Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleteMutation.isPending} data-testid="button-confirm-delete-invoice">
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent data-testid="dialog-view-invoice">
          <DialogHeader>
            <DialogTitle>Invoice {selectedInvoice?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-3 py-4">
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Client</Label>
                <span className="font-medium">{selectedInvoice.clientName}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Amount</Label>
                <span>{formatCurrency(selectedInvoice.subtotal)}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Tax</Label>
                <span>{formatCurrency(selectedInvoice.taxAmount)}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Total</Label>
                <span className="font-bold">{formatCurrency(selectedInvoice.total)}</span>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Status</Label>
                <Badge variant={statusVariant(selectedInvoice.status)}>{statusDisplay(selectedInvoice.status)}</Badge>
              </div>
              <div className="flex items-center gap-4">
                <Label className="w-24 text-muted-foreground">Due Date</Label>
                <span>{selectedInvoice.dueDate || "—"}</span>
              </div>
              {selectedInvoice.notes && (
                <div className="flex items-start gap-4">
                  <Label className="w-24 text-muted-foreground">Notes</Label>
                  <span className="text-sm">{selectedInvoice.notes}</span>
                </div>
              )}
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
