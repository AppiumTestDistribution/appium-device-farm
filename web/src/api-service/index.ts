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
}
