import { ISession } from '../interfaces/ISession';

export class SessionManager {
  private sessionMap: Map<string, ISession> = new Map();

  addSession(sessionId: string, session: ISession) {
    this.sessionMap.set(sessionId, session);
  }

  getSession(sessionId: string, session: ISession) {
    this.sessionMap.get(sessionId);
  }
}
