import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";
import { useLocation } from "wouter";
import { useWorkspace } from "@/lib/workspace-context";

const steps = [
  { id: 1, title: "Create account", description: "Sign up and verify your email address", completed: true, link: null },
  { id: 2, title: "Add your first workspace", description: "Set up a workspace for your project", completed: true, link: null },
  { id: 3, title: "Connect AI provider", description: "Add your API key or use platform defaults", completed: true, link: null },
  { id: 4, title: "Add your first domain", description: "Connect a domain to publish content", completed: false, link: "content/domains" },
  { id: 5, title: "Create your first content campaign", description: "Start generating content with AI", completed: false, link: "content/campaigns" },
  { id: 6, title: "Set up rank tracking keywords", description: "Monitor your search engine positions", completed: false, link: "rank-tracker/track-keywords" },
  { id: 7, title: "Configure your widget", description: "Add the AI chat widget to your site", completed: false, link: "widget/code" },
  { id: 8, title: "Invite team members", description: "Collaborate with your team", completed: false, link: "settings/team" },
];

const completedCount = steps.filter((s) => s.completed).length;

export default function SettingsSetup() {
  const [, setLocation] = useLocation();
  const { selectedWorkspace } = useWorkspace();

  const handleNavigate = (link: string) => {
    const wsId = selectedWorkspace?.id || "default";
    setLocation(`/${wsId}/${link}`);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Setup Guide</h1>

      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <span className="text-sm font-medium" data-testid="text-progress-label">{completedCount} of {steps.length} complete</span>
            <span className="text-sm text-muted-foreground">{Math.round((completedCount / steps.length) * 100)}%</span>
          </div>
          <Progress value={(completedCount / steps.length) * 100} data-testid="progress-setup" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-start gap-4 p-3" data-testid={`row-step-${step.id}`}>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  {i < steps.length - 1 && (
                    <div className="w-px h-8 bg-border" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-medium text-sm ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                  {step.link && !step.completed && (
                    <button
                      onClick={() => handleNavigate(step.link!)}
                      className="text-xs text-primary mt-1 inline-block cursor-pointer bg-transparent border-none p-0"
                      data-testid={`link-step-${step.id}`}
                    >
                      Get started
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
