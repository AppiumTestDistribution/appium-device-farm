import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import _ from 'lodash';
import { unblockDevice } from '../data-service/device-service';
import logger from '../logger';
import { SESSION_MANAGER } from '../sessions/SessionManager';
import { DASHBORD_EVENT_MANAGER } from '../dashboard/event-manager';
import { routeToCommandName } from '@appium/base-driver';
import { hasHub } from '../helpers';

const remoteProxyMap: Map<string, any> = new Map();
function getProxyServer() {
  return process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
}

export function addProxyHandler(sessionId: string, remoteHost: string) {
  const proxyServer = getProxyServer();
  const targetBasePath = new URL(remoteHost).pathname;
  const config: any = {
    target: new URL(remoteHost).origin,
    changeOrigin: true,
    pathRewrite: (path: any, req: any) => {
      const newPath = `${targetBasePath}/${path}`;
      return newPath;
    },
    on: {
      proxyReq: fixRequestBody,
      proxyRes: (proxyRes: any, req: any, res: any) => {
        // log.debug(`proxyRes host: ${req.headers.host} method: ${req.method}  path: ${req.url}`);
      },
      error: (err: any, req: any, res: any) => {
        logger.error('proxy handler error: ', err.message, ' data: ', err.response.data);
      },
    },
  };
  remoteProxyMap.set(sessionId, createProxyMiddleware(config));
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

function handler(cliArgs: Record<string, any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (new RegExp(/wd-internal\//).test(req.url)) {
      req.url = req.originalUrl = req.url.replace('wd-internal/', '');
      return next();
    }

    if (!req.path.startsWith('/wd/hub')) {
      return next();
    }

    const sessionId = getSessionIdFromUr(req.url);
    req.headers['accept-encoding'] = 'deflate';
    if (!sessionId || !SESSION_MANAGER.isValidSession(sessionId)) {
      return next();
    }

    if (!hasHub(cliArgs)) {
      // Hack to decode gzip responses in lambdatest
      const commandName = routeToCommandName(req.path, req.method as any, cliArgs['basePath']);
      const shouldProceed = await DASHBORD_EVENT_MANAGER.beforeSessionCommand(
        sessionId,
        commandName,
        req,
        res,
      );
      if (!shouldProceed) {
        return;
      }

      interceptResponse(sessionId, commandName, req, res);
    }

    if (remoteProxyMap.has(sessionId)) {
      remoteProxyMap.get(sessionId)(req, res, next);
      if (req.method === 'DELETE') {
        logger.info(
          `📱 Unblocking the device that is blocked for session ${sessionId} in remote machine`,
        );
        unblockDevice({ session_id: sessionId });
        removeProxyHandler(sessionId);
      }
    } else {
      next();
    }
  };
}

async function interceptResponse(
  sessionId: string,
  commandName: string | undefined,
  req: Request,
  res: Response,
) {
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
      await DASHBORD_EVENT_MANAGER.afterSessionCommand(sessionId, commandName, req, res, body);
    }

    originalEnd.apply(res, args);
  };
}

export function registerProxyMiddlware(expressApp: any, cliArgs: Record<string, any>) {
  const index = expressApp._router.stack.findIndex((s: any) => s.route);
  expressApp.use('/', handler(cliArgs));
  expressApp._router.stack.splice(index, 0, expressApp._router.stack.pop());
}
