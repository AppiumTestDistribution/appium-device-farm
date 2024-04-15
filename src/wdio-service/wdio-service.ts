import log from '../logger';
import { Request } from 'express';
import {
  createHookEventInDB,
  createTestEventInDB,
  updateHookEventInDB,
  updateTestEventInDB,
} from '../data-service/test-execution-meta-data';

enum TestEvent {
  TestRunStarted = 'TestRunStarted',
  TestRunFinished = 'TestRunFinished',
  HookRunFinished = 'HookRunFinished',
  HookRunStarted = 'HookRunStarted',
}

const testEvents: any = {};

async function saveTestExecutionMetaData(args: Request) {
  const metaData = args.body;
  log.info(`handling test execution event - ${metaData.event_type}`);
  switch (metaData.event_type) {
    case TestEvent.TestRunStarted:
      testEvents[metaData.test_run.integrations.unknown_grid.session_id] = metaData.test_run.uuid;
      await createTestEventInDB(metaData);
      break;

    case TestEvent.TestRunFinished:
      removeEventIdFromCache(testEvents, metaData.test_run.uuid);
      await updateTestEventInDB(metaData);
      break;

    case TestEvent.HookRunStarted:
      testEvents[metaData.hook_run.integrations.unknown_grid.session_id] = metaData.hook_run.uuid;
      await createHookEventInDB(metaData);
      break;

    case TestEvent.HookRunFinished:
      removeEventIdFromCache(testEvents, metaData.hook_run.uuid);
      await updateHookEventInDB(metaData);
      break;
  }
}

async function getEventId(sessionId: string) {
  console.log(JSON.stringify(testEvents), sessionId);
  return testEvents[sessionId] as string;
}

function removeEventIdFromCache(obj: any, valueToRemove: string) {
  const keys = Object.keys(obj);
  const foundKey = keys.find((key) => obj[key] === valueToRemove);
  if (foundKey) {
    delete obj[foundKey];
  }
  return obj;
}
export { saveTestExecutionMetaData, getEventId };
