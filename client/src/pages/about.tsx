import { useEffect } from "react";
import { CheckCircle, Clock, Globe, Bot, DollarSign, Users, Zap, ArrowRight, Phone, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { PageSubNav } from "@/components/page-sub-nav";
import { CMSPartners } from "@/components/cms-partners";
import { SEO, seoData, serviceSchema, howToSchema } from "@/components/seo";

const aboutSections = [
  { id: "explainer", label: "Watch" },
  { id: "process", label: "The Process" },
  { id: "whats-included", label: "What's Included" },
  { id: "why-indexflow", label: "Why indexFlow" },
  { id: "pricing-overview", label: "Pricing" },
  { id: "get-started", label: "Get Started" },
  { id: "faq", label: "FAQ" },
];

const steps = [
  {
    number: "1",
    title: "Sign Up & Create Workspace",
    description: "Create your indexFlow account and set up your first agency workspace in minutes.",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    number: "2",
    title: "Connect Your Tools",
    description: "Link your AI provider (BYOK), CMS, image bank, and domain for white-label branding.",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    number: "3",
    title: "Create & Publish Content",
    description: "Use the Content Engine to generate SEO-optimized articles, then publish directly to your CMS.",
    icon: Clock,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    number: "4",
    title: "Track Rankings & Manage Clients",
    description: "Monitor keyword rankings, manage your client pipeline, and deliver white-label reports.",
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const included = [
  { icon: Globe, title: "Content Engine", description: "AI-powered bulk content generation with quality gates and CMS publishing", color: "text-blue-500", bgColor: "bg-blue-500/10", shadow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]" },
  { icon: Calendar, title: "SEO Tools", description: "Rank tracker, local search grid, on-page audit, schema markup, and link builder", color: "text-green-500", bgColor: "bg-green-500/10", shadow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]" },
  { icon: Bot, title: "CRM & Pipeline", description: "Manage leads, deals, invoices, and client reporting from one dashboard", color: "text-purple-500", bgColor: "bg-purple-500/10", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]" },
  { icon: Phone, title: "White Label", description: "Custom branding, your domain, BYOK support — deliver as your own platform", color: "text-cyan-500", bgColor: "bg-cyan-500/10", shadow: "shadow-[0_0_20px_rgba(6,182,212,0.4)]" },
];

const benefits = [
  {
    icon: Users,
    title: "Built for Agencies",
    description: "Multi-client workspace management, team seats, and white-label delivery out of the box.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Bot,
    title: "AI-Powered Content",
    description: "Generate SEO-optimized articles at scale with the Content Engine. Publish directly to any CMS.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Starting at $99/mo. No hidden fees. BYOK means you control AI and Twilio costs directly.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Clock,
    title: "10x Productivity",
    description: "Replace your entire MarTech stack. Content, SEO, CRM, and reporting in one platform.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const pricing = [
  { label: "Solo", value: "$99", valueSuffix: "/mo", note: "1 user, 1 workspace, all core tools", icon: Zap, color: "text-primary", bgColor: "bg-primary/10", shadow: "shadow-[0_0_20px_rgba(234,179,8,0.4)]" },
  { label: "Professional", value: "$299", valueSuffix: "/mo", note: "3 users, 3 workspaces, bulk campaigns", icon: Calendar, color: "text-blue-500", bgColor: "bg-blue-500/10", shadow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]" },
  { label: "White Label", value: "$499", valueSuffix: "/mo", note: "6 users, 100 workspaces, full branding", icon: Bot, color: "text-purple-500", bgColor: "bg-purple-500/10", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]" },
  { label: "Enterprise", value: "Custom", note: "Custom integrations, SLA, dedicated support", icon: Globe, color: "text-green-500", bgColor: "bg-green-500/10", shadow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]" },
];

export default function About() {
  return (
    <Layout>
      <SEO {...seoData.about} structuredData={[serviceSchema, howToSchema]} />
      <PageSubNav sections={aboutSections} />
      <section id="explainer" className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">See How It Works</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Watch Our Explainer
            </h2>
            <p className="text-muted-foreground">
              See how indexFlow transforms your business in under 2 minutes.
            </p>
          </div>
          <div className="relative w-full rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src="https://player.vimeo.com/video/1162867536?autoplay=1&title=0&byline=0&portrait=0&texttrack=en&loop=1"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="indexFlow Explainer Video"
              data-testid="video-explainer-howit"
            />
          </div>

          <div className="mt-12 relative">
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 blur-xl" />
            <Card className="overflow-visible border-0 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <CardContent className="p-8 lg:p-10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Your AI Assistant, Always On 24/7</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      The AI widget handles live chat on your client sites, answering visitor questions and capturing leads around the clock.
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      It also powers voice calls via Twilio, so prospects can speak to an AI assistant that qualifies leads and schedules demos.
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-justify">
                      Every interaction feeds into your CRM pipeline, so your agency never misses an opportunity.
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 lg:p-10 text-center border border-primary/20 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                      <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]">
                        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                        <span className="relative block w-full h-full rounded-full bg-green-500" />
                      </div>
                      <div className="mb-4 relative">
                        <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full bg-primary/20 animate-[pulse_3s_ease-in-out_infinite] blur-xl" />
                        <Bot className="w-16 h-16 mx-auto text-primary relative animate-[bounce_4s_ease-in-out_infinite]" />
                      </div>
                      <p className="text-lg lg:text-xl font-bold leading-snug animate-[pulse_5s_ease-in-out_infinite]">
                        <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">AI Widget never sleeps,</span><br />
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-primary bg-clip-text text-transparent">never gets tired &</span><br />
                        <span className="bg-gradient-to-r from-purple-500 via-primary to-blue-500 bg-clip-text text-transparent">never misses a lead!</span>
                      </p>
                      <p className="mt-4 text-sm font-semibold text-muted-foreground tracking-wide uppercase animate-[pulse_5s_ease-in-out_infinite]" style={{ animationDelay: "1s" }}>
                        Even when your team is offline.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="process" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">The Process</Badge>
            <h2 className="text-3xl font-bold mb-4">4 Simple Steps</h2>
            <p className="text-muted-foreground">
              Pay to start, we build, Job done.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <Card key={step.number} className="hover-elevate relative">
                <CardContent className="p-6 text-center">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>
                  <div className={`w-14 h-14 rounded-full ${step.bgColor} flex items-center justify-center mx-auto mb-4 mt-4`}>
                    <step.icon className={`w-7 h-7 ${step.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="whats-included" className="py-16 lg:py-20 bg-card border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">What's Included</Badge>
            <h2 className="text-3xl font-bold mb-4">Your Complete System</h2>
            <p className="text-muted-foreground">
              Everything you need to run your agency, in one platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {included.map((item) => (
              <Card key={item.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${item.bgColor} flex items-center justify-center mx-auto mb-4 ${item.shadow}`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="why-indexflow" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Why Choose indexFlow</Badge>
            <h2 className="text-3xl font-bold mb-4">The Smart Choice</h2>
            <p className="text-muted-foreground">
              The all-in-one platform agencies trust to scale.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${benefit.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing-overview" className="py-16 lg:py-20 bg-card border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Pricing</Badge>
            <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.map((item) => (
              <Card key={item.label} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${item.bgColor} flex items-center justify-center mx-auto mb-4 ${item.shadow}`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{item.label}</h3>
                  <p className="text-2xl font-bold mb-2">{item.value}{item.valueSuffix && <span className="text-sm font-normal text-muted-foreground">{item.valueSuffix}</span>}</p>
                  <p className="text-sm text-muted-foreground">{item.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              <strong className="text-foreground">BYOK</strong> (Bring Your Own Keys): You control Twilio and AI usage costs directly.
            </p>
          </div>
        </div>
      </section>

      <section id="get-started" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">Get Started</Badge>
            <h2 className="text-3xl font-bold mb-4">How to Get Started</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-elevate relative">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">1</div>
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 mt-4">
                  <Phone className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Sign up free</h3>
                <p className="text-sm text-muted-foreground">Create your account in seconds</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate relative">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 mt-4">
                  <DollarSign className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Choose your plan ($99/mo+)</h3>
                <p className="text-sm text-muted-foreground">Pick the plan that fits your agency</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate relative">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">3</div>
                <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4 mt-4">
                  <CheckCircle className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">Connect your tools</h3>
                <p className="text-sm text-muted-foreground">Link your AI keys, CMS, and domain</p>
              </CardContent>
            </Card>
            <Card className="hover-elevate relative">
              <CardContent className="p-6 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-sm">4</div>
                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4 mt-4">
                  <Zap className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">Start delivering!</h3>
                <p className="text-sm text-muted-foreground">Create content, track rankings, manage clients</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-10">
            <Link href="/contact">
              <Button className="gap-2" data-testid="button-about-cta">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-foreground/20 max-w-7xl mx-auto" />

      <section id="faq" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 shadow-[0_0_20px_rgba(234,179,8,0.5)]">FAQ</Badge>
            <h2 className="text-3xl font-bold mb-8">Common Questions</h2>
            <div className="text-left space-y-6">
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-semibold mb-2">How long does setup take?</p>
                <p className="text-sm text-muted-foreground">Most agencies are fully onboarded within a day. Connect your AI keys, CMS, and domain, and you're ready to go.</p>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-semibold mb-2">What is BYOK?</p>
                <p className="text-sm text-muted-foreground">Bring Your Own Keys. You provide your Twilio and AI API keys, so you control and pay for usage directly — no markups from us.</p>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-semibold mb-2">Can I cancel anytime?</p>
                <p className="text-sm text-muted-foreground">Yes. Monthly subscription with no long-term contracts. Cancel whenever you need to.</p>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-semibold mb-2">What if I need help after onboarding?</p>
                <p className="text-sm text-muted-foreground">Every plan includes access to our support team. White Label and Enterprise plans include priority support and onboarding assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CMSPartners />
    </Layout>
  );
}
