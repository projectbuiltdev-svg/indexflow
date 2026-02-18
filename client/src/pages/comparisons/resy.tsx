import { Link } from "wouter";
import { Check, X, ArrowRight, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const comparisonRows = [
  { feature: "AI Phone Assistant", resto: "Yes", resy: "No", restoWins: true },
  { feature: "Custom Website", resto: "Included", resy: "No", restoWins: true },
  { feature: "SMS Automation", resto: "Included", resy: "Limited", restoWins: true },
  { feature: "BYOK AI", resto: "Yes", resy: "No", restoWins: true },
  { feature: "Rank Tracking", resto: "Yes", resy: "No", restoWins: true },
  { feature: "Pricing", resto: "Transparent", resy: "Contact sales", restoWins: true },
  { feature: "Setup", resto: "Done for you", resy: "Self-service", restoWins: true },
];

const advantages = [
  {
    title: "Bring Your Own Key (BYOK)",
    description: "Use your own OpenAI, Anthropic, or Google AI keys. Full control over your AI stack with no vendor lock-in.",
  },
  {
    title: "Built-In Rank Tracking",
    description: "Monitor up to 1,000 keywords and integrate Google Search Console. Resy offers no SEO tools whatsoever.",
  },
  {
    title: "Transparent Pricing",
    description: "Clear flat-rate pricing published on our website. No 'contact sales' runaround -- you know exactly what you pay.",
  },
  {
    title: "Fully Managed Service",
    description: "We build your website, configure your AI, and handle ongoing optimization. Resy leaves setup to you.",
  },
];

export default function ResyComparison() {
  return (
    <Layout>
      <SEO {...seoData.compareResy} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Repeat className="w-3 h-3 mr-1" />
              Resy Alternative
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              indexFlow vs Resy{" "}
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Side-by-Side
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              More features, transparent pricing, and AI-powered automation.
              Compare every capability head-to-head.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-resy-switch">
                  Switch to indexFlow <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-resy-pricing">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how indexFlow stacks up against Resy across key capabilities.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-resy-comparison">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary">indexFlow</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">Resy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, index) => (
                      <tr key={row.feature} className={index % 2 === 0 ? "bg-accent/30" : ""}>
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                            <Check className="w-4 h-4" /> {row.resto}
                          </span>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">{row.resy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Where indexFlow Stands Apart</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {advantages.map((adv) => (
              <Card key={adv.title} className="hover-elevate">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{adv.title}</h3>
                  <p className="text-sm text-muted-foreground">{adv.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for More Features at a Better Price?</h2>
          <p className="text-muted-foreground mb-8">
            Move from Resy to indexFlow and get AI, SEO tools, and a custom website included.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-resy-bottom-cta">
              Switch to indexFlow <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
