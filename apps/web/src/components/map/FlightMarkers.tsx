"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-markers-canvas";
import { useFilteredFlights } from "@/hooks/useFilteredFlights";
import { getClosest } from "@flight-tracker/utils";
import { ANGLE_STEPS, ALTITUDE_BANDS, getAltitudeBand } from "@flight-tracker/config";
import { useMapStore } from "@/stores/map-store";

const ICON_SIZE = 22;
const ICON_SIZE_SELECTED = 30;

// Original SVG colors to replace
const ORIG_FILL = "rgb(242,204,39)";
const ORIG_STROKE = "rgb(80,60,0)";

// Cache: raw SVG text per angle
const svgTextCache = new Map<number, string>();
// Cache: data URL icons keyed by "angle-bandIndex-selected"
const iconCache = new Map<string, L.Icon>();

async function preloadSvgs(): Promise<void> {
  const fetches = ANGLE_STEPS.map(async (angle) => {
    if (svgTextCache.has(angle)) return;
    const res = await fetch(`/aircraft-icons/aircraft-${angle}.svg`);
    const text = await res.text();
    svgTextCache.set(angle, text);
  });
  await Promise.all(fetches);
}

function getColoredIcon(angle: number, bandIndex: number, selected: boolean): L.Icon {
  const key = `${angle}-${bandIndex}-${selected ? "sel" : "def"}`;
  if (iconCache.has(key)) return iconCache.get(key)!;

  const band = ALTITUDE_BANDS[bandIndex];
  let svgText = svgTextCache.get(angle) ?? "";
  svgText = svgText.replace(new RegExp(escapeRegex(ORIG_FILL), "g"), band.fill);
  svgText = svgText.replace(new RegExp(escapeRegex(ORIG_STROKE), "g"), band.stroke);

  const dataUrl = `data:image/svg+xml;base64,${btoa(svgText)}`;
  const size = selected ? ICON_SIZE_SELECTED : ICON_SIZE;
  const anchor = size / 2;

  const icon = L.icon({
    iconUrl: dataUrl,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
  });
  iconCache.set(key, icon);
  return icon;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Set by marker click, checked by map background click to prevent deselect race
let _markerClicked = false;
export function getMarkerClicked() { return _markerClicked; }

export function FlightMarkers() {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvasRef = useRef<any>(null);
  const labelMarkerRef = useRef<L.Marker | null>(null);
  const { data: flights } = useFilteredFlights();
  const selectedFlight = useMapStore((s) => s.selectedFlight);
  const selectFlight = useMapStore((s) => s.selectFlight);
  const [svgsReady, setSvgsReady] = useState(svgTextCache.size > 0);

  // Preload SVG text on mount
  useEffect(() => {
    if (svgTextCache.size > 0) return;
    preloadSvgs().then(() => setSvgsReady(true));
  }, []);

  // Rebuild all markers when flights, selection, or SVG readiness changes
  useEffect(() => {
    if (!map || !svgsReady) return;

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
        const { latitude, longitude, direction, altitude } = flight.geography;
        if (latitude == null || longitude == null) continue;

        const angle = getClosest(ANGLE_STEPS, direction);
        const isSelected = flight.aircraft.icao24 === selectedIcao24;
        const bandIndex = getAltitudeBand(altitude, flight.speed.isGround === 1);

        const marker = L.marker([latitude, longitude], {
          icon: getColoredIcon(angle, bandIndex, isSelected),
        });

        marker.on("click", () => {
          _markerClicked = true;
          selectFlight(flight);
          setTimeout(() => { _markerClicked = false; }, 0);
        });
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
  }, [map, flights, selectedFlight, selectFlight, svgsReady]);

  return null;
}
