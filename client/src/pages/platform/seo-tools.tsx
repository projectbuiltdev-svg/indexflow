import { Link } from "wouter";
import { TrendingUp, Grid3X3, Search, ArrowRight, BarChart3, MapPin, Globe, CheckCircle, Layout as LayoutIcon, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";

const tools = [
  {
    icon: TrendingUp,
    title: "Rank Tracker",
    description: "Track up to 1,000 keywords across Google search results and AI search engines. Upload keywords via CSV, get free weekly scans, and use on-demand credits for instant checks.",
    href: "/platform/seo",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: [
      "Up to 1,000 tracked keywords",
      "Free weekly scans included",
      "5 free starter credits ($10 value)",
      "Google rankings + AI mentions",
    ],
  },
  {
    icon: Grid3X3,
    title: "Local Search Grid",
    description: "See exactly where you rank across a 5x5 geographic grid around your business. Visualize your local dominance and identify weak spots in your coverage.",
    href: "/platform/local-search-grid",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    features: [
      "5x5 geo-grid scanning",
      "Up to 25 tracked keywords",
      "$5 starter credit included",
      "Pay-as-you-go scanning ($10/5 scans)",
    ],
  },
  {
    icon: Search,
    title: "Google Search Console",
    description: "Connect your Google Search Console directly to your dashboard. See real impressions, clicks, CTR, and average position — all without leaving indexFlow.",
    href: "/platform/search-console",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    features: [
      "Auto-synced data",
      "Impressions and clicks",
      "Click-through rate tracking",
      "Average position by query",
    ],
  },
];

const highlights = [
  {
    icon: Gauge,
    title: "One Dashboard",
    description: "All your SEO data in one place — no switching between tools or logging into separate services.",
  },
  {
    icon: LayoutIcon,
    title: "Simple to Use",
    description: "Designed for business owners, not SEO experts. Clear visuals, plain language, and actionable insights.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Watch your rankings improve over time with historical data and trend charts built into every tool.",
  },
  {
    icon: MapPin,
    title: "Local Focus",
    description: "Built specifically for businesses that rely on local customers finding them online.",
  },
];

export default function SeoToolsPage() {
  return (
    <Layout>
      <SEO
        title="Built-in SEO Tools — Included With Every Plan | indexFlow"
        description="Rank Tracker, Local Search Grid, and Google Search Console — built into every indexFlow plan. Monitor your search visibility from one simple dashboard."
        canonicalUrl="/platform/seo-tools"
      />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-green-500 text-white border-0" data-testid="badge-free">
              Built-in Tools
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="text-seo-tools-title">
              SEO Tools Built Into{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                Every Plan
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-seo-tools-subtitle">
              Monitor your search rankings, track local visibility, and connect Google Search Console — all from your simple-to-use client dashboard. No extra tools to buy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-seo-tools-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-seo-tools-pricing">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-tools-heading">Three Powerful Tools, Zero Extra Cost</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to understand how customers find you online — built right into your indexFlow dashboard.
            </p>
          </div>

          <div className="space-y-8">
            {tools.map((tool, index) => (
              <Card key={tool.title} className="overflow-visible" data-testid={`card-tool-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6 sm:p-8">
                  <div className="grid md:grid-cols-[1fr,auto] gap-6 items-start">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className={`w-12 h-12 rounded-full ${tool.bgColor} flex items-center justify-center shrink-0`}>
                          <tool.icon className={`w-6 h-6 ${tool.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{tool.title}</h3>
                          <Badge className="bg-green-500 text-white border-0 text-xs mt-1">Free</Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{tool.description}</p>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {tool.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex md:flex-col gap-2">
                      <Link href={tool.href}>
                        <Button variant="outline" className="gap-2" data-testid={`button-learn-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          Learn More <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Globe className="w-3 h-3 mr-1" />
              Your Dashboard
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Manage Everything From One Place</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your indexFlow client dashboard puts all your SEO data at your fingertips — simple, clear, and designed for business owners.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item) => (
              <Card key={item.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="text-seo-tools-bottom-heading">Start Tracking Your Rankings Today</h2>
          <p className="text-muted-foreground mb-8">
            Every indexFlow plan includes Rank Tracker, Local Search Grid, and Google Search Console at no extra charge. See how your business performs in search from day one.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="gap-2" data-testid="button-seo-tools-bottom-cta">
                Book a Discovery Call <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" data-testid="button-seo-tools-bottom-pricing">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
