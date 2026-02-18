import { Link } from "wouter";
import { CreditCard, DollarSign, RefreshCw, XCircle, Users, Ticket, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: CreditCard,
    title: "Stripe & PayPal Integration",
    description: "Accept deposits and full prepayments securely via Stripe or PayPal with PCI-compliant processing.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: DollarSign,
    title: "Flexible Deposit Amounts",
    description: "Set fixed amounts or percentage-based deposits per reservation type, party size, or time slot.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: RefreshCw,
    title: "Automatic Refund Policies",
    description: "Configure refund windows and automatic processing for cancellations within your policy timeframe.",
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
  },
  {
    icon: XCircle,
    title: "Cancellation Fee Management",
    description: "Apply late cancellation or no-show fees automatically based on your business's policies.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Users,
    title: "Group Booking Deposits",
    description: "Require higher deposits for large parties and special events to protect against costly no-shows.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Ticket,
    title: "Special Event Ticketing",
    description: "Sell tickets for tasting menus, wine dinners, and special events with full prepayment.",
    color: "text-purple-600",
    bgColor: "bg-purple-600/10",
  },
];

const benefits = [
  "Reduce no-shows by up to 60% with deposit requirements",
  "Protect revenue with automated cancellation fee collection",
  "Streamline payments with PCI-compliant processing",
  "Offer flexible payment options to improve guest satisfaction",
];

export default function PrepaidReservationsFeature() {
  return (
    <Layout>
      <SEO {...seoData.prepaidServices} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <CreditCard className="w-3 h-3 mr-1" />
              Prepaid Reservations
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Prepaid Reservations to{" "}
              <span className="bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">
                Reduce No-Shows
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Collect deposits and secure bookings upfront. Protect your revenue with flexible
              payment policies that keep guests committed to their reservations.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-prepaid-cta">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-prepaid-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Secure Every Reservation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From small deposits to full prepayment, choose the right strategy for your business.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${feature.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
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
                Revenue Protection Built In
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
                <div className="text-4xl font-bold text-primary mb-2">60%</div>
                <p className="text-sm text-muted-foreground">Fewer No-Shows</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">PCI</div>
                <p className="text-sm text-muted-foreground">Compliant Payments</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Auto</div>
                <p className="text-sm text-muted-foreground">Refund Processing</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">2</div>
                <p className="text-sm text-muted-foreground">Payment Providers</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Eliminate No-Shows?</h2>
          <p className="text-muted-foreground mb-8">
            Start collecting deposits and securing your revenue with prepaid reservations today.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-prepaid-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
