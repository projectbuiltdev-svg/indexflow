import { useQuery } from "@tanstack/react-query";
import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Grid3X3, Bot, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface RankKeyword {
  id: number;
  venueId: string;
  keyword: string;
}

interface GridKeyword {
  id: number;
  venueId: string;
  keyword: string;
}

export default function AdminSEO() {
  useVenue();

  const { data: rankKeywords = [], isLoading: rankLoading } = useQuery<RankKeyword[]>({
    queryKey: ["/api/admin/rank-keywords"],
  });

  const { data: gridKeywords = [], isLoading: gridLoading } = useQuery<GridKeyword[]>({
    queryKey: ["/api/admin/grid-keywords"],
  });

  const isLoading = rankLoading || gridLoading;

  const sections = [
    {
      title: "Rank Tracker",
      description: "Track keyword rankings across search engines for your venues.",
      icon: Search,
      href: "/admin/seo/rank-tracker",
      testId: "card-rank-tracker",
      count: rankKeywords.length,
      countLabel: "keywords tracked",
    },
    {
      title: "Local Grid",
      description: "Monitor local search visibility with grid-based scanning.",
      icon: Grid3X3,
      href: "/admin/seo/local-grid",
      testId: "card-local-grid",
      count: gridKeywords.length,
      countLabel: "grid keywords",
    },
    {
      title: "AI Visibility",
      description: "Track your brand visibility across AI-powered search platforms.",
      icon: Bot,
      href: "/admin/seo/ai-visibility",
      testId: "card-ai-visibility",
      count: null,
      countLabel: null,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-seo">SEO</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card data-testid="stat-rank-keywords">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rank Keywords</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : (
              <div className="text-2xl font-bold" data-testid="stat-rank-keywords-value">{rankKeywords.length}</div>
            )}
          </CardContent>
        </Card>
        <Card data-testid="stat-grid-keywords">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Grid Keywords</CardTitle>
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : (
              <div className="text-2xl font-bold" data-testid="stat-grid-keywords-value">{gridKeywords.length}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Card key={section.testId} data-testid={section.testId}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <section.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">{section.description}</p>
              {section.count !== null && (
                <p className="text-sm font-medium" data-testid={`count-${section.testId}`}>
                  {section.count} {section.countLabel}
                </p>
              )}
              <Link href={section.href}>
                <Button variant="outline" data-testid={`button-go-${section.testId}`}>
                  Open
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
