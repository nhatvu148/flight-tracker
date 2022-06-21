export enum ActionTypes {
  SET_BOUNDS,
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

export interface IMainState {
  bounds: IBounds;
}

export type TMainAction = { type: ActionTypes.SET_BOUNDS; payload: IBounds };
