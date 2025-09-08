import { ADB } from 'appium-adb';
import log from '../logger';

/**
 * Singleton ADB Manager to prevent multiple ADB instances
 * This ensures only one ADB instance per host machine
 */
export class ADBManager {
  private static instance: ADBManager;
  private adbInstance: ADB | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<ADB> | null = null;

  private constructor() {}

  /**
   * Get the singleton instance of ADBManager
   */
  public static getInstance(): ADBManager {
    if (!ADBManager.instance) {
      ADBManager.instance = new ADBManager();
    }
    return ADBManager.instance;
  }

  /**
   * Initialize ADB instance with configuration
   * @param options ADB configuration options
   * @returns Promise<ADB> The initialized ADB instance
   */
  public async initialize(options: { adbExecTimeout?: number; udid?: string } = {}): Promise<ADB> {
    // If already initialized, return existing instance
    if (this.isInitialized && this.adbInstance) {
      log.debug('ADB instance already initialized, returning existing instance');
      return this.adbInstance;
    }

    // If initialization is in progress, wait for it
    if (this.initializationPromise) {
      log.debug('ADB initialization in progress, waiting for completion');
      return await this.initializationPromise;
    }

    // Start initialization
    this.initializationPromise = this._createADBInstance(options);

    try {
      this.adbInstance = await this.initializationPromise;
      this.isInitialized = true;
      log.info('ADB instance initialized successfully');
      return this.adbInstance;
    } catch (error) {
      log.error(`Failed to initialize ADB instance: ${error}`);
      this.initializationPromise = null;
      throw error;
    }
  }

  /**
   * Get the current ADB instance
   * @returns ADB instance or null if not initialized
   */
  public getADBInstance(): ADB | null {
    return this.adbInstance;
  }

  /**
   * Check if ADB is initialized
   * @returns boolean indicating initialization status
   */
  public isADBInitialized(): boolean {
    return this.isInitialized && this.adbInstance !== null;
  }

  /**
   * Reset the ADB instance (for testing or cleanup)
   */
  public async reset(): Promise<void> {
    if (this.adbInstance) {
      try {
        // Cleanup any existing ADB instance
        log.info('Resetting ADB instance');
        this.adbInstance = null;
        this.isInitialized = false;
        this.initializationPromise = null;
      } catch (error) {
        log.error(`Error resetting ADB instance: ${error}`);
      }
    }
  }

  /**
   * Create ADB instance with proper error handling
   * @param options ADB configuration options
   * @returns Promise<ADB> The created ADB instance
   */
  private async _createADBInstance(
    options: { adbExecTimeout?: number; udid?: string } = {},
  ): Promise<ADB> {
    const defaultOptions = {
      adbExecTimeout: 60000,
      ...options,
    };

    log.info(`Creating ADB instance with options: ${JSON.stringify(defaultOptions)}`);

    try {
      const adb = await ADB.createADB(defaultOptions);
      log.info('ADB instance created successfully');
      return adb;
    } catch (error) {
      log.error(`Failed to create ADB instance: ${error}`);
      throw new Error(`ADB initialization failed: ${error}`);
    }
  }

  /**
   * Get ADB instance for specific device operations
   * This method ensures we reuse the singleton instance
   * @param udid Optional device UDID for device-specific operations
   * @returns Promise<ADB> The ADB instance
   */
  public async getADBForDevice(udid?: string): Promise<ADB> {
    if (!this.isADBInitialized()) {
      await this.initialize({ udid });
    }

    if (!this.adbInstance) {
      throw new Error('ADB instance not available');
    }

    return this.adbInstance;
  }
}

/**
 * Global ADB Manager instance
 * Use this throughout the application to access ADB functionality
 */
export const adbManager = ADBManager.getInstance();

/**
 * Convenience function to get ADB instance
 * @param options ADB configuration options
 * @returns Promise<ADB> The ADB instance
 */
export async function getADBInstance(
  options: { adbExecTimeout?: number; udid?: string } = {},
): Promise<ADB> {
  return await adbManager.getADBForDevice(options.udid);
}

/**
 * Convenience function to get existing ADB instance (without initialization)
 * @returns ADB instance or null if not initialized
 */
export function getExistingADBInstance(): ADB | null {
  return adbManager.getADBInstance();
}
