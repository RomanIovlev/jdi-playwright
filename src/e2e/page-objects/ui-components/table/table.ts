import { expect, Locator, Page } from '@playwright/test';
import { BaseTableValidator } from './base-classes/_base-table-validator';
import { BaseColumn } from './base-classes/_base-column';
import { BaseRow } from './base-classes/_base-row';
import { BaseComponent } from '../_base-component';
import { getLocator } from './base-classes/table-utils';

export class Table<
  TRow extends { root: Locator },
  TData
  > extends BaseComponent {
  headers: Locator;
  allRows: Locator;
  allColumns;
  getData: (row: TRow) => Promise<TData>;
  rowValidator: (rowFunc: () => Promise<TRow>) => BaseTableValidator<TRow, TData>;
  rowsValidator: (rowFunc: () => Promise<TRow[]>) => unknown;
  rowNameField: string;
  tableHeader: string[];

  constructor(
    root: Locator | Page,
    protected rowFunc: (row: Locator) => TRow,
    options?: {
      getData?: (row: TRow) => Promise<TData>;
      rowValidator?: (rowFunc: () => Promise<TRow>) => BaseTableValidator<TRow, TData>;
      rowsValidator?: (rowFunc: () => Promise<TRow[]>) => unknown;
      rowNameField?: string;
      headerSelector?: string;
      allRowsSelector?: string;
      tableHeader?: string[];
    },
  ) {
    super(getLocator(root));
    this.getData = options?.getData ?? (row => row instanceof BaseRow ? row.getData() : undefined);
    this.rowValidator = options?.rowValidator;
    this.rowsValidator = options?.rowsValidator;
    this.rowNameField = options?.rowNameField || 'name';
    this.headers = this.$(options?.headerSelector || 'thead th');
    this.allRows = this.$(options?.allRowsSelector || 'tbody tr');
    this.allColumns = options?.allRowsSelector || 'xpath=./tbody//td[%]';
    this.tableHeader = options?.tableHeader || [];
  }

  $(selector: string) {
    return this.root.locator(selector);
  }

  get(
    value: string | number | ((data: Partial<TData>) => boolean),
  ): BaseTableValidator<TRow, TData> {
    if (this.rowValidator) {
      return typeof value === 'number'
        ? this.rowValidator(async () => this.getRow(value))
        : this.rowValidator(() => this.findRow(value));
    }

    return typeof value === 'number'
      ? new BaseTableValidator<TRow, TData>(async () => this.getRow(value), this.getData)
      : new BaseTableValidator<TRow, TData>(() => this.findRow(value), this.getData);
  }

  column(value: number | string): BaseColumn {
    return new BaseColumn(this, value);
  }

  getRow(index: number): TRow {
    return this.rowFunc(this.allRows.nth(index));
  }

  rows(condition?: (row: Partial<TData>) => boolean): unknown {
    return this.rowsValidator(() => this.findRows(condition));
  }

  async findRows(condition?: (data: Partial<TData>) => boolean, atLeastCount?: number): Promise<TRow[]> {
    if (!atLeastCount) {
      return await this.findRowsByCondition(condition);
    }
    const search = await Table.waitResult(async () => await this.findRowsByCondition(condition),
      rows => rows.length >= atLeastCount);
    if (search.succeed) return search.result;
    expect(search.result.length).toBe(atLeastCount);
  }

  private async findRowsByCondition(condition?: (data: Partial<TData>) => boolean) {
    await this.allRows.first().waitFor();
    const result: TRow[] = [];
    const rowsAmount = await this.allRows.count();
    for (let i = 0; i < rowsAmount; i++) {
      const row: TRow = await this.rowFunc(this.allRows.nth(i));
      if (condition === undefined || condition(await this.getData(row))) {
        result.push(row);
      }
    }

    return result;
  }

  async findRow(
    condition: string | ((data: Partial<TData>) => boolean),
  ): Promise<TRow> {
    await this.allRows.first().waitFor();
    const rowsAmount = await this.allRows.count();
    const searchFunc: (row: Partial<TData>) => boolean =
      typeof condition === 'string'
        ? (data) => data[this.rowNameField] === condition
        : condition;
    for (let i = 0; i < rowsAmount; i++) {
      const row: TRow = this.rowFunc(this.allRows.nth(i));
      if (searchFunc(await this.getData(row))) {
        return row;
      }
    }

    return undefined;
  }

  async selectRow(
    value: string | number | ((data: Partial<TData>) => boolean),
  ) {
    await this.get(value).select();
  }

  async selectFirstRow() {
    await this.selectRow(0);
  }

  async sortBy(value: number | string) {
    await this.headers.nth(await this.getIndex(value)).click();
  }

  private async getIndex(value: number | string) {
    if (typeof value === 'number') return value;
    const allHeaders = await this.getTableHeader();

    return allHeaders.indexOf(value);
  }

  async validateHeader() {
    await expect(this.headers).toHaveText(this.tableHeader);
  }

  async toBeNotEmpty() {
    await this.toHaveCount((c) => c > 0);
  }

  async toHaveAtLeastRows(count: number) {
    await this.toHaveCount((c) => c >= count);
  }

  async toBeEmpty() {
    await this.toHaveCount(0);
  }

  async toHaveCount(count: number | ((c: number) => boolean)) {
    if (typeof count === 'number') {
      await expect(this.allRows).toHaveCount(count);
    } else {
      const search = await Table.waitResult(() => this.allRows.count(), count);
      if (search.succeed) return;
      await expect(this.allRows).toHaveCount(search.result);
    }
  }

  async getTableHeader() {
    if (!this.tableHeader || this.tableHeader.length === 0) {
      this.tableHeader = await this.headers.allInnerTexts();
    }

    return this.tableHeader;
  }

  static async waitResult<T>(get: () => Promise<T>,
                             condition: (value: T) => boolean,
                             timeout: number = 5000): Promise<{ result: T; succeed: boolean }> {
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
