import getPort from 'get-port';
import { isPortBusy } from './helpers';
import { ISessionCapability } from './interfaces/ISessionCapability';
import _ from 'lodash';

function isCapabilityAlreadyPresent(caps: ISessionCapability, capabilityName: string) {
  return _.has(caps.alwaysMatch, capabilityName) || _.has(caps.firstMatch[0], capabilityName);
}

export async function androidCapabilities(
  caps: ISessionCapability,
  freeDevice: { udid: any; name: string }
) {
  caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  caps.firstMatch[0]['appium:systemPort'] = await getPort();
  caps.firstMatch[0]['appium:chromeDriverPort'] = await getPort();
  if (!isCapabilityAlreadyPresent(caps, 'appium:mjpegServerPort')) {
    caps.firstMatch[0]['appium:mjpegServerPort'] = await getPort();
  }
  delete caps.alwaysMatch['appium:udid'];
  delete caps.alwaysMatch['appium:systemPort'];
  delete caps.alwaysMatch['appium:chromeDriverPort'];
}

export async function iOSCapabilities(
  caps: ISessionCapability,
  freeDevice: { udid: any; name: string; realDevice: boolean; sdk: string, mjpegServerPort?: number }
) {
  caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  caps.firstMatch[0]['appium:deviceName'] = freeDevice.name;
  caps.firstMatch[0]['appium:platformVersion'] = freeDevice.sdk;
  caps.firstMatch[0]['appium:wdaLocalPort'] = await getPort();
  if (!isCapabilityAlreadyPresent(caps, 'appium:mjpegServerPort')) {
    if (freeDevice.realDevice) {
      caps.firstMatch[0]['appium:mjpegServerPort'] = await getPort();
      delete caps.alwaysMatch['appium:mjpegServerPort'];
    } else {
      /* In simulator, port forwarding won't happen for each session. So mjpegServerPort will be used only for 1st time.
       * So set the port for the first time and resuse the same port for subsequent sessions.
       */
      const existingPort = freeDevice.mjpegServerPort;
      caps.firstMatch[0]['appium:mjpegServerPort'] =
        existingPort && (await isPortBusy(existingPort)) ? existingPort : await getPort();
        delete caps.alwaysMatch['appium:mjpegServerPort'];
    }
    delete caps.alwaysMatch['appium:udid'];
    delete caps.alwaysMatch['appium:deviceName'];
    delete caps.alwaysMatch['appium:wdaLocalPort'];
  }
}
