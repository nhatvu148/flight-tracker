"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useAirports } from "@/hooks/useFlights";
import { useMapStore } from "@/stores/map-store";
import type { AirportData } from "@flight-tracker/types";

const MIN_ZOOM_DOTS = 7;

export function AirportMarkers() {
  const map = useMap();
  const zoom = useMapStore((s) => s.zoom);
  const bounds = useMapStore((s) => s.bounds);
  const { data: airports } = useAirports();
  const layerRef = useRef<L.LayerGroup>(L.layerGroup());

  useEffect(() => {
    layerRef.current.addTo(map);
    return () => {
      layerRef.current.remove();
    };
  }, [map]);

  useEffect(() => {
    const layer = layerRef.current;
    layer.clearLayers();

    if (zoom < MIN_ZOOM_DOTS || !airports?.length || !bounds) return;

    // Filter airports to viewport
    const visible = airports.filter(
      (a: AirportData) =>
        a.latitudeAirport >= bounds.south &&
        a.latitudeAirport <= bounds.north &&
        a.longitudeAirport >= bounds.west &&
        a.longitudeAirport <= bounds.east
    );

    for (const airport of visible) {
      const latlng: L.LatLngExpression = [airport.latitudeAirport, airport.longitudeAirport];
      const iata = airport.codeIataAirport || "";
      const icao = airport.codeIcaoAirport || "";
      const name = airport.nameAirport || "";
      const country = airport.nameCountry || "";

      const marker = L.circleMarker(latlng, {
        radius: 5,
        fillColor: "#3b82f6",
        fillOpacity: 0.9,
        color: "#fff",
        weight: 1.5,
      });

      // Tooltip on hover — name + codes
      marker.bindTooltip(
        `<div><strong>${name}</strong></div>` +
        `<div>${iata}${icao ? " / " + icao : ""}</div>`,
        { className: "airport-tooltip", direction: "top", offset: [0, -6] }
      );

      // Popup on click — airport info + link
      marker.bindPopup(
        `<div class="airport-popup">` +
          `<div class="airport-popup-name">${name}</div>` +
          `<div class="airport-popup-codes">${iata}${icao ? " / " + icao : ""}</div>` +
          (country ? `<div class="airport-popup-country">${country}</div>` : "") +
          `<a href="/airport/${encodeURIComponent(iata)}" class="airport-popup-link">View details &rarr;</a>` +
        `</div>`,
        { className: "airport-popup-container", maxWidth: 220 }
      );

      marker.addTo(layer);
    }
  }, [zoom, bounds, airports]);

  return null;
}
