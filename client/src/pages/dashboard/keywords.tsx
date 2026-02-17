import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ArrowUp, ArrowDown, Minus, TrendingUp, Target, Hash } from "lucide-react";
import type { RankTrackerKeyword } from "@shared/schema";

function TrendIndicator({ current, previous }: { current?: number | null; previous?: number | null }) {
  if (!current || !previous) return <Minus className="w-3 h-3 text-muted-foreground" />;
  const diff = previous - current;
  if (Math.abs(diff) < 0.5) return <Minus className="w-3 h-3 text-muted-foreground" />;
  if (diff > 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs font-medium text-green-600 dark:text-green-400">
        <ArrowUp className="w-3 h-3" />
        {diff.toFixed(1)}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 text-xs font-medium text-red-500">
      <ArrowDown className="w-3 h-3" />
      {Math.abs(diff).toFixed(1)}
    </span>
  );
}

function DifficultyBar({ value }: { value?: number | null }) {
  if (!value) return <span className="text-muted-foreground">{"\u2014"}</span>;
  const color =
    value < 30 ? "bg-green-500" : value < 60 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-mono">{value}</span>
    </div>
  );
}

export default function RankTracker() {
  const { data: keywords, isLoading } = useQuery<RankTrackerKeyword[]>({
    queryKey: ["/api/rank-keywords"],
  });

  const avgPosition = keywords?.length
    ? (keywords.reduce((sum, k) => sum + (k.currentPosition || 0), 0) / keywords.length).toFixed(1)
    : "\u2014";

  const top3 = keywords?.filter((k) => k.currentPosition && k.currentPosition <= 3).length || 0;
  const top10 = keywords?.filter((k) => k.currentPosition && k.currentPosition <= 10).length || 0;
  const improving = keywords?.filter((k) => k.trend === "up").length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Rank Tracker</h1>
          <p className="text-muted-foreground mt-1">Monitor keyword positions across all workspaces</p>
        </div>
        <Button data-testid="button-add-keyword">
          <Plus className="w-4 h-4 mr-2" />
          Add Keywords
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg. Position", value: avgPosition, icon: Target },
          { label: "Top 3", value: top3, icon: TrendingUp },
          { label: "Top 10", value: top10, icon: Hash },
          { label: "Improving", value: improving, icon: ArrowUp },
        ].map((m) => (
          <Card key={m.label} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-xl font-bold mt-1" data-testid={`text-kw-${m.label.toLowerCase().replace(/[\s.]+/g, '-')}`}>{m.value}</p>
              </div>
              <m.icon className="w-5 h-5 text-primary" />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Position</TableHead>
                <TableHead>Change</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No keywords tracked yet. Add keywords to start monitoring.
                  </TableCell>
                </TableRow>
              ) : (
                keywords?.map((kw) => (
                  <TableRow key={kw.id} data-testid={`row-keyword-${kw.id}`}>
                    <TableCell>
                      <span className="font-medium text-sm">{kw.keyword}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono font-bold text-sm">
                        {kw.currentPosition ? `#${kw.currentPosition.toFixed(1)}` : "\u2014"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <TrendIndicator current={kw.currentPosition} previous={kw.previousPosition} />
                    </TableCell>
                    <TableCell className="text-right text-sm font-mono">
                      {kw.searchVolume?.toLocaleString() || "\u2014"}
                    </TableCell>
                    <TableCell>
                      <DifficultyBar value={kw.difficulty} />
                    </TableCell>
                    <TableCell>
                      {kw.url ? (
                        <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
                          {kw.url}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">{"\u2014"}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
