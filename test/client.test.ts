import { Client } from '../src/index';
import { Context } from '../src/context';
import { SpeechBuilder } from '../src/speechBuilder';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

/**
 * Clova Skill Client test
 */
describe('Clova Skill Client', () => {
  let app = null;
  let mockLaunchHandler = null;
  let mockIntentHandler = null;
  let mockSessionEndedHandler = null;
  const launchRequestJSON = require('./fixtures/launchRequest.json');
  const intentRequestJSON = require('./fixtures/intentRequest.json');
  const skeletonResponseJSON = require('./fixtures/skeletonResponse.json');

  const launchSpeechInfo = SpeechBuilder.createSpeechText('こんにちは');

  beforeEach(() => {
    app = express();
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
    mockSessionEndedHandler = jest.fn();
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    app = null;
  });

  it('should register request handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toBeUndefined;

    skillConfigurator.on('LaunchRequest', mockLaunchHandler);
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toEqual(mockLaunchHandler);
  });

  it('should register LaunchRequest handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toBeUndefined;

    skillConfigurator.onLaunchRequest(mockLaunchHandler);
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toEqual(mockLaunchHandler);
  });

  it('should register IntentRequest handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.IntentRequest).toBeUndefined;

    skillConfigurator.onIntentRequest(mockIntentHandler);
    expect(skillConfigurator.config.requestHandlers.IntentRequest).toEqual(mockIntentHandler);
  });

  it('should register SessionEndedRequest handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.SessionEndedRequest).toBeUndefined;

    skillConfigurator.onSessionEndedRequest(mockSessionEndedHandler);
    expect(skillConfigurator.config.requestHandlers.SessionEndedRequest).toEqual(mockSessionEndedHandler);
  });

  it('should not overwrite registered handler', () => {
    const skillConfigurator = Client.configureSkill();
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toBeUndefined;

    skillConfigurator.on('LaunchRequest', mockLaunchHandler);
    expect(skillConfigurator.config.requestHandlers.LaunchRequest).toEqual(mockLaunchHandler);

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
      .then(response => {
        const { outputSpeech } = response.body.response;
        expect(mockLaunchHandler).toBeCalled();
        expect(outputSpeech).toEqual({
          type: 'SimpleSpeech',
          values: launchSpeechInfo,
        });
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
      .then(response => {
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
      .then(response => {
        expect(mockLaunchHandler).not.toBeCalled();
        expect(console.error).toBeCalledWith(`Unable to find requestHandler for 'IntentRequest'`);
        done();
      });
  });
});
