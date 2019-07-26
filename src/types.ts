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

  export type Request = LaunchRequest | IntentRequest | EventRequest | SessionEndedRequest;

  interface RequestBase<T extends string> {
    type: T;
  }

  export type LaunchRequest = RequestBase<'LaunchRequest'>;

  export type IntentRequest = RequestBase<'IntentRequest'> & {
    intent: {
      name: string;
      slots: {
        [key: string]: {
          name: string;
          value: SlotValue;
          valueType?: SlotValueType;
          unit?: SlotUnit;
        };
      };
    };
  };

  export type EventRequest = RequestBase<'EventRequest'> & {
    requestId: string;
    timestamp: string;
    locale: string;
    extensionId: string;
    event:
      | clovaSkill.SkillEnabled
      | clovaSkill.SkillDisabled
      | audioPlayer.PlayFinished
      | audioPlayer.PlayPaused
      | audioPlayer.PlayResumed
      | audioPlayer.PlayStarted
      | audioPlayer.PlayStopped
      | audioPlayer.ProgressReportDelayPassed
      | audioPlayer.ProgressReportIntervalPassed
      | audioPlayer.ProgressReportPositionPassed
      | audioPlayer.StreamRequested;
  };

  export type SessionEndedRequest = RequestBase<'SessionEndedRequest'>;

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
    directives: Directive[];
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
    values: SpeechInfoObject[];
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
    values: SpeechInfoObject[];
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
  export type SlotValueType = 'DATETIME' | 'DATETIME.INTERVAL' | 'DATE' | 'DATE.INTERVAL' | 'TIME' | 'TIME.INTERVAL';
  export type SlotUnit = string | null;
  export type RequestHandlerType = 'LaunchRequest' | 'IntentRequest' | 'EventRequest' | 'SessionEndedRequest';

  export interface SkillConfigurator<T> {
    config: {
      requestHandlers: {
        [index: string]: (ctx: T) => void;
      };
    };
    on(requestType: RequestHandlerType, requestHandler: (ctx: T) => void): SkillConfigurator<T>;
    onLaunchRequest(requestHandler: (ctx: T) => void): SkillConfigurator<T>;
    onIntentRequest(requestHandler: (ctx: T) => void): SkillConfigurator<T>;
    onEventRequest(requestHandler: (ctx: T) => void): SkillConfigurator<T>;
    onSessionEndedRequest(requestHandler: (ctx: T) => void): SkillConfigurator<T>;
    handle(): (req: any, res: any) => void;
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
    getSlotValueTypes(): { [key: string]: SlotValueType };
    getSlotUnits(): { [key: string]: SlotUnit };
    getSlot(slotName: string): SlotValue;
    getSlotValueType(slotName: string): SlotValueType;
    getSlotUnit(slotName: string): SlotUnit;
    getUser(): User;
    setOutputSpeech(outputSpeech: OutputSpeech, reprompt?: boolean): void;
    setSimpleSpeech(speechInfo: SpeechInfoObject, reprompt?: boolean): this;
    setSpeechList(speechInfo: SpeechInfoObject[], reprompt?: boolean): this;
    setSpeechSet(speechInfoBrief: SpeechInfoObject, speechInfoVerbose: OutputSpeechVerbose, reprompt?: boolean): this;
    getSessionAttributes(): object;
    setSessionAttributes(sessionAttributes: object): void;
    setReprompt(outputSpeech: OutputSpeech): void;
  }

  export type Middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => void;

  export namespace audioPlayer {
    interface PlayBase<T> {
      namespace: 'AudioPlayer';
      name: T;
      payload: {
        offsetInMilliseconds: number;
        token: string;
      };
    }
    type PlayFinished = PlayBase<'PlayFinished'>;
    type PlayPaused = PlayBase<'PlayPaused'>;
    type PlayResumed = PlayBase<'PlayResumed'>;
    type PlayStarted = PlayBase<'PlayStarted'>;
    type PlayStopped = PlayBase<'PlayStopped'>;
    type ProgressReportDelayPassed = PlayBase<'ProgressReportDelayPassed'>;
    type ProgressReportIntervalPassed = PlayBase<'ProgressReportIntervalPassed'>;
    type ProgressReportPositionPassed = PlayBase<'ProgressReportPositionPassed'>;

    interface StreamRequested {
      namespace: 'AudioPlayer';
      name: 'StreamRequested';
      payload: any;
    }
  }

  export namespace clovaSkill {
    interface SkillBase<T extends string> {
      namespace: 'ClovaSkill';
      name: T;
      payload: null;
    }
    type SkillEnabled = SkillBase<'SkillEnabled'>;
    type SkillDisabled = SkillBase<'SkillDisabled'>;
  }
}

export default Clova;
