import { Link } from "wouter";
import { Megaphone, BarChart3, Users, FileText, Receipt, AlertTriangle, CheckCircle, ArrowRight, Zap, Shield, Target, Search, PenTool, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const challenges = [
  {
    icon: AlertTriangle,
    title: "Too Many Disconnected Tools",
    description: "Your team switches between SEO platforms, content tools, CRMs, invoicing software, and reporting dashboards daily. The context switching is killing productivity.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Users,
    title: "No Single Client View",
    description: "Client data is scattered across spreadsheets, project management tools, and email threads. Getting a holistic view of any account takes hours.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: BarChart3,
    title: "Manual Reporting",
    description: "Building monthly client reports means logging into five tools, exporting CSVs, and assembling slides. It eats entire days every month.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Receipt,
    title: "Margin Erosion",
    description: "Paying for a stack of specialized tools per client erodes your margins before you even factor in the labor to manage them all.",
    color: "text-red-400",
    bgColor: "bg-red-400/10",
  },
];

const features = [
  {
    icon: Search,
    title: "Full SEO Suite",
    description: "Rank tracking, local search grid, on-page audits, link building, and schema markup for every client.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: PenTool,
    title: "Content Engine",
    description: "AI-powered content creation with bulk drafts, quality gates, CMS integration, and auto-optimized images.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Users,
    title: "Built-In CRM",
    description: "Manage leads, clients, and pipelines without leaving the platform. Every interaction in one timeline.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Receipt,
    title: "Invoicing & Billing",
    description: "Create invoices, track payments, and manage subscriptions directly from client workspaces.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: LineChart,
    title: "Unified Reporting",
    description: "One-click white-label reports that pull SEO, content, and campaign data together automatically.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Megaphone,
    title: "Campaign Management",
    description: "Plan, execute, and track marketing campaigns across channels from one central command center.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const differentiators = [
  {
    icon: Target,
    title: "One Platform, Zero Tool Sprawl",
    description: "Replace your entire MarTech stack with a single platform that does content, SEO, CRM, invoicing, and reporting.",
  },
  {
    icon: Zap,
    title: "Reclaim 20+ Hours Per Month",
    description: "Automated reporting, integrated workflows, and centralized data eliminate the busywork that bogs down your team.",
  },
  {
    icon: Shield,
    title: "Higher Margins, Happier Clients",
    description: "Lower your tool costs while delivering better results through unified workflows and AI automation.",
  },
];

export default function DigitalMarketingAgenciesSolution() {
  return (
    <Layout>
      <SEO {...seoData.bars} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4" data-testid="badge-digital-agencies">
              <Megaphone className="w-3 h-3 mr-1" />
              For Digital Marketing Agencies
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-digital-agencies">
              One Platform to{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Run Your Entire Agency
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-digital-agencies-subtitle">
              Stop paying for a dozen disconnected tools. IndexFlow combines content creation, 
              SEO, CRM, invoicing, and reporting into one platform built specifically for 
              digital marketing agencies.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-digital-agencies-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-digital-agencies-pricing">
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
            <Badge variant="outline" className="mb-4">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Key Challenges
            </Badge>
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-digital-challenges">The Tool Sprawl Problem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Digital agencies are drowning in subscriptions and manual processes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.title} className="hover-elevate" data-testid={`card-challenge-${challenge.title.toLowerCase().replace(/\s+/g, "-")}`}>
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
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-digital-features">The Full Suite, Under One Roof</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every tool your agency needs, integrated and working together from day one.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate" data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}>
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
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-digital-differentiators">Why Digital Agencies Choose IndexFlow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three reasons agencies consolidate their stack into IndexFlow.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {differentiators.map((diff) => (
              <Card key={diff.title} className="hover-elevate" data-testid={`card-diff-${diff.title.toLowerCase().replace(/\s+/g, "-")}`}>
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
          <h2 className="text-3xl font-bold mb-4" data-testid="heading-digital-cta">Ready to Simplify Your Agency Stack?</h2>
          <p className="text-muted-foreground mb-8">
            Join digital marketing agencies using IndexFlow to do more with one platform instead of many.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-digital-agencies-bottom-cta">
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
