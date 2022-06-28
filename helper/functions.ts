import { AirportData, FlightData } from "@/types";
declare const L: any;

const initialMap = {
  "map.latitude": 51,
  "map.longitude": -2,
  "map.zoom": 4,
};

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

export const getInitialMapCenter = (mapParam: string): number => {
  console.log(checkPathname(mapParam));

  return (
    checkPathname(mapParam) ??
    (checkLocalStorage(mapParam)
      ? JSON.parse(window.localStorage.getItem(mapParam))
      : initialMap[mapParam])
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
