import { ILastSensorDataPoint } from '../interfaces/chart.interface';
import {
  IStation,
  IStationData,
  StationSensorName,
} from '../interfaces/station.interface';

export function combineDataWithDates(
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

export function splitHourlyDataIntoBlocks(
  data: { date: Date; value: number }[],
  hourPerBlock: number = 12,
  totalBlocks: number = 4
): ILastSensorDataPoint[][] {
  const reversedArray = [...data].reverse();
  const firstItems = reversedArray.slice(0, totalBlocks * hourPerBlock);

  const blocks = [];
  for (let i = 0; i < totalBlocks; i++) {
    blocks.push(firstItems.slice(i * hourPerBlock, (i + 1) * hourPerBlock));
  }

  return blocks;
}

export function getLastXHoursForSensorInBlocks(
  station: IStation,
  sensor: StationSensorName,
  hourPerBlock: number = 12,
  totalBlocks: number = 4
): ILastSensorDataPoint[][] {
  const combinedData = combineDataWithDates(station, sensor);
  return splitHourlyDataIntoBlocks(combinedData, hourPerBlock, totalBlocks);
}
