import { Link } from "wouter";
import { Search, BarChart3, Upload, Clock, TrendingDown, Brain, Database, Smartphone, CheckCircle, ArrowRight, TrendingUp, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: Search,
    title: "Track Up to 1,000 Keywords",
    description: "Monitor keyword positions across Google for each workspace. Track up to 1,000 keywords simultaneously.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Upload,
    title: "CSV Bulk Keyword Upload",
    description: "Import hundreds of keywords at once with a simple CSV upload tool. Get tracking started in seconds.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Clock,
    title: "Weekly Auto-Refresh",
    description: "Automated weekly scans keep rankings up to date. No manual work required — data refreshes on schedule.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: CreditCard,
    title: "Buy Instant Credits",
    description: "Need an on-demand rank check? Purchase instant credits for immediate position updates between weekly scans.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: BarChart3,
    title: "Position History Charts",
    description: "Visualize ranking trends over time with interactive position history graphs. Spot improvements and drops instantly.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Brain,
    title: "AI-Powered Ranking Insights",
    description: "Get intelligent recommendations on which keywords to target based on ranking data and search trends.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Database,
    title: "DataForSEO Integration",
    description: "Enterprise-grade ranking data powered by DataForSEO's reliable infrastructure for accurate position tracking.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Smartphone,
    title: "Mobile vs Desktop Rankings",
    description: "Track how keyword positions differ between mobile and desktop search results for comprehensive coverage.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
];

const benefits = [
  "Know exactly where each client ranks for every important keyword",
  "Find untapped keyword opportunities across all workspaces",
  "Track progress over time with historical position data",
  "Make data-driven SEO decisions with confidence",
];

export default function RankTrackingPage() {
  return (
    <Layout>
      <SEO {...seoData.rankTracking} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <TrendingUp className="w-3 h-3 mr-1" />
              Rank Tracker
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Monitor 1,000 Keywords{" "}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Per Workspace
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Track keyword positions with weekly auto-refresh and on-demand instant credits.
              Know where your clients rank, spot opportunities, and watch visibility grow.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-rank-tracking-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-rank-tracking-pricing">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Rank Tracking Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to monitor and improve search visibility for every client.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${feature.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Benefits</Badge>
              <h2 className="text-3xl font-bold mb-6">
                Data-Driven SEO for Every Client
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">1,000</div>
                <p className="text-sm text-muted-foreground">Keywords / Workspace</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">7d</div>
                <p className="text-sm text-muted-foreground">Auto-Refresh</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">CSV</div>
                <p className="text-sm text-muted-foreground">Bulk Import</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">AI</div>
                <p className="text-sm text-muted-foreground">Powered Insights</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Track Your Client Rankings?</h2>
          <p className="text-muted-foreground mb-8">
            Start monitoring keyword positions across all your client workspaces today.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-rank-tracking-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
