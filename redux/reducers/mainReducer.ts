import { getInitialMapCenter } from "helpers";
import { ActionTypes, IMainState, TMainAction } from "redux/types";

const initialState: IMainState = {
  bounds: {
    west: 0,
    east: 0,
    south: 0,
    north: 0,
  },
  mapCenter: {
    lat: getInitialMapCenter("map.latitude"),
    lng: getInitialMapCenter("map.longitude"),
  },
  zoom: getInitialMapCenter("map.zoom"),
  openLayers: [false, false, false, true],
};

const mainReducer = (state = initialState, action: TMainAction) => {
  switch (action.type) {
    case ActionTypes.SET_OPEN_LAYERS:
      return {
        ...state,
        openLayers: action.payload,
      };

    case ActionTypes.SET_BOUNDS:
      return {
        ...state,
        bounds: action.payload,
      };

    case ActionTypes.SET_MAP_CENTER:
      return {
        ...state,
        mapCenter: action.payload,
      };

    case ActionTypes.SET_ZOOM:
      return {
        ...state,
        zoom: action.payload,
      };

    default:
      return state;
  }
};

export default mainReducer;
