import { BaseJDIPage } from './_base-jdi-page';
import { Locator, test } from '@playwright/test';
import { UsersRow } from './users-row';
import { SimpleTable } from '../ui-components/table/simple-table';
import { Grid } from '../ui-components/table/grid';
import { Table } from '../ui-components/table/table';
import { UserData } from '../../data/users-row';

export class UsersTablePage extends BaseJDIPage {
  usersGrid = new Grid(this.$('#user-table'));
  users = new SimpleTable(this.page, (row: Locator) => new UsersRow(row));
  usersTable = new Table<UsersRow, UserData>(this.page, (row: Locator) => new UsersRow(row));

  async toValidatePage(screenName: string | false = '') {
    await test.step(`Validate ${this.getPageName(this)} page layout and elements`, async () => {
      await this.toBeOpened(false);
      await this.users.toBeVisible();
    });
  }
}
