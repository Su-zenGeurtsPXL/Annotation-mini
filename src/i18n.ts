import { createI18n } from 'vue3-i18n';
import en from '@/locales/en.json';
import { Messages } from 'vue3-i18n/src/types';

/* eslint-disable @typescript-eslint/no-explicit-any*/

const messages = { en: en };

const language = navigator.language.substr(0, 2);
const locale =
  language && Object.keys(messages).includes(language)
    ? language
    : process.env.VUE_APP_I18N_LOCALE || 'en';

const i18n = createI18n({
  locale: locale,
  messages: messages,
});

const i18nFallback = createI18n({
  locale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: messages,
});

(i18n as any).t2 = (
  key: string,
  fallback_message: string,
  itemContent: [] | null
): string => {
  let translation = i18n.t(key) as string;

  if (translation.length === 0) {
    translation = i18nFallback.t(key);
  }

  if (translation.length == 0) {
    if (fallback_message) translation = fallback_message;
  }

  if (translation.length == 0) {
    const keyParts = key.split('.');
    if (keyParts.length > 0) translation = keyParts[keyParts.length - 1];
  }

  if (itemContent && translation.length > 0) {
    let contentIndex: any;
    for (contentIndex in itemContent) {
      translation = translation.replace(
        new RegExp('\\{' + contentIndex + '\\}', 'g'),
        itemContent[contentIndex]
      );
    }
  }

  return translation;
};

(i18n as any).containsLocale = (locale: string): boolean => {
  return Object.keys(i18n.messages).includes(locale);
};

(i18n as any).containsKey = (key: string): boolean => {
  const recursiveRetrieve = (chain: string[], messages: Messages): boolean => {
    if (
      !messages[chain[0]] ||
      messages[chain[0]] === '' ||
      typeof messages[chain[0]] !== 'string'
    ) {
      return false;
    } else if (chain.length === 1) {
      return true;
    } else {
      return recursiveRetrieve(chain.slice(1), messages[chain[0]]);
    }
  };

  return recursiveRetrieve(key.split('.'), (i18n as any).en);
};

(i18n as any).translateWithFallback = (
  item: string,
  itemContent: [] | null,
  prefix = ''
): string => {
  const translateParts = item.split(':');
  if (translateParts.length > 1) {
    const translateCode = translateParts[0];
    const fallbackMessage = translateParts[1].trim();
    item = (i18n as any).t2(
      `${prefix}${translateCode}`,
      fallbackMessage,
      itemContent
    );
  } else {
    item = (i18n as any).t2(`${prefix}${item}`, item, itemContent);
  }
  return item;
};

(i18n as any).translateList = (list: string[]): string[] => {
  list.forEach((item: string, index: number) => {
    list[index] = (i18n as any).translateWithFallback(item);
  });
  return list;
};

export default i18n;
