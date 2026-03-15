import { SessionCreatedEvent } from '../events/session-created-event';
import { IDeviceFarmSessionOptions } from '../interfaces/IDeviceFarmSession';
import { EventBus } from '../notifier/event-bus';
import { Request, Response, NextFunction, Application, Router } from 'express';
import { SESSION_MANAGER } from './sessions/SessionManager';
import { getSessionIdFromUrl, nodeUrl } from '../helpers';
import { ServerArgs } from '@appium/types';
import { IPluginArgs } from '../interfaces/IPluginArgs';
import { LocalSession } from './sessions/LocalSession';
import { DeviceFarmSession } from './sessions/DeviceFarmSession';
import _ from 'lodash';
import { CloudSession } from './sessions/CloudSession';
import { RemoteSession } from './sessions/RemoteSession';
import SessionType from '../enums/SessionType';
import log from '../logger';
import { routeToCommandName } from '@appium/base-driver';
import { DASHBOARD_EVENT_MANAGER } from './event-manager';
import DashboardRouter from './router';

export class Dashboard {
  private isHub = false;

  constructor(
    private eventBus: EventBus,
    private serverArgs: ServerArgs,
    private pluginArgs: IPluginArgs,
  ) {
    this.subscribeToSessionCreatedEvent();
    this.isHub = _.isNil(pluginArgs.hub);
  }

  subscribeToSessionCreatedEvent() {
    this.eventBus.addListener(SessionCreatedEvent.listener(this.handleNewSessionEvent.bind(this)));
  }

  public addRoutes(app: Application) {
    const router = Router();
    DashboardRouter.register(router, this.pluginArgs);
    app.use('/device-farm/api/dashboard', router);
  }

  async requestInterceptingMiddleware(request: Request, response: Response, next: NextFunction) {
    if (new RegExp(/wd-internal\//).test(request.url)) {
      request.url = request.originalUrl = request.url.replace('wd-internal/', '');
      return next();
    }

    const sessionId = getSessionIdFromUrl(request.url);
    if (!sessionId) {
      return next();
    }

    const commandName = this.extractCommandName(request);
    const proceed = await this.preSessionCommandHook(sessionId, commandName, request, response);
    if (!proceed) return;

    if (this.shouldInterceptRequest(sessionId)) {
      this.adjustRequestForDecoding(request);

      await this.interceptResponse(sessionId, commandName, request, response);
    }

    next();
  }

  shouldInterceptRequest(sessionId: string): boolean {
    const session = SESSION_MANAGER.getSession(sessionId);
    return !!sessionId && this.isHub && !!session && session.getType() !== SessionType.CLOUD;
  }

  adjustRequestForDecoding(request: Request) {
    // Hack to decode gzip responses in Lambdatest
    request.headers['accept-encoding'] = 'deflate';
  }

  extractCommandName(request: Request): string | undefined {
    return routeToCommandName(request.path, request.method as any, this.serverArgs.basePath);
  }

  async preSessionCommandHook(
    sessionId: string,
    commandName: string | undefined,
    request: Request,
    response: Response,
  ) {
    return await DASHBOARD_EVENT_MANAGER.beforeSessionCommand(
      sessionId,
      commandName,
      request,
      response,
    );
  }

  async interceptResponse(
    sessionId: string,
    commandName: string | undefined,
    req: Request,
    res: Response,
  ) {
    const originalWrite = res.write;
    const originalEnd = res.end;
    const chunks: Uint8Array[] = [];

    log.info(`Registered response interceptor for url ${req.originalUrl}`);

    (res.write as unknown) = function (...args: any) {
      const chunk = typeof args[0] === 'string' ? Buffer.from(args[0]) : args[0];
      chunks.push(chunk);
      originalWrite.apply(res, args);
    };

    (res.end as unknown) = async function (...args: any) {
      if (args[0]) {
        const chunk = typeof args[0] === 'string' ? Buffer.from(args[0]) : args[0];
        chunks.push(chunk);
      }

      try {
        const body = Buffer.concat(chunks).toString('utf8');

        log.info(`Intercepted response for session ${sessionId} with method ${commandName}`);
        if (commandName === 'deleteSession') {
          await DASHBOARD_EVENT_MANAGER.onSessionStopped(sessionId);
        } else {
          await DASHBOARD_EVENT_MANAGER.afterSessionCommand(sessionId, commandName, req, res, body);
        }
      } catch (err) {
        log.error(
          `Error executing session event ${commandName} for sessionId ${sessionId} after intercepting`,
        );
        log.error(err);
      }

      originalEnd.apply(res, args);
    };
  }

  async handleNewSessionEvent(session: IDeviceFarmSessionOptions) {
    const createDashboardEvents = async () => {
      const { device, pluginNodeId } = session;
      const basePath = this.serverArgs.basePath;
      const nodeWebdriverUrl = nodeUrl(device, basePath);
      let sessionInstance: DeviceFarmSession;

      if (device.nodeId === pluginNodeId) {
        sessionInstance = new LocalSession(session);
      } else if (!_.isNil(device.cloud)) {
        sessionInstance = new CloudSession({
          ...session,
          baseUrl: nodeWebdriverUrl,
        });
      } else {
        sessionInstance = new RemoteSession({
          ...session,
          baseUrl: nodeWebdriverUrl,
        });
      }
      const isDashboardAvailable = this.isHub && sessionInstance.getType() !== SessionType.CLOUD;
      SESSION_MANAGER.addSession(sessionInstance.getId(), sessionInstance);
      if (isDashboardAvailable) {
        log.debug(
          `Adding the session ${sessionInstance.getId()} with type ${sessionInstance.getType()} to session map`,
        );
        await DASHBOARD_EVENT_MANAGER.onSessionStarted(
          session.deviceFarmCapabilities,
          sessionInstance,
          device,
        );
      } else {
        log.debug(
          `Not adding the session ${sessionInstance.getId()} with type ${sessionInstance.getType()} to session map`,
        );
      }
    };
    await createDashboardEvents.call(this);
  }
}
