import { BasePage } from './_base-page';
import { Menu } from '../ui-components/menu';

export abstract class BaseJDIPage extends BasePage {
  menu = new Menu(this.page);
}
