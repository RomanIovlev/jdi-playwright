import { Locator, expect, Page } from '@playwright/test';
import { BaseComponent } from './_base-component';

export class Menu extends BaseComponent {
  items: Locator = this.$('li');
  constructor(page: Page) {
    super(page.locator('.sidebar-menu'));
  }

  async openSelect(open: MenuItems, select: MenuItems) {
    await this.menuItem(open).click();
    await this.menuItem(select).click();
  }
  async select(item: MenuItems) {
    await this.menuItem(item).click();
  }

  async toBeSelected(item: MenuItems) {
    await expect(this.menuItem(item)).toHaveClass('active');
  }

  private menuItem(item: MenuItems): Locator {
    return this.items.locator('a span').locator(`text="${item}"`);
  }
}
