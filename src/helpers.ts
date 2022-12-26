/* eslint-disable no-prototype-builtins */
import os from 'os';
import path from 'path';
import tcpPortUsed from 'tcp-port-used';
import getPort from 'get-port';
import { IDevice } from './interfaces/IDevice';
import _ from 'lodash';
import log from './logger';
import Cloud from './enums/Cloud';

const APPIUM_VENDOR_PREFIX = 'appium:';
export async function asyncForEach(
  array: string | any[],
  callback: {
    (device: any): Promise<void>;
    (udid: any): Promise<void>;
    (arg0: any, arg1: number, arg2: any): any;
  }
) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function isMac() {
  return os.type() === 'Darwin';
}

export function checkIfPathIsAbsolute(configPath: string) {
  return path.isAbsolute(configPath);
}

export async function getFreePort() {
  return await getPort();
}

export function hubUrl(device: IDevice) {
  if (device.hasOwnProperty('cloud') && device.cloud === 'browserstack') {
    return `https://${process.env.BS_USERNAME}:${process.env.BS_PASSWORD}@hub.browserstack.com/wd/hub/session`;
  } else if (device.hasOwnProperty('cloud') && device.cloud.toLowerCase() === Cloud.PCLOUDY) {
    return 'https://device.pcloudy.com/appiumcloud/wd/hub/session';
  }
  return `${device.host}/wd/hub/session`;
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
    (standardCap) => standardCap.toLowerCase() === `${cap}`.toLowerCase()
  );
}

// If the 'appium:' prefix was provided and it's a valid capability, strip out the prefix (see https://www.w3.org/TR/webdriver/#dfn-extension-capabilities)
// (NOTE: Method is destructive and mutates contents of caps)
export function stripAppiumPrefixes(caps: any) {
  // split into prefixed and non-prefixed.
  // non-prefixed should be standard caps at this point
  const [prefixedCaps, nonPrefixedCaps] = _.partition(_.keys(caps), (cap) =>
    String(cap).startsWith(APPIUM_VENDOR_PREFIX)
  );

  // initialize this with the k/v pairs of the non-prefixed caps
  const strippedCaps = /** @type {import('@appium/types').Capabilities<C>} */ _.pick(
    caps,
    nonPrefixedCaps
  );
  const badPrefixedCaps = [];

  // Strip out the 'appium:' prefix
  for (const prefixedCap of prefixedCaps) {
    const strippedCapName =
      /** @type {import('type-fest').StringKeyOf<import('@appium/types').Capabilities<C>>} */ prefixedCap.substring(
        APPIUM_VENDOR_PREFIX.length
      );

    // If it's standard capability that was prefixed, add it to an array of incorrectly prefixed capabilities
    if (isStandardCap(strippedCapName)) {
      badPrefixedCaps.push(strippedCapName);
      if (_.isNil(strippedCaps[strippedCapName])) {
        strippedCaps[strippedCapName] = caps[prefixedCap];
      } else {
        log.warn(
          `Ignoring capability '${prefixedCap}=${caps[prefixedCap]}' and ` +
            `using capability '${strippedCapName}=${strippedCaps[strippedCapName]}'`
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
        badPrefixedCaps
      )} are standard capabilities and do not require "appium:" prefix`
    );
  }
  return strippedCaps;
}
