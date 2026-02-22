"use client";

import { useState } from "react";
import { ALTITUDE_BANDS } from "@flight-tracker/config";

export function AltitudeLegend() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="fixed top-16 right-2 bg-[#1a1d21]/90 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-lg"
      style={{ zIndex: 1000 }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium text-slate-300 hover:text-slate-100 transition-colors w-full"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20V4M4 12l8-8 8 8" />
        </svg>
        Altitude
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`ml-auto transition-transform ${collapsed ? "" : "rotate-180"}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {!collapsed && (
        <div className="px-2.5 pb-2 space-y-0.5">
          {[...ALTITUDE_BANDS].reverse().map((band, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: band.fill }}
              />
              <span className="text-[10px] text-slate-400 leading-tight">
                {band.label === "Ground"
                  ? "Ground"
                  : band.label === "45K+"
                    ? "45,000+ ft"
                    : `${band.label.replace("-", "–").replace("K", ",000")} ft`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
