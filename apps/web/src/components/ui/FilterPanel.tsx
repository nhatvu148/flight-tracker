"use client";

import { useMapStore } from "@/stores/map-store";

function RangeRow({
  label,
  min,
  max,
  valueMin,
  valueMax,
  step,
  unit,
  onChangeMin,
  onChangeMax,
}: {
  label: string;
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  step: number;
  unit: string;
  onChangeMin: (v: number) => void;
  onChangeMax: (v: number) => void;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span>
        <span className="font-mono text-slate-300">
          {valueMin.toLocaleString()} – {valueMax.toLocaleString()} {unit}
        </span>
      </div>
      <div className="flex gap-2 items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChangeMin(Math.min(v, valueMax));
          }}
          className="flex-1 accent-sky-500 h-1"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChangeMax(Math.max(v, valueMin));
          }}
          className="flex-1 accent-sky-500 h-1"
        />
      </div>
    </div>
  );
}

export function FilterPanel() {
  const filters = useMapStore((s) => s.filters);
  const setFilters = useMapStore((s) => s.setFilters);
  const resetFilters = useMapStore((s) => s.resetFilters);
  const filterPanelOpen = useMapStore((s) => s.filterPanelOpen);
  const setFilterPanelOpen = useMapStore((s) => s.setFilterPanelOpen);

  if (!filterPanelOpen) return null;

  return (
    <div
      className="fixed bottom-12 left-1/2 -translate-x-1/2 w-80 bg-[#1a1d21]/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl p-4"
      style={{ zIndex: 1002 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-200">Filters</span>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setFilterPanelOpen(false)}
            className="p-0.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <RangeRow
        label="Altitude"
        min={0}
        max={60000}
        step={1000}
        unit="ft"
        valueMin={filters.altMinFt}
        valueMax={filters.altMaxFt}
        onChangeMin={(v) => setFilters({ altMinFt: v })}
        onChangeMax={(v) => setFilters({ altMaxFt: v })}
      />

      <RangeRow
        label="Speed"
        min={0}
        max={700}
        step={10}
        unit="kts"
        valueMin={filters.speedMinKts}
        valueMax={filters.speedMaxKts}
        onChangeMin={(v) => setFilters({ speedMinKts: v })}
        onChangeMax={(v) => setFilters({ speedMaxKts: v })}
      />

      <div className="flex gap-4 mt-2">
        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showGround}
            onChange={(e) => setFilters({ showGround: e.target.checked })}
            className="accent-sky-500"
          />
          Ground
        </label>
        <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.showAirborne}
            onChange={(e) => setFilters({ showAirborne: e.target.checked })}
            className="accent-sky-500"
          />
          Airborne
        </label>
      </div>
    </div>
  );
}
