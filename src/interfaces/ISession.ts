import SessionType from '../enums/SessionType';

export interface ISession {
  getId(): string;
  getScreenShot(): string;
  getVideo(): string;
  startVideoRecording(): boolean;
  getType(): SessionType;
}
