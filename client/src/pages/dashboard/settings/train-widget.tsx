import { useEffect, useState } from "react";
import { 
  Brain, 
  Globe, 
  FileText, 
  Upload, 
  Trash2, 
  Plus, 
  Check, 
  Loader2, 
  MessageSquare,
  Send,
  Image,
  File,
  Link as LinkIcon,
  BookOpen,
  Utensils,
  HelpCircle,
  Building2,
  Clock,
  Star,
  AlertCircle,
  Phone,
  Bot,
  Palette,
  Volume2,
  User,
  Settings,
  Mic,
  PhoneCall,
  PhoneOff,
  Copy
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type TrainingItem = {
  id: string;
  type: "url" | "text" | "file";
  category: string;
  title: string;
  content: string;
  status: "pending" | "processing" | "trained" | "error";
  createdAt: Date;
  fileSize?: string;
  fileName?: string;
};

type TestMessage = {
  role: "user" | "assistant";
  content: string;
};

interface KnowledgeBaseItem {
  id: string;
  workspaceId: string;
  type: string;
  category: string | null;
  title: string | null;
  content: string | null;
  sourceUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  status: string;
  createdAt: string;
  trainedAt: string | null;
}

interface WidgetSettingsData {
  id: number;
  workspaceId: string;
  primaryColor: string;
  position: string;
  welcomeMessage: string | null;
  isEnabled: boolean;
  logoUrl: string | null;
  updatedAt: string;
}

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

export default function SettingsTrainWidget() {
  const [, navigate] = useLocation();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { toast } = useToast();

  const { data: knowledgeBaseItems = [] } = useQuery<KnowledgeBaseItem[]>({
    queryKey: ["/api/workspaces", workspaceId, "knowledge-base"],
  });

  const { data: widgetSettingsData } = useQuery<WidgetSettingsData>({
    queryKey: ["/api/workspaces", workspaceId, "widget-settings"],
  });

  const { data: twilioSettingsData } = useQuery<TwilioSettingsData>({
    queryKey: ["/api/workspaces", workspaceId, "twilio-settings"],
  });

  const [mainTab, setMainTab] = useState("knowledge");
  
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  
  const [textCategory, setTextCategory] = useState("business");
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  
  const [trainingItems, setTrainingItems] = useState<TrainingItem[]>([]);

  const [testMessages, setTestMessages] = useState<TestMessage[]>([]);
  const [testInput, setTestInput] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const [widgetColor, setWidgetColor] = useState("#4F46E5");
  const [widgetPosition, setWidgetPosition] = useState("bottom-right");
  const [widgetGreeting, setWidgetGreeting] = useState("Hi! How can I help you today?");
  const [widgetLogoUrl, setWidgetLogoUrl] = useState("");

  const [voicePersona, setVoicePersona] = useState("female");
  const [voiceGreeting, setVoiceGreeting] = useState("Thank you for calling. How may I assist you today?");
  const [enableVoicemail, setEnableVoicemail] = useState(true);
  const [maxCallDuration, setMaxCallDuration] = useState("5");
  const [twilioConnected, setTwilioConnected] = useState(false);

  // SMS Settings
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [smsTemplate, setSmsTemplate] = useState(
    "Hi {client_name}! Your appointment with {workspace_name} is confirmed for {date} at {time}. Reply HELP for assistance or CANCEL to cancel."
  );
  const [testPhoneNumber, setTestPhoneNumber] = useState("");

  const addKnowledgeMutation = useMutation({
    mutationFn: (data: { type: string; category?: string; title?: string; content?: string; sourceUrl?: string; fileName?: string; fileType?: string; status: string }) =>
      apiRequest("POST", `/api/workspaces/${workspaceId}/knowledge-base`, { ...data, workspaceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "knowledge-base"] });
    },
  });

  const deleteKnowledgeMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/knowledge-base/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "knowledge-base"] });
    },
  });

  const saveWidgetMutation = useMutation({
    mutationFn: () =>
      apiRequest("PUT", `/api/workspaces/${workspaceId}/widget-settings`, {
        workspaceId,
        primaryColor: widgetColor,
        position: widgetPosition,
        welcomeMessage: widgetGreeting,
        logoUrl: widgetLogoUrl || null,
        isEnabled: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "widget-settings"] });
      toast({ title: "Widget settings saved" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save widget settings.", variant: "destructive" });
    },
  });

  const saveTwilioMutation = useMutation({
    mutationFn: () =>
      apiRequest("PUT", `/api/workspaces/${workspaceId}/twilio-settings`, {
        workspaceId,
        voicePersona,
        phoneGreeting: voiceGreeting,
        maxCallDuration: parseInt(maxCallDuration),
        voicemailEnabled: enableVoicemail,
        smsEnabled,
        smsTemplate,
        isConnected: twilioConnected,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workspaces", workspaceId, "twilio-settings"] });
      toast({ title: "Settings saved" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    },
  });

  useEffect(() => {
    document.title = "AI Training Hub - Dashboard";
  }, []);

  useEffect(() => {
    if (knowledgeBaseItems.length > 0) {
      setTrainingItems(knowledgeBaseItems.map(item => ({
        id: item.id,
        type: (item.type as "url" | "text" | "file") || "text",
        category: item.category || "General",
        title: item.title || "",
        content: item.content || item.sourceUrl || "",
        status: (item.status === "trained" ? "trained" : item.status === "error" ? "error" : item.status === "processing" ? "processing" : "pending") as TrainingItem["status"],
        createdAt: new Date(item.createdAt),
        fileName: item.fileName || undefined,
      })));
    }
  }, [knowledgeBaseItems]);

  useEffect(() => {
    if (widgetSettingsData && widgetSettingsData.primaryColor) {
      setWidgetColor(widgetSettingsData.primaryColor);
      setWidgetPosition(widgetSettingsData.position || "bottom-right");
      setWidgetGreeting(widgetSettingsData.welcomeMessage || "Hi! How can I help you today?");
      setWidgetLogoUrl(widgetSettingsData.logoUrl || "");
    }
  }, [widgetSettingsData]);

  useEffect(() => {
    if (twilioSettingsData) {
      setTwilioConnected(twilioSettingsData.isConnected || false);
      setVoicePersona(twilioSettingsData.voicePersona || "female");
      setVoiceGreeting(twilioSettingsData.phoneGreeting || "Thank you for calling. How may I assist you today?");
      setMaxCallDuration(String(twilioSettingsData.maxCallDuration || 5));
      setEnableVoicemail(twilioSettingsData.voicemailEnabled ?? true);
      setSmsEnabled(twilioSettingsData.smsEnabled ?? true);
      setSmsTemplate(twilioSettingsData.smsTemplate || smsTemplate);
    }
  }, [twilioSettingsData]);

  const textCategories = [
    { id: "business", label: "Business Info", icon: Building2, placeholder: "Describe your business, history, atmosphere, unique selling points..." },
    { id: "menu", label: "Services & Offerings", icon: Utensils, placeholder: "List your services, pricing, packages, and special offerings..." },
    { id: "faq", label: "FAQs", icon: HelpCircle, placeholder: "Common questions and answers about your workspace..." },
    { id: "policies", label: "Policies", icon: FileText, placeholder: "Scheduling policies, cancellation rules, dress code, etc..." },
    { id: "hours", label: "Special Hours", icon: Clock, placeholder: "Holiday hours, special events, seasonal changes..." },
    { id: "reviews", label: "Reviews & Awards", icon: Star, placeholder: "Notable reviews, awards, press mentions..." },
  ];

  const currentCategory = textCategories.find(c => c.id === textCategory) || textCategories[0];

  const handleScanWebsite = async () => {
    if (!websiteUrl) {
      toast({ title: "Enter a URL", description: "Please enter your website URL", variant: "destructive" });
      return;
    }
    setIsScanning(true);
    try {
      const hostname = new URL(websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`).hostname;
      addKnowledgeMutation.mutate({
        type: "url",
        category: "Website",
        title: hostname,
        sourceUrl: websiteUrl,
        content: websiteUrl,
        status: "trained",
      });
      setWebsiteUrl("");
      toast({ title: "Website Added", description: "Your website has been added to the knowledge base" });
    } catch {
      toast({ title: "Invalid URL", description: "Please enter a valid URL", variant: "destructive" });
    }
    setIsScanning(false);
  };

  const handleAddText = () => {
    if (!textTitle || !textContent) {
      toast({ title: "Missing Information", description: "Please enter both a title and content", variant: "destructive" });
      return;
    }
    addKnowledgeMutation.mutate({
      type: "text",
      category: currentCategory.label,
      title: textTitle,
      content: textContent,
      status: "trained",
    });
    setTextTitle("");
    setTextContent("");
    toast({ title: "Content Added", description: `${currentCategory.label} content has been added` });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    Array.from(files).forEach(file => {
      addKnowledgeMutation.mutate({
        type: "file",
        category: file.type.includes("image") ? "Image" : "Document",
        title: file.name,
        content: file.name,
        fileName: file.name,
        fileType: file.type,
        status: "trained",
      });
    });
    toast({ title: "Files Uploaded", description: `${files.length} file(s) have been added` });
    e.target.value = "";
  };

  const handleDeleteItem = (id: string) => {
    deleteKnowledgeMutation.mutate(id);
    toast({ title: "Removed", description: "Training data removed from knowledge base" });
  };

  const handleTestChat = async () => {
    if (!testInput.trim()) return;

    const userMessage: TestMessage = { role: "user", content: testInput };
    setTestMessages(prev => [...prev, userMessage]);
    setTestInput("");
    setIsTesting(true);

    setTimeout(() => {
      const responses = [
        "Based on your training data, I can help answer questions about your services, hours, and scheduling policies. How can I assist you?",
        "I've learned from your website and uploaded content. I can provide information about your dishes, prices, and special offerings.",
        "Thank you for your question! According to your business information, I can help with scheduling, service inquiries, and general questions about your workspace."
      ];
      
      const assistantMessage: TestMessage = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)]
      };
      
      setTestMessages(prev => [...prev, assistantMessage]);
      setIsTesting(false);
    }, 1500);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getStatusBadge = (status: TrainingItem["status"]) => {
    switch (status) {
      case "trained":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><Check className="w-3 h-3 mr-1" /> Trained</Badge>;
      case "processing":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing</Badge>;
      case "error":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><AlertCircle className="w-3 h-3 mr-1" /> Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getTypeIcon = (type: TrainingItem["type"], category: string) => {
    if (type === "url") return <Globe className="w-4 h-4" />;
    if (type === "file") return category === "Image" ? <Image className="w-4 h-4" /> : <File className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const trainedCount = trainingItems.filter(i => i.status === "trained").length;
  const processingCount = trainingItems.filter(i => i.status === "processing").length;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2" data-testid="text-train-widget-title">
            <Brain className="w-6 h-6" />
            AI Training Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Train once, deploy everywhere — Widget, Voice, and SMS all use the same knowledge base
          </p>
        </div>

        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="knowledge" className="flex items-center gap-2" data-testid="tab-knowledge">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Knowledge Base</span>
              <span className="sm:hidden">Knowledge</span>
            </TabsTrigger>
            <TabsTrigger value="widget" className="flex items-center gap-2" data-testid="tab-widget">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Widget Settings</span>
              <span className="sm:hidden">Widget</span>
            </TabsTrigger>
            <TabsTrigger value="twilio" className="flex items-center gap-2" data-testid="tab-twilio">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Twilio Voice</span>
              <span className="sm:hidden">Voice</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2" data-testid="tab-sms">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Twilio SMS</span>
              <span className="sm:hidden">SMS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Tabs defaultValue="website" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="website" className="flex items-center gap-2" data-testid="tab-website">
                      <Globe className="w-4 h-4" />
                      <span className="hidden sm:inline">Website</span>
                    </TabsTrigger>
                    <TabsTrigger value="content" className="flex items-center gap-2" data-testid="tab-content">
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Content</span>
                    </TabsTrigger>
                    <TabsTrigger value="files" className="flex items-center gap-2" data-testid="tab-files">
                      <Upload className="w-4 h-4" />
                      <span className="hidden sm:inline">Files</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="website" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="w-5 h-5" />
                          Scan Your Website
                        </CardTitle>
                        <CardDescription>
                          Enter your website URL and we'll automatically extract information about your business
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              placeholder="https://your-website.com"
                              value={websiteUrl}
                              onChange={(e) => setWebsiteUrl(e.target.value)}
                              data-testid="input-website-url"
                            />
                          </div>
                          <Button onClick={handleScanWebsite} disabled={isScanning} data-testid="button-scan-website">
                            {isScanning ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Scanning</>
                            ) : (
                              <><LinkIcon className="w-4 h-4 mr-2" /> Scan</>
                            )}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          We'll scan your homepage, services pages, about page, and contact information.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="content" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Add Text Content
                        </CardTitle>
                        <CardDescription>
                          Add specific information about your business that the AI should know
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="mb-2 block">Category</Label>
                          <div className="flex flex-wrap gap-2">
                            {textCategories.map((cat) => (
                              <Button
                                key={cat.id}
                                size="sm"
                                variant={textCategory === cat.id ? "default" : "outline"}
                                onClick={() => setTextCategory(cat.id)}
                                data-testid={`button-category-${cat.id}`}
                              >
                                <cat.icon className="w-4 h-4 mr-1" />
                                {cat.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="text-title">Title</Label>
                          <Input
                            id="text-title"
                            placeholder={`e.g., "${currentCategory.label} Overview"`}
                            value={textTitle}
                            onChange={(e) => setTextTitle(e.target.value)}
                            className="mt-1"
                            data-testid="input-text-title"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="text-content">Content</Label>
                          <Textarea
                            id="text-content"
                            placeholder={currentCategory.placeholder}
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            rows={6}
                            className="mt-1"
                            data-testid="input-text-content"
                          />
                        </div>
                        
                        <Button onClick={handleAddText} className="w-full" data-testid="button-add-content">
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Knowledge Base
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="files" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Upload className="w-5 h-5" />
                          Upload Files
                        </CardTitle>
                        <CardDescription>
                          Upload menus, images, PDFs, or any documents about your business
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                          <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            multiple
                            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
                            onChange={handleFileUpload}
                            data-testid="input-file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                            <p className="font-medium">Drop files here or click to upload</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              PDF, DOC, TXT, JPG, PNG up to 10MB each
                            </p>
                          </label>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4" />
                            <span>Menu PDFs</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            <span>Food Photos</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Price Lists</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Wine Lists</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5" />
                          Knowledge Base
                        </CardTitle>
                        <CardDescription>
                          {trainedCount} items trained{processingCount > 0 && `, ${processingCount} processing`} — shared across all channels
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {trainingItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Brain className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        <p>No training data yet</p>
                        <p className="text-sm">Add your website, content, or files above</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {trainingItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group"
                            data-testid={`training-item-${item.id}`}
                          >
                            <div className="p-2 bg-background rounded-md">
                              {getTypeIcon(item.type, item.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{item.title}</span>
                                <Badge variant="outline" className="text-xs">{item.category}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {item.type === "file" ? `${item.fileSize}` : item.content.slice(0, 50)}
                                {item.content.length > 50 && "..."}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(item.status)}
                              <Button
                                size="icon"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                onClick={() => handleDeleteItem(item.id)}
                                data-testid={`button-delete-${item.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Test Your AI
                    </CardTitle>
                    <CardDescription>
                      See how the AI responds using your training data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-64 overflow-y-auto border rounded-lg p-3 space-y-3 bg-muted/30">
                      {testMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                          <p>Ask a question to test the AI</p>
                        </div>
                      ) : (
                        testMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-lg p-3 text-sm ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background border"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                      {isTesting && (
                        <div className="flex justify-start">
                          <div className="bg-background border rounded-lg p-3">
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question..."
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleTestChat()}
                        data-testid="input-test-chat"
                      />
                      <Button size="icon" onClick={handleTestChat} disabled={isTesting} data-testid="button-send-test">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setTestInput("What services do you offer?"); }}
                      >
                        Services
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setTestInput("What are your hours?"); }}
                      >
                        Hours
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { setTestInput("Can I schedule an appointment?"); }}
                      >
                        Scheduling
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Training Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p>Add your complete service list with pricing for accurate responses</p>
                    </div>
                    <div className="flex gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p>Include FAQs to handle common customer questions</p>
                    </div>
                    <div className="flex gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p>Upload images of dishes for visual context</p>
                    </div>
                    <div className="flex gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p>Add policies about scheduling, cancellations, dress code</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Shared Knowledge</p>
                        <p className="text-muted-foreground mt-1">
                          All training data is automatically shared with Widget, Voice, and SMS channels.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="widget" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Widget Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how the chat widget looks on your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="widget-color">Primary Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="color"
                        id="widget-color"
                        value={widgetColor}
                        onChange={(e) => setWidgetColor(e.target.value)}
                        className="w-12 h-9 p-1 cursor-pointer"
                        data-testid="input-widget-color"
                      />
                      <Input
                        value={widgetColor}
                        onChange={(e) => setWidgetColor(e.target.value)}
                        className="flex-1"
                        data-testid="input-widget-color-hex"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="widget-position">Position</Label>
                    <Select value={widgetPosition} onValueChange={setWidgetPosition}>
                      <SelectTrigger className="mt-1" data-testid="select-widget-position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="widget-greeting">Welcome Message</Label>
                    <Textarea
                      id="widget-greeting"
                      value={widgetGreeting}
                      onChange={(e) => setWidgetGreeting(e.target.value)}
                      rows={3}
                      className="mt-1"
                      data-testid="input-widget-greeting"
                    />
                  </div>

                  <div>
                    <Label htmlFor="widget-logo">Your Logo URL</Label>
                    <p className="text-xs text-muted-foreground mt-0.5 mb-1">
                      Recommended: 80x80px PNG or WebP with transparent background
                    </p>
                    <Input
                      id="widget-logo"
                      value={widgetLogoUrl}
                      onChange={(e) => setWidgetLogoUrl(e.target.value)}
                      placeholder="https://example.com/your-logo.png"
                      className="mt-1"
                      data-testid="input-widget-logo-url"
                    />
                    {widgetLogoUrl && (
                      <div className="mt-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md border bg-muted/30 flex items-center justify-center overflow-hidden">
                          <img
                            src={widgetLogoUrl}
                            alt="Logo preview"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            data-testid="img-widget-logo-preview"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">Preview</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-400">Using Knowledge Base</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {trainedCount} trained items from your knowledge base will power this widget.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Widget Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: widgetColor }}
                        >
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">AI Assistant</span>
                      </div>
                      <div className="bg-background rounded-lg p-3 text-sm">
                        {widgetGreeting}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full" onClick={() => saveWidgetMutation.mutate()} disabled={saveWidgetMutation.isPending} data-testid="button-save-widget">
                  <Check className="w-4 h-4 mr-2" />
                  Save Widget Settings
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="twilio" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-400">Knowledge Base Ready</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {trainedCount} trained items from your knowledge base will power voice calls. No re-training needed!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="w-5 h-5" />
                      Voice Settings
                    </CardTitle>
                    <CardDescription>
                      Configure how the AI sounds on phone calls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Voice Persona</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={voicePersona === "female" ? "default" : "outline"}
                          onClick={() => setVoicePersona("female")}
                          className="flex-1"
                          data-testid="button-voice-female"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Female
                        </Button>
                        <Button
                          variant={voicePersona === "male" ? "default" : "outline"}
                          onClick={() => setVoicePersona("male")}
                          className="flex-1"
                          data-testid="button-voice-male"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Male
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="voice-greeting">Phone Greeting</Label>
                      <Textarea
                        id="voice-greeting"
                        value={voiceGreeting}
                        onChange={(e) => setVoiceGreeting(e.target.value)}
                        rows={3}
                        className="mt-1"
                        placeholder="Thank you for calling [Business Name]. How may I help you today?"
                        data-testid="input-voice-greeting"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-duration">Max Call Duration</Label>
                      <Select value={maxCallDuration} onValueChange={setMaxCallDuration}>
                        <SelectTrigger className="mt-1" data-testid="select-max-duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 minutes</SelectItem>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="10">10 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="voicemail">Enable Voicemail</Label>
                        <p className="text-sm text-muted-foreground">Allow callers to leave messages</p>
                      </div>
                      <Switch
                        id="voicemail"
                        checked={enableVoicemail}
                        onCheckedChange={setEnableVoicemail}
                        data-testid="switch-voicemail"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Twilio Connection
                    </CardTitle>
                    <CardDescription>
                      Connect your Twilio account to enable voice calls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {twilioConnected ? (
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
                          <Check className="w-5 h-5" />
                          Twilio Connected
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your phone number: +1 (555) 123-4567
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium">
                            <AlertCircle className="w-5 h-5" />
                            Twilio Not Connected
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Connect your Twilio account to enable voice calls
                          </p>
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={() => navigate(`/${workspaceId}/settings/twilio-voice`)}
                          data-testid="button-connect-twilio"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Connect Twilio Account
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Test Call Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Phone className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">AI Voice Assistant</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          "{voiceGreeting}"
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" disabled={!twilioConnected}>
                          <PhoneCall className="w-4 h-4 mr-2" />
                          Test Call
                        </Button>
                        <Button variant="outline" size="icon" disabled={!twilioConnected}>
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Setup</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <p><span className="font-medium">Step 1:</span> Knowledge base trained ({trainedCount} items)</p>
                    </div>
                    <div className="flex gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${twilioConnected ? 'bg-green-500/10' : 'bg-muted'}`}>
                        {twilioConnected ? <Check className="w-3 h-3 text-green-600" /> : <span className="text-xs text-muted-foreground">2</span>}
                      </div>
                      <p><span className="font-medium">Step 2:</span> Connect Twilio account</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-muted-foreground">3</span>
                      </div>
                      <p><span className="font-medium">Step 3:</span> Configure voice settings</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-muted-foreground">4</span>
                      </div>
                      <p><span className="font-medium">Step 4:</span> Test and go live</p>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full" onClick={() => saveTwilioMutation.mutate()} disabled={saveTwilioMutation.isPending} data-testid="button-save-twilio">
                  <Check className="w-4 h-4 mr-2" />
                  Save Voice Settings
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sms" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-700 dark:text-green-400">Knowledge Base Ready</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {trainedCount} trained items from your knowledge base. SMS uses the same Twilio credentials as voice.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      SMS Confirmation Settings
                    </CardTitle>
                    <CardDescription>
                      Auto-send confirmation texts when clients complete appointments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-enabled">Enable SMS Confirmations</Label>
                        <p className="text-sm text-muted-foreground">Automatically text clients after scheduling</p>
                      </div>
                      <Switch
                        id="sms-enabled"
                        checked={smsEnabled}
                        onCheckedChange={setSmsEnabled}
                        data-testid="switch-sms-enabled"
                      />
                    </div>

                    <div className="pt-2">
                      <Label htmlFor="sms-template">Message Template</Label>
                      <Textarea
                        id="sms-template"
                        value={smsTemplate}
                        onChange={(e) => setSmsTemplate(e.target.value)}
                        rows={4}
                        className="mt-1 font-mono text-sm"
                        placeholder="Hi {client_name}! Your appointment is confirmed..."
                        data-testid="input-sms-template"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Available placeholders: {"{client_name}"}, {"{workspace_name}"}, {"{date}"}, {"{time}"}, {"{confirmation_code}"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5" />
                      Twilio Connection
                    </CardTitle>
                    <CardDescription>
                      SMS uses the same Twilio credentials as voice calls
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {twilioConnected ? (
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
                          <Check className="w-5 h-5" />
                          Twilio Connected
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          SMS will be sent from: +1 (555) 123-4567
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-medium">
                            <AlertCircle className="w-5 h-5" />
                            Twilio Not Connected
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Connect your Twilio account to enable SMS confirmations
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/${workspaceId}/settings/twilio-sms`)}
                          data-testid="button-connect-twilio-sms"
                        >
                          Connect Twilio Account
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Message Preview
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center cursor-help" data-testid="button-sms-info">
                            <span className="text-xs text-muted-foreground">?</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[250px]">
                          <p className="text-sm">When your client completes a confirmed appointment, indexFlow automatically sends the confirmation SMS so you don't have to.</p>
                        </TooltipContent>
                      </Tooltip>
                    </CardTitle>
                    <CardDescription>
                      Preview how your confirmation SMS will appear
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4" data-testid="sms-preview-container">
                      <div className="bg-card rounded-lg p-3 shadow-sm max-w-[280px]">
                        <p className="text-sm" data-testid="text-sms-preview">
                          {smsTemplate
                            .replace("{client_name}", "John")
                            .replace("{workspace_name}", "Your Business")
                            .replace("{date}", "Friday, Jan 15")
                            .replace("{time}", "7:30 PM")
                            .replace("{confirmation_code}", "APT-7X3K9")}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        Sample preview with placeholder data
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Test SMS
                    </CardTitle>
                    <CardDescription>
                      Send a test message to verify your setup
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="test-phone">Phone Number</Label>
                      <Input
                        id="test-phone"
                        type="tel"
                        value={testPhoneNumber}
                        onChange={(e) => setTestPhoneNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="mt-1"
                        data-testid="input-test-phone"
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      disabled={!twilioConnected}
                      data-testid="button-send-test-sms"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Test SMS
                    </Button>
                    {!twilioConnected && (
                      <p className="text-xs text-muted-foreground text-center">
                        Connect Twilio to send test messages
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Button className="w-full" disabled={!twilioConnected} data-testid="button-save-sms">
                  <Check className="w-4 h-4 mr-2" />
                  Save SMS Settings
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
