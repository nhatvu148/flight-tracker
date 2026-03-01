"use client";

import dynamic from "next/dynamic";

const FlightMap = dynamic(() => import("./FlightMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
      Loading map...
    </div>
  ),
});

export function MapLoader() {
  return <FlightMap />;
}
