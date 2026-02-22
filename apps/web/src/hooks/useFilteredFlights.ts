"use client";

import { useMemo } from "react";
import { useFlights } from "./useFlights";
import { useMapStore } from "@/stores/map-store";
import type { FlightData } from "@flight-tracker/types";

export function useFilteredFlights() {
  const query = useFlights();
  const filters = useMapStore((s) => s.filters);
  const filtersActive = useMapStore((s) => s.filtersActive);

  const filtered = useMemo(() => {
    const flights = query.data;
    if (!flights) return undefined;
    if (!filtersActive) return flights;

    return flights.filter((f: FlightData) => {
      const isGround = f.speed.isGround === 1;
      if (isGround && !filters.showGround) return false;
      if (!isGround && !filters.showAirborne) return false;

      const altFt = f.geography.altitude * 3.28084;
      if (altFt < filters.altMinFt || altFt > filters.altMaxFt) return false;

      const speedKts = f.speed.horizontal * 1.94384;
      if (speedKts < filters.speedMinKts || speedKts > filters.speedMaxKts) return false;

      return true;
    });
  }, [query.data, filters, filtersActive]);

  return {
    ...query,
    data: filtered,
    unfilteredCount: query.data?.length ?? 0,
  };
}
