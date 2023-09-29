import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, fixRequestBody, responseInterceptor } from 'http-proxy-middleware';
import _ from 'lodash';
import { unblockDevice } from '../data-service/device-service';
import logger from '../logger';
import ProxyRequestCache from './ProxyRequestGaurd';
import { v4 as uuid } from 'uuid';

const remoteProxyMap: Map<string, any> = new Map();

export function addProxyHandler(sessionId: string, remoteHost: string) {
  remoteProxyMap.set(
    sessionId,
    createProxyMiddleware({
      target: new URL(remoteHost).origin,
      logLevel: 'debug',
      changeOrigin: true,
      selfHandleResponse: true,
      onProxyReq: fixRequestBody,
      onProxyRes: responseInterceptor(proxyResponseInterceptor),
    })
  );
}

async function proxyResponseInterceptor(responseBuffer: any, proxyRes: any, req: any, res: any) {
  const responseString: any = responseBuffer.toString('utf8');
  const requestCacheEntry = ProxyRequestCache.get(req.request_id);
  requestCacheEntry?.waitForResponse.resolve(responseString);
  await requestCacheEntry?.requestLock.promise;
  return responseString;
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
  const sessionId = getSessionIdFromUr(req.url);
  if (!sessionId) {
    return next();
  }
  if (remoteProxyMap.has(sessionId)) {
    handleRemoteRequest(sessionId, req, res, next);
    if (req.method === 'DELETE') {
      logger.info(
        `📱 Unblocking the device that is blocked for session ${sessionId} in remote machine`
      );
      unblockDevice({ session_id: sessionId });
      removeProxyHandler(sessionId);
    }
  } else {
    handleLocalRequest(sessionId, req, res, next);
  }
}

async function handleLocalRequest(
  sessionId: string,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const [oldWrite, oldEnd] = [res.write, res.end];
  const chunks: Buffer[] = [];

  (res.write as unknown) = function (...args: any) {
    chunks.push(Buffer.from(args[0]));
    oldWrite.apply(res, args);
  };

  (res.end as unknown) = async function (...args: any) {
    if (args[0]) {
      chunks.push(Buffer.from(args[0]));
    }
    const body = Buffer.concat(chunks).toString('utf8');
    const statusCode = res.statusCode;
    //console.log(new Date(), `  ↪ [${statusCode}]: ${body}`);
    // take screen shot and save logs to db
    oldEnd.apply(res, args);
  };
  next();
}

async function handleRemoteRequest(
  sessionId: string,
  req: Request & { id?: string },
  res: Response,
  next: NextFunction
) {
  req.id = uuid();
  const { waitForResponse, requestLock } = ProxyRequestCache.add(req.id);
  remoteProxyMap.get(sessionId)(req, res, next);
  const response = await waitForResponse.promise;
  console.log('Response from proxy');
  console.log(response);
  // take screen shot and save logs to db
  requestLock.resolve();
}

export function registerProxyMiddlware(expressApp: any) {
  const index = expressApp._router.stack.findIndex((s: any) => s.route);
  expressApp.use('/', handler);
  expressApp._router.stack.splice(index, 0, expressApp._router.stack.pop());
}
