import { Link } from "wouter";
import { Building, BarChart3, Globe, Users, Shield, ArrowRight, CheckCircle, Layers, Settings, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO } from "@/components/seo";

const features = [
  {
    icon: Layers,
    title: "Centralized Dashboard",
    description: "Manage every location from a single login. View bookings, analytics, and settings across all venues.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: BarChart3,
    title: "Cross-Location Analytics",
    description: "Compare performance across venues. Identify trends, peak hours, and revenue opportunities at a glance.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Settings,
    title: "Unified Settings",
    description: "Set global policies for cancellations, deposits, and reminders, then override per-location as needed.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Network,
    title: "Brand Consistency",
    description: "Maintain consistent branding across all locations while allowing each workspace its own personality.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const benefits = [
  "Single dashboard for all locations with role-based access",
  "Per-location websites with shared brand guidelines",
  "Consolidated billing across all locations",
  "AI phone assistant configured per location",
  "Cross-location booking transfer and guest recognition",
  "Group-level reporting with individual location drill-down",
  "Bulk settings management with per-location overrides",
  "Dedicated account manager for multi-location clients",
];

const useCases = [
  {
    icon: Globe,
    title: "Restaurant Groups",
    description: "Manage 2 to 200+ restaurant locations from one place. Each gets its own website, phone number, and booking system.",
  },
  {
    icon: Building,
    title: "Hotel Chains",
    description: "Centralized room management with location-specific availability, rates, and guest communications.",
  },
  {
    icon: Users,
    title: "Franchise Operations",
    description: "Give franchisees their own dashboard while maintaining brand standards and corporate oversight.",
  },
  {
    icon: Shield,
    title: "Hospitality Groups",
    description: "Mix of restaurants, bars, and cafes? No problem. Manage diverse business types under one umbrella.",
  },
];

export default function MultiLocationSolution() {
  return (
    <Layout>
      <SEO
        title="Multi-Location Management | indexFlow"
        description="Manage all your locations from one centralized dashboard. Cross-location analytics, unified settings, and consistent branding for restaurant groups, hotel chains, and franchise operations."
      />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Building className="w-3 h-3 mr-1" />
              Multi-Location
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              One Dashboard,{" "}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Every Location
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Managing multiple venues shouldn't mean multiple headaches. 
              Our centralized platform gives you full visibility and control 
              across every location, from a single login.
            </p>
            <div className="inline-flex items-baseline gap-2 mb-6 px-6 py-3 rounded-md bg-card border" data-testid="text-multi-location-price">
              <span className="text-3xl font-bold">$25</span>
              <span className="text-muted-foreground">/month per additional location</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8">
              No limit on locations. Full dashboard, SEO tracking, and AI for each location.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-multi-location-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-multi-location-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Built for Scale</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage multiple locations efficiently.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Use Cases</Badge>
            <h2 className="text-3xl font-bold mb-4">Built for Every Type of Operation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you run two locations or two hundred, our platform scales with you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {useCases.map((useCase) => (
              <Card key={useCase.title} className="hover-elevate">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <useCase.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </div>
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
              <Badge variant="outline" className="mb-4">What's Included</Badge>
              <h2 className="text-3xl font-bold mb-6">
                Enterprise Features, Without the Enterprise Price
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
                <div className="text-4xl font-bold text-primary mb-2">1</div>
                <p className="text-sm text-muted-foreground">Dashboard for All</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">AI at Every Location</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Brand Consistency</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">Unlimited</div>
                <p className="text-sm text-muted-foreground">Locations Supported</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Centralize Your Operations?</h2>
          <p className="text-muted-foreground mb-8">
            Talk to our team about multi-location pricing and get a custom setup plan for your group.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-multi-location-bottom-cta">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
