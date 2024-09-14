import { ILastSensorDataPoint } from '../interfaces/chart.interface';
import {
  IStation,
  IStationData,
  StationSensorName,
} from '../interfaces/station.interface';

function combineDataWithDates(
  station: IStation,
  sensor: StationSensorName
): ILastSensorDataPoint[] {
  const { dates, data } = station;
  const sensorData = data.find((item: IStationData) => item.name === sensor);

  if (!sensorData) return [];

  return dates.map((date, index) => ({
    date: new Date(date),
    value: sensorData.values.sum[index],
  }));
}

function getLastXDays(
  data: ILastSensorDataPoint[],
  days: number
): ILastSensorDataPoint[] {
  if (days <= 0 || days > data.length) {
    throw new Error('Invalid number of days');
  }

  const sortedData = data.sort((a, b) => b.date.getTime() - a.date.getTime());
  return sortedData.slice(0, days);
}

export function getLastXDaysForSensor(
  station: IStation,
  sensor: StationSensorName,
  days: number
): ILastSensorDataPoint[] {
  const combinedData = combineDataWithDates(station, sensor);
  return getLastXDays(combinedData, days);
}
