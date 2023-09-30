import { ISession } from '../interfaces/ISession';
class SessionManager {
  private sessionMap: Map<string, ISession> = new Map();

  addSession(sessionId: string, session: ISession) {
    this.sessionMap.set(sessionId, session);
  }

  isValidSession(sessionId: string) {
    return this.sessionMap.has(sessionId);
  }

  getSession(sessionId: string) {
    return this.sessionMap.get(sessionId);
  }
}

export const SESSION_MANAGER = new SessionManager();
