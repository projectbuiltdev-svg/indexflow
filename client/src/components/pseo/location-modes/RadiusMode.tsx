import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Search, Loader2, AlertTriangle } from "lucide-react";

export interface ResolvedLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  town: string | null;
  county: string | null;
  state: string | null;
  country: string | null;
  excluded: boolean;
}

interface RadiusModeProps {
  locations: ResolvedLocation[];
  onLocationsChange: (locations: ResolvedLocation[]) => void;
}

const RADIUS_OPTIONS = [
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
  { value: "50", label: "50 miles" },
  { value: "100", label: "100 miles" },
];

export default function RadiusMode({ locations, onLocationsChange }: RadiusModeProps) {
  const [address, setAddress] = useState("");
  const [radius, setRadius] = useState("25");
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [centrePoint, setCentrePoint] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const handleResolve = useCallback(async () => {
    if (!address.trim()) return;
    setIsResolving(true);
    setError(null);

    try {
      const res = await apiRequest("POST", "/api/pseo/locations/resolve-radius", {
        address: address.trim(),
        radiusMiles: parseInt(radius),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setCentrePoint({
        lat: data.centre.lat,
        lng: data.centre.lng,
        address: data.centre.formattedAddress || address,
      });

      const resolved: ResolvedLocation[] = (data.locations || []).map((loc: any, i: number) => ({
        id: loc.id || `radius-${i}`,
        name: loc.name,
        lat: loc.latitude,
        lng: loc.longitude,
        town: loc.name,
        county: null,
        state: null,
        country: null,
        excluded: false,
      }));

      onLocationsChange(resolved);
    } catch (err: any) {
      setError(err.message || "Failed to resolve locations");
    } finally {
      setIsResolving(false);
    }
  }, [address, radius, onLocationsChange]);

  const handleRadiusChange = useCallback(async (newRadius: string) => {
    setRadius(newRadius);
    if (centrePoint) {
      setIsResolving(true);
      setError(null);
      try {
        const res = await apiRequest("POST", "/api/pseo/locations/resolve-radius", {
          address: centrePoint.address,
          radiusMiles: parseInt(newRadius),
          lat: centrePoint.lat,
          lng: centrePoint.lng,
        });
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          return;
        }

        const resolved: ResolvedLocation[] = (data.locations || []).map((loc: any, i: number) => ({
          id: loc.id || `radius-${i}`,
          name: loc.name,
          lat: loc.latitude,
          lng: loc.longitude,
          town: loc.name,
          county: null,
          state: null,
          country: null,
          excluded: false,
        }));

        onLocationsChange(resolved);
      } catch (err: any) {
        setError(err.message || "Failed to resolve locations");
      } finally {
        setIsResolving(false);
      }
    }
  }, [centrePoint, onLocationsChange]);

  const activeCount = locations.filter((l) => !l.excluded).length;

  return (
    <div className="space-y-4" data-testid="radius-mode">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter address, postcode, or city name"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && handleResolve()}
            data-testid="input-radius-address"
          />
        </div>
        <Select value={radius} onValueChange={handleRadiusChange}>
          <SelectTrigger className="w-[140px]" data-testid="select-radius">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RADIUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleResolve} disabled={!address.trim() || isResolving} data-testid="button-resolve-radius">
          {isResolving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive" data-testid="radius-error">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      {centrePoint && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium" data-testid="text-centre-address">{centrePoint.address}</p>
                  <p className="text-xs text-muted-foreground">
                    {centrePoint.lat.toFixed(4)}, {centrePoint.lng.toFixed(4)} — {radius} mile radius
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" data-testid="badge-location-count">
                  {activeCount} location{activeCount !== 1 ? "s" : ""}
                </Badge>
              </div>
            </div>

            <div className="mt-4 w-full h-48 rounded-md bg-muted border flex items-center justify-center" data-testid="map-placeholder">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Map preview — {centrePoint.lat.toFixed(2)}°, {centrePoint.lng.toFixed(2)}°</p>
                <p className="text-xs">{radius} mile radius — {locations.length} locations found</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {locations.length > 0 && (
        <div className="space-y-1 max-h-64 overflow-y-auto" data-testid="list-radius-locations">
          {locations.map((loc) => (
            <LocationRow key={loc.id} location={loc} onToggle={() => {
              onLocationsChange(
                locations.map((l) => l.id === loc.id ? { ...l, excluded: !l.excluded } : l)
              );
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

function LocationRow({ location, onToggle }: { location: ResolvedLocation; onToggle: () => void }) {
  return (
    <div
      className={`flex items-center justify-between p-2 rounded text-sm transition-colors ${
        location.excluded ? "opacity-50 bg-muted/30" : "bg-card hover:bg-accent/30"
      }`}
      data-testid={`location-row-${location.id}`}
    >
      <div className="flex items-center gap-2">
        <MapPin className={`h-3.5 w-3.5 ${location.excluded ? "text-muted-foreground" : "text-primary"}`} />
        <span className={location.excluded ? "line-through text-muted-foreground" : ""}>{location.name}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="h-7 px-2 text-xs"
        data-testid={`button-toggle-${location.id}`}
      >
        {location.excluded ? "Include" : "Exclude"}
      </Button>
    </div>
  );
}
