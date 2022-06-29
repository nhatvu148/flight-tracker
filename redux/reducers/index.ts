import { combineReducers } from "redux";
import mainReducer from "redux/reducers/mainReducer";
import { IMainState } from "redux/types";

export interface IAppState {
  main: IMainState;
}

export default combineReducers<IAppState>({
  main: mainReducer,
});
