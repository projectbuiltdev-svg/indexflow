import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Venue } from "@shared/schema";

interface VenueContextType {
  venues: Venue[];
  selectedVenue: Venue | null;
  selectVenue: (v: Venue | null) => void;
  isLoading: boolean;
}

const VenueContext = createContext<VenueContextType>({
  venues: [],
  selectedVenue: null,
  selectVenue: () => {},
  isLoading: true,
});

const STORAGE_KEY = "resto_venue_id";

export function VenueProvider({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  });

  const { data: venues = [], isLoading } = useQuery<Venue[]>({
    queryKey: ["/api/venues"],
  });

  const selectedVenue = venues.find((v) => v.id === selectedId) || venues[0] || null;

  const selectVenue = useCallback((v: Venue | null) => {
    const id = v?.id || null;
    setSelectedId(id);
    try {
      if (id) localStorage.setItem(STORAGE_KEY, id);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <VenueContext.Provider value={{ venues, selectedVenue, selectVenue, isLoading }}>
      {children}
    </VenueContext.Provider>
  );
}

export function useVenue() {
  return useContext(VenueContext);
}
