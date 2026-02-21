"use client";

import { useMapStore } from "@/stores/map-store";

function DataRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-slate-700/30">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-sm text-slate-200 font-mono">{value}</span>
    </div>
  );
}

export function FlightDetailPanel() {
  const selectedFlight = useMapStore((s) => s.selectedFlight);
  const selectFlight = useMapStore((s) => s.selectFlight);

  const isOpen = selectedFlight !== null;

  const callsign = selectedFlight
    ? selectedFlight.flight.icaoNumber ||
      selectedFlight.flight.iataNumber ||
      selectedFlight.aircraft.icao24
    : "";

  const isGrounded = selectedFlight?.speed.isGround === 1;
  const altFt = selectedFlight
    ? Math.round(selectedFlight.geography.altitude * 3.28084)
    : 0;
  const speedKts = selectedFlight
    ? Math.round(selectedFlight.speed.horizontal * 1.94384)
    : 0;
  const vspeedFpm = selectedFlight
    ? Math.round(selectedFlight.speed.vspeed * 196.85)
    : 0;
  const heading = selectedFlight
    ? Math.round(selectedFlight.geography.direction)
    : 0;
  const lastSeen = selectedFlight
    ? new Date(selectedFlight.system.updated * 1000).toISOString().slice(11, 19) +
      " UTC"
    : "";

  return (
    <div
      className={`fixed right-0 top-14 bottom-10 w-80 bg-[#1a1d21]/90 backdrop-blur-sm border-l border-slate-700/50 flex flex-col transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ zIndex: 1001 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-100">{callsign}</h2>
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              isGrounded
                ? "bg-amber-900/50 text-amber-300"
                : "bg-emerald-900/50 text-emerald-300"
            }`}
          >
            {isGrounded ? "GROUNDED" : "EN ROUTE"}
          </span>
        </div>
        <button
          onClick={() => selectFlight(null)}
          className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Data rows */}
      {selectedFlight && (
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <DataRow label="Altitude" value={`${altFt.toLocaleString()} ft`} />
          <DataRow label="Speed" value={`${speedKts} kts`} />
          <DataRow label="Heading" value={`${heading}°`} />
          <DataRow label="Vertical Speed" value={`${vspeedFpm} fpm`} />
          <DataRow label="Squawk" value={selectedFlight.system.squawk || "—"} />
          <DataRow label="ICAO24" value={selectedFlight.aircraft.icao24} />
          <DataRow label="Registration" value={selectedFlight.aircraft.regNumber || "—"} />
          <DataRow label="Departure" value={selectedFlight.departure.iataCode || "—"} />
          <DataRow label="Arrival" value={selectedFlight.arrival.iataCode || "—"} />
          <DataRow label="Last Seen" value={lastSeen} />
        </div>
      )}
    </div>
  );
}
