import { FC, useEffect, useRef, useState } from "react";
declare const L: any;
import { useMap, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import Link from "next/link";
import { makeStyles } from "@material-ui/core";

import "node_modules/leaflet-markers-canvas/src/leaflet-markers-canvas.js";
import javascriptStyles from "styles/jss/nextjs-material-kit-pro/pages/componentsSections/javascriptStyles.js";
import { AirportData, FlightData, Geography } from "./types";
import { useQuery, UseQueryResult } from "react-query";
import { getAirports } from "api/airports";
import styles from "styles/Popup.module.scss";
import {
  drawAircraftOnEachWorld,
  drawAirportsOnEachWorld,
  getColor,
} from "helpers";
import { IAppState, IMainState } from "redux/types";
import { getMain } from "redux/selectors";
import { connect } from "react-redux";
import { getFlights } from "api/flights";
import terminator from "components/LeafletTerminator";
import update from "components/ImmutabilityHelper";
// @ts-ignore
import { CalculationRequest } from "pb/flight_pb";
import { FlightServiceClient } from "pb/flight_grpc_web_pb";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { setEFlights } from "redux/actions/mainActions";

const client = new FlightServiceClient(`/envoy`, null, null);

// @ts-ignore
const useStyles = makeStyles(javascriptStyles);

interface IStateProps {
  main: IMainState;
}

interface IDispatchProps {
  dispatch?: ThunkDispatch<{}, {}, AnyAction>;
  setEFlights: (
    newData: Geography[]
  ) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => void;
}

type IProps = IStateProps & IDispatchProps;

const defaultgeojson = [
  {
    type: "Feature",
    properties: { id: 1, elevation: 500 },
    geometry: {
      type: "LineString",
      coordinates: [
        [0, 0],
        [0, 0],
      ],
    },
  },
  {
    type: "Feature",
    properties: { id: 2, elevation: 2000 },
    geometry: {
      type: "LineString",
      coordinates: [
        [0, 0],
        [0, 0],
      ],
    },
  },
];

const LocationMarker: FC<IProps> = ({
  main: { zoom, eFlights },
  setEFlights,
}) => {
  const map = useMap();
  const markersCanvas = useRef(null);
  const currentZoom = useRef(zoom);
  const aircraftMarkers = useRef([]);
  const airportMarkers = useRef([]);
  const [selectedAirports, setSelectedAirports] = useState(defaultgeojson);
  const [geoJsonLayer, setGeoJsonLayer] = useState(null);
  // const [{ eFlights }] = useEFlights();

  // query from cache, no need to pass through props
  const { data: flights }: UseQueryResult<FlightData[], Error> = useQuery(
    "flights",
    () => getFlights()
  );
  const { data: airports }: UseQueryResult<AirportData[], Error> = useQuery(
    "airports",
    () => getAirports()
  );

  const getGeo = (name: string, command: string) => {
    console.log("called");

    const calculationRequest = new CalculationRequest();
    calculationRequest.setName(name);
    calculationRequest.setCalculationCommand(command);
    const stream = client.getPercentage(calculationRequest, {});
    stream.on("data", function (response: any) {
      const res = response.getGeographyList();
      console.log(res[0].array);

      const geo = res.map((r) => {
        const [, h, x, y] = r.array;
        return {
          altitude: 0,
          direction: h,
          latitude: x,
          longitude: y,
        };
      });
      setEFlights(geo);
    });
    stream.on("end", function () {
      console.log("end");
    });
  };

  useEffect(() => {
    getGeo("hello", "world");
  }, []);

  useEffect(() => {
    if (markersCanvas.current === null) {
      map.invalidateSize();

      // @ts-ignore
      markersCanvas.current = new L.MarkersCanvas();
      markersCanvas.current.addTo(map);

      const mouse = L.control.mouseCoordinate({ position: "bottomleft" });
      mouse.addTo(map);
      const term = terminator();
      term.addTo(map);
      setInterval(function () {
        term.setTime();
      }, 1000);

      map.createPane("pane250").style.zIndex = "250"; // between tiles and overlays
      map.createPane("pane450").style.zIndex = "450"; // between overlays and shadows
      map.createPane("pane620").style.zIndex = "620"; // between markers and tooltips
      map.createPane("pane800").style.zIndex = "800"; // above popups
    }

    if (map && flights && markersCanvas && markersCanvas.current) {
      const icon = () => (angle: number) =>
        L.divIcon({
          iconUrl: `/aircrafts-type-1/aircraft-${angle}.svg`, // "https://cdn1.iconfinder.com/data/icons/maps-and-navigation-free/32/Maps_Maps_Navigation_Direction_Arrow_Pointer-22-512.png",
          iconSize: [25, 25],
          iconAnchor: [10, 10],
          popupAnchor: [5, 0],
          // className: styles.rotate,
        });

      aircraftMarkers.current = [];

      drawAircraftOnEachWorld(
        flights,
        eFlights,
        airports,
        icon(),
        aircraftMarkers.current,
        0,
        setSelectedAirports
      );
      drawAircraftOnEachWorld(
        flights,
        eFlights,
        airports,
        icon(),
        aircraftMarkers.current,
        -360,
        setSelectedAirports
      );
      drawAircraftOnEachWorld(
        flights,
        eFlights,
        airports,
        icon(),
        aircraftMarkers.current,
        360,
        setSelectedAirports
      );

      markersCanvas.current.addMarkers(aircraftMarkers.current);
    }
    return () => {
      if (map && markersCanvas && markersCanvas.current) {
        // markersCanvas.current.clear();
        markersCanvas.current.removeMarkers(aircraftMarkers.current);
      }
    };
  }, [map, flights, eFlights]);

  // useEffect(() => {
  //   const departureAirport = airports.find(
  //     (airport) => airport.codeIataAirport === departureIataCode
  //   );
  //   const arrivalAirport = airports.find(
  //     (airport) => airport.codeIataAirport === arrivalIataCode
  //   );

  //   const { latitudeAirport: latDepart, longitudeAirport: lonDepart } =
  //           departureAirport;
  //         const { latitudeAirport: latArrive, longitudeAirport: lonArrive } =
  //           arrivalAirport;

  //   setSelectedAirports((prev) =>
  //     update(prev, {
  //       0: {
  //         geometry: {
  //           coordinates: {
  //             0: { $set: [lonDepart + offset, latDepart] },
  //             1: { $set: [longitude + offset, latitude] },
  //           },
  //         },
  //       },
  //       1: {
  //         geometry: {
  //           coordinates: {
  //             0: { $set: [longitude + offset, latitude] },
  //             1: { $set: [lonArrive + offset, latArrive] },
  //           },
  //         },
  //       },
  //     })
  //   );
  // }, [eFlights])

  useEffect(() => {
    if (geoJsonLayer) {
      geoJsonLayer.clearLayers();
    }
    const _geoJsonLayer = L.geoJSON(selectedAirports, {
      pane: "pane250",
      style: function (feature) {
        return {
          color: getColor(feature.properties.elevation),
          opacity: 0.8,
          weight: 3,
          dashArray: feature.properties.id === 1 ? "0, 0" : "20, 20",
          dashOffset: "0",
        };
      },
    }).addTo(map);
    setGeoJsonLayer(_geoJsonLayer);
  }, [map, selectedAirports]);

  useEffect(() => {
    if (map && airports && markersCanvas && markersCanvas.current) {
      const airportIcon = L.divIcon({
        // https://github.com/pointhi/leaflet-color-markers
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png`,
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [12, 20],
        iconAnchor: [6, 20],
        popupAnchor: [1, -17],
        shadowSize: [20, 20],
      });

      //// To do: when zoom is smaller than 6 => reduce the number of displayed airports
      // let airportsSlice = zoom >= 6 ? airports : airports.slice(0, 100);
      // if (currentZoom.current < 6 && zoom < currentZoom.current) {
      //   markersCanvas.current.removeMarkers(airportMarkers.current);
      // }

      let airportsSlice = airports;
      drawAirportsOnEachWorld(
        airportsSlice,
        airportIcon,
        airportMarkers.current,
        0
      );
      drawAirportsOnEachWorld(
        airportsSlice,
        airportIcon,
        airportMarkers.current,
        -360
      );
      drawAirportsOnEachWorld(
        airportsSlice,
        airportIcon,
        airportMarkers.current,
        360
      );

      markersCanvas.current.addMarkers(airportMarkers.current);
      // currentZoom.current = zoom;
    }

    return () => {
      if (map && markersCanvas && markersCanvas.current) {
        markersCanvas.current.removeMarkers(airportMarkers.current);
      }
    };
  }, [map, airports, markersCanvas]);

  // const map = useMapEvents({
  //   locationfound(e) {
  //     map.flyTo(position, map.getZoom());
  //     map.setView(center, zoom);
  //   },
  // });
  const classes = useStyles();

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

const mapStateToProps = (state: IAppState): IStateProps => ({
  main: getMain(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  return {
    ...bindActionCreators(
      {
        setEFlights,
      },
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationMarker);
