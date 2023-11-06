import { test } from '../../../page-objects/test-runner';
import { expect } from '@playwright/test';

test.describe('@JIRA-1234: Table test', () => {
  test('User Table Grid test', async ({ onUsersTablePage, usersTablePage }) => {
    const usersTable = usersTablePage.usersGrid;
    await usersTable.toBeNotEmpty();
    await usersTable.toHaveCount(6);
    const secondRow = await usersTable.row(1);
    await expect(secondRow.column(2)).toHaveText('Sergey Ivan');
    await usersTable.setLabels();
    await expect(secondRow.column('User')).toHaveText('Sergey Ivan');
    const helenRow = await usersTable.findRow(async (row) => row[2] === 'Helen Bennett');
    await expect(helenRow.column('Number')).toHaveText('4');
  });

  test('Simple User Table test', async ({ onUsersTablePage, usersTablePage }) => {
    const usersTable = usersTablePage.users;
    await usersTable.toBeNotEmpty();
    await usersTable.toHaveCount(6);
    const secondRow = await usersTable.get(1);
    await expect(secondRow.user).toHaveText('Sergey Ivan');
    const helenRow = await usersTable.findRow(async row => (await row.user.innerText()) === 'Helen Bennett');
    await expect(helenRow.number).toHaveText('4');
  });

  test('User Table test', async ({ onUsersTablePage, usersTablePage, visual }) => {
    const usersTable = usersTablePage.usersTable;
    await usersTable.toBeNotEmpty();
    await usersTable.toHaveCount(6);
    await usersTable.get(1).toHave({ user: 'Sergey Ivan'});
    await usersTable.get(row => row.user === 'Helen Bennett')
      .toHave({ number: '4' });
  });

  test('Visual Table test', async ({ onUsersTablePage, usersTablePage, visual }) => {
    await visual.testFullPage('Table Page');
    await visual.testElement(usersTablePage.users.root, 'User Table');
  });

  test.skip('Failed Visual Table test', async ({ onUsersTablePage, usersTablePage, visual }) => {
    const description = usersTablePage.usersTable.getRow(1).description;
    await visual.testElement(description.root, 'Description');
    await description.vip.click();
    await visual.testElement(description.root, 'Description');
  });
});
