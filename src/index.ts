import 'reflect-metadata';
import yargs from 'yargs/yargs';
import { Container } from 'typedi';
import { DeviceFarmManager } from './device-managers';
import logger from './logger';
import { Platform } from './types/Platform';

const appiumArgs = yargs(process.argv.slice(2)).argv;

(async () => {
  try {
    if (!appiumArgs['plugin-device-farm-platform']) {
      throw new Error('Specify --plugin-device-farm-platform as android,iOS or both');
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const platform = appiumArgs['plugin-device-farm-platform'].toLowerCase() as Platform;
    const includeSimulators = ((appiumArgs['plugin-device-farm-include-simulators'] || 'true') === 'true') as Boolean;
    const deviceManager = new DeviceFarmManager({
      platform,
      includeSimulators,
    });
    Container.set(DeviceFarmManager, deviceManager);
  } catch (e) {
    logger.error(e);
  }
})();

export { DevicePlugin } from './plugin';
