import apiClient from './api-client';

export default class DeviceFarmApiService {
  public static getDevices() {
    return apiClient.makeGETRequest('/device', {});
  }

  public static androidStreamingAppInstalled(udid: string, systemPort: number) {
    return apiClient.makePOSTRequest('/installAndroidStreamingApp', {}, {udid, systemPort});
  }

  public static createSession(udid: string, systemPort: number) {
    return apiClient.makePOSTRequest('/appiumSession', {}, {udid, systemPort, origin: window.location.origin});
  }
  public static installWDAOnDevice(udid: string) {
    return apiClient.makePOSTRequest('/installiOSWDA', {}, { udid });
  }

  public static installApk(udid: string, apkPath: string) {
    return apiClient.makePOSTRequest('/installApk', {}, { udid, apkPath });
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

  public static getBuilds() {
    return apiClient.makeGETRequest('/dashboard/build', {});
  }

  public static getSessions() {
    return apiClient.makeGETRequest('/dashboard/session', {});
  }

  public static getSessionLogs(sessionId: string) {
    return apiClient.makeGETRequest(`/dashboard/session/${sessionId}/session_log`, {});
  }
}
