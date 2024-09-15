import { IDataChart } from '../interfaces/chart.interface';

export function splitHourlyDataIntoBlocks(
  data: IDataChart[],
  hourPerBlock: number = 12,
  totalBlocks: number = 4
): IDataChart[][] {
  const reversedArray = [...data].reverse();
  const firstItems = reversedArray.slice(0, totalBlocks * hourPerBlock);

  const blocks = [];
  for (let i = 0; i < totalBlocks; i++) {
    blocks.push(firstItems.slice(i * hourPerBlock, (i + 1) * hourPerBlock));
  }

  return blocks;
}
