import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import type { BlogPost as VenueBlogPost, Venue } from "@shared/schema";

export default function AdminContent() {
  const { selectedVenue } = useVenue();

  const queryParam = selectedVenue?.id ? `?venueId=${selectedVenue.id}` : "";

  const { data: posts = [], isLoading: postsLoading } = useQuery<VenueBlogPost[]>({
    queryKey: ["/api/blog-posts", queryParam],
  });

  const { data: venues = [] } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const venueMap = new Map(venues.map((v) => [v.id, v]));

  const statusVariant = (status: string) => {
    switch (status) {
      case "published": return "default" as const;
      case "scheduled": return "secondary" as const;
      default: return "outline" as const;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-content">
          Content / Blog Posts
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedVenue ? `Blog Posts - ${selectedVenue.name}` : "All Blog Posts"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {postsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8" data-testid="empty-state-content">
              No blog posts found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id} data-testid={`row-blog-post-${post.id}`}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{venueMap.get(post.venueId)?.name || post.venueId}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(post.status)}>{post.status}</Badge>
                    </TableCell>
                    <TableCell>{post.category || "-"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "-"}
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
