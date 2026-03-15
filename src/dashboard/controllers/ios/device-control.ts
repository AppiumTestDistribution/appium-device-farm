import { Request, Response } from 'express';
import { getDevice } from '../../../data-service/device-service';
import { Simctl } from 'node-simctl';
import { services } from 'appium-ios-device';
import log from '../../../logger';

const EXECVP_ERROR_PATTERN = /execvp\(\)/;

interface LogStreamOptions {
  predicate?: string;
  logLevel?: string;
}

interface ILogService {
  startStream(response: Response, options: LogStreamOptions): Promise<void>;
  cleanup(): Promise<void>;
}

class SimulatorLogService implements ILogService {
  private logsService: any;
  private simctl: Simctl;

  constructor(udid: string) {
    this.simctl = new Simctl({ udid });
  }

  private buildSpawnArgs(options: LogStreamOptions): string[] {
    const spawnArgs = ['log', 'stream', '--style', 'compact'];

    if (options.predicate) {
      spawnArgs.push('--predicate', options.predicate);
    }
    if (options.logLevel) {
      spawnArgs.push('--level', options.logLevel);
    }

    return spawnArgs;
  }

  async cleanup(): Promise<void> {
    if (!this.logsService?.isRunning) {
      return;
    }
    try {
      await this.logsService.stop('SIGTERM', 1000);
    } catch {
      if (!this.logsService.isRunning) {
        return;
      }
      await this.logsService.stop('SIGKILL');
    }
  }

  async startStream(response: Response, options: LogStreamOptions): Promise<void> {
    const spawnArgs = this.buildSpawnArgs(options);
    console.log('spawnArgs', spawnArgs);
    this.logsService = await this.simctl.spawnSubProcess(spawnArgs);

    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('X-Content-Type-Options', 'nosniff');

    for (const streamName of ['stdout', 'stderr']) {
      this.logsService.on(`line-${streamName}`, (line: string) => {
        response.write(`${line}\n`);
      });
    }

    const startDetector = (stdout: string, stderr: string) => {
      if (EXECVP_ERROR_PATTERN.test(stderr)) {
        throw new Error('iOS log capture process failed to start');
      }
      return Boolean(stdout || stderr);
    };

    await this.logsService.start(startDetector, 1000);
  }
}

class RealDeviceLogService implements ILogService {
  private iosService: any;
  private udid: string;

  constructor(udid: string) {
    this.udid = udid;
  }

  async startStream(response: Response): Promise<void> {
    response.setHeader('Content-Type', 'text/plain');
    response.setHeader('Cache-Control', 'no-cache');
    response.setHeader('X-Content-Type-Options', 'nosniff');

    this.iosService = await services.startSyslogService(this.udid);
    this.iosService.start((logLine: string) => {
      response.write(`${logLine}\n`);
    });
  }

  async cleanup(): Promise<void> {
    if (this.iosService) {
      await this.iosService.close();
    }
  }
}

async function getIosDeviceLogs(request: Request, response: Response) {
  const { sessionId } = request.params;
  const { predicate, logLevel } = request.query as { predicate: string; logLevel: string };

  if (!sessionId) {
    return response.status(400).json({ error: 'sessionId is required' });
  }

  const device = await getDevice({ session_id: sessionId });
  if (!device || device.platform !== 'ios') {
    return response.status(404).json({ error: 'Device not found' });
  }

  const logService: ILogService = device.realDevice
    ? new RealDeviceLogService(device.udid)
    : new SimulatorLogService(device.udid);

  log.info(`Starting log stream for device ${device.udid}`);

  try {
    await logService.startStream(response, { predicate, logLevel });

    request.on('close', () => logService.cleanup());
    response.on('error', () => logService.cleanup());
  } catch (error) {
    await logService.cleanup();
    if (!response.headersSent) {
      response.status(500).send('Error: Log file is no longer accessible');
    }
  }
}

export { getIosDeviceLogs };
