import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  TrendingUp,
  Clock,
  Users,
  Building,
  MapPin,
  Quote,
  ChevronDown,
  ChevronUp,
  Search,
  FileText,
  BarChart3,
  Layers,
  Zap,
  Globe,
  Target,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";

interface CaseStudy {
  slug: string;
  business: string;
  category: "SEO Agency" | "Content Agency" | "Marketing Agency" | "White-Label Reseller";
  location: string;
  heroStat: string;
  heroLabel: string;
  summary: string;
  challenge: string;
  solution: string;
  solutionBullets: string[];
  results: { label: string; value: string; icon: typeof TrendingUp }[];
  quote: string;
  quotePerson: string;
  quoteRole: string;
  timeline: string;
  productsUsed: string[];
}

const categoryConfig = {
  "SEO Agency": { icon: Search, gradient: "from-orange-500 to-red-500", bg: "bg-orange-500/10 dark:bg-orange-500/20", text: "text-orange-600 dark:text-orange-400", ring: "ring-orange-500/20" },
  "Content Agency": { icon: FileText, gradient: "from-green-500 to-emerald-500", bg: "bg-green-500/10 dark:bg-green-500/20", text: "text-green-600 dark:text-green-400", ring: "ring-green-500/20" },
  "Marketing Agency": { icon: BarChart3, gradient: "from-blue-500 to-indigo-500", bg: "bg-blue-500/10 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-500/20" },
  "White-Label Reseller": { icon: Layers, gradient: "from-purple-500 to-pink-500", bg: "bg-purple-500/10 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400", ring: "ring-purple-500/20" },
};

const caseStudies: CaseStudy[] = [
  {
    slug: "apex-digital-marketing",
    business: "Apex Digital Marketing",
    category: "SEO Agency",
    location: "Austin, TX",
    heroStat: "2x",
    heroLabel: "Team Output",
    summary: "A mid-size SEO agency consolidated 8 separate tools into IndexFlow, doubling their team's output and cutting software costs by 60%.",
    challenge: "Apex Digital was juggling 8 different subscriptions for rank tracking, content generation, CRM, reporting, and local SEO. Data lived in silos, team members wasted hours exporting and importing between platforms, and monthly software costs had ballooned to over $4,000.",
    solution: "IndexFlow replaced their entire tool stack with a single platform covering rank tracking, content engine, CRM pipeline, SEO audits, and client reporting.",
    solutionBullets: [
      "Migrated rank tracking for 200+ client keywords into IndexFlow",
      "CRM pipeline replaced Trello, HubSpot, and spreadsheets",
      "Automated client reporting eliminated 10 hours of manual work per week",
      "Content Engine replaced their separate AI writing tool subscription",
    ],
    results: [
      { label: "Team Output", value: "2x", icon: TrendingUp },
      { label: "Tools Replaced", value: "8", icon: Zap },
      { label: "Cost Savings", value: "60%", icon: DollarSign },
      { label: "Hours Saved/Week", value: "25+", icon: Clock },
    ],
    quote: "We replaced 8 tools with IndexFlow and our team immediately became twice as productive. The all-in-one approach just works.",
    quotePerson: "Sarah Mitchell",
    quoteRole: "Founder, Apex Digital Marketing",
    timeline: "3 days",
    productsUsed: ["Rank Tracker", "Content Engine", "CRM", "SEO Audits", "Reports"],
  },
  {
    slug: "greenline-agency",
    business: "Greenline Agency",
    category: "White-Label Reseller",
    location: "Toronto, Canada",
    heroStat: "1 week",
    heroLabel: "Platform Launch",
    summary: "A digital marketing agency used IndexFlow's white-label features to launch their own branded SEO platform in under a week, creating a new revenue stream.",
    challenge: "Greenline Agency wanted to offer SEO tools under their own brand but building a custom platform was quoted at $150K+ and 6 months of development. Meanwhile, clients were asking for self-serve dashboards to monitor their SEO performance.",
    solution: "IndexFlow's white-label configuration let Greenline apply their own branding, domain, and client portals — launching a fully branded SEO platform without writing a line of code.",
    solutionBullets: [
      "Custom branding with Greenline's logo, colors, and domain",
      "Client portals with self-serve rank tracking and reports",
      "White-label reports generated automatically for each client",
      "Credit-based pricing model let them mark up and resell at their own margins",
    ],
    results: [
      { label: "Time to Launch", value: "1 week", icon: Clock },
      { label: "Dev Cost Saved", value: "$150K+", icon: DollarSign },
      { label: "New Revenue Stream", value: "Active", icon: TrendingUp },
      { label: "Client Portals", value: "35+", icon: Users },
    ],
    quote: "We launched our own branded SEO platform in a week. Our clients think we built it ourselves. The white-label features are incredible.",
    quotePerson: "David Park",
    quoteRole: "CEO, Greenline Agency",
    timeline: "5 days",
    productsUsed: ["White Label", "Client Portals", "Reports", "Rank Tracker"],
  },
  {
    slug: "brightpath-media",
    business: "BrightPath Media",
    category: "Content Agency",
    location: "London, UK",
    heroStat: "5x",
    heroLabel: "Content Output",
    summary: "A content-focused agency scaled from 10 blog posts per week to 50 using IndexFlow's Content Engine, without adding any new team members.",
    challenge: "BrightPath Media's content team of 4 was maxed out at 10 posts per week across all clients. Quality reviews, SEO optimization, and publishing workflows were manual and fragmented. They were turning away new clients because they couldn't scale production.",
    solution: "IndexFlow's Content Engine with AI-assisted drafting, SEO scoring, and bulk publishing transformed their entire content workflow.",
    solutionBullets: [
      "AI-assisted bulk content generation with brand voice controls",
      "Built-in SEO scoring ensures every post is optimized before publishing",
      "Campaign manager groups content by client and topic cluster",
      "Scheduled publishing queue eliminated manual posting across platforms",
    ],
    results: [
      { label: "Weekly Posts", value: "10 → 50", icon: TrendingUp },
      { label: "Team Size", value: "Same 4", icon: Users },
      { label: "Client Capacity", value: "3x", icon: Target },
      { label: "Revenue Growth", value: "+180%", icon: BarChart3 },
    ],
    quote: "Bulk content generation changed everything. We went from 10 posts a week to 50 without hiring anyone. Our revenue nearly tripled.",
    quotePerson: "Rachel Torres",
    quoteRole: "Content Director, BrightPath Media",
    timeline: "4 days",
    productsUsed: ["Content Engine", "SEO Scoring", "Campaign Manager", "Publishing Queue"],
  },
];

const heroStats = [
  { value: "2x", label: "Avg. Productivity Gain" },
  { value: "60%", label: "Avg. Cost Reduction" },
  { value: "3-5", label: "Days to Go Live" },
  { value: "5x", label: "Best Content Scale" },
];

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const config = categoryConfig[study.category];
  const CategoryIcon = config.icon;

  return (
    <Card className="overflow-visible" data-testid={`card-case-study-${index}`}>
      <CardContent className="p-0">
        <div
          className="cursor-pointer"
          onClick={() => setExpanded(!expanded)}
          data-testid={`button-toggle-study-${index}`}
        >
          <div className={`h-1.5 rounded-t-md bg-gradient-to-r ${config.gradient}`} />

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                <CategoryIcon className={`w-6 h-6 ${config.text}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-bold" data-testid={`text-study-name-${index}`}>{study.business}</h2>
                      <Badge variant="secondary" data-testid={`badge-study-category-${index}`}>{study.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {study.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Live in {study.timeline}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`} data-testid={`text-study-stat-${index}`}>
                        {study.heroStat}
                      </div>
                      <div className="text-xs text-muted-foreground">{study.heroLabel}</div>
                    </div>
                    <div className="text-muted-foreground">
                      {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-foreground/70 mt-3 leading-relaxed" data-testid={`text-study-summary-${index}`}>{study.summary}</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${
            expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="border-t" />

          <div className="grid sm:grid-cols-4 border-b">
            {study.results.map((r, i) => {
              const ResultIcon = r.icon;
              return (
                <div
                  key={i}
                  className={`p-4 sm:p-5 text-center ${i < study.results.length - 1 ? "sm:border-r" : ""} ${i < study.results.length - 1 ? "border-b sm:border-b-0" : ""}`}
                  data-testid={`stat-result-${index}-${i}`}
                >
                  <ResultIcon className={`w-5 h-5 mx-auto mb-2 ${config.text}`} />
                  <div className="text-xl sm:text-2xl font-bold">{r.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.label}</div>
                </div>
              );
            })}
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-destructive text-xs font-bold">!</span>
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">The Challenge</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed pl-7" data-testid={`text-study-challenge-${index}`}>{study.challenge}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-5 h-5 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
                  <Zap className={`w-3 h-3 ${config.text}`} />
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">The Solution</h3>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed pl-7 mb-3" data-testid={`text-study-solution-${index}`}>{study.solution}</p>
              <ul className="space-y-2 pl-7">
                {study.solutionBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.text}`} />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mx-5 sm:mx-6 mb-5 sm:mb-6 rounded-md bg-muted/50 p-5 relative">
            <Quote className={`w-8 h-8 absolute -top-3 -left-1 ${config.text} opacity-30`} />
            <blockquote className="text-sm sm:text-base italic text-foreground/80 leading-relaxed pl-4" data-testid={`text-study-quote-${index}`}>
              "{study.quote}"
            </blockquote>
            <div className="flex items-center gap-3 mt-4 pl-4">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {study.quotePerson.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-semibold" data-testid={`text-study-quote-person-${index}`}>{study.quotePerson}</div>
                <div className="text-xs text-muted-foreground">{study.quoteRole}</div>
              </div>
            </div>
          </div>

          <div className="border-t px-5 sm:px-6 py-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground mr-1">Products used:</span>
              {study.productsUsed.map((product) => (
                <Badge key={product} variant="outline" className="text-xs" data-testid={`badge-product-${index}-${product.toLowerCase().replace(/\s+/g, '-')}`}>
                  {product}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CaseStudies() {
  return (
    <Layout>
      <SEO
        title="Case Studies | IndexFlow"
        description="In-depth success stories from SEO agencies, content teams, and marketing firms using IndexFlow. See the real numbers behind our clients' growth."
        canonicalUrl="/case-studies"
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:to-primary/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="w-3 h-3 mr-1" />
              Success Stories
            </Badge>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight"
              data-testid="text-page-title"
            >
              Real Results.{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Real Agencies.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-page-subtitle">
              See how agencies and consultants around the world consolidated their tools,
              scaled their output, and grew revenue with IndexFlow.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {heroStats.map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-4 sm:p-5 text-center">
                  <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent" data-testid={`text-hero-stat-${i}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {caseStudies.length} case studies across {Object.keys(categoryConfig).length} agency types
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(categoryConfig).map(([cat, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <Badge key={cat} variant="outline" className="gap-1" data-testid={`badge-category-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Icon className={`w-3 h-3 ${cfg.text}`} />
                    {cat}
                  </Badge>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            {caseStudies.map((study, i) => (
              <CaseStudyCard key={study.slug} study={study} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" data-testid="text-cta-title">
                Ready to become our next success story?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto" data-testid="text-cta-desc">
                Join hundreds of agencies already scaling with IndexFlow.
                Your first consultation is free.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/book-demo">
                  <Button size="lg" data-testid="button-book-demo">
                    Book a Demo
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" data-testid="button-view-pricing">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
