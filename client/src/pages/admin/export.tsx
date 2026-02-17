import { useVenue } from "@/lib/venue-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const exportCategories = [
  "Venues",
  "Users",
  "Reservations",
  "Call Logs",
  "Blog Posts",
  "Domains",
  "Contact Messages",
  "Support Tickets",
  "Resources",
  "Team Members",
  "Business Hours",
  "Closures",
  "Room Types",
  "Rooms",
  "Room Bookings",
];

export default function AdminExport() {
  useVenue();
  const { toast } = useToast();

  const handleExport = (category: string) => {
    toast({
      title: "Export Started",
      description: `Preparing ${category} export...`,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6" />
        <h1 className="text-2xl font-semibold" data-testid="page-title-export">
          Export Data
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportCategories.map((category) => (
          <Card key={category} data-testid={`card-export-${category.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => handleExport(category)}
                data-testid={`button-export-${category.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
