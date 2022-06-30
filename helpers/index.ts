import { AirportData, FlightData } from "components/types";
declare const L: any;

export const initialMap = {
  "map.latitude": 51,
  "map.longitude": -2,
  "map.zoom": 4,
  openLayer: "Outdoors",
};

export const isProd = process.env.NODE_ENV === "production";

const isNum = (val: number) => {
  return !isNaN(val);
};

export const isInsideMapBound = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x: number,
  y: number
) => {
  if (x > x1 && x < x2 && y > y1 && y < y2) return true;

  return false;
};

export const checkLocalStorage = (key: string) => {
  return typeof window !== "undefined" && !!window.localStorage.getItem(key);
};

export const getInitial = (input: string) => {
  return checkLocalStorage(input)
    ? window.localStorage.getItem(input)
    : initialMap[input];
};

export const getInitialMapCenter = (mapParam: string): number => {
  return (
    // https://javascript.info/nullish-coalescing-operator
    checkPathname(mapParam) ?? getInitial(mapParam)
  );
};

export const checkPathname = (mapParam: string): number | undefined => {
  if (typeof window !== "undefined") {
    const pathArr = location.pathname.split("/");
    if (pathArr.length !== 3) {
      return undefined;
    }
    const latLng = pathArr[1];
    const zoom = pathArr[2];
    const [latitude, longitude] = latLng.split(",");

    switch (mapParam) {
      case "map.latitude":
        if (isNum(+`${latitude}`)) {
          return +`${latitude}`;
        }
        break;

      case "map.longitude":
        if (isNum(+`${longitude}`)) {
          return +`${longitude}`;
        }
        break;

      case "map.zoom":
        if (isNum(+`${zoom}`)) {
          return +`${zoom}`;
        }
        break;

      default:
        break;
    }

    return undefined;
  }
};

export const getClosest = (arr: number[], goal: number) =>
  arr.reduce(function (prev, curr) {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
  });

export const drawAircraftOnEachWorld = (
  flights: FlightData[],
  icon: any,
  markers: any,
  offset: number
) => {
  for (let i = 0; i < flights.length; i++) {
    const flight = flights[i];
    const { latitude, longitude, direction } = flight.geography;
    const { iataCode: arrivalIataCode } = flight.arrival;
    const { iataCode: departureIataCode } = flight.departure;

    const { icaoCode } = flight.aircraft;
    const { iataNumber, icaoNumber } = flight.flight;

    const angleArr = [
      0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225,
      240, 255, 270, 285, 300, 315, 330, 345, 360,
    ];

    // example: https://github.com/francoisromain/leaflet-markers-canvas/blob/master/examples/index.html
    const marker = L.marker(
      // [58.5578 + Math.random() * 1.8, 29.0087 + Math.random() * 3.6],
      [latitude, longitude + offset],
      { icon: icon(getClosest(angleArr, direction)) }
    )
      .bindPopup(icaoNumber)
      .on({
        mouseover(e) {
          this.openPopup();
        },
        mouseout(e) {
          this.closePopup();
        },
      });

    markers.push(marker);
  }
};

export const drawAirportsOnEachWorld = (
  airports: AirportData[],
  icon: any,
  markers: any,
  offset: number
) => {
  for (let i = 0; i < airports.length; i++) {
    const airport = airports[i];

    const {
      latitudeAirport,
      longitudeAirport,
      nameAirport,
      codeIataAirport,
      codeIcaoAirport,
    } = airport;

    const marker = L.marker([latitudeAirport, longitudeAirport + offset], {
      icon,
    })
      .bindPopup(
        `${nameAirport} Airport (${codeIataAirport}/${codeIcaoAirport})`
      )
      .on({
        mouseover(e) {
          this.openPopup();
        },
        mouseout(e) {
          this.closePopup();
        },
      });

    markers.push(marker);
  }
};

export const layerMap = (publicRuntimeConfig: any) => [
  // https://stackoverflow.com/questions/62923809/list-of-all-available-tile-layers-for-leaflet
  // https://leaflet-extras.github.io/leaflet-providers/preview/
  {
    name: "Outdoors",
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    url: "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png",
  },
  {
    name: "OpenTopoMap",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  },
  {
    name: "AlidadeSmooth",
    attribution:
      '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    url: `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png`,
  },
  {
    name: "Satellite",
    attribution:
      '&copy; <a href="https://www.maptiler.com/copyright" target="_blank">MapTiler</a> &copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    url: `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${publicRuntimeConfig.mapTilerToken}`,
  },
  {
    name: "Watercolor",
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: `https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg`,
  },
  {
    name: "TerrainBackground",
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: `https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png`,
  },
  {
    name: "WorldStreetMap",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
    url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}`,
  },
  // {
  //   name: "Mapbox Map",
  //   attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>',
  //   url: `https://api.mapbox.com/styles/v1/nhatvu148/ckmf0vdp2hj0817lkwm8z7a50/tiles/512/{z}/{x}/{y}@2x?access_token=${publicRuntimeConfig.mapboxToken}`,
  // }
];
