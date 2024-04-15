import log from '../logger';
import { Request } from "express";
import { createHookEventInDB, createTestEventInDB, updateHookEventInDB, updateTestEventInDB } from "../data-service/test-execution-meta-data";

enum TestEvent {
    TestRunStarted = 'TestRunStarted', 
    TestRunFinished = 'TestRunFinished', 
    HookRunFinished = 'HookRunFinished', 
    HookRunStarted = 'HookRunStarted', 
}

async function saveTestExecutionMetaData(args: Request) {
    let metaData = args.body;
    log.info(`handling test execution event - ${metaData.event_type}`);
    switch(metaData.event_type) {
      case TestEvent.TestRunStarted:
        await createTestEventInDB(metaData);
        break;

      case TestEvent.TestRunFinished:
        await updateTestEventInDB(metaData);
        break;
        
      case TestEvent.HookRunStarted:
        await createHookEventInDB(metaData);
        break;
        
      case TestEvent.HookRunFinished:
        await updateHookEventInDB(metaData);
        break;
    }
}

export { saveTestExecutionMetaData };