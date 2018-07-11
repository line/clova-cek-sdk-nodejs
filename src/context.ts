import Clova from './types';
import 'core-js/library/fn/object/values';

/**
 * Create Context for clova response.
 *
 * @class ClientContext
 */
export class Context implements Clova.ClientContext {
  requestObject: Clova.RequestBody;
  responseObject: Clova.ResponseBody;

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
  endSession(): void {
    this.responseObject.response.shouldEndSession = true;
    this.responseObject.sessionAttributes = {};
  }

  /**
   * Get sessionId from clova request
   *
   * @memberOf Context
   */
  getSessionId(): string {
    return this.requestObject.session.sessionId;
  }

  /**
   * Get intent name from clova IntentRequest
   *
   * @memberOf Context
   */
  getIntentName(): string | null {
    const request = this.requestObject.request as Clova.IntentRequest;
    return request.intent ? request.intent.name : null;
  }

  /**
   * Get slots key-value pair from clova IntentRequest.
   *
   * @memberOf Context
   */
  getSlots(): { [key: string]: Clova.SlotValue } {
    const request = this.requestObject.request as Clova.IntentRequest;
    if (!request.intent || !request.intent.slots) return {};

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
  getSlot(slotName: string): Clova.SlotValue {
    return this.getSlots()[slotName] || null;
  }

  /**
   * Set outputSpeech content
   *
   * @param {Clova.OutputSpeech} outputSpeech
   * @param {boolean} reprompt
   * @memberOf Context
   */
  setOutputSpeech(outputSpeech: Clova.OutputSpeech, reprompt: boolean = false): void {
    if (reprompt) {
      this.responseObject.response.reprompt = { outputSpeech };
    } else {
      this.responseObject.response.outputSpeech = outputSpeech;
    }
  }

  /**
   * Set SimpleSpeech object for outputSpeech content.
   *
   * @param {Clova.SpeechInfoObject} speechInfo
   * @param {boolean} reprompt
   * @memberOf Context
   */
  setSimpleSpeech(speechInfo: Clova.SpeechInfoObject, reprompt: boolean = false): this {
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
  setSpeechList(speechInfo: Array<Clova.SpeechInfoObject>, reprompt: boolean = false): this {
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
  setSpeechSet(
    speechInfoBrief: Clova.SpeechInfoObject,
    speechInfoVerbose: Clova.OutputSpeechVerbose,
    reprompt: boolean = false,
  ): this {
    const outputSpeech: Clova.OutputSpeechSet = {
      type: 'SpeechSet',
      brief: speechInfoBrief,
      verbose: speechInfoVerbose,
    };
    this.setOutputSpeech(outputSpeech, reprompt);
    return this;
  }
}
