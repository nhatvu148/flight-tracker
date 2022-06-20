import { FC, useState } from "react";
import {
    MapContainer,
    TileLayer,
    LayersControl,
    ScaleControl,
    Marker,
    Popup,
    useMapEvents
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
import { AirportData, FlightData } from "./types";

const { publicRuntimeConfig } = getConfig();

function ZoomLevel() {
    const [zoomLevel, setZoomLevel] = useState(5); // initial zoom level provided for MapContainer

    const mapEvents = useMapEvents({
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom());
        },
    });

    console.log(zoomLevel);
    console.log("center: ", mapEvents.getCenter())
    // To do: create dynamic route with variable center coordinates

    return null
}

interface IProps {
    flights: FlightData[];
    airports: AirportData;
}

const Main: FC<IProps> = ({ flights, airports }) => {
    const { latitude, longitude } = flights[2]?.geography;
    const { iataCode: arrivalIataCode } = flights[2]?.arrival;
    const { iataCode: departureIataCode } = flights[2]?.departure;

    const { icaoCode } = flights[2]?.aircraft;
    const { iataNumber, icaoNumber } = flights[2]?.flight;

    const [mapcenter, setMapcenter] = useState({ lat: latitude ?? 0, lng: longitude ?? 0 });
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                {/* <MapContainer
                    center={[40.8054, -74.0241]}
                    zoom={14}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${publicRuntimeConfig.mapboxToken}`}
                        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
                    />
                    <Marker
                        position={[40.8054, -74.0241]}
                        draggable={true}
                    // animate={true}
                    >
                        <Popup>Hey ! I live here</Popup>
                    </Marker>
                </MapContainer> */}

                <MapContainer
                    center={mapcenter}
                    zoom={6}
                    scrollWheelZoom={true}
                    touchZoom={true}
                    minZoom={2}
                    maxZoom={15}
                    zoomControl={false}
                    // whenCreated={(mapInstance: any) => {
                    //     setRefMap(mapInstance);
                    //     mapInstance.invalidateSize();
                    // }}
                    id="mapcontainer"
                    style={{
                        position: "fixed",
                        top: 0,
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <ZoomLevel />
                    <LayersControl collapsed={true} position="topright">
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
                        <LayersControl.BaseLayer checked={false} name="Satellite Mediumres 2016">
                            <TileLayer
                                attribution='&copy; <a href="https://www.maptiler.com/copyright"target="_blank">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url={`https://api.maptiler.com/tiles/satellite-mediumres/{z}/{x}/{y}.jpg?key=${publicRuntimeConfig.mapTilerToken}`}
                            />
                        </LayersControl.BaseLayer>
                        <LayersControl.BaseLayer checked={true} name="Satellite">
                            <TileLayer
                                attribution='&copy; <a href="https://www.maptiler.com/copyright" target="_blank">MapTiler</a> &copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors'
                                url={`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${publicRuntimeConfig.mapTilerToken}`}
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <LocationMarker
                        latitude={mapcenter.lat}
                        longitude={mapcenter.lng}
                        position={mapcenter}
                        center={mapcenter}
                        zoom={3.5}
                        icaoCode={icaoCode}
                        icaoNumber={icaoNumber}
                        iataNumber={iataNumber}
                        arrivalIataCode={arrivalIataCode}
                        departureIataCode={departureIataCode}
                        airports={airports}
                    />
                    <ScaleControl position="bottomleft"></ScaleControl>
                </MapContainer>
            </main>
        </div>
    );
};

export default Main;
