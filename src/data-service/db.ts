import log from '../logger';
import loki from 'lokijs';

// database class singleton
export class ATDRepository {
  private static _instance: ATDRepository;
  private _dbList: { dbname: string; db: loki }[] = [];

  static get DeviceModel() {
    return ATDRepository.getDeviceModel();
  }
  static get PendingSessionsModel() {
    return ATDRepository.getPendingSessionsModel();
  }
  static get CLIArgs() {
    return ATDRepository.getCLIArgs();
  }
  static get db() {
    return ATDRepository.getDB();
  }

  private constructor() {
    log.info('Initializing database');
    ATDRepository._instance = this;
  }

  public static instance() {
    return ATDRepository._instance || new ATDRepository();
  }

  private static dbname() {
    const appium_home = process.env.APPIUM_HOME || './temp-appium';
    // log.debug(`Using database file: ${appium_home}/db.json`);
    return `${appium_home}/db.json`;
  }

  private static async getDeviceModel() {
    return (await ATDRepository.getDB()).addCollection('devices');
  }

  private static async getPendingSessionsModel() {
    return (await ATDRepository.getDB()).addCollection('pending-sessions');
  }

  private static async getCLIArgs() {
    return (await ATDRepository.getDB()).addCollection('cliArgs');
  }

  private static initCollections(db: loki) {
    db.addCollection('devices');
    db.addCollection('pending-sessions');
    db.addCollection('cliArgs');
  }

  private static async getDB() {
    const existingDb = ATDRepository.instance()._dbList.find(
      (db) => db.dbname === ATDRepository.dbname(),
    );

    if (existingDb) return existingDb.db;

    log.debug(`Creating new database: ${ATDRepository.dbname()}`);

    const db = await new Promise<loki>((resolve, reject) => {
      const db = new loki(ATDRepository.dbname(), {
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
        ATDRepository.initCollections(db);
        resolve(db);
      });

      db.on('flushChanges', () => {
        log.info('Database changes flushed');
      });

      db.on('close', () => {
        log.info('Database closed');
      });
    });

    ATDRepository.instance()._dbList.push({ dbname: ATDRepository.dbname(), db });

    return db;
  }
}
