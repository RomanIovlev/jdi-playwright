import { Locator } from '@playwright/test';
import { BaseComponent } from '../../_base-component';
import { isLocator } from '../../../../utils/playwright-utils';

export abstract class BaseRow<TData> extends BaseComponent {
  constructor(public root: Locator) { super(root); }

  async getData(): Promise<TData> {
    const data = {};
    const hasName = Object.keys(this).map(key => key.toLowerCase()).includes('name');
    let name = '';
    for (const [key, value] of Object.entries(this)) {
      if (key === 'root' || !isLocator(value)) continue;
      if (!hasName && !name) {
        name = await value.innerText();
        data['name'] = name;
        data[key] = name;
      } else {
        data[key] = await value.innerText();
      }
    }
    return data as TData;
  }
}
