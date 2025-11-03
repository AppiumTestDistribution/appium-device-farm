/* eslint-disable no-prototype-builtins */
import os from 'os';
import path from 'path';
import tcpPortUsed from 'tcp-port-used';
import getPort from 'get-port';
import { IDevice } from './interfaces/IDevice';
import _ from 'lodash';
import log from './logger';
import Cloud from './enums/Cloud';
import normalizeUrl from 'normalize-url';
import ora from 'ora';
import asyncWait from 'async-wait-until';
import axios from 'axios';
import { FakeModuleLoader } from './fake-module-loader';
import { IExternalModuleLoader } from './interfaces/IExternalModule';

const APPIUM_VENDOR_PREFIX = 'appium:';

// Port manager to track allocated ports
class PortManager {
  private allocatedPorts: Set<number> = new Set();

  /**
   * Check if a port is already allocated
   */
  isPortAllocated(port: number): boolean {
    return this.allocatedPorts.has(port);
  }

  /**
   * Allocate a port by adding it to the allocated set
   */
  allocatePort(port: number): void {
    if (port && port > 0) {
      this.allocatedPorts.add(port);
      log.debug(`Port ${port} has been allocated`);
    }
  }

  /**
   * Release a port by removing it from the allocated set
   */
  releasePort(port: number): void {
    if (port && port > 0 && this.allocatedPorts.has(port)) {
      this.allocatedPorts.delete(port);
      log.debug(`Port ${port} has been released`);
    }
  }

  /**
   * Release multiple ports
   */
  releasePorts(ports: (number | undefined | null)[]): void {
    ports.forEach((port) => {
      if (port && port > 0) {
        this.releasePort(port);
      }
    });
  }
}

// Singleton instance of port manager
const portManager = new PortManager();

export async function asyncForEach(
  array: string | any[],
  callback: {
    (device: any): Promise<void>;
    (udid: any): Promise<void>;
    (arg0: any, arg1: number, arg2: any): any;
  },
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function spinWith(
  msg: string,
  fn: () => Promise<boolean>,
  callback = (msg: string) => {},
) {
  const spinner = ora(msg).start();
  await asyncWait(
    async () => {
      try {
        const res = await fn();
        spinner.succeed();
        return res;
      } catch (err) {
        spinner.fail();
        if (callback) callback(msg);
        return false;
      }
    },
    {
      intervalBetweenAttempts: 2000,
      timeout: 60 * 1000,
    },
  );
}

export function isMac() {
  return os.type() === 'Darwin';
}

export function cachePath(folder: string) {
  return path.join(os.homedir(), '.cache', 'appium-device-farm', folder);
}
export function isWindows() {
  return os.type() === 'win32';
}

export function checkIfPathIsAbsolute(configPath: string) {
  return path.isAbsolute(configPath);
}

export async function getFreePort(portRange?: string): Promise<number> {
  let port: number;

  if (portRange) {
    const range = portRange.split('-').map(Number);
    if (range.length !== 2 || isNaN(range[0]) || isNaN(range[1]) || range[0] > range[1]) {
      log.warn(`Invalid port range format: "${portRange}". Falling back to any free port.`);
      port = await getPort();
      // Check if allocated and try again if needed
      while (portManager.isPortAllocated(port)) {
        port = await getPort();
      }
    } else {
      // Convert iterable to array and filter out allocated ports upfront
      const portOptions = Array.from(getPort.makeRange(range[0], range[1]));
      const availablePorts = portOptions.filter((p: number) => !portManager.isPortAllocated(p));

      if (availablePorts.length === 0) {
        log.warn(`All ports in range ${portRange} are allocated. Falling back to any free port.`);
        port = await getPort();
        // Check if allocated and try again if needed
        while (portManager.isPortAllocated(port)) {
          port = await getPort();
        }
      } else {
        // Get a free port from the available (non-allocated) ports
        // getPort will check system usage among these available ports
        port = await getPort({ port: availablePorts });
      }
    }
  } else {
    port = await getPort();
    // Check if the port is already allocated, keep trying until we find one that's not
    while (portManager.isPortAllocated(port)) {
      port = await getPort();
    }
  }

  // Allocate the port before returning it
  portManager.allocatePort(port);
  return port;
}

/**
 * Release a port that was previously allocated
 * @param port - The port number to release
 */
export function releasePort(port: number | undefined | null): void {
  if (port && port > 0) {
    portManager.releasePort(port);
  }
}

/**
 * Release multiple ports that were previously allocated
 * @param ports - Array of port numbers to release
 */
export function releasePorts(ports: (number | undefined | null)[]): void {
  portManager.releasePorts(ports);
}

export function nodeUrl(device: IDevice, basePath = ''): string {
  const host = normalizeUrl(device.host, { removeTrailingSlash: false });
  if (device.hasOwnProperty('cloud')) {
    if (device.cloud.toLowerCase() === Cloud.PCLOUDY) {
      return `${host}/wd/hub`;
    } else if (device.cloud.toLowerCase() === Cloud.HEADSPIN) {
      return `${host}`;
    } else {
      return `https://${process.env.CLOUD_USERNAME}:${process.env.CLOUD_KEY}@${
        new URL(device.host).host
      }/wd/hub`;
    }
  }
  // hardcoded the `/wd/hub` for now. This can be fetch from serverArgs.basePath
  return `${host}${basePath || ''}`;
}

export async function isPortBusy(port: number) {
  try {
    if (!port) {
      return false;
    }
    return await tcpPortUsed.check(port);
  } catch (err) {
    return false;
  }
}

export function hasHubArgument(cliArgs: any) {
  return _.has(cliArgs, 'plugin["device-farm"].hub');
}

export function hasCloudArgument(cliArgs: any) {
  return _.has(cliArgs, 'plugin["device-farm"].cloud');
}
// Standard, non-prefixed capabilities (see https://www.w3.org/TR/webdriver/#dfn-table-of-standard-capabilities)
const STANDARD_CAPS = [
  'browserName',
  'browserVersion',
  'platformName',
  'acceptInsecureCerts',
  'pageLoadStrategy',
  'proxy',
  'setWindowRect',
  'timeouts',
  'unhandledPromptBehavior',
];

function isStandardCap(cap: any) {
  return !!_.find(
    STANDARD_CAPS,
    (standardCap) => standardCap.toLowerCase() === `${cap}`.toLowerCase(),
  );
}

// If the 'appium:' prefix was provided and it's a valid capability, strip out the prefix (see https://www.w3.org/TR/webdriver/#dfn-extension-capabilities)
// (NOTE: Method is destructive and mutates contents of caps)
export function stripAppiumPrefixes(caps: any) {
  // split into prefixed and non-prefixed.
  // non-prefixed should be standard caps at this point
  const [prefixedCaps, nonPrefixedCaps] = _.partition(_.keys(caps), (cap) =>
    String(cap).startsWith(APPIUM_VENDOR_PREFIX),
  );

  // initialize this with the k/v pairs of the non-prefixed caps
  const strippedCaps = /** @type {import('@appium/types').Capabilities<C>} */ _.pick(
    caps,
    nonPrefixedCaps,
  );
  const badPrefixedCaps: string[] = [];

  // Strip out the 'appium:' prefix
  for (const prefixedCap of prefixedCaps) {
    const strippedCapName =
      /** @type {import('type-fest').StringKeyOf<import('@appium/types').Capabilities<C>>} */ prefixedCap.substring(
        APPIUM_VENDOR_PREFIX.length,
      ) as string;

    // If it's standard capability that was prefixed, add it to an array of incorrectly prefixed capabilities
    if (isStandardCap(strippedCapName)) {
      badPrefixedCaps.push(strippedCapName);
      if (_.isNil(strippedCaps[strippedCapName])) {
        strippedCaps[strippedCapName] = caps[prefixedCap];
      } else {
        log.warn(
          `Ignoring capability '${prefixedCap}=${caps[prefixedCap]}' and ` +
            `using capability '${strippedCapName}=${strippedCaps[strippedCapName]}'`,
        );
      }
    } else {
      strippedCaps[strippedCapName] = caps[prefixedCap];
    }
  }

  // If we found standard caps that were incorrectly prefixed, throw an exception (e.g.: don't accept 'appium:platformName', only accept just 'platformName')
  if (badPrefixedCaps.length > 0) {
    log.warn(
      `The capabilities ${JSON.stringify(
        badPrefixedCaps,
      )} are standard capabilities and do not require "appium:" prefix`,
    );
  }
  return strippedCaps;
}

export async function isDeviceFarmRunning(host: string): Promise<boolean> {
  try {
    const timeoutMs = 30000;
    const result = await axios({
      method: 'get',
      url: `${host}/device-farm/api/status`,
      timeout: timeoutMs,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return result.status == 200;
  } catch (error: any) {
    log.info(`Device Farm is not running at ${host}. Error: ${error}`);
    return false;
  }
}

export async function isAppiumRunningAt(url: string): Promise<boolean> {
  try {
    const timeoutMs = 30000;
    const result = await axios({
      method: 'get',
      url: `${url}/status`,
      timeout: timeoutMs,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return result.status == 200;
  } catch (error: any) {
    log.info(`Appium is not running at ${url}. Error: ${error}`);
    return false;
  }
}

export function safeParseJson(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    return jsonString;
  }
}

export async function loadExternalModules(): Promise<IExternalModuleLoader> {
  // TODO: Should handle DB failures in different way

  // eslint-disable-next-line
  // @ts-ignore
  return import(/* webpackMode: "eager" */ './modules')
    .then((externalModule) => {
      console.log(externalModule);
      return new (externalModule as any).default();
    })
    .catch((err) => {
      console.error('Error Loading External Module', err);
      return new FakeModuleLoader();
    });
  //return new FakeModuleLoader();
}

export async function registerErrorHandlers() {
  process.on('unhandledRejection', (reason, p) => {
    log.error('******  UnhandledRejection ******');
    log.error('Reason:  ');
    console.log(reason);
    log.error((reason as any)?.stack || 'Stacktrace not available');
    log.error('Promise: ', p);
  });
  process.on('uncaughtException', function (exception) {
    log.error('****** UncaughtException ******');
    log.error('Error: ' + exception);
    log.error(exception.stack || 'Stacktrace not available');
  });
}

export function getSessionIdFromUrl(url: string) {
  const SESSION_ID_PATTERN = /\/session\/([^/]+)/;
  const match = SESSION_ID_PATTERN.exec(url);
  if (match) {
    return match[1];
  }
  return null;
}
