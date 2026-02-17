import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { useVenue } from "@/lib/venue-context";
import type { ContactMessage } from "@shared/schema";

export default function ClientMessages() {
  const { selectedVenue } = useVenue();

  const { data: allMessages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/contact-messages", selectedVenue?.id],
  });

  const messages = selectedVenue
    ? allMessages.filter((m) => (m as ContactMessage & { venueId?: string }).venueId === selectedVenue.id)
    : allMessages;

  const totalMessages = messages.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">My Messages</h1>
        <p className="text-muted-foreground mt-1">
          View incoming inquiries and contact messages
          {selectedVenue && <span> for <span className="font-medium text-foreground">{selectedVenue.name}</span></span>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Messages</p>
              <p className="text-xl font-bold mt-1" data-testid="text-client-total-messages">{totalMessages}</p>
            </div>
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
        </Card>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
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
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No messages yet. Messages will appear here as they come in.
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((msg) => (
                  <TableRow key={msg.id} data-testid={`row-client-message-${msg.id}`}>
                    <TableCell className="font-medium text-sm" data-testid={`text-client-msg-name-${msg.id}`}>
                      {msg.name}
                    </TableCell>
                    <TableCell>
                      {msg.email ? (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          {msg.email}
                        </span>
                      ) : "\u2014"}
                    </TableCell>
                    <TableCell>
                      {msg.phone ? (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {msg.phone}
                        </span>
                      ) : "\u2014"}
                    </TableCell>
                    <TableCell>
                      {msg.inquiryType ? (
                        <Badge variant="secondary" className="text-xs" data-testid={`badge-client-inquiry-${msg.id}`}>
                          {msg.inquiryType}
                        </Badge>
                      ) : "\u2014"}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground line-clamp-2 max-w-[200px] block" data-testid={`text-client-msg-preview-${msg.id}`}>
                        {msg.message}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "\u2014"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
