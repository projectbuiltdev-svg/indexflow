import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, Layers, LayoutGrid } from "lucide-react";

export interface PageCountBreakdown {
  services: number;
  locations: number;
  servicePages: number;
  locationPages: number;
  hubPages: number;
  totalPages: number;
}

export function calculatePageCount(services: number, locations: number): PageCountBreakdown {
  const servicePages = services * locations;
  const locationPages = locations;
  const hubPages = services > 0 ? services + 1 : 0;
  const totalPages = servicePages + locationPages + hubPages;
  return { services, locations, servicePages, locationPages, hubPages, totalPages };
}

interface PageCountCalculatorProps {
  services: number;
  locations: number;
}

export default function PageCountCalculator({ services, locations }: PageCountCalculatorProps) {
  const breakdown = calculatePageCount(services, locations);

  return (
    <Card data-testid="page-count-calculator">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Estimated Pages</span>
          <Badge variant="default" className="text-lg px-3 py-1" data-testid="text-total-pages">
            {breakdown.totalPages.toLocaleString()}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1" data-testid="text-service-pages">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="text-xs">Service×Location</span>
            </div>
            <p className="text-lg font-semibold">{breakdown.servicePages.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">
              {breakdown.services} × {breakdown.locations}
            </p>
          </div>

          <div className="space-y-1" data-testid="text-location-pages">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-xs">Location</span>
            </div>
            <p className="text-lg font-semibold">{breakdown.locationPages.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">{breakdown.locations} areas</p>
          </div>

          <div className="space-y-1" data-testid="text-hub-pages">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
              <Layers className="h-3.5 w-3.5" />
              <span className="text-xs">Hub</span>
            </div>
            <p className="text-lg font-semibold">{breakdown.hubPages.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">
              {breakdown.services > 0 ? `${breakdown.services} + 1 index` : "—"}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <p className="text-[10px] text-muted-foreground text-center flex items-center justify-center gap-1">
            <FileText className="h-3 w-3" />
            Formula: (services × locations) + locations + services + 1
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
