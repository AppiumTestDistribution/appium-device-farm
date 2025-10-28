import { exec } from 'child_process';
import _ from 'lodash';
import semver from 'semver';
import { EventEmitter } from 'stream';
import { SubProcess } from 'teen_process';
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
export async function startTunnel(udid: string, sdk?: string, goIOSAgentPort?: number): Promise<void> {
  const goIOS = process.env.GO_IOS;
  log.info(`Go IOS: ${goIOS}`);
  
  // Check if GO_IOS is configured
  if (!goIOS) {
    log.info('GO_IOS environment variable not set, skipping tunnel setup');
    return;
  }

  // Check if goIOSAgentPort is provided
  if (!goIOSAgentPort) {
    log.info('Go IOS Agent Port not provided, skipping tunnel setup');
    return;
  }

  // SDK version checking
  const sdkRaw = sdk?.toString();
  const sdkNormalized = sdkRaw ? sdkRaw.trim().toLowerCase().replace(/x/g, '0') : undefined;
  const sdkCoerced = semver.coerce(sdkNormalized ?? sdkRaw)?.version;
  const isAtLeast17 = sdkCoerced ? semver.satisfies(sdkCoerced, '>=17.0.0') : false;
  
  log.info(`Device SDK: ${sdkRaw}`);
  if (sdkNormalized && sdkNormalized !== sdkRaw) {
    log.info(`Normalized SDK: ${sdkNormalized}`);
  }
  log.info(`Coerced SDK: ${sdkCoerced ?? 'invalid'}`);
  log.info(`Semver satisfies (>=17.0.0): ${isAtLeast17}`);
  log.info(`Go IOS Agent Port: ${goIOSAgentPort} for device ${udid}`);

  // Check for version above 17+ and presence for Go IOS
  if (!isAtLeast17) {
    log.info(`Device SDK version ${sdkRaw} is below 17.0.0, skipping go-ios tunnel setup`);
    return;
  }

  try {
    log.info('Running go-ios agent');
    const startTunnelCmd = `GO_IOS_AGENT_PORT=${goIOSAgentPort} ${goIOS} tunnel start --userspace --udid=${udid}`;
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
