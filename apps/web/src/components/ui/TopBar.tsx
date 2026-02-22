"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMapStore } from "@/stores/map-store";

export function TopBar() {
  const searchQuery = useMapStore((s) => s.searchQuery);
  const setSearchQuery = useMapStore((s) => s.setSearchQuery);
  const [utc, setUtc] = useState("");
  const pathname = usePathname();
  const isMapPage = pathname === "/";

  useEffect(() => {
    function tick() {
      const now = new Date();
      setUtc(
        now.toISOString().slice(11, 19) + " UTC"
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-14 flex items-center px-4 gap-4 bg-[#1a1d21]/90 backdrop-blur-sm text-slate-200 border-b border-slate-700/50"
      style={{ zIndex: 1001 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-sky-400"
        >
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
        </svg>
        <span className="font-semibold text-sm tracking-wide">FlightTracker</span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1 shrink-0">
        <Link
          href="/"
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            isMapPage
              ? "bg-sky-900/50 text-sky-300"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          }`}
        >
          Map
        </Link>
        <Link
          href="/airports"
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
            pathname.startsWith("/airport")
              ? "bg-sky-900/50 text-sky-300"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          }`}
        >
          Airports
        </Link>
      </nav>

      {/* Search (map page only) */}
      {isMapPage && (
        <div className="flex-1 max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flights..."
            className="w-full h-8 px-3 rounded bg-slate-800/80 border border-slate-600/50 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500/50 transition-colors"
          />
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* UTC Clock */}
      <div className="text-sm font-mono text-slate-400 shrink-0">
        {utc}
      </div>
    </div>
  );
}
