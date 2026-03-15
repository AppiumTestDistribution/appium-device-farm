import { DeviceFarmSession } from './DeviceFarmSession';

export class SessionManager {
  private sessionMap = new Map<string, DeviceFarmSession>();

  addSession(sessionId: string, session: DeviceFarmSession) {
    this.sessionMap.set(sessionId, session);
  }

  isValidSession(sessionId: string) {
    return this.sessionMap.has(sessionId);
  }

  getSession(sessionId: string) {
    return this.sessionMap.get(sessionId);
  }

  removeSession(sessionId: string) {
    return this.sessionMap.delete(sessionId);
  }
}

export const SESSION_MANAGER = new SessionManager();
