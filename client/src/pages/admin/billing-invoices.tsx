import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const invoices = [
  { id: "INV-2026-0312", agency: "Blue Digital Agency", amount: "$299.00", status: "Paid", dueDate: "Feb 15, 2026", paidDate: "Feb 14, 2026" },
  { id: "INV-2026-0311", agency: "Northstar Media", amount: "$499.00", status: "Paid", dueDate: "Feb 15, 2026", paidDate: "Feb 15, 2026" },
  { id: "INV-2026-0310", agency: "Cascade Creative", amount: "$149.00", status: "Overdue", dueDate: "Feb 10, 2026", paidDate: "-" },
  { id: "INV-2026-0309", agency: "Vertex Solutions", amount: "$299.00", status: "Pending", dueDate: "Feb 20, 2026", paidDate: "-" },
  { id: "INV-2026-0308", agency: "Lunar Labs", amount: "$149.00", status: "Void", dueDate: "Feb 5, 2026", paidDate: "-" },
];

export default function AdminBillingInvoices() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Invoices</h1>
          <p className="text-sm text-muted-foreground">All platform invoices</p>
        </div>
        <Button data-testid="button-create-invoice">Create Invoice</Button>
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-6">
        <Select>
          <SelectTrigger className="w-48" data-testid="filter-agency">
            <SelectValue placeholder="All Agencies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Agencies</SelectItem>
            <SelectItem value="blue-digital">Blue Digital Agency</SelectItem>
            <SelectItem value="northstar">Northstar Media</SelectItem>
            <SelectItem value="cascade">Cascade Creative</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40" data-testid="filter-status">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="void">Void</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-40" data-testid="filter-date-start" />
        <Input type="date" className="w-40" data-testid="filter-date-end" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id} data-testid={`row-invoice-${inv.id}`}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell>{inv.agency}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "Paid" ? "default" : inv.status === "Overdue" ? "destructive" : inv.status === "Pending" ? "outline" : "secondary"}>{inv.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{inv.dueDate}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.paidDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button variant="outline" size="sm" data-testid={`button-view-${inv.id}`}>View</Button>
                      <Button variant="outline" size="sm" data-testid={`button-send-${inv.id}`}>Send</Button>
                      <Button variant="outline" size="sm" data-testid={`button-mark-paid-${inv.id}`}>Mark Paid</Button>
                      <Button variant="outline" size="sm" data-testid={`button-void-${inv.id}`}>Void</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}