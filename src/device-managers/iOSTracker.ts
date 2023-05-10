import _ from 'lodash';
import { EventEmitter } from 'stream';
import { SubProcess, exec } from 'teen_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { isWindows } from '../helpers';
import logger from '../logger';

export class GoIosTracker extends EventEmitter {
  private deviceMap: Map<number, string> = new Map();
  private process!: SubProcess;
  private started = true;

  async start() {
    if (!_.isNil(this.process) && this.process.isRunning) {
      return;
    }
    try {
      const files = fs.readdirSync(path.join(__dirname + '../../../node_modules/go-ios/dist/'));
      const goIOS = files.find((value) => value.includes(os.type().toLowerCase()));
      fs.lstatSync(
        `${path.join(__dirname + '../../../node_modules/go-ios/dist/')}${goIOS}/ios`
      ).isDirectory();
      this.process = new SubProcess(
        `${path.join(__dirname + '../../../node_modules/go-ios/dist/')}${goIOS}/ios`,
        ['listen']
      );
    } catch (err) {
      logger.warn('Had trouble finding go-ios within device-farm modules, checking globally');
      let { stdout: binPath } = await exec('npm', ['bin', '-g']);
      if (!binPath || binPath.length == 0) {
        binPath = path.join(process.env.npm_config_prefix as string, 'bin');
      }
      const goIosPath = path.join(binPath.trim(), 'ios' + (isWindows() ? '.exe' : ''));
      const goIosInstalled = fs.existsSync(goIosPath) && fs.lstatSync(goIosPath).isFile();
      if (!goIosInstalled)
        throw new Error('Failed to find go-ios, please install globally npm install -g go-ios');
      logger.info('Found go-ios globally!');
      this.process = new SubProcess(goIosPath, ['listen']);
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
        this.emit('device-connected', {
          id: message.Properties.SerialNumber,
        });
      } else {
        const id = this.deviceMap.get(message.DeviceID);
        this.emit('device-removed', {
          id,
        });
      }
    });
  }
}
