import { Link } from "wouter";
import { BarChart3, TrendingUp, Phone, Clock, DollarSign, Users, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: BarChart3,
    title: "Booking Conversion Rates",
    description: "Track how many website visitors convert into confirmed reservations across all channels.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: TrendingUp,
    title: "Widget Engagement Metrics",
    description: "Monitor chat widget interactions, response times, and guest satisfaction scores.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Phone,
    title: "Call Volume Tracking",
    description: "Analyze inbound call patterns, AI handling rates, and missed call recovery metrics.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Clock,
    title: "Peak Hours Analysis",
    description: "Identify your busiest booking windows and optimize staffing and availability accordingly.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: DollarSign,
    title: "Revenue Trends",
    description: "Visualize revenue from reservations, deposits, and prepaid bookings over time.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Users,
    title: "Guest Demographics",
    description: "Understand your audience with insights on repeat guests, group sizes, and booking preferences.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const benefits = [
  "Real-time data updated every minute across all dashboards",
  "Export reports to CSV for accounting and team review",
  "Compare performance across custom date ranges and periods",
  "Track no-show rates and cancellation patterns over time",
];

export default function AnalyticsFeature() {
  return (
    <Layout>
      <SEO {...seoData.analytics} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <BarChart3 className="w-3 h-3 mr-1" />
              Analytics
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Booking, Widget &{" "}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Call Performance
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              A unified analytics dashboard for all businesses. Monitor every booking channel,
              track conversion rates, and make data-driven decisions to maximize revenue.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-analytics-cta">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-analytics-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Insights That Drive Results</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From booking funnels to guest demographics, get the full picture of your business performance.
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
                Data-Driven Hospitality Management
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
                <div className="text-4xl font-bold text-primary mb-2">6</div>
                <p className="text-sm text-muted-foreground">Dashboard Modules</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">1min</div>
                <p className="text-sm text-muted-foreground">Data Refresh Rate</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">CSV</div>
                <p className="text-sm text-muted-foreground">Export Support</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">365d</div>
                <p className="text-sm text-muted-foreground">Historical Data</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Unlock Your Data?</h2>
          <p className="text-muted-foreground mb-8">
            See how indexFlow's analytics dashboard can help you optimize every aspect of your booking operations.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-analytics-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
