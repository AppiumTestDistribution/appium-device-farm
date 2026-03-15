import EventEmitter from 'events';
import B from 'bluebird';
import _ from 'lodash';
import { SubProcess, exec } from 'teen_process';

class AndroidAppProfiler extends EventEmitter {
  private adb: any;
  private logs: Array<any>;
  private deviceUDID: string;
  private appPackage: string;
  private proc!: SubProcess | null;
  private deviceInfo: any;

  constructor(opts: any = {}) {
    super();
    this.adb = opts.adb?.executable || opts.adb;
    this.logs = [];
    this.deviceUDID = opts.deviceUDID;
    this.appPackage = opts.appPackage;
  }

  async startCapture() {
    let started = false;

    return await new B(async (_resolve, _reject) => {
      const resolve = function (...args: any[]) {
        started = true;
        _resolve(...args);
      };

      const reject = function (...args: any[]) {
        started = true;
        _reject(...args);
      };

      this.deviceInfo = await this.getDeviceInfo();
      const cmd = [
        ...this.adb.defaultArgs,
        '-s',
        this.deviceUDID,
        'shell',
        'top',
        '-o',
        '%CPU,RSS,ARGS',
        '-s',
        '1',
        '-d',
        '1',
      ];

      /* -m argument is only suppoted after api level 28 */
      if (_.isNumber(this.deviceInfo.api_level) && this.deviceInfo.api_level >= 28) {
        cmd.push('-m', '20');
      }

      this.proc = new SubProcess(this.adb.path, cmd);
      this.proc.on('exit', (code, signal) => {
        this.proc = null;
        if (!started) {
          resolve();
        }
      });

      this.proc.on('lines-stdout', (lines) => {
        resolve();
        if (!lines[3]) {
          return;
        }
        const slicedLines = lines.slice(4);
        const sysInfo = {
          total_cpu_used: this.getSystemCpuUsage(lines[3]),
          total_memory_used: this.getSystemMemoryUsage(lines[1]),
          raw_cpu_log: lines[3],
          raw_memory_log: lines[1],
        };
        /* Logs recieved is not in proper format so ignore the entry */
        if (sysInfo.total_cpu_used == 0 && sysInfo.total_memory_used == 0) {
          return;
        }
        for (const line of slicedLines) {
          if (new RegExp(/\r/g).test(line)) {
            line
              .split(/\r/g)
              .filter((l: string) => !!l)
              .forEach((l: string) => this.outputHandler(sysInfo, _.trim(l)));
          } else {
            this.outputHandler(sysInfo, _.trim(line));
          }
        }
      });
      await this.proc.start(0);
    });
  }

  outputHandler(generalCpuInfo: any, output: string) {
    //remove all ascii chanracters from the log line
    output = output.replace(
      // eslint-disable-next-line no-control-regex
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      '',
    );
    const [cpu, memory, pkg] = output.split(' ');
    if (!output || pkg != this.appPackage) {
      return;
    }
    const outputObj = {
      timestamp: new Date().toISOString(),
      cpu,
      memory,
      ...generalCpuInfo,
    };
    this.logs.push(outputObj);
    this.emit('output', outputObj);
  }

  async stopCapture() {
    if (!this.proc || !this.proc.isRunning) {
      this.proc = null;
      return;
    }
    this.proc.removeAllListeners('exit');
    await this.proc.stop();
    this.proc = null;
  }

  getLogs() {
    return _.uniqBy(this.logs, 'timestamp');
  }

  async getDeviceInfo() {
    return {
      total_cpu: await this.getTotalCpus(),
      total_memory: await this.getTotalMemory(),
      api_level: await this.getAndroidApiLevel(),
      app_package: this.appPackage,
    };
  }

  private async getAndroidApiLevel() {
    const args = [
      ...this.adb.defaultArgs,
      '-s',
      this.deviceUDID,
      'shell',
      'getprop',
      'ro.build.version.sdk',
    ];
    const out = await exec(this.adb.path, args);
    return Number(out.stdout.trim());
  }

  private async getTotalCpus() {
    const args = [...this.adb.defaultArgs, '-s', this.deviceUDID, 'shell', 'cat', '/proc/cpuinfo'];
    const out = await exec(this.adb.path, args);
    return out.stdout.match(/processor/g)?.length;
  }

  private async getTotalMemory() {
    const args = [...this.adb.defaultArgs, '-s', this.deviceUDID, 'shell', 'cat', '/proc/meminfo'];
    const out = await exec(this.adb.path, args);
    const match = out.stdout.match(/MemTotal:.*[0-9]/g);
    if (match && match.length) {
      return match[0].replace(/[^0-9]/g, '');
    }
    return 0;
  }

  private getSystemCpuUsage(logLine: string) {
    if (!logLine) {
      return;
    }
    const data: Record<string, any> = {};
    ['cpu', 'idle'].forEach((type: string) => {
      const match = logLine.match(new RegExp(`([0-9]{0,})%${type}`));
      data[type] = match && match.length > 1 ? Number(match[1]) : 0;
    });

    let out = 0;
    ['user', 'nice', 'sys', 'iow', 'irq', 'sirq', 'host'].forEach((type: string) => {
      const match = logLine.match(new RegExp(`([0-9]{0,})%${type}`));
      out += match && match.length > 1 ? Number(match[1]) : 0;
    });
    return out > data['cpu'] ? data['cpu'] : out;
  }

  private getSystemMemoryUsage(logLine: string) {
    if (!logLine) {
      return;
    }
    let match = logLine.match(new RegExp(/([0-9]{0,})k used/i));
    /* In some devices, memory will be shows in GB, so convert it back to KB */
    if (!match) {
      match = logLine.match(new RegExp(/(([1-9]\d*)(\.\d+)?)G used/i));
      return match && match.length > 1 ? Math.ceil(parseFloat(match[1]) * 1024 * 1024) : 0;
    }
    return match && match.length > 1 ? Number(match[1]) : 0;
  }
}

export { AndroidAppProfiler };
