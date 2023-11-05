import { test as baseTest } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import { VisualValidator } from '../utils/visual-validator';
import 'dotenv/config';
import { VisualTestLevel } from '../utils/visual-test-level';
import * as process from 'process';
import { Menu } from './ui-components/menu';
import { ContactFormPage } from './pages/contact-form-page';

const getVisualLevel = (): VisualTestLevel => {
  if (!process.env.VISUAL_TESTING) return VisualTestLevel.OFF;
  switch (process.env.VISUAL_TESTING.toLowerCase()) {
    case 'step':
      return VisualTestLevel.STEPS;
    case 'validation':
      return VisualTestLevel.VALIDATION;
    case 'all':
      return VisualTestLevel.ALL;
    default:
      return VisualTestLevel.OFF;
  }
};

export const test = baseTest.extend<{
  rtl: boolean;
  visual: VisualValidator;
  loginPage: LoginPage;
  menu: Menu;
  contactFormPage: ContactFormPage;
}>({
  rtl: [false, { option: true }],
  visual: async ({ page, rtl }, use) => {
    await use(new VisualValidator(page, rtl, getVisualLevel()));
  },
  loginPage: async ({ page, visual }, use) => {
    await use(new LoginPage(page, visual, '/index.html'));
  },
  menu: async ({ page, visual }, use) => {
    await use(new Menu(page));
  },
  contactFormPage: async ({ page, visual }, use) => {
    await use(new ContactFormPage(page, visual, '/contacts.html'));
  },
});

test.use({
  viewport: {
    height: Number(process.env.SCREEN_HEIGHT) || 720,
    width: Number(process.env.SCREEN_WIDTH) || 1280,
  },
});
