import { MessageSquare, Settings, Code, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin-layout";

const widgets = [
  { id: 1, client: "Acme Digital", type: "Full Widget", status: "Active", voiceEnabled: true, interactions: 234, voiceInteractions: 56, lastConfig: "Jan 25, 2026" },
  { id: 2, client: "Dragon Media", type: "Chat Only", status: "Active", voiceEnabled: true, interactions: 156, voiceInteractions: 31, lastConfig: "Jan 22, 2026" },
  { id: 3, client: "Coastal SEO", type: "Full Widget", status: "Pending", voiceEnabled: false, interactions: 0, voiceInteractions: 0, lastConfig: "Jan 27, 2026" },
  { id: 4, client: "Metro Creative", type: "Chat Only", status: "Active", voiceEnabled: true, interactions: 89, voiceInteractions: 18, lastConfig: "Jan 18, 2026" },
  { id: 5, client: "Summit Marketing", type: "Full Widget", status: "Active", voiceEnabled: true, interactions: 312, voiceInteractions: 74, lastConfig: "Jan 20, 2026" },
];

export default function AdminWidgets() {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-admin-widgets-title">Widget Configuration</h1>
          <p className="text-muted-foreground">Manage AI widgets with voice and chat capabilities for all clients</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Widgets</CardTitle>
          <CardDescription>Configure and monitor client AI widgets including voice interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium text-muted-foreground">Client</th>
                  <th className="pb-3 font-medium text-muted-foreground">Widget Type</th>
                  <th className="pb-3 font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 font-medium text-muted-foreground">Voice</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Chat</th>
                  <th className="pb-3 font-medium text-muted-foreground text-right">Voice</th>
                  <th className="pb-3 font-medium text-muted-foreground">Last Config</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {widgets.map((widget) => (
                  <tr key={widget.id} className="border-b last:border-0" data-testid={`row-widget-${widget.id}`}>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{widget.client}</span>
                      </div>
                    </td>
                    <td className="py-4 text-muted-foreground">{widget.type}</td>
                    <td className="py-4">
                      <Badge variant={widget.status === "Active" ? "default" : "secondary"}>
                        {widget.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      {widget.voiceEnabled ? (
                        <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-500/30 text-xs" data-testid={`badge-voice-${widget.id}`}>
                          <Volume2 className="w-3 h-3 mr-1" />
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-xs" data-testid={`badge-voice-${widget.id}`}>
                          <VolumeX className="w-3 h-3 mr-1" />
                          Off
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 text-right">{widget.interactions}</td>
                    <td className="py-4 text-right">{widget.voiceInteractions}</td>
                    <td className="py-4 text-muted-foreground">{widget.lastConfig}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" data-testid={`button-config-${widget.id}`}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-code-${widget.id}`}>
                          <Code className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
