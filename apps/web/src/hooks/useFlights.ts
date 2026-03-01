"use client";

import { useRef, useMemo } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getFlights, getAirports } from "@flight-tracker/api-client";
import { useMapStore } from "@/stores/map-store";
import { WEB_CONFIG } from "@flight-tracker/config";

/**
 * Snap bounds to a coarse grid so small pans reuse the same query key.
 * At zoom < 6 we fetch globally (no bounds).
 * The grid cell size (1°) means a fetch only triggers when the viewport
 * crosses a full degree boundary — eliminates most re-fetches on drag.
 */
function snapBounds(bounds: { north: number; south: number; east: number; west: number }) {
  return {
    north: Math.ceil(bounds.north),
    south: Math.floor(bounds.south),
    east: Math.ceil(bounds.east),
    west: Math.floor(bounds.west),
  };
}

export function useFlights() {
  const bounds = useMapStore((s) => s.bounds);
  const zoom = useMapStore((s) => s.zoom);

  // At low zoom (world view), fetch ALL flights without bounds
  const useBounds = zoom >= 6 && bounds ? bounds : undefined;

  // Snap to coarse grid — same snapped value = same queryKey = no re-fetch
  const snapped = useBounds ? snapBounds(useBounds) : undefined;

  // Stable reference: only changes when snapped values actually change
  const prevRef = useRef(snapped);
  const stableSnapped = useMemo(() => {
    if (!snapped) { prevRef.current = undefined; return undefined; }
    const prev = prevRef.current;
    if (prev && prev.north === snapped.north && prev.south === snapped.south &&
        prev.east === snapped.east && prev.west === snapped.west) {
      return prev;
    }
    prevRef.current = snapped;
    return snapped;
  }, [snapped]);

  return useQuery({
    queryKey: ["flights", zoom >= 6 ? "bounded" : "global", stableSnapped],
    queryFn: () => getFlights(useBounds ?? undefined),
    refetchInterval: WEB_CONFIG.pollInterval,
    enabled: !!bounds,
    placeholderData: keepPreviousData,
  });
}

export function useAirports() {
  return useQuery({
    queryKey: ["airports"],
    queryFn: () => getAirports(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
