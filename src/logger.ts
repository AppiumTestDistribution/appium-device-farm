import { logger } from '@appium/support';
const which_appium = process.env.APPIUM_HOME || 'main';
const log = logger.getLogger(`device-farm-${which_appium}`);
export default log;
