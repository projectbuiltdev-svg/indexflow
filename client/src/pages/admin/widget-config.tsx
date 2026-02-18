import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Settings, Code } from "lucide-react";

const widgets = [
  { id: 1, client: "Bella Cucina", type: "Chat + Voice", status: "Active", voice: true, chat: true, voiceLastConfig: "Feb 14, 2026" },
  { id: 2, client: "Grand Meridian Hotel", type: "Chat + Voice", status: "Active", voice: true, chat: true, voiceLastConfig: "Feb 12, 2026" },
  { id: 3, client: "Sakura Dining", type: "Chat Only", status: "Active", voice: false, chat: true, voiceLastConfig: "-" },
  { id: 4, client: "Coastal Breeze Cafe", type: "Chat + Voice", status: "Pending", voice: true, chat: true, voiceLastConfig: "Feb 10, 2026" },
  { id: 5, client: "The Blue Lagoon", type: "Chat Only", status: "Active", voice: false, chat: true, voiceLastConfig: "-" },
  { id: 6, client: "Metro Bistro", type: "Chat + Voice", status: "Active", voice: true, chat: true, voiceLastConfig: "Feb 8, 2026" },
];

export default function AdminWidgetConfig() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif italic font-semibold" data-testid="page-title-widget-config">Widget Configuration</h1>
          <p className="text-sm text-muted-foreground" data-testid="text-page-subtitle">Manage AI widgets with voice and chat capabilities for all clients</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold" data-testid="text-section-active-widgets">Active Widgets</h2>
          <p className="text-sm text-muted-foreground">Configure and monitor client AI widgets including voice interactions</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Widget Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Voice</TableHead>
                  <TableHead>Chat</TableHead>
                  <TableHead>Voice Last Config</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {widgets.map((widget) => (
                  <TableRow key={widget.id} data-testid={`row-widget-${widget.id}`}>
                    <TableCell className="font-medium">{widget.client}</TableCell>
                    <TableCell className="text-muted-foreground">{widget.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={widget.status === "Active" ? "text-emerald-600 border-emerald-500/30" : "text-amber-500 border-amber-500/30"}
                        data-testid={`badge-status-${widget.id}`}
                      >
                        {widget.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${widget.voice ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                        <span className="text-sm">{widget.voice ? "Enabled" : "Off"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${widget.chat ? "bg-emerald-500" : "bg-muted-foreground/40"}`} />
                        <span className="text-sm">{widget.chat ? "Enabled" : "Off"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{widget.voiceLastConfig}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" data-testid={`button-settings-${widget.id}`}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-code-${widget.id}`}>
                          <Code className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
