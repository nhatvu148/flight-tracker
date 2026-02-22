"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFilteredFlights } from "@/hooks/useFilteredFlights";
import { useAirports } from "@/hooks/useFlights";
import { useMapStore } from "@/stores/map-store";
import type { FlightData } from "@flight-tracker/types";
import type { AirportData } from "@flight-tracker/types";

interface SearchResult {
  type: "flight" | "airport";
  label: string;
  sublabel: string;
  data: FlightData | AirportData;
}

export function SmartSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const searchQuery = useMapStore((s) => s.searchQuery);
  const setSearchQuery = useMapStore((s) => s.setSearchQuery);
  const selectFlight = useMapStore((s) => s.selectFlight);
  const { data: flights } = useFilteredFlights();
  const { data: airports } = useAirports();
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const items: SearchResult[] = [];

    // Search flights by callsign / icao24
    if (flights) {
      for (const f of flights) {
        if (items.length >= 5) break;
        const callsign = (f.flight.icaoNumber || f.flight.iataNumber || f.aircraft.icao24).toLowerCase();
        const icao24 = f.aircraft.icao24.toLowerCase();
        if (callsign.includes(q) || icao24.includes(q)) {
          const altFt = Math.round(f.geography.altitude * 3.28084);
          items.push({
            type: "flight",
            label: callsign.toUpperCase(),
            sublabel: `${altFt.toLocaleString()} ft · ${f.originCountry || ""}`,
            data: f,
          });
        }
      }
    }

    // Search airports by IATA, ICAO, name
    if (airports) {
      let count = 0;
      for (const a of airports) {
        if (count >= 5) break;
        if (
          a.codeIataAirport?.toLowerCase().includes(q) ||
          a.codeIcaoAirport?.toLowerCase().includes(q) ||
          a.nameAirport?.toLowerCase().includes(q)
        ) {
          items.push({
            type: "airport",
            label: `${a.codeIataAirport} — ${a.nameAirport}`,
            sublabel: `${a.nameCountry || ""} · ${a.codeIcaoAirport || ""}`,
            data: a,
          });
          count++;
        }
      }
    }

    return items;
  }, [query, flights, airports]);

  function handleSelect(result: SearchResult) {
    setOpen(false);
    setQuery("");

    if (result.type === "flight") {
      const flight = result.data as FlightData;
      selectFlight(flight);
      setSearchQuery(
        flight.flight.icaoNumber || flight.flight.iataNumber || flight.aircraft.icao24
      );
    } else {
      const airport = result.data as AirportData;
      router.push(`/airport/${airport.codeIataAirport}`);
    }
  }

  return (
    <div ref={wrapperRef} className="flex-1 max-w-sm relative">
      <input
        type="text"
        value={query || searchQuery}
        onChange={(e) => {
          setQuery(e.target.value);
          setSearchQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.length >= 2 && setOpen(true)}
        placeholder="Search flights, airports..."
        className="w-full h-8 px-3 rounded bg-slate-800/80 border border-slate-600/50 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500/50 transition-colors"
      />

      {open && results.length > 0 && (
        <div
          className="absolute top-full mt-1 left-0 right-0 bg-[#1a1d21]/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl overflow-hidden"
          style={{ zIndex: 1002 }}
        >
          {results.map((r, i) => (
            <button
              key={`${r.type}-${r.label}-${i}`}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-3 py-2 hover:bg-slate-700/40 transition-colors flex items-center gap-2 border-b border-slate-700/20 last:border-b-0"
            >
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                  r.type === "flight"
                    ? "bg-sky-900/50 text-sky-300"
                    : "bg-emerald-900/50 text-emerald-300"
                }`}
              >
                {r.type === "flight" ? "FLT" : "APT"}
              </span>
              <div className="min-w-0">
                <div className="text-sm text-slate-200 truncate">{r.label}</div>
                <div className="text-[10px] text-slate-500 truncate">{r.sublabel}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
