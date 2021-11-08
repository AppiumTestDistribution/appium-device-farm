import { isMac, checkIfPathIsAbsolute } from './helpers';
import { ServerCLI } from './types/CLIArgs';

export const getDeviceTypeFromApp = (app: string) => {
  return app.endsWith('app') || app.endsWith('zip') ? 'simulator' : 'real';
};

export function isAndroid(cliArgs: ServerCLI) {
  return cliArgs.Platform.toLowerCase() === 'android';
}

export function isIOS(cliArgs: ServerCLI) {
  return isMac() && cliArgs.Platform.toLowerCase() === 'ios';
}

export function isAndroidAndIOS(cliArgs: ServerCLI) {
  return isMac() && cliArgs.Platform.toLowerCase() === 'both';
}

export function isDeviceConfigPathAbsolute(path: string) {
  if (checkIfPathIsAbsolute(path)) {
    return true;
  } else {
    throw new Error(`Device Config Path ${path} should be absolute`);
  }
}
