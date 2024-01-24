import { Request, Response, NextFunction } from 'express';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import _ from 'lodash';
import { unblockDeviceMatchingFilter, updateCmdExecutedTime } from '../data-service/device-service';
import axios from 'axios';
import log from '../logger';
import { getSessionIdFromUrl, hasHubArgument } from '../helpers';
import { ExpressMiddleware } from '../interfaces/IExternalModule';

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
      proxyReq: fixRequestBody,
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

function handler(cliArgs: Record<string, any>, middlewares: ExpressMiddleware[]) {
  const WEBDRIVER_BASE_PATH = (cliArgs['basePath'] || '').replace(/\/$/, '') + '/session';
  const isHub = !hasHubArgument(cliArgs); //if hub cliArg is provided, then current appium process serves as a NODE
  return async (req: Request, res: Response, next: NextFunction) => {
    if (isHub && !req.path.startsWith(WEBDRIVER_BASE_PATH)) {
      log.info(
        `Received non-webdriver request with url ${req.path}. So, not proxying it to downstream.`,
      );
      return next();
    }

    const sessionId = getSessionIdFromUrl(req.url);
    const proxyServer = getProxyServer();

    if (!sessionId) {
      return next();
    }

    await updateCmdExecutedTime(sessionId);

    const defaultHandler = async () => {
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
          unblockDeviceMatchingFilter({ session_id: sessionId });
          removeProxyHandler(sessionId);
        }
      } else {
        next();
      }
    };

    const handler = wrapRequestWithMiddleware({
      request: req,
      response: res,
      next: defaultHandler,
      middlewares: middlewares,
    });

    handler();
  };
}

export function registerProxyMiddlware(
  expressApp: any,
  cliArgs: Record<string, any>,
  middlewares: ExpressMiddleware[],
) {
  log.info('Registering proxy middleware');
  const index = expressApp._router.stack.findIndex((s: any) => s.route);
  expressApp.use('/', handler(cliArgs, middlewares));
  expressApp._router.stack.splice(index, 0, expressApp._router.stack.pop());
}

export function wrapRequestWithMiddleware(options: {
  next: () => void;
  middlewares: ExpressMiddleware[];
  request: Request;
  response: Response;
}) {
  // eslint-disable-next-line prefer-const
  let { request, response, next, middlewares } = options;
  for (const middlware of middlewares) {
    next = ((_next) => async () => {
      if (_.isFunction(middlware)) {
        return await middlware(request, response, _next);
      }
    })(next);
  }

  return next;
}
