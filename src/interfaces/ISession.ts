import SessionType from '../enums/SessionType';

export interface ISession {
  getId(): string;
  getScreenShot(): Promise<string>;
  getVideo(): string;
  startVideoRecording(): boolean;
  getType(): SessionType;
}
