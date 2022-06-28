import { FlightData } from "@/types";

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

export const getClosest = (arr: number[], goal: number) =>
  arr.reduce(function (prev, curr) {
    return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
  });

export const drawOnEachWorld = (
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
