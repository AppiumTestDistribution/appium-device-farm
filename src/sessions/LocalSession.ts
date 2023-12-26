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
  constructor(
    sessionId: string,
    private driver: any,
    device: IDevice,
    sessionResponse: Record<string, any>,
  ) {
    const { address, port, basePath } = driver.opts || driver;
    super(
      sessionId,
      `http://${address}:${port}${constructBasePath(basePath)}`,
      device,
      sessionResponse,
    );
  }

  getType(): SessionType {
    return SessionType.LOCAL;
  }

  getId(): string {
    return this.sessionId;
  }

  getLiveVideoUrl() {
    const { address } = this.driver.opts || this.driver;
    if (
      this.sessionResponse['mjpegServerPort'] &&
      !isNaN(this.sessionResponse['mjpegServerPort'])
    ) {
      return `http://${address}:${this.sessionResponse['mjpegServerPort']}`;
    } else {
      return null;
    }
  }
}
