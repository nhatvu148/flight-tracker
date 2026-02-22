"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useAirports } from "@/hooks/useFlights";
import { useMapStore } from "@/stores/map-store";
import type { AirportData } from "@flight-tracker/types";

const AIRPORT_COLOR = "#22c55e";
const MIN_ZOOM_DOTS = 7;
const MIN_ZOOM_LABELS = 9;

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

    const showLabels = zoom >= MIN_ZOOM_LABELS;

    for (const airport of visible) {
      const latlng: L.LatLngExpression = [airport.latitudeAirport, airport.longitudeAirport];

      // Green dot
      L.circleMarker(latlng, {
        radius: 4,
        fillColor: AIRPORT_COLOR,
        fillOpacity: 0.8,
        color: AIRPORT_COLOR,
        weight: 1,
      })
        .bindTooltip(
          `<strong>${airport.codeIataAirport}</strong><br/>${airport.nameAirport}`,
          { className: "airport-tooltip" }
        )
        .addTo(layer);

      // IATA label at higher zoom
      if (showLabels && airport.codeIataAirport) {
        L.marker(latlng, {
          icon: L.divIcon({
            className: "airport-label",
            html: airport.codeIataAirport,
            iconSize: [40, 14],
            iconAnchor: [-6, 7],
          }),
          interactive: false,
        }).addTo(layer);
      }
    }
  }, [zoom, bounds, airports]);

  return null;
}
