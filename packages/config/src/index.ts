export const MAP_DEFAULTS = {
  center: { lat: 51, lng: -2 } as const,
  zoom: 4,
  minZoom: 2,
  maxZoom: 15,
  defaultLayer: "CartoVoyager",
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
      name: "CartoVoyager",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    },
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

// Altitude bands for color-coded aircraft markers (altitude in feet)
export interface AltitudeBand {
  label: string;
  minFt: number;
  maxFt: number;
  fill: string;
  stroke: string;
}

export const ALTITUDE_BANDS: AltitudeBand[] = [
  { label: "Ground",  minFt: -Infinity, maxFt: 0,     fill: "rgb(150,150,150)", stroke: "rgb(80,80,80)" },
  { label: "0-5K",    minFt: 0,         maxFt: 5000,  fill: "rgb(220,60,60)",   stroke: "rgb(120,20,20)" },
  { label: "5-15K",   minFt: 5000,      maxFt: 15000, fill: "rgb(230,140,30)",  stroke: "rgb(130,70,0)" },
  { label: "15-25K",  minFt: 15000,     maxFt: 25000, fill: "rgb(242,204,39)",  stroke: "rgb(80,60,0)" },
  { label: "25-35K",  minFt: 25000,     maxFt: 35000, fill: "rgb(60,180,75)",   stroke: "rgb(20,100,30)" },
  { label: "35-45K",  minFt: 35000,     maxFt: 45000, fill: "rgb(60,120,216)",  stroke: "rgb(20,50,120)" },
  { label: "45K+",    minFt: 45000,     maxFt: Infinity, fill: "rgb(150,60,200)", stroke: "rgb(80,20,110)" },
];

/**
 * Get the altitude band index for a given altitude in meters.
 * Returns 0 (ground) for on-ground aircraft.
 */
export function getAltitudeBand(altitudeMeters: number, isGround: boolean): number {
  if (isGround) return 0;
  const altFt = altitudeMeters * 3.28084;
  for (let i = ALTITUDE_BANDS.length - 1; i >= 0; i--) {
    if (altFt >= ALTITUDE_BANDS[i].minFt) return i;
  }
  return 0;
}

export const API_CONFIG = {
  defaultPort: 5005,
  flightCacheTTL: 30, // seconds
  airportCacheTTL: 86400, // 24 hours
  weatherCacheTTL: 900, // 15 minutes
} as const;

export const WEB_CONFIG = {
  defaultPort: 3589,
  pollInterval: 30_000, // 30s for live flight updates
} as const;
