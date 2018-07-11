import { Clova } from '../src/index';
import { SpeechBuilder } from '../src/speechBuilder';

describe('SpeechBuilder test', () => {
  afterEach(() => {
    SpeechBuilder.DEFAULT_LANG = 'ja';
  });

  it('should have default lang', () => {
    expect(SpeechBuilder.DEFAULT_LANG).toBe('ja');
  });

  it('should able to set default lang', () => {
    SpeechBuilder.DEFAULT_LANG = 'en';
    expect(SpeechBuilder.DEFAULT_LANG).toBe('en');
  });

  it('should create SpeechInfoObject with simple text', () => {
    const speechText = 'おはよう';
    expect(SpeechBuilder.createSpeechText(speechText)).toEqual({
      lang: 'ja',
      type: 'PlainText',
      value: speechText,
    });
  });

  it('should create SpeechInfoObject with simple text and custom lang', () => {
    const speechLang = 'en';
    const speechText = 'Hello';
    expect(SpeechBuilder.createSpeechText(speechText, speechLang)).toEqual({
      lang: speechLang,
      type: 'PlainText',
      value: speechText,
    });
  });

  it('should create SpeechInfoObject with url', () => {
    const speechUrl = 'http://clova.line.me/sample.mp3';
    expect(SpeechBuilder.createSpeechUrl(speechUrl)).toEqual({
      lang: '',
      type: 'URL',
      value: speechUrl,
    });
  });
});
