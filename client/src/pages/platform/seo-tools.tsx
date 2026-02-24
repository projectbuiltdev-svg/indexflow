import { Link } from "wouter";
import { ClipboardCheck, Link2, Code, FileText, Shield, BarChart3, ArrowRight, CheckCircle, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";
import { ClosingCTA } from "@/components/closing-cta";

const features = [
  {
    icon: ClipboardCheck,
    title: "Post-Processing Validator",
    description: "Automatically validate every published article against quality rules: word count (1,500-2,500), heading count (6+), FAQ sections, schema markup presence, and internal link density.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Link2,
    title: "Cross-Post Link Builder",
    description: "Automatically scan all articles in a workspace and insert relevant internal links between posts. Build topical authority clusters without manual linking work.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Code,
    title: "Schema Markup Auto-Detection",
    description: "Detect and inject 20+ schema types automatically — Article, FAQ, HowTo, LocalBusiness, Product, Review, Organization, BreadcrumbList, and more.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: FileText,
    title: "On-Page Auditor",
    description: "Analyze any URL for SEO issues: title tag length, meta description, heading hierarchy, image alt text, canonical URLs, and content structure.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: BarChart3,
    title: "Site Profiler",
    description: "Get a full SEO health overview for any domain — authority metrics, backlink profile, top-performing pages, and technical issues at a glance.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Shield,
    title: "Duplicate Content Detection",
    description: "Prevent duplicate content issues across workspaces. Every article is checked for similarity before publishing to protect client SEO.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const benefits = [
  "Automated quality checks catch issues before content goes live",
  "Internal linking happens automatically across all workspace articles",
  "20+ schema types detected and injected without manual coding",
  "Site-wide SEO audits available for any client domain",
];

export default function SeoToolsPage() {
  return (
    <Layout>
      <SEO
        title="Post-Processing & Link Building Tools | IndexFlow"
        description="Automated post-processing validation, cross-post link building, schema markup auto-detection, on-page auditing, and duplicate content detection — built into every IndexFlow workspace."
        canonicalUrl="/platform/seo-tools"
      />
      <section className="relative pt-6 pb-20 lg:pt-10 lg:pb-28 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4" data-testid="badge-seo-tools">
              <Globe className="w-3 h-3 mr-1" />
              Post-Processing & Link Building
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="text-seo-tools-title">
              Automated SEO{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
                Post-Processing
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-seo-tools-subtitle">
              Validate published content, build internal links automatically, inject schema markup,
              audit pages, and detect duplicates — all without manual effort.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-seo-tools-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/platform/seo">
                <Button size="lg" variant="outline" data-testid="button-seo-tools-overview">
                  SEO Tools Overview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" data-testid="text-tools-heading">Automated SEO Quality & Optimization</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tools that run automatically after content is published to ensure every article meets SEO standards.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate" data-testid={`card-tool-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
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
                Why It Matters
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                SEO Quality on Autopilot
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
                <div className="text-4xl font-bold text-primary mb-2">20+</div>
                <p className="text-sm text-muted-foreground">Schema Types</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Auto</div>
                <p className="text-sm text-muted-foreground">Link Building</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">6+</div>
                <p className="text-sm text-muted-foreground">Quality Checks</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">0</div>
                <p className="text-sm text-muted-foreground">Manual Work</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="text-seo-tools-bottom-heading">Automate Your SEO Post-Processing</h2>
          <p className="text-muted-foreground mb-8">
            Let IndexFlow handle content validation, link building, and schema injection automatically for every workspace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="gap-2" data-testid="button-seo-tools-bottom-cta">
                Book a Demo <ArrowRight className="w-4 h-4" />
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
      <ClosingCTA />
    </Layout>
  );
}
