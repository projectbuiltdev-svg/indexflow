import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, TrendingUp, Globe, MapPin, Settings, Bot, BarChart3, Eye } from "lucide-react";

const stats = [
  { label: "Total Keywords Tracked", value: "342", subtitle: "across all clients", icon: Search },
  { label: "Avg. Position", value: "14.3", subtitle: "-2.1 from last week", subtitleColor: "text-emerald-600", icon: TrendingUp },
  { label: "GSC Connected", value: "24", subtitle: "of 47 clients", icon: Globe },
  { label: "Domains Monitored", value: "38", subtitle: "active tracking", icon: Eye },
];

const clientRankings = [
  { client: "Apex Digital Agency", keywords: 45, avgPos: 8.2, topKeyword: "best seo agency austin", change: "+3", gsc: true },
  { client: "Jake Morrison SEO", keywords: 38, avgPos: 12.5, topKeyword: "freelance seo consultant", change: "+1", gsc: true },
  { client: "Greenfield Law Firm", keywords: 32, avgPos: 15.8, topKeyword: "personal injury lawyer miami", change: "-2", gsc: true },
  { client: "Meridian Hotels Group", keywords: 28, avgPos: 18.3, topKeyword: "luxury hotel booking", change: "+5", gsc: false },
  { client: "BrightPath Marketing", keywords: 22, avgPos: 22.1, topKeyword: "digital marketing agency", change: "+2", gsc: true },
];

const localGridClients = [
  { client: "Apex Digital Agency", gridScore: "87%", coverage: "12/15 zones", topPosition: "#2", lastScan: "2 hrs ago" },
  { client: "Greenfield Law Firm", gridScore: "74%", coverage: "9/12 zones", topPosition: "#4", lastScan: "4 hrs ago" },
  { client: "Jake Morrison SEO", gridScore: "65%", coverage: "7/10 zones", topPosition: "#6", lastScan: "1 day ago" },
];

const seoConfigColumns = [
  { title: "Rank Tracking", icon: BarChart3, items: ["Daily position updates", "SERP feature detection", "Competitor tracking", "Mobile vs desktop", "Local pack monitoring"] },
  { title: "Search Console", icon: Globe, items: ["Impression tracking", "Click-through rates", "Query analysis", "Page performance", "Index coverage"] },
  { title: "AI Visibility", icon: Bot, items: ["ChatGPT mentions", "Perplexity citations", "AI Overview tracking", "Brand sentiment", "Source attribution"] },
  { title: "Local SEO", icon: MapPin, items: ["Grid rank tracking", "GMB optimization", "Citation monitoring", "Review tracking", "NAP consistency"] },
];

export default function AdminPlatformSeoKeywords() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">SEO & Rankings</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Monitor keyword rankings, Google Search Console, and AI search visibility across all clients</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} data-testid={`stat-card-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold" data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</span>
                </div>
                <p className={`text-xs mt-1 ${stat.subtitleColor || "text-muted-foreground"}`}>{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Client Rankings Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead className="text-right">Keywords</TableHead>
                      <TableHead className="text-right">Avg. Pos</TableHead>
                      <TableHead>Top Keyword</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead>GSC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientRankings.map((row, i) => (
                      <TableRow key={i} data-testid={`row-ranking-${i}`}>
                        <TableCell className="font-medium">{row.client}</TableCell>
                        <TableCell className="text-right">{row.keywords}</TableCell>
                        <TableCell className="text-right">{row.avgPos}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{row.topKeyword}</TableCell>
                        <TableCell className={`text-right ${row.change.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>{row.change}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={row.gsc ? "text-emerald-600 border-emerald-500/30 text-xs" : "text-muted-foreground text-xs"}
                          >
                            {row.gsc ? "Connected" : "Not Set Up"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Search Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ChatGPT Mentions</p>
                  <p className="text-xl font-bold">23</p>
                  <p className="text-xs text-emerald-600">+5 this week</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Perplexity Citations</p>
                  <p className="text-xl font-bold">15</p>
                  <p className="text-xs text-emerald-600">+3 this week</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">AI Overview Appearances</p>
                  <p className="text-xl font-bold">8</p>
                  <p className="text-xs text-emerald-600">+2 this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold" data-testid="text-section-local-grid">Local Search Grid</h2>
          <p className="text-sm text-muted-foreground mb-4">Track local pack rankings across geographic zones</p>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Grid Score</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Top Position</TableHead>
                    <TableHead>Last Scan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localGridClients.map((row, i) => (
                    <TableRow key={i} data-testid={`row-local-grid-${i}`}>
                      <TableCell className="font-medium">{row.client}</TableCell>
                      <TableCell className="font-medium">{row.gridScore}</TableCell>
                      <TableCell className="text-muted-foreground">{row.coverage}</TableCell>
                      <TableCell className="text-muted-foreground">{row.topPosition}</TableCell>
                      <TableCell className="text-muted-foreground">{row.lastScan}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4" data-testid="text-section-seo-config">Platform SEO Configuration</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {seoConfigColumns.map((col) => (
              <Card key={col.title}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <col.icon className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">{col.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {col.items.map((item, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
