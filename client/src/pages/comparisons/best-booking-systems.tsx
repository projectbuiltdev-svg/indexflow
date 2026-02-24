import { Link } from "wouter";
import { CheckCircle, X, ArrowRight, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const platforms = [
  {
    name: "indexFlow",
    tagline: "The All-in-One Agency SEO Platform",
    highlight: true,
    pros: [
      "Rank tracking, content engine, CMS publishing in one tool",
      "Built-in CRM, invoicing, and client management",
      "White-label branding for agency client portals",
      "AI voice assistant and SMS notifications included",
      "Flat $99/month with no per-seat fees",
    ],
    cons: [
      "Newer platform, growing feature set",
    ],
  },
  {
    name: "SEMrush",
    tagline: "Keyword Research & Competitive Analysis",
    highlight: false,
    pros: [
      "Industry-leading keyword research database",
      "Comprehensive competitive analysis tools",
      "PPC and advertising insights",
    ],
    cons: [
      "No content creation or CMS publishing",
      "No CRM, invoicing, or client management",
      "Starts at $129/mo, Guru plan $249/mo",
      "Per-seat pricing adds up for teams",
    ],
  },
  {
    name: "Ahrefs",
    tagline: "Backlink Analysis & Site Audit Leader",
    highlight: false,
    pros: [
      "Best-in-class backlink index and analysis",
      "Powerful site audit and technical SEO tools",
      "Reliable rank tracking",
    ],
    cons: [
      "No content creation or CMS integration",
      "No CRM or invoicing features",
      "No white-label branding options",
      "Starts at $99/mo, scales to $999/mo",
    ],
  },
  {
    name: "SurferSEO",
    tagline: "On-Page SEO & Content Optimization",
    highlight: false,
    pros: [
      "Strong on-page content optimization scoring",
      "Content editor with real-time SEO suggestions",
      "SERP analyzer for competitive insights",
    ],
    cons: [
      "No rank tracking or site audit tools",
      "No CRM, invoicing, or client management",
      "Limited to content optimization only",
      "Requires additional tools for a full SEO workflow",
    ],
  },
  {
    name: "HubSpot",
    tagline: "Marketing & CRM Suite",
    highlight: false,
    pros: [
      "Excellent CRM and marketing automation",
      "Email marketing and lead nurturing workflows",
      "Strong reporting and analytics",
    ],
    cons: [
      "Very limited SEO tools, no rank tracking",
      "No AI content engine or CMS publishing",
      "Expensive at scale -- Marketing Hub starts at $800/mo",
      "Not built for SEO agencies specifically",
    ],
  },
];

export default function BestBookingSystems() {
  return (
    <Layout>
      <SEO {...seoData.bestPlatforms} />
      <section className="relative pt-6 pb-20 lg:pt-10 lg:pb-28 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Award className="w-3 h-3 mr-1" />
              2026 Guide
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-best-seo-platforms">
              Best SEO Platforms{" "}
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                for Agencies
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Compare the top SEO platforms for agencies. Find the right fit
              for your team's size, budget, and workflow needs.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-best-seo-try">
                  Try indexFlow <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/comparisons/pricing">
                <Button size="lg" variant="outline" data-testid="button-best-seo-pricing">
                  Pricing Comparison
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top Agency SEO Platforms Compared</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              An honest look at each platform's strengths and weaknesses for agency use.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <Card
                key={platform.name}
                className={`hover-elevate ${platform.highlight ? "border-primary/50 shadow-md" : ""}`}
                data-testid={`card-platform-${platform.name.toLowerCase().replace(/[.\s]/g, "-")}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                    <h3 className="font-bold text-lg">{platform.name}</h3>
                    {platform.highlight && (
                      <Badge className="flex-shrink-0">
                        <Star className="w-3 h-3 mr-1" />
                        Top Pick
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{platform.tagline}</p>
                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Pros</p>
                    <ul className="space-y-1.5">
                      {platform.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Cons</p>
                    <ul className="space-y-1.5">
                      {platform.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2 text-sm">
                          <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Consolidate Your Agency Tool Stack?</h2>
          <p className="text-muted-foreground mb-8">
            indexFlow combines rank tracking, content creation, CMS publishing, CRM, and invoicing in one platform.
            Book a demo and see why agencies are switching.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-best-seo-bottom-cta">
              Try indexFlow <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
