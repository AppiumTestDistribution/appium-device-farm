import apiClient from './api-client';

export default class DeviceFarmApiService {
  public static getDevices() {
    return apiClient.makeGETRequest('/devices', {});
  }

  public static getPendingSessionsCount() {
    return apiClient.makeGETRequest('/queue', {});
  }
}
