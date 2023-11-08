import { Request, Response, NextFunction } from 'express';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { createProxyMiddleware } from 'http-proxy-middleware';
import _ from 'lodash';
import { unblockDevice } from './data-service/device-service';
import logger from './logger';

const remoteProxyMap: Map<string, any> = new Map();

export function addProxyHandler(sessionId: string, remoteHost: string) {
  const proxyServer = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  logger.info(`proxyServer: ${JSON.stringify(proxyServer)}`)
  const config: any = {
    target: new URL(remoteHost).origin,
    logLevel: 'debug',
    changeOrigin: true,
    onProxyReq: proxyRequestInterceptor,
  };
  if (proxyServer) {
    logger.info(`Added proxy to createProxyMiddleware: ${JSON.stringify(proxyServer)}`);
    config.agent = new HttpsProxyAgent(proxyServer);
  }
  remoteProxyMap.set(
    sessionId,
    createProxyMiddleware(config)
  );
}

export function removeProxyHandler(sessionId: string) {
  remoteProxyMap.delete(sessionId);
}

function proxyRequestInterceptor(proxyReq: any, req: any, res: any) {
  if (!new RegExp(/post|put|patch/g).test(req.method.toLowerCase())) {
    return;
  }
  const contentType = proxyReq.getHeader('Content-Type');

  const writeBody = (bodyData: string) => {
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  };

  if (contentType && contentType.includes('application/json')) {
    writeBody(JSON.stringify(req.body || {}));
  }
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
  const sessionId = getSessionIdFromUr(req.url);
  if (!sessionId) {
    return next();
  }
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
    return next();
  }
}

export function registerProxyMiddlware(expressApp: any) {
  const index = expressApp._router.stack.findIndex((s: any) => s.route);
  expressApp.use('/', handler);
  expressApp._router.stack.splice(index, 0, expressApp._router.stack.pop());
}
