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
  const labelMarkerRef = useRef<L.Marker | null>(null);
  const { data: flights } = useFlights();
  const selectedFlight = useMapStore((s) => s.selectedFlight);
  const selectFlight = useMapStore((s) => s.selectFlight);

  // Single effect: rebuild all markers when flights or selection changes
  useEffect(() => {
    if (!map) return;

    if (!canvasRef.current) {
      // @ts-expect-error leaflet-markers-canvas extends L
      canvasRef.current = new L.MarkersCanvas();
      canvasRef.current.addTo(map);
    }

    const canvas = canvasRef.current;
    canvas.clear();

    // Remove previous callsign label
    if (labelMarkerRef.current) {
      labelMarkerRef.current.remove();
      labelMarkerRef.current = null;
    }

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

        marker.on("click", () => selectFlight(flight));
        markers.push(marker);
      }

      canvas.addMarkers(markers);
    }

    // Add callsign label above selected aircraft
    if (selectedFlight) {
      const { latitude, longitude } = selectedFlight.geography;
      if (latitude != null && longitude != null) {
        const callsign =
          selectedFlight.flight.icaoNumber ||
          selectedFlight.flight.iataNumber ||
          selectedFlight.aircraft.icao24;

        labelMarkerRef.current = L.marker([latitude, longitude], {
          icon: L.divIcon({
            className: "",
            html: `<div style="
              transform: translate(-50%, -100%);
              margin-top: -20px;
              background: #1a1d21ee;
              color: #f0c800;
              font-size: 11px;
              font-weight: 600;
              font-family: ui-monospace, monospace;
              padding: 2px 6px;
              border-radius: 3px;
              border: 1px solid #f0c80066;
              white-space: nowrap;
              pointer-events: none;
              box-shadow: 0 1px 3px rgba(0,0,0,0.4);
              width: fit-content;
            ">${callsign}</div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
          zIndexOffset: 1000,
        }).addTo(map);
      }
    }

    return () => {
      if (labelMarkerRef.current) {
        labelMarkerRef.current.remove();
        labelMarkerRef.current = null;
      }
    };
  }, [map, flights, selectedFlight, selectFlight]);

  return null;
}
