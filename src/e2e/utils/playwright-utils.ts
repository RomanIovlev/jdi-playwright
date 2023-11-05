import { Locator, Page } from '@playwright/test';

export const isLocator = (param: any): param is Locator =>
  typeof param === 'object' && param.toString().split('@')[0] === 'Locator';

export const getBackgroundScript = async (page: Page, locator: string, pseudo): Promise<string> =>
  page.evaluate(
    `window.getComputedStyle(document.querySelector('${locator}'), '::${pseudo}').getPropertyValue('background-color')`,
  );
