import { Link } from "wouter";
import { Check, X, ArrowRight, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const pricingRows = [
  { feature: "Monthly Fee", resto: "$299", opentable: "$249 - $899", resy: "Contact sales", sevenrooms: "Contact sales" },
  { feature: "Per-Cover Fee", resto: "None", opentable: "$1 - $7.50", resy: "Varies", sevenrooms: "Varies" },
  { feature: "Setup Fee", resto: "$499 one-time", opentable: "Varies", resy: "Contact sales", sevenrooms: "Contact sales" },
  { feature: "Custom Website", resto: "Included", opentable: "Not available", resy: "Not available", sevenrooms: "Not available" },
  { feature: "AI Features", resto: "Included", opentable: "Not available", resy: "Not available", sevenrooms: "Limited" },
  { feature: "SMS Confirmations", resto: "Included", opentable: "Add-on cost", resy: "Limited", sevenrooms: "Included" },
  { feature: "Hidden Fees", resto: "None", opentable: "Network fees", resy: "Unclear", sevenrooms: "Unclear" },
];

const highlights = [
  {
    stat: "$0",
    label: "Per-Cover Fees",
    description: "No matter how many covers you do, your monthly rate stays the same.",
  },
  {
    stat: "$299",
    label: "Flat Monthly Rate",
    description: "One predictable price for the complete platform, every month.",
  },
  {
    stat: "Zero",
    label: "Hidden Costs",
    description: "No surprise charges, no add-on upsells, no network fees.",
  },
];

export default function PricingComparison() {
  return (
    <Layout>
      <SEO {...seoData.comparePricing} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <DollarSign className="w-3 h-3 mr-1" />
              Pricing Comparison
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Transparent{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Cost Breakdown
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              See how indexFlow compares on price. No per-cover fees, no hidden costs,
              no surprises on your monthly bill.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/pricing">
                <Button size="lg" className="gap-2" data-testid="button-pricing-comparison-view">
                  View Pricing <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" data-testid="button-pricing-comparison-demo">
                  Book a Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Price Comparison Table</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every cost, side by side. No guessing required.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-pricing-comparison">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold min-w-[140px]">Cost</th>
                      <th className="text-center p-4 font-semibold text-primary min-w-[120px]">indexFlow</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground min-w-[120px]">OpenTable</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground min-w-[120px]">Resy</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground min-w-[120px]">SevenRooms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingRows.map((row, index) => (
                      <tr key={row.feature} className={index % 2 === 0 ? "bg-accent/30" : ""}>
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center font-medium text-green-600 dark:text-green-400">{row.resto}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.opentable}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.resy}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.sevenrooms}</td>
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
            <h2 className="text-3xl font-bold mb-4">The indexFlow Pricing Advantage</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {highlights.map((item) => (
              <Card key={item.label} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{item.stat}</div>
                  <h3 className="font-semibold mb-2">{item.label}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">See Our Full Pricing</h2>
          <p className="text-muted-foreground mb-8">
            No per-cover fees. No hidden costs. Just one transparent monthly price.
          </p>
          <Link href="/pricing">
            <Button size="lg" className="gap-2" data-testid="button-pricing-comparison-bottom-cta">
              View Pricing <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
