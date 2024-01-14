import apiClient from './api-client';

export default class DeviceFarmApiService {
  public static getDevices() {
    return apiClient.makeGETRequest('/device', {});
  }

  public static getPendingSessionsCount() {
    return apiClient.makeGETRequest('/queue/length', {});
  }

  public static getPendingSessions() {
    return apiClient.makeGETRequest('/queue', {});
  }

  public static blockDevice(udid: string, host: string) {
    return apiClient.makePOSTRequest('/block', {}, { udid, host });
  }

  public static unblockDevice(udid: string, host: string) {
    return apiClient.makePOSTRequest('/unblock', {}, { udid, host });
  }

  public static getAllBuilds() {
    return apiClient.makeGETRequest('/build', {});
  }

  public static getSessions() {
    return apiClient.makeGETRequest('/session', {});
  }

  public static getSessionLogs(sessionId: string) {
    return apiClient.makeGETRequest(`/session/${sessionId}/session_log`, {});
  }
}
