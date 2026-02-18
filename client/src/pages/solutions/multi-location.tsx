import { Link } from "wouter";
import { Tag, Globe, Key, DollarSign, AlertTriangle, CheckCircle, ArrowRight, Zap, Shield, Target, Palette, Server, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const challenges = [
  {
    icon: DollarSign,
    title: "Building from Scratch Costs Too Much",
    description: "Developing your own SEO or content platform requires hundreds of thousands in engineering investment, months of development, and ongoing maintenance.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Code,
    title: "No Technical Team",
    description: "You have sales and marketing expertise but not the engineering team to build, maintain, and scale a SaaS product.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: AlertTriangle,
    title: "Want Recurring Revenue",
    description: "You see the opportunity in selling SEO and content tools as a service, but need a ready-made platform to resell under your brand.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const features = [
  {
    icon: Tag,
    title: "Full White-Label",
    description: "Your logo, your colors, your brand name. Clients never see IndexFlow — they see your product.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Globe,
    title: "Custom Domain",
    description: "Host the platform on your own domain (e.g., app.yourbrand.com) for a seamless branded experience.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Key,
    title: "Bring Your Own Keys (BYOK)",
    description: "Use your own API keys for AI providers, search APIs, and third-party services. Full control over your costs and data.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Palette,
    title: "Customizable Branding",
    description: "Configure colors, fonts, email templates, and login pages to match your brand identity perfectly.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: DollarSign,
    title: "Flexible Pricing Control",
    description: "Set your own pricing tiers and margins. Charge clients what you want while paying IndexFlow a flat wholesale rate.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Server,
    title: "Infrastructure Included",
    description: "We handle hosting, updates, security patches, and uptime monitoring. You focus on selling and supporting clients.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const differentiators = [
  {
    icon: Target,
    title: "Launch Your SaaS in Days, Not Months",
    description: "Skip the engineering. Start selling a fully-featured SEO and content platform under your brand within a week.",
  },
  {
    icon: Zap,
    title: "Built-In Recurring Revenue",
    description: "Resell IndexFlow at your own price point and build a predictable monthly revenue stream from day one.",
  },
  {
    icon: Shield,
    title: "Zero Engineering Overhead",
    description: "No developers to hire, no servers to manage, no updates to deploy. We handle the tech so you handle the growth.",
  },
];

export default function WhiteLabelResellersSolution() {
  return (
    <Layout>
      <SEO {...seoData.multiLocation} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4" data-testid="badge-white-label">
              <Tag className="w-3 h-3 mr-1" />
              For White-Label Resellers
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-white-label">
              Sell IndexFlow as{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Your Own Product
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-white-label-subtitle">
              White-label the entire IndexFlow platform — custom domain, your branding, 
              BYOK support — and resell it to your clients as your own SEO and content 
              SaaS. Build recurring revenue without building software.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-white-label-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-white-label-pricing">
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
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-reseller-challenges">Why Building Your Own Platform Isn't the Answer</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The barriers that stop most entrepreneurs from launching their own SaaS.
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
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-reseller-features">Everything You Need to Resell</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete white-label infrastructure so you can sell a SaaS product without writing a line of code.
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
            <h2 className="text-3xl font-bold mb-4" data-testid="heading-reseller-differentiators">Why Resellers Choose IndexFlow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three reasons entrepreneurs and agencies white-label IndexFlow.
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
          <h2 className="text-3xl font-bold mb-4" data-testid="heading-reseller-cta">Ready to Launch Your Own SaaS?</h2>
          <p className="text-muted-foreground mb-8">
            Start reselling IndexFlow under your brand and build recurring revenue without any engineering investment.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-white-label-bottom-cta">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
