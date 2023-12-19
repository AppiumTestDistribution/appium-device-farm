import { ADTDatabase } from './db';

async function addNewPendingSession(capability: any) {
  ADTDatabase.instance().PendingSessionsModel.insert(capability);
}

async function removePendingSession(sessionCapabilityId: any) {
  ADTDatabase.instance().PendingSessionsModel.chain().find({ capability_id: sessionCapabilityId }).remove();
}

export { addNewPendingSession, removePendingSession };
