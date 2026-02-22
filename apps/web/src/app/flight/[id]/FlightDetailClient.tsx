"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getFlight } from "@flight-tracker/api-client";
import { ALTITUDE_BANDS, getAltitudeBand } from "@flight-tracker/config";
import { TopBar } from "@/components/ui/TopBar";

export function FlightDetailClient({ id }: { id: string }) {
  const { data: flight, isLoading, error } = useQuery({
    queryKey: ["flight", id],
    queryFn: () => getFlight(id),
    refetchInterval: 30_000,
  });

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photographer, setPhotographer] = useState("");

  useEffect(() => {
    if (!id) return;
    setPhotoUrl(null);
    setPhotographer("");
    fetch(`https://api.planespotters.net/pub/photos/hex/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.photos?.length) {
          setPhotoUrl(data.photos[0].thumbnail_large?.src || data.photos[0].thumbnail?.src);
          setPhotographer(data.photos[0].photographer || "");
        }
      })
      .catch(() => {});
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1115] text-slate-200">
        <TopBar />
        <div className="pt-16 px-4 max-w-2xl mx-auto">
          <div className="text-center py-12 text-slate-500">Loading flight...</div>
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen bg-[#0f1115] text-slate-200">
        <TopBar />
        <div className="pt-16 px-4 max-w-2xl mx-auto">
          <div className="mb-4">
            <Link href="/" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
              &larr; Back to Map
            </Link>
          </div>
          <div className="text-center py-12 text-red-400">
            Flight not found. It may no longer be transmitting.
          </div>
        </div>
      </div>
    );
  }

  const callsign =
    flight.flight.icaoNumber || flight.flight.iataNumber || flight.aircraft.icao24;
  const isGrounded = flight.speed.isGround === 1;
  const altFt = Math.round(flight.geography.altitude * 3.28084);
  const speedKts = Math.round(flight.speed.horizontal * 1.94384);
  const vspeedFpm = Math.round(flight.speed.vspeed * 196.85);
  const heading = Math.round(flight.geography.direction);
  const lastSeen =
    new Date(flight.system.updated * 1000).toISOString().slice(11, 19) + " UTC";
  const bandIndex = getAltitudeBand(flight.geography.altitude, isGrounded);
  const altColor = ALTITUDE_BANDS[bandIndex].fill;

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200">
      <TopBar />
      <div className="pt-16 px-4 max-w-2xl mx-auto">
        <div className="mb-4">
          <Link href="/" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
            &larr; Back to Map
          </Link>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg overflow-hidden">
          {/* Photo */}
          {photoUrl ? (
            <div className="relative w-full">
              <img src={photoUrl} alt="Aircraft" className="w-full h-48 object-cover" />
              {photographer && (
                <span className="absolute bottom-1 left-1 text-[9px] text-white/70 bg-black/50 px-1 rounded">
                  {photographer}
                </span>
              )}
            </div>
          ) : (
            <div className="w-full h-32 bg-slate-800/50 flex items-center justify-center text-slate-500">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
              </svg>
            </div>
          )}

          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-mono">{callsign}</h1>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                  isGrounded
                    ? "bg-amber-900/50 text-amber-300"
                    : "bg-emerald-900/50 text-emerald-300"
                }`}
              >
                {isGrounded ? "GROUNDED" : "EN ROUTE"}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">ICAO24: {flight.aircraft.icao24}</p>
          </div>

          {/* Data sections */}
          <div className="px-6 py-4 space-y-4">
            <Section title="Position">
              <DataRow label="Altitude" value={`${altFt.toLocaleString()} ft`} dot={altColor} />
              <DataRow label="Heading" value={`${heading}°`} />
              <DataRow
                label="Coordinates"
                value={`${flight.geography.latitude.toFixed(4)}, ${flight.geography.longitude.toFixed(4)}`}
              />
            </Section>

            <Section title="Performance">
              <DataRow label="Ground Speed" value={`${speedKts} kts`} />
              <DataRow label="Vertical Speed" value={`${vspeedFpm} fpm`} />
              <DataRow label="Squawk" value={flight.system.squawk || "—"} />
            </Section>

            <Section title="Aircraft">
              <DataRow label="ICAO24" value={flight.aircraft.icao24} />
              <DataRow label="Registration" value={flight.aircraft.regNumber || "—"} />
              {flight.originCountry && (
                <DataRow label="Origin Country" value={flight.originCountry} />
              )}
              <DataRow label="Last Seen" value={lastSeen} />
            </Section>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-slate-700/50">
            <Link
              href={`/?lat=${flight.geography.latitude}&lng=${flight.geography.longitude}&zoom=10`}
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
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
        {title}
      </div>
      {children}
    </div>
  );
}

function DataRow({
  label,
  value,
  dot,
}: {
  label: string;
  value: string | number;
  dot?: string;
}) {
  return (
    <div className="flex justify-between py-1.5 border-b border-slate-700/30">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm text-slate-200 font-mono flex items-center gap-1.5">
        {dot && (
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: dot }}
          />
        )}
        {value}
      </span>
    </div>
  );
}
