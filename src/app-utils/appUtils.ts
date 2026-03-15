import * as assert from 'node:assert';
import _ from 'lodash';
import B from 'bluebird';
import { fs, util, tempDir, zip, timing } from '@appium/support';
import { spawn } from 'child_process';
import log from '../logger';
const MACOS_RESOURCE_FOLDER = '__MACOSX';

export async function unzipStream(zipStream: any) {
  const tmpRoot = await tempDir.openDir();
  const bsdtarProcess = spawn(
    await fs.which('bsdtar'),
    ['-x', '--exclude', MACOS_RESOURCE_FOLDER, '--exclude', `${MACOS_RESOURCE_FOLDER}/*`, '-'],
    {
      cwd: tmpRoot,
    },
  );
  let archiveSize = 0;
  bsdtarProcess.stderr.on('data', (chunk) => {
    const stderr = chunk.toString();
    if (_.trim(stderr)) {
      log.warn(stderr);
    }
  });
  zipStream.on('data', (chunk: any) => {
    archiveSize += _.size(chunk);
  });
  zipStream.pipe(bsdtarProcess.stdin);
  try {
    await new B((resolve: any, reject: any) => {
      zipStream.once('error', reject);
      bsdtarProcess.once('exit', (code, signal) => {
        zipStream.unpipe(bsdtarProcess.stdin);
        log.debug(`bsdtar process exited with code ${code}, signal ${signal}`);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('Is it a valid ZIP archive?'));
        }
      });
      bsdtarProcess.once('error', (e) => {
        zipStream.unpipe(bsdtarProcess.stdin);
        reject(e);
      });
    });
  } catch (err: any) {
    bsdtarProcess.kill(9);
    await fs.rimraf(tmpRoot);
    throw new Error(`The response data cannot be unzipped: ${err.message}`);
  } finally {
    bsdtarProcess.removeAllListeners();
    zipStream.removeAllListeners();
  }
  return {
    rootDir: tmpRoot,
    archiveSize,
  };
}

export async function unzipApp(appPathOrZipStream: any, depth = 0) {
  const MAX_ARCHIVE_SCAN_DEPTH = 1;
  const APP_EXT = '.app';
  const IPA_EXT = '.ipa';
  const errMsg =
    `The archive did not have any matching ${APP_EXT} or ${IPA_EXT} ` +
    'bundles. Please make sure the provided package is valid and contains at least one matching ' +
    'application bundle which is not nested.';
  if (depth > MAX_ARCHIVE_SCAN_DEPTH) {
    throw new Error(errMsg);
  }

  const timer = new timing.Timer().start();
  let rootDir;
  let archiveSize;
  try {
    if (_.isString(appPathOrZipStream)) {
      ({ rootDir, archiveSize } = await unzipFile(appPathOrZipStream));
    } else {
      if (depth > 0) {
        assert.fail('Streaming unzip cannot be invoked for nested archive items');
      }
      ({ rootDir, archiveSize } = await unzipStream(appPathOrZipStream));
    }
  } catch (e: any) {
    log.debug(e.stack);
    throw new Error(`Cannot prepare the application for testing. Original error: ${e.message}`);
  }
  const secondsElapsed = timer.getDuration().asSeconds;
  log.info(
    `The file (${util.toReadableSizeString(archiveSize)}) ` +
      `has been ${_.isString(appPathOrZipStream) ? 'extracted' : 'downloaded and extracted'} ` +
      `to '${rootDir}' in ${secondsElapsed.toFixed(3)}s`,
  );
  if (secondsElapsed >= 1) {
    const bytesPerSec = Math.floor(archiveSize / secondsElapsed);
    log.debug(`Approximate decompression speed: ${util.toReadableSizeString(bytesPerSec)}/s`);
  }
  return rootDir;
}

export async function unzipFile(archivePath: any) {
  const useSystemUnzipEnv = process.env.APPIUM_PREFER_SYSTEM_UNZIP;
  const useSystemUnzip =
    _.isEmpty(useSystemUnzipEnv) || !['0', 'false'].includes(_.toLower(useSystemUnzipEnv));
  const tmpRoot = await tempDir.openDir();
  try {
    await zip.extractAllTo(archivePath, tmpRoot, { useSystemUnzip });
  } catch (e) {
    await fs.rimraf(tmpRoot);
    throw e;
  }
  return {
    rootDir: tmpRoot,
    archiveSize: (await fs.stat(archivePath)).size,
  };
}
