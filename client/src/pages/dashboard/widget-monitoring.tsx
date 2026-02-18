import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Users, Clock, Star, FileText, Flag } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

const chartData = Array.from({ length: 30 }, (_, i) => ({
  day: `Feb ${i + 1}`,
  conversations: Math.floor(Math.random() * 30) + 25,
}));

const initialSessions = [
  { id: 1, visitor: "Visitor #4821", started: "2026-02-18 14:32", messages: 8, duration: "4:12", status: "Completed" },
  { id: 2, visitor: "Visitor #4820", started: "2026-02-18 13:15", messages: 3, duration: "1:45", status: "Active" },
  { id: 3, visitor: "Visitor #4819", started: "2026-02-18 11:08", messages: 12, duration: "6:30", status: "Completed" },
  { id: 4, visitor: "Visitor #4818", started: "2026-02-17 16:45", messages: 2, duration: "0:52", status: "Abandoned" },
  { id: 5, visitor: "Visitor #4817", started: "2026-02-17 10:20", messages: 5, duration: "3:10", status: "Completed" },
];

export default function WidgetMonitoring() {
  const { toast } = useToast();
  const [sessions] = useState(initialSessions);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<typeof initialSessions[0] | null>(null);

  const handleViewTranscript = (session: typeof initialSessions[0]) => {
    setSelectedSession(session);
    setTranscriptOpen(true);
  };

  const handleFlag = (session: typeof initialSessions[0]) => {
    toast({
      title: "Session Flagged",
      description: `${session.visitor} has been flagged for review.`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Widget Monitoring</h1>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-conversations">1,234</p>
                <p className="text-xs text-muted-foreground">Total Conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-active-now">3</p>
                <p className="text-xs text-muted-foreground">Active Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-avg-response-time">1.2s</p>
                <p className="text-xs text-muted-foreground">Avg Response Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-satisfaction">4.5/5</p>
                <p className="text-xs text-muted-foreground">Satisfaction Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversations Per Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]" data-testid="chart-conversations">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="conversations" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Messages</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.id} data-testid={`row-session-${s.id}`}>
                  <TableCell className="font-medium" data-testid={`text-visitor-${s.id}`}>{s.visitor}</TableCell>
                  <TableCell className="text-muted-foreground">{s.started}</TableCell>
                  <TableCell>{s.messages}</TableCell>
                  <TableCell>{s.duration}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "Active" ? "default" : s.status === "Abandoned" ? "destructive" : "secondary"} data-testid={`badge-session-status-${s.id}`}>
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      <Button variant="ghost" size="icon" data-testid={`button-view-transcript-${s.id}`} onClick={() => handleViewTranscript(s)}>
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid={`button-flag-${s.id}`} onClick={() => handleFlag(s)}>
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={transcriptOpen} onOpenChange={setTranscriptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Transcript - {selectedSession?.visitor}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              <p>Started: {selectedSession?.started}</p>
              <p>Duration: {selectedSession?.duration}</p>
              <p>Messages: {selectedSession?.messages}</p>
            </div>
            <div className="space-y-2 border rounded-md p-3">
              <div className="text-sm"><span className="font-medium">Visitor:</span> Hi, I need help with my reservation.</div>
              <div className="text-sm"><span className="font-medium">AI:</span> Of course! I'd be happy to help you with your reservation. Could you provide your booking reference?</div>
              <div className="text-sm"><span className="font-medium">Visitor:</span> It's BK-4821</div>
              <div className="text-sm text-muted-foreground text-center">--- End of transcript preview ---</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
