"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-markers-canvas";
import { useFlights } from "@/hooks/useFlights";
import { getClosest } from "@flight-tracker/utils";
import { ANGLE_STEPS } from "@flight-tracker/config";
import type { FlightData } from "@flight-tracker/types";

// Pre-create icon cache — one L.icon per angle (image-based, not divIcon)
const iconCache = new Map<number, L.Icon>();
function getAircraftIcon(angle: number): L.Icon {
  if (!iconCache.has(angle)) {
    iconCache.set(
      angle,
      L.icon({
        iconUrl: `/aircraft-icons/aircraft-${angle}.svg`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })
    );
  }
  return iconCache.get(angle)!;
}

function buildMarkers(flights: FlightData[]): L.Marker[] {
  const markers: L.Marker[] = [];

  for (const flight of flights) {
    const { latitude, longitude, direction } = flight.geography;
    if (latitude == null || longitude == null) continue;

    const { icaoNumber } = flight.flight;
    const angle = getClosest(ANGLE_STEPS, direction);

    const marker = L.marker([latitude, longitude], {
      icon: getAircraftIcon(angle),
    }).bindPopup(icaoNumber || flight.aircraft.icao24);

    markers.push(marker);
  }

  return markers;
}

export function FlightMarkers() {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvasRef = useRef<any>(null);
  const { data: flights } = useFlights();

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

    // Draw flights on canvas (single world — worldCopyJump handles wrapping)
    if (flights?.length) {
      const markers = buildMarkers(flights);
      canvas.addMarkers(markers);
    }
  }, [map, flights]);

  return null;
}
