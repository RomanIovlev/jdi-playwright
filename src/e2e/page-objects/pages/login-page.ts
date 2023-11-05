import { expect, test } from '@playwright/test';
import { User } from '../../data-types/user';
import { BasePage } from './_base-page';
import { Default } from '../../data/default-data';

export class LoginPage extends BasePage {
  userIcon = this.$('#user-icon');
  loginField = this.$('#name');
  passwordField = this.$('#password');
  enterButton = this.$('#login-button');

  async login(user: User = Default.user) {
    const { username, password } = user;
    await test.step(`Login to application as user:"${username}" / "${password}"`, async () => {
      await this.open();
      await this.visual.step('Click on user icon in top-right corner', async () => {
        await this.userIcon.click();
      });
      await this.loginField.fill(username);
      await this.passwordField.fill(password);
      await this.enterButton.click();
    });
  }

  async toValidatePage(screenName: string | false = '') {
    await this.visual.step(
      `Validate ${this.getPageName(this)} page layout and elements`,
      async () => {
        await this.toBeOpened(false);
        await expect(this.loginField).toBeVisible();
        await expect(this.passwordField).toBeVisible();
        await expect(this.enterButton).toBeVisible();
      },
      screenName,
    );
  }
}
