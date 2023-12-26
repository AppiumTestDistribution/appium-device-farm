import { Request, Response } from 'express';
import { SESSION_MANAGER } from '../sessions/SessionManager';
import { ISession } from '../interfaces/ISession';
import { IDevice } from '../interfaces/IDevice';
import { prisma } from '../prisma';
import logger from '../logger';
import { getOrCreateNewBuild } from './services/session-service';
import { DEVICE_FARM_CAPABILITIES } from '../CapabilityManager';
import _ from 'lodash';
import { safeParseJson } from '../helpers';
import { prepareDirectory, saveScreenShot, saveVideoRecording } from './asset-manager';
export class DashboardEventManager {
  private SCREENSHOT_FOR_COMMANDS = ['click', 'setUrl', 'setValue', 'performActions'];

  async onSessionStarted(capabilities: Record<string, any>, session: ISession, device: IDevice) {
    const createOptions = {
      id: session.getId(),
    } as Record<string, any>;

    // create directory to store screenshots, videos and log files for the session
    prepareDirectory(session.getId());

    // start video recording
    if (capabilities[DEVICE_FARM_CAPABILITIES.VIDEO_RECORDING]) {
      const resolution = capabilities[DEVICE_FARM_CAPABILITIES.VIDEO_RESOLUTION] || undefined;
      await session.startVideoRecording({
        resolution,
      });
    }

    //create build if not exists
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
    const session: ISession | undefined = SESSION_MANAGER.getSession(sessionId);
    if (session) {
      await prisma.session.update({
        where: {
          id: sessionId,
        },
        data: {
          endTime: new Date(),
        },
      });
    }
  }

  async beforeSessionCommand(
    sessionId: string,
    commandName: string | undefined,
    request: Request,
    response: Response
  ): Promise<boolean> {
    const session: ISession | undefined = SESSION_MANAGER.getSession(sessionId);

    if (!session) {
      return false;
    }

    if (commandName == 'deleteSession') {
      if (session.isVideoRecordingInProgress()) {
        const videoBase64 = await session.stopVideoRecording();
        if (videoBase64) {
          const videoPath = saveVideoRecording(session.getId(), videoBase64);
        }
      }
    }

    // if (session) {
    //   if (commandName === 'execute') {
    //     //do the parsing
    //     response.status(200).json({ value: null });
    //     return false;
    //   }
    // }

    return !!session;
  }

  async afterSessionCommand(
    sessionId: string,
    commandName: string | undefined,
    request: Request,
    response: Response,
    responseBody: string
  ) {
    //TODO
    const session: ISession | undefined = SESSION_MANAGER.getSession(sessionId);
    if (session) {
      const parsedBody: any = safeParseJson(responseBody) as any;
      const isSuccessResponse =
        _.isObjectLike(parsedBody) &&
        (parsedBody.value === null || (parsedBody.value && !parsedBody.value.error));
      //console.log(new Date(), ` ↪ [${response.statusCode}]: ${responseBody}`);
      let screenShotPath;
      if (!isSuccessResponse || this.SCREENSHOT_FOR_COMMANDS.indexOf(commandName || '') >= 0) {
        const screenshot = await session.getScreenShot();
        if (screenshot) {
          screenShotPath = saveScreenShot(session.getId(), screenshot);
        }
      }
    }
  }
}

export const DASHBORD_EVENT_MANAGER = new DashboardEventManager();
