import { Link } from "wouter";
import { LayoutDashboard, Calendar, Phone, BarChart3, Users, Clock, Boxes, Download, CheckCircle, ArrowRight, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: LayoutDashboard,
    title: "Today's Bookings at a Glance",
    description: "See all of today's reservations, upcoming arrivals, and guest counts in one clean overview.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Calendar,
    title: "Calendar View",
    description: "Weekly and monthly calendar views with drag-and-drop booking management and resource allocation.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Phone,
    title: "Call Logs with AI Transcripts",
    description: "Every AI phone call is logged with full transcripts, sentiment analysis, and booking outcomes.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track booking trends, revenue, call volumes, and conversion rates with real-time charts.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Add team members, assign roles, and control who can view or modify bookings and settings.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Clock,
    title: "Business Hours & Closures",
    description: "Set regular operating hours, holiday closures, and special event schedules with ease.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: Boxes,
    title: "Resource Management",
    description: "Manage tables, rooms, and seating areas. Set capacity limits and booking rules per resource.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Download,
    title: "Export Data",
    description: "Export bookings, call logs, and analytics to CSV or PDF for reporting and accounting.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const benefits = [
  "Everything in one place — no switching between tools",
  "Real-time updates — bookings appear instantly as they're made",
  "Mobile responsive — manage your workspace from any device",
  "Role-based access — control what each team member can see",
];

export default function DashboardPage() {
  return (
    <Layout>
      <SEO {...seoData.clientDashboard} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Monitor className="w-3 h-3 mr-1" />
              Client Dashboard
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Manage Your{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Venue Operations
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              One dashboard to control bookings, calls, analytics & settings.
              Everything your team needs to run the front-of-house, in one place.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-dashboard-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-dashboard-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Run Your Venue</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A powerful yet intuitive dashboard designed for your team.
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Smartphone className="w-3 h-3 mr-1" />
                Built for Teams
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Your Command Center for Hospitality
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
                <p className="text-sm text-muted-foreground">Unified Dashboard</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Live</div>
                <p className="text-sm text-muted-foreground">Real-Time Updates</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Any</div>
                <p className="text-sm text-muted-foreground">Device Responsive</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">CSV</div>
                <p className="text-sm text-muted-foreground">Data Exports</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Operations?</h2>
          <p className="text-muted-foreground mb-8">
            See how the indexFlow dashboard can simplify your day-to-day workspace management.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-dashboard-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
