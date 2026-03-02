import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Search, Plus, X, Loader2, AlertTriangle, Check } from "lucide-react";
import type { ResolvedLocation } from "./RadiusMode";

interface ManualModeProps {
  locations: ResolvedLocation[];
  onLocationsChange: (locations: ResolvedLocation[]) => void;
}

interface ResolvedPreview {
  id: string;
  name: string;
  lat: number;
  lng: number;
  town: string | null;
  county: string | null;
  state: string | null;
  country: string | null;
  formattedAddress: string | null;
  neighbours: Array<{ id: string; name: string; distanceMiles: number }>;
}

export default function ManualMode({ locations, onLocationsChange }: ManualModeProps) {
  const [input, setInput] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ResolvedPreview | null>(null);

  const handleSearch = useCallback(async () => {
    if (!input.trim()) return;
    setIsResolving(true);
    setError(null);
    setPreview(null);

    try {
      const res = await apiRequest("POST", "/api/pseo/locations/resolve-manual", {
        input: input.trim(),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      if (!data.resolved) {
        setError("Could not resolve this location. Try a more specific address or postcode.");
        return;
      }

      setPreview({
        id: `manual-${Date.now()}`,
        name: data.town || data.formattedAddress || input.trim(),
        lat: data.lat,
        lng: data.lng,
        town: data.town,
        county: data.county,
        state: data.state,
        country: data.country,
        formattedAddress: data.formattedAddress,
        neighbours: data.neighbours || [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to resolve location");
    } finally {
      setIsResolving(false);
    }
  }, [input]);

  const addLocation = useCallback((loc: ResolvedPreview) => {
    const exists = locations.some(
      (l) => Math.abs(l.lat - loc.lat) < 0.001 && Math.abs(l.lng - loc.lng) < 0.001
    );
    if (exists) {
      setError("This location is already in the list");
      return;
    }

    const newLoc: ResolvedLocation = {
      id: loc.id,
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      town: loc.town,
      county: loc.county,
      state: loc.state,
      country: loc.country,
      excluded: false,
    };

    onLocationsChange([...locations, newLoc]);
    setPreview(null);
    setInput("");
    setError(null);
  }, [locations, onLocationsChange]);

  const addNeighbour = useCallback((neighbour: { id: string; name: string }) => {
    setInput(neighbour.name);
    setPreview(null);
  }, []);

  const removeLocation = useCallback((id: string) => {
    onLocationsChange(locations.filter((l) => l.id !== id));
  }, [locations, onLocationsChange]);

  const activeCount = locations.filter((l) => !l.excluded).length;

  return (
    <div className="space-y-4" data-testid="manual-mode">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a town, city, or postcode"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
            data-testid="input-manual-location"
          />
        </div>
        <Button onClick={handleSearch} disabled={!input.trim() || isResolving} data-testid="button-search-location">
          {isResolving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive" data-testid="manual-error">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      {preview && (
        <Card className="border-primary/50" data-testid="card-preview">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium" data-testid="text-preview-name">{preview.name}</p>
                <p className="text-sm text-muted-foreground">{preview.formattedAddress}</p>
                <div className="flex gap-2 mt-1">
                  {preview.town && <Badge variant="outline" className="text-xs">{preview.town}</Badge>}
                  {preview.county && <Badge variant="outline" className="text-xs">{preview.county}</Badge>}
                  {preview.state && <Badge variant="outline" className="text-xs">{preview.state}</Badge>}
                  {preview.country && <Badge variant="outline" className="text-xs">{preview.country}</Badge>}
                </div>
              </div>
              <Button size="sm" onClick={() => addLocation(preview)} data-testid="button-add-location">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {preview.neighbours.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-2">Nearby suggestions</p>
                <div className="flex flex-wrap gap-1.5" data-testid="list-neighbours">
                  {preview.neighbours.slice(0, 8).map((n) => (
                    <Badge
                      key={n.id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => addNeighbour(n)}
                      data-testid={`badge-neighbour-${n.id}`}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {n.name}
                      <span className="ml-1 text-muted-foreground">{n.distanceMiles}mi</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {locations.length > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Added Locations</span>
              <Badge variant="secondary" data-testid="badge-manual-location-count">
                {activeCount} active
              </Badge>
            </div>
            <div className="space-y-1 max-h-64 overflow-y-auto" data-testid="list-manual-locations">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className={`flex items-center justify-between p-2 rounded text-sm transition-colors ${
                    loc.excluded ? "opacity-50 bg-muted/30" : "bg-card hover:bg-accent/30"
                  }`}
                  data-testid={`location-row-${loc.id}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className={`h-3.5 w-3.5 shrink-0 ${loc.excluded ? "text-muted-foreground" : "text-primary"}`} />
                    <span className={`truncate ${loc.excluded ? "line-through text-muted-foreground" : ""}`}>
                      {loc.name}
                    </span>
                    {loc.state && (
                      <span className="text-xs text-muted-foreground shrink-0">{loc.state}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLocation(loc.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      data-testid={`button-remove-${loc.id}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
