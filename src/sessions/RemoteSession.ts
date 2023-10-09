import axios from 'axios';
import SessionType from '../enums/SessionType';
import { ISession } from '../interfaces/ISession';
import { response } from 'express';
import { IDevice } from '../interfaces/IDevice';

export class RemoteSession implements ISession {
  constructor(protected sessionId: string, private baseUrl: string, private device: IDevice) {}

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

  getVideo(): string {
    throw new Error('Method not implemented.');
  }

  startVideoRecording(): boolean {
    return false;
  }
}
