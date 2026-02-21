import { create } from "zustand";
import { MAP_DEFAULTS } from "@flight-tracker/config";

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
  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: MapBounds) => void;
  setActiveLayer: (layer: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: { ...MAP_DEFAULTS.center },
  zoom: MAP_DEFAULTS.zoom,
  bounds: null,
  activeLayer: MAP_DEFAULTS.defaultLayer,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),
  setActiveLayer: (activeLayer) => set({ activeLayer }),
}));
