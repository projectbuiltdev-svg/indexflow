import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail } from "lucide-react";
import type { ContactMessage } from "@shared/schema";

export default function AdminCRM() {
  useVenue();

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages"],
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Mail className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-crm">
          CRM - Contact Messages
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-crm">
              No contact messages found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Venue Type</TableHead>
                  <TableHead>Inquiry</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg) => (
                  <TableRow key={msg.id} data-testid={`row-message-${msg.id}`}>
                    <TableCell className="font-medium">{msg.name}</TableCell>
                    <TableCell>{msg.email}</TableCell>
                    <TableCell className="text-muted-foreground">{msg.phone || "-"}</TableCell>
                    <TableCell>{msg.venueType || "-"}</TableCell>
                    <TableCell>{msg.inquiryType || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "-"}
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
