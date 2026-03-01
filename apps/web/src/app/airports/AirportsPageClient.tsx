"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAirports } from "@/hooks/useFlights";
import { TopBar } from "@/components/ui/TopBar";

const PAGE_SIZE = 25;

export function AirportsPageClient() {
  const { data: airports, isLoading } = useAirports();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!airports) return [];
    if (!search.trim()) return airports;
    const q = search.toLowerCase();
    return airports.filter(
      (a) =>
        a.codeIataAirport?.toLowerCase().includes(q) ||
        a.nameAirport?.toLowerCase().includes(q) ||
        a.nameCountry?.toLowerCase().includes(q) ||
        a.codeIataCity?.toLowerCase().includes(q)
    );
  }, [airports, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200">
      <TopBar />
      <div className="pt-16 px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Airports</h1>
          <span className="text-sm text-slate-400">
            {filtered.length.toLocaleString()} airports
          </span>
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search by IATA, name, city, or country..."
          className="w-full h-9 px-3 mb-4 rounded bg-slate-800/80 border border-slate-600/50 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500/50 transition-colors"
        />

        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading airports...</div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-700/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50 bg-slate-800/40">
                    <th className="text-left px-3 py-2 text-slate-400 font-medium">IATA</th>
                    <th className="text-left px-3 py-2 text-slate-400 font-medium">Name</th>
                    <th className="text-left px-3 py-2 text-slate-400 font-medium hidden sm:table-cell">City</th>
                    <th className="text-left px-3 py-2 text-slate-400 font-medium hidden md:table-cell">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((airport) => (
                    <tr
                      key={airport.codeIataAirport}
                      className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-3 py-2">
                        <Link
                          href={`/airport/${airport.codeIataAirport}`}
                          className="text-sky-400 hover:text-sky-300 font-mono font-medium transition-colors"
                        >
                          {airport.codeIataAirport}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-slate-300">{airport.nameAirport}</td>
                      <td className="px-3 py-2 text-slate-400 hidden sm:table-cell">
                        {airport.codeIataCity}
                      </td>
                      <td className="px-3 py-2 text-slate-400 hidden md:table-cell">
                        {airport.nameCountry}
                      </td>
                    </tr>
                  ))}
                  {pageData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                        No airports found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 mb-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700/50 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-400">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-xs rounded bg-slate-800 border border-slate-700/50 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
