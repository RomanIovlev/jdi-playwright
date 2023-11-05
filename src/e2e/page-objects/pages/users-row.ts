import { BaseRow } from '../ui-components/table/base-classes/_base-row';
import { UserData } from '../../data/users-row';
import { Description } from './description';

export class UsersRow extends BaseRow<UserData> {
  number = this.$('td').nth(0);
  type = this.$('td').nth(1).locator('select');
  user = this.$('td').nth(2);
  description = new Description(this.$('td').nth(3));
}
