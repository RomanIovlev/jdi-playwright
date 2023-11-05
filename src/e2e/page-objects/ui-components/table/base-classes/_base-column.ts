import { expect, Locator } from '@playwright/test';
import { Table } from '../table';

export class BaseColumn {
  constructor(
    protected table: Table<{ root: Locator }, unknown>,
    protected value: number | string
  ) {}

  private async getColumn(): Promise<Locator> {
    const index = (await this.getColumnIndex(this.value, this.table)) + 1;
    return this.table.$(this.table.allColumns.replace('%', index.toString()));
  }

  async toHaveText(expected: string[]) {
    const column = await this.getColumn();
    await expect(column).toHaveText(expected);
  }

  private async getColumnIndex(
    value: number | string,
    table: Table<any, any>
  ): Promise<number> {
    if (typeof value === 'number') {
      return value;
    }
    const header: string[] = table.tableHeader
      ? table.tableHeader
      : await table.headers.allInnerTexts();
    return header.findIndex((v) => v.toLowerCase() === value.toLowerCase());
  }
}
