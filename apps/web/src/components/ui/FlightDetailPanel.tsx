"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMapStore } from "@/stores/map-store";
import { ALTITUDE_BANDS, getAltitudeBand } from "@flight-tracker/config";

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-3 mb-1 first:mt-1">
      {title}
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
      <span className="text-xs text-slate-400">{label}</span>
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

function AircraftPhoto({ icao24 }: { icao24: string }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photographer, setPhotographer] = useState("");

  useEffect(() => {
    setPhotoUrl(null);
    setPhotographer("");

    fetch(`https://api.planespotters.net/pub/photos/hex/${icao24}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.photos?.length) {
          setPhotoUrl(data.photos[0].thumbnail_large?.src || data.photos[0].thumbnail?.src);
          setPhotographer(data.photos[0].photographer || "");
        }
      })
      .catch(() => {});
  }, [icao24]);

  if (!photoUrl) {
    return (
      <div className="w-full h-36 bg-slate-800/50 flex items-center justify-center text-slate-500 text-xs">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <img src={photoUrl} alt="Aircraft" className="w-full h-36 object-cover" />
      {photographer && (
        <span className="absolute bottom-1 left-1 text-[9px] text-white/70 bg-black/50 px-1 rounded">
          {photographer}
        </span>
      )}
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

  const bandIndex = selectedFlight
    ? getAltitudeBand(selectedFlight.geography.altitude, isGrounded)
    : 0;
  const altColor = ALTITUDE_BANDS[bandIndex].fill;

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

      {/* Aircraft photo */}
      {selectedFlight && (
        <AircraftPhoto icao24={selectedFlight.aircraft.icao24} />
      )}

      {/* Data sections */}
      {selectedFlight && (
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <SectionHeader title="Position" />
          <DataRow label="Altitude" value={`${altFt.toLocaleString()} ft`} dot={altColor} />
          <DataRow label="Heading" value={`${heading}°`} />
          <DataRow
            label="Coordinates"
            value={`${selectedFlight.geography.latitude.toFixed(4)}, ${selectedFlight.geography.longitude.toFixed(4)}`}
          />

          <SectionHeader title="Performance" />
          <DataRow label="Ground Speed" value={`${speedKts} kts`} />
          <DataRow label="Vertical Speed" value={`${vspeedFpm} fpm`} />
          <DataRow label="Squawk" value={selectedFlight.system.squawk || "—"} />

          <SectionHeader title="Aircraft" />
          <DataRow label="ICAO24" value={selectedFlight.aircraft.icao24} />
          <DataRow label="Registration" value={selectedFlight.aircraft.regNumber || "—"} />
          {selectedFlight.originCountry && (
            <DataRow label="Origin Country" value={selectedFlight.originCountry} />
          )}
          <DataRow label="Last Seen" value={lastSeen} />

          <div className="mt-3">
            <Link
              href={`/flight/${selectedFlight.aircraft.icao24}`}
              className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors"
            >
              Open full detail page &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
