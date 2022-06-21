import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { ActionTypes, IBounds } from "redux/types";

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
