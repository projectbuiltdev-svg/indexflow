import { useEffect, useMemo } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Phone, Clock, Calendar, Play, User, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function CallDetail() {
  const { workspaceId, callId } = useParams<{ workspaceId: string; callId: string }>();

  const { data: call, isLoading } = useQuery<CallLog>({
    queryKey: ["/api/calls", callId],
  });

  useEffect(() => {
    document.title = `Call ${callId} - indexFlow Dashboard`;
  }, [callId]);

  const parsedTranscript = useMemo(() => {
    if (!call?.transcript) return [];
    try {
      const parsed = JSON.parse(call.transcript);
      if (Array.isArray(parsed)) return parsed;
      return [{ speaker: "system", text: call.transcript }];
    } catch {
      return [{ speaker: "system", text: call.transcript }];
    }
  }, [call?.transcript]);

  const formattedDuration = useMemo(() => {
    if (call?.duration == null) return "0:00";
    const minutes = Math.floor(call.duration / 60);
    const seconds = call.duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [call?.duration]);

  const formattedDate = useMemo(() => {
    if (!call?.createdAt) return "";
    const d = new Date(call.createdAt);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [call?.createdAt]);

  const formattedTime = useMemo(() => {
    if (!call?.createdAt) return "";
    const d = new Date(call.createdAt);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }, [call?.createdAt]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading call details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!call) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href={`/${workspaceId}/calls`}>
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Call Not Found</h1>
              <p className="text-muted-foreground">This call could not be found.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/${workspaceId}/calls`}>
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Call Details</h1>
            <p className="text-muted-foreground">{call.callerPhone || "Unknown"}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <CardTitle>Call Transcript</CardTitle>
                {call.recordingUrl ? (
                  <a href={call.recordingUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2" data-testid="button-play-recording">
                      <Play className="w-4 h-4" />
                      Play Recording
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" className="gap-2" disabled data-testid="button-play-recording">
                    <Play className="w-4 h-4" />
                    Play Recording
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parsedTranscript.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No transcript available.</p>
                  ) : (
                    parsedTranscript.map((message: { speaker: string; text: string }, i: number) => (
                      <div
                        key={i}
                        className={`flex gap-3 ${message.speaker === "ai" ? "" : "flex-row-reverse"}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          message.speaker === "ai" ? "bg-primary/10 text-primary" : "bg-muted"
                        }`}>
                          {message.speaker === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          message.speaker === "ai"
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}>
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Call Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{call.callerPhone || "Unknown"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-medium">{formattedDate} at {formattedTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{formattedDuration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outcome</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-green-500/10 text-green-600 text-sm py-1 px-3">
                  {call.status || "Unknown"}
                </Badge>
                {call.aiSummary && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {call.aiSummary}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
