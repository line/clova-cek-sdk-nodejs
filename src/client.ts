import { Context } from './context';
import Clova from './types';

export class SkillConfigurator implements Clova.SkillConfigurator<Context> {
  public config: {
    requestHandlers: {
      [index: string]: (ctx: Context) => void;
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
   * @param {(ctx:Context) => void} requestHandler
   * @returns
   */
  public on(requestType: string, requestHandler: (ctx: Context) => void): this {
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
  public onLaunchRequest(requestHandler: (ctx: Context) => void): this {
    this.on('LaunchRequest', requestHandler);
    return this;
  }

  /**
   * Add IntentRequest handler for clova request.
   *
   * @param requestHandler
   */
  public onIntentRequest(requestHandler: (ctx: Context) => void): this {
    this.on('IntentRequest', requestHandler);
    return this;
  }

  /**
   * Add EventRequest handler for clova request.
   *
   * @param requestHandler
   */
  public onEventRequest(requestHandler: (ctx: Context) => void): this {
    this.on('EventRequest', requestHandler);
    return this;
  }

  /**
   * Add SessionEndedRequest handler for clova request.
   *
   * @param requestHandler
   */
  public onSessionEndedRequest(requestHandler: (ctx: Context) => void): this {
    this.on('SessionEndedRequest', requestHandler);
    return this;
  }

  /**
   * Create esxpress route handler for dispatching request.
   *
   * @returns {(req: any, res: any) => void}
   * @memberOf SkillConfigurator
   */
  public handle(): (req: any, res: any) => void {
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

  /**
   * Create lambda handler for dispatching request.
   *
   * @returns
   * @memberOf SkillConfigurator
   */
  public lambda() {
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

  /**
   * Create firebase handler for dispatching request.
   * However, the contents are express.
   *
   * @returns
   * @memberOf SkillConfigurator
   */
  public firebase() {
    return this.handle();
  }
}

// tslint:disable-next-line:max-classes-per-file
export default class Client {
  /**
   * Create SkillConfigurator for clova skills.
   *
   * @returns SkillConfigurator
   */
  public static configureSkill(): SkillConfigurator {
    return new SkillConfigurator();
  }
}
