import { Link } from "wouter";
import { Check, X, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const comparisonRows = [
  { feature: "Rank Tracking", indexflow: "Included", competitor: "$129+/mo add-on", indexflowWins: true },
  { feature: "AI Content Engine", indexflow: "Built-in", competitor: "No", indexflowWins: true },
  { feature: "CMS Publishing", indexflow: "WordPress, Webflow, Ghost", competitor: "No", indexflowWins: true },
  { feature: "CRM & Pipeline", indexflow: "Included", competitor: "No", indexflowWins: true },
  { feature: "Client Invoicing", indexflow: "Included", competitor: "No", indexflowWins: true },
  { feature: "White-Label Reports", indexflow: "Yes", competitor: "Limited", indexflowWins: true },
  { feature: "Monthly Price", indexflow: "$99 flat", competitor: "$129 - $499", indexflowWins: true },
];

const reasons = [
  {
    title: "All-in-One Platform",
    description: "SEMrush is great at keyword research and rank tracking, but agencies still need separate tools for CMS publishing, CRM, invoicing, and reporting. indexFlow bundles everything.",
  },
  {
    title: "AI-Powered Content Engine",
    description: "Generate SEO-optimized articles, publish directly to client CMS platforms, and track rankings -- all from one dashboard. SEMrush has no content creation workflow.",
  },
  {
    title: "Built-In CRM & Invoicing",
    description: "Manage your agency's client pipeline, send invoices, and track payments without juggling HubSpot, FreshBooks, or spreadsheets alongside SEMrush.",
  },
  {
    title: "Fraction of the Cost",
    description: "SEMrush's Guru plan starts at $249/mo for one user. indexFlow gives you rank tracking, content, CRM, and invoicing for $99/mo -- saving agencies thousands annually.",
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
              SEMrush Alternative
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-semrush-comparison">
              Why Agencies Switch{" "}
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                from SEMrush
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Rank tracking plus content engine, CMS publishing, CRM, and invoicing -- all in one platform.
              See why agencies are consolidating their tool stack with indexFlow.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-semrush-switch">
                  Switch to indexFlow <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-semrush-pricing">
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
            <h2 className="text-3xl font-bold mb-4">indexFlow vs SEMrush</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A head-to-head comparison across the features that matter most to agencies.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-semrush-comparison">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary">indexFlow</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">SEMrush</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, index) => (
                      <tr key={row.feature} className={index % 2 === 0 ? "bg-accent/30" : ""}>
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                            <Check className="w-4 h-4" /> {row.indexflow}
                          </span>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">{row.competitor}</td>
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
            <h2 className="text-3xl font-bold mb-4">Why Agencies Choose indexFlow</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason) => (
              <Card key={reason.title} className="hover-elevate">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2" data-testid={`text-reason-${reason.title.toLowerCase().replace(/\s+/g, "-")}`}>{reason.title}</h3>
                  <p className="text-sm text-muted-foreground">{reason.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Replace Your SEO Tool Stack?</h2>
          <p className="text-muted-foreground mb-8">
            Switch from SEMrush to indexFlow and get rank tracking, content, CRM, and invoicing in one platform.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-semrush-bottom-cta">
              Switch to indexFlow <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
