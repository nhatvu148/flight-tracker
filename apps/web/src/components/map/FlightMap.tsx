"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ZoomControl,
  ScaleControl,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getTileLayers, MAP_DEFAULTS } from "@flight-tracker/config";
import { useMapStore } from "@/stores/map-store";
import { FlightMarkers, getMarkerClicked } from "./FlightMarkers";

function MapEventHandler() {
  const { setCenter, setZoom, setBounds, selectFlight } = useMapStore();

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
    },
    zoomend(e) {
      setZoom(e.target.getZoom());
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

      <FlightMarkers />
      <ZoomControl position="bottomright" />
      <ScaleControl position="bottomleft" />
    </MapContainer>
  );
}
