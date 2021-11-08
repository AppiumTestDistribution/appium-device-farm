import { PendingSessionsModel } from './db';

async function addNewPendingSession(capability: any) {
  PendingSessionsModel.insert(capability);
}

async function removePendingSession(sessionCapabilityId: any) {
  PendingSessionsModel.chain().find({ capability_id: sessionCapabilityId }).remove();
}

export { addNewPendingSession, removePendingSession };
