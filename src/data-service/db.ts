import log from '../logger';
import loki from 'lokijs';

// database class singleton
export class ADTDatabase {
  private static _instance: ADTDatabase;
  private _dbList: { dbname: string; db: loki }[] = [];

  static get DeviceModel() {
    return ADTDatabase.getDeviceModel();
  }
  static get PendingSessionsModel() {
    return ADTDatabase.getPendingSessionsModel();
  }
  static get CLIArgs() {
    return ADTDatabase.getCLIArgs();
  }
  static get db() {
    return ADTDatabase.getDB();
  }

  private constructor() {
    log.info('Initializing database');
    ADTDatabase._instance = this;
  }

  public static instance() {
    return ADTDatabase._instance || new ADTDatabase();
  }

  private static dbname() {
    const appium_home = process.env.APPIUM_HOME || './temp-appium';
    // log.debug(`Using database file: ${appium_home}/db.json`);
    return `${appium_home}/db.json`;
  }

  private static async getDeviceModel() {
    return (await ADTDatabase.getDB()).addCollection('devices');
  }

  private static async getPendingSessionsModel() {
    return (await ADTDatabase.getDB()).addCollection('pending-sessions');
  }

  private static async getCLIArgs() {
    return (await ADTDatabase.getDB()).addCollection('cliArgs');
  }

  private static initCollections(db: loki) {
    db.addCollection('devices');
    db.addCollection('pending-sessions');
    db.addCollection('cliArgs');
  }

  private static async getDB() {
    const existingDb = ADTDatabase.instance()._dbList.find(
      (db) => db.dbname === ADTDatabase.dbname(),
    );

    if (existingDb) return existingDb.db;

    log.debug(`Creating new database: ${ADTDatabase.dbname()}`);

    const db = await new Promise<loki>((resolve, reject) => {
      const db = new loki(ADTDatabase.dbname(), {
        autoload: true,
      });

      db.on('autoload', () => {
        log.info('Database autoloaded');
      });

      db.on('error', (err) => {
        log.error(`Error in database: ${err}`);
        reject(err);
      });

      db.on('loaded', () => {
        log.info('Database loaded');
        ADTDatabase.initCollections(db);
        resolve(db);
      });

      db.on('flushChanges', () => {
        log.info('Database changes flushed');
      });

      db.on('close', () => {
        log.info('Database closed');
      });
    });

    ADTDatabase.instance()._dbList.push({ dbname: ADTDatabase.dbname(), db });

    return db;
  }
}
