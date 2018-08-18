import express from 'express';

declare namespace Clova {
  export interface ClovaMessage {
    requestBody: RequestBody;
    responseBody: ResponseBody;
  }
  export interface RequestBody {
    context: Context;
    request: Request;
    session: Session;
    version: string;
  }

  export type Context = {
    AudioPlayer?: {
      offsetInMilliseconds?: number;
      playerActivity: string;
      stream?: any;
      totalInMilliseconds?: number;
    };
    System: {
      application: {
        applicationId: string;
      };
      device: {
        deviceId: string;
        display: {
          contentLayer?: {
            width: number;
            height: number;
          };
          dpi?: number;
          orientation?: string;
          size: string;
        };
      };
      user: {
        userId: string;
        accessToken: string;
      };
    };
  };

  export type Request = LaunchRequest | IntentRequest | SessionEndedRequest;

  export type LaunchRequest = {
    type: 'LaunchRequest';
  };

  export type IntentRequest = {
    type: 'IntentRequest';
    intent: {
      name: string;
      slots: {
        [key: string]: {
          name: string;
          value: SlotValue;
        };
      };
    };
  };

  export type SessionEndedRequest = {
    type: 'SessionEndedRequest';
  };

  export type Session = {
    new: boolean;
    sessionAttributes: object;
    sessionId: string;
    user: {
      userId: string;
      accessToken?: string;
    };
  };

  export type User = {
      userId: string;
      accessToken?: string;
  };

  export interface ResponseBody {
    response: Response;
    sessionAttributes: object;
    version: string;
  }

  export interface Response {
    card: Card;
    directives: Array<Directive>;
    outputSpeech: OutputSpeech;
    reprompt?: {
      outputSpeech: OutputSpeech;
    };
    shouldEndSession: boolean;
  }

  export type Card = {};

  export type Directive = {
    header: {
      messageId: string;
      name: string;
      namespace: string;
    };
    payload: object;
  };

  export type OutputSpeech = OutputSpeechSimple | OutputSpeechList | OutputSpeechSet | {};

  export type OutputSpeechSimple = {
    brief?: SpeechInfoObject;
    type: 'SimpleSpeech';
    values: SpeechInfoObject;
    verbose?: OutputSpeechVerbose;
  };

  export type OutputSpeechList = {
    brief?: SpeechInfoObject;
    type: 'SpeechList';
    values: Array<SpeechInfoObject>;
    verbose?: OutputSpeechVerbose;
  };

  export type OutputSpeechSet = {
    brief: SpeechInfoObject;
    type: 'SpeechSet';
    values?: SpeechInfoObject;
    verbose: OutputSpeechVerbose;
  };

  export type OutputSpeechVerbose = OutputSpeechSimpleVerbose | OutputSpeechListVerbose;

  export type OutputSpeechSimpleVerbose = {
    type: 'SimpleSpeech';
    values: SpeechInfoObject;
  };

  export type OutputSpeechListVerbose = {
    type: 'SpeechList';
    values: Array<SpeechInfoObject>;
  };

  export type SpeechInfoObject = SpeechInfoText | SpeechInfoUrl;

  export type SpeechInfoText = {
    lang: SpeechLang;
    type: 'PlainText';
    value: string;
  };

  export type SpeechInfoUrl = {
    lang: '';
    type: 'URL';
    value: string;
  };

  export type SlotValue = string | number | null;
  export type SpeechLang = 'ja' | 'ko' | 'en';
  export type OutputSpeechType = 'SimpleSpeech' | 'SpeechList' | 'SpeechSet';

  export interface SkillConfigurator {
    config: {
      requestHandlers: {
        [index: string]: Function;
      };
    };
    on(requestType: string, requestHandler: Function): SkillConfigurator;
    onLaunchRequest(requestHandler: Function): SkillConfigurator;
    onIntentRequest(requestHandler: Function): SkillConfigurator;
    onSessionEndedRequest(requestHandler: Function): SkillConfigurator;
    handle(): Function;
  }

  export interface MiddlewareOptions {
    applicationId: string;
  }

  export interface ClientContext {
    requestObject: RequestBody;
    responseObject: ResponseBody;
    endSession(): void;
    getSessionId(): string;
    getIntentName(): string | null;
    getSlots(): { [key: string]: SlotValue };
    getSlot(slotName: string): SlotValue;
    setOutputSpeech(outputSpeech: OutputSpeech, reprompt?: boolean): void;
    setSimpleSpeech(speechInfo: SpeechInfoObject, reprompt?: boolean): this;
    setSpeechList(speechInfo: Array<SpeechInfoObject>, reprompt?: boolean): this;
    setSpeechSet(speechInfoBrief: SpeechInfoObject, speechInfoVerbose: OutputSpeechVerbose, reprompt?: boolean): this;
  }

  export type Middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => void;
}

export default Clova;
