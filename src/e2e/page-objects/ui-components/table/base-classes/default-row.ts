import { Locator } from '@playwright/test';
import { BaseRow } from './_base-row';
import { Grid } from '../grid';

export class DefaultRow extends BaseRow<any> {
  constructor(root: Locator, protected grid: Grid) {
    super(root);
  }
  async getData(): Promise<string[]> {
    return await this.columns().allInnerTexts();
  }

  column(value: number | string): Locator {
    const index = typeof value === 'number'
      ? value
      : this.grid.labels.findIndex(label => label === value);
    return this.columns().nth(index);
  }

  columns(): Locator {
    return this.grid.columns(this.root);
  }
}
