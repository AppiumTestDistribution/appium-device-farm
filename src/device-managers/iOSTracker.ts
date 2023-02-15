import _ from 'lodash';
import { EventEmitter } from 'stream';
import { SubProcess } from 'teen_process';

export class GoIosTracker extends EventEmitter {
  private deviceMap: Map<number, string> = new Map();
  private process!: SubProcess;
  private started = true;

  async start() {
    if (!_.isNil(this.process) && this.process.isRunning) {
      return;
    }

    this.process = new SubProcess('ios', ['listen']);

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
