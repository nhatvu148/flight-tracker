import { ActionTypes, IMainState, TMainAction } from "redux/types";

const initialState: IMainState = {
  bounds: {
    west: 0,
    east: 0,
    south: 0,
    north: 0,
  },
};

const mainReducer = (state = initialState, action: TMainAction) => {
  switch (action.type) {
    case ActionTypes.SET_BOUNDS:
      return {
        ...state,
        bounds: action.payload,
      };

    default:
      return state;
  }
};

export default mainReducer;
