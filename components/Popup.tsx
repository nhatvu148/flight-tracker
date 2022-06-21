import { FC } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import Link from "next/link";
import { Button, makeStyles, Tooltip } from "@material-ui/core";

import javascriptStyles from "styles/jss/nextjs-material-kit-pro/pages/componentsSections/javascriptStyles.js";
import { AirportData } from "./types";
import { useQuery, UseQueryResult } from "react-query";
import { getAirports } from "api/airports";

// @ts-ignore
const useStyles = makeStyles(javascriptStyles);

interface ILocationMarker {
  latitude: number;
  longitude: number;
  position: any;
  center: any;
  // zoom: any;
  icaoNumber: string;
  iataNumber: string;
  arrivalIataCode: string;
  departureIataCode: string;
  icaoCode: string;
}

const AircraftIcon = new Icon({
  iconUrl:
    // "https://cdn1.iconfinder.com/data/icons/maps-and-navigation-free/32/Maps_Maps_Navigation_Direction_Arrow_Pointer-22-512.png",
    "aircraft.svg",
  iconSize: [25, 25],
  className: "aircraft"
});

const LocationMarker: FC<ILocationMarker> = ({
  latitude,
  longitude,
  position,
  center,
  // zoom,
  icaoNumber,
  iataNumber,
  arrivalIataCode,
  departureIataCode,
  icaoCode,
}) => {
  // const map = useMapEvents({
  //   locationfound(e) {
  //     map.flyTo(position, map.getZoom());
  //     map.setView(center, zoom);
  //   },
  // });
  const classes = useStyles();
  const { data: airports }: UseQueryResult<AirportData, Error> = useQuery("airports", getAirports);

  return position === null ? null : (
    <Marker position={position} icon={AircraftIcon}>
      <Popup>
        <h2>{iataNumber}/{icaoNumber}</h2>
        <img id="img1" src={"https://cdn.jetphotos.com/full/6/30981_1637499162.jpg"} alt="ship" width="300"></img>
        {/* <p id="pcustom1">
          <Link id="linkbutton1" href="/admin/dashboard">
            Report
          </Link>
          <Link id="linkbutton2" href="/admin/shipInformation">
            Vessel Details
          </Link>
        </p> */}
        <p id="pcustom3">From {airports[departureIataCode]} ({departureIataCode}) To {airports[arrivalIataCode]} ({arrivalIataCode})</p>
        Aircraft Type: <br />
        <span id="spancustom1">{icaoCode}</span>
        Location: <br />
        Latitude: <b>{latitude}</b> | Longitude: <b>{longitude}</b>
      </Popup>
      {/* <Tooltip
        id="tooltip-left"
        title="Tooltip on left"
        placement="left"
        classes={{ tooltip: classes.tooltip }}
        onMouseOver={() => {
          console.log("Mouse over")
        }}
      >
        <h1 id="customTooltip">
          {icaoNumber}
        </h1>
      </Tooltip> */}
      {/* <Tooltip title="Add" placement="left">
        <Button>top-start</Button>
      </Tooltip> */}

    </Marker>
  );
};

export default LocationMarker;
