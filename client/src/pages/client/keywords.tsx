import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Hash } from "lucide-react";
import { useVenue } from "@/lib/venue-context";
import type { RankKeyword } from "@shared/schema";

export default function ClientKeywords() {
  const { selectedVenue } = useVenue();
  const { data: allKeywords, isLoading } = useQuery<RankKeyword[]>({
    queryKey: ["/api/rank-keywords"],
  });

  const keywords = selectedVenue
    ? (allKeywords || []).filter((k) => k.venueId === selectedVenue.id)
    : allKeywords || [];

  const totalKeywords = keywords.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">My Rankings</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your keyword positions
          {selectedVenue && <span> for <span className="font-medium text-foreground">{selectedVenue.name}</span></span>}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Keywords</p>
              <p className="text-xl font-bold mt-1" data-testid="text-client-kw-total-keywords">{totalKeywords}</p>
            </div>
            <Hash className="w-5 h-5 text-primary" />
          </div>
        </Card>
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
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                    No keywords tracked yet.
                  </TableCell>
                </TableRow>
              ) : (
                keywords.map((kw) => (
                  <TableRow key={kw.id} data-testid={`row-client-keyword-${kw.id}`}>
                    <TableCell>
                      <span className="font-medium text-sm">{kw.keyword}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {kw.createdAt ? new Date(kw.createdAt).toLocaleDateString() : "\u2014"}
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
