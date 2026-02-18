import { Link } from "wouter";
import { Check, X, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const comparisonRows = [
  { feature: "Per-Cover Fees", resto: "No", opentable: "$1 - $7.50", restoWins: true },
  { feature: "Monthly Cost", resto: "$299 flat", opentable: "Variable", restoWins: true },
  { feature: "AI Phone Answering", resto: "Yes", opentable: "No", restoWins: true },
  { feature: "Custom Website", resto: "Yes", opentable: "No", restoWins: true },
  { feature: "SMS Confirmations", resto: "Included", opentable: "Add-on", restoWins: true },
  { feature: "Setup", resto: "Done for you", opentable: "Self-service", restoWins: true },
  { feature: "SEO Tools", resto: "Yes", opentable: "No", restoWins: true },
];

const reasons = [
  {
    title: "No Per-Cover Fees",
    description: "OpenTable charges $1 to $7.50 per seated diner. indexFlow charges a flat monthly rate -- no matter how many covers you do.",
  },
  {
    title: "AI-Powered Everything",
    description: "From phone answering to live chat, indexFlow's AI concierge handles client inquiries 24/7. OpenTable doesn't offer this.",
  },
  {
    title: "Custom Website Included",
    description: "Every indexFlow plan includes a professionally designed, SEO-optimized website. OpenTable gives you a generic profile page.",
  },
  {
    title: "Done-for-You Setup",
    description: "Our team builds and configures everything for you. No DIY setup, no learning curve, no wasted time.",
  },
];

export default function OpenTableComparison() {
  return (
    <Layout>
      <SEO {...seoData.compareOpenTable} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              OpenTable Alternative
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Why Venues Switch{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                from OpenTable
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              No per-cover fees, AI-powered booking, and fully managed setup.
              See why restaurants are making the switch.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-opentable-switch">
                  Switch to indexFlow <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-opentable-pricing">
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
            <h2 className="text-3xl font-bold mb-4">indexFlow vs OpenTable</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A head-to-head comparison across the features that matter most.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-opentable-comparison">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary">indexFlow</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">OpenTable</th>
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
                        <td className="p-4 text-center text-muted-foreground">{row.opentable}</td>
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
            <h2 className="text-3xl font-bold mb-4">Why Restaurants Choose indexFlow</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason) => (
              <Card key={reason.title} className="hover-elevate">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Drop Per-Cover Fees?</h2>
          <p className="text-muted-foreground mb-8">
            Switch from OpenTable to indexFlow and keep more of your revenue.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-opentable-bottom-cta">
              Switch to indexFlow <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
