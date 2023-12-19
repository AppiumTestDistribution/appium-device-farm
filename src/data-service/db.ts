import log from '../logger';
import loki from 'lokijs';

// database class singleton
export class ADTDatabase {
    private static _instance: ADTDatabase;
    private _dbList: {dbname: string, db: loki}[] = [];

    get DeviceModel() { return ADTDatabase.getDeviceModel(); }
    get PendingSessionsModel() { return ADTDatabase.getPendingSessionsModel(); }
    get CLIArgs() { return ADTDatabase.getCLIArgs(); }
    get db() { return ADTDatabase.getDB(); }

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

    private static getDeviceModel() {
        return ADTDatabase.getDB().addCollection('devices');
    }

    private static getPendingSessionsModel() {
        return ADTDatabase.getDB().addCollection('pending-sessions');
    }

    private static getCLIArgs() {
        return ADTDatabase.getDB().addCollection('cliArgs');
    }

    private static getDB() {
        const existingDb = ADTDatabase.instance()._dbList.find((db) => db.dbname === ADTDatabase.dbname());

        if (existingDb) return existingDb.db;

        log.debug(`Creating new database: ${ADTDatabase.dbname()}`);
        
        const db = new loki(ADTDatabase.dbname(), {
            autoload: true,
            autosave: true,
            autosaveInterval: 4000,
        });

        db.on('error', (err) => {
            log.error(`Error in database: ${err}`);
        }
        );

        db.on('loaded', () => {
            log.info('Database loaded');
        });

        db.on('flushChanges', () => {
            log.info('Database changes flushed');
        });

        db.on('close', () => {
            log.info('Database closed');
        });

        db.loadDatabase({}, (err) => {
            if (err) log.error(`Error loading database: ${err}`);
        });

        ADTDatabase.instance()._dbList.push({dbname: ADTDatabase.dbname(), db});

        return db;
    }
}
