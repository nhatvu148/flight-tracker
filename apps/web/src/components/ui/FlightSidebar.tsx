"use client";

import React, { useMemo } from "react";
import { useMapStore } from "@/stores/map-store";
import { useFlights } from "@/hooks/useFlights";
import type { FlightData } from "@flight-tracker/types";

const FlightRow = React.memo(function FlightRow({
  flight,
  isSelected,
  onClick,
}: {
  flight: FlightData;
  isSelected: boolean;
  onClick: () => void;
}) {
  const callsign =
    flight.flight.icaoNumber || flight.flight.iataNumber || flight.aircraft.icao24;
  const altFt = Math.round(flight.geography.altitude * 3.28084);
  const speedKts = Math.round(flight.speed.horizontal * 1.94384);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 border-b border-slate-700/30 hover:bg-slate-700/40 transition-colors ${
        isSelected ? "bg-sky-900/40 border-l-2 border-l-sky-400" : ""
      }`}
    >
      <div className="text-sm font-medium text-slate-200 truncate">{callsign}</div>
      <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
        <span>{altFt.toLocaleString()} ft</span>
        <span>{speedKts} kts</span>
      </div>
    </button>
  );
}, (prev, next) =>
  prev.flight.aircraft.icao24 === next.flight.aircraft.icao24 &&
  prev.flight.geography.altitude === next.flight.geography.altitude &&
  prev.flight.speed.horizontal === next.flight.speed.horizontal &&
  prev.isSelected === next.isSelected
);

export function FlightSidebar() {
  const sidebarOpen = useMapStore((s) => s.sidebarOpen);
  const setSidebarOpen = useMapStore((s) => s.setSidebarOpen);
  const searchQuery = useMapStore((s) => s.searchQuery);
  const selectedFlight = useMapStore((s) => s.selectedFlight);
  const selectFlight = useMapStore((s) => s.selectFlight);
  const { data: flights } = useFlights();

  const filtered = useMemo(() => {
    if (!flights) return [];
    if (!searchQuery.trim()) return flights;
    const q = searchQuery.toLowerCase();
    return flights.filter((f) => {
      const callsign =
        f.flight.icaoNumber || f.flight.iataNumber || f.aircraft.icao24;
      return callsign.toLowerCase().includes(q);
    });
  }, [flights, searchQuery]);

  return (
    <>
      <div
        className={`fixed left-0 top-14 bottom-10 w-72 bg-[#1a1d21]/90 backdrop-blur-sm border-r border-slate-700/50 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ zIndex: 1001 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/50">
          <span className="text-sm font-medium text-slate-300">
            Flights ({filtered.length})
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Flight list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((flight) => (
            <FlightRow
              key={flight.aircraft.icao24}
              flight={flight}
              isSelected={selectedFlight?.aircraft.icao24 === flight.aircraft.icao24}
              onClick={() => selectFlight(flight)}
            />
          ))}
        </div>
      </div>

      {/* Expand toggle (visible when sidebar is closed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-[#1a1d21]/90 backdrop-blur-sm border border-slate-700/50 border-l-0 rounded-r px-1 py-3 text-slate-400 hover:text-slate-200 transition-colors"
          style={{ zIndex: 1001 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}
    </>
  );
}
