import getPort from 'get-port';
import { ISessionCapability } from './interfaces/ISessionCapability';
import _ from 'lodash';
import { IDevice } from './interfaces/IDevice';
import { prisma } from './prisma';
import { DevicePlugin } from './plugin';
import log from './logger';
import { updatedAllocatedDevice } from './data-service/device-service';

export enum DEVICE_FARM_CAPABILITIES {
  BUILD_NAME = 'build',
  SESSION_NAME = 'name',
  VIDEO_RECORDING = 'recordVideo',
  VIDEO_RESOLUTION = 'videoResolution',
  VIDEO_TIME_LIMIT = 'videoTimeLimit',
  LIVE_VIDEO = 'liveVideo',
  SCREENSHOT_ON_FAILURE = 'screenshotOnFailure',
  SCREENSHOT_ON_ALL = 'screenshotOnAll',
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
  const mergedCaps = Object.assign({}, caps.firstMatch ? caps.firstMatch[0] : {}, caps.alwaysMatch);
  const fileName = mergedCaps['appium:app'];
  if (fileName?.startsWith('file')) {
    const appInfo: any = await prisma.appInformation.findFirst({
      where: { uploadedFileName: fileName as string },
    });
    return `${DevicePlugin.serverUrl}${appInfo?.path}`;
  } else {
    return fileName;
  }
}
export async function androidCapabilities(
  caps: ISessionCapability,
  freeDevice: IDevice,
  options: { liveVideo: boolean; portRange?: string },
) {
  caps.firstMatch[0] = caps.firstMatch[0] || {};
  caps.firstMatch[0]['appium:app'] = await findAppPath(caps);
  caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  caps.firstMatch[0]['appium:systemPort'] = await getPort({
    port: getPort.makeRange(
      parseInt(options.portRange?.split('-')[0] || '10000'),
      parseInt(options.portRange?.split('-')[1] || '12000'),
    ),
  });
  caps.firstMatch[0]['appium:chromeDriverPort'] = await getPort();
  caps.firstMatch[0]['appium:adbRemoteHost'] = freeDevice.adbRemoteHost;
  caps.firstMatch[0]['appium:adbPort'] = freeDevice.adbPort;
  if (freeDevice.chromeDriverPath)
    caps.firstMatch[0]['appium:chromedriverExecutable'] = freeDevice.chromeDriverPath;
  if (!isCapabilityAlreadyPresent(caps, 'appium:mjpegServerPort')) {
    caps.firstMatch[0]['appium:mjpegServerPort'] = options.liveVideo
      ? await getPort({
          port: getPort.makeRange(
            parseInt(options.portRange?.split('-')[0] || '13000'),
            parseInt(options.portRange?.split('-')[1] || '14000'),
          ),
        })
      : undefined;
  }
  if (!options.liveVideo) {
    deleteAlwaysMatch(caps, 'appium:mjpegServerPort');
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
  freeDevice: IDevice,
  options: {
    liveVideo: boolean;
    portRange?: string;
  },
) {
  if (!process.env.GO_IOS) {
    freeDevice.mjpegServerPort = options.liveVideo
      ? await getPort({
          port: getPort.makeRange(
            parseInt(options.portRange?.split('-')[0] || '13000'),
            parseInt(options.portRange?.split('-')[1] || '14000'),
          ),
        })
      : undefined;
  }

  caps.firstMatch[0] = caps.firstMatch[0] || {};
  caps.firstMatch[0]['appium:app'] = await findAppPath(caps);
  caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  caps.firstMatch[0]['appium:deviceName'] = freeDevice.name;
  caps.firstMatch[0]['appium:platformVersion'] = freeDevice.sdk;
  caps.firstMatch[0]['appium:mjpegServerPort'] = freeDevice.mjpegServerPort;
  caps.firstMatch[0]['appium:wdaLocalPort'] = freeDevice.wdaLocalPort = await getPort({
    port: getPort.makeRange(
      parseInt(options.portRange?.split('-')[0] || '14000'),
      parseInt(options.portRange?.split('-')[1] || '15000'),
    ),
  });
  if (freeDevice.realDevice && !caps.firstMatch[0]['df:skipReport']) {
    const wdaFileName = freeDevice.platform === 'tvos' ? 'wda-resign_tvos.ipa' : 'wda-resign.ipa';
    const wdaInfo = await prisma.appInformation.findFirst({
      where: { fileName: wdaFileName },
    });
    if (wdaInfo && !process.env.GO_IOS) {
      caps.firstMatch[0]['appium:usePreinstalledWDA'] = true;
      caps.firstMatch[0]['appium:updatedWDABundleId'] = wdaInfo.appBundleId;
      caps.firstMatch[0]['appium:updatedWDABundleIdSuffix'] = '';
    } else if (wdaInfo && process.env.GO_IOS && !caps.alwaysMatch?.['appium:webDriverAgentUrl']) {
      log.info('Setting webDriverAgentUrl for real device');
      caps.firstMatch[0]['appium:webDriverAgentUrl'] =
        freeDevice.webDriverAgentUrl = `${freeDevice.webDriverAgentHost}:${freeDevice.wdaLocalPort}`;
      delete caps.firstMatch[0]['appium:wdaLocalPort'];
    }
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

  if (!options.liveVideo) {
    deleteMatch.push('appium:mjpegServerPort');
  }
  deleteMatch.forEach((value) => deleteAlwaysMatch(caps, value));
  await updatedAllocatedDevice(freeDevice, {
    wdaLocalPort: freeDevice.wdaLocalPort,
    mjpegServerPort: freeDevice.mjpegServerPort,
    webDriverAgentUrl: freeDevice.webDriverAgentUrl,
  });
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
