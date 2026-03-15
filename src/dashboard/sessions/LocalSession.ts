import _ from 'lodash';
import SessionType from '../../enums/SessionType';
import { IDeviceFarmSessionOptions } from '../../interfaces/IDeviceFarmSession';
import { AndroidAppProfiler } from '../app-profiling/android-profiling';
import { RemoteSession } from './RemoteSession';

function constructBasePath(path: string): string {
  if (!path || path === '') {
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

export type LocalSessionOptions = IDeviceFarmSessionOptions & {
  driver: any;
};

export class LocalSession extends RemoteSession {
  protected driver: any;
  private androidAppProfiler!: AndroidAppProfiler;

  constructor(options: LocalSessionOptions) {
    const { address, port, basePath } = options.driver.opts || options.driver;
    const baseUrl = `http://${address}:${port}${constructBasePath(basePath)}`;
    super({ ...options, baseUrl });
    this.driver = options.driver;
  }

  getType(): SessionType {
    return SessionType.LOCAL;
  }

  getLiveVideoUrl(): string | null {
    const { address } = this.driver.opts || this.driver;
    const mjpegServerPort = this.getCapabilities()['mjpegServerPort'];
    if (mjpegServerPort && !isNaN(mjpegServerPort)) {
      return `http://${address}:${mjpegServerPort}`;
    } else {
      return null;
    }
  }

  async startDeviceLog() {
    this.saveDeviceLog = true;
  }

  async getDeviceLogs(forceFetch = false) {
    if (forceFetch || this.saveDeviceLog) {
      const sessionId = this.options.sessionId;
      if (!this.driver.sessions || !this.driver.sessions[sessionId]) {
        return [];
      }
      const session = this.driver.sessions[sessionId];
      const automationName = session.caps.automationName.toLowerCase();
      const platformName = session.caps.platformName.toLowerCase();
      const logKey: any = {
        uiautomator2: 'uiautomator2.adb.logcat',
        xcuitest: 'logs.syslog',
        flutterintegration_android: 'proxydriver.uiautomator2.adb.logcat',
        flutterintegration_ios: 'proxydriver.logs.syslog',
      };

      let logEntry = (logKey[automationName] || logKey[`${automationName}_${platformName}`])
        ?.split('.')
        .reduce((acc: any, k: any) => {
          return acc[k] || {};
        }, session);

      if (_.isObject(logEntry) && 'getAllLogs' in logEntry) {
        logEntry = (logEntry as any).getAllLogs();
      } else if (_.isObject(logEntry) && 'getLogs' in logEntry) {
        logEntry = await (logEntry as any).getLogs();
      } else if (_.isObject(logEntry) && 'logs' in logEntry) {
        logEntry = (logEntry as any).logs;
      }

      return Array.isArray(logEntry) ? logEntry : [];
    }
    return [];
  }

  async startAppProfiling(): Promise<boolean> {
    const capabilities = this.getCapabilities();
    if (
      capabilities['platformName'] &&
      capabilities['platformName'].toLowerCase() === 'android' &&
      this.options.sessionResponse['appPackage']
    ) {
      this.androidAppProfiler = new AndroidAppProfiler({
        adb: this.options.adb,
        deviceUDID: this.options.device.udid,
        appPackage: this.options.sessionResponse['appPackage'],
      });
      await this.androidAppProfiler.startCapture();
      this.hasAppProfiling = true;
    }
    return this.hasAppProfiling;
  }

  async stopAppProfiling(): Promise<any> {
    if (this.hasAppProfiling) {
      await this.androidAppProfiler.stopCapture();
      return {
        device_info: await this.androidAppProfiler.getDeviceInfo(),
        profiling_logs: this.androidAppProfiler.getLogs(),
      };
    }
    return null;
  }
}
