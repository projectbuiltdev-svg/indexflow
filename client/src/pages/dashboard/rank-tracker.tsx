import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ArrowUp, ArrowDown, Upload, Globe, Sparkles, Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sampleKeywords = [
  { keyword: "best seo agency near me", position: 3, change: 2, ai: true, url: "/services/seo" },
  { keyword: "local seo services", position: 7, change: -1, ai: false, url: "/services/local-seo" },
  { keyword: "content marketing agency", position: 12, change: 5, ai: true, url: "/services/content" },
  { keyword: "technical seo audit", position: 1, change: 0, ai: false, url: "/services/technical-seo" },
  { keyword: "link building services", position: 22, change: -3, ai: false, url: "/services/link-building" },
  { keyword: "google business profile optimization", position: 5, change: 4, ai: true, url: "/services/gbp" },
  { keyword: "seo consultant new york", position: 9, change: 1, ai: true, url: "/about" },
  { keyword: "website ranking improvement", position: 45, change: -8, ai: false, url: "/blog/ranking-tips" },
  { keyword: "white label seo platform", position: 4, change: 3, ai: true, url: "/platform" },
  { keyword: "ai content generator", position: 14, change: -2, ai: true, url: "/features/ai" },
];

export default function RankTracker() {
  const { toast } = useToast();
  const [keywordText, setKeywordText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleAddKeywords = () => {
    if (!keywordText.trim()) return;
    toast({ title: "Keywords added", description: "Your keywords have been submitted for tracking." });
    setKeywordText("");
  };

  const handleCheckNow = () => {
    toast({ title: "Rank check started", description: "Checking keyword positions now..." });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    toast({ title: "File received", description: "Processing your CSV file..." });
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Rank Tracker</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">powered by indexFlow</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-primary text-primary-foreground" data-testid="card-domain-info">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5" />
                  <span className="font-semibold">We Track your Domain</span>
                </div>
                <p className="text-sm opacity-90">Enter keywords below and we'll track their Google search positions daily for your domain.</p>
              </CardContent>
            </Card>

            <Card data-testid="card-add-keywords">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-sm">Add Keywords</h3>
                <Textarea
                  placeholder="Enter keywords, one per line..."
                  value={keywordText}
                  onChange={(e) => setKeywordText(e.target.value)}
                  className="min-h-[100px]"
                  data-testid="textarea-keywords"
                />
                <Button className="w-full" onClick={handleAddKeywords} data-testid="button-add-keywords">
                  Add Keywords
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-csv-upload">
              <CardContent className="p-4 space-y-3">
                <p className="text-xs text-muted-foreground text-center font-semibold tracking-wide">OR UPLOAD A CSV FILE</p>
                <div
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  data-testid="dropzone-csv"
                >
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag & drop your CSV file here</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-keywords-remaining">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Keywords</span>
                  <span className="text-sm text-muted-foreground" data-testid="text-keywords-remaining">0 / 1,000 remaining</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-instant-rank-check">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <h3 className="font-semibold text-sm">Instant Rank Check</h3>
                </div>
                <p className="text-xs text-muted-foreground">Use credits to check keyword positions instantly.</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Credits remaining: <span className="font-semibold" data-testid="text-credits">15</span></span>
                </div>
                <Button className="w-full" onClick={handleCheckNow} data-testid="button-check-now">
                  Check Now
                </Button>
              </CardContent>
            </Card>

            <Card data-testid="card-buy-credits">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-sm">Buy Rank Check Credits</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-md border" data-testid="pricing-5-checks">
                    <span className="text-sm">5 Checks</span>
                    <span className="font-semibold">$10</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md border" data-testid="pricing-25-checks">
                    <span className="text-sm">25 Checks</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">Save 20%</Badge>
                      <span className="font-semibold">$40</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-upload-1000">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Upload 1,000 Keywords</span> — bulk upload is available for tracking large keyword sets. Use the CSV uploader above.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card data-testid="card-performance">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Performance</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs uppercase tracking-wider">Keyword</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-center">#</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-center">Change</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider text-center">AI</TableHead>
                      <TableHead className="text-xs uppercase tracking-wider">URL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleKeywords.map((kw, index) => (
                      <TableRow key={index} data-testid={`row-keyword-${index}`}>
                        <TableCell className="font-medium text-sm" data-testid={`text-keyword-${index}`}>
                          {kw.keyword}
                        </TableCell>
                        <TableCell className="text-center font-semibold" data-testid={`text-position-${index}`}>
                          {kw.position}
                        </TableCell>
                        <TableCell className="text-center" data-testid={`text-change-${index}`}>
                          {kw.change > 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-emerald-600">
                              <ArrowUp className="w-3 h-3" />
                              {kw.change}
                            </span>
                          ) : kw.change < 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-red-500">
                              <ArrowDown className="w-3 h-3" />
                              {Math.abs(kw.change)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center" data-testid={`text-ai-${index}`}>
                          {kw.ai ? (
                            <Sparkles className="w-4 h-4 text-amber-500 mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground" data-testid={`text-url-${index}`}>
                          {kw.url}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
