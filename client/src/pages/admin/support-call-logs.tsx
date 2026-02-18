import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const callLogs = [
  { dateTime: "Feb 18, 2026 14:32", agency: "Blue Digital Agency", phone: "+1 (212) 555-0142", direction: "Inbound", duration: "4:12", status: "Completed", recording: "rec_001.mp3" },
  { dateTime: "Feb 18, 2026 13:15", agency: "Northstar Media", phone: "+1 (415) 555-0198", direction: "Outbound", duration: "2:45", status: "Completed", recording: "rec_002.mp3" },
  { dateTime: "Feb 18, 2026 11:42", agency: "Cascade Creative", phone: "+1 (646) 555-0234", direction: "Inbound", duration: "0:00", status: "Missed", recording: "-" },
  { dateTime: "Feb 17, 2026 16:08", agency: "Vertex Solutions", phone: "+1 (310) 555-0167", direction: "Inbound", duration: "5:18", status: "Completed", recording: "rec_003.mp3" },
  { dateTime: "Feb 17, 2026 10:22", agency: "Lunar Labs", phone: "+1 (503) 555-0189", direction: "Outbound", duration: "0:45", status: "Voicemail", recording: "rec_004.mp3" },
];

export default function AdminSupportCallLogs() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Call Logs</h1>
        <p className="text-sm text-muted-foreground">AI voice call history across all clients</p>
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
          </SelectContent>
        </Select>
        <Input type="date" className="w-40" data-testid="filter-date-start" />
        <Input type="date" className="w-40" data-testid="filter-date-end" />
        <Select>
          <SelectTrigger className="w-40" data-testid="filter-direction">
            <SelectValue placeholder="All Directions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Directions</SelectItem>
            <SelectItem value="inbound">Inbound</SelectItem>
            <SelectItem value="outbound">Outbound</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40" data-testid="filter-status">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
            <SelectItem value="voicemail">Voicemail</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Call Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Agency</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recording</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callLogs.map((call, i) => (
                <TableRow key={i} data-testid={`row-call-${i}`}>
                  <TableCell className="text-muted-foreground">{call.dateTime}</TableCell>
                  <TableCell className="font-medium">{call.agency}</TableCell>
                  <TableCell className="text-muted-foreground">{call.phone}</TableCell>
                  <TableCell>
                    <Badge variant={call.direction === "Inbound" ? "default" : "outline"}>{call.direction}</Badge>
                  </TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell className="text-muted-foreground">{call.status}</TableCell>
                  <TableCell className="text-muted-foreground">{call.recording}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button variant="outline" size="sm" data-testid={`button-play-${i}`}>Play</Button>
                      <Button variant="outline" size="sm" data-testid={`button-view-details-${i}`}>View Details</Button>
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