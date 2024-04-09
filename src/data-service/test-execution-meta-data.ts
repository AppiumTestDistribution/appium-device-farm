import { prisma } from '../prisma';
import log from '../logger';

async function createTestEventInDB(testMetaData: any) {
  try {
    await prisma.testEventJournal.create({
      data: {                               
        event_type: testMetaData.test_run.type,
        event_sub_type: testMetaData.test_run.type,
        session_id: testMetaData.test_run.integrations.unknown_grid.session_id,
        event_uuid: testMetaData.test_run.uuid,
        name: testMetaData.test_run.name,
        scopes: JSON.stringify(testMetaData.test_run.scopes),
        result: testMetaData.test_run.result,
        started_at: testMetaData.test_run.started_at,
        finished_at: null,
        start_event_doc: JSON.stringify(testMetaData),
        finished_event_doc: null,
        file: testMetaData.test_run.file_name,
      }
    })
    log.info(`TestRunStarted event is saved to DB`);
  } catch(e){
    log.error(`TestRunStarted event processing Failed  -- ${e}`) ;
    throw e;
  }
}

async function updateTestEventInDB(testMetaData: any) {
  try{
    await prisma.testEventJournal.update({
      where: {
        event_uuid: testMetaData.test_run.uuid
      },
      data: {
        result: testMetaData.test_run.result,
        finished_at: testMetaData.test_run.started_at,
        finished_event_doc: JSON.stringify(testMetaData)
      },
    })
    log.info(`TestRunFinished event is saved to DB`);
  } catch(e){
    log.error(`TestRunFinished event processing Failed  -- ${e}`) ;
    throw e
  }
}

async function createHookEventInDB(testMetaData: any) {
  try {
    await prisma.testEventJournal.create({
      data: {                               
        event_type: testMetaData.hook_run.type,
        event_sub_type: testMetaData.hook_run.hook_type,
        session_id: testMetaData.hook_run.integrations.unknown_grid.session_id,
        event_uuid: testMetaData.hook_run.uuid,
        name: testMetaData.hook_run.name,
        scopes: JSON.stringify(testMetaData.hook_run.scopes),
        result: testMetaData.hook_run.result,
        started_at: testMetaData.hook_run.started_at,
        finished_at: null,
        start_event_doc: JSON.stringify(testMetaData),
        finished_event_doc: null,
        file: testMetaData.hook_run.file_name,
      }
    });
    log.info(`HookRunStarted event is saved to DB`);
  } catch(e){
    log.error(`HookRunStarted event processing Failed  -- ${e}`) ;
    throw e
  }
}

async function updateHookEventInDB(testMetaData: any) {
  try {
    await prisma.testEventJournal.update({
      where: {
        event_uuid: testMetaData.hook_run.uuid
      },
      data: {
        result: testMetaData.hook_run.result,
        finished_at: testMetaData.hook_run.started_at,
        finished_event_doc: JSON.stringify(testMetaData)
      }
    })
    log.info(`HookRunFinished event is saved to DB`);
  } catch(e){
    log.error(`HookRunFinished event processing Failed  -- ${e}`) ;
    throw e
  }
}

export { createTestEventInDB, updateTestEventInDB, createHookEventInDB, updateHookEventInDB };