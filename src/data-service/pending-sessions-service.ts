import { ATDRepository } from './db';

async function addNewPendingSession(capability: any) {
  (await ATDRepository.PendingSessionsModel).insert(capability);
}

async function removePendingSession(sessionCapabilityId: any) {
  (await ATDRepository.PendingSessionsModel)
    .chain()
    .find({ capability_id: sessionCapabilityId })
    .remove();
}

export { addNewPendingSession, removePendingSession };
