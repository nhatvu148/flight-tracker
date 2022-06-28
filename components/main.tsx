import { FC } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ScaleControl,
} from "react-leaflet";
import styles from "../styles/Home.module.css";
import LocationMarker from "./Popup";
import "leaflet-easybutton";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "node_modules/leaflet-minimap/src/Control.MiniMap.js";
import "node_modules/leaflet-minimap/src/Control.MiniMap.css";
import "node_modules/leaflet-markers-canvas/src/leaflet-markers-canvas.js";
import "leaflet-sidebar-v2";
import "leaflet.mousecoordinatesystems";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import getConfig from "next/config";
import { AirportData, FlightData } from "./types";
import { useQuery, UseQueryResult } from "react-query";
import { getFlights } from "api/flights";
import { connect } from "react-redux";
import { IMainState, IAppState } from "redux/types";
import ZoomLevel from "./ZoomLevel";
import { getMain } from "redux/selectors";
import { getAirports } from "api/airports";

const { publicRuntimeConfig } = getConfig();

interface IStateProps {
  main: IMainState;
}

type IProps = IStateProps;

const Main: FC<IProps> = ({
  main: {
    bounds: { west, east, south, north },
    mapCenter,
    zoom,
  },
}) => {
  // query from cache, no need to pass through props
  const { data: flights }: UseQueryResult<FlightData[], Error> = useQuery(
    "flights",
    () => getFlights()
  );
  const { data: airports }: UseQueryResult<AirportData[], Error> = useQuery(
    "airports",
    getAirports
  );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          scrollWheelZoom={true}
          touchZoom={true}
          minZoom={2}
          maxZoom={15}
          zoomControl={false}
          id="mapcontainer"
          style={{
            position: "fixed",
            top: 0,
            height: "100%",
            width: "100%",
          }}
          worldCopyJump={true}
        >
          <ZoomLevel />
          <LayersControl collapsed={true} position="topright">
            <LayersControl.BaseLayer checked={false} name="Mapbox Map">
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/nhatvu148/ckmf0vdp2hj0817lkwm8z7a50/tiles/512/{z}/{x}/{y}@2x?access_token=${publicRuntimeConfig.mapboxToken}`}
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked={false} name="Standard Map">
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked={false} name="Dark Map">
              <TileLayer
                attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer
              checked={false}
              name="Satellite Mediumres 2016"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.maptiler.com/copyright"target="_blank">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url={`https://api.maptiler.com/tiles/satellite-mediumres/{z}/{x}/{y}.jpg?key=${publicRuntimeConfig.mapTilerToken}`}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked={true} name="Satellite">
              <TileLayer
                noWrap={false}
                attribution='&copy; <a href="https://www.maptiler.com/copyright" target="_blank">MapTiler</a> &copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                url={`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${publicRuntimeConfig.mapTilerToken}`}
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <LocationMarker flights={flights} airports={airports} zoom={zoom} />
          <ScaleControl position="bottomleft"></ScaleControl>
        </MapContainer>
      </main>
    </div>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  main: getMain(state),
});

export default connect(mapStateToProps)(Main);
