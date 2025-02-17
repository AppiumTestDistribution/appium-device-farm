import _ from 'lodash';
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
