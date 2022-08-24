import { expect } from 'chai';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const remoteProxyMap: Map<string, any> = new Map();

export function addProxyHandler(sessionId: string, remoteHost: string) {
  remoteProxyMap.set(sessionId, createProxyMiddleware({ target: remoteHost }));
}

function getSessionIdFromUr(url: string) {
  const SESSION_ID_PATTERN = /\/session\/([^/]+)/;
  const match = SESSION_ID_PATTERN.exec(url);
  if (match) {
    return match[1];
  }
  return null;
}

function handler(req: Request, res: Response, next: NextFunction) {
  let sessionId = getSessionIdFromUr(req.url);
  if (!sessionId) {
    return next();
  }

  if (remoteProxyMap.has(sessionId)) {
    remoteProxyMap.get(sessionId)(req, res, next);
  } else {
    return next();
  }
}

export function registerProxyMiddlware(expressApp: any) {
  let index = expressApp._router.stack.findIndex((s: any) => s.route);
  expressApp.use('/', handler);
  expressApp._router.stack.splice(index, 0, expressApp._router.stack.pop());
}
