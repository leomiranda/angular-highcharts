import { IForecast } from './forecast.interface';
import { IStation } from './station.interface';

export interface IData {
  forecast: {
    data_1h: IForecast;
    data_day: IForecast;
  };
  station: {
    hourly: IStation;
    daily: IStation;
  };
  location: {
    nome: string;
    id: string;
  };
}
