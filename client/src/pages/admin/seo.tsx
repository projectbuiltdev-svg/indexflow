import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3, Bot, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function AdminSEO() {
  useVenue();

  const sections = [
    {
      title: "Rank Tracker",
      description: "Track keyword rankings across search engines for your venues.",
      icon: Search,
      href: "/admin/seo/rank-tracker",
      testId: "card-rank-tracker",
    },
    {
      title: "Local Grid",
      description: "Monitor local search visibility with grid-based scanning.",
      icon: Grid3X3,
      href: "/admin/seo/local-grid",
      testId: "card-local-grid",
    },
    {
      title: "AI Visibility",
      description: "Track your brand visibility across AI-powered search platforms.",
      icon: Bot,
      href: "/admin/seo/ai-visibility",
      testId: "card-ai-visibility",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-seo">
          SEO
        </h1>
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
