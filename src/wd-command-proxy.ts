import e, { Request, Response, NextFunction } from 'express';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { createProxyMiddleware } from 'http-proxy-middleware';
import _ from 'lodash';
import { unblockDevice } from './data-service/device-service';
import axios from 'axios';
import log from './logger';

const remoteProxyMap: Map<string, any> = new Map();
const remoteHostMap: Map<string, any> = new Map();

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
      proxyReq: proxyRequestInterceptor,
      proxyRes: (proxyRes: any, req: any, res: any) => {
        // log.debug(`proxyRes host: ${req.headers.host} method: ${req.method}  path: ${req.url}`);
      },
      error: (err: any, req: any, res: any) => {
        log.error('proxy handler error: ', err.message, ' data: ', err.response.data);
      },
    },
  };

  if (proxyServer) {
    //log.info(`Added proxy to createProxyMiddleware: ${JSON.stringify(proxyServer)}`);
    config.agent = new HttpsProxyAgent(proxyServer);
  }

  log.info(`Creating remote proxy for session ${sessionId} to ${remoteHost}`);
  remoteProxyMap.set(sessionId, createProxyMiddleware(config));
  remoteHostMap.set(sessionId, remoteHost);
}

export function removeProxyHandler(sessionId: string) {
  remoteProxyMap.delete(sessionId);
}

function proxyRequestInterceptor(proxyReq: any, req: any, res: any) {
  if (!new RegExp(/post|put|patch/g).test(req.method.toLowerCase())) {
    log.debug(`📱 Skipping request for session ${JSON.stringify(req.method)}`);
    return;
  }

  // log.debug(`📱 Intercepting request ${req.method} ${req.url} ${JSON.stringify(req.body)}`);

  const contentType = proxyReq.getHeader('Content-Type');

  const writeBody = (bodyData: string) => {
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
    proxyReq.end();
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
    if (proxyServer) {
      const response = await axios({
        method: req.method,
        url: new URL(req.path, new URL(remoteHostMap.get(sessionId)).origin).toString(),
        data: req.body,
        params: req.query,
        validateStatus: () => true,
        httpsAgent: new HttpsProxyAgent(proxyServer),
        httpAgent: new HttpProxyAgent(proxyServer),
        proxy: false,
      });
      res.status(response.status).json(response.data);
    } else {
      remoteProxyMap.get(sessionId)(req, res, next);
    }
    if (req.method === 'DELETE') {
      log.info(
        `📱 Unblocking the device that is blocked for session ${sessionId} in remote machine`,
      );
      unblockDevice({ session_id: sessionId });
      removeProxyHandler(sessionId);
    }
  } else {
    return next();
  }
}

export function registerProxyMiddlware(expressApp: any) {
  log.info('Registering proxy middleware');
  const index = expressApp._router.stack.findIndex((s: any) => s.route);
  expressApp.use('/', handler);
  expressApp._router.stack.splice(index, 0, expressApp._router.stack.pop());
}
