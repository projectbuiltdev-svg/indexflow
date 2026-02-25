import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Bot,
  Shield,
  Zap,
  Clock,
  Users,
  PhoneCall,
  MessageCircle,
} from "lucide-react";

interface TwilioSettingsData {
  id: number;
  workspaceId: string;
  accountSid: string | null;
  authToken: string | null;
  phoneNumber: string | null;
  voicePersona: string;
  phoneGreeting: string | null;
  maxCallDuration: number;
  voicemailEnabled: boolean;
  smsEnabled: boolean;
  smsTemplate: string | null;
  isConnected: boolean;
}

interface AiProviderData {
  id: number;
  workspaceId: string;
  provider: string;
  apiKey: string | null;
  isEnabled: boolean;
}

export default function SettingsTwilioSetup() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const { data: settings } = useQuery<TwilioSettingsData>({
    queryKey: ["/api/workspaces", workspaceId, "twilio-settings"],
  });

  const { data: aiProviders } = useQuery<AiProviderData[]>({
    queryKey: ["/api/workspaces", workspaceId, "ai-providers"],
  });

  useEffect(() => {
    document.title = "Twilio Setup Guide | indexFlow Dashboard";
  }, []);

  const twilioConnected = settings?.isConnected || false;
  const hasPhoneNumber = !!settings?.phoneNumber;
  const hasVoiceConfig = !!settings?.phoneGreeting;
  const hasSmsConfig = settings?.smsEnabled !== undefined;
  const hasAiProvider = aiProviders?.some(p => p.isEnabled && p.apiKey) || false;

  const steps = [
    {
      number: 1,
      title: "Create a Twilio Account",
      description: "Sign up for a free Twilio account to get started with voice calls and SMS messaging.",
      completed: twilioConnected,
      details: [
        "Go to twilio.com and create a free account",
        "Verify your email address and phone number",
        "Complete the onboarding questionnaire",
        "You'll receive free trial credits to get started",
      ],
      action: {
        label: "Open Twilio",
        href: "https://www.twilio.com/try-twilio",
        external: true,
      },
    },
    {
      number: 2,
      title: "Get Your API Credentials",
      description: "Find your Account SID and Auth Token in the Twilio Console dashboard.",
      completed: twilioConnected,
      details: [
        "Log in to your Twilio Console",
        "Your Account SID and Auth Token are on the main dashboard",
        "Copy the Account SID (starts with 'AC')",
        "Click 'Show' to reveal and copy your Auth Token",
        "Keep these credentials secure - never share them publicly",
      ],
      action: {
        label: "Twilio Console",
        href: "https://console.twilio.com",
        external: true,
      },
    },
    {
      number: 3,
      title: "Purchase a Phone Number",
      description: "Buy a Twilio phone number that will be your workspace's AI phone line.",
      completed: hasPhoneNumber,
      details: [
        "In Twilio Console, go to Phone Numbers > Manage > Buy a Number",
        "Choose a local or toll-free number in your area",
        "Make sure it supports both Voice and SMS capabilities",
        "Copy the full phone number (e.g., +12125551234)",
      ],
      action: {
        label: "Buy a Number",
        href: "https://console.twilio.com/us1/develop/phone-numbers/manage/search",
        external: true,
      },
    },
    {
      number: 4,
      title: "Connect Twilio to Your Workspace",
      description: "Enter your Twilio credentials in either the Voice or SMS settings page to connect.",
      completed: twilioConnected,
      details: [
        "Go to Twilio Voice or SMS settings in this dashboard",
        "Enter your Account SID, Auth Token, and Phone Number",
        "Click 'Connect Twilio Account'",
        "The system will automatically configure webhooks on your Twilio number",
      ],
      action: {
        label: "Configure Voice",
        href: `/${workspaceId}/settings/twilio-voice`,
        external: false,
      },
    },
    {
      number: 5,
      title: "Set Up an AI Provider (BYOK)",
      description: "Connect an AI provider so the phone assistant can have intelligent conversations.",
      completed: hasAiProvider,
      details: [
        "Go to the BYOK API section in the sidebar",
        "Choose a provider: OpenAI, Anthropic, or Google AI",
        "Enter your API key and enable the provider",
        "The AI will use this provider to respond to callers naturally",
        "OpenAI (GPT-4o Mini) is recommended for the best phone experience",
      ],
      action: {
        label: "Configure AI Provider",
        href: `/${workspaceId}/byok/openai`,
        external: false,
      },
    },
    {
      number: 6,
      title: "Customize Voice & SMS Settings",
      description: "Personalize the AI voice persona, greeting message, and SMS templates.",
      completed: hasVoiceConfig && hasSmsConfig,
      details: [
        "Set the AI voice persona (male or female)",
        "Write a custom phone greeting for your workspace",
        "Configure max call duration and voicemail settings",
        "Customize the SMS confirmation template with your branding",
        "Test with a phone call to your Twilio number",
      ],
      action: {
        label: "Voice Settings",
        href: `/${workspaceId}/settings/twilio-voice`,
        external: false,
      },
    },
  ];

  const completedSteps = steps.filter(s => s.completed).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-twilio-setup-title">Twilio Setup Guide</h1>
          <p className="text-muted-foreground">Follow these steps to enable AI-powered phone calls and SMS for your workspace</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle>Setup Progress</CardTitle>
                  <Badge variant={completedSteps === steps.length ? "default" : "secondary"} data-testid="badge-setup-progress">
                    {completedSteps} / {steps.length} Complete
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(completedSteps / steps.length) * 100}%` }}
                    data-testid="progress-bar"
                  />
                </div>
              </CardHeader>
            </Card>

            {steps.map((step) => (
              <Card key={step.number} data-testid={`card-setup-step-${step.number}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      {step.completed ? (
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center" data-testid={`icon-step-${step.number}-complete`}>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center" data-testid={`icon-step-${step.number}-pending`}>
                          <span className="text-sm font-semibold text-muted-foreground">{step.number}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold" data-testid={`text-step-${step.number}-title`}>{step.title}</h3>
                        {step.completed && (
                          <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30">
                            Done
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      <ul className="mt-3 space-y-1.5">
                        {step.details.map((detail, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0 text-primary" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        {step.action.external ? (
                          <a href={step.action.href} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" data-testid={`button-step-${step.number}-action`}>
                              {step.action.label}
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                          </a>
                        ) : (
                          <Link href={step.action.href}>
                            <Button variant="outline" size="sm" data-testid={`button-step-${step.number}-action`}>
                              {step.action.label}
                              <ArrowRight className="w-3 h-3 ml-2" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/${workspaceId}/settings/twilio-voice`}>
                  <Button variant="ghost" className="w-full justify-start gap-3" data-testid="link-twilio-voice">
                    <PhoneCall className="w-4 h-4" />
                    Voice Settings
                  </Button>
                </Link>
                <Link href={`/${workspaceId}/settings/twilio-sms`}>
                  <Button variant="ghost" className="w-full justify-start gap-3" data-testid="link-twilio-sms">
                    <MessageCircle className="w-4 h-4" />
                    SMS Settings
                  </Button>
                </Link>
                <Link href={`/${workspaceId}/calls`}>
                  <Button variant="ghost" className="w-full justify-start gap-3" data-testid="link-call-logs">
                    <Phone className="w-4 h-4" />
                    Call Logs
                  </Button>
                </Link>
                <Link href={`/${workspaceId}/byok/openai`}>
                  <Button variant="ghost" className="w-full justify-start gap-3" data-testid="link-ai-provider">
                    <Bot className="w-4 h-4" />
                    AI Provider (BYOK)
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What You Get</CardTitle>
                <CardDescription>Features powered by Twilio integration</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <PhoneCall className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">AI Phone Assistant</span>
                      <p className="text-muted-foreground">24/7 automated call handling with natural conversations</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">SMS Confirmations</span>
                      <p className="text-muted-foreground">Automatic appointment confirmations and reminders via text</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Phone Scheduling</span>
                      <p className="text-muted-foreground">AI creates appointments directly from phone conversations</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MessageCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Client Self-Service</span>
                      <p className="text-muted-foreground">Clients can text CONFIRM, CANCEL, or STATUS to manage appointments</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Secure & Verified</span>
                      <p className="text-muted-foreground">All webhooks validated with Twilio signature verification</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Call Logging</span>
                      <p className="text-muted-foreground">Full transcripts, duration tracking, and analytics</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Twilio Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Twilio charges are separate from your indexFlow subscription:</p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0" />
                    <span>Phone numbers from ~$1.15/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0" />
                    <span>Voice calls from ~$0.014/min</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0" />
                    <span>SMS messages from ~$0.0079/msg</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0" />
                    <span>Free trial credits included on signup</span>
                  </li>
                </ul>
                <a href="https://www.twilio.com/en-us/pricing" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full mt-3" data-testid="link-twilio-pricing">
                    View Twilio Pricing
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
