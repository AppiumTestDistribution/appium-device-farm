import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';
import log from '../logger';
const SCREENSHOT_DIRECTORY = 'screenshots';
const VIDEO_DIRECTORY = 'video';

export function prepareDirectory(sessionId: string) {
  [SCREENSHOT_DIRECTORY, VIDEO_DIRECTORY].forEach((folder) => {
    const folderPath = path.join(config.sessionAssetsPath, sessionId, folder);
    fs.mkdirSync(folderPath, { recursive: true });
  });
}

function createAssetFile(filePath: string, content: any, encoding?: BufferEncoding) {
  try {
    if (fs.existsSync(filePath)) {
      return;
    }

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, content, encoding);
  } catch (err) {
    log.error(`Unable to create asset file ${filePath}`);
    log.error(err);
  }
}

export function saveScreenShot(sessionId: string, screenshotBase64String: string): string {
  const assetPath = path.join(sessionId, SCREENSHOT_DIRECTORY, `${uuidv4()}.jpg`);
  const filePath = path.join(config.sessionAssetsPath, assetPath);
  createAssetFile(filePath, screenshotBase64String, 'base64');
  return assetPath;
}

export function saveVideoRecording(sessionId: string, videoBase64String: string) {
  const assetPath = path.join(sessionId, VIDEO_DIRECTORY, `${sessionId}.mp4`);
  const filePath = path.join(config.sessionAssetsPath, assetPath);
  createAssetFile(filePath, videoBase64String, 'base64');
  return assetPath;
}

export function saveDeviceLogs(sessionId: string, logContent: string[]) {
  const assetPath = path.join(sessionId, 'device_log.json');
  const filePath = path.join(config.sessionAssetsPath, assetPath);
  createAssetFile(filePath, JSON.stringify(logContent));
  return assetPath;
}

export function saveProflingLog(
  sessionId: string,
  logContent: { device_info: any; profiling_log: any[] },
) {
  const assetPath = path.join(sessionId, 'profiling.json');
  const filePath = path.join(config.sessionAssetsPath, assetPath);
  createAssetFile(filePath, JSON.stringify(logContent));
  return assetPath;
}
