import Clova from './types';

export class SpeechBuilder {
  private static defaultLang: Clova.SpeechLang = 'ja';

  static get DEFAULT_LANG(): Clova.SpeechLang {
    return SpeechBuilder.defaultLang;
  }

  static set DEFAULT_LANG(lang: Clova.SpeechLang) {
    SpeechBuilder.defaultLang = lang;
  }

  static createSpeechText(value: string, lang?: Clova.SpeechLang): Clova.SpeechInfoText {
    return {
      lang: lang || SpeechBuilder.DEFAULT_LANG,
      type: 'PlainText',
      value,
    };
  }

  static createSpeechUrl(value: string): Clova.SpeechInfoUrl {
    return {
      lang: '',
      type: 'URL',
      value,
    };
  }
}
