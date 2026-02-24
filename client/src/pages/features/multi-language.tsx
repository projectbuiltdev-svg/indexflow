import { Link } from "wouter";
import { Globe, Languages, MessageSquare, Phone, Layout as LayoutIcon, Type, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";
import { ClosingCTA } from "@/components/closing-cta";

const features = [
  {
    icon: Globe,
    title: "Auto-Detect Browser Language",
    description: "The chat widget automatically detects and displays in your client's preferred language.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Languages,
    title: "Translated Forms & UI",
    description: "Every field, label, and instruction is professionally translated for a seamless client experience.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: MessageSquare,
    title: "Multilingual SMS Notifications",
    description: "Client notifications and reminders are sent in the recipient's language automatically.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: Phone,
    title: "International Voice Support",
    description: "AI voice assistant can converse in multiple languages to assist international callers.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: LayoutIcon,
    title: "Localized Client Portal",
    description: "Your white-label client portal adapts to visitor language settings and preferences.",
    color: "text-lime-500",
    bgColor: "bg-lime-500/10",
  },
  {
    icon: Type,
    title: "RTL Language Support",
    description: "Full right-to-left layout support for Arabic, Hebrew, and other RTL languages.",
    color: "text-green-600",
    bgColor: "bg-green-600/10",
  },
];

const benefits = [
  "Serve international agency clients and global markets effortlessly",
  "Reduce friction for non-English-speaking clients",
  "Expand your agency's reach to diverse communities worldwide",
  "Support 20+ languages including Spanish, French, Arabic, Chinese, and more",
];

export default function MultiLanguageFeature() {
  return (
    <Layout>
      <SEO {...seoData.multiLanguage} />
      <section className="relative pt-6 pb-20 lg:pt-10 lg:pb-28 bg-gradient-to-br from-green-500/10 via-teal-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Globe className="w-3 h-3 mr-1" />
              Multi-Language
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-multi-language">
              Serve Clients in{" "}
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                20+ Languages
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Break language barriers for international clients. Your platform automatically
              adapts to each visitor's language, from forms to SMS notifications.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-multilang-cta">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-multilang-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Speak Your Client's Language</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every touchpoint is localized so international clients feel welcome from the first interaction.
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
                Global Reach, Local Experience
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
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-multilang-languages">20+</div>
                <p className="text-sm text-muted-foreground">Languages Supported</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-multilang-rtl">RTL</div>
                <p className="text-sm text-muted-foreground">Layout Support</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-multilang-auto">Auto</div>
                <p className="text-sm text-muted-foreground">Language Detection</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-multilang-sms">SMS</div>
                <p className="text-sm text-muted-foreground">Localized Messages</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Global?</h2>
          <p className="text-muted-foreground mb-8">
            Start serving international clients in their preferred language today.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-multilang-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
      <ClosingCTA />
    </Layout>
  );
}
