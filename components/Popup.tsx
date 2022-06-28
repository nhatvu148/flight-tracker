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
import styles from "styles/Popup.module.scss";
import {
  drawAircraftOnEachWorld,
  drawAirportsOnEachWorld,
} from "helper/functions";

// @ts-ignore
const useStyles = makeStyles(javascriptStyles);

interface ILocationMarker {
  flights: FlightData[];
  airports: AirportData[];
  zoom: number;
}

const LocationMarker: FC<ILocationMarker> = ({ flights, airports, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (map && flights) {
      map.invalidateSize();

      // @ts-ignore
      const markersCanvas = new L.MarkersCanvas();
      markersCanvas.addTo(map);

      const mouse = L.control.mouseCoordinate({ position: "bottomright" });
      mouse.addTo(map);
      const icon = () => (angle: number) =>
        L.divIcon({
          iconUrl: `aircrafts-type-1/aircraft-${angle}.svg`, // "https://cdn1.iconfinder.com/data/icons/maps-and-navigation-free/32/Maps_Maps_Navigation_Direction_Arrow_Pointer-22-512.png",
          iconSize: [30, 30],
          iconAnchor: [10, 0],
          popupAnchor: [5, 0],
          // className: styles.rotate,
        });

      const markers = [];

      drawAircraftOnEachWorld(flights, icon(), markers, 0);
      drawAircraftOnEachWorld(flights, icon(), markers, -360);
      drawAircraftOnEachWorld(flights, icon(), markers, 360);

      markersCanvas.addMarkers(markers);

      // markersCanvas.removeMarkers(markers);
    }

    // if (airports) {
    //   console.log(zoom)
    //   const airportIcon = L.divIcon({
    //     iconUrl: `location.png`,
    //     iconSize: [20, 20],
    //     iconAnchor: [10, 0],
    //     popupAnchor: [5, 0],
    //   });
    //   const airportMarkers = [];

    //   drawAirportsOnEachWorld(airports, airportIcon, airportMarkers, zoom, 0);
    //   drawAirportsOnEachWorld(airports, airportIcon, airportMarkers, zoom,  -360);
    //   drawAirportsOnEachWorld(airports, airportIcon, airportMarkers, zoom, 360);

    //   markersCanvas.addMarkers(airportMarkers);
    // }
  }, [map, flights, airports]);

  // const map = useMapEvents({
  //   locationfound(e) {
  //     map.flyTo(position, map.getZoom());
  //     map.setView(center, zoom);
  //   },
  // });
  const classes = useStyles();
  // const { data: airports }: UseQueryResult<AirportData, Error> = useQuery("airportås", getAirports);

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
