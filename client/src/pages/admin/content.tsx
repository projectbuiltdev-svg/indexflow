import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@shared/schema";

export default function AdminContent() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({ queryKey: ["/api/blog-posts"] });

  const statusVariant = (s: string) => {
    if (s === "published") return "default" as const;
    if (s === "draft") return "secondary" as const;
    if (s === "scheduled") return "outline" as const;
    return "secondary" as const;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="text-admin-content-title">Content Engine</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
          ) : !posts?.length ? (
            <p className="text-muted-foreground text-sm" data-testid="text-no-posts">No blog posts yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Venue ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Keyword</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((p) => (
                  <TableRow key={p.id} data-testid={`row-post-${p.id}`}>
                    <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{p.venueId}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(p.status)} className="text-xs">{p.status}</Badge>
                    </TableCell>
                    <TableCell>{p.category || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{p.primaryKeyword || "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
