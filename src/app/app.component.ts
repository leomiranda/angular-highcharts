import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from '../services/data.service';
import { NgForOf } from '@angular/common';
import { getLastXDaysForSensor } from './utils/data-station';
import more from 'highcharts/highcharts-more';
import * as Highcharts from 'highcharts';
import { ILastSensorDataPoint } from './interfaces/chart.interface';
import { PrecipitationChartComponent } from './components/charts/precipitation-chart/precipitation-chart.component';
more(Highcharts);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, PrecipitationChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public title = 'pleno-angular-test';
  public points: any[] = [];
  selectedPoint: any;
  lastPrecipitation: ILastSensorDataPoint[] = [];

  constructor(private dataService: DataService) {}

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

      if (this.points.length > 0) {
        this.selectedPoint = this.points[0];
        this.updateChartData(this.selectedPoint);
      }
    });
  }

  onPointChange(event: any) {
    const selectedId = event.target.value;
    this.selectedPoint = this.points.find(
      (point) => point.location.id === selectedId
    );
    if (this.selectedPoint) {
      this.updateChartData(this.selectedPoint);
    }
  }

  private updateChartData(point: any) {
    this.lastPrecipitation = getLastXDaysForSensor(
      point.station.daily,
      'Precipitation',
      7
    );
  }
}
