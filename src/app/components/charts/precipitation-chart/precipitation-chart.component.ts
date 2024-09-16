import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IDataChart } from '../../../interfaces/chart.interface';
import more from 'highcharts/highcharts-more';
import * as Highcharts from 'highcharts';
import { NgIf } from '@angular/common';
import { precipitationOptionsChart } from '../../../utils/data';
more(Highcharts);

@Component({
  selector: 'app-precipitation-chart',
  standalone: true,
  imports: [NgIf],
  templateUrl: './precipitation-chart.component.html',
  styleUrl: './precipitation-chart.component.scss',
})
export class PrecipitationChartComponent implements OnInit, OnDestroy {
  @Input() data: IDataChart[] | IDataChart[][] = [];
  @Input() isDaily: boolean = true;
  @Input() isForecast: boolean = true;
  @ViewChild('chartContainer', { static: true })
  private chartContainer!: ElementRef;
  @Output() datesChange = new EventEmitter<Date[]>();

  private chart!: Highcharts.Chart;

  public readonly chartDataArray = computed(() =>
    this.isDaily ? [] : (this.data as IDataChart[][])
  );

  public readonly chartData = computed(() => {
    const currentData = this.isDaily
      ? (this.data as IDataChart[])
      : (this.data[this.currentHourBlock()] as IDataChart[]);
    return currentData;
  });

  public currentHourBlock = signal(0);

  ngOnInit() {
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

  public nextHourBlock() {
    if (this.currentHourBlock() > 0) {
      this.currentHourBlock.update((v) => v - 1);
    }
    this.updateChart();
  }

  public previousHourBlock() {
    const currentData = this.isDaily
      ? (this.data as IDataChart[])
      : (this.data[this.currentHourBlock()] as IDataChart[]);
    if (this.currentHourBlock() < currentData.length - 1) {
      this.currentHourBlock.update((v) => v + 1);
    }
    this.updateChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private updateChartData() {
    this.emitDates(this.chartData());
  }

  private createChart() {
    const options: Highcharts.Options = precipitationOptionsChart(
      this.chartData(),
      this.isDaily
    );

    this.chart = Highcharts.chart(this.chartContainer.nativeElement, options);
  }

  private emitDates(data: IDataChart[]): void {
    const datesToShow = data.map((item: IDataChart) => item.date);
    this.datesChange.emit(datesToShow);
  }

  private updateChart() {
    if (this.chart) {
      const currentData = this.isDaily
        ? this.data
        : this.data[this.currentHourBlock()];
      this.emitDates(currentData as IDataChart[]);
      this.chart.series[0].setData(
        (currentData as IDataChart[]).map((point: IDataChart) => [
          point.date.getTime(),
          point.value,
        ])
      );
    }
  }
}
