/* eslint-disable @typescript-eslint/no-var-requires */
import _ from 'lodash';
import { system, fs } from '@appium/support';
import { BaseDriver } from 'appium/driver';
import path from 'path';
import axios from 'axios';
import { exec } from 'teen_process';

const CD_CDN =
  process.env.npm_config_chromedriver_cdnurl ||
  process.env.CHROMEDRIVER_CDNURL ||
  'https://chromedriver.storage.googleapis.com';
const OS = {
  linux: 'linux',
  windows: 'win',
  mac: 'mac',
};
const X64 = '64';
const X86 = '32';
const M1_ARCH_SUFFIX = '_m1';
const CD_EXECUTABLE_PREFIX = 'chromedriver';

const CD_VER = process.env.npm_config_chromedriver_version || process.env.CHROMEDRIVER_VERSION;

async function getChromeVersion(adb: any, bundleId: any) {
  const { versionName } = await adb.getPackageInfo(bundleId);
  return versionName;
}
const DOWNLOAD_TIMEOUT_MS = 15 * 1000;
const LATEST_VERSION = 'LATEST';

async function formatCdVersion(ver: any) {
  return ver === LATEST_VERSION
    ? (
        await retrieveData(
          `${CD_CDN}/LATEST_RELEASE`,
          {
            'user-agent': 'appium',
            accept: '*/*',
          },
          { timeout: DOWNLOAD_TIMEOUT_MS }
        )
      ).trim()
    : ver;
}

async function getChromedriverBinaryPath(dir: any, osName = getOsName()) {
  const pathSuffix = osName === OS.windows ? '.exe' : '';
  console.log(`${CD_EXECUTABLE_PREFIX}*${pathSuffix}`);
  const paths = await fs.glob(`${CD_EXECUTABLE_PREFIX}*${pathSuffix}`, {
    cwd: dir,
    absolute: true,
    nocase: true,
    nodir: true,
    strict: false,
  });
  return _.isEmpty(paths)
    ? path.resolve(dir, `${CD_EXECUTABLE_PREFIX}${pathSuffix}`)
    : _.first(paths);
}

async function retrieveData(url: any, headers: any, opts: any = {}) {
  const { timeout = 5000, responseType = 'text' } = opts;
  return (
    await axios({
      url,
      headers,
      timeout,
      responseType,
    })
  ).data;
}

const getOsName = _.memoize(function getOsName() {
  if (system.isWindows()) {
    return OS.windows;
  }
  if (system.isMac()) {
    return OS.mac;
  }
  return OS.linux;
});

const getOsInfo = _.memoize(async function getOsInfo() {
  let systemHardware = '';
  if (!system.isWindows()) {
    systemHardware = await exec('uname', ['-m']).toString();
  }
  return {
    name: getOsName(),
    arch: await system.arch(),
    hardwareName: system.isWindows() ? null : _.trim(systemHardware),
  };
});

const getBaseDriverInstance = _.memoize(() => new BaseDriver({}, false));

/**
 * Generates log prefix string
 *
 * @param {object} obj log owner instance
 * @param {string?} sessionId Optional session identifier
 * @returns {string}
 */
function generateLogPrefix(obj: any, sessionId: string) {
  return getBaseDriverInstance().helpers.generateDriverLogPrefix(obj, sessionId);
}

export {
  getChromeVersion,
  getChromedriverBinaryPath,
  getOsName,
  CD_CDN,
  CD_VER,
  retrieveData,
  getOsInfo,
  OS,
  X64,
  X86,
  M1_ARCH_SUFFIX,
  generateLogPrefix,
  formatCdVersion,
};
