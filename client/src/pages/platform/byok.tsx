import { Link } from "wouter";
import { Key, Shield, Settings, Cpu, Sparkles, Brain, Zap, CheckCircle, ArrowRight, Lock, CircuitBoard, Boxes, Globe, Star, Gem, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const providers = [
  { name: "OpenAI", description: "GPT-4o & GPT-4o-mini", icon: Brain, color: "text-green-500", bgColor: "bg-green-500/10" },
  { name: "Anthropic", description: "Claude 3.5 Sonnet & Haiku", icon: Sparkles, color: "text-orange-500", bgColor: "bg-orange-500/10" },
  { name: "Google", description: "Gemini Pro & Flash", icon: Globe, color: "text-blue-500", bgColor: "bg-blue-500/10" },
  { name: "Grok", description: "xAI Grok models", icon: Zap, color: "text-purple-500", bgColor: "bg-purple-500/10" },
  { name: "Mistral", description: "Mistral Large & Medium", icon: Star, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  { name: "Cohere", description: "Command R & R+", icon: Gem, color: "text-pink-500", bgColor: "bg-pink-500/10" },
  { name: "Perplexity", description: "Sonar models", icon: Eye, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
];

const features = [
  {
    icon: Key,
    title: "Easy Key Management",
    description: "Add, rotate, and manage your API keys from the dashboard. Keys are encrypted at rest and in transit.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Settings,
    title: "Per-Venue Configuration",
    description: "Assign different AI providers and models to each of your venues for maximum flexibility.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Cpu,
    title: "Provider-Specific Optimizations",
    description: "Prompts and settings are fine-tuned for each provider to deliver the best possible results.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: CircuitBoard,
    title: "Automatic Failover",
    description: "If your primary provider goes down, the system can fall back to a secondary provider seamlessly.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

const benefits = [
  "Control your AI costs — pay your provider directly at their rates",
  "Choose your preferred model for each workspace and use case",
  "No vendor lock-in — switch providers any time without data loss",
  "Enterprise-grade security with encrypted key storage",
];

export default function ByokPage() {
  return (
    <Layout>
      <SEO {...seoData.byok} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Key className="w-3 h-3 mr-1" />
              BYOK
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Bring Your Own{" "}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                AI Keys
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Use your preferred AI provider for maximum control over costs, performance, and data privacy.
              Plug in your own API keys and choose the model that fits your needs.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-byok-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-byok-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Supported AI Providers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect your API key from any of these leading AI providers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {providers.map((provider) => (
              <Card key={provider.name} className="hover-elevate">
                <CardContent className="p-6 text-center">
                  <div className={`w-14 h-14 rounded-full ${provider.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <provider.icon className={`w-7 h-7 ${provider.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How BYOK Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Full flexibility with enterprise-grade security built in.
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

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Benefits
              </Badge>
              <h2 className="text-3xl font-bold mb-6">
                Your Keys, Your Control
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
                <div className="text-4xl font-bold text-primary mb-2">7</div>
                <p className="text-sm text-muted-foreground">AI Providers</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">AES</div>
                <p className="text-sm text-muted-foreground">256-bit Encryption</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">0</div>
                <p className="text-sm text-muted-foreground">AI Markup Fees</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  <Lock className="w-8 h-8 mx-auto" />
                </div>
                <p className="text-sm text-muted-foreground">Your Data Stays Yours</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Use Your Own AI Keys?</h2>
          <p className="text-muted-foreground mb-8">
            Get started with BYOK and take full control of your AI infrastructure.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-byok-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
