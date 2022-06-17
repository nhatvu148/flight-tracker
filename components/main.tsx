import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ScaleControl,
  Marker,
  Popup,
} from "react-leaflet";
import styles from "../styles/Home.module.css";
import LocationMarker from "./Popup";
import "leaflet-easybutton";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "node_modules/leaflet-minimap/src/Control.MiniMap.js";
import "node_modules/leaflet-minimap/src/Control.MiniMap.css";
import "leaflet-sidebar-v2";
import "leaflet.mousecoordinatesystems";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const Main = () => {
  const [mapcenter, setMapcenter] = useState({ lat: 0, lng: 0 });
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <MapContainer
          center={[40.8054, -74.0241]}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${publicRuntimeConfig.mySecret}`}
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          />
          <Marker
            position={[40.8054, -74.0241]}
            draggable={true}
            // animate={true}
          >
            <Popup>Hey ! I live here</Popup>
          </Marker>
        </MapContainer>

        {/* <MapContainer
                    center={mapcenter}
                    zoom={3}
                    scrollWheelZoom={false}
                    touchZoom={false}
                    minZoom={2}
                    maxZoom={15}
                    zoomControl={false}
                    // whenCreated={(mapInstance: any) => {
                    //     setRefMap(mapInstance);
                    //     mapInstance.invalidateSize();
                    // }}
                    id="mapcontainer"
                >
                    <LayersControl collapsed={true} position="topright">
                        <LayersControl.BaseLayer checked={true} name="Standard Map">
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
                        <LayersControl.BaseLayer checked={false} name="Satellite">
                            <TileLayer
                                attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> &copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                                url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=j9tMlNCG1dseYi9nYu9k"
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <LocationMarker
                        latitude={mapcenter.lat}
                        longitude={mapcenter.lng}
                        position={mapcenter}
                        center={mapcenter}
                        zoom={3.5}
                        shipname={"shipname"}
                        shipowner={"shipowner"}
                        registerdate={"registerdate"}
                        duration={"duration"}
                    />
                    <ScaleControl position="bottomleft"></ScaleControl>
                </MapContainer> */}

        {/* <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: 400, width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer> */}

        {/* <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>

                <p className={styles.description}>
                    Get started by editing{' '}
                    <code className={styles.code}>pages/index.tsx</code>
                </p>

                <div className={styles.grid}>
                    <a href="https://nextjs.org/docs" className={styles.card}>
                        <h2>Documentation &rarr;</h2>
                        <p>Find in-depth information about Next.js features and API.</p>
                    </a>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h2>Learn &rarr;</h2>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>

                    <a
                        href="https://github.com/vercel/next.js/tree/canary/examples"
                        className={styles.card}
                    >
                        <h2>Examples &rarr;</h2>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h2>Deploy &rarr;</h2>
                        <p>
                            Instantly deploy your Next.js site to a public URL with Vercel.
                        </p>
                    </a>
                </div> */}
      </main>
    </div>
  );
};

export default Main;
