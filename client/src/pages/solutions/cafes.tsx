import { Link } from "wouter";
import { Coffee, Calendar, Phone, Bot, Clock, Users, TrendingUp, CheckCircle, ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

import cafeBold from "@/assets/images/templates/cafe-bold.webp";
import cafeVibrant from "@/assets/images/templates/cafe-vibrant.webp";
import cafeSimple from "@/assets/images/templates/cafe-simple.webp";
import cafeMinimalistic from "@/assets/images/templates/cafe-minimalistic.webp";

const portfolioItems = [
  {
    title: "Roast Revolution",
    tagline: "Coffee with Character",
    description: "Strong visual identity for specialty coffee roasters and artisan cafes.",
    style: "Bold",
    image: cafeBold,
    previewUrl: "/preview/cafe-bold",
  },
  {
    title: "Sunshine Bakery & Cafe",
    tagline: "Baked with Joy",
    description: "Cheerful, welcoming design perfect for family-friendly bakery cafes.",
    style: "Vibrant",
    image: cafeVibrant,
    previewUrl: "/preview/cafe-vibrant",
  },
  {
    title: "Morning Ritual",
    tagline: "Your Daily Escape",
    description: "Clean, calming aesthetic for neighborhood coffee spots.",
    style: "Simple",
    image: cafeSimple,
    previewUrl: "/preview/cafe-simple",
  },
  {
    title: "Blanc Coffee House",
    tagline: "Pure Coffee Experience",
    description: "Sophisticated minimalism for premium specialty coffee destinations.",
    style: "Minimalistic",
    image: cafeMinimalistic,
    previewUrl: "/preview/cafe-minimalistic",
  },
];

const features = [
  {
    icon: Calendar,
    title: "Table Reservations",
    description: "Let customers book their favorite spot for brunch, meetings, or quiet work sessions.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Bot,
    title: "AI Concierge",
    description: "Answer questions about menu, hours, and availability instantly via chat or phone.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Phone,
    title: "Order Ahead",
    description: "Enable customers to pre-order their favorite drinks and pastries for pickup.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: TrendingUp,
    title: "Loyalty Integration",
    description: "Track regular customers and offer personalized experiences to keep them coming back.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
];

const benefits = [
  "Beautiful website showcasing your menu and atmosphere",
  "Group booking for meetings and events",
  "Peak hour management to optimize seating",
  "Digital menu with seasonal specials",
  "Social media integration for Instagram-worthy moments",
  "Review management and reputation tracking",
];

export default function CafesSolution() {
  return (
    <Layout>
      <SEO {...seoData.cafes} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Coffee className="w-3 h-3 mr-1" />
              For Cafes
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Brew Success,{" "}
              <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                One Booking at a Time
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              From cozy corner cafes to bustling coffee houses, create seamless experiences 
              that turn first-time visitors into regulars. Our platform handles reservations 
              while you perfect the perfect cup.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-cafe-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" data-testid="button-cafe-templates">
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
            <h2 className="text-3xl font-bold mb-4">Everything Your Cafe Needs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're a specialty coffee shop or a full-service cafe, we've got you covered.
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
                A Complete Solution for Modern Cafes
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
                <div className="text-4xl font-bold text-primary mb-2">30%</div>
                <p className="text-sm text-muted-foreground">More Repeat Visits</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Online Presence</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Inquiries Handled</p>
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
              <Coffee className="w-3 h-3 mr-1" />
              Cafe Portfolio
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Websites We've Built for Cafes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From cozy corner spots to specialty roasters. Browse real websites we've designed for cafes like yours.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Cafe?</h2>
          <p className="text-muted-foreground mb-8">
            Join cafes worldwide using indexFlow to create memorable customer experiences.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-cafe-bottom-cta">
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
