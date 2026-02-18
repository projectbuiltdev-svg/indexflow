import { Link } from "wouter";
import { ExternalLink, ArrowRight, Search, FileText, BarChart3, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const templates = [
  {
    id: 1,
    name: "SEO Agency Pro",
    category: "agency",
    description: "Full-featured workspace for SEO agencies with rank tracking and reporting",
    color: "from-amber-500/30 to-orange-600/30",
    features: ["Rank Tracker", "SEO Audits", "Client Reports", "CRM Pipeline"],
  },
  {
    id: 2,
    name: "Content Studio",
    category: "content",
    description: "Streamlined workspace for content teams with bulk generation and scheduling",
    color: "from-green-500/30 to-emerald-600/30",
    features: ["Content Engine", "Blog Manager", "AI Writer", "Publishing Queue"],
  },
  {
    id: 3,
    name: "Marketing Hub",
    category: "marketing",
    description: "Centralized dashboard for marketing agencies managing multiple clients",
    color: "from-yellow-500/30 to-amber-600/30",
    features: ["Campaign Tracker", "Lead Analytics", "Client Portal", "SEO Tools"],
  },
  {
    id: 4,
    name: "Analytics Dashboard",
    category: "marketing",
    description: "Data-driven workspace with deep analytics and performance insights",
    color: "from-orange-400/30 to-red-500/30",
    features: ["Traffic Reports", "Keyword Insights", "Competitor Analysis", "ROI Tracking"],
  },
  {
    id: 5,
    name: "Freelancer Toolkit",
    category: "freelancer",
    description: "Lightweight yet powerful workspace for independent SEO consultants",
    color: "from-purple-500/30 to-pink-600/30",
    features: ["Client Manager", "Rank Tracker", "Invoice Generator", "SEO Audits"],
  },
  {
    id: 6,
    name: "Consultant Suite",
    category: "freelancer",
    description: "Professional workspace for consultants managing a growing client roster",
    color: "from-blue-500/30 to-indigo-600/30",
    features: ["CRM Pipeline", "Proposal Builder", "Reporting", "Content Engine"],
  },
  {
    id: 7,
    name: "White Label Platform",
    category: "enterprise",
    description: "Fully brandable workspace to resell SEO services under your own brand",
    color: "from-slate-500/30 to-zinc-600/30",
    features: ["Custom Branding", "Client Portals", "White-Label Reports", "API Access"],
  },
  {
    id: 8,
    name: "Enterprise Dashboard",
    category: "enterprise",
    description: "Scalable workspace for large teams with advanced permissions and analytics",
    color: "from-cyan-500/30 to-teal-600/30",
    features: ["Team Management", "Role Permissions", "Multi-Client", "Bulk Operations"],
  },
];

const categoryIcons: Record<string, typeof Search> = {
  agency: Search,
  content: FileText,
  marketing: BarChart3,
  freelancer: Users,
  enterprise: Building2,
};

export default function Templates() {
  return (
    <Layout>
      <SEO {...seoData.templates} />
      <section className="bg-gradient-to-b from-accent/30 to-background py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4" data-testid="badge-template-library">Workspace Templates</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" data-testid="text-templates-title">
            Choose Your <span className="text-primary">Workspace</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-templates-subtitle">
            Browse our collection of pre-configured workspace templates. Each one is designed for a specific agency workflow and fully customizable to your needs.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => {
              const Icon = categoryIcons[template.category];
              return (
                <Card key={template.id} className="hover-elevate group overflow-hidden" data-testid={`template-${template.id}`}>
                  <div className={`aspect-[4/3] bg-gradient-to-br ${template.color} flex flex-col items-center justify-center p-4 relative`}>
                    <Icon className="w-12 h-12 text-foreground/70 mb-2" />
                    <p className="font-bold text-lg text-foreground/90" data-testid={`text-template-name-${template.id}`}>{template.name}</p>
                    <Badge variant="outline" className="mt-2 capitalize text-xs" data-testid={`badge-template-category-${template.id}`}>{template.category}</Badge>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ExternalLink className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-3" data-testid={`text-template-desc-${template.id}`}>{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs" data-testid={`badge-feature-${template.id}-${feature.toLowerCase().replace(/\s+/g, '-')}`}>{feature}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-card border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4" data-testid="text-custom-cta-title">
                Don't See What You Need?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-6" data-testid="text-custom-cta-desc">
                Every workspace template is fully customizable. Tell us about your agency workflow and we'll configure a workspace that fits perfectly.
              </p>
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-templates-cta">
                  Get a Custom Workspace <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4" data-testid="text-includes-title">Every Template Includes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-card rounded-lg border" data-testid="card-include-responsive">
              <p className="font-semibold">Responsive Dashboard</p>
              <p className="text-sm text-muted-foreground">Works on desktop, tablet, and mobile</p>
            </div>
            <div className="p-4 bg-card rounded-lg border" data-testid="card-include-seo">
              <p className="font-semibold">SEO Tools Suite</p>
              <p className="text-sm text-muted-foreground">Rank tracking, audits, and reports</p>
            </div>
            <div className="p-4 bg-card rounded-lg border" data-testid="card-include-content">
              <p className="font-semibold">Content Engine</p>
              <p className="text-sm text-muted-foreground">AI-powered content generation</p>
            </div>
            <div className="p-4 bg-card rounded-lg border" data-testid="card-include-fast">
              <p className="font-semibold">Fast Loading</p>
              <p className="text-sm text-muted-foreground">Optimized for speed</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
