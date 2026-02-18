import { Link } from "wouter";
import { MessageSquare, Clock, Calendar, Mic, Paintbrush, BookOpen, MousePointerClick, CheckCircle, ArrowRight, Bot, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language Conversation",
    description: "Guests chat naturally to find availability, ask questions, and make reservations without navigating complex forms.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Clock,
    title: "Real-Time Availability",
    description: "The widget checks your live calendar and shows guests exactly which slots are open, preventing double bookings.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Calendar,
    title: "Reservation from Chat",
    description: "Guests complete their booking entirely within the chat widget — no redirects, no friction, just a confirmed table.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: MousePointerClick,
    title: "Quick Action Buttons",
    description: "One-tap buttons for Book, Hours, Menu, and Contact let guests jump straight to what they need.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Mic,
    title: "Voice Input Support",
    description: "Built-in Web Speech API integration lets guests speak their requests instead of typing on mobile devices.",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Paintbrush,
    title: "Customizable Appearance",
    description: "Match the widget's colors, position, and greeting to your brand. It looks native on any website.",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    icon: BookOpen,
    title: "Knowledge Base Training",
    description: "Train the AI on your menu, policies, and FAQs so it gives accurate, business-specific answers every time.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];

const benefits = [
  "24/7 booking capture — never miss an after-hours reservation",
  "Reduce phone calls by up to 60% with instant self-service",
  "Improve conversion rates with frictionless chat-to-book flow",
  "Works on any website — WordPress, Squarespace, custom builds",
];

export default function AiConciergePage() {
  return (
    <Layout>
      <SEO {...seoData.aiConcierge} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Bot className="w-3 h-3 mr-1" />
              Virtual Concierge
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              AI Booking Widget{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                for Your Website
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Let visitors book instantly through an intelligent chat widget.
              Natural language conversations that convert browsers into confirmed guests — 24/7.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-concierge-demo">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/widget-demo">
                <Button size="lg" variant="outline" data-testid="button-concierge-try">
                  Try the Widget
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Booking Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              An AI concierge that understands your guests and handles every booking detail.
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
                Turn Website Visitors into Confirmed Guests
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
                <p className="text-sm text-muted-foreground">Fewer Phone Calls</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Booking Availability</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">3x</div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Add AI Booking to Your Site?</h2>
          <p className="text-muted-foreground mb-8">
            Get a live demo of the AI concierge widget customized for your business.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-concierge-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
