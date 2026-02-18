import { Link } from "wouter";
import { TrendingUp, Grid3X3, FileText, Link2, Code, Search, ClipboardCheck, BarChart3, CheckCircle, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: TrendingUp,
    title: "Rank Tracker",
    description: "Monitor up to 1,000 keywords per workspace with weekly auto-refresh. Track positions on Google and buy instant credits for on-demand checks.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Grid3X3,
    title: "Local Search Grid",
    description: "Visualize local rankings across a 5x5 geographic grid powered by DataForSEO. See exactly where each client ranks street by street.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: FileText,
    title: "On-Page Auditor",
    description: "Analyze any page for SEO issues — title tags, meta descriptions, heading structure, image alt text, internal links, and content length.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: ClipboardCheck,
    title: "Post-Processing Validator",
    description: "Automatically validate published content against quality rules: word count, heading count, FAQ sections, schema markup, and internal linking.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Link2,
    title: "Cross-Post Link Builder",
    description: "Automatically identify and insert internal links between articles across a workspace. Build topical authority with intelligent cross-linking.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Code,
    title: "Schema Markup Auto-Detection",
    description: "Auto-detect and inject 20+ schema types including Article, FAQ, HowTo, LocalBusiness, Product, Review, and Organization markup.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Search,
    title: "Site Profiler",
    description: "Get a full SEO health overview for any domain — authority metrics, backlink profile, top pages, and technical issues at a glance.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];

const benefits = [
  "Complete SEO toolkit built into every workspace",
  "Automated weekly rank tracking and local grid scans",
  "20+ schema markup types auto-detected and injected",
  "Cross-post link building for topical authority at scale",
];

export default function SeoPage() {
  return (
    <Layout>
      <SEO {...seoData.seo} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Globe className="w-3 h-3 mr-1" />
              SEO Tools
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Full-Suite{" "}
              <span className="bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
                SEO Tools
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Rank Tracker, Local Search Grid, On-Page Auditor, Schema Markup, Link Builder, and Site Profiler — all built into every workspace for your agency clients.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-seo-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/platform/rank-tracking">
                <Button size="lg" variant="outline" data-testid="button-seo-rank-tracking">
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
            <h2 className="text-3xl font-bold mb-4">Everything Your Agency Needs for SEO</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete SEO toolkit designed for agencies managing multiple client workspaces.
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
              <Badge variant="outline" className="mb-4">
                <BarChart3 className="w-3 h-3 mr-1" />
                Benefits
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                SEO at Agency Scale
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
                <div className="text-4xl font-bold text-primary mb-2">7</div>
                <p className="text-sm text-muted-foreground">SEO Tools Built In</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">1,000</div>
                <p className="text-sm text-muted-foreground">Keywords / Workspace</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">20+</div>
                <p className="text-sm text-muted-foreground">Schema Types</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">5x5</div>
                <p className="text-sm text-muted-foreground">Local Grid</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Power Your Agency's SEO?</h2>
          <p className="text-muted-foreground mb-8">
            See how IndexFlow's SEO tools help agencies deliver measurable results for every client.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-seo-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
