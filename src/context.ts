import 'core-js/fn/object/values';
import uuid from 'uuid';
import Clova from './types';

/**
 * Create Context for clova response.
 *
 * @class ClientContext
 */
export class Context implements Clova.ClientContext {
  public requestObject: Clova.RequestBody;
  public responseObject: Clova.ResponseBody;

  constructor(req: Clova.RequestBody) {
    this.requestObject = req;
    this.responseObject = {
      response: {
        card: {},
        directives: [],
        outputSpeech: {},
        shouldEndSession: false,
      },
      sessionAttributes: req.session.sessionAttributes,
      version: req.version,
    };
  }

  /**
   * Set session end attributes for clova response.
   *
   * @memberOf Context
   */
  public endSession(): void {
    this.responseObject.response.shouldEndSession = true;
    this.responseObject.sessionAttributes = {};
  }

  /**
   * Get sessionId from clova request
   *
   * @memberOf Context
   */
  public getSessionId(): string {
    return this.requestObject.session.sessionId;
  }

  /**
   * Get intent name from clova IntentRequest
   *
   * @memberOf Context
   */
  public getIntentName(): string | null {
    const request = this.requestObject.request as Clova.IntentRequest;
    return request.intent ? request.intent.name : null;
  }

  /**
   * Get slots key-value pair from clova IntentRequest.
   *
   * @memberOf Context
   */
  public getSlots(): { [key: string]: Clova.SlotValue } {
    const request = this.requestObject.request as Clova.IntentRequest;
    if (!request.intent || !request.intent.slots) {
      return {};
    }

    return Object.values(request.intent.slots).reduce((acc, curr) => {
      return Object.assign({}, acc, { [curr.name]: curr.value });
    }, {});
  }

  /**
   * Get slot value for particular slot name from clova IntentRequest.
   *
   * @param {string} slotName
   * @memberOf Context
   */
  public getSlot(slotName: string): Clova.SlotValue {
    return this.getSlots()[slotName] || null;
  }

  /**
   * Get {Clova.User} from clova request
   *
   * @memberOf Context
   */
  public getUser(): Clova.User {
    return this.requestObject.session.user;
  }

  /**
   * Set outputSpeech content
   *
   * @param {Clova.OutputSpeech} outputSpeech
   * @param {boolean} reprompt
   * @memberOf Context
   */
  public setOutputSpeech(outputSpeech: Clova.OutputSpeech, reprompt: boolean = false): void {
    if (reprompt) {
      this.responseObject.response.reprompt = { outputSpeech };
    } else {
      this.responseObject.response.outputSpeech = outputSpeech;
    }
  }

  /**
   * Set reprompt content
   *
   * @param {Clova.OutputSpeech} outputSpeech
   * @memberOf Context
   */
  public setReprompt(outputSpeech: Clova.OutputSpeech): void {
    this.responseObject.response.reprompt = { outputSpeech };
  }

  /**
   * Set SimpleSpeech object for outputSpeech content.
   *
   * @param {Clova.SpeechInfoObject} speechInfo
   * @param {boolean} reprompt
   * @memberOf Context
   */
  public setSimpleSpeech(speechInfo: Clova.SpeechInfoObject, reprompt: boolean = false): this {
    const outputSpeech: Clova.OutputSpeechSimple = {
      type: 'SimpleSpeech',
      values: speechInfo,
    };
    this.setOutputSpeech(outputSpeech, reprompt);
    return this;
  }

  /**
   * Set SpeechList object for outputSpeech content.
   *
   * @param {Clova.SpeechInfoObject[]} speechInfo
   * @param {boolean} reprompt
   * @memberOf Context
   */
  public setSpeechList(speechInfo: Clova.SpeechInfoObject[], reprompt: boolean = false): this {
    const outputSpeech: Clova.OutputSpeechList = {
      type: 'SpeechList',
      values: speechInfo,
    };
    this.setOutputSpeech(outputSpeech, reprompt);
    return this;
  }

  /**
   * Set SpeechSet object for outputSpeech content.
   *
   * @param {Clova.SpeechInfoObject} speechInfoBrief
   * @param {Clova.OutputSpeechListVerbose} speechInfoVerbose
   * @param {boolean} reprompt
   * @memberOf Context
   */
  public setSpeechSet(
    speechInfoBrief: Clova.SpeechInfoObject,
    speechInfoVerbose: Clova.OutputSpeechVerbose,
    reprompt: boolean = false,
  ): this {
    const outputSpeech: Clova.OutputSpeechSet = {
      brief: speechInfoBrief,
      type: 'SpeechSet',
      verbose: speechInfoVerbose,
    };
    this.setOutputSpeech(outputSpeech, reprompt);
    return this;
  }

  /**
   * Get sessionAttributes from clova request.
   *
   * @memberOf Context
   */
  public getSessionAttributes(): object {
    return this.requestObject.session.sessionAttributes;
  }

  /**
   * Set sessionAttributes for clova response.
   *
   * @memberOf Context
   */
  public setSessionAttributes(sessionAttributes: object): void {
    this.responseObject.sessionAttributes = sessionAttributes;
  }

  /**
   * Add directives {AudioPlayer.PlayDirective} for clova response.
   *
   * @param {Clova.audioPlayer.PlayBehavior} playBehavior
   * @param {string} url
   * @param {string} token
   * @param {number} beginAtInMilliseconds
   * @param {boolean} urlPlayable
   * @param {Clova.audioPlayer.Metadata} metadata
   * @param {Clova.audioPlayer.Source} source
   * @memberOf Context
   */
  public addAudioPlayerPlayDirective(
    playBehavior: Clova.audioPlayer.PlayBehavior,
    url: string,
    token: string,
    beginAtInMilliseconds: number,
    urlPlayable: boolean,
    metadata: Clova.audioPlayer.Metadata,
    source: Clova.audioPlayer.Source
  ): this {
    const directive: Clova.audioPlayer.PlayDirective = {
      header: {
        dialogRequestId: this.requestObject.request.requestId,
        messageId: uuid.v4(),
        name: 'Play',
        namespace: 'AudioPlayer',
      },
      payload: {
        audioItem: {
          audioItemId: uuid.v4(),
          stream: {
            beginAtInMilliseconds,
            token,
            url,
            urlPlayable
          },
          titleSubText1: metadata.titleSubText1,
          titleSubText2: metadata.titleSubText2,
          titleText: metadata.titleText
        },
        playBehavior,
        source
      }
    };

    this.responseObject.response.directives.push(directive);

    return this;
  }
}
