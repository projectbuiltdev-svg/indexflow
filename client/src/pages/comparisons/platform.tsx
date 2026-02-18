import { Link } from "wouter";
import { Check, X, ArrowRight, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

type Support = boolean | "limited";

interface FeatureRow {
  feature: string;
  indexflow: Support;
  semrush: Support;
  ahrefs: Support;
  hubspot: Support;
}

const featureMatrix: FeatureRow[] = [
  { feature: "Rank Tracking", indexflow: true, semrush: true, ahrefs: true, hubspot: false },
  { feature: "AI Content Engine", indexflow: true, semrush: false, ahrefs: false, hubspot: false },
  { feature: "CMS Publishing (WordPress, Webflow)", indexflow: true, semrush: false, ahrefs: false, hubspot: "limited" },
  { feature: "CRM & Client Pipeline", indexflow: true, semrush: false, ahrefs: false, hubspot: true },
  { feature: "Client Invoicing & Billing", indexflow: true, semrush: false, ahrefs: false, hubspot: false },
  { feature: "White-Label Branding", indexflow: true, semrush: "limited", ahrefs: false, hubspot: "limited" },
  { feature: "AI Voice Assistant (Twilio)", indexflow: true, semrush: false, ahrefs: false, hubspot: false },
  { feature: "SMS Notifications", indexflow: true, semrush: false, ahrefs: false, hubspot: "limited" },
  { feature: "Google Search Console Integration", indexflow: true, semrush: true, ahrefs: true, hubspot: false },
  { feature: "Local Search Grid", indexflow: true, semrush: "limited", ahrefs: false, hubspot: false },
  { feature: "Site Audit / SEO Health", indexflow: true, semrush: true, ahrefs: true, hubspot: "limited" },
  { feature: "Content Campaign Management", indexflow: true, semrush: "limited", ahrefs: false, hubspot: true },
  { feature: "Team & Permissions Management", indexflow: true, semrush: true, ahrefs: "limited", hubspot: true },
  { feature: "Multi-Language Support", indexflow: true, semrush: "limited", ahrefs: "limited", hubspot: true },
  { feature: "Analytics Dashboard", indexflow: true, semrush: true, ahrefs: true, hubspot: true },
  { feature: "API Access", indexflow: true, semrush: true, ahrefs: true, hubspot: true },
];

function FeatureIcon({ value }: { value: Support }) {
  if (value === true) {
    return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  }
  if (value === "limited") {
    return <span className="text-xs text-muted-foreground">Limited</span>;
  }
  return <X className="w-5 h-5 text-red-400 mx-auto" />;
}

export default function PlatformComparison() {
  return (
    <Layout>
      <SEO {...seoData.comparePlatform} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <LayoutGrid className="w-3 h-3 mr-1" />
              Platform Comparison
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-platform-comparison">
              Feature-by-Feature{" "}
              <span className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
                Capability Matrix
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Every feature compared across leading SEO platforms. See exactly what you get
              with indexFlow vs SEMrush, Ahrefs, and HubSpot.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-platform-comparison-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/comparisons/pricing">
                <Button size="lg" variant="outline" data-testid="button-platform-comparison-pricing">
                  Pricing Comparison
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Complete Feature Matrix</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              16 capabilities compared across the leading SEO and agency platforms.
            </p>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-platform-comparison">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold min-w-[180px]">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary min-w-[100px]">indexFlow</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground min-w-[100px]">SEMrush</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground min-w-[100px]">Ahrefs</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground min-w-[100px]">HubSpot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureMatrix.map((row, index) => (
                      <tr key={row.feature} className={index % 2 === 0 ? "bg-accent/30" : ""}>
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center"><FeatureIcon value={row.indexflow} /></td>
                        <td className="p-4 text-center"><FeatureIcon value={row.semrush} /></td>
                        <td className="p-4 text-center"><FeatureIcon value={row.ahrefs} /></td>
                        <td className="p-4 text-center"><FeatureIcon value={row.hubspot} /></td>
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
            <h2 className="text-3xl font-bold mb-4">What Sets indexFlow Apart</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-elevate">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-platform-features">16</div>
                <p className="text-sm text-muted-foreground">Features where indexFlow leads</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-platform-cms">CMS</div>
                <p className="text-sm text-muted-foreground">Direct publishing included</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-platform-crm">CRM</div>
                <p className="text-sm text-muted-foreground">Client pipeline built-in</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-platform-price">$99</div>
                <p className="text-sm text-muted-foreground">Flat monthly price</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">See the Full Platform in Action</h2>
          <p className="text-muted-foreground mb-8">
            Book a demo and experience every feature first-hand.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-platform-comparison-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
