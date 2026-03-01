"use client";

import { useFilteredFlights } from "@/hooks/useFilteredFlights";
import { useMapStore } from "@/stores/map-store";
import { FilterPanel } from "./FilterPanel";

export function BottomToolbar() {
  const { data: flights, unfilteredCount } = useFilteredFlights();
  const filtersActive = useMapStore((s) => s.filtersActive);
  const filterPanelOpen = useMapStore((s) => s.filterPanelOpen);
  const setFilterPanelOpen = useMapStore((s) => s.setFilterPanelOpen);

  const total = flights?.length ?? 0;
  const airborne = flights?.filter((f) => f.speed.isGround !== 1).length ?? 0;
  const ground = total - airborne;

  return (
    <>
      <FilterPanel />
      <div
        className="fixed bottom-0 left-0 right-0 h-10 flex items-center px-4 gap-2 bg-[#1a1d21]/90 backdrop-blur-sm text-slate-400 border-t border-slate-700/50"
        style={{ zIndex: 1001 }}
      >
        <button className="flex items-center gap-1.5 px-2 py-1 rounded text-xs hover:bg-slate-700/50 hover:text-slate-200 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </button>

        <button
          onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
            filtersActive
              ? "bg-sky-900/50 text-sky-300 hover:bg-sky-800/50"
              : "hover:bg-slate-700/50 hover:text-slate-200"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filters
          {filtersActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          )}
        </button>

        <div className="flex-1" />

        {/* Live flight stats */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-slate-300">
            {total.toLocaleString()} flights
          </span>
          <span className="text-emerald-400">{airborne.toLocaleString()} airborne</span>
          <span className="text-amber-400">{ground.toLocaleString()} ground</span>
          {filtersActive && (
            <span className="text-sky-400">
              ({unfilteredCount.toLocaleString()} unfiltered)
            </span>
          )}
        </div>
      </div>
    </>
  );
}
