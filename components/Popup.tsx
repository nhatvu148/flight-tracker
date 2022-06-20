import { FC } from "react";
import { Marker, Popup, useMapEvents /*,Tooltip*/ } from "react-leaflet";
import { Icon } from "leaflet";
// import { Link } from "react-router-dom";
// import format from "formatcoords";

interface ILocationMarker {
  latitude: number;
  longitude: number;
  position: any;
  center: any;
  zoom: any;
  shipname: string;
  shipowner: string;
  registerdate: string;
  duration: string;
}

const ShipIcon = new Icon({
  iconUrl:
    // "https://cdn1.iconfinder.com/data/icons/maps-and-navigation-free/32/Maps_Maps_Navigation_Direction_Arrow_Pointer-22-512.png",
    "aircraft.svg",
  iconSize: [23, 23],
  className: "filter-green"
});

const LocationMarker: FC<ILocationMarker> = ({
  latitude,
  longitude,
  position,
  center,
  zoom,
  shipname,
  duration,
}) => {
  const map = useMapEvents({
    locationfound(e) {
      map.flyTo(position, map.getZoom());
      map.setView(center, zoom);
    },
  });

  // const formatcoords = require("formatcoords");
  // const tempposition: string = formatcoords(latitude, longitude).format("X DDMMs", {
  //   latLonSeparator: ", ",
  //   decimalPlaces: 3
  // });

  // const formatpos: string[] = tempposition.split(",");

  return position === null ? null : (
    <Marker position={position} icon={ShipIcon}>
      <Popup>
        <h2>SHIP NAME: {shipname}</h2>
        {/* <img id="img1" src={ShipPic} alt="ship"></img> */}
        <p id="pcustom1">
          {/* <Link id="linkbutton1" to="/admin/dashboard">
                        Report
                    </Link>
                    <Link id="linkbutton2" to="/admin/shipInformation">
                        Vessel Details
                    </Link> */}
        </p>
        <table id="tbcustom1">
          <tr>
            <td width="auto">
              Status: <br />
              <span id="spancustom1">Transit</span>
            </td>
            <td width="auto">
              Location: <br />
              Latitude: <b>{latitude}</b> | Longitude: <b>{longitude}</b>
            </td>
          </tr>
        </table>
        <p id="pcustom3">Received: {duration}</p>
      </Popup>
      {/* <Tooltip direction="auto" sticky={true} opacity={1} permanent={false}>
        <p id="customTooltip">
          <b>{shipname}</b> <br />
          Coordinate:&nbsp;
          <b>
            {formatpos[0]},{formatpos[1]}
          </b>
          <br />
          Position received:&nbsp;
          <b>{duration}</b>
        </p>
      </Tooltip> */}
    </Marker>
  );
};

export default LocationMarker;
