import _ from 'lodash';
import path from 'path';
import { plist, fs, tempDir, zip } from 'appium/support';
import { LRUCache } from 'lru-cache';
import B from 'bluebird';

/** @type {LRUCache<string, import('@appium/types').StringRecord>} */
const MANIFEST_CACHE = new LRUCache({
  max: 40,
  updateAgeOnHas: true,
});
const MANIFEST_FILE_NAME = 'Info.plist';
const IPA_ROOT_PLIST_PATH_PATTERN = new RegExp(
  `^Payload/[^./]+\\.app/${_.escapeRegExp(MANIFEST_FILE_NAME)}$`,
);
const MAX_MANIFEST_SIZE = 1024 * 1024; // 1 MiB

export default class AppInfosCache {
  private log: any;

  constructor(log: any) {
    this.log = log;
  }

  async extractManifestProperty(bundlePath: any, propertyName: any) {
    const result = (await this.put(bundlePath))[propertyName];
    this.log.debug(`${propertyName}: ${JSON.stringify(result)}`);
    return result;
  }

  async extractBundleId(bundlePath: any) {
    return await this.extractManifestProperty(bundlePath, 'CFBundleIdentifier');
  }

  async extractBundleVersion(bundlePath: any) {
    return await this.extractManifestProperty(bundlePath, 'CFBundleVersion');
  }

  async extractAppPlatforms(bundlePath: any) {
    const result = await this.extractManifestProperty(bundlePath, 'CFBundleSupportedPlatforms');
    if (!Array.isArray(result)) {
      throw new Error(
        `${path.basename(bundlePath)}': CFBundleSupportedPlatforms is not a valid list`,
      );
    }
    return result;
  }

  async extractExecutableName(bundlePath: any) {
    return await this.extractManifestProperty(bundlePath, 'CFBundleExecutable');
  }

  async put(bundlePath: any) {
    return (await fs.stat(bundlePath)).isFile()
      ? await this._putIpa(bundlePath)
      : await this._putApp(bundlePath);
  }

  async _putIpa(ipaPath: any) {
    let manifestPayload;
    let lastError;
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await zip.readEntries(ipaPath, async ({ entry, extractEntryTo }) => {
        if (!IPA_ROOT_PLIST_PATH_PATTERN.test(entry.fileName)) {
          return true;
        }

        const hash = `${entry.crc32}`;
        if (MANIFEST_CACHE.has(hash)) {
          manifestPayload = MANIFEST_CACHE.get(hash);
          return false;
        }
        const tmpRoot = await tempDir.openDir();
        try {
          await extractEntryTo(tmpRoot);
          const plistPath = path.resolve(tmpRoot, entry.fileName);
          manifestPayload = await this._readPlist(plistPath, ipaPath);
          if (_.isPlainObject(manifestPayload) && entry.uncompressedSize <= MAX_MANIFEST_SIZE) {
            this.log.debug(
              `Caching the manifest '${entry.fileName}' for ${manifestPayload?.CFBundleIdentifier} app ` +
                `from the compressed source using the key '${hash}'`,
            );
            MANIFEST_CACHE.set(hash, manifestPayload);
          }
        } catch (e: any) {
          this.log.debug(e.stack);
          lastError = e;
        } finally {
          await fs.rimraf(tmpRoot);
        }
        return false;
      });
    } catch (e: any) {
      this.log.debug(e.stack);
      throw new Error(
        `Cannot find ${MANIFEST_FILE_NAME} in '${ipaPath}'. Is it a valid application bundle?`,
      );
    }
    if (!manifestPayload) {
      let errorMessage = `Cannot extract ${MANIFEST_FILE_NAME} from '${ipaPath}'. Is it a valid application bundle?`;
      if (lastError) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        errorMessage += ` Original error: ${lastError.message}`;
      }
      throw new Error(errorMessage);
    }
    return manifestPayload;
  }

  async _putApp(appPath: any) {
    const manifestPath = path.join(appPath, MANIFEST_FILE_NAME);
    const hash = await fs.hash(manifestPath);
    if (MANIFEST_CACHE.has(hash)) {
      return MANIFEST_CACHE.get(hash);
    }
    const [payload, stat] = await B.all([
      this._readPlist(manifestPath, appPath),
      fs.stat(manifestPath),
    ]);
    if (stat.size <= MAX_MANIFEST_SIZE && _.isPlainObject(payload)) {
      this.log.debug(
        `Caching the manifest for ${payload.CFBundleIdentifier} app from a file source using the key '${hash}'`,
      );
      MANIFEST_CACHE.set(hash, payload);
    }
    return payload;
  }

  async _readPlist(plistPath: any, bundlePath: any) {
    try {
      return await plist.parsePlistFile(plistPath);
    } catch (e: any) {
      this.log.debug(e.stack);
      throw new Error(
        `Cannot parse ${MANIFEST_FILE_NAME} of '${bundlePath}'. Is it a valid application bundle?`,
      );
    }
  }
}
