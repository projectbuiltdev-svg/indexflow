import { Link } from "wouter";
import { User, DollarSign, Layers, AlertTriangle, CheckCircle, ArrowRight, Zap, Shield, Target, Search, PenTool, BarChart3, Receipt, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const challenges = [
  {
    icon: DollarSign,
    title: "Enterprise Tool Pricing",
    description: "SEO suites, content platforms, and CRM tools charge per-seat enterprise prices that eat your entire profit margin before you land your first client.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Layers,
    title: "Juggling Subscriptions",
    description: "You're paying for five or six different tools and spending more time managing logins and billing than doing actual client work.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: AlertTriangle,
    title: "Looking Unprofessional",
    description: "Sending clients screenshots from free-tier tools or spreadsheet reports undermines your credibility and makes it harder to charge premium rates.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const features = [
  {
    icon: Search,
    title: "Full SEO Toolkit",
    description: "Rank tracking, local search grid, on-page audits, and link building. Everything the big agencies use, at a fraction of the cost.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: PenTool,
    title: "AI Content Engine",
    description: "Generate blog posts, landing pages, and social content with AI. Edit, approve, and publish without hiring writers.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: BarChart3,
    title: "Professional Reporting",
    description: "White-label reports with your branding that look like they came from a 20-person agency, generated in one click.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Receipt,
    title: "Built-In Invoicing",
    description: "Create and send invoices, track payments, and manage client billing without a separate accounting tool.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Sparkles,
    title: "Client Portal",
    description: "Give each client their own branded portal to view reports, approve content, and communicate with you.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: User,
    title: "CRM & Pipeline",
    description: "Track leads, manage proposals, and close deals from the same platform you use to deliver services.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const differentiators = [
  {
    icon: Target,
    title: "One Person, Agency-Level Output",
    description: "IndexFlow gives a solo consultant the same tools and professional polish that 10-person agencies use to impress clients.",
  },
  {
    icon: Zap,
    title: "Everything at $99/mo",
    description: "No per-seat pricing, no hidden fees. Get the full platform for one flat monthly price that pays for itself with a single client.",
  },
  {
    icon: Shield,
    title: "Look Bigger Than You Are",
    description: "White-label reports, branded client portals, and professional workflows make you look like an established agency from day one.",
  },
];

export default function FreelancersConsultantsSolution() {
  return (
    <Layout>
      <SEO {...seoData.hotels} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4" data-testid="badge-freelancers">
              <User className="w-3 h-3 mr-1" />
              For Freelancers & Consultants
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-freelancers">
              Operate Like a{" "}
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                5-Person Agency
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-freelancers-subtitle">
              You don't need a team to deliver agency-level results. IndexFlow gives you 
              every tool — SEO, content, CRM, invoicing, and reporting — in one platform 
              for $99/month.
            </p>
            <div className="inline-flex items-baseline gap-2 mb-6 px-6 py-3 rounded-md bg-card border" data-testid="text-freelancer-price">
              <span className="text-3xl font-bold">$99</span>
              <span className="text-muted-foreground">/month — everything included</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-freelancers-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-freelancers-pricing">
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
            <Badge variant="outline" className="mb-4">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Key Challenges
            </Badge>
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-freelancer-challenges">The Solo Operator's Dilemma</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Freelancers and consultants face unique challenges that big agency tools don't solve.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.title} className="hover-elevate" data-testid={`card-challenge-${challenge.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${challenge.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <challenge.icon className={`w-7 h-7 ${challenge.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground">{challenge.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              How IndexFlow Helps
            </Badge>
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-freelancer-features">Your Entire Agency Stack for $99/mo</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every tool you need to win clients, deliver results, and get paid — in one place.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate" data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}>
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
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Why IndexFlow
            </Badge>
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-freelancer-differentiators">Why Freelancers Choose IndexFlow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three reasons solo operators level up with IndexFlow.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {differentiators.map((diff) => (
              <Card key={diff.title} className="hover-elevate" data-testid={`card-diff-${diff.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <diff.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{diff.title}</h3>
                  <p className="text-sm text-muted-foreground">{diff.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4" data-testid="heading-freelancer-cta">Ready to Punch Above Your Weight?</h2>
          <p className="text-muted-foreground mb-8">
            Join freelancers and consultants using IndexFlow to deliver big-agency results at solo-operator costs.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-freelancers-bottom-cta">
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
