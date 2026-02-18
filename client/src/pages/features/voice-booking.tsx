import { Link } from "wouter";
import { Phone, Bot, Mic, UserCheck, FileText, Settings, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout";
import { SEO, seoData } from "@/components/seo";

const features = [
  {
    icon: Phone,
    title: "Per-Workspace Phone Numbers",
    description: "Each workspace gets its own dedicated Twilio phone number for client calls and AI-powered answering.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Bot,
    title: "AI-Powered Call Handling",
    description: "Your AI assistant answers calls 24/7, handles inquiries, gathers information, and routes calls based on workspace rules.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Mic,
    title: "Speech-to-Text & Text-to-Speech",
    description: "Real-time STT transcription and natural TTS responses powered by Twilio and your preferred AI provider.",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    icon: UserCheck,
    title: "Caller Identification",
    description: "Match incoming callers to existing CRM contacts and personalize the AI conversation with their account details.",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    icon: FileText,
    title: "Call Logging & Transcripts",
    description: "Every call is logged with full transcripts, duration, caller info, and AI conversation summaries for review.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-600/10",
  },
  {
    icon: Settings,
    title: "Configurable AI Persona",
    description: "Customize greetings, personality, knowledge base, and call handling rules to match your agency's brand.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const benefits = [
  "Never miss a client call with 24/7 AI-powered answering",
  "Twilio integration for reliable, enterprise-grade voice service",
  "BYOK: Use your own OpenAI, Anthropic, or Google AI keys",
  "Full call transcripts and recordings for quality assurance",
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
              AI Voice Assistant
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6" data-testid="heading-voice-assistant">
              AI-Powered Voice{" "}
              <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Assistant
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Twilio-powered AI voice assistant for your agency. Dedicated phone numbers per workspace,
              real-time STT/TTS, intelligent call handling, and complete call logging.
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
            <h2 className="text-3xl font-bold mb-4">Your AI Voice Assistant</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From greeting to call summary, your AI handles every call with natural conversation and full logging.
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
                Never Miss a Client Call Again
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
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-voice-availability">24/7</div>
                <p className="text-sm text-muted-foreground">Always Available</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-voice-calls">100%</div>
                <p className="text-sm text-muted-foreground">Calls Answered</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-voice-stt">STT</div>
                <p className="text-sm text-muted-foreground">Real-Time Transcription</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2" data-testid="text-voice-byok">BYOK</div>
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
            See how AI voice assistance can handle client calls and free your team to focus on delivering results.
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
