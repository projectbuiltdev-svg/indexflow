import { Link } from "wouter";
import { FileText, Code, MapPin, Zap, Smartphone, Search, ClipboardCheck, BarChart3, CheckCircle, ArrowRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: FileText,
    title: "On-Page Optimization",
    description: "We optimize every page on your site for maximum search visibility and relevance.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Code,
    title: "Meta Tags & Structured Data",
    description: "Proper title tags, meta descriptions, and schema markup for rich search results.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: MapPin,
    title: "Local SEO (Google Business)",
    description: "Optimize your Google Business Profile to dominate local search and map results.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Zap,
    title: "Page Speed Optimization",
    description: "Fast-loading pages that rank better and keep guests from bouncing.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Indexing",
    description: "Every page built and optimized for Google's mobile-first indexing approach.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Search,
    title: "Keyword Research",
    description: "We identify the highest-value keywords for your restaurant and local market.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: ClipboardCheck,
    title: "Technical SEO Audits",
    description: "Regular audits to catch and fix crawl errors, broken links, and indexing issues.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: BarChart3,
    title: "Monthly Reporting",
    description: "Clear, easy-to-understand monthly reports showing your SEO progress and results.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const benefits = [
  "Higher Google rankings for your restaurant",
  "More organic traffic from search engines",
  "More bookings driven by search visibility",
  "Transparent reporting so you see what we do",
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
              SEO Services
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Search Engine Optimization{" "}
              <span className="bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
                Done for You
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We handle your SEO so you can focus on your business. From keyword research
              to technical audits, our team drives your search rankings higher every month.
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
            <h2 className="text-3xl font-bold mb-4">Full-Service SEO for Hospitality</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every aspect of search optimization, managed by our expert team.
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
              <Badge variant="outline" className="mb-4">Benefits</Badge>
              <h2 className="text-3xl font-bold mb-6">
                Why Restaurants Trust Our SEO
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
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <p className="text-sm text-muted-foreground">SEO Factors Optimized</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Local</div>
                <p className="text-sm text-muted-foreground">SEO Focus</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Monthly</div>
                <p className="text-sm text-muted-foreground">Reports Included</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Done</div>
                <p className="text-sm text-muted-foreground">For You Service</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Rank Higher on Google?</h2>
          <p className="text-muted-foreground mb-8">
            Let our SEO team put your restaurant in front of more hungry guests.
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
