"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useMapStore } from "@/stores/map-store";

// Project a point along a bearing from a given lat/lng (Haversine forward)
function projectPoint(
  lat: number,
  lng: number,
  bearingDeg: number,
  distanceKm: number
): [number, number] {
  const R = 6371; // Earth radius in km
  const d = distanceKm / R;
  const brng = (bearingDeg * Math.PI) / 180;
  const lat1 = (lat * Math.PI) / 180;
  const lng1 = (lng * Math.PI) / 180;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
    );

  return [(lat2 * 180) / Math.PI, (lng2 * 180) / Math.PI];
}

export function FlightTrail() {
  const map = useMap();
  const selectedFlight = useMapStore((s) => s.selectedFlight);
  const trailRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (trailRef.current) {
      trailRef.current.remove();
      trailRef.current = null;
    }

    if (!selectedFlight || !map) return;

    const { latitude, longitude, direction } = selectedFlight.geography;
    if (latitude == null || longitude == null || direction === 0) return;

    // Don't show trail for grounded aircraft
    if (selectedFlight.speed.isGround === 1) return;

    // Project ahead: use speed to estimate ~10 min of travel, min 50km max 300km
    const speedKmh = selectedFlight.speed.horizontal * 3.6; // m/s to km/h
    const distanceKm = Math.min(300, Math.max(50, (speedKmh * 10) / 60));

    const ahead = projectPoint(latitude, longitude, direction, distanceKm);

    // Draw a dashed line from current position along the heading
    trailRef.current = L.polyline(
      [
        [latitude, longitude],
        ahead,
      ],
      {
        color: "#38bdf8",
        weight: 2,
        opacity: 0.6,
        dashArray: "6, 8",
        interactive: false,
      }
    ).addTo(map);

    return () => {
      if (trailRef.current) {
        trailRef.current.remove();
        trailRef.current = null;
      }
    };
  }, [map, selectedFlight]);

  return null;
}
