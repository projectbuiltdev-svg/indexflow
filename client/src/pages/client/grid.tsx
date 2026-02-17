import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3X3, MapPin } from "lucide-react";
import { useVenue } from "@/lib/venue-context";
import type { GridScanResult } from "@shared/schema";

interface GroupedGrid {
  keyword: string;
  scanDate: string;
  gridSize: number;
  cells: GridScanResult[];
}

function GridCell({ rank }: { rank: number | null }) {
  const r = rank ?? 21;
  let bgClass = "bg-red-500/20 text-red-700 dark:text-red-400";
  if (r <= 3) bgClass = "bg-green-500/20 text-green-700 dark:text-green-400";
  else if (r <= 7) bgClass = "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
  else if (r <= 10) bgClass = "bg-orange-500/20 text-orange-700 dark:text-orange-400";

  return (
    <div className={`w-full aspect-square rounded-md flex items-center justify-center font-mono font-bold text-sm ${bgClass}`}>
      {r > 20 ? "20+" : r}
    </div>
  );
}

function SearchGrid({ cells, gridSize }: { cells: GridScanResult[]; gridSize: number }) {
  const sorted = [...cells].sort((a, b) => a.gridIndex - b.gridIndex);
  return (
    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
      {sorted.map((cell) => (
        <GridCell key={cell.id} rank={cell.rank} />
      ))}
    </div>
  );
}

export default function ClientGrid() {
  const { selectedVenue } = useVenue();
  const { data: results, isLoading } = useQuery<GridScanResult[]>({
    queryKey: ["/api/grid-scan-results"],
  });

  const filteredResults = selectedVenue
    ? (results || []).filter((r) => r.venueId === selectedVenue.id)
    : results || [];

  const groupedGrids = useMemo(() => {
    const groups = new Map<string, GroupedGrid>();
    filteredResults.forEach((cell) => {
      const dateStr = cell.scanDate ? new Date(cell.scanDate).toISOString().split("T")[0] : "unknown";
      const key = `${cell.keyword}__${dateStr}`;
      if (!groups.has(key)) {
        groups.set(key, {
          keyword: cell.keyword,
          scanDate: dateStr,
          gridSize: cell.gridSize,
          cells: [],
        });
      }
      groups.get(key)!.cells.push(cell);
    });
    return Array.from(groups.values());
  }, [filteredResults]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Local Visibility</h1>
        <p className="text-muted-foreground mt-1">Visualize local pack visibility across geographic areas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Grid Scans</p>
              <p className="text-xl font-bold mt-1" data-testid="text-client-grid-checks">{groupedGrids.length}</p>
            </div>
            <Grid3X3 className="w-5 h-5 text-primary" />
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
      ) : groupedGrids.length === 0 ? (
        <Card className="p-8 text-center">
          <Grid3X3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No grid checks available yet.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupedGrids.map((group, idx) => (
            <Card key={`${group.keyword}-${group.scanDate}-${idx}`} className="p-5" data-testid={`card-client-grid-${idx}`}>
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h3 className="font-semibold text-sm">{group.keyword}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{group.scanDate}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {group.gridSize}x{group.gridSize}
                </Badge>
              </div>
              <SearchGrid cells={group.cells} gridSize={group.gridSize} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
