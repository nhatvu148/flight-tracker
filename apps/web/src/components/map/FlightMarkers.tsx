"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-markers-canvas";
import { useFlights } from "@/hooks/useFlights";
import { getClosest } from "@flight-tracker/utils";
import { ANGLE_STEPS } from "@flight-tracker/config";
import { useMapStore } from "@/stores/map-store";
import type { FlightData } from "@flight-tracker/types";

// Pre-create icon cache — one L.icon per angle (image-based, not divIcon)
const iconCache = new Map<string, L.Icon>();
function getAircraftIcon(angle: number, selected = false): L.Icon {
  const key = `${angle}-${selected ? "sel" : "def"}`;
  if (!iconCache.has(key)) {
    const size = selected ? 30 : 20;
    const anchor = size / 2;
    iconCache.set(
      key,
      L.icon({
        iconUrl: `/aircraft-icons/aircraft-${angle}.svg`,
        iconSize: [size, size],
        iconAnchor: [anchor, anchor],
      })
    );
  }
  return iconCache.get(key)!;
}

export function FlightMarkers() {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvasRef = useRef<any>(null);
  const { data: flights } = useFlights();
  const selectedFlight = useMapStore((s) => s.selectedFlight);
  const selectFlight = useMapStore((s) => s.selectFlight);

  useEffect(() => {
    if (!map) return;

    // Initialize canvas layer once
    if (!canvasRef.current) {
      // @ts-expect-error leaflet-markers-canvas extends L
      canvasRef.current = new L.MarkersCanvas();
      canvasRef.current.addTo(map);
    }

    const canvas = canvasRef.current;

    // Clear previous markers
    canvas.clear();

    // Draw flights on canvas
    if (flights?.length) {
      const markers: L.Marker[] = [];
      const selectedIcao24 = selectedFlight?.aircraft.icao24;

      for (const flight of flights) {
        const { latitude, longitude, direction } = flight.geography;
        if (latitude == null || longitude == null) continue;

        const angle = getClosest(ANGLE_STEPS, direction);
        const isSelected = flight.aircraft.icao24 === selectedIcao24;

        const marker = L.marker([latitude, longitude], {
          icon: getAircraftIcon(angle, isSelected),
        });

        // leaflet-markers-canvas fires "click" on individual markers
        marker.on("click", () => selectFlight(flight));

        markers.push(marker);
      }

      canvas.addMarkers(markers);
    }
  }, [map, flights, selectedFlight, selectFlight]);

  return null;
}
