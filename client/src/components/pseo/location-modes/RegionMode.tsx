import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Map, Loader2, AlertTriangle } from "lucide-react";
import type { ResolvedLocation } from "./RadiusMode";

interface GeoZone {
  name: string;
  states: string[];
}

interface GeoMarket {
  country: string;
  code: string;
  zones: GeoZone[];
}

interface RegionModeProps {
  locations: ResolvedLocation[];
  onLocationsChange: (locations: ResolvedLocation[]) => void;
}

export default function RegionMode({ locations, onLocationsChange }: RegionModeProps) {
  const [markets, setMarkets] = useState<GeoMarket[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedZones, setSelectedZones] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarkets() {
      try {
        const res = await apiRequest("GET", "/api/pseo/locations/markets");
        const data = await res.json();
        setMarkets(data.markets || []);
      } catch {
        setMarkets([]);
      } finally {
        setIsLoadingMarkets(false);
      }
    }
    fetchMarkets();
  }, []);

  const currentMarket = markets.find((m) => m.code === selectedCountry);

  const handleZoneToggle = useCallback((zoneName: string, checked: boolean) => {
    setSelectedZones((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(zoneName);
      } else {
        next.delete(zoneName);
      }
      return next;
    });
  }, []);

  const handleResolve = useCallback(async () => {
    if (!selectedCountry || selectedZones.size === 0) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await apiRequest("POST", "/api/pseo/locations/resolve-region", {
        countryCode: selectedCountry,
        zones: Array.from(selectedZones),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      const resolved: ResolvedLocation[] = (data.locations || []).map((loc: any, i: number) => ({
        id: loc.id || `region-${i}`,
        name: loc.name,
        lat: loc.latitude,
        lng: loc.longitude,
        town: loc.name,
        county: null,
        state: null,
        country: currentMarket?.country || null,
        excluded: false,
      }));

      onLocationsChange(resolved);
    } catch (err: any) {
      setError(err.message || "Failed to resolve region locations");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCountry, selectedZones, onLocationsChange, currentMarket]);

  const activeCount = locations.filter((l) => !l.excluded).length;

  return (
    <div className="space-y-4" data-testid="region-mode">
      <div className="flex gap-2">
        <Select
          value={selectedCountry}
          onValueChange={(v) => {
            setSelectedCountry(v);
            setSelectedZones(new Set());
            onLocationsChange([]);
          }}
          disabled={isLoadingMarkets}
        >
          <SelectTrigger className="w-full" data-testid="select-country">
            <SelectValue placeholder={isLoadingMarkets ? "Loading countries..." : "Select country"} />
          </SelectTrigger>
          <SelectContent>
            {markets.map((market) => (
              <SelectItem key={market.code} value={market.code}>
                {market.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currentMarket && (
        <>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Zones in {currentMarket.country}</span>
                </div>
                <Badge variant="secondary" data-testid="badge-zone-count">
                  {selectedZones.size} selected
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" data-testid="list-zones">
                {currentMarket.zones.map((zone) => (
                  <label
                    key={zone.name}
                    className="flex items-start gap-2 p-2 rounded border hover:bg-accent/30 cursor-pointer transition-colors"
                    data-testid={`zone-${zone.name}`}
                  >
                    <Checkbox
                      checked={selectedZones.has(zone.name)}
                      onCheckedChange={(checked) => handleZoneToggle(zone.name, !!checked)}
                      data-testid={`checkbox-zone-${zone.name}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{zone.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {zone.states.slice(0, 4).join(", ")}
                        {zone.states.length > 4 && ` +${zone.states.length - 4} more`}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <Button
                onClick={handleResolve}
                disabled={selectedZones.size === 0 || isLoading}
                className="w-full mt-3"
                data-testid="button-resolve-region"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resolving...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Resolve {selectedZones.size} Zone{selectedZones.size !== 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive" data-testid="region-error">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          {locations.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Resolved Locations</span>
                  <Badge variant="secondary" data-testid="badge-region-location-count">
                    {activeCount} active
                  </Badge>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto" data-testid="list-region-locations">
                  {locations.map((loc) => (
                    <div
                      key={loc.id}
                      className={`flex items-center justify-between p-2 rounded text-sm transition-colors ${
                        loc.excluded ? "opacity-50 bg-muted/30" : "bg-card hover:bg-accent/30"
                      }`}
                      data-testid={`location-row-${loc.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`h-3.5 w-3.5 ${loc.excluded ? "text-muted-foreground" : "text-primary"}`} />
                        <span className={loc.excluded ? "line-through text-muted-foreground" : ""}>{loc.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onLocationsChange(
                            locations.map((l) => l.id === loc.id ? { ...l, excluded: !l.excluded } : l)
                          );
                        }}
                        className="h-7 px-2 text-xs"
                        data-testid={`button-toggle-${loc.id}`}
                      >
                        {loc.excluded ? "Include" : "Exclude"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
