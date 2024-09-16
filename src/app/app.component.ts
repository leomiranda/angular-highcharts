import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from '../services/data.service';
import { NgForOf, NgIf } from '@angular/common';
import {
  getLastXDaysForSensor,
  getLastXHoursForSensorInBlocks,
} from './utils/data-station';
import more from 'highcharts/highcharts-more';
import * as Highcharts from 'highcharts';
import { IDataChart } from './interfaces/chart.interface';
import { PrecipitationChartComponent } from './components/charts/precipitation-chart/precipitation-chart.component';
import {
  getLastXHoursForForecastInBlocks,
  getNextSevenForecastDays,
} from './utils/data-forecast';
import { IData } from './interfaces/data.interface';
import { DateRangeComponent } from './components/date-range/date-range.component';
more(Highcharts);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgForOf,
    NgIf,
    PrecipitationChartComponent,
    DateRangeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public title = 'pleno-angular-test';
  public points: IData[] = [];
  public isDaily: boolean = true;
  public isForecast: boolean = true;
  public selectedPoint: any;
  public lastPrecipitationDaily: IDataChart[] = [];
  public lastPrecipitationHourly: IDataChart[][] = [];
  public nextPrecipitationDaily: IDataChart[] = [];
  public nextPrecipitationHourly: IDataChart[][] = [];
  public chartDates: Date[] = [];

  constructor(
    private dataService: DataService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.dataService.getData().subscribe((data: any) => {
      this.points = [];
      const uniqueIds = new Set();

      Object.keys(data).forEach((key) => {
        const point = JSON.parse(data[key]);
        if (!uniqueIds.has(point.location.id)) {
          this.points.push(point);
          uniqueIds.add(point.location.id);
        }
      });
      console.log('this.points:', this.points);

      if (this.points.length > 0) {
        this.selectedPoint = this.points[0];
        this.updateChartData(this.selectedPoint);
      }
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  onDatesChange(dates: Date[]): void {
    this.chartDates = dates;
  }

  public toggleDailyHourlyView() {
    this.isDaily = !this.isDaily;
  }

  public toggleForecastStationView() {
    this.isForecast = !this.isForecast;
  }

  public onPointChange(event: any) {
    const selectedId = event.target.value;
    this.selectedPoint = this.points.find(
      (point) => point.location.id === selectedId
    );
    if (this.selectedPoint) {
      this.updateChartData(this.selectedPoint);
    }
  }

  private updateChartData(point: any) {
    this.lastPrecipitationDaily = getLastXDaysForSensor(
      point.station.daily,
      'Precipitation',
      7
    );

    this.lastPrecipitationHourly = getLastXHoursForSensorInBlocks(
      point.station.hourly,
      'Precipitation'
    );

    this.nextPrecipitationDaily = getNextSevenForecastDays(
      point.forecast.data_day
    );

    this.nextPrecipitationHourly = getLastXHoursForForecastInBlocks(
      point.forecast.data_1h
    );
  }
}
