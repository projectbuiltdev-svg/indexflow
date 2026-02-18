import { Link } from "wouter";
import { Wine, Calendar, Phone, Bot, Clock, Users, TrendingUp, CheckCircle, ArrowRight, Music, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

import barBold from "@/assets/images/templates/bar-bold.webp";
import barVibrant from "@/assets/images/templates/bar-vibrant.webp";
import barSimple from "@/assets/images/templates/bar-simple.webp";
import barMinimalistic from "@/assets/images/templates/bar-minimalistic.webp";

const portfolioItems = [
  {
    title: "The Vault Speakeasy",
    tagline: "Secrets Worth Keeping",
    description: "Dramatic, mysterious design for exclusive cocktail lounges.",
    style: "Bold",
    image: barBold,
    previewUrl: "/preview/bar-bold",
  },
  {
    title: "Electric Nights",
    tagline: "Where the Party Starts",
    description: "High-energy design for modern bars and nightlife spots.",
    style: "Vibrant",
    image: barVibrant,
    previewUrl: "/preview/bar-vibrant",
  },
  {
    title: "The Local Tap",
    tagline: "Good Beer, Great Company",
    description: "Friendly, approachable design for craft beer bars and pubs.",
    style: "Simple",
    image: barSimple,
    previewUrl: "/preview/bar-simple",
  },
  {
    title: "Onyx Lounge",
    tagline: "After Dark Elegance",
    description: "Sophisticated dark design for upscale cocktail bars and lounges.",
    style: "Minimalistic",
    image: barMinimalistic,
    previewUrl: "/preview/bar-minimalistic",
  },
];

const features = [
  {
    icon: Calendar,
    title: "Table & Booth Scheduling",
    description: "VIP tables, booths, and group events with deposit collection for busy nights.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Bot,
    title: "AI Night Owl",
    description: "24/7 phone and chat support that knows your offerings and event schedule.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Music,
    title: "Event Management",
    description: "Promote live music, DJ nights, and special events with integrated scheduling.",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: TrendingUp,
    title: "Peak Hour Optimization",
    description: "Manage capacity, waitlists, and walk-ins during your busiest hours.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const benefits = [
  "Sleek website showcasing your vibe and offerings",
  "VIP and bottle service scheduling",
  "Pre-paid deposits for group events",
  "Event calendar with ticket sales integration",
  "Client verification and access management",
  "Late-night hours support",
];

export default function BarsSolution() {
  return (
    <Layout>
      <SEO {...seoData.bars} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Wine className="w-3 h-3 mr-1" />
              For Bars & Nightclubs
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Pack the House,{" "}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Every Night
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              From craft cocktail bars to high-energy nightclubs, manage scheduling, 
              events, and VIP experiences effortlessly. Our AI handles appointments while 
              you keep the drinks flowing.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-bar-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" data-testid="button-bar-templates">
                  View Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything Your Bar Needs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From speakeasies to sports bars, our platform adapts to your unique atmosphere.
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
              <Badge variant="outline" className="mb-4">What's Included</Badge>
              <h2 className="text-3xl font-bold mb-6">
                A Complete Solution for Bars & Nightlife
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
                <div className="text-4xl font-bold text-primary mb-2">50%</div>
                <p className="text-sm text-muted-foreground">More VIP Inquiries</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Scheduling Support</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Calls Captured</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">5-20</div>
                <p className="text-sm text-muted-foreground">Days to Go Live</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Wine className="w-3 h-3 mr-1" />
              Bar Portfolio
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Websites We've Built for Bars</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From speakeasies to sports bars. Browse real websites we've designed for bars like yours.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioItems.map((item) => (
              <Card key={item.title} className="overflow-hidden hover-elevate group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">{item.style}</Badge>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                  <Link href={item.previewUrl}>
                    <Button variant="outline" size="sm" className="w-full gap-2" data-testid={`button-portfolio-${item.title.toLowerCase().replace(/\s+/g, "-")}`}>
                      <ExternalLink className="w-3 h-3" />
                      Preview
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Level Up Your Bar?</h2>
          <p className="text-muted-foreground mb-8">
            Join bars and nightclubs using indexFlow to maximize their nightlife potential.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-bar-bottom-cta">
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
