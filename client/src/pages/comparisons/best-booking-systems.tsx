import { Link } from "wouter";
import { CheckCircle, X, ArrowRight, Award, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const platforms = [
  {
    name: "indexFlow",
    tagline: "Best Value with AI + Managed Service",
    highlight: true,
    pros: [
      "AI phone answering & live chat concierge",
      "Custom website included with every plan",
      "Flat $299/month with no per-cover fees",
      "Done-for-you setup and ongoing management",
      "Built-in rank tracking and SEO tools",
    ],
    cons: [
      "Newer platform, growing restaurant network",
    ],
  },
  {
    name: "OpenTable",
    tagline: "Largest Diner Network",
    highlight: false,
    pros: [
      "Massive consumer-facing marketplace",
      "Well-known brand with broad reach",
      "Integrates with many POS systems",
    ],
    cons: [
      "Per-cover fees of $1 to $7.50 per diner",
      "No AI phone answering or chat",
      "No custom website included",
      "Self-service setup",
    ],
  },
  {
    name: "Resy",
    tagline: "Popular with Upscale Venues",
    highlight: false,
    pros: [
      "Clean, modern client-facing experience",
      "Good brand recognition with diners",
      "CRM and client profiles",
    ],
    cons: [
      "Opaque pricing -- must contact sales",
      "No AI assistant or phone answering",
      "No custom website or SEO tools",
      "Self-service setup",
    ],
  },
  {
    name: "SevenRooms",
    tagline: "Enterprise CRM Focus",
    highlight: false,
    pros: [
      "Strong CRM and marketing automation",
      "Good for hotel restaurant groups",
      "Guest data ownership emphasis",
    ],
    cons: [
      "High price point for small venues",
      "Complex onboarding process",
      "No AI phone answering",
      "No included website",
    ],
  },
  {
    name: "Yelp Reservations",
    tagline: "Yelp-Integrated Booking",
    highlight: false,
    pros: [
      "Leverages Yelp's massive user base",
      "Simple setup for existing Yelp pages",
      "No per-cover fees on basic plan",
    ],
    cons: [
      "Limited features compared to full platforms",
      "Tied to the Yelp ecosystem",
      "No AI or automation features",
      "Basic website/profile only",
    ],
  },
  {
    name: "TheFork",
    tagline: "Popular in Europe",
    highlight: false,
    pros: [
      "Strong presence in European markets",
      "Diner promotions and offers system",
      "Part of the Tripadvisor network",
    ],
    cons: [
      "Limited presence in the US market",
      "Commission-based pricing model",
      "No AI features",
      "No custom website included",
    ],
  },
];

export default function BestBookingSystems() {
  return (
    <Layout>
      <SEO {...seoData.bestPlatforms} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Award className="w-3 h-3 mr-1" />
              2026 Guide
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              2026 Restaurant Booking{" "}
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Software Guide
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Compare the top SEO and marketing platforms.
              Find the right fit for your business's size, budget, and goals.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-best-booking-try">
                  Try indexFlow <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/comparisons/pricing">
                <Button size="lg" variant="outline" data-testid="button-best-booking-pricing">
                  Pricing Comparison
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top Booking Platforms Compared</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              An honest look at each platform's strengths and weaknesses.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => (
              <Card
                key={platform.name}
                className={`hover-elevate ${platform.highlight ? "border-primary/50 shadow-md" : ""}`}
                data-testid={`card-platform-${platform.name.toLowerCase().replace(/[.\s]/g, "-")}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                    <h3 className="font-bold text-lg">{platform.name}</h3>
                    {platform.highlight && (
                      <Badge className="flex-shrink-0">
                        <Star className="w-3 h-3 mr-1" />
                        Top Pick
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{platform.tagline}</p>
                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Pros</p>
                    <ul className="space-y-1.5">
                      {platform.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Cons</p>
                    <ul className="space-y-1.5">
                      {platform.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2 text-sm">
                          <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Choose the Best Platform?</h2>
          <p className="text-muted-foreground mb-8">
            indexFlow combines AI automation, a custom website, and flat-rate pricing.
            Book a demo and see why restaurants are switching.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-best-booking-bottom-cta">
              Try indexFlow <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
