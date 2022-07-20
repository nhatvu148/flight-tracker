import { FC, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ScaleControl,
  ZoomControl,
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
import { connect } from "react-redux";
import { IMainState, IAppState } from "redux/types";
import ZoomLevel from "./ZoomLevel";
import { getMain } from "redux/selectors";
import { layerMap } from "helpers";
import { useWS } from "./WSProvider";

const { publicRuntimeConfig } = getConfig();

interface IStateProps {
  main: IMainState;
}

type IProps = IStateProps;

const Main: FC<IProps> = ({ main: { mapCenter, zoom, openLayer } }) => {
  const socket = useWS();
  useEffect(() => {
    socket.onopen = () => {
      console.log("Connected");
    };

    socket.onmessage = (e) => {
      console.log("Get message from server: " + e.data);
    };

    socket.send(
      JSON.stringify({
        message: "inputValue",
      })
    );
  }, [socket]);

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
          worldCopyJump={true}
          id="mapcontainer"
          style={{
            position: "fixed",
            top: 0,
            height: "100%",
            width: "100%",
          }}
        >
          <ZoomLevel />
          <LayersControl
            collapsed={true}
            position="bottomright"
            sortLayers={true}
          >
            {layerMap(publicRuntimeConfig).map((layer, id: number) => {
              return (
                <LayersControl.BaseLayer
                  checked={layer.name === openLayer}
                  name={layer.name}
                  key={id}
                >
                  <TileLayer attribution={layer.attribution} url={layer.url} />
                </LayersControl.BaseLayer>
              );
            })}
          </LayersControl>
          <LocationMarker />
          <ZoomControl position="bottomright" />
          <ScaleControl position="bottomleft" />
        </MapContainer>
      </main>
    </div>
  );
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  main: getMain(state),
});

export default connect(mapStateToProps)(Main);
