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
