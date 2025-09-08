import { ADB } from 'appium-adb';
import log from '../logger';

/**
 * Enhanced ADB Manager for Hub-Node Architecture
 *
 * This manager handles the complexity of ADB instances in distributed environments:
 * - Local ADB instances for local device operations
 * - Remote ADB instances for remote device operations
 * - Connection pooling and management
 * - Proper cleanup and error handling
 */

export interface ADBOptions {
  adbExecTimeout?: number;
  udid?: string;
  remoteAdbHost?: string;
  adbPort?: number;
}

export interface ADBContext {
  type: 'local' | 'remote' | 'device-specific';
  host?: string;
  port?: number;
  deviceId?: string;
}

export class EnhancedADBManager {
  private static instance: EnhancedADBManager;
  private localADB: ADB | null = null;
  private remoteADBCache: Map<string, ADB> = new Map();
  private deviceSpecificADBs: Map<string, ADB> = new Map();
  private isInitialized = false;
  private initializationPromise: Promise<ADB> | null = null;
  private maxRemoteInstances = 10;
  private maxDeviceSpecificInstances = 5;
  private connectionTimeouts: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {}

  /**
   * Get the singleton instance of EnhancedADBManager
   */
  public static getInstance(): EnhancedADBManager {
    if (!EnhancedADBManager.instance) {
      EnhancedADBManager.instance = new EnhancedADBManager();
    }
    return EnhancedADBManager.instance;
  }

  /**
   * Initialize local ADB instance
   */
  public async initializeLocalADB(options: { adbExecTimeout?: number } = {}): Promise<ADB> {
    if (this.localADB) {
      return this.localADB;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._createLocalADBInstance(options);

    try {
      this.localADB = await this.initializationPromise;
      this.isInitialized = true;
      log.info('Local ADB instance initialized successfully');
      return this.localADB;
    } catch (error) {
      this.initializationPromise = null;
      log.error(`Failed to initialize local ADB instance: ${error}`);
      throw error;
    }
  }

  /**
   * Get ADB instance based on context
   */
  public async getADBForContext(context: ADBContext, options: ADBOptions = {}): Promise<ADB> {
    switch (context.type) {
      case 'local':
        return this.getLocalADB(options);
      case 'remote':
        if (!context.host || !context.port) {
          throw new Error('Remote context requires host and port');
        }
        return this.getRemoteADB(context.host, context.port, options);
      case 'device-specific':
        if (!context.deviceId) {
          throw new Error('Device-specific context requires deviceId');
        }
        return this.getDeviceSpecificADB(context.deviceId, options);
      default:
        throw new Error(`Unknown ADB context type: ${context.type}`);
    }
  }

  /**
   * Get local ADB instance
   */
  public async getLocalADB(options: ADBOptions = {}): Promise<ADB> {
    if (!this.localADB) {
      await this.initializeLocalADB(options);
    }
    return this.localADB!;
  }

  /**
   * Get remote ADB instance
   */
  public async getRemoteADB(host: string, port: number, options: ADBOptions = {}): Promise<ADB> {
    const key = `${host}:${port}`;

    // Check if we already have this remote ADB instance
    if (this.remoteADBCache.has(key)) {
      const adb = this.remoteADBCache.get(key)!;
      this._refreshConnectionTimeout(key);
      return adb;
    }

    // Implement LRU cache for remote ADB instances
    if (this.remoteADBCache.size >= this.maxRemoteInstances) {
      const firstKey = this.remoteADBCache.keys().next().value;
      if (firstKey) {
        await this._cleanupRemoteADB(firstKey);
      }
    }

    try {
      const adb = await ADB.createADB({
        adbExecTimeout: options.adbExecTimeout || 60000,
        remoteAdbHost: host,
        adbPort: port,
      });

      this.remoteADBCache.set(key, adb);
      this._refreshConnectionTimeout(key);

      log.info(`Remote ADB instance created for ${key}`);
      return adb;
    } catch (error) {
      log.error(`Failed to create remote ADB instance for ${key}: ${error}`);
      throw error;
    }
  }

  /**
   * Get device-specific ADB instance
   */
  public async getDeviceSpecificADB(deviceId: string, options: ADBOptions = {}): Promise<ADB> {
    if (this.deviceSpecificADBs.has(deviceId)) {
      return this.deviceSpecificADBs.get(deviceId)!;
    }

    // Implement LRU cache for device-specific ADB instances
    if (this.deviceSpecificADBs.size >= this.maxDeviceSpecificInstances) {
      const firstKey = this.deviceSpecificADBs.keys().next().value;
      if (firstKey) {
        await this._cleanupDeviceSpecificADB(firstKey);
      }
    }

    try {
      const adb = await ADB.createADB({
        adbExecTimeout: options.adbExecTimeout || 60000,
        udid: deviceId,
      });

      this.deviceSpecificADBs.set(deviceId, adb);
      log.info(`Device-specific ADB instance created for ${deviceId}`);
      return adb;
    } catch (error) {
      log.error(`Failed to create device-specific ADB instance for ${deviceId}: ${error}`);
      throw error;
    }
  }

  /**
   * Get ADB instance for device operations (backward compatibility)
   */
  public async getADBForDevice(udid?: string, options: ADBOptions = {}): Promise<ADB> {
    if (udid) {
      return this.getDeviceSpecificADB(udid, options);
    }
    return this.getLocalADB(options);
  }

  /**
   * Check if local ADB is initialized
   */
  public isLocalADBInitialized(): boolean {
    return this.isInitialized && this.localADB !== null;
  }

  /**
   * Get local ADB instance (synchronous)
   */
  public getLocalADBInstance(): ADB | null {
    return this.localADB;
  }

  /**
   * Get all active ADB instances
   */
  public getActiveADBInstances(): {
    local: ADB | null;
    remote: string[];
    deviceSpecific: string[];
  } {
    return {
      local: this.localADB,
      remote: Array.from(this.remoteADBCache.keys()),
      deviceSpecific: Array.from(this.deviceSpecificADBs.keys()),
    };
  }

  /**
   * Cleanup all ADB instances
   */
  public async cleanup(): Promise<void> {
    log.info('Cleaning up all ADB instances...');

    // Clear connection timeouts
    this.connectionTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.connectionTimeouts.clear();

    // Cleanup local ADB
    if (this.localADB) {
      // ADB cleanup logic if needed
      this.localADB = null;
    }

    // Cleanup remote ADBs
    for (const key of this.remoteADBCache.keys()) {
      await this._cleanupRemoteADB(key);
    }

    // Cleanup device-specific ADBs
    for (const deviceId of this.deviceSpecificADBs.keys()) {
      await this._cleanupDeviceSpecificADB(deviceId);
    }

    this.isInitialized = false;
    this.initializationPromise = null;

    log.info('ADB cleanup completed');
  }

  /**
   * Reset the manager (for testing)
   */
  public async reset(): Promise<void> {
    await this.cleanup();
    EnhancedADBManager.instance = undefined as any;
  }

  /**
   * Create local ADB instance
   */
  private async _createLocalADBInstance(options: { adbExecTimeout?: number }): Promise<ADB> {
    const defaultOptions = {
      adbExecTimeout: 60000,
      ...options,
    };

    log.info(`Creating local ADB instance with options: ${JSON.stringify(defaultOptions)}`);

    try {
      const adb = await ADB.createADB(defaultOptions);
      log.info('Local ADB instance created successfully');
      return adb;
    } catch (error) {
      log.error(`Failed to create local ADB instance: ${error}`);
      throw error;
    }
  }

  /**
   * Cleanup remote ADB instance
   */
  private async _cleanupRemoteADB(key: string): Promise<void> {
    const adb = this.remoteADBCache.get(key);
    if (adb) {
      // ADB cleanup logic if needed
      this.remoteADBCache.delete(key);
      log.info(`Remote ADB instance cleaned up: ${key}`);
    }
  }

  /**
   * Cleanup device-specific ADB instance
   */
  private async _cleanupDeviceSpecificADB(deviceId: string): Promise<void> {
    const adb = this.deviceSpecificADBs.get(deviceId);
    if (adb) {
      // ADB cleanup logic if needed
      this.deviceSpecificADBs.delete(deviceId);
      log.info(`Device-specific ADB instance cleaned up: ${deviceId}`);
    }
  }

  /**
   * Refresh connection timeout for remote ADB
   */
  private _refreshConnectionTimeout(key: string): void {
    // Clear existing timeout
    const existingTimeout = this.connectionTimeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout (5 minutes)
    const timeout = setTimeout(
      async () => {
        await this._cleanupRemoteADB(key);
        this.connectionTimeouts.delete(key);
      },
      5 * 60 * 1000,
    );

    this.connectionTimeouts.set(key, timeout);
  }
}

// Export singleton instance
export const enhancedADBManager = EnhancedADBManager.getInstance();

// Export convenience functions
export async function getLocalADBInstance(options: ADBOptions = {}): Promise<ADB> {
  return await enhancedADBManager.getLocalADB(options);
}

export async function getRemoteADBInstance(
  host: string,
  port: number,
  options: ADBOptions = {},
): Promise<ADB> {
  return await enhancedADBManager.getRemoteADB(host, port, options);
}

export async function getDeviceSpecificADBInstance(
  deviceId: string,
  options: ADBOptions = {},
): Promise<ADB> {
  return await enhancedADBManager.getDeviceSpecificADB(deviceId, options);
}

export async function getADBForContext(
  context: ADBContext,
  options: ADBOptions = {},
): Promise<ADB> {
  return await enhancedADBManager.getADBForContext(context, options);
}

export function getEnhancedADBManager(): EnhancedADBManager {
  return enhancedADBManager;
}
