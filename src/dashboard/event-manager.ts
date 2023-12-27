import { Request, Response } from 'express';
import { SESSION_MANAGER } from '../sessions/SessionManager';
import { IDevice } from '../interfaces/IDevice';
import { prisma } from '../prisma';
import log from '../logger';
import {
  getOrCreateNewBuild,
  getSessionById,
  updateSessionDetails,
} from './services/session-service';
import { DEVICE_FARM_CAPABILITIES } from '../CapabilityManager';
import _ from 'lodash';
import { safeParseJson } from '../helpers';
import { prepareDirectory, saveScreenShot, saveVideoRecording } from './asset-manager';
import { dashboardCommands } from './commands';
import { SessionStatus } from '../types/SessionStatus';
import { SessionLog } from '@prisma/client';
import { DeviceFarmSession } from '../sessions/DeviceFarmSession';

export class DashboardEventManager {
  // private SCREENSHOT_FOR_COMMANDS = ['click', 'setUrl', 'setValue', 'performActions'];

  async onSessionStarted(
    capabilities: Record<string, any>,
    session: DeviceFarmSession,
    device: IDevice,
  ) {
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
    createOptions['has_live_video'] = session.getLiveVideoUrl() !== null;

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
    const session: DeviceFarmSession | undefined = SESSION_MANAGER.getSession(sessionId);
    if (session) {
      const sessionEntry = await getSessionById(sessionId);
      const updateData: any = {
        endTime: new Date(),
        has_live_video: false,
      };
      if (sessionEntry?.status == SessionStatus.RUNNING) {
        updateData['status'] = SessionStatus.UNMARKED;
      }
      await updateSessionDetails(sessionId, updateData);
    }
  }

  async beforeSessionCommand(
    sessionId: string,
    commandName: string | undefined,
    request: Request,
    response: Response,
  ): Promise<boolean> {
    const session: DeviceFarmSession | undefined = SESSION_MANAGER.getSession(sessionId);

    if (!session) {
      return false;
    }

    switch (commandName) {
      case 'deleteSession':
        if (session.isVideoRecordingInProgress()) {
          const videoBase64 = await session.stopVideoRecording();
          if (videoBase64) {
            const videoPath = saveVideoRecording(session.getId(), videoBase64);
            await updateSessionDetails(sessionId, { video_recording: videoPath });
          }
        }
        break;
      case 'execute':
        if (request.body && dashboardCommands.isDashboardCommand(request.body.script)) {
          log.info('Recieved execute command with script ' + request.body.script);
          await dashboardCommands.process(sessionId, request, response);
          return false;
        }
        break;
    }

    return !!session;
  }

  async afterSessionCommand(
    sessionId: string,
    commandName: string | undefined,
    request: Request,
    response: Response,
    responseBody: string,
  ) {
    const session: DeviceFarmSession | undefined = SESSION_MANAGER.getSession(sessionId);
    if (session) {
      const parsedResponse: any = safeParseJson(responseBody) as any;
      const isSuccessResponse =
        _.isObjectLike(parsedResponse) &&
        (parsedResponse.value === null || (parsedResponse.value && !parsedResponse.value.error));

      const logEntry: Partial<SessionLog> = {
        session_id: session.getId(),
        command_name: commandName || null,
        body: JSON.stringify(request.body),
        response: responseBody,
        is_success: isSuccessResponse,
        method: request.method,
        title: this.getTitleFromCommandName(commandName),
        subtitle: '',
        screenshot: null,
        url: request.originalUrl,
      };

      const screenShotCapability = session.getDeviceFarmOption(
        DEVICE_FARM_CAPABILITIES.SCREENSHOT_ON_FAILURE,
        false,
      );
      const shouldTakeScreenshot =
        !_.isNil(screenShotCapability) && screenShotCapability.toString() === 'true';

      if (
        shouldTakeScreenshot &&
        !isSuccessResponse
        // && this.SCREENSHOT_FOR_COMMANDS.indexOf(commandName || '') >= 0
      ) {
        const screenshot = await session.getScreenShot();
        if (screenshot) {
          logEntry['screenshot'] = saveScreenShot(session.getId(), screenshot);
        }
      }

      await prisma.sessionLog.create({
        data: logEntry as SessionLog,
      });
    }
  }

  private getTitleFromCommandName(commandName: string | undefined) {
    if (commandName) {
      return commandName.replace(/([A-Z])/g, ' $1').replace(/^./, function (str: string) {
        return str.toUpperCase();
      });
    }
    return undefined;
  }
}

export const DASHBORD_EVENT_MANAGER = new DashboardEventManager();
