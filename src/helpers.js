import os from 'os';
import path from 'path';

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function isMac() {
  return os.type() === 'Darwin';
}

export function checkIfPathIsAbsolute(configPath) {
  return path.isAbsolute(configPath);
}