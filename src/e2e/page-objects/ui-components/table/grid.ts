import { expect, Locator, Page } from '@playwright/test';
import { DefaultRow } from './base-classes/default-row';
import { BaseComponent } from '../_base-component';
import { getLocator } from './base-classes/table-utils';

export class Grid extends BaseComponent {
  labels: string[];
  headers: Locator;
  rows: Locator;
  columns: (row: Locator) => Locator;

  constructor(
    root: Locator | Page,
    options?: Partial<{ labels: string[], header: string; rows: string; columns: string }>
  ) {
    super(getLocator(root));
    this.labels = options?.labels ?? [];
    this.headers = this.$(options?.header || 'thead th');
    this.rows = this.$(options?.rows || 'tbody tr');
    this.columns = row => row.locator(options?.columns || 'td');
  }

  row(index: number): DefaultRow {
    return new DefaultRow(this.rows.nth(index), this);
  }

  async setLabels(): Promise<Grid> {
    this.labels = [];
    const count = await this.headers.count();
    for (let i = 0; i < count; i++) {
      this.labels.push(await this.headers.nth(i).innerText());
    }
    return this;
  }

  async findRows(search: (row: string[]) => Promise<boolean>): Promise<DefaultRow[]> {
    await this.rows.first().waitFor();
    const result: DefaultRow[] = [];
    const rowsAmount = await this.rows.count();
    for (let i = 0; i < rowsAmount; i++) {
      const row: DefaultRow = new DefaultRow(this.rows.nth(i), this);
      if (await search(await row.getData())) {
        result.push(row);
      }
    }
    return result;
  }

  async findRow(search: (data: string[]) => Promise<boolean>): Promise<DefaultRow> {
    await this.rows.first().waitFor();
    const rowsAmount = await this.rows.count();
    for (let i = 0; i < rowsAmount; i++) {
      const row: DefaultRow = new DefaultRow(this.rows.nth(i), this);
      if (await search(await row.getData())) {
        return row;
      }
    }
    return undefined;
  }

  async selectRow(index: number) {
    await this.rows.nth(index).click();
  }

  async selectFirstRow() {
    await this.selectRow(0);
  }

  async validateHeader(header: string[]) {
    await expect(this.headers).toHaveText(header);
  }

  async toBeNotEmpty() {
    await this.toHaveCount((c) => c > 0);
  }

  async toHaveRows(count: number) {
    await this.toHaveCount((c) => c >= count);
  }

  async toBeEmpty() {
    await this.toHaveCount((c) => c == 0);
  }

  async toHaveCount(count: number | ((c: number) => boolean)) {
    if (typeof count === 'number') {
      await expect(this.rows).toHaveCount(count);
    } else {
      const search = await this.waitResult(() => this.rows.count(), count);
      if (search.succeed) return;
      await expect(this.rows).toHaveCount(search.result);
    }
  }

  private async waitResult<T>(get: () => Promise<T>,
          condition: (value: T) => boolean,
          timeout: number = 5000): Promise<{ result: T, succeed: boolean }> {
    let succeed: boolean;
    let result: T;
    const start = Date.now();
    do {
      result = await get();
      succeed = condition(result);
    } while (!succeed && Date.now() < start + timeout);
    return { result, succeed };
  }
}
