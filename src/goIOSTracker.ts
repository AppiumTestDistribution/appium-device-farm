import { exec } from 'child_process';
import _ from 'lodash';
import { EventEmitter } from 'stream';
import { SubProcess } from 'teen_process';
import { config } from './config';
import { cachePath } from './helpers';
import log from './logger';
export default class GoIosTracker extends EventEmitter {
  private static instance: GoIosTracker;
  private deviceMap: Map<number, string> = new Map();
  private process!: SubProcess;
  private started = true;

  constructor() {
    super();
    this.start();
  }

  public static getInstance(): GoIosTracker {
    if (!GoIosTracker.instance) {
      GoIosTracker.instance = new GoIosTracker();
    }

    return GoIosTracker.instance;
  }

  start() {
    if (!_.isNil(this.process) && this.process.isRunning) {
      return;
    }
    let goIOSPath;
    if (process.env.GO_IOS) {
      log.info('Found GO_IOS in env');
      goIOSPath = process.env.GO_IOS;
    } else {
      goIOSPath = `${cachePath('goIOS')}/ios`;
    }
    try {
      this.process = new SubProcess(goIOSPath, ['listen']);
    } catch (err: any) {
      log.info(
        `Failed to load go-ios ${goIOSPath}, iOS real device tracking not possible, please refer to link https://appium-device-farm-eight.vercel.app/troubleshooting/#ios-tracking for more details`,
      );
    }

    this.process.on('lines-stdout', (out) => {
      const parsedOutput = this.parseOutput(out);
      if (!_.isNil(parsedOutput)) {
        this.notify(parsedOutput);
      }
    });

    this.process.on('exit', () => {
      this.started = false;
      this.emit('stop');
    });

    this.process.start(0);
  }

  async stop() {
    if (_.isNil(this.process) || !this.process.isRunning) {
      return;
    }
    this.process.stop('SIGINT');
    this.started = false;
  }

  private parseOutput(output: any) {
    try {
      if (_.isArray(output)) {
        return output.map((o) => JSON.parse(o));
      }
    } catch (err) {
      return null;
    }
  }

  private notify(messages: any[]) {
    messages.forEach((message) => {
      if (message.MessageType == 'Attached') {
        this.deviceMap.set(message.DeviceID, message.Properties.SerialNumber);
        this.emit('attached', message.Properties.SerialNumber);
      } else {
        const id = this.deviceMap.get(message.DeviceID);
        this.emit('detached', id);
      }
    });
  }
}

/**
 * Start a go-ios tunnel for a device
 * @param udid - The device UDID
 * @param sdk - The device SDK version
 * @param goIOSAgentPort - The port to use for the go-ios agent (optional)
 */
export async function startTunnel(): Promise<void> {
  const goIOS = process.env.GO_IOS;
  log.info(`Go IOS: ${goIOS}`);

  try {
    log.info('Running go-ios agent');
    const startTunnelCmd = `${goIOS} tunnel start --userspace --tunnel-info-port=${config.goIOSTunnelInfoPort}`;
    log.info(`Starting go-ios tunnel: ${startTunnelCmd}`);

    exec(startTunnelCmd, (error, stdout, stderr) => {
      if (error) {
        log.error(`Error starting go-ios tunnel: ${error.message}`);
        return;
      }
      if (stdout) {
        log.info(`go-ios tunnel stdout: ${stdout}`);
      }
      if (stderr) {
        log.warn(`go-ios tunnel stderr: ${stderr}`);
      }
      log.info('go-ios tunnel established successfully');
    });
  } catch (err) {
    log.error(`Failed to establish go-ios tunnel: ${err}`);
    throw err;
  }
}
