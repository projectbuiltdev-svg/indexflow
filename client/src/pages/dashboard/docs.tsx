import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, CalendarCheck, MessageSquare, BarChart3, Search } from "lucide-react";

const sections = [
  {
    title: "Getting Started",
    description: "Learn how to set up your venue, configure settings, and start accepting reservations.",
    icon: BookOpen,
    action: "Read More",
  },
  {
    title: "Managing Reservations",
    description: "How to view, edit, and manage your restaurant reservations effectively.",
    icon: CalendarCheck,
    action: "Watch Video",
  },
  {
    title: "Using the Booking Widget",
    description: "Install and customize the booking widget on your website to allow guests to book directly.",
    icon: MessageSquare,
    action: "Watch Video",
  },
  {
    title: "Analytics Guide",
    description: "Understand your booking patterns, call metrics, and widget engagement data.",
    icon: BarChart3,
    action: "Read More",
  },
  {
    title: "SEO Best Practices",
    description: "Optimize your venue's online presence with rank tracking and content strategies.",
    icon: Search,
    action: "Read More",
  },
];

export default function Documentation() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Documentation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Card key={section.title} data-testid={`doc-card-${section.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0">
              <section.icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{section.description}</p>
              <Button variant="outline" data-testid={`button-doc-${section.title.toLowerCase().replace(/\s+/g, "-")}`}>
                {section.action === "Watch Video" && <PlayCircle className="h-4 w-4 mr-2" />}
                {section.action === "Read More" && <BookOpen className="h-4 w-4 mr-2" />}
                {section.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
