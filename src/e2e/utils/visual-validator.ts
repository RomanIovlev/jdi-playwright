import { test, expect, Locator, Page } from '@playwright/test';
import { VisualPageTypes } from './interfaces/visual-page-types';
import { VisualTypes } from './interfaces/visual-types';
import 'dotenv/config';
import { VisualTestLevel } from './visual-test-level';
import { allure } from 'allure-playwright';

const stepNameToKebabCase = (stepName: string): string =>
  stepName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export class VisualValidator {
  protected level: VisualTestLevel;

  rtlPrefix: string;

  constructor(
    protected page: Page,
    protected rtl: boolean,
    testLevel: VisualTestLevel | boolean = false,
  ) {
    if (typeof testLevel === 'boolean') {
      this.level = testLevel ? VisualTestLevel.ALL : VisualTestLevel.OFF;
    } else {
      this.level = testLevel;
    }
    this.rtlPrefix = rtl ? 'rtl-' : '';
  }

  async step<T>(title: string, body: () => T | Promise<T>, screenName: string | false = '') {
    const makeScreen = screenName !== false && [VisualTestLevel.ALL, VisualTestLevel.STEPS].includes(this.level);
    await test.step((makeScreen ? '[Screen] ' : '') + title, async () => {
      await body();
      if (!makeScreen) return;
      await allure.attachment(
        this.rtlScreenName(stepNameToKebabCase(`${title}` + (screenName ? ` ${screenName}` : ''))),
        await this.page.screenshot({ fullPage: true }),
        {
          contentType: 'image/png',
        },
      );
    });
  }

  async testFullPage(name: string, options?: { waitBefore: number }) {
    if ([VisualTestLevel.OFF, VisualTestLevel.STEPS].includes(this.level)) return;
    if (options?.waitBefore) {
      await this.page.waitForTimeout(options.waitBefore);
    }
    await expect(this.page).toHaveScreenshot(this.rtlScreenName(name), {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  }

  async test(name: string, options?: VisualPageTypes) {
    if ([VisualTestLevel.OFF, VisualTestLevel.STEPS].includes(this.level)) return;
    await expect(this.page).toHaveScreenshot(this.rtlScreenName(name), options);
  }

  async testWithMask(name: string, options: { mask: string[] }) {
    if ([VisualTestLevel.OFF, VisualTestLevel.STEPS].includes(this.level)) return;
    await expect(this.page).toHaveScreenshot(this.rtlScreenName(name), {
      mask: options.mask.map((selector) => this.page.locator(selector)),
      maxDiffPixelRatio: 0.01,
    });
  }

  async testElement(element: Locator | string, name: string, options?: VisualTypes) {
    if ([VisualTestLevel.OFF, VisualTestLevel.STEPS].includes(this.level)) return;
    const locator = typeof element === 'string' ? this.page.locator(element) : element;
    await expect(locator).toHaveScreenshot(this.rtlScreenName(name), options);
  }

  async testElementWithMask(element: Locator | string, name: string, options: { mask: string[] }) {
    if ([VisualTestLevel.OFF, VisualTestLevel.STEPS].includes(this.level)) return;
    const locator = typeof element === 'string' ? this.page.locator(element) : element;
    await expect(locator).toHaveScreenshot(this.rtlScreenName(name), {
      mask: options.mask.map((selector) => locator.locator(selector)),
      maxDiffPixelRatio: 0.01,
    });
  }

  private rtlScreenName(name) {
    return `${this.rtlPrefix}${name}.png`;
  }
}
