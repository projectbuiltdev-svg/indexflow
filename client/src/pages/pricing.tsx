import { Link } from "wouter";
import { Check, ArrowRight, Users, Layers, Building2, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";
import { colorShadows } from "@/lib/color-shadows";

const plans = [
  {
    name: "Solo",
    price: "$99",
    period: "per month",
    tagline: "Stop paying for 6 tools. Pay for one.",
    highlight: false,
    features: [
      "1 user",
      "1 workspace",
      "40 AI posts/month",
      "All 40+ tools included",
      "Google Indexing Automation",
      "Rank Tracker — 1,000 keywords",
      "Email support",
    ],
    cta: "Get Started",
    ctaLink: "/contact",
    icon: Users,
  },
  {
    name: "Pro",
    price: "$199",
    period: "per month",
    tagline: "Turn your SEO service into a product.",
    highlight: true,
    features: [
      "5 users",
      "50 white label workspaces",
      "Bulk campaigns",
      "Everything in Solo",
      "Full white-label branding",
      "Client-facing dashboards",
      "Reseller licence included",
      "Priority support",
    ],
    cta: "Start Free 30-Day Trial",
    ctaLink: "/contact",
    icon: Layers,
  },
  {
    name: "Agency",
    price: "$349",
    period: "per month",
    tagline: "Infrastructure for agencies that mean business.",
    highlight: false,
    features: [
      "10 users",
      "100 white label workspaces",
      "Full white label",
      "Everything in Pro",
      "Advanced API access",
      "Priority onboarding call",
      "Dedicated account manager",
    ],
    cta: "Start Free 30-Day Trial",
    ctaLink: "/contact",
    icon: Building2,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    tagline: "You've outgrown tools. You need infrastructure.",
    highlight: false,
    features: [
      "Unlimited everything",
      "Super Admin Dashboard",
      "Dedicated support",
      "Custom contracts",
      "White glove onboarding",
      "SLA guarantees",
      "Co-marketing options",
    ],
    cta: "Talk To Us",
    ctaLink: "/contact",
    icon: Crown,
  },
];

const toolCategories = [
  {
    title: "Programmatic Content Engine",
    items: [
      "AI Post Generator — bulk drafts at scale",
      "Post Editor",
      "Pages Builder",
      "Campaign Manager",
      "Content Moderation & Quality Gates",
      "Stock Images with auto alt text",
      "CMS Integration — WordPress, Webflow, Shopify, Ghost, Wix",
    ],
  },
  {
    title: "SEO Tools",
    items: [
      "Internal Link Builder",
      "Link Health Monitor",
      "Post Validator — per-post SEO scoring",
      "On-Page Auditor",
      "Site Profiler",
      "Schema Markup Generator",
      "SEO Health Dashboard",
      "SEO Reports",
    ],
  },
  {
    title: "Rank Tracker",
    items: [
      "Rank Tracker — 1,000 keywords weekly",
      "Local Search Grid (5x5) — see where you rank",
      "GSC Ingestion Layer",
      "Competitor Keyword Spy",
      "SERP Preview Tool",
      "Keyword Gap Analysis",
    ],
  },
  {
    title: "CRM & Pipeline",
    items: [
      "Lead to Booking CRM",
      "Contacts Manager",
      "Deal Pipeline (Kanban)",
      "Full-Funnel Attribution",
    ],
  },
  {
    title: "AI & Communications",
    items: [
      "AI Widget — website chat",
      "Widget Monitoring",
      "Widget Code Generator",
      "Twilio Voice",
      "Twilio SMS",
      "Twilio Call Logs",
    ],
  },
  {
    title: "Connections (BYOK)",
    items: [
      "AI Provider Connections",
      "Image Bank Connections",
      "Payment Connections",
      "Twilio Account Connection",
    ],
  },
  {
    title: "Analytics & Reporting",
    items: [
      "Analytics Overview",
      "Export Data",
      "SEO Reports with snapshots",
      "Invoicing — line items, multi-currency",
    ],
  },
  {
    title: "Settings & Admin",
    items: [
      "Team & Invites",
      "White Label Branding",
      "Billing & Usage",
      "Setup Guide",
      "AI Training / Knowledge Base",
      "AI Channels",
    ],
  },
];

const replacements = [
  { from: "Ahrefs / SEMrush", to: "Rank Tracker + Local Search Grid" },
  { from: "SurferSEO / Clearscope", to: "Quality Gates + Post Validator" },
  { from: "Jasper / Copy.ai", to: "Content Engine with GPT-4o" },
  { from: "HubSpot / Pipedrive", to: "Lead to Booking CRM" },
  { from: "FreshBooks / QuickBooks", to: "Invoice Builder" },
  { from: "Intercom / Drift", to: "AI Widget" },
  { from: "LinkWhisper", to: "Cross-Post Link Builder" },
  { from: "Screaming Frog", to: "On-Page SEO Auditor" },
];

const audiences = [
  {
    title: "SEO Agencies",
    description: "Rank tracking, local search grids, on-page audits, GSC Ingestion Layer",
  },
  {
    title: "Content Agencies",
    description: "Bulk AI drafts, quality gates, CMS publishing, content reporting",
  },
  {
    title: "Digital Marketing Agencies",
    description: "Full-service SEO, content, CRM, invoicing and reporting",
  },
  {
    title: "Freelancers & Consultants",
    description: "Professional tools at solo pricing. White label from day one.",
  },
];

export default function Pricing() {
  return (
    <Layout>
      <SEO {...seoData.pricing} />
      <div className="min-h-screen">
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-testid="text-pricing-title">
                Simple Pricing
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-pricing-subtitle">
                Plans that scale with you.<br />
                Start small, grow without limits. No contracts, cancel anytime. Every plan includes all 40+ tools.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-start">
              {plans.map((plan, i) => (
                <Card
                  key={plan.name}
                  className={`relative overflow-visible transition-all hover:-translate-y-1 ${colorShadows[i % colorShadows.length]} ${plan.highlight ? "ring-2 ring-primary/30" : ""}`}
                  data-testid={`card-pricing-${plan.name.toLowerCase()}`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-yellow-500 text-black border-0 shadow-[0_0_20px_rgba(234,179,8,0.5)]" data-testid="badge-popular">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pt-8 pb-2">
                    <CardTitle className="text-xl" data-testid={`text-plan-name-${plan.name.toLowerCase()}`}>
                      {plan.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold" data-testid={`text-price-${plan.name.toLowerCase()}`}>
                          {plan.price}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
                    </div>

                    <p className="text-center text-sm text-muted-foreground italic" data-testid={`text-tagline-${plan.name.toLowerCase()}`}>
                      "{plan.tagline}"
                    </p>

                    <ul className="space-y-2.5">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-sm" data-testid={`feature-${plan.name.toLowerCase()}-${index}`}>
                          <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="pb-6">
                    <Link href={plan.ctaLink} className="w-full">
                      <Button
                        className="w-full"
                        size="default"
                        variant={plan.highlight ? "default" : "outline"}
                        data-testid={`button-cta-${plan.name.toLowerCase()}`}
                      >
                        {plan.cta} <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

          </div>
        </section>

        <section className="py-20 lg:py-28 bg-accent/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3" data-testid="text-everything-title">
                Everything In The Box
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                40+ tools. One subscription.<br />
                No feature gating. Every tier gets the full suite. Here's exactly what you get from day one.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {toolCategories.map((cat, i) => (
                <Card key={cat.title} className={`transition-all hover:-translate-y-1 ${colorShadows[i % colorShadows.length]}`} data-testid={`card-tools-${i}`}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-base mb-4">{cat.title}</h3>
                    <ul className="space-y-2">
                      {cat.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-14 text-center">
              <div className="inline-flex items-baseline gap-2">
                <span className="text-5xl font-bold">40+</span>
                <span className="text-muted-foreground text-sm max-w-md text-left leading-snug">
                  tools across 8 categories — content · SEO · CRM · AI · comms · analytics · white label · admin
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Solo · Pro · Agency · Enterprise — every plan, full access
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3" data-testid="text-replace-title">
                What You Replace
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                One login instead of eleven.<br />
                See exactly what IndexFlow replaces in your current stack.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {replacements.map((r, i) => (
                <Card key={i} className={`transition-all hover:-translate-y-1 ${colorShadows[i % colorShadows.length]}`} data-testid={`card-replace-${i}`}>
                  <CardContent className="p-5 flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/40">{r.from}</p>
                      <p className="text-sm font-semibold mt-1 flex items-center gap-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {r.to}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-accent/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3" data-testid="text-serve-title">
                Who We Serve
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Built for agencies & solo teams.<br />
                Whether you're a solo freelancer or a 50-person agency — IndexFlow scales with you.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {audiences.map((a, i) => (
                <Card key={a.title} className={`transition-all hover:-translate-y-1 ${colorShadows[i % colorShadows.length]}`} data-testid={`card-audience-${i}`}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-base mb-2">{a.title}</h3>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
