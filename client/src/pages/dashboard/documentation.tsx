import { ClientLayout } from "@/components/client-layout";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const sections = [
  {
    title: "Getting Started",
    articles: [
      { num: 1, title: "Dashboard Overview", subtitle: "Learn the basics of your dashboard" },
      { num: 2, title: "Setting Up Your Workspace", subtitle: "Configure your workspace settings" },
      { num: 3, title: "Adding Your First Domain", subtitle: "Connect and verify your domain" },
    ],
  },
  {
    title: "Content Engine",
    articles: [
      { num: 4, title: "Creating Blog Posts", subtitle: "Write and publish content" },
      { num: 5, title: "Content Campaigns", subtitle: "Organize posts into campaigns" },
      { num: 6, title: "Managing Pages", subtitle: "Create and edit website pages" },
    ],
  },
  {
    title: "SEO Tools",
    articles: [
      { num: 7, title: "SEO Health Check", subtitle: "Audit your site for SEO issues" },
      { num: 8, title: "Link Building", subtitle: "Track and manage backlinks" },
      { num: 9, title: "Schema Markup", subtitle: "Add structured data to your pages" },
    ],
  },
  {
    title: "Rank Tracker",
    articles: [
      { num: 10, title: "Adding Keywords", subtitle: "Start tracking keyword positions" },
      { num: 11, title: "Understanding Reports", subtitle: "Read and interpret ranking data" },
      { num: 12, title: "Rank Check Credits", subtitle: "Purchase and manage credits" },
    ],
  },
  {
    title: "CRM",
    articles: [
      { num: 13, title: "Managing Contacts", subtitle: "Add and organize your contacts" },
      { num: 14, title: "Sales Pipeline", subtitle: "Track deals through your pipeline" },
    ],
  },
  {
    title: "Settings",
    articles: [
      { num: 15, title: "Team Management", subtitle: "Invite members and set permissions" },
      { num: 16, title: "Billing & Plans", subtitle: "Manage your subscription" },
      { num: 17, title: "White Label Setup", subtitle: "Customize branding for clients" },
    ],
  },
  {
    title: "AI Training",
    articles: [
      { num: 18, title: "Knowledge Base Setup", subtitle: "Teach the AI about your business" },
      { num: 19, title: "Training Channels", subtitle: "Configure training data sources" },
    ],
  },
  {
    title: "Widget Code",
    articles: [
      { num: 20, title: "Embedding the Widget", subtitle: "Add the chat widget to your site" },
      { num: 21, title: "Customizing Appearance", subtitle: "Style the widget to match your brand" },
    ],
  },
  {
    title: "Payments",
    articles: [
      { num: 22, title: "Connecting Stripe", subtitle: "Set up Stripe payment processing" },
      { num: 23, title: "Connecting PayPal", subtitle: "Set up PayPal payment processing" },
    ],
  },
  {
    title: "BYOK API Keys",
    articles: [
      { num: 24, title: "Bring Your Own Keys", subtitle: "Use your own AI provider API keys" },
      { num: 25, title: "Supported Providers", subtitle: "OpenAI, Anthropic, Google, and more" },
    ],
  },
];

export default function Documentation() {
  return (
    <ClientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="text-page-title">Documentation</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Learn how to use every feature of your dashboard</p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title} data-testid={`section-${section.title.toLowerCase().replace(/\s+/g, "-")}`}>
              <h2 className="text-lg font-semibold mb-3" data-testid={`text-section-title-${section.title.toLowerCase().replace(/\s+/g, "-")}`}>
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.articles.map((article) => (
                  <Card key={article.num} className="hover-elevate cursor-pointer" data-testid={`card-article-${article.num}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0" data-testid={`text-article-num-${article.num}`}>
                          {article.num}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm" data-testid={`text-article-title-${article.num}`}>{article.title}</p>
                          <p className="text-xs text-muted-foreground" data-testid={`text-article-subtitle-${article.num}`}>{article.subtitle}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}
