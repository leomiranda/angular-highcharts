import { IDataChart } from '../interfaces/chart.interface';
import { IForecast } from '../interfaces/forecast.interface';
import { splitHourlyDataIntoBlocks } from './data';

export function combineForecastDataWithDates(data: IForecast): IDataChart[] {
  return data.precipitation.map((precip, index) => ({
    date: new Date(data.time[index]),
    value: precip,
  }));
}

export function getNextSevenForecastDays(data: IForecast): IDataChart[] {
  return combineForecastDataWithDates(data);
}

export function getLastXHoursForForecastInBlocks(
  data: IForecast,
  hourPerBlock: number = 12,
  totalBlocks: number = 4
): IDataChart[][] {
  const combinedData = combineForecastDataWithDates(data);
  return splitHourlyDataIntoBlocks(combinedData, hourPerBlock, totalBlocks);
}
