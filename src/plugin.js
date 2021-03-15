import BasePlugin from '@appium/base-plugin';
import ADB from 'appium-adb';

export default class DevicePlugin extends BasePlugin {
  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    const adb = await ADB.createADB();
    const connectedDevices = await adb.getConnectedDevices();
    if (connectedDevices.length > 0) {
      caps.firstMatch[0]['appium:deviceName'] = connectedDevices[0].udid;
    }
    return await driver.createSession(jwpDesCaps, jwpReqCaps, caps);
    // const response = await next();
    // return response;
  }
}
