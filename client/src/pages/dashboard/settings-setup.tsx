import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, ArrowRight, Rocket } from "lucide-react";

const setupSteps = [
  { id: 1, title: "Create your workspace", description: "Set up your first workspace with business details", completed: true },
  { id: 2, title: "Configure business hours", description: "Set your operating hours and special closures", completed: true },
  { id: 3, title: "Add team members", description: "Invite your team to collaborate on the dashboard", completed: true },
  { id: 4, title: "Connect payment gateway", description: "Set up Stripe or PayPal for online payments", completed: false },
  { id: 5, title: "Train AI assistant", description: "Upload documents and configure your AI knowledge base", completed: false },
  { id: 6, title: "Install chat widget", description: "Add the chat widget to your website", completed: false },
  { id: 7, title: "Set up Twilio", description: "Connect your Twilio account for voice and SMS", completed: false },
  { id: 8, title: "Customize branding", description: "Upload logo and set brand colors", completed: false },
];

export default function SettingsSetup() {
  const completedCount = setupSteps.filter(s => s.completed).length;
  const progress = Math.round((completedCount / setupSteps.length) * 100);

  return (
    <ClientLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Setup Guide</h1>
          <p className="text-muted-foreground">Complete these steps to get the most out of your dashboard</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Rocket className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-progress">{progress}%</p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-completed-steps">{completedCount}</p>
                  <p className="text-xs text-muted-foreground">Steps Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Circle className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold" data-testid="text-remaining-steps">{setupSteps.length - completedCount}</p>
                  <p className="text-xs text-muted-foreground">Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Setup Steps</CardTitle>
            <CardDescription>Follow these steps to configure your workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {setupSteps.map((step) => (
                <div key={step.id} className="flex items-center justify-between gap-4 p-4 rounded-lg border flex-wrap" data-testid={`row-step-${step.id}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className={`font-medium text-sm ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  {!step.completed && (
                    <Button variant="outline" size="sm" data-testid={`button-start-step-${step.id}`}>
                      Start
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                  {step.completed && (
                    <Badge variant="secondary" className="text-xs">Done</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
