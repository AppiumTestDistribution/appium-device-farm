import fs from 'fs';

import archiver from 'archiver';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppInfosCache from './appInfoIOS';
import log from '../logger';
import path from 'path';
import os from 'os';

function getFilePath(fileName: string) {
  return path.join(os.homedir(), '.cache', 'appium-device-farm', 'assets', fileName);
}
const ipaPath = getFilePath('wda-resign.ipa');
const zipPath = getFilePath('wda-resign.zip');

async function createZip() {
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', {
    zlib: { level: 2 },
  });

  archive.pipe(output);
  archive.file(ipaPath, { name: 'wdiodemoapp.ipa' });

  const archiveFinalizePromise = new Promise<void>((resolve, reject) => {
    output.on('close', function () {
      console.log(archive.pointer() + ' total bytes');
      console.log('Archiver has been finalized and the output file descriptor has closed.');
      resolve();
    });

    archive.on('error', function (err) {
      reject(err);
    });
  });

  await archive.finalize();

  return archiveFinalizePromise;
}

export default async function getWDABundleID() {
  await createZip();
  const cache = new AppInfosCache(log);
  const info = await cache.put(ipaPath);
  return await info.CFBundleIdentifier;
}
