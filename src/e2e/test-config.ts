import { Translations } from './localization/translations-type';
import { jdiEng } from './localization/jdi-en';
import { jdiNl } from './localization/jdi-nl';
import { User } from './data-types/user';
import config from '../../playwright.config';

type Localizations = 'en' | 'nl';

export let i18n: Translations = jdiEng;

export class TestConfig {
  baseUrl: string = config.use.baseURL + '/jdi-light';
  locale: Localizations = 'en';

  init(
    options: Partial<{ user: User; url: string; locale: Localizations }> = {
      url: this.baseUrl,
      locale: this.getLocale(),
    },
  ) {
    if (options.url) {
      this.baseUrl = options.url;
    }
    this.locale = options.locale || 'en';
    i18n = this.getTranslation(this.locale);
  }

  getLocale(): Localizations {
    const locale = process.env.LOCALE;
    return locale === 'en' || locale === 'nl' ? locale : 'en';
  }

  getTranslation(language: Localizations): Translations {
    switch (language) {
      case 'en':
        return jdiEng;
      case 'nl':
        return jdiNl;
      default:
        throw new Error(`Unknown locale ${language}`);
    }
  }
}
export const testConfig = new TestConfig();
