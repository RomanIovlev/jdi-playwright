import { BaseComponent } from './_base-component';
import { expect, Locator, Page } from '@playwright/test';

export class Input extends BaseComponent {
  label: Locator;
  field: Locator;
  constructor(page: Page, id: string) {
    super(page.locator(`#${id}`));
    this.label = page.locator(`[for=${id}]`);
    this.field = page.locator(`#${id}`);
  }

  async type(value: string) {
    await this.field.fill(value);
  }

  async toHaveLabel(label: string) {
    await expect(this.label).toHaveText(label);
  }
}
