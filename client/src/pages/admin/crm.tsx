import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContactMessage } from "@shared/schema";

export default function AdminCRM() {
  const { data: messages, isLoading } = useQuery<ContactMessage[]>({ queryKey: ["/api/contact-messages"] });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-crm-title">CRM</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !messages?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-messages">No contact messages yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Inquiry Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((m) => (
                  <TableRow key={m.id} data-testid={`row-message-${m.id}`}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.email}</TableCell>
                    <TableCell>{m.phone || "—"}</TableCell>
                    <TableCell>
                      {m.inquiryType ? (
                        <Badge variant="outline" className="text-xs">{m.inquiryType}</Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{m.message}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
