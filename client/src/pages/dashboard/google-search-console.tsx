import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { MousePointerClick, Eye, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown, Link2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const topQueries = [
  { query: "content management platform", clicks: 2840, impressions: 52000, ctr: "5.5%", position: 6.2, change: 1.3 },
  { query: "seo tools for agencies", clicks: 2210, impressions: 48000, ctr: "4.6%", position: 7.8, change: -0.5 },
  { query: "rank tracking software", clicks: 1890, impressions: 41000, ctr: "4.6%", position: 9.1, change: 2.1 },
  { query: "white label seo platform", clicks: 1560, impressions: 32000, ctr: "4.9%", position: 8.5, change: 0.7 },
  { query: "ai content generator", clicks: 1340, impressions: 28000, ctr: "4.8%", position: 10.2, change: -1.2 },
];

const metricCards = [
  { label: "Total Clicks", value: "12,450", icon: MousePointerClick },
  { label: "Impressions", value: "245K", icon: Eye },
  { label: "Avg CTR", value: "5.1%", icon: TrendingUp },
  { label: "Avg Position", value: "8.3", icon: ArrowUpDown },
];

export default function GoogleSearchConsole() {
  const { toast } = useToast();
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnected(true);
    toast({ title: "Connected", description: "Google Search Console has been connected successfully." });
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Google Search Console</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Connect and monitor your search performance</p>
        </div>

        <Card data-testid="card-connection-status">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Link2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium" data-testid="text-connection-label">Connection Status</p>
                  <p className="text-sm text-muted-foreground">Google Search Console API</p>
                </div>
              </div>
              <Badge variant={connected ? "default" : "secondary"} data-testid="badge-connection-status">
                {connected ? "Connected" : "Not Connected"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {!connected ? (
          <Card data-testid="card-setup-instructions">
            <CardContent className="p-6 text-center space-y-4">
              <Settings className="w-12 h-12 mx-auto text-muted-foreground" />
              <h3 className="font-semibold text-lg">Connect Google Search Console</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Connect your Google Search Console account to view search performance data, top queries, clicks, impressions, and indexing status.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground text-left max-w-sm mx-auto">
                <p>1. Click the button below to authorize</p>
                <p>2. Select your website property</p>
                <p>3. Data will sync automatically</p>
              </div>
              <Button onClick={handleConnect} data-testid="button-connect-gsc">
                Connect GSC
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {metricCards.map((metric) => (
                <Card key={metric.label} data-testid={`card-metric-${metric.label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="text-2xl font-bold mt-1" data-testid={`text-metric-${metric.label.toLowerCase().replace(/\s+/g, "-")}`}>{metric.value}</p>
                      </div>
                      <metric.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card data-testid="card-top-queries">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Top Queries</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Query</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Impressions</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                      <TableHead className="text-right">Position</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topQueries.map((q, idx) => (
                      <TableRow key={idx} data-testid={`row-query-${idx}`}>
                        <TableCell className="font-medium" data-testid={`text-query-${idx}`}>{q.query}</TableCell>
                        <TableCell className="text-right">{q.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{q.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{q.ctr}</TableCell>
                        <TableCell className="text-right">{q.position}</TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center gap-0.5 text-sm ${q.change > 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {q.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {Math.abs(q.change)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ClientLayout>
  );
}
