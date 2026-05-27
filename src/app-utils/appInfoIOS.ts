import _ from 'lodash';
import path from 'path';
import { plist, fs, tempDir, zip } from 'appium/support';
import { LRUCache } from 'lru-cache';
import B from 'bluebird';
import type { StringRecord } from '@appium/types';

type IOSManifestPayload = StringRecord<unknown> & {
  CFBundleIdentifier?: string;
  CFBundleVersion?: string;
  CFBundleSupportedPlatforms?: string[];
  CFBundleExecutable?: string;
};

const MANIFEST_CACHE = new LRUCache<string, IOSManifestPayload>({
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

  async extractManifestProperty(bundlePath: any, propertyName: string) {
    const manifest = await this.put(bundlePath);
    const result = manifest[propertyName];
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

  async put(bundlePath: any): Promise<IOSManifestPayload> {
    return (await fs.stat(bundlePath)).isFile()
      ? await this._putIpa(bundlePath)
      : await this._putApp(bundlePath);
  }

  async _putIpa(ipaPath: any): Promise<IOSManifestPayload> {
    let manifestPayload: IOSManifestPayload | undefined;
    let lastError;
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await zip.readEntries(ipaPath, async ({ entry, extractEntryTo }) => {
        if (!IPA_ROOT_PLIST_PATH_PATTERN.test(entry.fileName)) {
          return true;
        }

        const hash = `${entry.crc32}`;
        const cachedManifest = MANIFEST_CACHE.get(hash);
        if (cachedManifest !== undefined) {
          manifestPayload = cachedManifest;
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

  async _putApp(appPath: any): Promise<IOSManifestPayload> {
    const manifestPath = path.join(appPath, MANIFEST_FILE_NAME);
    const hash = await fs.hash(manifestPath);
    const cachedManifest = MANIFEST_CACHE.get(hash);
    if (cachedManifest !== undefined) {
      return cachedManifest;
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

  async _readPlist(plistPath: any, bundlePath: any): Promise<IOSManifestPayload> {
    try {
      return (await plist.parsePlistFile(plistPath)) as IOSManifestPayload;
    } catch (e: any) {
      this.log.debug(e.stack);
      throw new Error(
        `Cannot parse ${MANIFEST_FILE_NAME} of '${bundlePath}'. Is it a valid application bundle?`,
      );
    }
  }
}
