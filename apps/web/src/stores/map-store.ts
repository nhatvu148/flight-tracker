import { create } from "zustand";
import { MAP_DEFAULTS } from "@flight-tracker/config";
import type { FlightData } from "@flight-tracker/types";

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface FlightFilters {
  altMinFt: number;
  altMaxFt: number;
  speedMinKts: number;
  speedMaxKts: number;
  showGround: boolean;
  showAirborne: boolean;
}

const DEFAULT_FILTERS: FlightFilters = {
  altMinFt: 0,
  altMaxFt: 60000,
  speedMinKts: 0,
  speedMaxKts: 700,
  showGround: true,
  showAirborne: true,
};

interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  bounds: MapBounds | null;
  activeLayer: string;
  selectedFlight: FlightData | null;
  sidebarOpen: boolean;
  searchQuery: string;
  filters: FlightFilters;
  filtersActive: boolean;
  filterPanelOpen: boolean;
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: MapBounds) => void;
  setActiveLayer: (layer: string) => void;
  selectFlight: (flight: FlightData | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<FlightFilters>) => void;
  resetFilters: () => void;
  setFilterPanelOpen: (open: boolean) => void;
}

function isFiltersActive(f: FlightFilters): boolean {
  return (
    f.altMinFt !== DEFAULT_FILTERS.altMinFt ||
    f.altMaxFt !== DEFAULT_FILTERS.altMaxFt ||
    f.speedMinKts !== DEFAULT_FILTERS.speedMinKts ||
    f.speedMaxKts !== DEFAULT_FILTERS.speedMaxKts ||
    !f.showGround ||
    !f.showAirborne
  );
}

export const useMapStore = create<MapState>((set) => ({
  center: { ...MAP_DEFAULTS.center },
  zoom: MAP_DEFAULTS.zoom,
  bounds: null,
  activeLayer: MAP_DEFAULTS.defaultLayer,
  selectedFlight: null,
  sidebarOpen: true,
  searchQuery: "",
  filters: { ...DEFAULT_FILTERS },
  filtersActive: false,
  filterPanelOpen: false,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
  setActiveLayer: (activeLayer) => set({ activeLayer }),
  selectFlight: (flight) => set({ selectedFlight: flight }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (partial) =>
    set((state) => {
      const filters = { ...state.filters, ...partial };
      return { filters, filtersActive: isFiltersActive(filters) };
    }),
  resetFilters: () =>
    set({ filters: { ...DEFAULT_FILTERS }, filtersActive: false }),
  setFilterPanelOpen: (open) => set({ filterPanelOpen: open }),
}));
