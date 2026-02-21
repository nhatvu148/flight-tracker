import { create } from "zustand";
import { MAP_DEFAULTS } from "@flight-tracker/config";
import type { FlightData } from "@flight-tracker/types";

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  bounds: MapBounds | null;
  activeLayer: string;
  selectedFlight: FlightData | null;
  sidebarOpen: boolean;
  searchQuery: string;
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: MapBounds) => void;
  setActiveLayer: (layer: string) => void;
  selectFlight: (flight: FlightData | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: { ...MAP_DEFAULTS.center },
  zoom: MAP_DEFAULTS.zoom,
  bounds: null,
  activeLayer: MAP_DEFAULTS.defaultLayer,
  selectedFlight: null,
  sidebarOpen: true,
  searchQuery: "",
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
  setActiveLayer: (activeLayer) => set({ activeLayer }),
  selectFlight: (flight) => set({ selectedFlight: flight }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
