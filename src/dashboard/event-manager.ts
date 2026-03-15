import { SessionLog } from '@prisma/client';
import { DEVICE_FARM_CAPABILITIES } from '../CapabilityManager';
import { safeParseJson } from '../helpers';
import { IDevice } from '../interfaces/IDevice';
import log from '../logger';
import { prisma } from '../prisma';
import { SessionStatus } from '../types/SessionStatus';
import {
  prepareDirectory,
  saveDeviceLogs,
  saveProflingLog,
  saveScreenShot,
  saveVideoRecording,
} from './asset-manager';
import { dashboardCommands } from './commands';
import {
  getOrCreateNewBuild,
  getSessionById,
  updateSessionDetails,
} from './services/session-service';
import { DeviceFarmSession } from './sessions/DeviceFarmSession';
import { SESSION_MANAGER } from './sessions/SessionManager';
import { Request, Response } from 'express';
import _ from 'lodash';
import { getEventId } from '../wdio-service/wdio-service';
import SessionType from '../enums/SessionType';
import { sanitizeSessionCapabilities } from '../utils/auth';

export class DashboardEventManager {
  async onSessionStarted(
    capabilities: Record<string, any>,
    session: DeviceFarmSession,
    device: IDevice,
  ) {
    const createOptions: Record<string, any> = {
      id: session.getId(),
      buildId: (await getOrCreateNewBuild(capabilities)).id,
      title: capabilities[DEVICE_FARM_CAPABILITIES.SESSION_NAME] || undefined,
      desiredCapabilities: this.prepareCapabilities(session, 'desired', capabilities),
      sessionCapabilities: this.prepareCapabilities(session),
      nodeId: device.nodeId,
      hasLiveVideo: session.getLiveVideoUrl() !== null,
      deviceUdid: device.udid,
      devicePlatform: device.platform,
      deviceVersion: device.sdk,
      deviceName: device.name,
    };

    prepareDirectory(session.getId());

    if (capabilities[DEVICE_FARM_CAPABILITIES.VIDEO_RECORDING]) {
      await session.startVideoRecording({
        resolution: capabilities[DEVICE_FARM_CAPABILITIES.VIDEO_RESOLUTION],
        timeLimit: capabilities[DEVICE_FARM_CAPABILITIES.VIDEO_TIME_LIMIT],
      });
    }

    if (capabilities[DEVICE_FARM_CAPABILITIES.SAVE_DEVICE_LOGS]) {
      await session.startDeviceLog();
    }

    await session.startAppProfiling();
    await prisma.session.create({ data: createOptions as any });
  }

  async onSessionStopped(sessionId: string) {
    const session = SESSION_MANAGER.getSession(sessionId);
    if (!session) return;

    const sessionEntry = await getSessionById(sessionId);
    await this.finalizeSession(session, sessionId, {
      status:
        sessionEntry?.status === SessionStatus.RUNNING
          ? SessionStatus.UNMARKED
          : sessionEntry?.status,
      endTime: new Date(),
      hasLiveVideo: false,
    });
    SESSION_MANAGER.removeSession(sessionId);
  }

  async beforeSessionCommand(
    sessionId: string,
    commandName: string | undefined,
    request: Request,
    response: Response,
  ): Promise<boolean> {
    const session = SESSION_MANAGER.getSession(sessionId);

    if (
      !session &&
      commandName === 'execute' &&
      dashboardCommands.isDashboardCommand(request.body.script)
    ) {
      dashboardCommands.sendSuccessResponse(response);
      return false;
    }

    if (session && commandName === 'deleteSession' && session.getType() !== SessionType.CLOUD) {
      const dataToUpdate: any = {};

      //save video
      const videoBase64 = await session.stopVideoRecording();
      if (videoBase64) {
        const videoPath = saveVideoRecording(session.getId(), videoBase64);
        dataToUpdate['videoRecording'] = videoPath;
      }

      //save deviceLog
      const logs = await session.getDeviceLogs();
      if (logs && _.isArray(logs)) {
        const logPath = saveDeviceLogs(session.getId(), logs);
        dataToUpdate['deviceLogs'] = logPath;
      }

      const profiling = await session.stopAppProfiling();
      if (profiling) {
        const logPath = saveProflingLog(session.getId(), profiling);
        dataToUpdate['appProfiling'] = logPath;
      }
      await updateSessionDetails(sessionId, dataToUpdate);
    }
    if (
      session &&
      commandName === 'execute' &&
      dashboardCommands.isDashboardCommand(request.body.script)
    ) {
      log.info(`Received execute command with script ${request.body.script}`);
      await dashboardCommands.process(sessionId, request, response);
      return false;
    }

    return true;
  }

  async afterSessionCommand(
    sessionId: string,
    commandName: string | undefined,
    request: Request,
    response: Response,
    responseBody: string,
  ) {
    const session = SESSION_MANAGER.getSession(sessionId);
    if (!session) return;

    const isSuccessResponse = this.isSuccessfulResponse(safeParseJson(responseBody));
    const logEntry = this.createLogEntry(
      session,
      commandName,
      request,
      responseBody,
      isSuccessResponse,
    );
    const eventId = await getEventId(sessionId);
    log.info(`Saving log entry for session ${sessionId} with eventId ${eventId}`);
    await this.saveLogEntry(session, logEntry, isSuccessResponse, eventId);
  }

  private async finalizeSession(
    session: DeviceFarmSession,
    sessionId: string,
    updateData: Record<string, any>,
  ) {
    await updateSessionDetails(sessionId, updateData);
  }

  private createLogEntry(
    session: DeviceFarmSession,
    commandName: string | undefined,
    request: Request,
    responseBody: string,
    isSuccessResponse: boolean,
  ): Partial<SessionLog> {
    return {
      sessionId: session.getId(),
      commandName: commandName || null,
      body: JSON.stringify(request.body),
      response: responseBody,
      isSuccess: isSuccessResponse,
      method: request.method,
      title: this.getTitleFromCommandName(commandName),
      subtitle: '',
      screenshot: null,
      url: request.originalUrl,
    };
  }

  private async saveLogEntry(
    session: DeviceFarmSession,
    logEntry: Partial<SessionLog>,
    isSuccessResponse: boolean,
    eventId: any,
  ) {
    try {
      const screenshotOnFailure = session.getDeviceFarmOption(
        DEVICE_FARM_CAPABILITIES.SCREENSHOT_ON_FAILURE,
        false,
      );
      const screenshotOnAll = session.getDeviceFarmOption(
        DEVICE_FARM_CAPABILITIES.SCREENSHOT_ON_ALL,
        false,
      );

      const shouldTakeScreenshot = screenshotOnAll || (!isSuccessResponse && screenshotOnFailure);

      if (shouldTakeScreenshot) {
        log.info(
          `Capability ${DEVICE_FARM_CAPABILITIES.SCREENSHOT_ON_FAILURE} is true, so getting screenshot for session ${session.getId()}`,
        );
        const screenshot = await session.getScreenShot();
        log.info(`Got screenshot for session ${session.getId()}`);
        if (screenshot) {
          logEntry['screenshot'] = saveScreenShot(session.getId(), screenshot);
        }
      }
      logEntry['eventId'] = eventId;

      await prisma.sessionLog.create({ data: logEntry as SessionLog });
      log.error(
        `Successfully saved log entry for ${session.getId()}, commandName: ${logEntry.commandName}`,
      );
    } catch (err) {
      log.error(`Unable to save log entry for session ${session.getId()}`);
    }
  }

  private isSuccessfulResponse(parsedResponse: any): boolean {
    return parsedResponse && !!parsedResponse.error ? false : true;
  }

  private prepareCapabilities(
    session: DeviceFarmSession,
    type: 'desired' | null = null,
    caps: any = {},
  ): string {
    const sessionResponse = _.assign({}, session.getCapabilities());
    const capabilities = type ? sessionResponse[type] : _.omit(sessionResponse, 'desired');
    return JSON.stringify(sanitizeSessionCapabilities(capabilities || caps));
  }

  private getTitleFromCommandName(commandName: string | undefined): string | undefined {
    return commandName
      ? commandName
          .replace(/([A-Z])/g, ' $1')
          .trim()
          .replace(/^./, (str) => str.toUpperCase())
      : 'Unknown command';
  }
}

export const DASHBOARD_EVENT_MANAGER = new DashboardEventManager();
