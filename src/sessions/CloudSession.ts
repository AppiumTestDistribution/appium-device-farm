import SessionType from '../enums/SessionType';
import { RemoteSession } from './RemoteSession';

export class CloudSession extends RemoteSession {
  getType(): SessionType {
    return SessionType.CLOUD;
  }

  getId(): string {
    return this.sessionId;
  }

  getScreenShot(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  getVideo(): string {
    throw new Error('Method not implemented.');
  }

  async startVideoRecording() {
    // no action
  }

  isVideoRecordingInProgress(): boolean {
    return false;
  }
}
