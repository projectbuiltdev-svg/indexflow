import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, CheckSquare, Square } from "lucide-react";
import PageCountCalculator from "./PageCountCalculator";
import type { ResolvedLocation } from "./location-modes/RadiusMode";

export interface MatrixEntry {
  serviceIndex: number;
  locationId: string;
  active: boolean;
}

interface ServiceLocationMatrixProps {
  services: string[];
  locations: ResolvedLocation[];
  matrix: MatrixEntry[];
  onMatrixChange: (matrix: MatrixEntry[]) => void;
}

const PAGE_SIZE = 10;

export default function ServiceLocationMatrix({
  services,
  locations,
  matrix,
  onMatrixChange,
}: ServiceLocationMatrixProps) {
  const [page, setPage] = useState(0);
  const activeLocations = locations.filter((l) => !l.excluded);
  const usePagination = activeLocations.length > PAGE_SIZE;
  const totalPages = Math.ceil(activeLocations.length / PAGE_SIZE);
  const visibleLocations = usePagination
    ? activeLocations.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    : activeLocations;

  const isActive = (serviceIndex: number, locationId: string): boolean => {
    const entry = matrix.find((m) => m.serviceIndex === serviceIndex && m.locationId === locationId);
    return entry ? entry.active : true;
  };

  const toggleCell = (serviceIndex: number, locationId: string) => {
    const existing = matrix.find((m) => m.serviceIndex === serviceIndex && m.locationId === locationId);
    if (existing) {
      onMatrixChange(matrix.map((m) =>
        m.serviceIndex === serviceIndex && m.locationId === locationId
          ? { ...m, active: !m.active }
          : m
      ));
    } else {
      onMatrixChange([...matrix, { serviceIndex, locationId, active: false }]);
    }
  };

  const toggleRow = (serviceIndex: number, selectAll: boolean) => {
    const locationIds = new Set(activeLocations.map((l) => l.id));
    const updated = matrix.filter((m) => !(m.serviceIndex === serviceIndex && locationIds.has(m.locationId)));
    if (!selectAll) {
      activeLocations.forEach((loc) => {
        updated.push({ serviceIndex, locationId: loc.id, active: false });
      });
    }
    onMatrixChange(updated);
  };

  const toggleColumn = (locationId: string, selectAll: boolean) => {
    const updated = matrix.filter((m) => m.locationId !== locationId);
    if (!selectAll) {
      services.forEach((_, si) => {
        updated.push({ serviceIndex: si, locationId, active: false });
      });
    }
    onMatrixChange(updated);
  };

  const isRowAllActive = (serviceIndex: number): boolean => {
    return activeLocations.every((loc) => isActive(serviceIndex, loc.id));
  };

  const isColAllActive = (locationId: string): boolean => {
    return services.every((_, si) => isActive(si, locationId));
  };

  const activeCount = useMemo(() => {
    let count = 0;
    services.forEach((_, si) => {
      activeLocations.forEach((loc) => {
        if (isActive(si, loc.id)) count++;
      });
    });
    return count;
  }, [services, activeLocations, matrix]);

  if (services.length === 0 || activeLocations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center py-4" data-testid="text-matrix-empty">
            Add services and locations to see the page matrix.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="service-location-matrix">
      <PageCountCalculator services={services.length} locations={activeLocations.length} />

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Service × Location Matrix</CardTitle>
            <Badge variant="secondary" data-testid="badge-active-combos">
              {activeCount} / {services.length * activeLocations.length} active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <div className="min-w-max">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2 font-medium text-muted-foreground sticky left-0 bg-background z-10">
                      Service
                    </th>
                    {visibleLocations.map((loc) => (
                      <th key={loc.id} className="p-2 text-center min-w-[80px]">
                        <div className="space-y-1">
                          <p className="text-xs font-medium truncate max-w-[80px]" title={loc.name}>
                            {loc.name}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleColumn(loc.id, !isColAllActive(loc.id))}
                            className="h-6 w-6 p-0"
                            title={isColAllActive(loc.id) ? "Deselect all" : "Select all"}
                            data-testid={`button-col-toggle-${loc.id}`}
                          >
                            {isColAllActive(loc.id) ? (
                              <CheckSquare className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Square className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, si) => (
                    <tr key={si} className="border-t">
                      <td className="p-2 sticky left-0 bg-background z-10">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRow(si, !isRowAllActive(si))}
                            className="h-6 w-6 p-0 shrink-0"
                            title={isRowAllActive(si) ? "Deselect all" : "Select all"}
                            data-testid={`button-row-toggle-${si}`}
                          >
                            {isRowAllActive(si) ? (
                              <CheckSquare className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <Square className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </Button>
                          <span className="text-sm truncate max-w-[150px]" title={service}>
                            {service}
                          </span>
                        </div>
                      </td>
                      {visibleLocations.map((loc) => (
                        <td key={loc.id} className="p-2 text-center">
                          <Checkbox
                            checked={isActive(si, loc.id)}
                            onCheckedChange={() => toggleCell(si, loc.id)}
                            data-testid={`checkbox-${si}-${loc.id}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {usePagination && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                data-testid="button-matrix-prev"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-xs text-muted-foreground" data-testid="text-matrix-page">
                Page {page + 1} of {totalPages} ({activeLocations.length} locations)
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                data-testid="button-matrix-next"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
