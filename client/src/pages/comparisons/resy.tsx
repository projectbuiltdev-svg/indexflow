import { Link } from "wouter";
import { Check, X, ArrowRight, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const comparisonRows = [
  { feature: "Rank Tracking", indexflow: "Included", competitor: "Included", indexflowWins: false },
  { feature: "Site Audit", indexflow: "SEO Health Checks", competitor: "Included", indexflowWins: false },
  { feature: "AI Content Creation", indexflow: "Built-in", competitor: "No", indexflowWins: true },
  { feature: "CMS Integration", indexflow: "WordPress, Webflow, Ghost", competitor: "No", indexflowWins: true },
  { feature: "CRM & Pipeline", indexflow: "Included", competitor: "No", indexflowWins: true },
  { feature: "White-Label Branding", indexflow: "Yes", competitor: "No", indexflowWins: true },
  { feature: "Client Invoicing", indexflow: "Included", competitor: "No", indexflowWins: true },
  { feature: "Monthly Price", indexflow: "$99 flat", competitor: "$99 - $999", indexflowWins: true },
];

const advantages = [
  {
    title: "Beyond Backlink Analysis",
    description: "Ahrefs excels at backlink research and site audits, but agencies need more. indexFlow adds content creation, CMS publishing, CRM, and invoicing on top of rank tracking.",
  },
  {
    title: "Built-In CMS Publishing",
    description: "Create SEO content and publish directly to WordPress, Webflow, or Ghost. Ahrefs can analyze content but can't create or publish it for you.",
  },
  {
    title: "White-Label Everything",
    description: "Brand the entire platform with your agency's logo, colors, and domain. Ahrefs offers no white-label capabilities for agency client portals.",
  },
  {
    title: "One Tool, One Invoice",
    description: "Stop paying $99/mo for Ahrefs, $50/mo for a CRM, $30/mo for invoicing, and $100/mo for content tools. indexFlow replaces them all for $99/mo.",
  },
];

export default function ResyComparison() {
  return (
    <Layout>
      <SEO {...seoData.compareResy} />
      <section className="relative pt-6 pb-20 lg:pt-10 lg:pb-28 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Repeat className="w-3 h-3 mr-1" />
              Ahrefs Alternative
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-ahrefs-comparison">
              indexFlow vs Ahrefs{" "}
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Side-by-Side
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Rank tracking and site audits plus content creation, CMS publishing, CRM, and white-label branding.
              Compare every capability head-to-head.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-ahrefs-switch">
                  Switch to indexFlow <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-ahrefs-pricing">
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
              See how indexFlow stacks up against Ahrefs across key capabilities for agencies.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-ahrefs-comparison">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary">indexFlow</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">Ahrefs</th>
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
            <h2 className="text-3xl font-bold mb-4">Where indexFlow Stands Apart</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {advantages.map((adv) => (
              <Card key={adv.title} className="hover-elevate">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2" data-testid={`text-advantage-${adv.title.toLowerCase().replace(/\s+/g, "-")}`}>{adv.title}</h3>
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
            Move from Ahrefs to indexFlow and get content creation, CMS publishing, CRM, and white-label included.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-ahrefs-bottom-cta">
              Switch to indexFlow <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
