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
}
