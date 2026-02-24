import { Link } from "wouter";
import { MessageSquare, Mic, BookOpen, Paintbrush, Volume2, Globe, CheckCircle, ArrowRight, Bot, Zap, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";
import { ClosingCTA } from "@/components/closing-cta";

const features = [
  {
    icon: MessageSquare,
    title: "Embeddable Chat Widget",
    description: "Deploy a fully branded AI chat widget on any client website. Answers visitor questions instantly using the client's knowledge base.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Mic,
    title: "Voice Mode (STT/TTS)",
    description: "Built-in speech-to-text and text-to-speech powered by Web Speech API. Visitors can speak their questions instead of typing.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: BookOpen,
    title: "Knowledge Base Training",
    description: "Train the AI on each client's services, FAQs, policies, and content. The widget gives accurate, business-specific answers every time.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Globe,
    title: "Deploy on Any Website",
    description: "Works on WordPress, Webflow, Shopify, Wix, or any custom site. Just paste a single script tag and the widget is live.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Settings,
    title: "Configurable Per Workspace",
    description: "Each workspace gets its own widget configuration — colors, greeting, position, AI model, and knowledge base are fully independent.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Paintbrush,
    title: "White-Label Branding",
    description: "Match the widget's colors, logo, and greeting to each client's brand. It looks native on every website it's deployed on.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
];

const benefits = [
  "24/7 lead capture — never miss an after-hours inquiry",
  "Reduce support tickets by up to 60% with instant AI self-service",
  "Improve conversion rates with frictionless chat-to-action flow",
  "Voice mode lets visitors speak naturally on mobile devices",
];

export default function AiConciergePage() {
  return (
    <Layout>
      <SEO {...seoData.aiConcierge} />
      <section className="relative pt-6 pb-20 lg:pt-10 lg:pb-28 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Bot className="w-3 h-3 mr-1" />
              AI Widget & Voice
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              AI-Powered Chat Widget{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                with Voice Mode
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Deploy an intelligent chat widget on every client website.
              Trained on their knowledge base, configurable per workspace, with built-in voice support.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-widget-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-widget-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Widget Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              An AI assistant that understands each client's business and handles visitor inquiries around the clock.
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
                Why It Works
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Turn Website Visitors into Qualified Leads
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
                <div className="text-4xl font-bold text-primary mb-2">60%</div>
                <p className="text-sm text-muted-foreground">Fewer Support Tickets</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Always Available</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  <Volume2 className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-sm text-muted-foreground">Voice + Text</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">&lt;5s</div>
                <p className="text-sm text-muted-foreground">Average Response</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Deploy AI Widgets for Your Clients?</h2>
          <p className="text-muted-foreground mb-8">
            See how the AI Widget works with a live demo configured for your agency.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-widget-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <ClosingCTA />
    </Layout>
  );
}
