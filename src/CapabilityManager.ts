import getPort from 'get-port';
import { isPortBusy } from './helpers';
export async function androidCapabilities(
  caps: { firstMatch: { [x: string]: number | string }[] },
  freeDevice: { udid: any; name: string }
) {
  caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  caps.firstMatch[0]['appium:deviceName'] = freeDevice.name;
  caps.firstMatch[0]['appium:systemPort'] = await getPort();
  caps.firstMatch[0]['appium:chromeDriverPort'] = await getPort();
  caps.firstMatch[0]['appium:mjpegServerPort'] = await getPort();
}

export async function iOSCapabilities(
  caps: { firstMatch: { [x: string]: number | string }[] },
  freeDevice: { udid: any; name: string; realDevice: boolean; mjpegServerPort?: number }
) {
  caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  caps.firstMatch[0]['appium:deviceName'] = freeDevice.name;
  caps.firstMatch[0]['appium:wdaLocalPort'] = await getPort();
  if (freeDevice.realDevice) {
    caps.firstMatch[0]['appium:mjpegServerPort'] = await getPort();
  } else {
    /* In simulator, port forwarding won't happen for each session. So mjpegServerPort will be used only for 1st time.
     * So set the port for the first time and resuse the same port for subsequent sessions.
     */
    let existingPort = freeDevice.mjpegServerPort;
    caps.firstMatch[0]['appium:mjpegServerPort'] =
      existingPort && (await isPortBusy(existingPort)) ? existingPort : await getPort();
  }
}
