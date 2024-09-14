import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ILastSensorDataPoint } from '../../../interfaces/chart.interface';
import more from 'highcharts/highcharts-more';
import * as Highcharts from 'highcharts';
more(Highcharts);

@Component({
  selector: 'app-precipitation-chart',
  standalone: true,
  imports: [],
  templateUrl: './precipitation-chart.component.html',
  styleUrl: './precipitation-chart.component.scss',
})
export class PrecipitationChartComponent implements OnInit, OnDestroy {
  @Input() data: ILastSensorDataPoint[] = [];

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private chart!: Highcharts.Chart;

  constructor() {}

  ngOnInit() {
    this.createChart(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }

  private createChart(data: ILastSensorDataPoint[]) {
    const options: Highcharts.Options = {
      title: {
        text: 'Precipitation Chart',
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date',
        },
      },
      yAxis: {
        title: {
          text: 'Precipitation (mm)',
        },
      },
      series: [
        {
          type: 'column',
          name: 'Precipitation',
          data: data.map((point) => [point.date.getTime(), point.value]),
        },
      ],
    };

    this.chart = Highcharts.chart(this.chartContainer.nativeElement, options);
  }

  private updateChart() {
    if (this.chart) {
      console.log('Updating chart with data:', this.data);
      this.chart.series[0].setData(
        this.data.map((point) => [point.date.getTime(), point.value])
      );
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
