import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileEdit, Send, Clock, CheckCircle, XCircle, AlertCircle, Globe,
  Type, Image, DollarSign, FileText, Timer, Link2, HelpCircle,
  ArrowRight, Sparkles, Zap, MessageSquare, ChevronDown, ChevronUp
} from "lucide-react";

interface WebsiteChangeRequest {
  id: string;
  workspaceId: string;
  userId: string;
  changeType: string;
  description: string;
  pageUrl: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

const changeTypes = [
  { value: "text", label: "Text Update", icon: Type, color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-500/10 dark:bg-blue-500/20" },
  { value: "image", label: "Image Swap", icon: Image, color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-500/10 dark:bg-purple-500/20" },
  { value: "pricing", label: "Pricing Change", icon: DollarSign, color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10 dark:bg-emerald-500/20" },
  { value: "content", label: "Content Update", icon: FileText, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-500/10 dark:bg-orange-500/20" },
  { value: "hours", label: "Hours / Info", icon: Timer, color: "text-cyan-500 dark:text-cyan-400", bg: "bg-cyan-500/10 dark:bg-cyan-500/20" },
  { value: "domain", label: "Custom Domain", icon: Link2, color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-500/10 dark:bg-rose-500/20" },
  { value: "other", label: "Other", icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock; color: string; bg: string; ring: string }> = {
  pending: { label: "Pending Review", variant: "secondary", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 dark:bg-amber-500/15", ring: "ring-amber-500/20" },
  in_progress: { label: "In Progress", variant: "default", icon: Zap, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 dark:bg-blue-500/15", ring: "ring-blue-500/20" },
  completed: { label: "Completed", variant: "outline", icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 dark:bg-emerald-500/15", ring: "ring-emerald-500/20" },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10 dark:bg-red-500/15", ring: "ring-red-500/20" },
};

export default function WebsiteChanges() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  const [changeType, setChangeType] = useState("text");
  const [description, setDescription] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    document.title = "Website Changes | indexFlow Dashboard";
  }, []);

  const { data: changes = [], isLoading } = useQuery<WebsiteChangeRequest[]>({
    queryKey: ["/api/workspaces", workspaceId, "website-changes"],
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/workspaces/${workspaceId}/website-changes`, {
        changeType,
        description: description.trim(),
        pageUrl: pageUrl.trim() || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "website-changes"] });
      setDescription("");
      setPageUrl("");
      setChangeType("text");
      toast({ title: "Request Submitted", description: "Your website change request has been submitted. Our team will process it shortly." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit change request", variant: "destructive" });
    },
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  const filteredChanges = filterStatus === "all"
    ? changes
    : changes.filter(c => c.status === filterStatus);

  const statusCounts = {
    all: changes.length,
    pending: changes.filter(c => c.status === "pending").length,
    in_progress: changes.filter(c => c.status === "in_progress").length,
    completed: changes.filter(c => c.status === "completed").length,
    rejected: changes.filter(c => c.status === "rejected").length,
  };

  const selectedType = changeTypes.find(ct => ct.value === changeType);
  const SelectedTypeIcon = selectedType?.icon || Type;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10" data-testid="icon-website-changes">
              <FileEdit className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold" data-testid="text-website-changes-title">
                Website Changes
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Request updates to your website — text, images, content, pricing, and more
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card data-testid="card-submit-change" className="overflow-visible">
              <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base sm:text-lg">New Change Request</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Tell us what you need changed and we'll handle the rest
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 sm:p-6 sm:pt-2 space-y-5">
                <div>
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">What type of change?</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {changeTypes.filter(ct => ct.value !== "other").map(ct => {
                      const Icon = ct.icon;
                      const isSelected = changeType === ct.value;
                      return (
                        <button
                          key={ct.value}
                          type="button"
                          onClick={() => setChangeType(ct.value)}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/30"
                              : "border-border hover-elevate"
                          }`}
                          data-testid={`button-type-${ct.value}`}
                        >
                          <div className={`p-1.5 rounded-md ${ct.bg}`}>
                            <Icon className={`w-4 h-4 ${ct.color}`} />
                          </div>
                          <span className={`text-xs font-medium ${isSelected ? "text-primary" : "text-muted-foreground"}`}>
                            {ct.label}
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setChangeType("other")}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-center transition-colors ${
                        changeType === "other"
                          ? "border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/30"
                          : "border-border hover-elevate"
                      }`}
                      data-testid="button-type-other"
                    >
                      <div className="p-1.5 rounded-md bg-muted">
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className={`text-xs font-medium ${changeType === "other" ? "text-primary" : "text-muted-foreground"}`}>
                        Other
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page-url" className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    Page URL
                    <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="page-url"
                    placeholder="https://yoursite.com/page"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    data-testid="input-page-url"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="change-description" className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                    Describe Your Changes
                  </Label>
                  <Textarea
                    id="change-description"
                    placeholder={
                      changeType === "text" ? "e.g. Update the About section heading to 'Our Story Since 1985' and change the description paragraph to..."
                      : changeType === "image" ? "e.g. Replace the hero image with the new photo I emailed to support@indexflow.io..."
                      : changeType === "pricing" ? "e.g. Update the pricing page to reflect new plan prices..."
                      : changeType === "content" ? "e.g. Add a new section about our services with updated descriptions..."
                      : changeType === "hours" ? "e.g. Update business hours to 9am - 6pm, and add note about holiday schedule..."
                      : changeType === "domain" ? "e.g. Connect our domain mybusiness.com — DNS is managed through GoDaddy, we can update records..."
                      : "Please describe the change you need..."
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[140px] resize-none"
                    data-testid="textarea-change-description"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                  <Button
                    onClick={() => submitMutation.mutate()}
                    disabled={submitMutation.isPending || !description.trim()}
                    data-testid="button-submit-change"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {submitMutation.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Most changes are applied within 24 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h2 className="text-base sm:text-lg font-semibold" data-testid="text-history-title">Request History</h2>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(["all", "pending", "in_progress", "completed", "rejected"] as const).map(status => {
                    const count = statusCounts[status];
                    const isActive = filterStatus === status;
                    const label = status === "all" ? "All" : status === "in_progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1);
                    return (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-2.5 py-1 text-xs rounded-md transition-colors font-medium ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover-elevate"
                        }`}
                        data-testid={`filter-${status}`}
                      >
                        {label}
                        {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="animate-pulse space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-20 bg-muted rounded" />
                            <div className="h-5 w-24 bg-muted rounded" />
                          </div>
                          <div className="h-4 w-3/4 bg-muted rounded" />
                          <div className="h-3 w-1/4 bg-muted rounded" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredChanges.length === 0 ? (
                <Card>
                  <CardContent className="p-8 sm:p-12 text-center">
                    <div className="p-3 rounded-xl bg-muted/50 w-fit mx-auto mb-4">
                      <FileEdit className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="font-medium mb-1">
                      {filterStatus === "all" ? "No change requests yet" : `No ${filterStatus.replace("_", " ")} requests`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {filterStatus === "all"
                        ? "Submit your first request above to get started"
                        : "Try selecting a different filter"
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {filteredChanges.map((change) => {
                    const status = statusConfig[change.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    const typeInfo = changeTypes.find(ct => ct.value === change.changeType) || changeTypes[changeTypes.length - 1];
                    const TypeIcon = typeInfo.icon;
                    const isExpanded = expandedRequest === change.id;

                    return (
                      <Card
                        key={change.id}
                        className="overflow-visible transition-colors"
                        data-testid={`card-change-${change.id}`}
                      >
                        <CardContent className="p-0">
                          <button
                            type="button"
                            onClick={() => setExpandedRequest(isExpanded ? null : change.id)}
                            className="w-full text-left p-3 sm:p-4 hover-elevate rounded-md"
                            data-testid={`button-expand-${change.id}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${typeInfo.bg}`}>
                                  <TypeIcon className={`w-3.5 h-3.5 ${typeInfo.color}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-sm font-medium">{typeInfo.label}</span>
                                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${status.bg} ${status.color}`}>
                                      <StatusIcon className="w-3 h-3" />
                                      {status.label}
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {change.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground hidden sm:block">{formatDate(change.createdAt)}</span>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 border-t mx-3 sm:mx-4 space-y-3">
                              <div className="pt-3">
                                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Description</Label>
                                <p className="text-sm mt-1">{change.description}</p>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div>
                                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Submitted</Label>
                                  <p className="text-sm mt-0.5">{formatDate(change.createdAt)} at {formatTime(change.createdAt)}</p>
                                </div>
                                <div>
                                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Last Updated</Label>
                                  <p className="text-sm mt-0.5">{formatDate(change.updatedAt)} at {formatTime(change.updatedAt)}</p>
                                </div>
                                {change.pageUrl && (
                                  <div>
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Page</Label>
                                    <p className="text-sm mt-0.5 flex items-center gap-1 text-primary">
                                      <Globe className="w-3 h-3 shrink-0" />
                                      <span className="truncate">{change.pageUrl}</span>
                                    </p>
                                  </div>
                                )}
                              </div>

                              {change.adminNotes && (
                                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <MessageSquare className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">Team Response</span>
                                  </div>
                                  <p className="text-sm">{change.adminNotes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card data-testid="card-status-summary">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Request Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-2">
                  {Object.entries(statusConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const count = statusCounts[key as keyof typeof statusCounts] || 0;
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${config.bg}`}>
                            <Icon className={`w-3 h-3 ${config.color}`} />
                          </div>
                          <span className="text-sm">{config.label}</span>
                        </div>
                        <span className={`text-sm font-semibold tabular-nums ${count > 0 ? config.color : "text-muted-foreground"}`}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                  <div className="border-t pt-2 mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Total Requests</span>
                    <span className="text-sm font-bold tabular-nums">{changes.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-what-can-change">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">What Can Be Changed?</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-2.5">
                  {[
                    { icon: Type, label: "Text & headings", color: "text-blue-500 dark:text-blue-400" },
                    { icon: Image, label: "Photos & images", color: "text-purple-500 dark:text-purple-400" },
                    { icon: DollarSign, label: "Pricing & content", color: "text-emerald-500 dark:text-emerald-400" },
                    { icon: Timer, label: "Hours & contact info", color: "text-cyan-500 dark:text-cyan-400" },
                    { icon: Link2, label: "Custom domain setup", color: "text-rose-500 dark:text-rose-400" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <item.icon className={`w-3.5 h-3.5 shrink-0 ${item.color}`} />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-changes-info">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Need something bigger?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      For new pages, layout redesigns, or new features, submit a support ticket instead.
                    </p>
                    <Button variant="ghost" size="sm" className="mt-2 -ml-2 text-xs" data-testid="button-support-ticket">
                      Open Support
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-image-tip">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 shrink-0">
                    <Image className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Sending images?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Email your photos to <span className="font-medium text-foreground">support@indexflow.io</span> and reference them in your request.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
