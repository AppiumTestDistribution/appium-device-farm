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

export async function waitFor(
  condition,
  retryInterval = 300,
  retryTimeout = 60000,
  message
) {
  if (!retryTimeout) {
    return;
  }
  var start = new Date().getTime();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let actualError;
    try {
      if (await condition()) {
        break;
      }
      console.log('====================================');
      console.log('Condition unsatisfied so waiting');
      console.log('====================================');
    } catch (e) {
      if (e.message.match(/Browser process with pid \d+ exited with/)) {
        throw e;
      }
      actualError = e;
    }
    if (new Date().getTime() - start > retryTimeout) {
      if (!actualError) {
        actualError = new Error(
          message || `waiting failed: retryTimeout ${retryTimeout}ms exceeded`
        );
      }
      throw actualError;
    }
    sleep(retryInterval);
  }

  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if (new Date().getTime() - start > milliseconds) {
        break;
      }
    }
  }
}
