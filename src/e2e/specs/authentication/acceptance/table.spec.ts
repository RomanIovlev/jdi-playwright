import { test } from '../../../page-objects/test-runner';
import { Default } from '../../../data/default-data';
import { expect } from '@playwright/test';

test.describe('@JIRA-1234: Table test', () => {
  test('User Table test', async ({ onUsersTablePage, usersTablePage, visual }) => {
    const usersTable = usersTablePage.users;
    await usersTable.toBeNotEmpty();
    await usersTable.toHaveCount(6);
    const secondRow = await usersTable.get(1);
    await expect(secondRow.user).toHaveText('Sergey Ivan');
    const helenRow = await usersTable.findRow(async (row) => (await row.user.innerText()) === 'Helen Bennett');
    await expect(helenRow.number).toHaveText('4');
  });

});
