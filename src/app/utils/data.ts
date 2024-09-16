import { IDataChart } from '../interfaces/chart.interface';

export function splitHourlyDataIntoBlocks(
  data: IDataChart[],
  hourPerBlock: number = 12,
  totalBlocks: number = 4,
  reverse: boolean = true
): IDataChart[][] {
  const reversedArray = reverse ? [...data].reverse() : data;
  const firstItems = reversedArray.slice(0, totalBlocks * hourPerBlock);

  const blocks = [];
  for (let i = 0; i < totalBlocks; i++) {
    blocks.push(firstItems.slice(i * hourPerBlock, (i + 1) * hourPerBlock));
  }

  return blocks;
}

export function precipitationOptionsChart(
  data: IDataChart[],
  isDaily: boolean = true
): Highcharts.Options {
  return {
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
      ...(isDaily
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
      minTickInterval: (isDaily ? 24 : 1) * 3600 * 1000,
      startOnTick: true,
    },
    yAxis: {
      title: {
        text: 'Precipitação (mm)',
      },
      min: 0,
      minRange: 1,
    },
    colors: ['#3667a6'],
    series: [
      {
        type: 'column',
        name: 'Precipitação',
        data: data.map((point) => [point.date.getTime(), point.value]),
      },
    ],
  };
}
