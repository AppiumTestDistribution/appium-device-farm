import SessionType from '../enums/SessionType';
import { DeviceFarmSessionOptions } from './DeviceFarmSession';
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

export type LocalSessionOptions = DeviceFarmSessionOptions & {
  driver: any;
};

export class LocalSession extends RemoteSession {
  protected driver: any;

  constructor(options: LocalSessionOptions) {
    const { address, port, basePath } = options.driver.opts || options.driver;
    super({
      ...options,
      baseUrl: `http://${address}:${port}${constructBasePath(basePath)}`,
    });
    this.driver = options.driver;
  }

  getType(): SessionType {
    return SessionType.LOCAL;
  }

  getLiveVideoUrl() {
    const { address } = this.driver.opts || this.driver;
    const mjpegServerPort = this.getCapabilities()['mjpegServerPort'];
    if (mjpegServerPort && !isNaN(mjpegServerPort)) {
      return `http://${address}:${mjpegServerPort}`;
    } else {
      return null;
    }
  }
}
