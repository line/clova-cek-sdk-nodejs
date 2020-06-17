import * as express from 'express';
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
   * @param {Clova.RequestHandlerType} requestType
   * @param {(ctx:Context) => void} requestHandler
   * @returns
   */
  public on(requestType: Clova.RequestHandlerType, requestHandler: (ctx: Context) => void): this {
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
   * Create express route handler for dispatching request.
   *
   * @returns {(req: express.Request, res: express.Response) => void}
   * @memberOf SkillConfigurator
   */
  public handle(): (req: express.Request, res: express.Response) => void {
    return async (req: express.Request, res: express.Response) => {
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
   * @returns {(event: Clova.RequestBody) => Promise<Clova.ResponseBody>}
   * @memberOf SkillConfigurator
   */
  public lambda(): (event: Clova.RequestBody) => Promise<Clova.ResponseBody> {
    return async (event: Clova.RequestBody) => {
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
   * @returns {(req: express.Request, res: express.Response) => void}
   * @memberOf SkillConfigurator
   */
  public firebase(): (req: express.Request, res: express.Response) => void {
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
