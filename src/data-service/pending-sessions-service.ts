import { ADTDatabase } from './db';

async function addNewPendingSession(capability: any) {
  (await ADTDatabase.PendingSessionsModel).insert(capability);
}

async function removePendingSession(sessionCapabilityId: any) {
  (await ADTDatabase.PendingSessionsModel)
    .chain()
    .find({ capability_id: sessionCapabilityId })
    .remove();
}

export { addNewPendingSession, removePendingSession };
