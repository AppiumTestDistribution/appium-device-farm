import getPort from 'get-port';
import { ISessionCapability } from './interfaces/ISessionCapability';
import _ from 'lodash';
import { IDevice } from './interfaces/IDevice';

export enum DEVICE_FARM_CAPABILITIES {
  BUILD_NAME = 'build',
  SESSION_NAME = 'name',

  VIDEO_RECORDING = 'record_video',
  VIDEO_RESOLUTION = 'video_resolution',
  LIVE_VIDEO = 'live_video',
  SCREENSHOT_ON_FAILURE = 'screenshot_on_failure',

  DEVICE_FARM_OPTIONS = 'df:options',
}

function isCapabilityAlreadyPresent(caps: ISessionCapability, capabilityName: string) {
  return _.has(caps.alwaysMatch, capabilityName) || _.has(caps.firstMatch[0], capabilityName);
}

function deleteAlwaysMatch(caps: ISessionCapability, capabilityName: string) {
  if (_.has(caps.alwaysMatch, capabilityName)) delete caps.alwaysMatch[capabilityName];
}

export async function androidCapabilities(caps: ISessionCapability, freeDevice: IDevice) {
  const clonedCaps = _.cloneDeep(caps);
  clonedCaps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  clonedCaps.firstMatch[0]['appium:systemPort'] = await getPort();
  clonedCaps.firstMatch[0]['appium:chromeDriverPort'] = await getPort();
  clonedCaps.firstMatch[0]['appium:adbRemoteHost'] = freeDevice.adbRemoteHost;
  clonedCaps.firstMatch[0]['appium:adbPort'] = freeDevice.adbPort;
  if (freeDevice.chromeDriverPath)
  clonedCaps.firstMatch[0]['appium:chromedriverExecutable'] = freeDevice.chromeDriverPath;
  if (!isCapabilityAlreadyPresent(caps, 'appium:mjpegServerPort')) {
    clonedCaps.firstMatch[0]['appium:mjpegServerPort'] = await getPort();
  }
  deleteAlwaysMatch(clonedCaps, 'appium:udid');
  deleteAlwaysMatch(clonedCaps, 'appium:systemPort');
  deleteAlwaysMatch(clonedCaps, 'appium:chromeDriverPort');
  deleteAlwaysMatch(clonedCaps, 'appium:adbRemoteHost');
  deleteAlwaysMatch(clonedCaps, 'appium:adbPort');

  return clonedCaps;
}

export async function iOSCapabilities(
  caps: ISessionCapability,
  freeDevice: {
    udid: any;
    name: string;
    realDevice: boolean;
    sdk: string;
    mjpegServerPort?: number;
    wdaLocalPort?: number;
    derivedDataPath?: string;
  },
) {
  const clonedCaps = _.cloneDeep(caps);
  clonedCaps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  clonedCaps.firstMatch[0]['appium:deviceName'] = freeDevice.name;
  clonedCaps.firstMatch[0]['appium:platformVersion'] = freeDevice.sdk;
  clonedCaps.firstMatch[0]['appium:wdaLocalPort'] = freeDevice.wdaLocalPort;
  clonedCaps.firstMatch[0]['appium:mjpegServerPort'] = freeDevice.mjpegServerPort;
  clonedCaps.firstMatch[0]['appium:derivedDataPath'] = freeDevice.derivedDataPath;
  const deleteMatch = [
    'appium:derivedDataPath',
    'appium:platformVersion',
    'appium:wdaLocalPort',
    'appium:mjpegServerPort',
    'appium:udid',
    'appium:deviceName',
  ];
  deleteMatch.forEach((value) => deleteAlwaysMatch(clonedCaps, value));

  return clonedCaps;
}

export function getDeviceFarmCapabilities(caps: ISessionCapability) {
  const mergedCapabilites = Object.assign({}, caps.firstMatch[0], caps.alwaysMatch);
  const deviceFarmOptions = mergedCapabilites[DEVICE_FARM_CAPABILITIES.DEVICE_FARM_OPTIONS] || {};

  // Pick all capabilities that starts with df: and store it as a separate object
  const individualCapabilities = Object.keys(mergedCapabilites)
    .filter((key) => key.toLowerCase().trim().startsWith('df:'))
    .reduce(
      (acc: Record<string, any>, originalkey: string) => {
        const strippedKey = originalkey.split(':')[1];
        acc[strippedKey] = mergedCapabilites[originalkey];
        return acc;
      },
      {} as Record<string, any>,
    );

  return _.merge(deviceFarmOptions, individualCapabilities);
}
