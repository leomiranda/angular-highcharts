export interface IStation {
  dates: string[];
  data: IStationData[];
}

export interface IStationData {
  name: StationSensorName;
  values: {
    sum: number[];
  };
}

export type StationSensorName =
  | 'Battery'
  | 'Solar Panel'
  | 'Precipitation'
  | 'Air temperature, high precision'
  | 'Relative humidity'
  | 'DeltaT'
  | 'Dew Point'
  | 'VPD'
  | 'Leaf Wetness'
  | 'Midnight';
