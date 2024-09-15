import { IDataChart } from '../interfaces/chart.interface';
import {
  IStation,
  IStationData,
  StationSensorName,
} from '../interfaces/station.interface';
import { splitHourlyDataIntoBlocks } from './data';

export function combineStationDataWithDates(
  station: IStation,
  sensor: StationSensorName
): IDataChart[] {
  const { dates, data } = station;
  const sensorData = data.find((item: IStationData) => item.name === sensor);

  if (!sensorData) return [];

  return dates.map((date, index) => ({
    date: new Date(date),
    value: sensorData.values.sum[index],
  }));
}

function getLastXDays(data: IDataChart[], days: number): IDataChart[] {
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
): IDataChart[] {
  const combinedData = combineStationDataWithDates(station, sensor);
  return getLastXDays(combinedData, days);
}

export function getLastXHoursForSensorInBlocks(
  station: IStation,
  sensor: StationSensorName,
  hourPerBlock: number = 12,
  totalBlocks: number = 4
): IDataChart[][] {
  const combinedData = combineStationDataWithDates(station, sensor);
  return splitHourlyDataIntoBlocks(combinedData, hourPerBlock, totalBlocks);
}
