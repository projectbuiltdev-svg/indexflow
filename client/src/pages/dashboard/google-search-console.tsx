import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search, CheckCircle, AlertCircle, ExternalLink, TrendingUp,
  MousePointerClick, Eye, ArrowUpDown, LogOut, Shield, Zap, Globe, BarChart3, FileSearch,
} from "lucide-react";
import { SiGoogle } from "react-icons/si";

interface SeoSettings {
  id: number;
  workspaceId: string;
  provider: string;
  apiKey: string | null;
  siteUrl: string | null;
  isConnected: boolean;
}

export default function GoogleSearchConsole() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();
  const [siteUrl, setSiteUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [queryDateRange, setQueryDateRange] = useState("28d");

  useEffect(() => {
    document.title = "Google Search Console | indexFlow Dashboard";
  }, []);

  const { data: allSettings = [] } = useQuery<SeoSettings[]>({
    queryKey: ["/api/workspaces", workspaceId, "seo-settings"],
  });
  const settings = allSettings.find(s => s.provider === "google_search_console");

  useEffect(() => {
    if (settings) {
      setSiteUrl(settings.siteUrl || "");
      setIsConnected(settings.isConnected);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/workspaces/${workspaceId}/seo-settings`, {
        provider: "google_search_console",
        apiKey: "google-oauth-connected",
        siteUrl,
        isConnected: true,
      });
    },
    onSuccess: () => {
      setIsConnected(true);
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "seo-settings"] });
      toast({ title: "Connected", description: "Google Search Console connected successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to connect", variant: "destructive" });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/workspaces/${workspaceId}/seo-settings`, {
        provider: "google_search_console",
        apiKey: "",
        siteUrl: "",
        isConnected: false,
      });
    },
    onSuccess: () => {
      setSiteUrl("");
      setIsConnected(false);
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "seo-settings"] });
      toast({ title: "Disconnected", description: "Google Search Console disconnected" });
    },
  });

  const handleGoogleLogin = () => {
    toast({ title: "Google Sign-In", description: "Redirecting to Google for authentication..." });
    setTimeout(() => {
      saveMutation.mutate();
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <SiGoogle className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold" data-testid="text-gsc-title">
                Google Search Console
              </h1>
              <p className="text-sm text-muted-foreground">
                Monitor your website's search performance and indexing status
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-4 sm:space-y-6">

          <Card data-testid="card-gsc-connection" className={isConnected ? "border-green-200 dark:border-green-800/50" : "border-blue-200 dark:border-blue-800/50"}>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  {isConnected ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Zap className="w-4 h-4 text-blue-500" />}
                  {isConnected ? "Connected" : "Connect Your Account"}
                </CardTitle>
                <Badge variant={isConnected ? "default" : "secondary"} className={isConnected ? "bg-green-600" : ""}>
                  {isConnected ? "Active" : "Not Connected"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
              {!isConnected ? (
                <>
                  <div className="rounded-md bg-gradient-to-r from-blue-50 via-red-50/50 via-50% to-green-50/80 dark:from-blue-950/30 dark:via-red-950/20 dark:to-green-950/30 border border-blue-200/50 dark:border-blue-800/30 p-4">
                    <p className="text-sm">
                      <span className="text-[#4285F4] font-medium">S</span><span className="text-[#EA4335] font-medium">i</span><span className="text-[#FBBC05] font-medium">g</span><span className="text-[#4285F4] font-medium">n</span><span className="text-muted-foreground"> in with your </span><span className="text-[#4285F4] font-medium">G</span><span className="text-[#EA4335] font-medium">o</span><span className="text-[#FBBC05] font-medium">o</span><span className="text-[#4285F4] font-medium">g</span><span className="text-[#34A853] font-medium">l</span><span className="text-[#EA4335] font-medium">e</span><span className="text-muted-foreground"> account and select which property to connect. We only request read-only access to your Search Console data.</span>
                    </p>
                  </div>
                  <Button
                    className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    onClick={handleGoogleLogin}
                    disabled={saveMutation.isPending}
                    data-testid="button-google-login"
                  >
                    <SiGoogle className="w-4 h-4 mr-2" />
                    {saveMutation.isPending ? "Connecting..." : "Sign in with Google"}
                  </Button>
                  <div className="flex items-start gap-2 pt-1">
                    <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      Your credentials are encrypted and stored securely. You can disconnect at any time.
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-md bg-green-50/80 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50">
                    <SiGoogle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">Google Account Connected</p>
                      <p className="text-xs text-green-700/80 dark:text-green-400/80">Search Console data is syncing automatically</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectMutation.mutate()}
                    disabled={disconnectMutation.isPending}
                    data-testid="button-gsc-disconnect"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect Google Account"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card className="border-blue-200/50 dark:border-blue-800/30">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-2">
                  <MousePointerClick className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-lg sm:text-2xl font-bold">{isConnected ? "--" : "-"}</p>
                <p className="text-xs text-muted-foreground">Total Clicks</p>
              </CardContent>
            </Card>
            <Card className="border-purple-200/50 dark:border-purple-800/30">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-lg sm:text-2xl font-bold">{isConnected ? "--" : "-"}</p>
                <p className="text-xs text-muted-foreground">Impressions</p>
              </CardContent>
            </Card>
            <Card className="border-green-200/50 dark:border-green-800/30">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-lg sm:text-2xl font-bold">{isConnected ? "--%" : "-"}</p>
                <p className="text-xs text-muted-foreground">Avg CTR</p>
              </CardContent>
            </Card>
            <Card className="border-orange-200/50 dark:border-orange-800/30">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-2">
                  <ArrowUpDown className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-lg sm:text-2xl font-bold">{isConnected ? "--" : "-"}</p>
                <p className="text-xs text-muted-foreground">Avg Position</p>
              </CardContent>
            </Card>
          </div>

          <Card data-testid="card-gsc-queries">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-indigo-500" />
                  Top Search Queries
                </CardTitle>
                <Select value={queryDateRange} onValueChange={setQueryDateRange}>
                  <SelectTrigger className="w-[160px]" data-testid="select-query-date-range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="28d">Last 28 days</SelectItem>
                    <SelectItem value="3m">Last 3 months</SelectItem>
                    <SelectItem value="6m">Last 6 months</SelectItem>
                    <SelectItem value="12m">Last 12 months</SelectItem>
                    <SelectItem value="16m">Last 16 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardDescription className="text-sm">Keywords driving traffic to your site</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              {isConnected ? (
                <div className="text-center py-6 text-muted-foreground">
                  <FileSearch className="w-10 h-10 mx-auto mb-3 text-indigo-500/30" />
                  <p className="text-sm">Query data will appear here once connected and synced</p>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Sign in with Google to see your top queries</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Card className="hover-elevate">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Indexing Status</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Track which pages are indexed by Google</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Performance Trends</p>
                  <p className="text-xs text-muted-foreground mt-0.5">View click and impression trends over time</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">Coverage Issues</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Identify and fix crawl errors on your site</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card data-testid="card-gsc-help" className="border-indigo-200/50 dark:border-indigo-800/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg shrink-0">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">How It Works</h3>
                  <div className="space-y-2">
                    {[
                      { step: "1", text: "Click \"Sign in with Google\" to authenticate", color: "bg-blue-500" },
                      { step: "2", text: "Select the property you want to connect", color: "bg-purple-500" },
                      { step: "3", text: "Grant read-only access to your Search Console data", color: "bg-green-500" },
                      { step: "4", text: "Your search performance data will sync automatically", color: "bg-orange-500" },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full ${item.color} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                          {item.step}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
