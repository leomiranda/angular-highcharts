import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ILastSensorDataPoint } from '../../../interfaces/chart.interface';
import more from 'highcharts/highcharts-more';
import * as Highcharts from 'highcharts';
import { NgIf } from '@angular/common';
more(Highcharts);

@Component({
  selector: 'app-precipitation-chart',
  standalone: true,
  imports: [NgIf],
  templateUrl: './precipitation-chart.component.html',
  styleUrl: './precipitation-chart.component.scss',
})
export class PrecipitationChartComponent implements OnInit, OnDestroy {
  @Input() data: ILastSensorDataPoint[] | ILastSensorDataPoint[][] = [];
  @Input() isDaily: boolean = true;
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private chart!: Highcharts.Chart;
  public chartDataArray = signal<ILastSensorDataPoint[][]>([]);
  public chartData = signal<ILastSensorDataPoint[]>([]);
  public currentHourBlock = signal(0);
  public hourBlocks: { date: Date; value: number }[][] = [];

  ngOnInit() {
    this.chartDataArray.set(
      this.isDaily ? [] : (this.data as ILastSensorDataPoint[][])
    );
    this.updateChartData();
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.currentHourBlock.set(0);
      this.updateChartData();
      this.updateChart();
    }
  }

  updateChartData() {
    const currentData = this.isDaily
      ? (this.data as ILastSensorDataPoint[])
      : (this.data[this.currentHourBlock()] as ILastSensorDataPoint[]);
    this.chartData.set(currentData);
  }

  nextHourBlock() {
    if (this.currentHourBlock() > 0) {
      this.currentHourBlock.update((v) => v - 1);
    }
    this.updateChart();
  }

  previousHourBlock() {
    const currentData = this.isDaily
      ? (this.data as ILastSensorDataPoint[])
      : (this.data[this.currentHourBlock()] as ILastSensorDataPoint[]);
    if (this.currentHourBlock() < currentData.length - 1) {
      this.currentHourBlock.update((v) => v + 1);
    }
    this.updateChart();
  }

  private createChart() {
    const options: Highcharts.Options = {
      title: {
        text: '',
      },
      plotOptions: {
        column: {
          pointPadding: 0,
          borderWidth: 1,
          groupPadding: 0,
        },
      },
      xAxis: {
        type: 'datetime',
        ...(this.isDaily
          ? {
              labels: {
                useHTML: true,
                formatter: function () {
                  const date = new Date(this.value);
                  date.setDate(date.getDate() + 1);
                  const weekday = date.toLocaleDateString('en-US', {
                    weekday: 'short',
                  });
                  const formattedDate = `${String(date.getDate()).padStart(
                    2,
                    '0'
                  )}/${String(date.getMonth() + 1).padStart(2, '0')}`;
                  return `<div style="text-align: center;">
                      <div style="font-size: 10px;">${formattedDate}</div>
                      <div style="font-size: 14px; font-weight: bold;">${weekday}</div>
                    </div>`;
                },
              },
            }
          : {}),
        minTickInterval: (this.isDaily ? 24 : 1) * 3600 * 1000,
        startOnTick: true,
      },
      yAxis: {
        title: {
          text: 'Precipitação (mm)',
        },
        min: 0,
        minRange: 1,
      },
      series: [
        {
          type: 'column',
          name: 'Precipitação',
          data: this.chartData().map((point) => [
            point.date.getTime(),
            point.value,
          ]),
        },
      ],
    };

    this.chart = Highcharts.chart(this.chartContainer.nativeElement, options);
  }

  private updateChart() {
    if (this.chart) {
      const currentData = this.isDaily
        ? this.data
        : this.data[this.currentHourBlock()];
      this.chart.series[0].setData(
        (currentData as ILastSensorDataPoint[]).map(
          (point: ILastSensorDataPoint) => [point.date.getTime(), point.value]
        )
      );
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
