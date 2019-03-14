import { Context } from '../src/context';
import { Client } from '../src/index';
import { SpeechBuilder } from '../src/speechBuilder';

/**
 * Clova Skill Client test
 */
describe('Clova Skill Client', () => {
  let app: any = null;
  let mockLaunchHandler: any = null;
  let mockIntentHandler: any = null;
  let mockEventHandler: any = null;
  let mockSessionEndedHandler: any = null;
  const express = require('express');
  const bodyParser = require('body-parser');
  const request = require('supertest');
  const launchRequestJSON = require('./fixtures/launchRequest.json');
  const intentRequestJSON = require('./fixtures/intentRequest.json');
  const eventRequestAudioPlayerJSON = require('./fixtures/eventRequestAudioPlayer.json');
  const skeletonResponseJSON = require('./fixtures/skeletonResponse.json');

  const launchSpeechInfo = SpeechBuilder.createSpeechText('こんにちは');

  beforeEach(() => {
    app = new express();
    app.use(bodyParser.json());
    mockLaunchHandler = jest.fn(ctx => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          ctx.setSimpleSpeech(launchSpeechInfo);
          resolve();
        }, 200);
      });
    });
    mockIntentHandler = jest.fn();
    mockEventHandler = jest.fn();
    mockSessionEndedHandler = jest.fn();
    // tslint:disable-next-line:no-empty
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    app = null;
  });

  it('should register request handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toBeUndefined();

    skillConfigurator.on('LaunchRequest', mockLaunchHandler);
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toEqual(mockLaunchHandler);
  });

  it('should register LaunchRequest handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toBeUndefined();

    skillConfigurator.onLaunchRequest(mockLaunchHandler);
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toEqual(mockLaunchHandler);
  });

  it('should register IntentRequest handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.IntentRequest).toBeUndefined();

    skillConfigurator.onIntentRequest(mockIntentHandler);
    expect(skillConfigurator.config.requestHandlers.IntentRequest).toEqual(mockIntentHandler);
  });

  it('should register EventRequest handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.EventRequest).toBeUndefined();

    skillConfigurator.onEventRequest(mockEventHandler);
    expect(skillConfigurator.config.requestHandlers.EventRequest).toEqual(mockEventHandler);
  });

  it('should register SessionEndedRequest handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.SessionEndedRequest).toBeUndefined();

    skillConfigurator.onSessionEndedRequest(mockSessionEndedHandler);
    expect(skillConfigurator.config.requestHandlers.SessionEndedRequest).toEqual(mockSessionEndedHandler);
  });

  it('should not overwrite registered handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toBeUndefined();

    skillConfigurator.on('LaunchRequest', mockLaunchHandler);
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toEqual(mockLaunchHandler);

    // tslint:disable-next-line:no-empty
    skillConfigurator.on('LaunchRequest', () => {});
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toEqual(mockLaunchHandler);
  });

  it('should contain outputSpeech response on registered handler', done => {
    const skillRequestHandler = Client.configureSkill()
      .on('LaunchRequest', mockLaunchHandler)
      .handle();
    app.post('/clova', skillRequestHandler);

    request(app)
      .post('/clova')
      .send(launchRequestJSON)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response: any) => {
        const { outputSpeech } = response.body.response;
        expect(mockLaunchHandler).toBeCalled();
        expect(outputSpeech).toEqual({
          type: 'SimpleSpeech',
          values: launchSpeechInfo,
        });
        done();
      });
  });

  it('should be able to invoke the EventRequest handler', done => {
    const skillRequestHandler = Client.configureSkill()
      .on('EventRequest', mockEventHandler)
      .handle();
    app.post('/clova', skillRequestHandler);

    request(app)
      .post('/clova')
      .send(eventRequestAudioPlayerJSON)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(() => {
        expect(mockEventHandler).toBeCalled();
        done();
      });
  });

  it('should return skeleton response on empty handler', done => {
    const mockEmptyHandler = jest.fn();
    const mockEmptyContext = new Context(launchRequestJSON);
    const skillRequestHandler = Client.configureSkill()
      .on('LaunchRequest', mockEmptyHandler)
      .handle();
    app.post('/clova', skillRequestHandler);

    request(app)
      .post('/clova')
      .send(launchRequestJSON)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(() => {
        expect(mockEmptyHandler).toBeCalled();
        expect(mockEmptyHandler).toBeCalledWith(mockEmptyContext);
        done();
      });
  });

  it('should return error on unregistered request', done => {
    const skillRequestHandler = Client.configureSkill()
      .on('LaunchRequest', mockLaunchHandler)
      .handle();
    app.post('/clova', skillRequestHandler);

    request(app)
      .post('/clova')
      .send(intentRequestJSON)
      .expect(500)
      .then(() => {
        expect(mockLaunchHandler).not.toBeCalled();
        expect(console.error).toBeCalledWith(`Unable to find requestHandler for 'IntentRequest'`);
        done();
      });
  });

  it('should return error on unregistered request', done => {
    const skillRequestHandler = Client.configureSkill()
      .on('LaunchRequest', mockLaunchHandler)
      .handle();
    app.post('/clova', skillRequestHandler);

    request(app)
      .post('/clova')
      .send(eventRequestAudioPlayerJSON)
      .expect(500)
      .then(() => {
        expect(mockEventHandler).not.toBeCalled();
        expect(console.error).toBeCalledWith(`Unable to find requestHandler for 'EventRequest'`);
        done();
      });
  });

  it('should contain outputSpeech response on registered handler (firebase)', done => {
    const skillRequestHandler = Client.configureSkill()
      .on('LaunchRequest', mockLaunchHandler)
      .firebase();
    app.post('/clova', skillRequestHandler);

    request(app)
      .post('/clova')
      .send(launchRequestJSON)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response: any) => {
        const { outputSpeech } = response.body.response;
        expect(mockLaunchHandler).toBeCalled();
        expect(outputSpeech).toEqual({
          type: 'SimpleSpeech',
          values: launchSpeechInfo,
        });
        done();
      });
  });

  it('should return skeleton response on empty handler (firebase)', done => {
    const mockEmptyHandler = jest.fn();
    const mockEmptyContext = new Context(launchRequestJSON);
    const skillRequestHandler = Client.configureSkill()
      .on('LaunchRequest', mockEmptyHandler)
      .firebase();
    app.post('/clova', skillRequestHandler);

    request(app)
      .post('/clova')
      .send(launchRequestJSON)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(() => {
        expect(mockEmptyHandler).toBeCalled();
        expect(mockEmptyHandler).toBeCalledWith(mockEmptyContext);
        done();
      });
  });

  it('should return error on unregistered request (firebase)', done => {
    const skillRequestHandler = Client.configureSkill()
      .on('LaunchRequest', mockLaunchHandler)
      .firebase();
    app.post('/clova', skillRequestHandler);

    request(app)
      .post('/clova')
      .send(intentRequestJSON)
      .expect(500)
      .then(() => {
        expect(mockLaunchHandler).not.toBeCalled();
        expect(console.error).toBeCalledWith(`Unable to find requestHandler for 'IntentRequest'`);
        done();
      });
  });

  it('should contain outputSpeech response on registered handler (lambda)', async done => {
    const skillRequestHandler = Client.configureSkill()
      .on('LaunchRequest', mockLaunchHandler)
      .lambda();

    const response = await skillRequestHandler(launchRequestJSON);
    const { outputSpeech } = response.response;
    expect(mockLaunchHandler).toBeCalled();
    expect(outputSpeech).toEqual({
      type: 'SimpleSpeech',
      values: launchSpeechInfo,
    });
    done();
  });

  it('should return skeleton response on empty handler (lambda)', async done => {
    const mockEmptyHandler = jest.fn();
    const mockEmptyContext = new Context(launchRequestJSON);
    const skillRequestHandler = Client.configureSkill()
      .on('LaunchRequest', mockEmptyHandler)
      .lambda();

    const response = await skillRequestHandler(launchRequestJSON);
    expect(mockEmptyHandler).toBeCalled();
    expect(mockEmptyHandler).toBeCalledWith(mockEmptyContext);
    done();
  });

  it('should return error on unregistered request (lambda)', async done => {
    const skillRequestHandler = Client.configureSkill()
      .on('LaunchRequest', mockLaunchHandler)
      .lambda();

    await skillRequestHandler(intentRequestJSON).catch((e: any) => {
      expect(mockLaunchHandler).not.toBeCalled();
      expect(e.message).toEqual(`Unable to find requestHandler for 'IntentRequest'`);
      done();
    });
  });
});
