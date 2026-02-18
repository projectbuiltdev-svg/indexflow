import { Link } from "wouter";
import { MessageSquare, Bell, Clock, Send, PenLine, MessageCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: MessageSquare,
    title: "Automated Client Notifications",
    description: "Send SMS notifications to clients when reports are ready, campaigns launch, or milestones are reached.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Bell,
    title: "Appointment Reminders",
    description: "Automated reminders sent 24 hours and 1 hour before scheduled client calls and strategy sessions.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Clock,
    title: "Scheduled Messages",
    description: "Queue SMS messages for future delivery tied to campaign milestones, deadlines, or recurring check-ins.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-600/10",
  },
  {
    icon: Send,
    title: "Twilio SMS Integration",
    description: "Enterprise-grade SMS delivery powered by Twilio with 99.9% uptime and global reach across 180+ countries.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: PenLine,
    title: "Custom Message Templates",
    description: "Create reusable SMS templates for common notifications like report delivery, invoice reminders, and status updates.",
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
  },
  {
    icon: MessageCircle,
    title: "Two-Way SMS",
    description: "Clients can reply to messages to confirm calls, approve content, or request changes directly via text.",
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
  },
];

const benefits = [
  "Keep clients informed with timely, automated notifications",
  "Reduce missed meetings with appointment reminders",
  "Professional communication that builds trust and retention",
  "Powered by Twilio for reliable global SMS delivery",
];

export default function SmsConfirmationsFeature() {
  return (
    <Layout>
      <SEO {...seoData.smsConfirmations} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <MessageSquare className="w-3 h-3 mr-1" />
              SMS & Notifications
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-sms-notifications">
              Automated SMS{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                & Client Notifications
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Keep clients in the loop with Twilio-powered SMS notifications. From appointment reminders
              to campaign updates, your communication runs on autopilot.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-sms-cta">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-sms-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Every Message, Perfectly Timed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Automated SMS at every stage of the client lifecycle keeps your agency running smoothly.
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
                Communication on Autopilot
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
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-sms-templates">Custom</div>
                <p className="text-sm text-muted-foreground">Message Templates</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-sms-twoway">2-Way</div>
                <p className="text-sm text-muted-foreground">SMS Replies</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-sms-delivery">99.9%</div>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-sms-twilio">Twilio</div>
                <p className="text-sm text-muted-foreground">Powered By</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Client Communication?</h2>
          <p className="text-muted-foreground mb-8">
            Let SMS notifications handle the routine so your team can focus on delivering SEO results.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-sms-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
