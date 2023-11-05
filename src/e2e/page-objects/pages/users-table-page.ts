import { BaseJDIPage } from './_base-jdi-page';
import { expect, Locator, test } from '@playwright/test';
import { UsersRow } from './users-row';
import { SimpleTable } from '../ui-components/table/simple-table';
import { Grid } from '../ui-components/table/grid';

export class UsersTablePage extends BaseJDIPage {
  users = new SimpleTable(this.page, (row: Locator) => new UsersRow(row));
  usersGrid = new Grid(this.$('#user-table'));

  async toValidatePage(screenName: string | false = '') {
    await test.step(`Validate ${this.getPageName(this)} page layout and elements`, async () => {
      await this.toBeOpened(false);
      await this.users.toBeVisible();
    });
  }
}
