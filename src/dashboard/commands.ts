import { Request, Response } from 'express';
import { updateSessionDetails } from './services/session-service';
import _ from 'lodash';

export class DashboardCommands {
  public isDashboardCommand(commandName: string) {
    return commandName.startsWith('devicefarm');
  }

  public async process(sessionId: string, request: Request, response: Response) {
    const { script } = request.body;
    if (!script) {
      return this.sendSuccessResponse(response);
    }
    const commandName = script.split(':')[1];
    if (commandName && commandName.trim()) {
      switch (commandName.trim()) {
        case 'setSessionName':
          return await this.setSessionName(sessionId, request, response);
        case 'setSessionStatus':
          return await this.setSessionStatus(sessionId, request, response);
      }
    }
  }

  private sendSuccessResponse(response: Response) {
    return response.status(200).json({ value: null });
  }

  /* Commands */

  /*
   * Set the name of current test(session)
   *
   * driver.executeScript("devicefarm: setSessionName", "MyTestName")
   * or
   * driver.executeScript("devicefarm: setSessionName", {"name": "MyTestName"})
   */
  private async setSessionName(sessionId: string, request: Request, response: Response) {
    const { args } = request.body;
    await updateSessionDetails(sessionId, {
      name: typeof args[0] === 'object' && args[0].name ? args[0].name : args[0],
    });
    return this.sendSuccessResponse(response);
  }

  /*
   * Update the status of the session
   *
   * driver.executeScript("devicefarm: setSessionStatus", {"status": "passed/failed", "reasonn": "optional reason"})
   */

  private async setSessionStatus(sessionId: string, request: Request, response: Response) {
    let { args } = request.body;
    if (_.isArray(args)) {
      args = args[0];
    }
    if (args.status && ['success', 'failed'].indexOf(args.status) < 0) {
      return this.sendSuccessResponse(response);
    }
    await updateSessionDetails(sessionId, {
      status: args.status,
      failure_reason: args.reason || undefined,
    });
    return this.sendSuccessResponse(response);
  }
}

export const dashboardCommands = new DashboardCommands();
