import { expect, Locator } from '@playwright/test';

export class BaseTableValidator<TRow extends { root: Locator }, TData> {
  constructor(protected row: () => Promise<TRow>,
              protected getData: (row: TRow) => Promise<TData>) {}

  async toHave(expected: Partial<TData>): Promise<void> {
    const row = await this.row();
    this.validate(await this.getData(row), expected);
  }

  async toHaveName(name: string): Promise<void> {
    const row = await this.row();
    this.validate(await this.getData(row), { name });
  }

  async toMatchSnapshot(dataName: string): Promise<void> {
    const row = await this.row();
    const data = await this.getData(row);
    const matchingObject = this.getMatchingObject(data, dataName);
    matchingObject.forEach((pair) => {
      expect(pair.value).toMatchSnapshot(pair.key);
    });
  }

  async toBeSelected() {
    const rowValue = await this.row();
    await expect(rowValue.root).toHaveClass(/selected/);
  }

  async toBeNotSelected() {
    const rowValue = await this.row();
    await expect(rowValue.root).not.toHaveClass(/selected/);
  }

  async select() {
    const rowValue = await this.row();
    await rowValue.root.click();
  }

  protected validate(actual, expected) {
    Object.keys(actual).forEach((p) => {
      if (!expected[p]) return;
      if (typeof expected[p] === 'object') {
        this.validate(actual[p], expected[p]);
      } else {
        expect(actual[p]).toBe(expected[p]);
      }
    });
  }

  protected getMatchingObject(
    obj,
    parentPrefix?: string
  ): { key: string; value: string }[] {
    const map = [];
    for (const key in obj) {
      const parentKey = (parentPrefix ? parentPrefix + '.' : '') + key;
      let pair = [{ key: parentKey, value: obj[key] }];
      if (typeof pair[0].value === 'object') {
        pair = this.getMatchingObject(obj[key], parentKey);
      }
      pair.forEach((p) => {
        map.push({ key: p.key, value: p.value.toString() });
      });
    }
    return map;
  }
}
