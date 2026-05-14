import apiClient from './api-client';

export default class DeviceFarmApiService {
  public static getDevices(filter?: { sessionId?: string }) {
    return apiClient.makeGETRequest('/device', filter || {});
  }

  public static getUploadedAppsList() {
    return apiClient.makeGETRequest('/dashboard/uploadedApps', {});
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

  public static cleanupBuilds(retentionDays: number) {
    return apiClient.makePOSTRequest('/dashboard/cleanup', {}, { retentionDays });
  }

  public static getSessionLogs(sessionId: string) {
    return apiClient.makeGETRequest(`/dashboard/session/${sessionId}/session_log`, {});
  }

  public static async getDeviceLogs(sessionId: string) {
    const response = await apiClient.makeGETRequest(
      `/dashboard/session/${sessionId}/device_logs`,
      {},
    );
    return response?.logs || [];
  }

  public static async getAppProfiling(sessionId: string) {
    return apiClient.makeGETRequest(`/dashboard/session/${sessionId}/app_profiling`, {});
  }

  public static async appInformation(file: any, bundleId: string) {
    return apiClient.makePOSTRequest('/dashboard/uploadedAppInformation', {}, { file, bundleId });
  }

  public static async deleteUploadedApp(file: any) {
    return apiClient.makePOSTRequest('/dashboard/deleteUploadedApp', {}, { id: file });
  }

  public static async updateDeviceTag(host: string, udid: string, tags: string[]) {
    return apiClient.makePOSTRequest('/dashboard/device-tag', {}, { host, udid, tags });
  }

  public static async updateDeviceName(host: string, udid: string, name: string) {
    return apiClient.makePOSTRequest('/dashboard/device-name', {}, { host, udid, name });
  }

  public static async getServers() {
    return apiClient.makeGETRequest('/dashboard/servers', {});
  }

  public static async getAppiumLogForServer(nodeId: string) {
    return apiClient.makeStreamRequest(`/dashboard/server/${nodeId}/appium_logs`);
  }

  public static async getIosSysLogs(
    sessionId: string,
    abortController: AbortController,
    params?: { predicate: string },
  ) {
    return apiClient.makeStreamRequest(
      `/dashboard/ios/${sessionId}/device_logs`,
      abortController,
      params,
    );
  }

  public static getBaseUrl() {
    return apiClient.formatUrl('').toString();
  }
}
