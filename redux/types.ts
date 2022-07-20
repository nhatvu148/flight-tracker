import { Geography } from "components/types";

export interface IAppState {
  main: IMainState;
}

export enum ActionTypes {
  SET_BOUNDS,
  SET_MAP_CENTER,
  SET_ZOOM,
  SET_OPEN_LAYER,
  SET_EFLIGHTS,
}

export enum DownloadType {
  UNKNOWN,
}

export interface IBounds {
  west: number;
  east: number;
  south: number;
  north: number;
}

export interface ICoordinate {
  lat: number;
  lng: number;
}

export interface IMainState {
  bounds: IBounds;
  mapCenter: ICoordinate;
  zoom: number;
  openLayer: string;
  eFlights: Geography[];
}

export type TMainAction =
  | { type: ActionTypes.SET_BOUNDS; payload: IBounds }
  | { type: ActionTypes.SET_MAP_CENTER; payload: ICoordinate }
  | { type: ActionTypes.SET_OPEN_LAYER; payload: string }
  | { type: ActionTypes.SET_ZOOM; payload: number }
  | { type: ActionTypes.SET_EFLIGHTS; payload: number };
