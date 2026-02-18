import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Phone } from "lucide-react";

const callLogs = [
  { id: 1, phone: "+1 (555) 234-5678", duration: "3:42", type: "Inbound", status: "Completed", date: "2026-02-18 14:32" },
  { id: 2, phone: "+1 (555) 345-6789", duration: "1:08", type: "Outbound", status: "Completed", date: "2026-02-18 11:15" },
  { id: 3, phone: "+1 (555) 456-7890", duration: "0:00", type: "Inbound", status: "Missed", date: "2026-02-17 16:45" },
  { id: 4, phone: "+1 (555) 567-8901", duration: "5:18", type: "Inbound", status: "Completed", date: "2026-02-17 10:20" },
  { id: 5, phone: "+1 (555) 678-9012", duration: "2:30", type: "Outbound", status: "Voicemail", date: "2026-02-16 09:00" },
  { id: 6, phone: "+1 (555) 789-0123", duration: "4:15", type: "Inbound", status: "Completed", date: "2026-02-15 13:45" },
  { id: 7, phone: "+1 (555) 890-1234", duration: "0:00", type: "Inbound", status: "Missed", date: "2026-02-15 08:30" },
];

export default function TwilioCallLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredCalls = callLogs.filter((call) => {
    const matchesSearch = !searchQuery || call.phone.includes(searchQuery);
    const matchesDate = !dateFilter || call.date.startsWith(dateFilter);
    return matchesSearch && matchesDate;
  });

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Call Logs</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">View AI phone call history</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[220px]"
              data-testid="input-search-calls"
            />
          </div>
          <Input
            type="date"
            className="w-auto"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            data-testid="input-date-filter"
          />
        </div>

        <Card data-testid="card-call-logs">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Phone</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.map((call) => (
                  <TableRow key={call.id} data-testid={`row-call-${call.id}`}>
                    <TableCell className="font-medium" data-testid={`text-phone-${call.id}`}>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {call.phone}
                      </div>
                    </TableCell>
                    <TableCell data-testid={`text-duration-${call.id}`}>{call.duration}</TableCell>
                    <TableCell>
                      <Badge variant={call.type === "Inbound" ? "default" : "secondary"} data-testid={`badge-type-${call.id}`}>
                        {call.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={call.status === "Completed" ? "default" : call.status === "Missed" ? "destructive" : "secondary"}
                        data-testid={`badge-status-${call.id}`}
                      >
                        {call.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm" data-testid={`text-date-${call.id}`}>{call.date}</TableCell>
                  </TableRow>
                ))}
                {filteredCalls.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No call logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
