import { Link } from "wouter";
import { FileText, Search, CalendarDays, Share2, MapPin, Snowflake, CheckCircle, ArrowRight, PenTool, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: FileText,
    title: "SEO-Optimized Blog Posts",
    description: "Professionally written articles targeting high-value keywords your potential customers are searching for.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Search,
    title: "Industry-Relevant Topics",
    description: "Content tailored to your business — dining guides, travel tips, seasonal menus, and local experiences.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: CalendarDays,
    title: "Consistent Publishing Schedule",
    description: "Regular content cadence keeps your site fresh and tells search engines you're active and authoritative.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Share2,
    title: "Social Media Snippets",
    description: "Each article comes with ready-to-post social media captions for Instagram, Facebook, and X.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: MapPin,
    title: "Local SEO Content",
    description: "Geo-targeted articles that help you rank for 'near me' searches and local dining queries.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Snowflake,
    title: "Seasonal Content Planning",
    description: "Holiday menus, summer specials, Valentine's Day guides — content planned around your busiest seasons.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const benefits = [
  "Improve search rankings and organic traffic month over month",
  "Establish your business as a trusted authority in your market",
  "Attract new customers who discover you through content",
  "Save time — we handle research, writing, and publishing",
];

export default function ContentMarketingPage() {
  return (
    <Layout>
      <SEO {...seoData.contentMarketing} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <PenTool className="w-3 h-3 mr-1" />
              Content Marketing
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Blog Articles{" "}
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                Done for You
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Professional content marketing for all businesses.
              We research, write, and publish SEO-optimized articles that attract customers to your business.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-content-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" data-testid="button-content-blog">
                  See Our Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What's Included</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete content marketing service designed for all businesses.
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
                <TrendingUp className="w-3 h-3 mr-1" />
                Results That Matter
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Content That Drives Real Growth
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
                <div className="text-4xl font-bold text-primary mb-2">4x</div>
                <p className="text-sm text-muted-foreground">More Organic Traffic</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-sm text-muted-foreground">Keywords Targeted</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">12</div>
                <p className="text-sm text-muted-foreground">Articles Per Year</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Done for You</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Your Online Presence?</h2>
          <p className="text-muted-foreground mb-8">
            Let our team handle your content marketing while you focus on your business.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-content-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
