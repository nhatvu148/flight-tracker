import { FC, useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";

import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { IAppState } from "redux/reducers";
import { IBounds } from "redux/types";
import { setBounds } from "redux/actions/mainActions";
import { LatLngBounds } from "leaflet";

const initialZoom = 4;
const initialLatitude = 51;
const initialLongitude = -2;

interface IStateProps {
    // main: IMainState;
}

interface IDispatchProps {
    dispatch?: ThunkDispatch<{}, {}, AnyAction>;
    setBounds: (newData: IBounds) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => void;
}

type IProps = IStateProps & IDispatchProps;

const ZoomLevel: FC<any> = ({ setBounds }) => {
    const [zoomLevel, setZoomLevel] = useState(initialZoom);
    const [localBounds, setLocalBounds] = useState<LatLngBounds>(null);
    const [latitude, setLatitude] = useState(initialLatitude);
    const [longitude, setLongitude] = useState(initialLongitude);

    const mapEvents = useMapEvents({
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom());
        },
        moveend: () => {
            setLocalBounds(mapEvents.getBounds());
            const { lat, lng } = mapEvents.getCenter();
            setLatitude(lat);
            setLongitude(lng);
        }
    });

    useEffect(() => {
        window.localStorage.setItem("map.latitude", latitude.toString());
        window.localStorage.setItem("map.longitude", longitude.toString());
    }, [latitude, longitude])


    useEffect(() => {
        window.localStorage.setItem("map.zoom", zoomLevel.toString());
        if (localBounds !== null) {
            // dispatch({
            //     type: ActionTypes.SET_BOUNDS,
            //     payload: {
            //         west: localBounds.getWest(),
            //         east: localBounds.getEast(),
            //         south: localBounds.getSouth(),
            //         north: localBounds.getNorth(),
            //     },
            // });
            setBounds({
                west: localBounds.getWest(),
                east: localBounds.getEast(),
                south: localBounds.getSouth(),
                north: localBounds.getNorth(),
            });
        }
    }, [zoomLevel, localBounds])
    // To do: create dynamic route with variable center coordinates

    return null
}

const mapStateToProps = (state: IAppState): IStateProps => ({
    // main: state.main
});

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    return {
        ...bindActionCreators(
            {
                setBounds
            },
            dispatch
        )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoomLevel);
