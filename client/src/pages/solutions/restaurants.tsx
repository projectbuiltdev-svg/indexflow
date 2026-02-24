import { Link } from "wouter";
import { Search, BarChart3, FileSearch, Link2, Code, CheckCircle, ArrowRight, AlertTriangle, Target, TrendingUp, MapPin, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";
import { colorShadows } from "@/lib/color-shadows";
import { ClosingCTA } from "@/components/closing-cta";
import { DoubleTicker } from "@/components/double-ticker";

const challenges = [
  {
    icon: AlertTriangle,
    title: "Multiple Rank Tracker Accounts",
    description: "Juggling separate rank tracking tools for each client wastes time and makes cross-client reporting a nightmare.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: FileSearch,
    title: "Manual SEO Audits",
    description: "Running on-page audits one site at a time is tedious and error-prone, leaving gaps that hurt client results.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: BarChart3,
    title: "No Centralized Reporting",
    description: "Pulling data from five different dashboards to build a single client report kills your margins and your weekends.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const features = [
  {
    icon: TrendingUp,
    title: "Rank Tracking at Scale",
    description: "Track thousands of keywords across all clients from one dashboard with daily updates and historical data.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: MapPin,
    title: "Local Search Grid",
    description: "Visualize local rankings on a geographic grid to show clients exactly where they appear in map results.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: FileSearch,
    title: "On-Page SEO Auditing",
    description: "Automated site audits catch technical issues, missing meta tags, broken links, and schema errors in minutes.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Link2,
    title: "Link Building Tools",
    description: "Discover link opportunities, track backlink profiles, and manage outreach campaigns for every client.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Code,
    title: "Schema Markup Generator",
    description: "Generate and validate structured data markup to help client sites earn rich snippets and better SERP visibility.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: BarChart3,
    title: "White-Label Reporting",
    description: "Generate branded, client-ready SEO reports with your logo and domain in a few clicks.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const differentiators = [
  {
    icon: Target,
    title: "Built for Agencies, Not Hobbyists",
    description: "Every feature is designed for multi-client workflows. No more duct-taping solo tools together.",
  },
  {
    icon: Zap,
    title: "All SEO Tools in One Platform",
    description: "Rank tracking, audits, local grid, link building, and reporting under one roof at one price.",
  },
  {
    icon: Shield,
    title: "Your Brand, Your Platform",
    description: "White-label everything from reports to dashboards so clients see your agency, not ours.",
  },
];

export default function SEOAgenciesSolution() {
  return (
    <Layout>
      <SEO {...seoData.restaurants} />
      <section className="relative pt-6 pb-20 lg:pt-10 lg:pb-28 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4" data-testid="badge-seo-agencies">
              <Search className="w-3 h-3 mr-1" />
              For SEO Agencies
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-seo-agencies">
              Rank Every Client,{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                From One Dashboard
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-seo-agencies-subtitle">
              Stop juggling five SEO tools to manage ten clients. IndexFlow gives your agency 
              rank tracking, local search grids, on-page audits, link building, and schema 
              markup in one white-label platform.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-seo-agencies-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-seo-agencies-pricing">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DoubleTicker />

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Key Challenges
            </Badge>
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-seo-challenges">Pain Points Every SEO Agency Knows</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These are the bottlenecks that keep SEO agencies from scaling profitably.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {challenges.map((challenge, i) => (
              <Card key={challenge.title} className={`hover-elevate hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`} data-testid={`card-challenge-${challenge.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${challenge.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <challenge.icon className={`w-7 h-7 ${challenge.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
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
              <Zap className="w-3 h-3 mr-1" />
              How IndexFlow Helps
            </Badge>
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-seo-features">Everything Your SEO Agency Needs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete SEO toolkit purpose-built for agencies managing multiple clients.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={feature.title} className={`hover-elevate hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`} data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}>
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

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Why IndexFlow
            </Badge>
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-seo-differentiators">Why SEO Agencies Choose IndexFlow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three reasons agencies switch from scattered tools to one unified platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {differentiators.map((diff, i) => (
              <Card key={diff.title} className={`hover-elevate hover:-translate-y-1 transition-all ${colorShadows[i % colorShadows.length]}`} data-testid={`card-diff-${diff.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <diff.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{diff.title}</h3>
                  <p className="text-sm text-muted-foreground">{diff.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="heading-seo-cta">Ready to Scale Your SEO Agency?</h2>
          <p className="text-muted-foreground mb-8">
            Join agencies using IndexFlow to manage more clients with less overhead.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-seo-agencies-bottom-cta">
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <ClosingCTA />
    </Layout>
  );
}
