import apiClient from './api-client';

export default class DeviceFarmApiService {
  public static getDevices() {
    return apiClient.makeGETRequest('/devices', {});
  }

  public static getPendingSessionsCount() {
    return apiClient.makeGETRequest('/queue', {});
  }

  public static blockDevice(
    sdk: string,
    platform: string,
    udid: string,
    busy: boolean,
    offline: boolean,
  ) {
    return apiClient.makePOSTRequest('/block', {}, { platform, udid, minSDK: sdk, busy, offline });
  }

  public static unblockDevice(
    sdk: string,
    platform: string,
    udid: string,
    busy: boolean,
    offline: boolean,
  ) {
    return apiClient.makePOSTRequest(
      '/unblock',
      {},
      { platform, udid, minSDK: sdk, busy, offline },
    );
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
