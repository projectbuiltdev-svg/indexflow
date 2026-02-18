import { useState } from "react";
import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, RefreshCw, Grid3X3, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const gridData: (number | null)[][] = [
  [2, 1, 3, 5, 8],
  [3, 1, 2, 7, 12],
  [5, 2, 1, 4, 15],
  [8, 4, 3, 6, null],
  [14, 9, 7, 11, 18],
];

function getCellColor(rank: number | null) {
  if (rank === null) return "bg-muted text-muted-foreground";
  if (rank <= 3) return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400";
  if (rank <= 10) return "bg-amber-500/20 text-amber-700 dark:text-amber-400";
  return "bg-red-500/20 text-red-700 dark:text-red-400";
}

const gridStats = [
  { label: "Grid Points", value: "25", icon: Grid3X3 },
  { label: "Top 3 Positions", value: "8", icon: Target },
  { label: "Avg Position", value: "6.2", icon: TrendingUp },
];

export default function DashboardLocalSearchGrid() {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("seo agency");
  const [location, setLocation] = useState("New York, NY");
  const [scanning, setScanning] = useState(false);

  const handleRunScan = () => {
    setScanning(true);
    toast({ title: "Scan in progress", description: "Running local search grid scan..." });
    setTimeout(() => {
      setScanning(false);
      toast({ title: "Scan complete", description: "Grid has been updated with latest results." });
    }, 2000);
  };

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Local Search Grid</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Geo-grid rank tracking for your area</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gridStats.map((stat) => (
            <Card key={stat.label} data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1" data-testid={`text-stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}>{stat.value}</p>
                  </div>
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card data-testid="card-grid-setup">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold">Grid Setup</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Keyword</Label>
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter keyword to track"
                  data-testid="input-keyword"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                    data-testid="input-location"
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleRunScan} disabled={scanning} data-testid="button-run-scan">
              <RefreshCw className={`w-4 h-4 mr-2 ${scanning ? "animate-spin" : ""}`} />
              {scanning ? "Scanning..." : "Run New Scan"}
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-grid-results">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h3 className="font-semibold">Results Grid</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500/20 border border-emerald-500/30" />
                  <span>Rank 1-3</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/30" />
                  <span>Rank 4-10</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/30" />
                  <span>Rank 11+</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-muted border" />
                  <span>Not found</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 max-w-md" data-testid="grid-visualization">
              {gridData.flat().map((rank, idx) => (
                <div
                  key={idx}
                  className={`aspect-square rounded-md flex items-center justify-center font-semibold text-sm ${getCellColor(rank)}`}
                  data-testid={`grid-cell-${idx}`}
                >
                  {rank !== null ? rank : "-"}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" data-testid="badge-keyword-tracked">
                <MapPin className="w-3 h-3 mr-1" />
                {keyword}
              </Badge>
              <Badge variant="secondary" data-testid="badge-location">
                {location}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
