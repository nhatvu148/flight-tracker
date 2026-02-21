export const MAP_DEFAULTS = {
  center: { lat: 51, lng: -2 } as const,
  zoom: 4,
  minZoom: 2,
  maxZoom: 15,
  defaultLayer: "Mapnik",
} as const;

export const ANGLE_STEPS = [
  0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225,
  240, 255, 270, 285, 300, 315, 330, 345, 360,
] as const;

export interface TileLayerConfig {
  name: string;
  attribution: string;
  url: string;
}

export function getTileLayers(mapTilerToken?: string): TileLayerConfig[] {
  return [
    {
      name: "Mapnik",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
    {
      name: "OpenTopoMap",
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    },
    {
      name: "AlidadeSmoothDark",
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    },
    ...(mapTilerToken
      ? [
          {
            name: "Satellite",
            attribution:
              '&copy; <a href="https://www.maptiler.com/copyright" target="_blank">MapTiler</a> &copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
            url: `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${mapTilerToken}`,
          },
        ]
      : []),
    {
      name: "WorldStreetMap",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    },
  ];
}

export const API_CONFIG = {
  defaultPort: 5001,
  flightCacheTTL: 30, // seconds
  airportCacheTTL: 86400, // 24 hours
  weatherCacheTTL: 900, // 15 minutes
} as const;

export const WEB_CONFIG = {
  defaultPort: 3000,
  pollInterval: 30_000, // 30s for live flight updates
} as const;
