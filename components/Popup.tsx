import { FC, useEffect } from "react";
declare const L: any;
import { useMap, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import Link from "next/link";
import { makeStyles } from "@material-ui/core";

import "node_modules/leaflet-markers-canvas/src/leaflet-markers-canvas.js";
import javascriptStyles from "styles/jss/nextjs-material-kit-pro/pages/componentsSections/javascriptStyles.js";
import { AirportData, FlightData } from "./types";
import { useQuery, UseQueryResult } from "react-query";
import { getAirports } from "api/airports";

// @ts-ignore
const useStyles = makeStyles(javascriptStyles);

interface ILocationMarker {
  flights: FlightData[];
}

const AircraftIcon = (direction: number) => new Icon({
  iconUrl:
    // "https://cdn1.iconfinder.com/data/icons/maps-and-navigation-free/32/Maps_Maps_Navigation_Direction_Arrow_Pointer-22-512.png",
    "aircraft.svg",
  iconSize: [25, 25],
  className: "aircraft"
});

const LocationMarker: FC<ILocationMarker> = ({ flights }) => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    // @ts-ignore
    const markersCanvas = new L.MarkersCanvas();
    markersCanvas.addTo(map);

    const mouse = L.control.mouseCoordinate({ position: "bottomright" });
    mouse.addTo(map);

    const icon = L.icon({
      iconUrl: "aircraft.svg",
      iconSize: [25, 25],
      iconAnchor: [10, 0],
    });

    const markers = [];

    for (let i = 0; i < flights.length; i++) {
      const flight = flights[i];
      const { latitude, longitude } = flight.geography;
      const { iataCode: arrivalIataCode } = flight.arrival;
      const { iataCode: departureIataCode } = flight.departure;

      const { icaoCode } = flight.aircraft;
      const { iataNumber, icaoNumber } = flight.flight;

      // example: https://github.com/francoisromain/leaflet-markers-canvas/blob/master/examples/index.html
      const marker = L.marker(
        // [58.5578 + Math.random() * 1.8, 29.0087 + Math.random() * 3.6],
        [latitude, longitude],
        { icon }
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

    markersCanvas.addMarkers(markers);

  }, [map, flights])

  // const map = useMapEvents({
  //   locationfound(e) {
  //     map.flyTo(position, map.getZoom());
  //     map.setView(center, zoom);
  //   },
  // });
  const classes = useStyles();
  const { data: airports }: UseQueryResult<AirportData, Error> = useQuery("airports", getAirports);

  return null;
  // position === null ? null : (
  //   <Marker position={position} icon={AircraftIcon(360)}>
  //     <Popup>
  //       <h2>{iataNumber}/{icaoNumber}</h2>
  //       <img id="img1" src={"https://cdn.jetphotos.com/full/6/30981_1637499162.jpg"} alt="ship" width="300"></img>
  //       {/* <p id="pcustom1">
  //         <Link id="linkbutton1" href="/admin/dashboard">
  //           Report
  //         </Link>
  //         <Link id="linkbutton2" href="/admin/shipInformation">
  //           Vessel Details
  //         </Link>
  //       </p> */}
  //       <p id="pcustom3">From {airports[departureIataCode]} ({departureIataCode}) To {airports[arrivalIataCode]} ({arrivalIataCode})</p>
  //       Aircraft Type: <br />
  //       <span id="spancustom1">{icaoCode}</span>
  //       Location: <br />
  //       Latitude: <b>{latitude}</b> | Longitude: <b>{longitude}</b>
  //     </Popup>
  //     {/* <Tooltip
  //       id="tooltip-left"
  //       title="Tooltip on left"
  //       placement="left"
  //       classes={{ tooltip: classes.tooltip }}
  //       onMouseOver={() => {
  //         console.log("Mouse over")
  //       }}
  //     >
  //       <h1 id="customTooltip">
  //         {icaoNumber}
  //       </h1>
  //     </Tooltip> */}
  //     {/* <Tooltip title="Add" placement="left">
  //       <Button>top-start</Button>
  //     </Tooltip> */}

  //   </Marker>
  // );
};

export default LocationMarker;
