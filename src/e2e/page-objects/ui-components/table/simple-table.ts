import { expect, Locator, Page } from '@playwright/test';
import { BaseComponent } from '../_base-component';
import { getLocator } from './base-classes/table-utils';

export class SimpleTable<TRow extends { root: Locator }> extends BaseComponent {
    headers: Locator;
    allRows: Locator;

    constructor(
        root: Locator | Page,
        protected rowFunc: (row: Locator) => TRow,
        options?: Partial<{ header: string; allRows: string }>
    ) {
        super(getLocator(root));
        this.headers = this.$(options?.header || 'thead th');
        this.allRows = this.$(options?.allRows || 'tbody tr');
    }

    get(index: number): TRow {
        return this.rowFunc(this.allRows.nth(index));
    }

    async findRows(search: (row: TRow) => Promise<boolean>): Promise<TRow[]> {
        await this.allRows.first().waitFor();
        const result: TRow[] = [];
        const rowsAmount = await this.allRows.count();
        for (let i = 0; i < rowsAmount; i++) {
            const row: TRow = await this.rowFunc(this.allRows.nth(i));
            if (await search(row)) {
                result.push(row);
            }
        }
        return result;
    }

    async findRow(search: (data: TRow) => Promise<boolean>): Promise<TRow> {
        await this.allRows.first().waitFor();
        const rowsAmount = await this.allRows.count();
        for (let i = 0; i < rowsAmount; i++) {
            const row: TRow = this.rowFunc(this.allRows.nth(i));
            if (await search(await row)) {
                return row;
            }
        }
        return undefined;
    }

    async selectRow(index: number) {
        await this.allRows.nth(index).click();
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
        await expect(this.allRows).toHaveCount(count);
      } else {
        const search = await this.waitResult(() => this.allRows.count(), count);
        if (search.succeed) return;
        await expect(this.allRows).toHaveCount(search.result);
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
