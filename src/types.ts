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
          valueType?: SlotValueType;
        };
      };
    };
  };

  export type EventRequest = {
    type: 'EventRequest';
    requestId: string;
    timestamp: string;
    locale: string;
    extensionId: string;
    event: clovaSkill.SkillEnabled | clovaSkill.SkillDisabled | audioPlayer.PlayFinished | audioPlayer.PlayPaused | audioPlayer.PlayResumed | audioPlayer.PlayStarted | audioPlayer.PlayStopped | audioPlayer.ProgressReportDelayPassed | audioPlayer.ProgressReportIntervalPassed | audioPlayer.ProgressReportPositionPassed | audioPlayer.StreamRequested;
  }

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
  export type SlotValueType = 'DATE' | 'DATE.INTERVAL' | 'TIME' | 'TIME.INTERVAL';

  export interface SkillConfigurator {
    config: {
      requestHandlers: {
        [index: string]: Function;
      };
    };
    on(requestType: string, requestHandler: Function): SkillConfigurator;
    onLaunchRequest(requestHandler: Function): SkillConfigurator;
    onIntentRequest(requestHandler: Function): SkillConfigurator;
    onEventRequest(requestHandler: Function): SkillConfigurator;
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
    interface PlayFinished {
      namespace: 'AudioPlayer';
      name: 'PlayFinished';
      payload: {
        offsetInMilliseconds: number;
        token: string;
      }
    }

    interface PlayPaused {
      namespace: 'AudioPlayer';
      name: 'PlayPaused';
      payload: {
        offsetInMilliseconds: number;
        token: string;
      }
    }

    interface PlayResumed {
      namespace: 'AudioPlayer';
      name: 'PlayResumed';
      payload: {
        offsetInMilliseconds: number;
        token: string;
      }
    }

    interface PlayStarted {
      namespace: 'AudioPlayer';
      name: 'PlayStarted';
      payload: {
        offsetInMilliseconds: number;
        token: string;
      }
    }

    interface PlayStopped {
      namespace: 'AudioPlayer';
      name: 'PlayStopped';
      payload: {
        offsetInMilliseconds: number;
        token: string;
      }
    }

    interface ProgressReportDelayPassed {
      namespace: 'AudioPlayer';
      name: 'ProgressReportDelayPassed';
      payload: {
        offsetInMilliseconds: number;
        token: string;
      }
    }

    interface ProgressReportIntervalPassed {
      namespace: 'AudioPlayer';
      name: 'ProgressReportIntervalPassed';
      payload: {
        offsetInMilliseconds: number;
        token: string;
      }
    }

    interface ProgressReportPositionPassed {
      namespace: 'AudioPlayer';
      name: 'ProgressReportPositionPassed';
      payload: {
        offsetInMilliseconds: number;
        token: string;
      }
    }

    interface StreamRequested {
      namespace: 'AudioPlayer';
      name: 'StreamRequested';
      payload: any;
    }
  }

  export namespace clovaSkill {
    interface SkillEnabled {
      namespace: 'ClovaSkill';
      name: 'SkillEnabled';
      payload: null;
    }

    interface SkillDisabled {
      namespace: 'ClovaSkill';
      name: 'SkillDisabled';
      payload: null;
    }
  }
}

export default Clova;
