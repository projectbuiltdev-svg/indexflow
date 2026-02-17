import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3X3, MapPin, TrendingUp, Eye } from "lucide-react";

interface GridScanWithKeyword {
  id: string;
  gridKeywordId: string;
  workspaceId: string;
  gridData: number[][];
  avgRank: number | null;
  visibility: number | null;
  scannedAt: string | null;
  keyword: string;
  location: string;
}

function GridCell({ rank }: { rank: number }) {
  let bgClass = "bg-red-500/20 text-red-700 dark:text-red-400";
  if (rank <= 3) bgClass = "bg-green-500/20 text-green-700 dark:text-green-400";
  else if (rank <= 7) bgClass = "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
  else if (rank <= 10) bgClass = "bg-orange-500/20 text-orange-700 dark:text-orange-400";

  return (
    <div className={`w-full aspect-square rounded-md flex items-center justify-center font-mono font-bold text-sm ${bgClass}`}>
      {rank > 20 ? "20+" : rank}
    </div>
  );
}

function SearchGrid({ gridData }: { gridData: number[][] }) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {gridData.flat().map((rank, i) => (
        <GridCell key={i} rank={rank} />
      ))}
    </div>
  );
}

export default function LocalGrid() {
  const { data: results, isLoading } = useQuery<GridScanWithKeyword[]>({
    queryKey: ["/api/grid-scan-results-with-keywords"],
  });

  const displayResults = results || [];

  const avgVisibility = displayResults.length
    ? (displayResults.reduce((sum, g) => sum + (g.visibility || 0), 0) / displayResults.length).toFixed(0)
    : "0";

  const avgRank = displayResults.length
    ? (displayResults.reduce((sum, g) => sum + (g.avgRank || 0), 0) / displayResults.length).toFixed(1)
    : "\u2014";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">5x5 Local Search Grid</h1>
        <p className="text-muted-foreground mt-1">Visualize local pack visibility across geographic areas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Grid Checks</p>
              <p className="text-xl font-bold mt-1" data-testid="text-grid-checks">{displayResults.length}</p>
            </div>
            <Grid3X3 className="w-5 h-5 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Avg Visibility</p>
              <p className="text-xl font-bold mt-1" data-testid="text-avg-visibility">{avgVisibility}%</p>
            </div>
            <Eye className="w-5 h-5 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Avg Rank</p>
              <p className="text-xl font-bold mt-1" data-testid="text-avg-rank">{avgRank}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-green-500/20" /> 1-3
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-yellow-500/20" /> 4-7
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-orange-500/20" /> 8-10
        </span>
        <span className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-500/20" /> 11+
        </span>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="aspect-square w-full" />
            </Card>
          ))}
        </div>
      ) : displayResults.length === 0 ? (
        <Card className="p-8 text-center">
          <Grid3X3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No grid checks yet. Run a local grid scan to see results.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayResults.map((result) => (
            <Card key={result.id} className="p-5" data-testid={`card-grid-${result.id}`}>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-semibold text-sm">{result.keyword}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{result.location}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {result.visibility?.toFixed(0)}% visible
                </Badge>
              </div>
              <SearchGrid gridData={result.gridData} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
