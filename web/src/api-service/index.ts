import apiClient from './api-client';

export default class DeviceFarmApiService {
  public static getDevices() {
    return apiClient.makeGETRequest('/devices', {});
  }

  public static getPendingSessionsCount() {
    return apiClient.makeGETRequest('/queues/length', {});
  }

  public static getPendingSessions() {
    return apiClient.makeGETRequest('/queues', {});
  }

  public static blockDevice(udid: string, host: string) {
    return apiClient.makePOSTRequest('/block', {}, { udid, host });
  }

  public static unblockDevice(udid: string, host: string) {
    return apiClient.makePOSTRequest('/unblock', {}, { udid, host });
  }

  public static getSessions(filter?: { buildId?: string }) {
    return apiClient.makeGETRequest('/session', filter);
  }

  public static getBuilds() {
    return apiClient.makeGETRequest('/build', {});
  }

  public static getLiveVideoUrl(sessionId: string) {
    return apiClient.formatUrl(`/session/${sessionId}/live_video`);
  }

  public static getAssetUrl(assetPath: string) {
    return `http://localhost:31337/device-farm/assets/${assetPath}`;
  }
}
