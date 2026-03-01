"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ZoomControl,
  ScaleControl,
  useMapEvents,
} from "react-leaflet";
import { useSearchParams } from "next/navigation";
import "leaflet/dist/leaflet.css";
import { getTileLayers, MAP_DEFAULTS } from "@flight-tracker/config";
import { useMapStore } from "@/stores/map-store";
import { FlightMarkers, getMarkerClicked } from "./FlightMarkers";
import { AirportMarkers } from "./AirportMarkers";
import { FlightTrail } from "./FlightTrail";

function updateUrlState(lat: number, lng: number, z: number) {
  const url = new URL(window.location.href);
  url.searchParams.set("lat", lat.toFixed(4));
  url.searchParams.set("lng", lng.toFixed(4));
  url.searchParams.set("zoom", String(z));
  window.history.replaceState(null, "", url.toString());
}

function MapEventHandler() {
  const { setCenter, setZoom, setBounds, selectFlight } = useMapStore();
  const searchParams = useSearchParams();
  const initialFlyDone = useRef(false);

  const map = useMapEvents({
    moveend(e) {
      const m = e.target;
      const c = m.getCenter();
      setCenter({ lat: c.lat, lng: c.lng });
      const b = m.getBounds();
      setBounds({
        north: b.getNorth(),
        south: b.getSouth(),
        east: b.getEast(),
        west: b.getWest(),
      });
      updateUrlState(c.lat, c.lng, m.getZoom());
    },
    zoomend(e) {
      const z = e.target.getZoom();
      setZoom(z);
      const c = e.target.getCenter();
      updateUrlState(c.lat, c.lng, z);
    },
    click() {
      // Skip deselect if a marker was just clicked (both fire on same map click)
      if (!getMarkerClicked()) {
        selectFlight(null);
      }
    },
  });

  // Set initial bounds on mount so flights load immediately
  useEffect(() => {
    const b = map.getBounds();
    setBounds({
      north: b.getNorth(),
      south: b.getSouth(),
      east: b.getEast(),
      west: b.getWest(),
    });
  }, [map, setBounds]);

  // Fly to coordinates from URL params on initial load only
  useEffect(() => {
    if (initialFlyDone.current) return;
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const z = searchParams.get("zoom");
    if (lat && lng) {
      initialFlyDone.current = true;
      map.flyTo(
        [parseFloat(lat), parseFloat(lng)],
        z ? parseInt(z, 10) : 12,
        { duration: 1.5 }
      );
    }
  }, [map, searchParams]);

  return null;
}

export default function FlightMap() {
  const { center, zoom, activeLayer } = useMapStore();
  const mapTilerToken = process.env.NEXT_PUBLIC_MAPTILER_TOKEN;
  const layers = getTileLayers(mapTilerToken);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom
      touchZoom
      minZoom={MAP_DEFAULTS.minZoom}
      maxZoom={MAP_DEFAULTS.maxZoom}
      zoomControl={false}
      worldCopyJump
      style={{ position: "fixed", top: 0, height: "100%", width: "100%" }}
    >
      <MapEventHandler />

      <LayersControl collapsed position="bottomright" sortLayers>
        {layers.map((layer) => (
          <LayersControl.BaseLayer
            key={layer.name}
            checked={layer.name === activeLayer}
            name={layer.name}
          >
            <TileLayer attribution={layer.attribution} url={layer.url} />
          </LayersControl.BaseLayer>
        ))}
      </LayersControl>

      <AirportMarkers />
      <FlightMarkers />
      <FlightTrail />
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" />
    </MapContainer>
  );
}
