import Clova from './types';
import { Context } from './context';

export class SkillConfigurator implements Clova.SkillConfigurator {
  config: {
    requestHandlers: {
      [index: string]: Function;
    };
  };

  constructor() {
    this.config = {
      requestHandlers: {},
    };
  }

  /**
   * Add a request handler for a given request type.
   *
   * @param {String} requestType
   * @param {Function} requestHandler
   * @returns
   * @memberOf SkillConfigurator
   */
  on(requestType: string, requestHandler: Function): this {
    if (!this.config.requestHandlers[requestType]) {
      this.config.requestHandlers[requestType] = requestHandler;
    }
    return this;
  }

  /**
   * Add LaunchRequest handler for clova request.
   *
   * @param requestHandler
   */
  onLaunchRequest(requestHandler: Function): this {
    this.on('LaunchRequest', requestHandler);
    return this;
  }

  /**
   * Add IntentRequest handler for clova request.
   *
   * @param requestHandler
   */
  onIntentRequest(requestHandler: Function): this {
    this.on('IntentRequest', requestHandler);
    return this;
  }

  /**
   * Add SessionEndedRequest handler for clova request.
   *
   * @param requestHandler
   */
  onSessionEndedRequest(requestHandler: Function): this {
    this.on('SessionEndedRequest', requestHandler);
    return this;
  }

  /**
   * Create esxpress route handler for dispatching request.
   *
   * @returns {Function}
   * @memberOf SkillConfigurator
   */
  handle(): Function {
    return async (req: any, res: any) => {
      const ctx = new Context(req.body);

      try {
        const requestType = ctx.requestObject.request.type;
        const requestHandler = this.config.requestHandlers[requestType];

        if (requestHandler) {
          await requestHandler.call(ctx, ctx);
          res.json(ctx.responseObject);
        } else {
          throw new Error(`Unable to find requestHandler for '${requestType}'`);
        }
      } catch (error) {
        console.error(error.message);
        res.sendStatus(500);
      }
    };
  }

  lambda(): Function {
    return async (event: any) => {
      const ctx = new Context(event);

      const requestType = ctx.requestObject.request.type;
      const requestHandler = this.config.requestHandlers[requestType];

      if (requestHandler) {
        await requestHandler.call(ctx, ctx);
        return ctx.responseObject;
      } else {
        throw new Error(`Unable to find requestHandler for '${requestType}'`);
      }
    };
  }

  firebase(): Function {
    return this.handle();
  }
}

export default class Client {
  /**
   * Create SkillConfigurator for clova skills.
   *
   * @returns SkillConfigurator
   */
  static configureSkill(): SkillConfigurator {
    return new SkillConfigurator();
  }
}
