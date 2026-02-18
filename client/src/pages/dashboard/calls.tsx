import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard-layout";

interface CallLog {
  id: string;
  workspaceId: string;
  twilioSid: string | null;
  callerPhone: string | null;
  duration: number | null;
  status: string | null;
  transcript: string | null;
  aiSummary: string | null;
  inquiryId: string | null;
  recordingUrl: string | null;
  createdAt: string;
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return "-";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatRelativeDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const callDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  if (callDate.getTime() === today.getTime()) return "Today";
  if (callDate.getTime() === yesterday.getTime()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Calls() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  useEffect(() => {
    document.title = "Calls - indexFlow Dashboard";
  }, []);

  const { data: calls = [], isLoading } = useQuery<CallLog[]>({
    queryKey: ["/api/workspaces", workspaceId, "calls"],
  });

  const totalCalls = calls.length;
  const completedCalls = calls.filter(c => c.status === "completed").length;
  const missedCalls = calls.filter(c => c.status === "missed").length;
  const avgDuration = calls.length > 0
    ? Math.round(calls.filter(c => c.duration).reduce((sum, c) => sum + (c.duration || 0), 0) / Math.max(calls.filter(c => c.duration).length, 1))
    : 0;
  const avgMin = Math.floor(avgDuration / 60);
  const avgSec = avgDuration % 60;

  const stats = [
    { label: "Total Calls", value: String(totalCalls), icon: Phone, color: "text-primary" },
    { label: "Answered", value: String(completedCalls), icon: PhoneIncoming, color: "text-green-500" },
    { label: "Missed", value: String(missedCalls), icon: PhoneMissed, color: "text-red-500" },
    { label: "Avg Duration", value: `${avgMin}:${avgSec.toString().padStart(2, "0")}`, icon: Clock, color: "text-blue-500" },
  ];

  const getCallIcon = (status: string | null) => {
    switch (status) {
      case "completed":
        return <PhoneIncoming className="w-4 h-4 text-green-500" />;
      case "missed":
        return <PhoneMissed className="w-4 h-4 text-red-500" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const getResultBadge = (summary: string | null) => {
    if (!summary) return <Badge variant="outline">Call</Badge>;
    const lower = summary.toLowerCase();
    if (lower.includes("inquiry") || lower.includes("converted")) {
      return <Badge className="bg-green-500/10 text-green-600">Inquiry Converted</Badge>;
    }
    if (lower.includes("cancel")) {
      return <Badge className="bg-red-500/10 text-red-600">Cancelled</Badge>;
    }
    if (lower.includes("follow")) {
      return <Badge className="bg-yellow-500/10 text-yellow-600">Follow-up</Badge>;
    }
    return <Badge variant="outline">{summary}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Call Logs</h1>
          <p className="text-muted-foreground">Twilio call history and AI assistant interactions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-2 rounded-full bg-muted ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call list */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Recent Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading call logs...</p>
            ) : calls.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No call logs yet. Calls will appear here once your Twilio integration is active.</p>
            ) : (
              <div className="space-y-3">
                {calls.map((call) => {
                  const duration = formatDuration(call.duration);
                  const date = formatRelativeDate(call.createdAt);
                  const time = formatTime(call.createdAt);
                  return (
                    <Link key={call.id} href={`/${workspaceId}/calls/${call.id}`}>
                      <div
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border hover-elevate cursor-pointer gap-3"
                        data-testid={`call-${call.id}`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="p-2 rounded-full bg-muted flex-shrink-0">
                            {getCallIcon(call.status)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{call.callerPhone || "Unknown"}</p>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                              <span>{date}</span>
                              <span>&bull;</span>
                              <span>{time}</span>
                              {duration !== "-" && (
                                <>
                                  <span className="hidden sm:inline">&bull;</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {duration}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="ml-11 sm:ml-0">
                          {getResultBadge(call.aiSummary)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
