import { Link } from "wouter";
import { Users, Shield, UserPlus, Lock, Settings, Building2, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: Users,
    title: "Role-Based Access Control",
    description: "Assign Admin, Editor, or Viewer roles to team members. Each role has granular permissions scoped to workspace features.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: UserPlus,
    title: "Team Invitations",
    description: "Invite team members via email with role pre-assignment. New users onboard directly into their assigned workspace.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Lock,
    title: "Workspace-Level Access Control",
    description: "Each workspace is fully isolated. Team members only see the workspaces and clients they are assigned to.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Shield,
    title: "Permission Granularity",
    description: "Control access to SEO tools, content publishing, CRM, invoicing, and settings independently per role.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Building2,
    title: "Multi-Workspace Teams",
    description: "Assign team members across multiple client workspaces with different roles per workspace as needed.",
    color: "text-teal-600",
    bgColor: "bg-teal-600/10",
  },
  {
    icon: Settings,
    title: "Team Management Dashboard",
    description: "View all team members, their roles, workspace assignments, and last activity from a central dashboard.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-600/10",
  },
];

const benefits = [
  "Protect client data with workspace-level isolation",
  "Onboard new team members quickly with role-based invitations",
  "Scale your agency without losing control over permissions",
  "Audit team activity across workspaces from one dashboard",
];

export default function WaitlistFeature() {
  return (
    <Layout>
      <SEO {...seoData.waitlist} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Team & Permissions
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-team-permissions">
              Team Management &{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Access Control
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Manage your agency team with role-based permissions. Invite members, assign roles,
              and control access at the workspace level to keep client data secure.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-team-cta">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-team-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Complete Team Management</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From invitations to permissions, every aspect of team access is controlled and auditable.
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
                Scale Your Team with Confidence
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
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-team-roles">3</div>
                <p className="text-sm text-muted-foreground">Built-In Roles</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-team-invite">Email</div>
                <p className="text-sm text-muted-foreground">Team Invitations</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-team-isolation">100%</div>
                <p className="text-sm text-muted-foreground">Workspace Isolation</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-team-audit">Audit</div>
                <p className="text-sm text-muted-foreground">Activity Logging</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Organize Your Agency Team?</h2>
          <p className="text-muted-foreground mb-8">
            Set up roles, invite your team, and control access across all client workspaces.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-team-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
