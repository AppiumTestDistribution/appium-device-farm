import getPort from 'get-port';

export async function androidCapabilities(
  caps: { firstMatch: { [x: string]: number }[] },
  freeDevice: { udid: any }
) {
  caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  caps.firstMatch[0]['appium:deviceName'] = freeDevice.udid;
  caps.firstMatch[0]['appium:systemPort'] = await getPort();
  caps.firstMatch[0]['appium:chromeDriverPort'] = await getPort();
}

export async function iOSCapabilities(
  caps: { firstMatch: { [x: string]: number }[] },
  freeDevice: { udid: any }
) {
  caps.firstMatch[0]['appium:udid'] = freeDevice.udid;
  caps.firstMatch[0]['appium:deviceName'] = freeDevice.udid;
  caps.firstMatch[0]['appium:wdaLocalPort'] = await getPort();
}
