import { FC, useEffect } from "react";
import { useMapEvents } from "react-leaflet";

import { ThunkDispatch } from "redux-thunk";
import { AnyAction, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { IBounds, IAppState, IMainState, ICoordinate } from "redux/types";
import { setBounds, setZoom, setMapCenter } from "redux/actions/mainActions";
import { getMain } from "redux/selectors";

interface IStateProps {
  main: IMainState;
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
}

type IProps = IStateProps & IDispatchProps;

const ZoomLevel: FC<IProps> = ({
  main: { zoom, mapCenter },
  setBounds,
  setZoom,
  setMapCenter,
}) => {
  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoom(mapEvents.getZoom());
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
    },
  });

  useEffect(() => {
    window.localStorage.setItem("map.latitude", mapCenter.lat.toString());
    window.localStorage.setItem("map.longitude", mapCenter.lng.toString());
  }, [mapCenter]);

  useEffect(() => {
    window.localStorage.setItem("map.zoom", zoom.toString());
  }, [zoom]);
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
      },
      dispatch
    ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ZoomLevel);
