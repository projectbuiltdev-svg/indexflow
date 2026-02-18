import { Link } from "wouter";
import { Receipt, DollarSign, RefreshCw, FileText, Building2, Globe, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: Receipt,
    title: "Detailed Line Items",
    description: "Create professional invoices with itemized line items for SEO services, content packages, and consulting hours.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Globe,
    title: "Multi-Currency Support",
    description: "Invoice international clients in their local currency. Support for USD, EUR, GBP, and 50+ currencies.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: FileText,
    title: "Status Tracking",
    description: "Track invoice status from draft to sent, viewed, paid, and overdue with automatic status updates and reminders.",
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
  },
  {
    icon: RefreshCw,
    title: "Recurring Invoices",
    description: "Set up automatic monthly or quarterly invoices for retainer clients. Invoices are generated and sent on schedule.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Building2,
    title: "Workspace-Scoped",
    description: "Each workspace manages its own invoices, keeping agency clients isolated with clean financial records per account.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: DollarSign,
    title: "Payment Integration",
    description: "Connect Stripe or PayPal to accept payments directly from invoices with PCI-compliant processing.",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
];

const benefits = [
  "Eliminate the need for separate invoicing tools like FreshBooks or QuickBooks",
  "Automate recurring billing for retainer SEO clients",
  "Track outstanding payments and overdue invoices at a glance",
  "Professional, branded invoices that match your agency's identity",
];

export default function PrepaidReservationsFeature() {
  return (
    <Layout>
      <SEO {...seoData.prepaidServices} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Receipt className="w-3 h-3 mr-1" />
              Invoicing & Billing
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-invoicing">
              Professional Invoicing{" "}
              <span className="bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
                Built for Agencies
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Create, send, and track invoices without leaving your SEO platform. Line items,
              multi-currency, recurring billing, and payment tracking -- all workspace-scoped.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-invoicing-cta">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-invoicing-pricing">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Complete Billing Workflow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From creating invoices to collecting payments, manage your agency's finances in one place.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${feature.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2" data-testid={`text-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}>{feature.title}</h3>
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
              <Badge variant="outline" className="mb-4">What's Included</Badge>
              <h2 className="text-3xl font-bold mb-6">
                Agency Billing, Simplified
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
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-invoicing-currencies">50+</div>
                <p className="text-sm text-muted-foreground">Currencies Supported</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-invoicing-recurring">Auto</div>
                <p className="text-sm text-muted-foreground">Recurring Billing</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-invoicing-tracking">Live</div>
                <p className="text-sm text-muted-foreground">Status Tracking</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-invoicing-providers">2</div>
                <p className="text-sm text-muted-foreground">Payment Providers</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Agency Billing?</h2>
          <p className="text-muted-foreground mb-8">
            Stop juggling separate invoicing tools. Manage everything from your SEO platform.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-invoicing-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
