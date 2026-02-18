import { Link } from "wouter";
import { Search, MousePointerClick, Eye, BarChart3, FileText, Smartphone, Settings, CalendarDays, CheckCircle, ArrowRight, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: Search,
    title: "Search Query Data",
    description: "See exactly what queries bring visitors to your restaurant's website from Google.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: MousePointerClick,
    title: "Click-Through Rates",
    description: "Understand how often people click your listing vs just seeing it in results.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Eye,
    title: "Impressions Tracking",
    description: "Monitor how many times your restaurant appears in Google search results.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: BarChart3,
    title: "Average Position",
    description: "Track your average ranking position across all search queries over time.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: FileText,
    title: "Page Performance",
    description: "See which pages on your site perform best in search and which need work.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Smartphone,
    title: "Device Breakdown",
    description: "Understand how your search traffic splits between mobile, desktop, and tablet.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Settings,
    title: "Easy GSC Credential Setup",
    description: "Connect your Google Search Console account in minutes with our guided setup.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: CalendarDays,
    title: "Date Range Filtering",
    description: "Analyze performance across custom date ranges to spot trends and seasonality.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

const benefits = [
  "No switching between tools -- everything in one dashboard",
  "Actionable search insights tailored to your business",
  "Track SEO improvements with clear before/after data",
];

export default function SearchConsolePage() {
  return (
    <Layout>
      <SEO {...seoData.searchConsole} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <LineChart className="w-3 h-3 mr-1" />
              Search Console
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Google Search Console{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Integrated
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              See your search performance data right inside your dashboard.
              No more switching tabs -- clicks, impressions, and rankings all in one place.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-search-console-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/platform/rank-tracking">
                <Button size="lg" variant="outline" data-testid="button-search-console-rank-tracking">
                  Rank Tracking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All Your Search Data in One Place</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything Google Search Console offers, surfaced right in your indexFlow dashboard.
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
                Search Insights Without the Hassle
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
                <div className="text-4xl font-bold text-primary mb-2">GSC</div>
                <p className="text-sm text-muted-foreground">Native Integration</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">CTR</div>
                <p className="text-sm text-muted-foreground">Click Tracking</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">90d</div>
                <p className="text-sm text-muted-foreground">Historical Data</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">1-Click</div>
                <p className="text-sm text-muted-foreground">Easy Setup</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to See Your Search Data?</h2>
          <p className="text-muted-foreground mb-8">
            Connect Google Search Console and start making smarter SEO decisions.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-search-console-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
