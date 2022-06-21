export enum ActionTypes {
  SET_BOUNDS,
  SET_MAP_CENTER,
  SET_ZOOM,
}

export enum DownloadType {
  UNKNOWN,
  STRESS_ACC,
  GYRO,
  REPORT,
  ROUTE_MAP,
  MS_MOMENT,
  MW_MOMENT,
  MS_MW_MOMENT,
  WEATHER_WAVE_HEIGHT,
  WEATHER_WAVE_PERIOD,
  WEATHER_WAVE_DIRECTION,
  WEATHER_MAP,
  STRESS_ACC_SD,
  GYRO_SD,
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
}

export type TMainAction =
  | { type: ActionTypes.SET_BOUNDS; payload: IBounds }
  | { type: ActionTypes.SET_MAP_CENTER; payload: ICoordinate }
  | { type: ActionTypes.SET_ZOOM; payload: number };
