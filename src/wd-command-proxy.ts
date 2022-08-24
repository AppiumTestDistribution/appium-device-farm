import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

function handler(req: Request, res: Response, next: NextFunction) {
  //1. check the sessionID and see if its local or remote session
  //2. if its a local session, call next()
  //3. if its a remote session
  //4. return createProxyMiddleware({target: device.host})(req, res, next);
}

export function registerProxyMiddlware(expressApp: any) {
  let index = expressApp._router.stack.findIndex((s: any) => s.route);
  expressApp.use('/', handler);
  expressApp._router.stack.splice(index, 0, expressApp._router.stack.pop());
}
