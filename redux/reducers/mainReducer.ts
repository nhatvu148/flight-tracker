import { checkLocalStorage } from "helper/functions";
import { ActionTypes, IMainState, TMainAction } from "redux/types";

const initialZoom = 4;
const initialLatitude = 51;
const initialLongitude = -2;

const initialState: IMainState = {
  bounds: {
    west: 0,
    east: 0,
    south: 0,
    north: 0,
  },
  mapCenter: {
    lat: checkLocalStorage("map.latitude")
      ? JSON.parse(window.localStorage.getItem("map.latitude"))
      : initialLatitude,
    lng: checkLocalStorage("map.longitude")
      ? JSON.parse(window.localStorage.getItem("map.longitude"))
      : initialLongitude,
  },
  zoom: checkLocalStorage("map.zoom")
    ? JSON.parse(window.localStorage.getItem("map.zoom"))
    : initialZoom,
};

const mainReducer = (state = initialState, action: TMainAction) => {
  switch (action.type) {
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
