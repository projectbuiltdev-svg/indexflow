import { Link } from "wouter";
import { Globe, FileCode, Code, Image, Tag, Layers, CheckCircle, ArrowRight, Send, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: Send,
    title: "One-Click Publishing",
    description: "Publish content directly to WordPress, Webflow, Shopify, Ghost, and Wix with a single click from your dashboard.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Tag,
    title: "Formatted Metadata",
    description: "Title tags, meta descriptions, Open Graph tags, and canonical URLs are automatically formatted and attached to every published post.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Image,
    title: "Image Handling",
    description: "Featured images, alt text, and captions are included with every publish. Images are optimized and uploaded to the target CMS.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Code,
    title: "Schema Markup Injection",
    description: "Automatically inject Article, FAQ, HowTo, and other schema markup types into published content for rich search results.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Layers,
    title: "Multi-CMS Management",
    description: "Manage content across multiple client CMS platforms from one central dashboard. No logging into separate admin panels.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: FileCode,
    title: "Platform-Specific Formatting",
    description: "Content is automatically formatted for each CMS — Gutenberg blocks for WordPress, rich text for Webflow, Liquid for Shopify.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
];

const benefits = [
  "Publish to 5+ CMS platforms without leaving IndexFlow",
  "Metadata and schema markup applied automatically every time",
  "Manage all client websites from a single workspace",
  "No manual copy-pasting between tools — fully automated workflow",
];

export default function HospitalityWebsitesPage() {
  return (
    <Layout>
      <SEO {...seoData.businessWebsites} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Globe className="w-3 h-3 mr-1" />
              CMS Integration
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Publish to Any CMS{" "}
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                in One Click
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect WordPress, Webflow, Shopify, Ghost, and Wix.
              Publish content with metadata, images, and schema markup — all from one dashboard.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-cms-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-cms-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Seamless CMS Publishing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature designed to eliminate manual publishing work across client websites.
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
                Why Agencies Love It
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                One Dashboard, Every Client CMS
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
                <div className="text-4xl font-bold text-primary mb-2">5+</div>
                <p className="text-sm text-muted-foreground">CMS Platforms</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">1-Click</div>
                <p className="text-sm text-muted-foreground">Publishing</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Auto</div>
                <p className="text-sm text-muted-foreground">Schema Markup</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">SEO</div>
                <p className="text-sm text-muted-foreground">Metadata Built In</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Content Publishing?</h2>
          <p className="text-muted-foreground mb-8">
            See how IndexFlow connects to your clients' CMS platforms and automates publishing.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-cms-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
