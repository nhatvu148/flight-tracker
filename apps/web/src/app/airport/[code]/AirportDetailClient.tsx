"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAirport } from "@flight-tracker/api-client";
import { TopBar } from "@/components/ui/TopBar";

export function AirportDetailClient({ code }: { code: string }) {
  const { data: airport, isLoading, error } = useQuery({
    queryKey: ["airport", code],
    queryFn: () => getAirport(code),
  });

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200">
      <TopBar />
      <div className="pt-16 px-4 max-w-2xl mx-auto">
        <div className="mb-4">
          <Link
            href="/airports"
            className="text-xs text-sky-400 hover:text-sky-300 transition-colors"
          >
            &larr; All Airports
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading airport...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            Airport not found
          </div>
        ) : airport ? (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold font-mono text-sky-400">
                {airport.codeIataAirport}
              </span>
              <span className="text-sm text-slate-400 font-mono">
                {airport.codeIcaoAirport}
              </span>
            </div>

            <h1 className="text-xl font-semibold mb-4">{airport.nameAirport}</h1>

            <div className="space-y-3 text-sm">
              <DetailRow label="Country" value={airport.nameCountry} />
              <DetailRow label="Country Code" value={airport.codeIso2Country} />
              <DetailRow label="City (IATA)" value={airport.codeIataCity} />
              <DetailRow label="Timezone" value={airport.timezone} />
              <DetailRow label="GMT Offset" value={airport.GMT} />
              <DetailRow
                label="Coordinates"
                value={`${airport.latitudeAirport.toFixed(4)}, ${airport.longitudeAirport.toFixed(4)}`}
              />
              {airport.phone && (
                <DetailRow label="Phone" value={airport.phone} />
              )}
            </div>

            <div className="mt-6">
              <Link
                href={`/?lat=${airport.latitudeAirport}&lng=${airport.longitudeAirport}&zoom=12`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-sky-600 hover:bg-sky-500 text-white rounded transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                View on Map
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-slate-700/30">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 font-mono">{value}</span>
    </div>
  );
}
