import { FC } from "react";
import {
    MapContainer,
    TileLayer,
    LayersControl,
    ScaleControl,
    useMap,
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
import { FlightData } from "./types";
import { useQuery, UseQueryResult } from "react-query";
import { getFlights } from "api/flights";
import { connect } from "react-redux";
import { IAppState } from "redux/types";
import { IMainState } from "redux/types";
import ZoomLevel from "./ZoomLevel";
import { getMain } from "redux/selectors";

const { publicRuntimeConfig } = getConfig();

interface IStateProps {
    main: IMainState;
}

type IProps = IStateProps;

const Main: FC<IProps> = ({
    main: { bounds: { west, east, south, north }, mapCenter, zoom },
}) => {
    // query from cache, no need to pass through props
    const { data: flights, isLoading }: UseQueryResult<FlightData[], Error> = useQuery("flights", () => getFlights());
    console.log({ isLoading });

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
                    <LocationMarker flights={flights} />
                    <ScaleControl position="bottomleft"></ScaleControl>
                </MapContainer>
            </main>
        </div>
    );
};

const mapStateToProps = (state: IAppState): IStateProps => ({
    main: getMain(state)
});

export default connect(mapStateToProps)(Main);
