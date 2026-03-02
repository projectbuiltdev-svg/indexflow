import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Check, AlertTriangle } from "lucide-react";
import RadiusMode from "../location-modes/RadiusMode";
import RegionMode from "../location-modes/RegionMode";
import ManualMode from "../location-modes/ManualMode";
import PageCountCalculator from "../PageCountCalculator";
import type { ResolvedLocation } from "../location-modes/RadiusMode";

export interface LocationsData {
  mode: "radius" | "region" | "manual";
  locations: ResolvedLocation[];
  activeCount: number;
}

interface LocationSetupStepProps {
  onComplete: (data: LocationsData) => void;
  initialData?: LocationsData | null;
  serviceCount: number;
}

export default function LocationSetupStep({ onComplete, initialData, serviceCount }: LocationSetupStepProps) {
  const [mode, setMode] = useState<"radius" | "region" | "manual">(initialData?.mode || "radius");
  const [radiusLocations, setRadiusLocations] = useState<ResolvedLocation[]>(
    initialData?.mode === "radius" ? initialData.locations : []
  );
  const [regionLocations, setRegionLocations] = useState<ResolvedLocation[]>(
    initialData?.mode === "region" ? initialData.locations : []
  );
  const [manualLocations, setManualLocations] = useState<ResolvedLocation[]>(
    initialData?.mode === "manual" ? initialData.locations : []
  );

  const getCurrentLocations = (): ResolvedLocation[] => {
    switch (mode) {
      case "radius": return radiusLocations;
      case "region": return regionLocations;
      case "manual": return manualLocations;
    }
  };

  const currentLocations = getCurrentLocations();
  const activeLocations = currentLocations.filter((l) => !l.excluded);
  const canConfirm = activeLocations.length > 0;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onComplete({
      mode,
      locations: currentLocations,
      activeCount: activeLocations.length,
    });
  };

  return (
    <div className="space-y-6" data-testid="location-setup-step">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Setup
              </CardTitle>
              <CardDescription>
                Choose how to select target locations for your pSEO campaign. You can search by radius, select regions, or add locations manually.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="radius" data-testid="tab-radius">
                    Radius
                  </TabsTrigger>
                  <TabsTrigger value="region" data-testid="tab-region">
                    Region
                  </TabsTrigger>
                  <TabsTrigger value="manual" data-testid="tab-manual">
                    Manual
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="radius" className="mt-4">
                  <RadiusMode locations={radiusLocations} onLocationsChange={setRadiusLocations} />
                </TabsContent>

                <TabsContent value="region" className="mt-4">
                  <RegionMode locations={regionLocations} onLocationsChange={setRegionLocations} />
                </TabsContent>

                <TabsContent value="manual" className="mt-4">
                  <ManualMode locations={manualLocations} onLocationsChange={setManualLocations} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <PageCountCalculator services={serviceCount} locations={activeLocations.length} />

          {!canConfirm && currentLocations.length === 0 && (
            <Card className="border-muted">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Search for or select locations to see page count estimates. At least one location is required to continue.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {currentLocations.length > 0 && !canConfirm && (
            <Card className="border-yellow-500 dark:border-yellow-600">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    All locations are excluded. Include at least one location to continue.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleConfirm}
          disabled={!canConfirm}
          data-testid="button-confirm-locations"
        >
          <Check className="h-4 w-4 mr-2" />
          Confirm Locations ({activeLocations.length})
        </Button>
      </div>
    </div>
  );
}
