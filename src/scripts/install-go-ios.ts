// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import unzipper from 'unzipper';
import fs from 'fs';
import download from 'download';
import { cachePath, isMac } from '../helpers';
import { waitUntil } from 'async-wait-until';
const basePath = cachePath('goIOS');

function goIOSZipExists(platform: string) {
  return fs.existsSync(`${basePath}/go-ios-${platform}.zip`);
}

async function main() {
  const platform = isMac() ? 'mac' : 'linux';
  const source = `https://github.com/danielpaulus/go-ios/releases/download/v1.0.118/go-ios-${platform}.zip`;

  if (!fs.existsSync(basePath) || !goIOSZipExists(platform)) {
    console.log('goIOS not found, downloading..');
    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
    const path = `${basePath}`;
    await download(source, path);
    await unzipgoIOS(platform);
    await setExecutePermission();
  } else {
    if (fs.existsSync(`${basePath}/ios`)) {
      console.log('go-IOS is already downloaded');
    } else if (goIOSZipExists(platform)) {
      unzipgoIOS();
    }
  }
}

(async () => await main())();
function unzipgoIOS(platform) {
  fs.createReadStream(`${basePath}/go-ios-${platform}.zip`).pipe(
    unzipper.Extract({ path: `${basePath}/` }),
  );
}

async function setExecutePermission() {
  await waitUntil(() => fs.existsSync(`${basePath}/ios`));
  fs.chmod(`${basePath}/ios`, 0o775, (error) => {
    if (error) {
      console.log(error);
      return;
    }
    console.log('Permissions are changed for the file!');
  });
}
