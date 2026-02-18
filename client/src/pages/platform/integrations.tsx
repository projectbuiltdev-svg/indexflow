import { Link } from "wouter";
import { CreditCard, Wallet, Phone, MessageSquare, Webhook, Code, CheckCircle, ArrowRight, Plug, Shield, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const integrationCards = [
  {
    name: "Stripe",
    description: "Accept deposits, pre-authorizations, and full payments. PCI-compliant card processing with automatic refunds.",
    icon: CreditCard,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    features: ["Deposits & pre-auth", "Automatic refunds", "PCI compliant"],
  },
  {
    name: "PayPal",
    description: "Offer PayPal checkout as an alternative payment method. Supports one-click payments for returning guests.",
    icon: Wallet,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    features: ["One-click checkout", "Buyer protection", "Global support"],
  },
  {
    name: "Twilio Voice",
    description: "AI-powered phone system that answers calls, takes reservations, and provides business information 24/7.",
    icon: Phone,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    features: ["AI phone agent", "Call transcripts", "24/7 availability"],
  },
  {
    name: "Twilio SMS",
    description: "Automated SMS confirmations, reminders, and follow-ups that reduce no-shows and keep guests informed.",
    icon: MessageSquare,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    features: ["Booking confirmations", "Reminders", "Two-way messaging"],
  },
];

const technicalFeatures = [
  {
    icon: Webhook,
    title: "Webhook Support",
    description: "Receive real-time notifications for bookings, cancellations, and payment events via webhooks.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Code,
    title: "API Access",
    description: "RESTful API for custom integrations with your existing systems, POS, or CRM platforms.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];

const benefits = [
  "Secure payments with PCI-compliant processing and encryption",
  "Automated communications reduce manual work and no-shows",
  "Easy setup — connect your accounts in minutes, not days",
  "Reliable infrastructure backed by Stripe, PayPal, and Twilio",
];

export default function IntegrationsPage() {
  return (
    <Layout>
      <SEO {...seoData.integrations} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Plug className="w-3 h-3 mr-1" />
              Integrations
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                Stripe | PayPal | Twilio
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Seamless payment and communication integrations.
              Accept payments, automate confirmations, and let AI handle your phone calls.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-integrations-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-integrations-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Connected Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade integrations that power payments and communications.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {integrationCards.map((integration) => (
              <Card key={integration.name} className="hover-elevate">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full ${integration.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <integration.icon className={`w-7 h-7 ${integration.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{integration.name}</h3>
                        <Badge variant="secondary">
                          <CircleDot className="w-3 h-3 mr-1 text-green-500" />
                          Available
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {integration.features.map((feature) => (
                          <Badge key={feature} variant="outline">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Developer Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Extend the platform with webhooks and API access.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {technicalFeatures.map((feature) => (
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

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Why These Integrations
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Trusted Infrastructure for Your Venue
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
                <div className="text-4xl font-bold text-primary mb-2">4</div>
                <p className="text-sm text-muted-foreground">Core Integrations</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">PCI</div>
                <p className="text-sm text-muted-foreground">Compliant Payments</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-sm text-muted-foreground">Service Uptime</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">5min</div>
                <p className="text-sm text-muted-foreground">Setup Time</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Connect Your Venue?</h2>
          <p className="text-muted-foreground mb-8">
            See how Stripe, PayPal, and Twilio work together to power your business.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-integrations-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
