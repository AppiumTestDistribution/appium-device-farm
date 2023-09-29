import SessionType from '../enums/SessionType';
import { ISession } from '../interfaces/ISession';

export class RemoteSession implements ISession {
  constructor(private baseUrl: string, protected sessionId: string) {}

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
