import loki from "lokijs";

const db = new loki("db.json");
const DeviceModel = db.addCollection("devices");
const PendingSessionsModel = db.addCollection("pending-sessions");

export { DeviceModel, PendingSessionsModel };
