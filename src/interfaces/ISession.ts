import SessionType from '../enums/SessionType';

export interface ISession {
  getId(): string;
  getCapabilities(): Record<string, any>;
  getScreenShot(): Promise<string>;
  getVideo(): string;
  startVideoRecording(): boolean;
  getType(): SessionType;
}
