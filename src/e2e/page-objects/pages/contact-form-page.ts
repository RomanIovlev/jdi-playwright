import { BaseJDIPage } from './_base-jdi-page';
import { ContactData } from '../../data-types/contact-data';
import { Default } from '../../data/default-data';
import { expect, test } from '@playwright/test';
import { Input } from '../ui-components/input';

export class ContactFormPage extends BaseJDIPage {
  firstName = this.$('#first-name');
  lastName = new Input(this.page, 'last-name');
  passportNumber = this.$('#passport-number');
  gender = this.$('#gender');
  submitButton = this.$('button[type=submit]').filter({ hasText: 'Submit' });
  logs = this.$('ul.results');

  async fillContactForm(contactData: ContactData = Default.user) {
    const { firstName, lastName, gender } = contactData;
    await this.visual.step(
      `Fill Contact form with data: (firstName: ${firstName}; lastName: ${lastName}; gender: ${gender}; ))`,
      async () => {
        await this.firstName.type(firstName);
        await this.lastName.type(lastName);
        await this.gender.selectOption({ label: gender });
      },
    );
  }

  async toValidatePage(screenName: string | false = '') {
    await test.step(`Validate ${this.getPageName(this)} page layout and elements`, async () => {
      await this.toBeOpened(false);
      await expect(this.firstName).toBeVisible();
      await this.lastName.toHaveLabel('Last Name');
      await expect(this.gender).toBeVisible();
    });
  }
}
