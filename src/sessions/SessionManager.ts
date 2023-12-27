import { DeviceFarmSession } from './DeviceFarmSession';

export class SessionManager {
  private sessionMap: Map<string, DeviceFarmSession> = new Map();

  addSession(sessionId: string, session: DeviceFarmSession) {
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
