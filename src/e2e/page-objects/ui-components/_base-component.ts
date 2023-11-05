import { expect, Locator } from '@playwright/test';

export const isComponent = (param: any): param is BaseComponent =>
  typeof param === 'object' && param.hasOwnProperty('ID_COMPONENT');

export abstract class BaseComponent {
  readonly ID_COMPONENT;
  constructor(public root: Locator) {}

  $(selector: string): Locator {
    return this.root.locator(selector);
  }

  async toBeVisible() {
    await expect(this.root).toBeVisible();
  }
  async toBeHidden() {
    await expect(this.root).not.toBeVisible();
  }
}
