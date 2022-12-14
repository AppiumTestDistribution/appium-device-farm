import loki from 'lokijs';

const db = new loki('db.json');
const DeviceModel = db.addCollection('devices');
const PendingSessionsModel = db.addCollection('pending-sessions');
const CLIArgs = db.addCollection('cliArgs');

export { DeviceModel, PendingSessionsModel, CLIArgs };
