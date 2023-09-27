import SessionType from '../enums/SessionType';
import { ISession } from '../interfaces/ISession';
import { RemoteSession } from './RemoteSession';

export class CloudSession extends RemoteSession {
  getType(): SessionType {
    return SessionType.CLOUD;
  }

  getId(): string {
    return this.sessionId;
  }

  getScreenShot(): string {
    throw new Error('Method not implemented.');
  }

  getVideo(): string {
    throw new Error('Method not implemented.');
  }

  startVideoRecording(): boolean {
    return false;
  }
}
