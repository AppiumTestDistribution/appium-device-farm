import 'reflect-metadata';
import yargs from 'yargs/yargs';
import { Container } from 'typedi';
import { DeviceFarmManager } from './device-managers';
import logger from './logger';

const appiumArgs = yargs(process.argv.slice(2)).argv;
let pluginArgs: any = {};

(async () => {
  try {
    if (appiumArgs['plugin-args']) {
      pluginArgs = JSON.parse(appiumArgs['plugin-args'] as any);
    }
    const deviceManager = new DeviceFarmManager({
      platform: pluginArgs['device-farm']?.Platform.toLowerCase(),
    });
    Container.set(DeviceFarmManager, deviceManager);
  } catch (e) {
    logger.error(e);
  }
})();

export { DevicePlugin } from './plugin-new';
