import { Link } from "wouter";
import { PenTool, FileText, ImagePlus, Workflow, CheckCircle, ArrowRight, AlertTriangle, Zap, Shield, Target, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const challenges = [
  {
    icon: AlertTriangle,
    title: "Slow Content Production",
    description: "Writing, editing, and publishing blog posts manually for every client is a bottleneck that limits how many accounts you can serve.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: FileText,
    title: "Inconsistent Quality",
    description: "Without standardized workflows, content quality varies from writer to writer, damaging client trust and SEO results.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Upload,
    title: "Manual Publishing",
    description: "Copy-pasting drafts into WordPress, adding images, setting meta tags one blog at a time kills your team's productivity.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "Content Engine",
    description: "Plan, create, and manage content campaigns across all clients from a single editorial calendar.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: FileText,
    title: "Bulk AI Drafts",
    description: "Generate dozens of SEO-optimized first drafts in minutes. Set topics, tone, and length, then let AI do the heavy lifting.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: CheckCircle,
    title: "Quality Gates",
    description: "Built-in review workflows ensure every piece passes readability, SEO, and brand-voice checks before publishing.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Workflow,
    title: "CMS Integration",
    description: "Publish directly to WordPress, Webflow, and other CMS platforms without copy-pasting or manual uploads.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: ImagePlus,
    title: "Stock Images + Auto Alt Text",
    description: "Automatically source relevant stock images for posts and generate SEO-friendly alt text for every image.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: PenTool,
    title: "White-Label Delivery",
    description: "Deliver content to clients through your branded portal with approval workflows and revision tracking.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const differentiators = [
  {
    icon: Target,
    title: "10x Your Content Output",
    description: "Agencies using IndexFlow publish 10x more content per month without adding headcount.",
  },
  {
    icon: Zap,
    title: "From Idea to Published in Minutes",
    description: "AI drafts, quality gates, and one-click CMS publishing compress weeks of work into minutes.",
  },
  {
    icon: Shield,
    title: "Quality You Can Trust",
    description: "Built-in review workflows and SEO scoring ensure every article meets your standards before it goes live.",
  },
];

export default function ContentMarketingAgenciesSolution() {
  return (
    <Layout>
      <SEO {...seoData.cafes} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4" data-testid="badge-content-agencies">
              <PenTool className="w-3 h-3 mr-1" />
              For Content Marketing Agencies
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-content-agencies">
              Publish 10x More Content,{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Without 10x the Team
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-content-agencies-subtitle">
              IndexFlow's Content Engine lets your agency generate bulk AI drafts, enforce 
              quality gates, auto-source images, and publish directly to client CMS platforms 
              — all from one dashboard.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-content-agencies-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-content-agencies-pricing">
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
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-content-challenges">The Content Bottleneck Is Real</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These problems keep content agencies from scaling their output and margins.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
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
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-content-features">Your Content Production Line</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything your content team needs to plan, create, review, and publish at scale.
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
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-content-differentiators">Why Content Agencies Choose IndexFlow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three reasons content teams switch to IndexFlow for their production workflow.
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
          <h2 className="text-3xl font-bold mb-4" data-testid="heading-content-cta">Ready to Scale Your Content Output?</h2>
          <p className="text-muted-foreground mb-8">
            Join content agencies using IndexFlow to publish more, faster, without sacrificing quality.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-content-agencies-bottom-cta">
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
