import axios from 'axios';
import { IDeviceFarmSessionOptions } from '../../interfaces/IDeviceFarmSession';
import { DeviceFarmSession } from './DeviceFarmSession';
import SessionType from '../../enums/SessionType';
import log from '../../logger';

export type RemoteSessionOptions = IDeviceFarmSessionOptions & {
  baseUrl: any;
};

export class RemoteSession extends DeviceFarmSession {
  private isVideoAvailable = false;
  private baseUrl: string;
  protected saveDeviceLog = false;
  protected hasAppProfiling = false;

  constructor(options: RemoteSessionOptions) {
    super(options);
    this.baseUrl = options.baseUrl;
  }

  isVideoRecordingInProgress(): boolean {
    return this.isVideoAvailable;
  }

  getType(): SessionType {
    return SessionType.REMOTE;
  }

  getScreenShot(): Promise<string> {
    return axios({
      method: 'get',
      url: `${this.baseUrl}/session/${this.sessionId}/screenshot`,
    })
      .then((response) => (response.data ? response?.data?.value : ''))
      .catch((error) => {
        log.error(
          `Error getting screenshot for session ${this.sessionId} on node ${this.baseUrl}. Error: ${error}`,
        );
        return '';
      });
  }

  async stopVideoRecording() {
    if (this.isVideoAvailable) {
      return axios({
        method: 'post',
        url: `${this.baseUrl}/session/${this.sessionId}/appium/stop_recording_screen`,
        data: {},
      })
        .then((response) => (response.status === 200 ? response?.data?.value : ''))
        .catch((error) => {
          log.error(
            `Error stopping video recording for session ${this.sessionId} on node ${this.baseUrl}. Error: ${error}`,
          );
          return '';
        });
    }
    return '';
  }

  async startVideoRecording(options?: { resolution?: string; timeLimit?: number }) {
    let resolution = '1280:720';
    let size = '1280x720';
    if (options?.resolution) {
      resolution = options.resolution.replace('x', ':');
      size = options.resolution.replace(':', 'x');
    }
    return axios({
      method: 'post',
      url: `${this.baseUrl}/session/${this.sessionId}/appium/start_recording_screen`,
      data: {
        options: {
          videoType: 'libx264',
          videoFps: 10,
          videoScale: resolution,
          videoSize: size,
          timeLimit: options?.timeLimit || 1800,
        },
      },
    })
      .then((response) => {
        this.isVideoAvailable = response.status === 200;
      })
      .catch((error) => {
        log.error(
          `Error starting video recording for session ${this.sessionId} on node ${this.baseUrl}. Error: ${error}`,
        );
      });
  }

  getLiveVideoUrl(): string | null {
    const url = new URL(this.baseUrl);
    const capabilities = this.getCapabilities();
    if (capabilities['mjpegServerPort'] && !isNaN(capabilities['mjpegServerPort'])) {
      return `${url.origin}/device-farm/api/session/${this.sessionId}/liveVideo`;
    } else {
      return null;
    }
  }

  async startDeviceLog() {
    this.saveDeviceLog = true;
  }

  async getDeviceLogs() {
    if (this.saveDeviceLog) {
      const url = new URL(this.baseUrl);
      return axios({
        method: 'get',
        url: `${url.origin}/device-farm/api/dashboard/session/${this.sessionId}/device_logs`,
      })
        .then((response) => response.data.logs)
        .catch((err) => {
          log.error(
            `Unable to save device log for session ${this.sessionId} on node ${this.baseUrl}`,
          );
          log.error(err);
          return null;
        });
    }
    return null;
  }

  async startAppProfiling(): Promise<boolean> {
    const url = new URL(this.baseUrl);
    this.hasAppProfiling = await axios({
      method: 'get',
      url: `${url.origin}/device-farm/api/dashboard/session/${this.sessionId}/start_app_profiling`,
    })
      .then((response) => true)
      .catch((error) => {
        log.error(
          `Unable to start app profiling for session ${this.sessionId} on node ${this.baseUrl}. Error: ${error}`,
        );
        return false;
      });
    return this.hasAppProfiling;
  }

  async stopAppProfiling(): Promise<any> {
    const url = new URL(this.baseUrl);
    if (this.hasAppProfiling) {
      return axios({
        method: 'get',
        url: `${url.origin}/device-farm/api/dashboard/session/${this.sessionId}/app_profiling`,
      })
        .then((response) => response.data)
        .catch((err) => {
          log.error(
            `Unable to save app profiling for session ${this.sessionId} on node ${this.baseUrl}`,
          );
          log.error(err);
          return [];
        });
    }
    return null;
  }
}
