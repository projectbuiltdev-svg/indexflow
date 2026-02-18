import { useEffect, useState } from "react";
import { Code, Copy, Check, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useLocation } from "wouter";
import { SiWordpress, SiWix, SiShopify, SiSquarespace, SiWebflow, SiDrupal, SiJoomla, SiMagento, SiBigcommerce, SiGhost } from "react-icons/si";

type CmsPlatform = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  embedType: "script" | "iframe";
  instructions: string[];
};

const cmsOptions: CmsPlatform[] = [
  {
    id: "wordpress",
    name: "WordPress",
    icon: SiWordpress,
    embedType: "script",
    instructions: [
      "Go to your WordPress dashboard",
      "Edit the page where you want the widget",
      "Add a \"Custom HTML\" block",
      "Paste the embed code below",
      "Save and publish your page"
    ]
  },
  {
    id: "wix",
    name: "Wix",
    icon: SiWix,
    embedType: "iframe",
    instructions: [
      "Open your Wix Editor",
      "Click \"Add\" (+) in the left menu",
      "Select \"Embed Code\" → \"Embed HTML\"",
      "Paste the embed code below",
      "Resize and position the widget",
      "Publish your site"
    ]
  },
  {
    id: "squarespace",
    name: "Squarespace",
    icon: SiSquarespace,
    embedType: "script",
    instructions: [
      "Edit your Squarespace page",
      "Click \"Add Block\" where you want the widget",
      "Select \"Code\" block",
      "Paste the embed code below",
      "Save and publish"
    ]
  },
  {
    id: "webflow",
    name: "Webflow",
    icon: SiWebflow,
    embedType: "script",
    instructions: [
      "Open your Webflow Designer",
      "Drag an \"Embed\" element to your page",
      "Paste the embed code below",
      "Publish your site"
    ]
  },
  {
    id: "shopify",
    name: "Shopify",
    icon: SiShopify,
    embedType: "script",
    instructions: [
      "Go to Online Store → Themes",
      "Click \"Customize\" on your theme",
      "Add a \"Custom Liquid\" section",
      "Paste the embed code below",
      "Save your changes"
    ]
  },
  {
    id: "ghost",
    name: "Ghost",
    icon: SiGhost,
    embedType: "script",
    instructions: [
      "Edit your Ghost page or post",
      "Add an HTML card (type /html)",
      "Paste the embed code below",
      "Publish your content"
    ]
  },
  {
    id: "drupal",
    name: "Drupal",
    icon: SiDrupal,
    embedType: "script",
    instructions: [
      "Go to Structure → Block Layout",
      "Add a \"Custom block\" where you want the widget",
      "Select \"Full HTML\" text format",
      "Paste the embed code below",
      "Save the block"
    ]
  },
  {
    id: "joomla",
    name: "Joomla",
    icon: SiJoomla,
    embedType: "script",
    instructions: [
      "Go to Extensions → Modules",
      "Create a new \"Custom\" module",
      "Paste the embed code below",
      "Assign it to your page position",
      "Save and publish"
    ]
  },
  {
    id: "magento",
    name: "Magento",
    icon: SiMagento,
    embedType: "script",
    instructions: [
      "Go to Content → Blocks",
      "Create a new CMS block",
      "Paste the embed code below",
      "Add the block to your page layout",
      "Clear cache and refresh"
    ]
  },
  {
    id: "bigcommerce",
    name: "BigCommerce",
    icon: SiBigcommerce,
    embedType: "script",
    instructions: [
      "Go to Storefront → Script Manager",
      "Create a new script",
      "Set location to \"Footer\"",
      "Paste the embed code below",
      "Save your script"
    ]
  }
];

export default function SettingsWidgetCode() {
  const [location] = useLocation();
  const [copied, setCopied] = useState(false);
  const [selectedCms, setSelectedCms] = useState<string>("wordpress");
  const { toast } = useToast();
  
  const workspaceId = location.split("/")[1];

  useEffect(() => {
    document.title = "Widget Code - Dashboard";
  }, []);

  const currentCms = cmsOptions.find(cms => cms.id === selectedCms) || cmsOptions[0];

  const scriptCode = `<!-- indexFlow Widget -->
<script src="https://indexflow.io/widget.js" data-venue-id="${workspaceId}"></script>
<div id="indexflow-widget"></div>`;

  const iframeCode = `<!-- indexFlow Widget -->
<iframe 
  src="https://indexflow.io/widget/${workspaceId}" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: none; border-radius: 8px;"
  title="Book a Table"
></iframe>`;

  const embedCode = currentCms.embedType === "script" ? scriptCode : iframeCode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${currentCms.name} embed code copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please select and copy the code manually",
        variant: "destructive",
      });
    }
  };

  const CmsIcon = currentCms.icon;

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2" data-testid="text-widget-code-title">
            <Code className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            Widget Code
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add the AI widget to your existing website
          </p>
        </div>

        <div className="max-w-3xl space-y-4 sm:space-y-6">
          <Card data-testid="card-cms-select">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Select Your Website Platform</CardTitle>
              <CardDescription className="text-sm">
                Choose your CMS for the right embed code and instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <Select value={selectedCms} onValueChange={setSelectedCms}>
                <SelectTrigger className="w-full sm:w-[300px]" data-testid="select-cms-platform">
                  <SelectValue placeholder="Select your platform" />
                </SelectTrigger>
                <SelectContent>
                  {cmsOptions.map((cms) => {
                    const Icon = cms.icon;
                    return (
                      <SelectItem key={cms.id} value={cms.id} data-testid={`option-cms-${cms.id}`}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{cms.name}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card data-testid="card-widget-code">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <CmsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <CardTitle className="text-base sm:text-lg">{currentCms.name} Embed Code</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary">
                      {currentCms.embedType === "script" ? "Script" : "iFrame"}
                    </Badge>
                    <span className="text-xs">Optimized for {currentCms.name}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
              <div className="relative">
                <pre className="bg-muted p-3 sm:p-4 pr-16 sm:pr-20 rounded-md overflow-x-auto text-xs sm:text-sm font-mono break-all whitespace-pre-wrap" data-testid="code-embed">
                  {embedCode}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={handleCopy}
                  data-testid="button-copy-code"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-instructions">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CmsIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                {currentCms.name} Installation Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <ol className="list-decimal list-inside space-y-2 sm:space-y-3 text-sm text-muted-foreground">
                {currentCms.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
              <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 p-3 bg-muted rounded-md">
                The widget will automatically display your workspace's availability based on your 
                business hours, table settings, and closure dates.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-widget-customization">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Customization Options</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
              <p className="text-sm text-muted-foreground">
                Customize the widget appearance with these options:
              </p>
              {currentCms.embedType === "script" ? (
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex flex-col gap-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs break-all w-fit">data-theme="dark"</code>
                    <span className="text-xs">Use dark theme</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs break-all w-fit">data-primary-color="#hexcode"</code>
                    <span className="text-xs">Custom primary color</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs break-all w-fit">data-button-text="Book Now"</code>
                    <span className="text-xs">Custom button text</span>
                  </li>
                </ul>
              ) : (
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex flex-col gap-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs break-all w-fit">?theme=dark</code>
                    <span className="text-xs">Add to URL for dark theme</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs break-all w-fit">?color=hexcode</code>
                    <span className="text-xs">Add to URL for custom color</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <code className="bg-muted px-2 py-1 rounded text-xs break-all w-fit">height="500"</code>
                    <span className="text-xs">Adjust widget height</span>
                  </li>
                </ul>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-need-help">
            <CardContent className="p-4 sm:pt-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">Need Help?</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Having trouble? Contact us at{" "}
                    <span className="text-primary break-all">support@indexflow.io</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
