import { Link } from "wouter";
import { MapPin, Building2, Search, Globe, Star, ListChecks, CheckCircle, ArrowRight, TrendingUp, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const whyItMatters = [
  {
    icon: MapPin,
    title: "Google Business Profile",
    description: "Accurate NAP data, optimized categories, photos, and posts across your Google listing to rank higher in Maps.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Building2,
    title: "Directory Submissions",
    description: "Get listed on 50+ authoritative directories — Yelp, TripAdvisor, Foursquare, Apple Maps, Bing Places, and more.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Search,
    title: "NAP Consistency",
    description: "Your Name, Address, and Phone number must be identical everywhere. Inconsistencies hurt your local rankings.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Globe,
    title: "Industry-Specific Listings",
    description: "Business directories like Google My Business, Yelp, Apple Maps, Bing Places, and industry-specific listings.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Star,
    title: "Review Monitoring",
    description: "Track reviews across platforms and respond quickly to build reputation and trust with potential clients.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: ListChecks,
    title: "Ongoing Monitoring",
    description: "Monthly citation health reports tracking accuracy, duplicates, and new opportunities for your clients.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
];

const providers = [
  {
    name: "Whitespark",
    description: "The leading local citation service trusted by thousands of businesses. Specializing in citation building, cleanup, and local search optimization.",
    features: [
      "Citation building and cleanup",
      "Local rank tracking",
      "Google Business Profile audit",
      "Review generation tools",
    ],
    url: "https://whitespark.ca",
    color: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800/50",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    name: "BrightLocal",
    description: "All-in-one local marketing platform with powerful citation management, audit tools, and reporting for multi-location businesses.",
    features: [
      "Citation tracker and audit",
      "Local search audit tool",
      "Reputation management",
      "White-label reporting",
    ],
    url: "https://www.brightlocal.com",
    color: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-800/50",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
];

const benefits = [
  "Rank higher in 'near me' and local map pack searches",
  "Consistent business information across 50+ directories",
  "More foot traffic from customers who find you online",
  "Professional tools purpose-built for local citation management",
];

export default function LocalCitationsPage() {
  return (
    <Layout>
      <SEO {...seoData.localCitations} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <MapPin className="w-3 h-3 mr-1" />
              Local Citations
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Get Found{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Everywhere Locally
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Local citations are critical for ranking in Google Maps and local search. We recommend industry-leading citation services that specialize in building and managing your local presence.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#providers">
                <Button size="lg" className="gap-2" data-testid="button-citations-providers">
                  View Recommended Providers <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Link href="/platform/seo">
                <Button size="lg" variant="outline" data-testid="button-citations-seo">
                  Our Built-in SEO Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Citations Matter</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Consistent, accurate citations across the web tell search engines your business is legitimate and trustworthy.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyItMatters.map((item) => (
              <Card key={item.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${item.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="providers" className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Recommended Providers
            </Badge>
            <h2 className="text-3xl font-bold mb-4">
              Industry-Leading Citation Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We recommend these trusted providers for local citation management. Both specialize in helping businesses get found in local search.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {providers.map((provider) => (
              <Card key={provider.name} className="overflow-visible" data-testid={`card-provider-${provider.name.toLowerCase()}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${provider.bgColor} flex items-center justify-center shrink-0 border ${provider.borderColor}`}>
                      <Globe className={`w-5 h-5 ${provider.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{provider.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                  <ul className="space-y-2">
                    {provider.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={provider.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2 mt-2" data-testid={`button-visit-${provider.name.toLowerCase()}`}>
                      Visit {provider.name} <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <TrendingUp className="w-3 h-3 mr-1" />
                Results That Matter
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Local Visibility That Drives Foot Traffic
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground mt-6">
                Pair local citations with indexFlow's built-in Rank Tracker and Local Search Grid to monitor the impact on your rankings.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-citations-directories">50+</div>
                <p className="text-sm text-muted-foreground">Directories Covered</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-citations-nap">100%</div>
                <p className="text-sm text-muted-foreground">NAP Consistency</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-citations-mappack">3x</div>
                <p className="text-sm text-muted-foreground">Map Pack Visibility</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-citations-trusted">Trusted</div>
                <p className="text-sm text-muted-foreground">Industry Partners</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-muted-foreground mb-8">
            Not sure which citation service is right for your clients? Our team can walk you through the options and help you get started.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-citations-bottom-cta">
              Talk to Our Team <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
