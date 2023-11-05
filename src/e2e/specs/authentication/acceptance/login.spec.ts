import { test } from '../../../page-objects/test-runner';
import { Default } from '../../../data/default-data';
import { expect } from '@playwright/test';

test.describe('@JIRA-1234: Login and submit user data', () => {
  test('Login test', async ({ loginPage, menu, contactFormPage, visual }) => {
    await loginPage.login();
    await visual.step('Open "Contact form" using left navigation menu', async () => {
      await menu.select('Contact form');
    });
    await contactFormPage.toValidatePage();

    await contactFormPage.fillContactForm(Default.user);
    await visual.step(`Submit contact data for: ${Default.user.firstName}`, async () => {
      await contactFormPage.submitButton.click();
    });
    await expect(contactFormPage.logs).toContainText('Summary: 3Last Name: IovlevVegetables:');
  });

  test.skip('Failed test', async ({ loginPage, menu, contactFormPage, visual }) => {
    await loginPage.login();
    await visual.step('Open "Contact form" using left navigation menu', async () => {
      await menu.select('Contact form');
    });
    await contactFormPage.toValidatePage();

    await contactFormPage.fillContactForm(Default.user);
    await visual.step(`Submit contact data for: ${Default.user.firstName}`, async () => {
      await contactFormPage.submitButton.click();
    });
    await expect(contactFormPage.logs).toContainText('Summary: 3First Name: RomanLast Name: IovlevVegetables:');
  });


});
