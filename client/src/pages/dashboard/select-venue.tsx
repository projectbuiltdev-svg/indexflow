import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Building2, ChevronRight, Loader2, Plus, MapPin, Search, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import indexFlowLogo from "@assets/image_1771351451425.png";

interface Venue {
  id: string;
  name: string;
  type: string;
  address: string | null;
  city: string | null;
  state: string | null;
  status: string;
}

const VENUES_PER_PAGE = 10;

export default function SelectVenue() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: venues = [], isLoading } = useQuery<Venue[]>({
    queryKey: ["/api/workspaces"],
  });

  useEffect(() => {
    document.title = "My Workspaces - indexFlow";
    const session = JSON.parse(localStorage.getItem("indexflow_session") || "{}");
    if (!session.email) {
      setLocation("/client-login");
      return;
    }
  }, [setLocation]);

  const filteredVenues = useMemo(() => {
    if (!searchQuery.trim()) return venues;
    const q = searchQuery.toLowerCase();
    return venues.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.address?.toLowerCase().includes(q) ||
      v.city?.toLowerCase().includes(q) ||
      v.type?.toLowerCase().includes(q)
    );
  }, [venues, searchQuery]);

  const totalPages = Math.ceil(filteredVenues.length / VENUES_PER_PAGE);
  const paginatedVenues = filteredVenues.slice(
    (currentPage - 1) * VENUES_PER_PAGE,
    currentPage * VENUES_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSelectVenue = (workspaceId: string) => {
    localStorage.setItem("indexflow_workspace_id", workspaceId);
    setLocation(`/${workspaceId}/today`);
  };

  const getVenueTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      restaurant: "Restaurant",
      cafe: "Cafe",
      bar: "Bar",
      hotel: "Hotel",
      other: "Venue",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="w-full max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <img src={indexFlowLogo} alt="indexFlow Venue Management Dashboard" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold" data-testid="text-locations-title">My Locations</h1>
          <p className="text-muted-foreground">
            {venues.length === 0
              ? "You don't have any locations yet"
              : `Managing ${venues.length} location${venues.length !== 1 ? "s" : ""}`
            }
          </p>
        </div>

        {venues.length > 0 && (
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-venues"
              />
            </div>
            <Badge variant="secondary" data-testid="badge-venue-count">
              {filteredVenues.length} of {venues.length}
            </Badge>
          </div>
        )}
        
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12" data-testid="loading-venues">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Loading locations...</p>
            </div>
          ) : paginatedVenues.length === 0 && searchQuery ? (
            <div className="text-center py-12" data-testid="no-search-results">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No locations match "{searchQuery}"</p>
            </div>
          ) : paginatedVenues.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-venues">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No locations found</p>
              <p className="text-muted-foreground text-sm mt-1">Contact us to add your first location.</p>
            </div>
          ) : (
            paginatedVenues.map((venue) => (
              <Card 
                key={venue.id} 
                className="cursor-pointer hover-elevate transition-all"
                onClick={() => handleSelectVenue(venue.id)}
                data-testid={`card-venue-${venue.id}`}
              >
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">{venue.name}</span>
                        <Badge variant="secondary" className="text-xs shrink-0">{getVenueTypeLabel(venue.type)}</Badge>
                      </div>
                      {(venue.address || venue.city) && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {[venue.address, venue.city, venue.state].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 px-1" data-testid="pagination-venues">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground" data-testid="text-page-info">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              data-testid="button-next-page"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {venues.length > 0 && (
          <div className="mt-8 p-4 rounded-md border border-dashed text-center" data-testid="card-add-location">
            <Building2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium mb-1">Need another location?</p>
            <p className="text-xs text-muted-foreground mb-3">
              Add unlimited locations for just $25/month each
            </p>
            <a href="/contact">
              <Button variant="outline" size="sm" data-testid="button-add-location">
                <Plus className="w-4 h-4 mr-1" />
                Add Location
              </Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
