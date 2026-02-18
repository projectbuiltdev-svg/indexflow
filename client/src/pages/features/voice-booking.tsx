import { Link } from "wouter";
import { Phone, Bot, Calendar, UserCheck, FileText, Settings, Key, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: Phone,
    title: "24/7 AI Phone Answering",
    description: "Your AI assistant answers every call, day or night, ensuring no booking opportunity is ever missed.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Bot,
    title: "Natural Conversation",
    description: "Advanced AI engages callers in natural, human-like conversation to gather booking details effortlessly.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Calendar,
    title: "Automatic Reservation Creation",
    description: "Reservations are created in real-time during the call and synced to your booking calendar instantly.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: UserCheck,
    title: "Caller ID Matching",
    description: "Recognize returning guests by their phone number and personalize the booking experience.",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    icon: FileText,
    title: "Call Transcripts & Recordings",
    description: "Every call is transcribed and recorded for quality assurance and staff training purposes.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-600/10",
  },
  {
    icon: Settings,
    title: "Configurable Greetings",
    description: "Customize your AI's greeting, personality, and responses to match your business's brand and tone.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const benefits = [
  "Capture after-hours bookings that would otherwise be lost",
  "Reduce staff interruptions during busy service periods",
  "Maintain a professional phone presence around the clock",
  "BYOK: Bring your own AI provider (OpenAI, Anthropic, and more)",
];

export default function VoiceBookingFeature() {
  return (
    <Layout>
      <SEO {...seoData.voiceAI} />
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">
              <Phone className="w-3 h-3 mr-1" />
              Voice Booking (AI)
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              AI-Powered Hospitality{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Phone Service
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Never miss another booking call. Your AI phone assistant answers 24/7, takes reservations
              naturally, and syncs everything to your calendar - powered by Twilio.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact">
                <Button size="lg" className="gap-2" data-testid="button-voice-cta">
                  Book a Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-voice-pricing">
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
            <h2 className="text-3xl font-bold mb-4">Your AI Phone Concierge</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From greeting to confirmed reservation, your AI handles it all with natural conversation.
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
                Never Miss a Booking Call Again
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
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Always Available</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Calls Answered</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">AI</div>
                <p className="text-sm text-muted-foreground">Natural Language</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">BYOK</div>
                <p className="text-sm text-muted-foreground">Your AI Provider</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Let AI Answer Your Phones?</h2>
          <p className="text-muted-foreground mb-8">
            See how AI voice booking can capture more reservations and free your staff from the phone.
          </p>
          <Link href="/contact">
            <Button size="lg" className="gap-2" data-testid="button-voice-bottom-cta">
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
