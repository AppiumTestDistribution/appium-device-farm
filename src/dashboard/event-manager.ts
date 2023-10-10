import { Request, Response } from 'express';
import { SESSION_MANAGER } from '../sessions/SessionManager';
import { ISession } from '../interfaces/ISession';
import { IDevice } from '../interfaces/IDevice';
import { prisma } from '../prisma';
import logger from '../logger';
import { getOrCreateNewBuild } from './services/session-service';
import { DEVICE_FARM_CAPABILITIES } from '../CapabilityManager';
import _ from 'lodash';

export class DashboardEventManager {
  async onSessionStarted(capabilities: Record<string, any>, session: ISession, device: IDevice) {
    //create build if not exists
    const createOptions = {
      id: session.getId(),
    } as Record<string, any>;
    if (capabilities[DEVICE_FARM_CAPABILITIES.BUILD_NAME]) {
      const build = await getOrCreateNewBuild(capabilities[DEVICE_FARM_CAPABILITIES.BUILD_NAME]);
      createOptions['build_id'] = build.id;
    }

    createOptions['title'] = capabilities[DEVICE_FARM_CAPABILITIES.SESSION_NAME] || undefined;
    const sessionResponse = _.assign({}, session.getCapabilities());
    createOptions['desired_capabilities'] = JSON.stringify(sessionResponse.desired || {});
    createOptions['session_capabilities'] = JSON.stringify(_.omit(sessionResponse, 'desired'));
    createOptions['node_id'] = device.nodeId;
    createOptions['has_live_video'] = false; // TODO
    createOptions['has_session_video'] = false; // TODO

    //device properties
    createOptions['device_udid'] = device.udid;
    createOptions['device_platform'] = device.platform;
    createOptions['device_version'] = device.sdk;
    createOptions['device_name'] = device.name;

    await prisma.session.create({
      data: createOptions as any,
    });
  }

  async onSessionStoped(sessionId: string) {
    //TODO
  }

  async beforeSessionCommand(
    sessionId: string,
    request: Request,
    response: Response
  ): Promise<boolean> {
    //TODO
    const session: ISession | undefined = SESSION_MANAGER.getSession(sessionId);

    return !!session;
  }

  async afterSessionCommand(
    sessionId: string,
    request: Request,
    response: Response,
    responseBody: string
  ) {
    //TODO
    const session: ISession | undefined = SESSION_MANAGER.getSession(sessionId);
    if (session) {
      console.log(new Date(), ` ↪ [${response.statusCode}]: ${responseBody}`);
      //const screenshot = await session.getScreenShot();
      //console.log(screenshot);
    }
  }
}

export const DASHBORD_EVENT_MANAGER = new DashboardEventManager();
