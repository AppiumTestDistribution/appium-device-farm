import { Request, Response, NextFunction } from 'express';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { createProxyMiddleware } from 'http-proxy-middleware';
import _ from 'lodash';
import { unblockDevice } from './data-service/device-service';
import logger from './logger';
import axios from "axios";

const remoteProxyMap: Map<string, any> = new Map();
const remoteHostMap: Map<string, any> = new Map();

function getProxyServer() {
  return process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
}

export function addProxyHandler(sessionId: string, remoteHost: string) {
  const proxyServer = getProxyServer();
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
  remoteHostMap.set(sessionId, remoteHost);
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
  const proxyServer = getProxyServer();
  const sessionId = getSessionIdFromUr(req.url);

  if (!sessionId) {
    return next();
  }
  if (remoteProxyMap.has(sessionId)) {
    if(proxyServer) {
        const response = await axios({
          method: req.method,
          url: new URL(req.path, new URL(remoteHostMap.get(sessionId)).origin).toString(),
          data: req.body,
          params: req.query,
          validateStatus: () => true,
          httpsAgent : new HttpsProxyAgent(proxyServer),
          httpAgent : new HttpProxyAgent(proxyServer),
          proxy: false
        })
      res.status(response.status).json(response.data);
    } else {
      remoteProxyMap.get(sessionId)(req, res, next);
    }
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
