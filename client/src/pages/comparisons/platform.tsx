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
  resto: Support;
  opentable: Support;
  resy: Support;
  sevenrooms: Support;
}

const featureMatrix: FeatureRow[] = [
  { feature: "Online Booking Widget", resto: true, opentable: true, resy: true, sevenrooms: true },
  { feature: "AI Phone Answering", resto: true, opentable: false, resy: false, sevenrooms: false },
  { feature: "AI Live Chat Concierge", resto: true, opentable: false, resy: false, sevenrooms: false },
  { feature: "SMS Confirmations", resto: true, opentable: "limited", resy: "limited", sevenrooms: true },
  { feature: "Custom Website", resto: true, opentable: false, resy: false, sevenrooms: false },
  { feature: "Analytics Dashboard", resto: true, opentable: true, resy: true, sevenrooms: true },
  { feature: "Rank Tracking (1,000 KWs)", resto: true, opentable: false, resy: false, sevenrooms: false },
  { feature: "BYOK AI (Bring Your Own Key)", resto: true, opentable: false, resy: false, sevenrooms: false },
  { feature: "Multi-Language Support", resto: true, opentable: "limited", resy: false, sevenrooms: "limited" },
  { feature: "Waitlist Management", resto: true, opentable: true, resy: true, sevenrooms: true },
  { feature: "Prepaid Reservations", resto: true, opentable: "limited", resy: true, sevenrooms: true },
  { feature: "Content Marketing Tools", resto: true, opentable: false, resy: false, sevenrooms: false },
  { feature: "SEO Optimization", resto: true, opentable: false, resy: false, sevenrooms: false },
  { feature: "Google Search Console", resto: true, opentable: false, resy: false, sevenrooms: false },
  { feature: "Mobile App for Staff", resto: true, opentable: true, resy: true, sevenrooms: true },
  { feature: "API Access", resto: true, opentable: true, resy: "limited", sevenrooms: true },
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Feature-by-Feature{" "}
              <span className="bg-gradient-to-r from-sky-500 to-blue-500 bg-clip-text text-transparent">
                Capability Matrix
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Every feature compared across platforms. See exactly what you get
              with indexFlow vs the competition.
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
              16 capabilities compared across the four leading restaurant platforms.
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
                      <th className="text-center p-4 font-semibold text-muted-foreground min-w-[100px]">OpenTable</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground min-w-[100px]">Resy</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground min-w-[100px]">SevenRooms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureMatrix.map((row, index) => (
                      <tr key={row.feature} className={index % 2 === 0 ? "bg-accent/30" : ""}>
                        <td className="p-4 font-medium">{row.feature}</td>
                        <td className="p-4 text-center"><FeatureIcon value={row.resto} /></td>
                        <td className="p-4 text-center"><FeatureIcon value={row.opentable} /></td>
                        <td className="p-4 text-center"><FeatureIcon value={row.resy} /></td>
                        <td className="p-4 text-center"><FeatureIcon value={row.sevenrooms} /></td>
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
                <div className="text-4xl font-bold text-primary mb-2">16</div>
                <p className="text-sm text-muted-foreground">Features where indexFlow leads</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">AI</div>
                <p className="text-sm text-muted-foreground">Phone + Chat included</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">SEO</div>
                <p className="text-sm text-muted-foreground">Built-in optimization</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">$0</div>
                <p className="text-sm text-muted-foreground">Per-cover fees</p>
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
