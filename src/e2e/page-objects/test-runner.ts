import { expect, test as baseTest } from '@playwright/test';
import { LoginPage } from './pages/login-page';
import { VisualValidator } from '../utils/visual-validator';
import 'dotenv/config';
import { VisualTestLevel } from '../utils/visual-test-level';
import * as process from 'process';
import { Menu } from './ui-components/menu';
import { ContactFormPage } from './pages/contact-form-page';
import { UsersTablePage } from './pages/users-table-page';
import { Default } from '../data/default-data';

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
  usersTablePage: UsersTablePage;
  onUsersTablePage: void;
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
  usersTablePage: async ({ page, visual }, use) => {
    await use(new UsersTablePage(page, visual, '/user-table.html'));
  },
  onUsersTablePage: async ({ loginPage, menu, usersTablePage, visual }) => {
    await loginPage.login();
    await visual.step('Open "User Table form" using left navigation menu', async () => {
      await menu.openSelect('Service', 'User Table');
    });
    await usersTablePage.toValidatePage();
  }
});

test.use({
  viewport: {
    height: Number(process.env.SCREEN_HEIGHT) || 720,
    width: Number(process.env.SCREEN_WIDTH) || 1280,
  },
});
