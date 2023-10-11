import SessionType from '../enums/SessionType';

export interface ISession {
  getId(): string;
  getCapabilities(): Record<string, any>;
  getScreenShot(): Promise<string>;
  stopVideoRecording(): Promise<string | null>;
  startVideoRecording(options?: { resolution: string }): Promise<void>;
  isVideoRecordingInProgress(): boolean;
  getType(): SessionType;
  getLiveVideoUrl(): string | null;
}
