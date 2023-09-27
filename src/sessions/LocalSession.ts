import SessionType from '../enums/SessionType';
import { ISession } from '../interfaces/ISession';

export class LocalSession implements ISession {
  constructor(private sessionId: string) {}

  getType(): SessionType {
    return SessionType.LOCAL;
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
    return true;
  }
}
