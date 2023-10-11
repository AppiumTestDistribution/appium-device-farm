import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';

const SCREENSHOT_DIRECTORY = 'screenshots';
const VIDEO_DIRECTORY = 'video';

export function prepareDirectory(sessionId: string) {
  [SCREENSHOT_DIRECTORY, VIDEO_DIRECTORY].forEach((folder) => {
    fs.mkdirSync(path.join(config.sessionAssetsPath, sessionId, folder), { recursive: true });
  });
}

export function saveScreenShot(sessionId: string, screenshotBase64String: string) {
  const assetPath = path.join(sessionId, SCREENSHOT_DIRECTORY, `${uuidv4()}.jpg`);
  fs.writeFileSync(
    path.join(config.sessionAssetsPath, assetPath),
    screenshotBase64String,
    'base64'
  );
  return assetPath;
}

export function saveVideoRecording(sessionId: string, videoBase64String: string) {
  const assetPath = path.join(sessionId, VIDEO_DIRECTORY, `${sessionId}.mp4`);
  fs.writeFileSync(path.join(config.sessionAssetsPath, assetPath), videoBase64String, 'base64');
  return assetPath;
}
