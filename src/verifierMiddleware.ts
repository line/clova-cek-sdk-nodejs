import express from 'express';
import { raw } from 'body-parser';
import verifier from './verifier';
import Clova from './types';

export default function verifierMiddleware(
  config: Clova.MiddlewareOptions,
): (req: express.Request, res: express.Response, next: express.NextFunction) => void {
  return (req, res, next) => {
    const signature = req.headers.signaturecek as string;
    const { applicationId } = config;

    const process = async (rawBody: string | Buffer) => {
      const body = Buffer.isBuffer(rawBody) ? rawBody.toString() : rawBody;

      try {
        req.body = await verifier(signature, applicationId, body);
        next();
      } catch (error) {
        next(error);
      }
    };

    if (typeof req.body === 'string' || Buffer.isBuffer(req.body)) {
      return process(req.body);
    }

    raw({ type: '*/*' })(req as any, res as any, async () => await process(req.body));
  };
}
