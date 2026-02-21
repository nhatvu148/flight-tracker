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

const ICON_SIZE = 22;
const ICON_SIZE_SELECTED = 30;

// Cache icons by angle + selected state
const iconCache = new Map<string, L.Icon>();
function getAircraftIcon(angle: number, selected = false): L.Icon {
  const key = `${angle}-${selected ? "sel" : "def"}`;
  if (!iconCache.has(key)) {
    const size = selected ? ICON_SIZE_SELECTED : ICON_SIZE;
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
  const markerMapRef = useRef<Map<string, { marker: L.Marker; flight: FlightData; angle: number }>>(new Map());
  const { data: flights } = useFlights();
  const selectedFlight = useMapStore((s) => s.selectedFlight);
  const selectFlight = useMapStore((s) => s.selectFlight);

  // Main effect: rebuild markers only when flight data changes
  useEffect(() => {
    if (!map) return;

    if (!canvasRef.current) {
      // @ts-expect-error leaflet-markers-canvas extends L
      canvasRef.current = new L.MarkersCanvas();
      canvasRef.current.addTo(map);
    }

    const canvas = canvasRef.current;
    canvas.clear();
    markerMapRef.current.clear();

    if (flights?.length) {
      const markers: L.Marker[] = [];

      for (const flight of flights) {
        const { latitude, longitude, direction } = flight.geography;
        if (latitude == null || longitude == null) continue;

        const angle = getClosest(ANGLE_STEPS, direction);

        const marker = L.marker([latitude, longitude], {
          icon: getAircraftIcon(angle),
        });

        marker.on("click", () => selectFlight(flight));
        markerMapRef.current.set(flight.aircraft.icao24, { marker, flight, angle });
        markers.push(marker);
      }

      canvas.addMarkers(markers);
    }
  }, [map, flights, selectFlight]);

  // Separate effect: highlight/unhighlight selected marker without full rebuild
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const selectedIcao24 = selectedFlight?.aircraft.icao24;

    for (const [icao24, entry] of markerMapRef.current) {
      const shouldBeSelected = icao24 === selectedIcao24;
      const currentIcon = entry.marker.getIcon() as L.Icon;
      const targetIcon = getAircraftIcon(entry.angle, shouldBeSelected);

      if (currentIcon !== targetIcon) {
        entry.marker.setIcon(targetIcon);
        canvas.removeMarker(entry.marker);
        canvas.addMarker(entry.marker);
      }
    }
  }, [selectedFlight]);

  return null;
}
