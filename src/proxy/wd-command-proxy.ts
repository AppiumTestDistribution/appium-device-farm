import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import _ from 'lodash';
import { unblockDevice } from '../data-service/device-service';
import logger from '../logger';
import { SESSION_MANAGER } from '../sessions/SessionManager';
import { DASHBORD_EVENT_MANAGER } from '../dashboard/event-manager';
const remoteProxyMap: Map<string, any> = new Map();

export function addProxyHandler(sessionId: string, remoteHost: string) {
  remoteProxyMap.set(
    sessionId,
    createProxyMiddleware({
      target: new URL(remoteHost).origin,
      logLevel: 'debug',
      changeOrigin: true,
      onProxyReq: fixRequestBody,
    })
  );
}

export function removeProxyHandler(sessionId: string) {
  remoteProxyMap.delete(sessionId);
}

function getSessionIdFromUr(url: string) {
  const SESSION_ID_PATTERN = /\/session\/([^/]+)/;
  const match = SESSION_ID_PATTERN.exec(url);
  if (match) {
    return match[1];
  }
  return null;
}

async function handler(req: Request, res: Response, next: NextFunction) {
  if (new RegExp(/wd-internal\//).test(req.url)) {
    req.url = req.originalUrl = req.url.replace('wd-internal/', '');
    return next();
  }

  if (!req.path.startsWith('/wd/hub')) {
    return next();
  }

  const sessionId = getSessionIdFromUr(req.url);
  // Hack to decode gzip responses in lambdatest
  req.headers['accept-encoding'] = 'deflate';
  if (!sessionId || !SESSION_MANAGER.isValidSession(sessionId)) {
    return next();
  }

  const shouldProceed = await DASHBORD_EVENT_MANAGER.beforeSessionCommand(sessionId, req, res);
  if (!shouldProceed) {
    return;
  }

  interceptResponse(sessionId, req, res);

  if (remoteProxyMap.has(sessionId)) {
    remoteProxyMap.get(sessionId)(req, res, next);
    if (req.method === 'DELETE') {
      logger.info(
        `📱 Unblocking the device that is blocked for session ${sessionId} in remote machine`
      );
      unblockDevice({ session_id: sessionId });
      removeProxyHandler(sessionId);
    }
  } else {
    next();
  }
}

async function interceptResponse(sessionId: string, req: Request, res: Response) {
  const [originalWrite, originalSend, originalEnd] = [res.write, res.send, res.end];
  const chunks: Buffer[] = [];

  // (res.send as unknown) = function (...args: any) {
  //   chunks.push(typeof args[0] === 'string' ? Buffer.from(args[0]) : args[0]);
  //   originalSend.apply(res, args);
  // };

  (res.write as unknown) = function (...args: any) {
    chunks.push(typeof args[0] === 'string' ? Buffer.from(args[0]) : args[0]);
    originalWrite.apply(res, args);
  };

  (res.end as unknown) = async function (...args: any) {
    if (args[0]) {
      chunks.push(typeof args[0] === 'string' ? Buffer.from(args[0]) : args[0]);
    }
    const body = Buffer.concat(chunks).toString('utf8');
    if (req.method === 'DELETE') {
      await DASHBORD_EVENT_MANAGER.onSessionStoped(sessionId);
    } else {
      await DASHBORD_EVENT_MANAGER.afterSessionCommand(sessionId, req, res, body);
    }

    originalEnd.apply(res, args);
  };
}

export function registerProxyMiddlware(expressApp: any) {
  const index = expressApp._router.stack.findIndex((s: any) => s.route);
  expressApp.use('/', handler);
  expressApp._router.stack.splice(index, 0, expressApp._router.stack.pop());
}
