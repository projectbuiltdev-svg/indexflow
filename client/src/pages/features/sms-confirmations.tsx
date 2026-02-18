import { Link } from "wouter";
import { MessageSquare, Bell, Clock, XCircle, PenLine, MessageCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: MessageSquare,
    title: "Instant Booking Confirmation",
    description: "Clients receive an SMS confirmation within seconds of completing their appointment.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Bell,
    title: "24-Hour Reminder",
    description: "Automated reminder sent 24 hours before the appointment to reduce last-minute cancellations.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Clock,
    title: "1-Hour Reminder",
    description: "A final reminder one hour before the appointment keeps it top of mind for clients.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-600/10",
  },
  {
    icon: XCircle,
    title: "Cancellation Notifications",
    description: "Notify team and clients instantly when an appointment is cancelled, freeing up availability.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: PenLine,
    title: "Modification Alerts",
    description: "Keep everyone informed when guests change their party size, time, or special requests.",
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
  },
  {
    icon: MessageCircle,
    title: "Two-Way SMS Keywords",
    description: "Guests can reply CONFIRM or CANCEL to manage their reservation directly via text message.",
    color: "text-amber-600",
    bgColor: "bg-amber-600/10",
  },
];

const benefits = [
  "Reduce no-shows with timely automated reminders",
  "Save staff time by eliminating manual confirmation calls",
  "Improve guest experience with professional, instant communication",
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
              SMS Confirmations
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Automated Booking{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Confirmations & Reminders
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Keep guests informed at every step via SMS. From instant confirmations to
              last-minute reminders, your communication runs on autopilot.
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
              Automated SMS at every stage of the reservation lifecycle keeps guests engaged and committed.
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
                <div className="text-4xl font-bold text-primary mb-2">3</div>
                <p className="text-sm text-muted-foreground">Reminder Stages</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">2-Way</div>
                <p className="text-sm text-muted-foreground">SMS Keywords</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <p className="text-sm text-muted-foreground">Delivery Rate</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">Twilio</div>
                <p className="text-sm text-muted-foreground">Powered By</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Guest Communication?</h2>
          <p className="text-muted-foreground mb-8">
            Let SMS do the work so your staff can focus on your business, not phone calls.
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
