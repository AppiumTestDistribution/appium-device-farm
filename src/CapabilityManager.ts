import getPort from 'get-port';
import { ISessionCapability } from './interfaces/ISessionCapability';
import _ from 'lodash';
import { IDevice } from './interfaces/IDevice';
import { prisma } from './prisma';
import { DevicePlugin } from './plugin';

export enum DEVICE_FARM_CAPABILITIES {
  BUILD_NAME = 'build',
  SESSION_NAME = 'name',
  VIDEO_RECORDING = 'recordVideo',
  VIDEO_RESOLUTION = 'videoResolution',
  LIVE_VIDEO = 'liveVideo',
  SCREENSHOT_ON_FAILURE = 'screenshotOnFailure',
  DEVICE_FARM_OPTIONS = 'df:options',
  DEVICE_TIMEOUT = 'deviceAvailabilityTimeout',
  DEVICE_QUERY_INTERVAL = 'deviceRetryInterval',
  iPHONEONLY = 'iPhoneOnly',
  iPADONLY = 'iPadOnly',
  UDIDS = 'udids',
  MIN_SDK = 'minSDK',
  MAX_SDK = 'maxSDK',
  FILTER_BY_HOST = 'filterByHost',
  SAVE_DEVICE_LOGS = 'saveDeviceLogs',
  TAGS = 'tags',
}

function isCapabilityAlreadyPresent(caps: ISessionCapability, capabilityName: string) {
  return _.has(caps.alwaysMatch, capabilityName) || _.has(caps.firstMatch[0], capabilityName);
}

function deleteAlwaysMatch(caps: ISessionCapability, capabilityName: string) {
  if (_.has(caps.alwaysMatch, capabilityName)) delete caps.alwaysMatch[capabilityName];
}

async function findAppPath(caps: any) {
  if (caps.alwaysMatch['df:skipReport']) return;
  const fileName = caps.alwaysMatch['appium:app'] || caps.firstMatch[0]['appium:app'];
  if (fileName?.startsWith('file')) {
    const appInfo: any = await prisma.appInformation.findFirst({
      where: { uploadedFileName: fileName as string },
    });
    return `${DevicePlugin.serverUrl}${appInfo?.path}`;
  } else {
    return fileName;
  }
}
export async function androidCapabilities(caps: ISessionCapability, freeDevice: IDevice) {
  caps.firstMatch[0]['appium:app'] = await findAppPath(caps);
  caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  caps.firstMatch[0]['appium:systemPort'] = await getPort();
  caps.firstMatch[0]['appium:chromeDriverPort'] = await getPort();
  caps.firstMatch[0]['appium:adbRemoteHost'] = freeDevice.adbRemoteHost;
  caps.firstMatch[0]['appium:adbPort'] = freeDevice.adbPort;
  if (freeDevice.chromeDriverPath)
    caps.firstMatch[0]['appium:chromedriverExecutable'] = freeDevice.chromeDriverPath;
  if (!isCapabilityAlreadyPresent(caps, 'appium:mjpegServerPort')) {
    caps.firstMatch[0]['appium:mjpegServerPort'] = await getPort();
  }
  deleteAlwaysMatch(caps, 'appium:udid');
  deleteAlwaysMatch(caps, 'appium:systemPort');
  deleteAlwaysMatch(caps, 'appium:chromeDriverPort');
  deleteAlwaysMatch(caps, 'appium:adbRemoteHost');
  deleteAlwaysMatch(caps, 'appium:adbPort');
  deleteAlwaysMatch(caps, 'appium:app');
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
    wdaBundleId?: string;
  },
) {
  caps.firstMatch[0]['appium:app'] = await findAppPath(caps);
  caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  caps.firstMatch[0]['appium:deviceName'] = freeDevice.name;
  caps.firstMatch[0]['appium:platformVersion'] = freeDevice.sdk;
  caps.firstMatch[0]['appium:wdaLocalPort'] = freeDevice.wdaLocalPort;
  caps.firstMatch[0]['appium:mjpegServerPort'] = freeDevice.mjpegServerPort;
  if (freeDevice.realDevice && !caps.alwaysMatch['df:skipReport']) {
    const { appBundleId } = (await prisma.appInformation.findFirst({
      where: { fileName: 'wda-resign.ipa' },
    })) as any;
    caps.firstMatch[0]['appium:usePreinstalledWDA'] = true;
    caps.firstMatch[0]['appium:updatedWDABundleId'] = appBundleId;
    caps.firstMatch[0]['appium:updatedWDABundleIdSuffix'] = '';
  }
  const deleteMatch = [
    'appium:derivedDataPath',
    'appium:platformVersion',
    'appium:wdaLocalPort',
    'appium:mjpegServerPort',
    'appium:udid',
    'appium:deviceName',
    'appium:app',
  ];
  deleteMatch.forEach((value) => deleteAlwaysMatch(caps, value));
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
