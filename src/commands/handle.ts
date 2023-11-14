import { updateCmdExecutedTime } from '../data-service/device-service';
import logger from '../logger';

export default async function handle(
  next: () => any,
  driver: any,
  commandName: string,
  ...args: any
) {
  logger.info(`Received ${commandName} request on driver - ${JSON.stringify(driver)}`);
  updateCmdExecutedTime(driver.sessionId);
  return await next();
}
