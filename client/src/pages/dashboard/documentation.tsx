import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { 
  BookOpen, 
  Calendar, 
  CalendarDays, 
  Phone, 
  BarChart3, 
  Clock, 
  CalendarX, 
  Building2, 
  Users, 
  Bot, 
  Code, 
  CreditCard,
  Key,
  Bed,
  DoorOpen,
  X,
  ChevronRight,
  CheckCircle,
  Lightbulb,
  HelpCircle,
  Play,
  Video
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardLayout } from "@/components/dashboard-layout";

type DocCategory = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  docs: DocItem[];
};

type DocItem = {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoDuration?: string;
  content: DocContent;
};

type DocContent = {
  overview: string;
  benefits: string[];
  steps: { title: string; description: string }[];
  tips: string[];
};

const documentationData: DocCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    docs: [
      {
        id: "today-view",
        title: "Today's Overview",
        description: "View and manage all tasks and activities for today",
        videoUrl: "",
        videoDuration: "1:45",
        content: {
          overview: "The Today view is your command center for daily operations. It shows all tasks and client activities scheduled for the current day, split by source (dashboard and automated). This gives you instant visibility into what needs attention and current campaign status.",
          benefits: [
            "See all today's tasks and activities at a glance",
            "Track dashboard vs automated activity sources separately",
            "Monitor task status (active, pending, completed)",
            "Quick access to client contact information",
            "Real-time stats for total activities and client counts"
          ],
          steps: [
            { title: "Access Today View", description: "Click 'Today' in the sidebar menu to see all activities for today." },
            { title: "View Source Stats", description: "The top cards show dashboard and automated activity statistics including totals and confirmed counts." },
            { title: "Filter by Source", description: "Use the tabs to filter between All, Dashboard, or Automated activities." },
            { title: "View Activity Details", description: "Click on any row to see full details and manage the activity." }
          ],
          tips: [
            "Check this view first thing in the morning to prepare for the day",
            "The colored left border indicates activity source - blue for dashboard, green for automated",
            "Completed activities are still shown so you can track patterns"
          ]
        }
      }
    ]
  },
  {
    id: "calendar",
    title: "Calendar",
    icon: CalendarDays,
    docs: [
      {
        id: "calendar-view",
        title: "Using the Calendar",
        description: "Navigate and view monthly tasks and deadlines",
        videoUrl: "",
        videoDuration: "1:30",
        content: {
          overview: "The Calendar provides a monthly overview of all your tasks and deadlines. Each day shows the number of scheduled activities and deliverables, helping you plan team workload and resources in advance.",
          benefits: [
            "See task patterns across the month",
            "Plan team workload based on busy days",
            "Identify peak delivery days",
            "Quick overview of total task counts per day"
          ],
          steps: [
            { title: "Navigate Months", description: "Use the left/right arrows to move between months." },
            { title: "View Daily Counts", description: "Each day shows the number of tasks as a badge. The deliverable count appears below on larger screens." },
            { title: "Identify Today", description: "Today's date is highlighted with a colored border." },
            { title: "Click for Details", description: "Click on any day to view detailed tasks for that date." }
          ],
          tips: [
            "Days with high task counts are great for planning team allocation",
            "Use this view to spot workload trends and plan campaigns",
            "Light days might benefit from proactive client outreach"
          ]
        }
      }
    ]
  },
  {
    id: "calls",
    title: "Calls",
    icon: Phone,
    docs: [
      {
        id: "call-logs",
        title: "Managing Call Logs",
        description: "View AI phone call history and transcripts",
        videoUrl: "",
        videoDuration: "2:15",
        content: {
          overview: "The Calls section shows all phone interactions handled by your AI assistant via Twilio. You can see incoming, outgoing, and missed calls along with their outcomes - whether a lead was captured, a question was answered, or if it was just an inquiry.",
          benefits: [
            "Track all AI-handled phone calls",
            "See call outcomes and lead results",
            "Monitor missed calls for follow-up",
            "Access full call transcripts",
            "Measure average call duration and success rates"
          ],
          steps: [
            { title: "View Call Statistics", description: "The top cards show total calls, answered rate, missed calls, and average duration." },
            { title: "Browse Recent Calls", description: "The call list shows all recent calls with their type, time, and result." },
            { title: "View Call Details", description: "Click on any call to see the full transcript and AI conversation." },
            { title: "Identify Call Types", description: "Icons indicate incoming (green), outgoing (blue), or missed (red) calls." }
          ],
          tips: [
            "Review missed calls daily to ensure no potential leads are lost",
            "Check call transcripts to see how your AI handles specific questions",
            "High average call duration might indicate complex inquiries to address"
          ]
        }
      }
    ]
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: BarChart3,
    docs: [
      {
        id: "analytics-overview",
        title: "Understanding Analytics",
        description: "Track performance across all channels",
        videoUrl: "",
        videoDuration: "2:30",
        content: {
          overview: "Analytics provides comprehensive data on your performance across three channels: Campaigns (overall), Widget (website visitors), and Phone (Twilio calls). Use these metrics to measure success and identify areas for improvement.",
          benefits: [
            "Track total leads and conversion rates",
            "Measure widget impressions and conversion rates",
            "Monitor phone lead capture rates",
            "Identify peak engagement times and days",
            "Compare performance month-over-month"
          ],
          steps: [
            { title: "Select Channel", description: "Use the tabs to switch between Campaigns, Widget, and Phone analytics." },
            { title: "View Key Metrics", description: "Top cards show the most important numbers for each channel." },
            { title: "Track Trends", description: "Green arrows indicate improvements compared to last month." },
            { title: "Analyze Patterns", description: "Charts help visualize trends over time." }
          ],
          tips: [
            "Check conversion rates weekly to spot any declining trends",
            "Compare phone vs widget leads to optimize your marketing spend",
            "Peak time data helps with resource planning"
          ]
        }
      }
    ]
  },
  {
    id: "settings",
    title: "Settings",
    icon: Clock,
    docs: [
      {
        id: "business-hours",
        title: "Setting Business Hours",
        description: "Configure when your workspace is available",
        videoUrl: "",
        videoDuration: "1:20",
        content: {
          overview: "Business Hours control when your AI assistant and chat widget are active. The system will only respond within your operating hours, ensuring clients can reach you when you're available.",
          benefits: [
            "Control availability outside operating hours",
            "Set different hours for each day of the week",
            "Mark specific days as unavailable",
            "AI and widget automatically respect these hours"
          ],
          steps: [
            { title: "Access Hours Settings", description: "Go to Settings > Business Hours in the sidebar." },
            { title: "Toggle Days Open/Closed", description: "Use the switch next to each day to mark it as open or closed." },
            { title: "Set Opening Time", description: "For open days, set the start time using the first time picker." },
            { title: "Set Closing Time", description: "Set the end time to define when availability ends." },
            { title: "Save Changes", description: "Click 'Save Changes' to apply your new hours." }
          ],
          tips: [
            "Set closing time to when you want availability to end, not when you actually close",
            "Consider extending hours on weekdays if you're busier",
            "These hours sync automatically across all communication channels"
          ]
        }
      },
      {
        id: "closures",
        title: "Managing Closures",
        description: "Block specific dates from availability",
        videoUrl: "",
        videoDuration: "1:10",
        content: {
          overview: "Closures let you mark specific dates when your workspace is unavailable - holidays, team events, or maintenance days. The system automatically blocks these dates, preventing any interactions.",
          benefits: [
            "Block availability on holidays",
            "Block team event dates",
            "Plan maintenance closures in advance",
            "Clients see clear 'unavailable' status"
          ],
          steps: [
            { title: "Go to Closures", description: "Navigate to Settings > Closures." },
            { title: "Select Date", description: "Use the date picker to choose the closure date." },
            { title: "Add Reason", description: "Optionally add a reason like 'Christmas Day' or 'Private Event'." },
            { title: "Click Add", description: "Click 'Add Closure' to save it." },
            { title: "Remove if Needed", description: "Click the trash icon next to any closure to remove it." }
          ],
          tips: [
            "Add holiday closures well in advance",
            "Include a reason so staff understand why it's blocked",
            "Closures can be removed anytime if plans change"
          ]
        }
      },
      {
        id: "resources",
        title: "Managing Resources",
        description: "Define team members, tools, and service areas",
        videoUrl: "",
        videoDuration: "1:40",
        content: {
          overview: "Resources are your team capacity and tools - content writers, SEO specialists, project managers. Defining resources helps the system manage workload and prevent overallocation.",
          benefits: [
            "Track total team capacity",
            "Manage multiple service areas",
            "Prevent overallocation",
            "Assign tasks to specific teams"
          ],
          steps: [
            { title: "View Resources", description: "Go to Settings > Resources to see current teams." },
            { title: "Add New Resource", description: "Enter the name (e.g., 'Content Team') and capacity (members)." },
            { title: "Click Add", description: "Click 'Add' to create the resource." },
            { title: "Remove if Needed", description: "Click the trash icon to remove a resource." },
            { title: "Save Changes", description: "Click 'Save Changes' to confirm." }
          ],
          tips: [
            "Include all distinct teams for accurate capacity tracking",
            "Specialized roles should have their own resource entry",
            "Total capacity helps with project planning"
          ]
        }
      },
      {
        id: "team",
        title: "Team Management",
        description: "Invite staff and set access permissions",
        videoUrl: "",
        videoDuration: "1:55",
        content: {
          overview: "Team management lets you invite team members to access your dashboard with different permission levels. Admins have full access, Managers can handle daily operations, and Members can view today's tasks.",
          benefits: [
            "Give team members appropriate access levels",
            "Track who has dashboard access",
            "Admins manage billing and settings",
            "Managers handle day-to-day operations",
            "Members can check today's tasks"
          ],
          steps: [
            { title: "Go to Team Settings", description: "Navigate to Settings > Team." },
            { title: "Enter Email", description: "Type the team member's email address." },
            { title: "Select Role", description: "Choose Admin, Manager, or Staff from the dropdown." },
            { title: "Send Invite", description: "Click 'Send Invite' to email the invitation." },
            { title: "Remove Members", description: "Click the trash icon to remove team members (except primary admin)." }
          ],
          tips: [
            "Give managers and above access for flexibility",
            "Member role is perfect for team contributors",
            "Review team access periodically for security"
          ]
        }
      }
    ]
  },
  {
    id: "ai-training",
    title: "AI Training",
    icon: Bot,
    docs: [
      {
        id: "ai-training-hub",
        title: "Training Your AI",
        description: "Teach the AI about your workspace",
        videoUrl: "",
        videoDuration: "3:45",
        content: {
          overview: "The AI Training Hub is where you teach your virtual assistant about your workspace. Add your website URL, service information, FAQs, policies, and more. This knowledge is used across all channels - the chat widget, voice calls, and SMS.",
          benefits: [
            "AI learns your specific workspace details",
            "Train once, deploy everywhere (widget, voice, SMS)",
            "Answer client questions accurately",
            "Handle complex inquiries automatically",
            "Continuously improve responses"
          ],
          steps: [
            { title: "Add Website URL", description: "Enter your website URL to let the AI scan and learn from your site." },
            { title: "Add Text Content", description: "Use categories like Business Info, Services, FAQs, Policies to add detailed information." },
            { title: "Upload Files", description: "Upload PDFs, service guides, or other documents." },
            { title: "Test Responses", description: "Use the test chat to see how the AI responds to questions." },
            { title: "Configure Widget", description: "Set widget colors, position, and welcome message." }
          ],
          tips: [
            "Include your full service list with pricing for accurate quotes",
            "Add common FAQs to reduce repetitive inquiries",
            "Test with questions your clients typically ask",
            "Update training data when services or policies change"
          ]
        }
      }
    ]
  },
  {
    id: "widget-code",
    title: "Widget Code",
    icon: Code,
    docs: [
      {
        id: "embed-widget",
        title: "Embedding the Widget",
        description: "Add the chat widget to your website",
        videoUrl: "",
        videoDuration: "2:20",
        content: {
          overview: "The Widget Code page provides embed code for adding the indexFlow chat widget to your existing website. We support all major platforms including WordPress, Wix, Squarespace, Webflow, Shopify, and more.",
          benefits: [
            "Works with all major website platforms",
            "Easy copy-paste installation",
            "Automatically uses your trained AI",
            "Respects your business hours and availability",
            "Customizable colors and styling"
          ],
          steps: [
            { title: "Select Platform", description: "Choose your website platform from the dropdown (WordPress, Wix, etc.)." },
            { title: "Copy Code", description: "Click 'Copy' to copy the embed code to your clipboard." },
            { title: "Follow Instructions", description: "Each platform has step-by-step installation instructions." },
            { title: "Customize (Optional)", description: "Add data attributes for custom colors or dark theme." },
            { title: "Publish", description: "Save and publish your website to activate the widget." }
          ],
          tips: [
            "Test the widget after installation to ensure it works",
            "Use the iFrame version for Wix for best compatibility",
            "Contact support if you need help with custom installations"
          ]
        }
      }
    ]
  },
  {
    id: "payments",
    title: "Payments",
    icon: CreditCard,
    docs: [
      {
        id: "payment-setup",
        title: "Setting Up Payments",
        description: "Connect Stripe or PayPal for client billing",
        videoUrl: "",
        videoDuration: "2:50",
        content: {
          overview: "Payment integration enables client billing and invoice collection. Connect your Stripe or PayPal account to streamline payments by collecting fees at the time of service.",
          benefits: [
            "Streamline client billing",
            "Collect payments for services",
            "Automatic refunds for cancellations",
            "Direct deposits to your bank account",
            "PCI-compliant secure payments"
          ],
          steps: [
            { title: "Choose Provider", description: "Select either Stripe or PayPal tab." },
            { title: "Get API Keys", description: "Log into your Stripe/PayPal dashboard to get your API keys." },
            { title: "Enter Credentials", description: "Enter your publishable key, secret key, and webhook secret." },
            { title: "Connect Account", description: "Click 'Connect Account' to verify and save." },
            { title: "Configure Deposits", description: "Set deposit amounts or full prepayment requirements." }
          ],
          tips: [
            "Start with invoicing for individual services first",
            "Test with small amounts before going live",
            "Clear refund policies reduce disputes"
          ]
        }
      }
    ]
  },
  {
    id: "byok",
    title: "BYOK API Keys",
    icon: Key,
    docs: [
      {
        id: "byok-setup",
        title: "Bring Your Own API Keys",
        description: "Use your own AI provider API keys",
        videoUrl: "",
        videoDuration: "2:05",
        content: {
          overview: "BYOK (Bring Your Own Keys) lets you use your own API keys from AI providers like OpenAI, Anthropic, Google, and more. This gives you more control over costs and allows you to use your existing enterprise agreements.",
          benefits: [
            "Use existing enterprise AI agreements",
            "Direct billing from AI providers",
            "Full control over API usage",
            "Access to latest model versions",
            "Use credits you've already purchased"
          ],
          steps: [
            { title: "Select Provider", description: "Choose the AI provider (OpenAI, Anthropic, Google, etc.)." },
            { title: "Get API Key", description: "Log into your provider dashboard and create an API key." },
            { title: "Enter Key", description: "Paste your API key into the secure input field." },
            { title: "Save Key", description: "Click 'Save' to securely store your key." },
            { title: "Test Connection", description: "The system will verify your key works correctly." }
          ],
          tips: [
            "Set usage limits in your provider dashboard",
            "Keep track of costs in your provider billing",
            "You can switch between providers anytime"
          ]
        }
      }
    ]
  },
  {
    id: "rooms",
    title: "Projects",
    icon: Bed,
    docs: [
      {
        id: "project-types",
        title: "Setting Up Project Types",
        description: "Define project categories with pricing and deliverables",
        videoUrl: "",
        videoDuration: "2:25",
        content: {
          overview: "Project Types define your different service categories - SEO Audit, Content Strategy, Link Building, etc. Each type has its own pricing, scope, and deliverables. This is essential for organizing your agency workflow.",
          benefits: [
            "Define multiple project categories",
            "Set pricing for each type",
            "Specify scope and deliverables",
            "List included services per project type",
            "Easy management of offerings"
          ],
          steps: [
            { title: "Go to Project Types", description: "Navigate to Projects > Project Types in the sidebar." },
            { title: "Add New Type", description: "Click 'Add Project Type' and enter the category name." },
            { title: "Set Pricing", description: "Enter the rate for this project type." },
            { title: "Set Scope", description: "Specify deliverables for this project type." },
            { title: "Add Services", description: "List included services like keyword research, content creation, etc." }
          ],
          tips: [
            "Create types for each distinct service category you offer",
            "Include all deliverables for accurate client expectations",
            "Review pricing quarterly"
          ]
        }
      },
      {
        id: "all-projects",
        title: "Managing Individual Projects",
        description: "Add and manage project inventory",
        videoUrl: "",
        videoDuration: "1:50",
        content: {
          overview: "The All Projects section is where you add individual projects to your workflow. Each project is assigned a code and linked to a project type. This creates your active project inventory.",
          benefits: [
            "Track individual project status",
            "Assign projects to types",
            "Set project-specific details",
            "Manage project timelines",
            "Handle project status"
          ],
          steps: [
            { title: "Go to All Projects", description: "Navigate to Projects > All Projects." },
            { title: "Add Project", description: "Click 'Add Project' to create a new project." },
            { title: "Enter Project Code", description: "Assign a project code (e.g., SEO-101, CMS-201)." },
            { title: "Select Type", description: "Link the project to a project type." },
            { title: "Set Status", description: "Mark as active, on hold, or completed." }
          ],
          tips: [
            "Use consistent naming conventions for project codes",
            "Mark projects on hold to track progress",
            "Review project status weekly"
          ]
        }
      },
      {
        id: "project-timeline",
        title: "Project Timeline",
        description: "View and manage project schedules",
        videoUrl: "",
        videoDuration: "2:10",
        content: {
          overview: "The Project Timeline shows all active projects with start and end dates. View workload at a glance and manage client deliverables.",
          benefits: [
            "Visual timeline of all projects",
            "See start and end dates",
            "Monitor workload distribution",
            "Manage client deliverables",
            "Prevent resource conflicts"
          ],
          steps: [
            { title: "View Timeline", description: "Go to Projects > Timeline to see the schedule." },
            { title: "Navigate Dates", description: "Use arrows to move between weeks/months." },
            { title: "View Project", description: "Click on a project to see client details." },
            { title: "Check Workload", description: "Color-coded blocks show active projects." },
            { title: "Manage Deliverables", description: "Update project status from project details." }
          ],
          tips: [
            "Review upcoming deliverables each morning",
            "Track overdue items for deadline planning",
            "Use workload data for resource decisions"
          ]
        }
      }
    ]
  }
];

export default function Documentation() {
  const [, params] = useRoute("/:workspaceId/documentation");
  const workspaceId = params?.workspaceId;
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    document.title = "Documentation - indexFlow Dashboard";
  }, []);

  const handleVideoClick = (doc: DocItem) => {
    if (doc.videoUrl) {
      setSelectedVideo({ url: doc.videoUrl, title: doc.title });
      setVideoDialogOpen(true);
    } else {
      setSelectedVideo({ url: '', title: doc.title });
      setVideoDialogOpen(true);
    }
  };

  const handleDocClick = (doc: DocItem, categoryId: string) => {
    setSelectedDoc(doc);
    setSelectedCategory(categoryId);
  };

  const handleClose = () => {
    setSelectedDoc(null);
    setSelectedCategory(null);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        <div className={`flex-1 overflow-hidden transition-all duration-300 ${selectedDoc ? 'w-1/2' : 'w-full'}`}>
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Documentation
              </h1>
              <p className="text-muted-foreground">Learn how to use every feature of your dashboard</p>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 pb-6">
                {documentationData.map((category) => (
                  <Card key={category.id} data-testid={`doc-category-${category.id}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <category.icon className="w-5 h-5 text-primary" />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.docs.map((doc) => (
                          <div
                            key={doc.id}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedDoc?.id === doc.id ? 'border-primary bg-primary/5' : ''
                            }`}
                            data-testid={`doc-item-${doc.id}`}
                          >
                            <div className="flex items-center gap-4">
                              {doc.videoDuration && (
                                <button
                                  onClick={() => handleVideoClick(doc)}
                                  className="relative flex-shrink-0 w-24 h-16 bg-muted rounded-md overflow-hidden group hover-elevate cursor-pointer"
                                  data-testid={`video-thumbnail-${doc.id}`}
                                >
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                      <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                                    </div>
                                  </div>
                                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                    {doc.videoDuration}
                                  </div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Video className="w-8 h-8 text-muted-foreground/50" />
                                  </div>
                                </button>
                              )}
                              <button
                                onClick={() => handleDocClick(doc, category.id)}
                                className="flex-1 text-left hover-elevate cursor-pointer rounded p-1"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{doc.title}</p>
                                    <p className="text-sm text-muted-foreground">{doc.description}</p>
                                  </div>
                                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${
                                    selectedDoc?.id === doc.id ? 'rotate-90' : ''
                                  }`} />
                                </div>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {selectedDoc && (
          <div className="w-1/2 border-l pl-4 h-full overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {documentationData.find(c => c.id === selectedCategory)?.title}
                  </Badge>
                  <h2 className="text-xl font-bold">{selectedDoc.title}</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleClose}
                  data-testid="button-close-doc"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6 pb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <HelpCircle className="w-4 h-4" />
                        Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedDoc.content.overview}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Benefits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedDoc.content.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">How To Use</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedDoc.content.steps.map((step, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{step.title}</p>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-500/30 bg-yellow-500/5">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        Pro Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedDoc.content.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>

      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              {selectedVideo?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
            {selectedVideo?.url ? (
              <iframe 
                src={selectedVideo.url}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title={selectedVideo.title}
              />
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Video Coming Soon</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  We're currently producing this tutorial video. Check back soon for a step-by-step walkthrough of this feature.
                </p>
                <Badge variant="secondary" className="mt-4">
                  In Production
                </Badge>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
