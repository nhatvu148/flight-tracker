import { FC, useEffect } from "react";
import { useMapEvents } from "react-leaflet";

import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { IBounds, IAppState, IMainState, ICoordinate } from "redux/types";
import {
  setBounds,
  setZoom,
  setMapCenter,
  setOpenLayer,
} from "redux/actions/mainActions";
import { getMain } from "redux/selectors";

interface IStateProps {
  main?: IMainState;
}

interface IDispatchProps {
  dispatch?: ThunkDispatch<{}, {}, AnyAction>;
  setBounds: (
    newData: IBounds
  ) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => void;
  setZoom: (
    newData: number
  ) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => void;
  setMapCenter: (
    newData: ICoordinate
  ) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => void;
  setOpenLayer: (
    newData: string
  ) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => void;
}

type IProps = IStateProps & IDispatchProps;

const ZoomLevel: FC<IProps> = ({
  setBounds,
  setZoom,
  setMapCenter,
  setOpenLayer,
}) => {
  const mapEvents = useMapEvents({
    zoomend: () => {
      const zoom = mapEvents.getZoom();
      setZoom(zoom);
      window.localStorage.setItem("map.zoom", zoom.toString());
    },
    moveend: () => {
      const localBounds = mapEvents.getBounds();
      setBounds({
        west: localBounds.getWest(),
        east: localBounds.getEast(),
        south: localBounds.getSouth(),
        north: localBounds.getNorth(),
      });

      const { lat, lng } = mapEvents.getCenter();
      setMapCenter({ lat, lng });
      window.localStorage.setItem("map.latitude", lat.toString());
      window.localStorage.setItem("map.longitude", lng.toString());
    },
    baselayerchange: (e) => {
      setOpenLayer(e.name);
      window.localStorage.setItem("openLayer", e.name);
    },
  });

  // To do: create dynamic route with variable center coordinates

  return null;
};

const mapStateToProps = (state: IAppState): IStateProps => ({
  main: getMain(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
  return {
    ...bindActionCreators(
      {
        setBounds,
        setZoom,
        setMapCenter,
        setOpenLayer,
      },
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoomLevel);
