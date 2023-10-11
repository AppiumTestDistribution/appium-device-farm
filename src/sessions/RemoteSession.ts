import axios from 'axios';
import SessionType from '../enums/SessionType';
import { ISession } from '../interfaces/ISession';
import { IDevice } from '../interfaces/IDevice';

export class RemoteSession implements ISession {
  private isVideoAvailable = false;

  constructor(
    protected sessionId: string,
    protected baseUrl: string,
    private device: IDevice,
    protected sessionResponse: Record<string, any>
  ) {}

  isVideoRecordingInProgress(): boolean {
    return this.isVideoAvailable;
  }

  getCapabilities(): Record<string, any> {
    return this.sessionResponse;
  }

  getType(): SessionType {
    return SessionType.CLOUD;
  }

  getId(): string {
    return this.sessionId;
  }

  getScreenShot(): Promise<string> {
    return axios({
      method: 'get',
      url: `${this.baseUrl}/session/${this.sessionId}/screenshot`,
    }).then((response) => (response.data ? response.data.value : ''));
  }

  async stopVideoRecording() {
    if (this.isVideoAvailable) {
      return axios({
        method: 'post',
        url: `${this.baseUrl}/session/${this.sessionId}/appium/stop_recording_screen`,
        data: {},
      }).then((response) => (response.status === 200 ? response?.data?.value : ''));
    }
    return '';
  }

  startVideoRecording(options?: { resolution?: string }) {
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
          /* Force iOS video scale to fix '[ffmpeg] [libx264 @ 0x7fda5f005280] width not divisible by 2 (1125x2436)' */
          videoScale: resolution,
          /* Force Android size because some devices cannot record at their native resolution, resulting in error 'Unable to get output buffers (err=-38)' */
          videoSize: size,
          /* In android, adb can record only 3 mins of video. below timeLimit is used to take longer video */
          timeLimit: 1800, //in seconds (30 min)
        },
      },
    }).then((response) => {
      this.isVideoAvailable = response.status === 200;
    });
  }

  getLiveVideoUrl(): string | null {
    const url = new URL(this.baseUrl);
    if (
      this.sessionResponse['mjpegServerPort'] &&
      !isNaN(this.sessionResponse['mjpegServerPort'])
    ) {
      return `${url.origin}/device-farm/api/session/${this.sessionId}/live_video`;
    } else {
      return null;
    }
  }
}
