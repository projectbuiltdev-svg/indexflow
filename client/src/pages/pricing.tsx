import { Link } from "wouter";
import { Check, ArrowRight, Users, Layers, Building2, Crown, Zap, PenTool, Search, BarChart3, UsersRound, Bot, Link2, PieChart, Settings, FileText, MessageSquare } from "lucide-react";
import { SiSemrush, SiHubspot, SiIntercom, SiQuickbooks } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { ClosingCTA } from "@/components/closing-cta";
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
    cta: "Start Free 14-Day Trial $1",
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
      "25 workspaces",
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
      "50 workspaces",
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
    price: "$999",
    period: "per month",
    tagline: "You've outgrown tools. You need infrastructure.",
    highlight: false,
    features: [
      "20 users, unlimited workspaces",
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
    icon: PenTool,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
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
    icon: Search,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
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
    icon: BarChart3,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
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
    icon: UsersRound,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    items: [
      "Lead to Close CRM",
      "Contacts Manager",
      "Deal Pipeline (Kanban)",
      "Full-Funnel Attribution",
    ],
  },
  {
    title: "AI & Communications",
    icon: Bot,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
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
    icon: Link2,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    items: [
      "AI Provider Connections",
      "Image Bank Connections",
      "Payment Connections",
      "Twilio Account Connection",
    ],
  },
  {
    title: "Analytics & Reporting",
    icon: PieChart,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    items: [
      "Analytics Overview",
      "Export Data",
      "SEO Reports with snapshots",
      "Invoicing — line items, multi-currency",
    ],
  },
  {
    title: "Settings & Admin",
    icon: Settings,
    color: "text-slate-500",
    bgColor: "bg-slate-500/10",
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

const replacements: { from: string; to: string; icon: any; color: string; bgColor: string }[] = [
  { from: "Ahrefs / SEMrush", to: "Rank Tracker + Local Search Grid", icon: SiSemrush, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { from: "SurferSEO / Clearscope", to: "Quality Gates + Post Validator", icon: Search, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { from: "Jasper / Copy.ai", to: "Content Engine with GPT-4o", icon: PenTool, color: "text-rose-500", bgColor: "bg-rose-500/10" },
  { from: "HubSpot / Pipedrive", to: "Lead to Close CRM", icon: SiHubspot, color: "text-amber-600", bgColor: "bg-amber-600/10" },
  { from: "FreshBooks / QuickBooks", to: "Invoice Builder", icon: SiQuickbooks, color: "text-emerald-600", bgColor: "bg-emerald-600/10" },
  { from: "Intercom / Drift", to: "AI Widget", icon: SiIntercom, color: "text-blue-600", bgColor: "bg-blue-600/10" },
  { from: "LinkWhisper", to: "Cross-Post Link Builder", icon: Link2, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  { from: "Screaming Frog", to: "On-Page SEO Auditor", icon: Search, color: "text-violet-500", bgColor: "bg-violet-500/10" },
];

const audiences = [
  {
    title: "SEO Agencies",
    description: "Rank tracking, local search grids, on-page audits, GSC Ingestion Layer",
    icon: Search,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Content Agencies",
    description: "Bulk AI drafts, quality gates, CMS publishing, content reporting",
    icon: PenTool,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    title: "Digital Marketing Agencies",
    description: "Full-service SEO, content, CRM, invoicing and reporting",
    icon: BarChart3,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Freelancers & Consultants",
    description: "Professional tools at solo pricing. White label from day one.",
    icon: Users,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
];

export default function Pricing() {
  return (
    <Layout>
      <SEO {...seoData.pricing} />
      <div className="min-h-screen">
        <section className="pt-6 pb-20 lg:pt-10 lg:pb-28">
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
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 text-xs tracking-widest uppercase" data-testid="badge-everything">
                Full Platform
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="text-everything-title">
                Everything In The Box
              </h2>
              <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                40+ tools. One subscription.<br />
                No feature gating. Every tier gets the full suite. Here's exactly what you get from day one.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {toolCategories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <Card key={cat.title} className={`transition-all hover:-translate-y-1 ${colorShadows[i % colorShadows.length]} border-border/60`} data-testid={`card-tools-${i}`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-9 h-9 rounded-lg ${cat.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4.5 h-4.5 ${cat.color}`} />
                        </div>
                        <h3 className="font-semibold text-sm leading-tight">{cat.title}</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {cat.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-[13px] text-muted-foreground leading-snug">
                            <Check className="w-3 h-3 text-primary/60 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-16 flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <span className="text-5xl lg:text-6xl font-black tracking-tight">40+</span>
                <div className="text-left">
                  <p className="text-sm font-medium">tools across 8 categories</p>
                  <p className="text-xs text-muted-foreground">content · SEO · CRM · AI · comms · analytics · white label · admin</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground tracking-wide">
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
                One login instead of eleven plus.<br />
                See exactly what IndexFlow replaces in your current stack.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {replacements.map((r, i) => {
                const Icon = r.icon;
                return (
                  <Card key={i} className={`transition-all hover:-translate-y-1 ${colorShadows[i % colorShadows.length]}`} data-testid={`card-replace-${i}`}>
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${r.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${r.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/40">{r.from}</p>
                        <p className="text-sm font-semibold mt-1 flex items-center gap-1.5">
                          <ArrowRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          {r.to}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28 bg-accent/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold mb-3" data-testid="text-serve-title">
                Who We Serve — IndexFlow scales with you.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Built for agencies & solo teams.<br />
                Whether you're a solo freelancer or a 50-person agency
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {audiences.map((a, i) => {
                const Icon = a.icon;
                return (
                  <Card key={a.title} className={`transition-all hover:-translate-y-1 ${colorShadows[i % colorShadows.length]}`} data-testid={`card-audience-${i}`}>
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${a.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${a.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base mb-1">{a.title}</h3>
                        <p className="text-sm text-muted-foreground">{a.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <ClosingCTA />
      </div>
    </Layout>
  );
}
