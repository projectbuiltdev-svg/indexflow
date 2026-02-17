import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVenue } from "@/lib/venue-context";
import { useToast } from "@/hooks/use-toast";
import { Download, CalendarCheck, Phone, Clock, XCircle, Table2, Users, BedDouble, Building, Ticket, Globe, FileText } from "lucide-react";

const exportCategories = [
  { label: "Reservations", icon: CalendarCheck },
  { label: "Call Logs", icon: Phone },
  { label: "Business Hours", icon: Clock },
  { label: "Closures", icon: XCircle },
  { label: "Resources", icon: Table2 },
  { label: "Team Members", icon: Users },
  { label: "Room Types", icon: BedDouble },
  { label: "Rooms", icon: Building },
  { label: "Room Bookings", icon: BedDouble },
  { label: "Support Tickets", icon: Ticket },
  { label: "Website Changes", icon: Globe },
  { label: "Blog Posts", icon: FileText },
];

export default function DashboardExport() {
  const { selectedVenue } = useVenue();
  const { toast } = useToast();

  if (!selectedVenue?.id) {
    return <div className="p-6" data-testid="no-venue-message">Select a venue from the sidebar</div>;
  }

  const handleExport = (label: string) => {
    toast({ title: `Export ${label}`, description: "CSV export will be available soon." });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold" data-testid="page-title">Export Data</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportCategories.map((cat) => (
          <Card key={cat.label} data-testid={`export-card-${cat.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <cat.icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">{cat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => handleExport(cat.label)}
                data-testid={`button-export-${cat.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Download className="h-4 w-4 mr-2" />Export CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
