import { MapLoader } from "@/components/map/MapLoader";
import { AltitudeLegend } from "@/components/map/AltitudeLegend";
import { TopBar } from "@/components/ui/TopBar";
import { FlightSidebar } from "@/components/ui/FlightSidebar";
import { FlightDetailPanel } from "@/components/ui/FlightDetailPanel";
import { BottomToolbar } from "@/components/ui/BottomToolbar";

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <MapLoader />
      <TopBar />
      <AltitudeLegend />
      <FlightSidebar />
      <FlightDetailPanel />
      <BottomToolbar />
    </main>
  );
}
