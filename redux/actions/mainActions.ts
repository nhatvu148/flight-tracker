import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { ActionTypes, IBounds, ICoordinate } from "redux/types";

export const setBounds =
  (newData: IBounds) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        type: ActionTypes.SET_BOUNDS,
        payload: newData,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const setMapCenter =
  (newData: ICoordinate) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        type: ActionTypes.SET_MAP_CENTER,
        payload: newData,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const setZoom =
  (newData: number) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        type: ActionTypes.SET_ZOOM,
        payload: newData,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const setOpenLayer =
  (newData: string) => (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        type: ActionTypes.SET_OPEN_LAYER,
        payload: newData,
      });
    } catch (error) {
      console.log(error);
    }
  };
