import { Locator, Page } from '@playwright/test';
import { isLocator } from '../../../../utils/playwright-utils';

export const getLocator = (root: Locator | Page) => isLocator(root)
  ? root as Locator
  : root.locator('table');
