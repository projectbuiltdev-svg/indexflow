import { Link } from "wouter";
import { Hotel, Calendar, Phone, Bot, Clock, Users, TrendingUp, CheckCircle, ArrowRight, BedDouble, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

import hotelBold from "@/assets/images/templates/hotel-bold.webp";
import hotelVibrant from "@/assets/images/templates/hotel-vibrant.webp";
import hotelSimple from "@/assets/images/templates/hotel-simple.webp";
import hotelMinimalistic from "@/assets/images/templates/hotel-minimalistic.webp";

const portfolioItems = [
  {
    title: "The Grand Meridian",
    tagline: "Timeless Luxury",
    description: "Bold, commanding presence for luxury hotels and grand resorts.",
    style: "Bold",
    image: hotelBold,
    previewUrl: "/preview/hotel-bold",
  },
  {
    title: "Coral Bay Resort",
    tagline: "Paradise Awaits",
    description: "Vibrant, tropical design for beachfront properties and destination resorts.",
    style: "Vibrant",
    image: hotelVibrant,
    previewUrl: "/preview/hotel-vibrant",
  },
  {
    title: "Haven Boutique Hotel",
    tagline: "Simply Comfortable",
    description: "Clean, welcoming design for boutique hotels and charming B&Bs.",
    style: "Simple",
    image: hotelSimple,
    previewUrl: "/preview/hotel-simple",
  },
  {
    title: "The Obsidian Suite",
    tagline: "Refined Sophistication",
    description: "Ultra-sleek minimalist design for design-forward luxury properties.",
    style: "Minimalistic",
    image: hotelMinimalistic,
    previewUrl: "/preview/hotel-minimalistic",
  },
];

const features = [
  {
    icon: BedDouble,
    title: "Room Reservations",
    description: "Direct booking system with room types, rates, and real-time availability.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Bot,
    title: "AI Concierge",
    description: "24/7 guest support for bookings, amenities, local recommendations, and more.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Sparkles,
    title: "Upsell Automation",
    description: "Promote room upgrades, spa packages, and dining reservations automatically.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: TrendingUp,
    title: "Direct Bookings",
    description: "Reduce OTA commissions with a beautiful direct booking experience.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

const benefits = [
  "Stunning website showcasing rooms and amenities",
  "Multi-room type and rate management",
  "Pre-paid deposits and cancellation policies",
  "Restaurant and spa booking integration",
  "Multi-language support for international guests",
  "Channel manager compatibility",
];

export default function HotelsSolution() {
  return (
    <Layout>
      <SEO {...seoData.hotels} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Hotel className="w-3 h-3 mr-1" />
              For Hotels & Accommodations
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Book Direct,{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Save More
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              From boutique hotels to vacation rentals, reduce OTA dependency with 
              a stunning direct booking experience. Our AI concierge handles guest 
              inquiries while you focus on your business.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-hotel-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" data-testid="button-hotel-templates">
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
            <h2 className="text-3xl font-bold mb-4">Everything Your Property Needs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From B&Bs to boutique hotels, our platform scales with your property.
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
                A Complete Solution for Hotels
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
                <div className="text-4xl font-bold text-primary mb-2">25%</div>
                <p className="text-sm text-muted-foreground">More Direct Bookings</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Guest Support</p>
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
              <Hotel className="w-3 h-3 mr-1" />
              Hotel Portfolio
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Websites We've Built for Hotels</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From boutique B&Bs to luxury resorts. Browse real websites we've designed for properties like yours.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Direct Bookings?</h2>
          <p className="text-muted-foreground mb-8">
            Join hotels worldwide using indexFlow to reduce OTA dependency and increase revenue.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-hotel-bottom-cta">
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
