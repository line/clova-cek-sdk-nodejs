import { Context, SpeechBuilder } from '../src';
import { Clova } from '../src/index';

/**
 * Clova Skill Client Context test
 */
describe('Clova Skill Client Context: LaunchRequest', () => {
  let context: Clova.ClientContext;
  let responseObject: Clova.ResponseBody;
  const launchRequestJSON: Clova.RequestBody = require('./fixtures/launchRequest.json');

  beforeEach(() => {
    context = new Context(launchRequestJSON);
    responseObject = context.responseObject;
  });

  it('should set outputSpeech object', () => {
    const speechInfo = SpeechBuilder.createSpeechText('こんにちは');
    const speechObject: Clova.OutputSpeechSimple = {
      type: 'SimpleSpeech',
      values: speechInfo,
    };

    context.setOutputSpeech(speechObject);
    context.setOutputSpeech(speechObject, true);
    expect(responseObject.response.outputSpeech).toEqual(speechObject);
    expect(responseObject.response.reprompt).toBeTruthy();
    if (responseObject.response.reprompt) {
      expect(responseObject.response.reprompt.outputSpeech).toEqual(speechObject);
    }
  });

  it('should set simple speech text for outputSpeech object', () => {
    const speechInfo = SpeechBuilder.createSpeechText('こんにちは');
    const speechObject: Clova.OutputSpeechSimple = {
      type: 'SimpleSpeech',
      values: speechInfo,
    };

    context.setSimpleSpeech(speechInfo);
    context.setSimpleSpeech(speechInfo, true);
    expect(responseObject.response.outputSpeech).toEqual(speechObject);
    expect(responseObject.response.reprompt).toBeTruthy();
    if (responseObject.response.reprompt) {
      expect(responseObject.response.reprompt.outputSpeech).toEqual(speechObject);
    }
  });

  it('should set simple speech url for outputSpeech object', () => {
    const speechInfo = SpeechBuilder.createSpeechUrl('http://clova.line.me/sample.mp3');
    const speechObject: Clova.OutputSpeechSimple = {
      type: 'SimpleSpeech',
      values: speechInfo,
    };

    context.setSimpleSpeech(speechInfo);
    context.setSimpleSpeech(speechInfo, true);
    expect(responseObject.response.outputSpeech).toEqual(speechObject);
    expect(responseObject.response.reprompt).toBeTruthy();
    if (responseObject.response.reprompt) {
      expect(responseObject.response.reprompt.outputSpeech).toEqual(speechObject);
    }
  });

  it('should set speech list for outputSpeech object', () => {
    const speechInfo: Clova.SpeechInfoObject[] = [
      SpeechBuilder.createSpeechText('こんにちは'),
      SpeechBuilder.createSpeechUrl('http://clova.line.me/sample.mp3'),
    ];
    const speechObject: Clova.OutputSpeechList = {
      type: 'SpeechList',
      values: speechInfo,
    };

    context.setSpeechList(speechInfo);
    context.setSpeechList(speechInfo, true);
    expect(responseObject.response.outputSpeech).toEqual(speechObject);
    expect(responseObject.response.reprompt).toBeTruthy();
    if (responseObject.response.reprompt) {
      expect(responseObject.response.reprompt.outputSpeech).toEqual(speechObject);
    }
  });

  it('should set speech set for outputSpeech object', () => {
    const speechInfoBrief = SpeechBuilder.createSpeechText('こんにちは');
    const speechInfoVerbose: Clova.OutputSpeechVerbose = {
      type: 'SimpleSpeech',
      values: speechInfoBrief,
    };

    context.setSpeechSet(speechInfoBrief, speechInfoVerbose);
    context.setSpeechSet(speechInfoBrief, speechInfoVerbose, true);
    expect(responseObject.response.outputSpeech).toEqual({
      brief: speechInfoBrief,
      type: 'SpeechSet',
      verbose: speechInfoVerbose,
    });
    expect(responseObject.response.reprompt).toBeTruthy();
    if (responseObject.response.reprompt) {
      expect(responseObject.response.reprompt.outputSpeech).toEqual({
        brief: speechInfoBrief,
        type: 'SpeechSet',
        verbose: speechInfoVerbose,
      });
    }
  });

  it('should set reprompt for response object', () => {
    const speechInfo: Clova.SpeechInfoObject = SpeechBuilder.createSpeechText('こんにちは');
    const speechObject: Clova.OutputSpeechSimple = {
      type: 'SimpleSpeech',
      values: speechInfo,
    };

    context.setReprompt(speechObject);
    expect(responseObject.response.reprompt).toBeTruthy();
    if (responseObject.response.reprompt) {
      expect(responseObject.response.reprompt.outputSpeech).toEqual(speechObject);
    }
  });

  it('should set shouldEndSession for response object', () => {
    context.endSession();
    expect(responseObject.response.shouldEndSession).toBeTruthy();
    expect(responseObject.sessionAttributes).toEqual({});
  });

  it('should set sessionAttributes for response object', () => {
    const sessionAttributes = { intent: 'AddInfo' };
    context.setSessionAttributes(sessionAttributes);
    expect(responseObject.sessionAttributes).toEqual(sessionAttributes);
  });

  it('should not get any slots from launch request', () => {
    const slots = context.getSlots();
    expect(slots).toEqual({});
  });

  it('should not get any slot from launch request', () => {
    const pizzaTypeSlot = context.getSlot('pizzaType');
    expect(pizzaTypeSlot).toBeNull();

    const pizzaNumSlot = context.getSlot('pizzaNum');
    expect(pizzaNumSlot).toBeNull();

    const nonExistSlot = context.getSlot('non-exist');
    expect(nonExistSlot).toBeNull();
  });

  it('should not get intent name from launch request', () => {
    const intentName = context.getIntentName();
    expect(intentName).toBeNull();
  });

  it('should get user info from launch request', () => {
    const user = context.getUser();
    expect(user).toEqual({
      accessToken: 'XHapQasdfsdfFsdfasdflQQ7',
      userId: 'V0qe',
    });
  });
});

describe('Clova Skill Client Context: IntentRequest', () => {
  let context: Clova.ClientContext;
  const intentRequestJSON: Clova.RequestBody = require('./fixtures/intentRequest.json');

  beforeEach(() => {
    context = new Context(intentRequestJSON);
  });

  it('should get slots from intent request', () => {
    const slots = context.getSlots();
    expect(slots).toEqual({
      pizzaNum: 3,
      pizzaType: 'pepperoni',
    });
  });

  it('should get specific slot from intent request', () => {
    const pizzaTypeSlot = context.getSlot('pizzaType');
    expect(pizzaTypeSlot).toBe('pepperoni');

    const pizzaNumSlot = context.getSlot('pizzaNum');
    expect(pizzaNumSlot).toBe(3);

    const nonExistSlot = context.getSlot('non-exist');
    expect(nonExistSlot).toBeNull();
  });

  it('should get intent name from intent request', () => {
    const intentName = context.getIntentName();
    expect(intentName).toBe('OrderPizza');
  });

  it('should get sessionId from intent request', () => {
    const sessionId = context.getSessionId();
    expect(sessionId).toBe('a29cfead-c5ba-474d-8745-6c1a6625f0c5');
  });

  it('should get sessionAttributes from intent request', () => {
    const sessionAttributes = context.getSessionAttributes();
    expect(sessionAttributes).toEqual({ intent: 'OrderPizza' });
  });
});
