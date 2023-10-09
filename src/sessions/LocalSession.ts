import SessionType from '../enums/SessionType';
import { IDevice } from '../interfaces/IDevice';
import { RemoteSession } from './RemoteSession';

function constructBasePath(path: string) {
  if (!path || path == '') {
    return '/wd-internal';
  }
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  if (path.endsWith('/')) {
    path = path.substr(0, path.length - 2);
  }
  return `${path}/wd-internal`;
}

export class LocalSession extends RemoteSession {
  constructor(sessionId: string, private driver: any, device: IDevice) {
    const { address, port, basePath } = driver.opts || driver;
    super(sessionId, `http://${address}:${port}${constructBasePath(basePath)}`, device);
  }

  getType(): SessionType {
    return SessionType.LOCAL;
  }

  getId(): string {
    return this.sessionId;
  }

  getVideo(): string {
    throw new Error('Method not implemented.');
  }

  startVideoRecording(): boolean {
    return true;
  }
}
