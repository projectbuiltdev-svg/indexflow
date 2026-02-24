import { Link } from "wouter";
import { Users, Kanban, DollarSign, List, Filter, Shield, CheckCircle, ArrowRight, Contact, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";
import { ClosingCTA } from "@/components/closing-cta";

const features = [
  {
    icon: Contact,
    title: "Full Contact Management",
    description: "Store and manage contacts with custom fields, tags, notes, and activity history. Import contacts via CSV or add them manually.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Kanban,
    title: "Kanban Board View",
    description: "Drag-and-drop pipeline management with a visual kanban board. Move deals through customizable stages with a single click.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: List,
    title: "List View",
    description: "Switch between kanban and list view for your pipeline. Sort, filter, and search deals across all stages for fast access.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Filter,
    title: "Customizable Pipeline Stages",
    description: "Define your own pipeline stages to match your agency's sales process. Add, rename, reorder, or remove stages at any time.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: DollarSign,
    title: "Multi-Currency Deals",
    description: "Create deals in any currency. Track deal values, expected close dates, and win probability across your entire pipeline.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Shield,
    title: "Workspace-Isolated CRM",
    description: "Each workspace has its own isolated CRM. Client data never leaks between workspaces — complete data separation guaranteed.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
];

const benefits = [
  "Full CRM built into every workspace — no external tools needed",
  "Customizable pipeline stages match your exact sales process",
  "Multi-currency support for international agency operations",
  "Complete data isolation between client workspaces",
];

export default function IntegrationsPage() {
  return (
    <Layout>
      <SEO {...seoData.integrations} />
      <section className="relative pt-6 pb-20 lg:pt-10 lg:pb-28 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              CRM & Pipeline
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Built-In{" "}
              <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                CRM & Pipeline
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Full contact management, customizable pipeline stages, multi-currency deals,
              and workspace-isolated data — all built into every IndexFlow workspace.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-crm-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-crm-pricing">
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
            <h2 className="text-3xl font-bold mb-4">CRM Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything agencies need to manage contacts and deals across client workspaces.
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
              <Badge variant="outline" className="mb-4">
                <Zap className="w-3 h-3 mr-1" />
                Why Agencies Love It
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                CRM Built for Agency Workflows
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
                <div className="text-4xl font-bold text-primary mb-2">CRM</div>
                <p className="text-sm text-muted-foreground">Built Into Every Plan</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  <Kanban className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-sm text-muted-foreground">Kanban + List View</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Multi</div>
                <p className="text-sm text-muted-foreground">Currency Support</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Data Isolation</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Manage Contacts & Deals?</h2>
          <p className="text-muted-foreground mb-8">
            See how IndexFlow's built-in CRM helps agencies manage client pipelines from one dashboard.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-crm-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <ClosingCTA />
    </Layout>
  );
}
