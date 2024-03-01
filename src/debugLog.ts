import { format } from 'util';

export default function debugLog(message: any, ...args: any) {
  if (process.env.DEVICE_FARM_DEBUG) {
    const formattedMessage = format(message, ...args);
    console.log('************************************');
    console.debug(`[DEBUG] ${formattedMessage}`);
    console.log('************************************');
  }
}
