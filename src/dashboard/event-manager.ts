import { Request, Response } from 'express';
import { SESSION_MANAGER } from '../sessions/SessionManager';
import { ISession } from '../interfaces/ISession';

export class DashboardEventManager {
  onSessionStarted() {
    //TODO
  }

  onSessionStoped() {
    //TODO
  }

  async onSessionCommand(
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
