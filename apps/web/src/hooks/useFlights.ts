"use client";

import { useQuery } from "@tanstack/react-query";
import { getFlights, getAirports } from "@flight-tracker/api-client";
import { useMapStore } from "@/stores/map-store";
import { WEB_CONFIG } from "@flight-tracker/config";

export function useFlights() {
  const bounds = useMapStore((s) => s.bounds);
  const zoom = useMapStore((s) => s.zoom);

  // At low zoom (world view), fetch ALL flights without bounds
  // At higher zoom, use viewport bounds to limit the query
  const useBounds = zoom >= 6 ? bounds : undefined;

  return useQuery({
    queryKey: ["flights", zoom >= 6 ? "bounded" : "global", useBounds],
    queryFn: () => getFlights(useBounds ?? undefined),
    refetchInterval: WEB_CONFIG.pollInterval,
    enabled: !!bounds, // wait until map has initialized bounds
  });
}

export function useAirports() {
  return useQuery({
    queryKey: ["airports"],
    queryFn: () => getAirports(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
