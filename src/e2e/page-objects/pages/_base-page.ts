import { test, expect, Locator, Page } from '@playwright/test';
import { isLocator } from '../../utils/playwright-utils';
import { BaseComponent, isComponent } from '../ui-components/_base-component';
import { VisualValidator } from '../../utils/visual-validator';
import { timeouts } from '../../utils/timeouts';
import { testConfig } from '../../test-config';

export const isWebPage = (param: any): param is BasePage =>
  typeof param === 'object' && param.hasOwnProperty('ID_PAGE');

export abstract class BasePage {
  readonly ID_PAGE;
  url: string = testConfig.baseUrl;
  urlRegex: RegExp;
  title: string;
  header: string;
  h1 = this.$('h1');

  constructor(
    protected page: Page,
    protected visual: VisualValidator,
    options?: Partial<{ url: string; urlRegex: RegExp; title: string; header }> | string,
  ) {
    if (typeof options === 'string') {
      this.url += options;
    } else {
      this.url += options?.url;
      this.urlRegex = options?.urlRegex;
      this.title = options?.title;
      this.header = options?.header;
    }
  }

  async open() {
    await this.visual.step(`Open ${this.getPageName(this)} page`, async () => {
      await this.page.goto(this.url);
    });
  }

  $(
    selector: string,
    options?: {
      has?: Locator;
      hasNot?: Locator;
      hasNotText?: string | RegExp;
      hasText?: string | RegExp;
    },
  ): Locator {
    return this.page.locator(selector);
  }

  async toBeOpened(screenName: string | false = '') {
    await this.visual.step(
      `Validate ${this.getPageName(this)} page is opened`,
      async () => {
        const validateUrl = this.urlRegex ?? this.url;
        if (validateUrl) {
          await expect(this.page).toHaveURL(validateUrl, { timeout: timeouts.waitPageToLoad });
        }
        if (this.title) {
          await expect(this.page).toHaveTitle(this.title, { timeout: timeouts.waitPageToLoad });
        }
        if (this.header) {
          await expect(this.h1).toHaveText(this.header, { timeout: timeouts.waitPageToLoad });
        }
      },
      screenName,
    );
  }

  // To override including specific page elements and layout
  async toValidatePage(screenName: string | false = '') {
    await this.visual.step(
      `Validate ${this.getPageName(this)} page layout and elements`,
      async () => {
        await this.toBeOpened();
        const allElements: Locator[] = [
          ...Object.getOwnPropertyNames(this)
            .map((propName) => propToLocator(this, propName))
            .filter((prop) => prop != undefined),
        ];
        for (const element of allElements) {
          const component = (await element.count()) === 1 ? element : element.nth(0);
          await expect(component).toBeVisible();
        }
      },
      screenName,
    );
  }

  protected getPageName(page: object): string {
    const pageName = page.constructor.name;
    return pageName.toLowerCase().endsWith('page') ? pageName.substring(0, pageName.length - 4) : pageName;
  }
}

const propToLocator = (obj: object, propName: string): Locator => {
  if (propName === 'h1') return undefined;
  if (isLocator(obj[propName])) {
    return obj[propName] as Locator;
  }
  if (isComponent(obj[propName])) {
    return (obj[propName] as BaseComponent).root;
  }
  return undefined;
};
