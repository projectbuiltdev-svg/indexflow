import { Link } from "wouter";
import { FileText, Shield, CalendarDays, Image, Download, Copy, CheckCircle, ArrowRight, PenTool, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";
import { ClosingCTA } from "@/components/closing-cta";

const features = [
  {
    icon: FileText,
    title: "Bulk AI Draft Generation",
    description: "Generate dozens of SEO-optimized drafts at once using GPT-4o. Set topic, tone, and target keywords — the engine handles the rest.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Shield,
    title: "Quality Gates",
    description: "Every draft passes automated quality checks: 1,500-2,500 word count, 6+ headings, FAQ sections, and duplicate content detection.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Image,
    title: "Stock Image Resolution",
    description: "Automatically pull relevant images from Pixabay, Pexels, and Unsplash with AI-generated alt text and captions for accessibility.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Download,
    title: "MDX Export",
    description: "Export finished content as MDX files ready for static site generators, headless CMS platforms, or custom publishing workflows.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: CalendarDays,
    title: "Scheduled Publishing",
    description: "Queue content for future publishing dates. Set a cadence and the engine publishes on schedule to keep client sites fresh.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Copy,
    title: "Duplicate Detection",
    description: "Built-in similarity checks prevent duplicate content across workspaces. Every article is verified unique before publishing.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const benefits = [
  "Generate 50+ drafts per batch with consistent quality",
  "Automated quality gates ensure every article meets SEO standards",
  "Stock images with AI alt text included — no manual sourcing",
  "Schedule and automate publishing across all client workspaces",
];

export default function ContentMarketingPage() {
  return (
    <Layout>
      <SEO {...seoData.contentMarketing} />
      <section className="relative pt-6 pb-20 lg:pt-10 lg:pb-28 bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <PenTool className="w-3 h-3 mr-1" />
              Content Engine
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              AI-Powered{" "}
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Content Engine
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Bulk-generate SEO-optimized articles with GPT-4o, enforce quality gates,
              resolve stock images automatically, and schedule publishing across all client workspaces.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-content-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-content-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Content at Scale</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything agencies need to produce high-quality, SEO-ready content in bulk.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Zap className="w-3 h-3 mr-1" />
                Built for Agencies
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Content Production That Scales
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
                <div className="text-4xl font-bold text-primary mb-2">GPT-4o</div>
                <p className="text-sm text-muted-foreground">AI Generation</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">1,500+</div>
                <p className="text-sm text-muted-foreground">Words Per Article</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">6+</div>
                <p className="text-sm text-muted-foreground">Headings Required</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">3</div>
                <p className="text-sm text-muted-foreground">Image Banks</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Content Production?</h2>
          <p className="text-muted-foreground mb-8">
            See how the Content Engine generates, validates, and publishes SEO content at agency scale.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-content-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <ClosingCTA />
    </Layout>
  );
}
