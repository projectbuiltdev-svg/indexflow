import { Link } from "wouter";
import { Utensils, Calendar, Phone, Bot, Clock, Users, TrendingUp, CheckCircle, ArrowRight, MessageSquare, CreditCard, Bell, Building2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

import restaurantBold from "@/assets/images/templates/restaurant-bold.webp";
import restaurantVibrant from "@/assets/images/templates/restaurant-vibrant.webp";
import restaurantSimple from "@/assets/images/templates/restaurant-simple.webp";
import restaurantMinimalistic from "@/assets/images/templates/restaurant-minimalistic.webp";

const portfolioItems = [
  {
    title: "Ember & Oak Steakhouse",
    tagline: "Premium Cuts, Bold Flavors",
    description: "A dramatic dining experience with rich textures and powerful branding.",
    style: "Bold",
    image: restaurantBold,
    previewUrl: "/preview/restaurant-bold",
  },
  {
    title: "Fiesta Kitchen",
    tagline: "Taste the Energy",
    description: "Bright, energetic design that captures the spirit of modern fusion cuisine.",
    style: "Vibrant",
    image: restaurantVibrant,
    previewUrl: "/preview/restaurant-vibrant",
  },
  {
    title: "The Garden Table",
    tagline: "Farm Fresh, Simply Served",
    description: "Warm and inviting design focusing on fresh ingredients and honest cooking.",
    style: "Simple",
    image: restaurantSimple,
    previewUrl: "/preview/restaurant-simple",
  },
  {
    title: "Noir Fine Dining",
    tagline: "Elegance in Every Detail",
    description: "Ultra-refined design with subtle gold accents for upscale dining.",
    style: "Minimalistic",
    image: restaurantMinimalistic,
    previewUrl: "/preview/restaurant-minimalistic",
  },
];

const features = [
  {
    icon: Calendar,
    title: "Online Reservations",
    description: "24/7 table booking system that syncs with your floor plan and availability.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Bot,
    title: "AI Phone Assistant",
    description: "Never miss a call. AI answers, takes reservations, and handles inquiries automatically.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Phone,
    title: "SMS Confirmations",
    description: "Automatic booking confirmations and reminders reduce no-shows by up to 40%.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: TrendingUp,
    title: "Revenue Recovery",
    description: "Capture after-hours bookings and missed calls that would otherwise be lost.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const benefits = [
  "Custom website with your menu, photos, and branding",
  "Mobile-optimized booking widget",
  "Real-time table availability management",
  "Pre-paid deposit option to reduce no-shows",
  "Multi-language support for international guests",
  "Integration with your existing POS system",
];

export default function RestaurantsSolution() {
  return (
    <Layout>
      <SEO {...seoData.restaurants} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Utensils className="w-3 h-3 mr-1" />
              For Restaurants
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Fill Every Table,{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Every Night
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Stop losing reservations to missed calls and outdated booking systems. 
              Our AI-powered platform handles bookings 24/7, so you can focus on creating 
              unforgettable dining experiences.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-restaurant-cta">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" data-testid="button-restaurant-templates">
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
            <h2 className="text-3xl font-bold mb-4">Everything Your Restaurant Needs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From fine dining to casual eateries, our platform adapts to your unique needs.
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
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Bot className="w-3 h-3 mr-1" />
              How It Works
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Your AI Concierge 24/7</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From first inquiry to confirmed booking, your AI concierge handles it automatically.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary/20 via-blue-500/20 to-purple-500/20" />

            <Card className="relative overflow-visible">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold relative z-10">1</div>
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Guest Reaches Out</h3>
                <p className="text-sm text-muted-foreground text-justify">The AI handles live chat inquiries on your website and receives phone calls via your Twilio customer service number.</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-visible">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold relative z-10">2</div>
                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-7 h-7 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-2">AI Books & Collects</h3>
                <p className="text-sm text-muted-foreground text-justify">The Concierge answers, replies, takes pre-paid reservations, and secures the booking with a credit or debit card.</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-visible">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold relative z-10">3</div>
                <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Confirms Instantly</h3>
                <p className="text-sm text-muted-foreground text-justify">Guests receive instant SMS confirmations and email reminders, keeping them informed every step of the way.</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-visible">
              <CardContent className="p-6 text-center">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-bold relative z-10">4</div>
                <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">Venue Gets Alerted</h3>
                <p className="text-sm text-muted-foreground text-justify">Your staff get alerted to all incoming RSVP confirmations, and your front desk immediately processes the bookings.</p>
              </CardContent>
            </Card>

            <div className="relative bg-gradient-to-br from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-6 text-center border border-primary/20 shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col items-center justify-start">
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]">
                <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                <span className="relative block w-full h-full rounded-full bg-green-500" />
              </div>
              <div className="mb-3 relative">
                <div className="absolute inset-0 w-12 h-12 mx-auto rounded-full bg-primary/20 animate-[pulse_3s_ease-in-out_infinite] blur-xl" />
                <Bot className="w-12 h-12 mx-auto text-primary relative animate-[bounce_4s_ease-in-out_infinite]" />
              </div>
              <div className="mt-14" />
              <h3 className="font-semibold mb-2">Always On 24/7</h3>
              <p className="text-xs lg:text-sm font-bold leading-snug animate-[pulse_5s_ease-in-out_infinite]">
                <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">AI Concierge never sleeps,</span>{" "}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-primary bg-clip-text text-transparent">never gets tired &</span><br />
                <span className="bg-gradient-to-r from-purple-500 via-primary to-blue-500 bg-clip-text text-transparent">never misses a booking!</span>
              </p>
              <div className="mt-1 mb-1 w-12 h-px bg-gradient-to-r from-transparent via-muted-foreground/40 to-transparent mx-auto" />
              <p className="text-[9px] lg:text-[10px] font-semibold text-muted-foreground tracking-wide uppercase animate-[pulse_5s_ease-in-out_infinite] whitespace-nowrap pt-0" style={{ animationDelay: "1s" }}>
                When your front desk is closed,<br />the AI keeps Working.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20 bg-accent/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">What's Included</Badge>
              <h2 className="text-3xl font-bold mb-6">
                A Complete Booking System Built for Restaurants
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
                <div className="text-4xl font-bold text-primary mb-2">40%</div>
                <p className="text-sm text-muted-foreground">Reduction in No-Shows</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Booking Availability</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Calls Answered</p>
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
              <Utensils className="w-3 h-3 mr-1" />
              Restaurant Portfolio
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Websites We've Built for Restaurants</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every restaurant is unique. Browse real websites we've designed and built for restaurants like yours.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Restaurant?</h2>
          <p className="text-muted-foreground mb-8">
            Join hundreds of restaurants already using indexFlow to streamline their bookings.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-restaurant-bottom-cta">
              Get Started Today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
