import loki from 'lokijs';

const db = new loki('', {
  persistenceMethod: 'memory',
  autosave: false,
});
const DeviceModel = db.addCollection('devices');
const PendingSessionsModel = db.addCollection('pending-sessions');
const CLIArgs = db.addCollection('cliArgs');

export { DeviceModel, PendingSessionsModel, CLIArgs, db };
