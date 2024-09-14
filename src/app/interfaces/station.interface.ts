export interface IStation {
  dates: string[];
  data: IStationData[];
}

export interface IStationData {
  name: StationSensorName;
  name_original: string;
  type: string;
  decimals: number;
  unit: string;
  ch: number;
  code: number;
  group: number;
  serial: string;
  mac: string;
  registered: string;
  vals: Record<string, unknown>;
  aggr: string[];
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
