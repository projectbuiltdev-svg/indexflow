import { Link } from "wouter";
import { LayoutDashboard, FileText, Search, Users, BarChart3, Receipt, FileBarChart, Bot, Phone, Brain, UserCog, Palette, CreditCard, CheckCircle, ArrowRight, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";
import { ClosingCTA } from "@/components/closing-cta";

const features = [
  {
    icon: FileText,
    title: "Content Engine",
    description: "Bulk-generate SEO articles with GPT-4o, enforce quality gates, resolve stock images, and schedule publishing — all from one view.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Search,
    title: "SEO Tools",
    description: "Rank Tracker, Local Search Grid, On-Page Auditor, Post-Processing Validator, Cross-Post Link Builder, and Schema Markup detection.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Users,
    title: "CRM & Pipeline",
    description: "Full contact management with customizable pipeline stages, multi-currency deals, kanban board and list views.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Track content performance, SEO progress, keyword rankings, and traffic trends with real-time charts and exportable reports.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Receipt,
    title: "Invoices & Billing",
    description: "Generate and manage invoices for clients. Track payments, set billing cycles, and export financial data.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: FileBarChart,
    title: "Reports",
    description: "White-labeled SEO and content reports ready to share with clients. Scheduled delivery or on-demand generation.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: Bot,
    title: "AI Widget",
    description: "Configure and deploy AI chat widgets for client websites. Customize branding, greeting, and knowledge base per workspace.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Phone,
    title: "Twilio Integration",
    description: "AI-powered voice and SMS for each workspace. Call logs, transcripts, and automated messaging built in.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Brain,
    title: "AI Training",
    description: "Train the AI on each client's knowledge base — services, FAQs, policies, and content for accurate widget responses.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: UserCog,
    title: "Team Management",
    description: "Add team members, assign roles, and control permissions. Each workspace supports role-based access control.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Palette,
    title: "White Label",
    description: "Custom branding per workspace — logo, colors, domain. Client-facing dashboards carry your agency's brand.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: CreditCard,
    title: "Billing & Subscriptions",
    description: "Manage workspace billing, subscription tiers, and payment methods. View usage and control costs from one panel.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

const benefits = [
  "Everything in one dashboard — no switching between tools",
  "Workspace-isolated data keeps client information separate",
  "White-label branding makes it your agency's platform",
  "Role-based access controls for your entire team",
];

export default function DashboardPage() {
  return (
    <Layout>
      <SEO {...seoData.clientDashboard} />
      <section className="relative pt-6 pb-20 lg:pt-10 lg:pb-28 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Monitor className="w-3 h-3 mr-1" />
              Client Dashboard
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Your Agency's{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Content Engine, SEO tools, CRM, analytics, invoices, reports, AI widget,
              Twilio, training, team management, white label, and billing — all in one dashboard.
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
            <h2 className="text-3xl font-bold mb-4">Everything Your Agency Needs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A powerful yet intuitive dashboard designed for agencies managing multiple client workspaces.
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
                <LayoutDashboard className="w-3 h-3 mr-1" />
                Built for Agencies
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                One Platform, Every Tool
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
                <div className="text-4xl font-bold text-primary mb-2">12</div>
                <p className="text-sm text-muted-foreground">Built-In Modules</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Live</div>
                <p className="text-sm text-muted-foreground">Real-Time Data</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Any</div>
                <p className="text-sm text-muted-foreground">Device Responsive</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">RBAC</div>
                <p className="text-sm text-muted-foreground">Role-Based Access</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to See the Full Dashboard?</h2>
          <p className="text-muted-foreground mb-8">
            Book a demo and see how IndexFlow's client dashboard brings every tool together for your agency.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-dashboard-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <ClosingCTA />
    </Layout>
  );
}
