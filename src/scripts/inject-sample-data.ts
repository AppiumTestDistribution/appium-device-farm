import log from '../logger';
import { prisma } from '../prisma';

interface SampleDataOptions {
  oldBuilds?: number; // Builds older than 30 days
  twoDayOldBuilds?: number; // Builds exactly 2 days old (for testing cleanup boundary)
  recentBuilds?: number; // Builds newer than 30 days
  todayBuilds?: number; // Builds created today
  yesterdayBuilds?: number; // Builds created yesterday
  sessionsPerBuild?: number;
  sessionLogsPerSession?: number;
  testEventJournalsPerSession?: number;
}

async function injectSampleData(options: SampleDataOptions = {}) {
  const {
    oldBuilds = 3,
    twoDayOldBuilds = 2,
    recentBuilds = 2,
    todayBuilds = 1,
    yesterdayBuilds = 1,
    sessionsPerBuild = 2,
    sessionLogsPerSession = 3,
    testEventJournalsPerSession = 1,
  } = options;

  try {
    await prisma.$connect();
    log.info('Starting sample data injection...');

    const now = new Date();
    const oldBuildDate = new Date(now);
    oldBuildDate.setDate(oldBuildDate.getDate() - 35); // 35 days ago

    const injectedData = {
      builds: [] as string[],
      sessions: [] as string[],
      sessionLogs: 0,
      testEventJournals: 0,
    };

    // Create old builds (should be deleted with retentionDays=30)
    log.info(`Creating ${oldBuilds} old builds (${oldBuildDate.toISOString()})...`);
    for (let i = 0; i < oldBuilds; i++) {
      const build = await prisma.build.create({
        data: {
          name: `Old Build ${i + 1}`,
          createdAt: new Date(oldBuildDate.getTime() - i * 24 * 60 * 60 * 1000), // Stagger dates
        },
      });
      injectedData.builds.push(build.id);

      // Create sessions for this build
      for (let j = 0; j < sessionsPerBuild; j++) {
        const sessionStartTime = new Date(build.createdAt.getTime() + j * 60 * 60 * 1000); // 1 hour apart
        const sessionEndTime = new Date(sessionStartTime.getTime() + 30 * 60 * 1000); // 30 min duration

        const session = await prisma.session.create({
          data: {
            id: `session-${build.id}-${j}`,
            buildId: build.id,
            name: `Session ${j + 1} for Old Build ${i + 1}`,
            status: j % 2 === 0 ? 'passed' : 'failed',
            desiredCapabilities: JSON.stringify({
              platformName: 'iOS',
              deviceName: `iPhone ${j + 1}`,
            }),
            sessionCapabilities: JSON.stringify({
              platformName: 'iOS',
              deviceName: `iPhone ${j + 1}`,
            }),
            nodeId: 'test-node-1',
            hasLiveVideo: false,
            deviceUdid: `test-udid-${build.id}-${j}`,
            devicePlatform: 'ios',
            deviceVersion: '17.0',
            deviceName: `iPhone ${j + 1}`,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            createdAt: sessionStartTime,
          },
        });
        injectedData.sessions.push(session.id);

        // Create session logs
        for (let k = 0; k < sessionLogsPerSession; k++) {
          await prisma.sessionLog.create({
            data: {
              sessionId: session.id,
              commandName: `command-${k}`,
              url: `/wd/hub/session/${session.id}/${k}`,
              method: 'POST',
              title: `Command ${k + 1}`,
              subtitle: `Executing command ${k + 1}`,
              body: JSON.stringify({ param: `value-${k}` }),
              response: JSON.stringify({ status: 0, value: `result-${k}` }),
              isSuccess: true,
              createdAt: new Date(sessionStartTime.getTime() + k * 5 * 60 * 1000), // 5 min apart
            },
          });
          injectedData.sessionLogs++;
        }

        // Create test event journals
        for (let k = 0; k < testEventJournalsPerSession; k++) {
          await prisma.testEventJournal.create({
            data: {
              session_id: session.id,
              event_uuid: `event-${session.id}-${k}`,
              event_type: 'test',
              event_sub_type: 'test_run',
              name: `Test ${k + 1} for Session ${j + 1}`,
              scopes: JSON.stringify(['test']),
              result: session.status,
              started_at: sessionStartTime,
              finished_at: sessionEndTime,
              start_event_doc: JSON.stringify({ test: 'start' }),
              finished_event_doc: JSON.stringify({ test: 'end' }),
              file: `test-${session.id}-${k}.js`,
            },
          });
          injectedData.testEventJournals++;
        }
      }
    }

    // Create builds for today (should always be kept for any retentionDays >= 1)
    const todayBase = new Date(now);
    todayBase.setHours(12, 0, 0, 0); // noon today
    log.info(`Creating ${todayBuilds} build(s) for today (${todayBase.toISOString()})...`);
    for (let i = 0; i < todayBuilds; i++) {
      const build = await prisma.build.create({
        data: {
          name: `Today Build ${i + 1}`,
          createdAt: new Date(todayBase.getTime() + i * 30 * 60 * 1000), // stagger by 30m
        },
      });
      injectedData.builds.push(build.id);

      for (let j = 0; j < sessionsPerBuild; j++) {
        const sessionStartTime = new Date(build.createdAt.getTime() + j * 10 * 60 * 1000);
        const sessionEndTime = new Date(sessionStartTime.getTime() + 15 * 60 * 1000);
        const session = await prisma.session.create({
          data: {
            id: `session-${build.id}-today-${j}`,
            buildId: build.id,
            name: `Session ${j + 1} for Today Build ${i + 1}`,
            status: 'passed',
            desiredCapabilities: JSON.stringify({
              platformName: 'Android',
              deviceName: `Pixel T${j + 1}`,
            }),
            sessionCapabilities: JSON.stringify({
              platformName: 'Android',
              deviceName: `Pixel T${j + 1}`,
            }),
            nodeId: 'test-node-today',
            hasLiveVideo: true,
            deviceUdid: `test-udid-today-${build.id}-${j}`,
            devicePlatform: 'android',
            deviceVersion: '14.0',
            deviceName: `Pixel T${j + 1}`,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            createdAt: sessionStartTime,
          },
        });
        injectedData.sessions.push(session.id);
        for (let k = 0; k < sessionLogsPerSession; k++) {
          await prisma.sessionLog.create({
            data: {
              sessionId: session.id,
              commandName: `command-${k}`,
              url: `/wd/hub/session/${session.id}/${k}`,
              method: 'POST',
              title: `Command ${k + 1}`,
              subtitle: `Executing command ${k + 1}`,
              body: JSON.stringify({ param: `value-${k}` }),
              response: JSON.stringify({ status: 0, value: `result-${k}` }),
              isSuccess: true,
              createdAt: new Date(sessionStartTime.getTime() + k * 2 * 60 * 1000),
            },
          });
          injectedData.sessionLogs++;
        }
      }
    }

    // Create builds for yesterday
    const yesterdayBase = new Date(now);
    yesterdayBase.setDate(yesterdayBase.getDate() - 1);
    yesterdayBase.setHours(12, 0, 0, 0); // noon yesterday
    log.info(
      `Creating ${yesterdayBuilds} build(s) for yesterday (${yesterdayBase.toISOString()})...`,
    );
    for (let i = 0; i < yesterdayBuilds; i++) {
      const build = await prisma.build.create({
        data: {
          name: `Yesterday Build ${i + 1}`,
          createdAt: new Date(yesterdayBase.getTime() + i * 30 * 60 * 1000),
        },
      });
      injectedData.builds.push(build.id);

      for (let j = 0; j < sessionsPerBuild; j++) {
        const sessionStartTime = new Date(build.createdAt.getTime() + j * 12 * 60 * 1000);
        const sessionEndTime = new Date(sessionStartTime.getTime() + 18 * 60 * 1000);
        const session = await prisma.session.create({
          data: {
            id: `session-${build.id}-yday-${j}`,
            buildId: build.id,
            name: `Session ${j + 1} for Yesterday Build ${i + 1}`,
            status: j % 2 === 0 ? 'passed' : 'failed',
            desiredCapabilities: JSON.stringify({
              platformName: 'iOS',
              deviceName: `iPhone Y${j + 1}`,
            }),
            sessionCapabilities: JSON.stringify({
              platformName: 'iOS',
              deviceName: `iPhone Y${j + 1}`,
            }),
            nodeId: 'test-node-yday',
            hasLiveVideo: false,
            deviceUdid: `test-udid-yday-${build.id}-${j}`,
            devicePlatform: 'ios',
            deviceVersion: '17.0',
            deviceName: `iPhone Y${j + 1}`,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            createdAt: sessionStartTime,
          },
        });
        injectedData.sessions.push(session.id);
        for (let k = 0; k < sessionLogsPerSession; k++) {
          await prisma.sessionLog.create({
            data: {
              sessionId: session.id,
              commandName: `command-${k}`,
              url: `/wd/hub/session/${session.id}/${k}`,
              method: 'POST',
              title: `Command ${k + 1}`,
              subtitle: `Executing command ${k + 1}`,
              body: JSON.stringify({ param: `value-${k}` }),
              response: JSON.stringify({ status: 0, value: `result-${k}` }),
              isSuccess: true,
              createdAt: new Date(sessionStartTime.getTime() + k * 3 * 60 * 1000),
            },
          });
          injectedData.sessionLogs++;
        }
      }
    }

    // Create builds exactly 2 days old (boundary testing - should be kept with retentionDays=2)
    const twoDayOldDate = new Date(now);
    twoDayOldDate.setDate(twoDayOldDate.getDate() - 2);
    twoDayOldDate.setHours(12, 0, 0, 0); // Set to noon on that day (after start of day, so should be kept)

    log.info(
      `Creating ${twoDayOldBuilds} builds exactly 2 days old (${twoDayOldDate.toISOString()})...`,
    );
    for (let i = 0; i < twoDayOldBuilds; i++) {
      const build = await prisma.build.create({
        data: {
          name: `2 Days Old Build ${i + 1}`,
          createdAt: new Date(twoDayOldDate.getTime() + i * 60 * 60 * 1000), // Stagger by 1 hour
        },
      });
      injectedData.builds.push(build.id);

      // Create sessions for this build
      for (let j = 0; j < sessionsPerBuild; j++) {
        const sessionStartTime = new Date(build.createdAt.getTime() + j * 30 * 60 * 1000); // 30 min apart
        const sessionEndTime = new Date(sessionStartTime.getTime() + 25 * 60 * 1000); // 25 min duration

        const session = await prisma.session.create({
          data: {
            id: `session-${build.id}-${j}`,
            buildId: build.id,
            name: `Session ${j + 1} for 2 Days Old Build ${i + 1}`,
            status: j % 2 === 0 ? 'passed' : 'failed',
            desiredCapabilities: JSON.stringify({
              platformName: 'iOS',
              deviceName: `iPhone ${j + 1}`,
            }),
            sessionCapabilities: JSON.stringify({
              platformName: 'iOS',
              deviceName: `iPhone ${j + 1}`,
            }),
            nodeId: 'test-node-boundary',
            hasLiveVideo: true,
            deviceUdid: `test-udid-${build.id}-${j}`,
            devicePlatform: 'ios',
            deviceVersion: '17.0',
            deviceName: `iPhone ${j + 1}`,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            createdAt: sessionStartTime,
          },
        });
        injectedData.sessions.push(session.id);

        // Create session logs
        for (let k = 0; k < sessionLogsPerSession; k++) {
          await prisma.sessionLog.create({
            data: {
              sessionId: session.id,
              commandName: `command-${k}`,
              url: `/wd/hub/session/${session.id}/${k}`,
              method: 'POST',
              title: `Command ${k + 1}`,
              subtitle: `Executing command ${k + 1}`,
              body: JSON.stringify({ param: `value-${k}` }),
              response: JSON.stringify({ status: 0, value: `result-${k}` }),
              isSuccess: true,
              createdAt: new Date(sessionStartTime.getTime() + k * 4 * 60 * 1000), // 4 min apart
            },
          });
          injectedData.sessionLogs++;
        }

        // Create test event journals
        for (let k = 0; k < testEventJournalsPerSession; k++) {
          await prisma.testEventJournal.create({
            data: {
              session_id: session.id,
              event_uuid: `event-${session.id}-${k}`,
              event_type: 'test',
              event_sub_type: 'test_run',
              name: `Test ${k + 1} for Session ${j + 1}`,
              scopes: JSON.stringify(['test']),
              result: session.status,
              started_at: sessionStartTime,
              finished_at: sessionEndTime,
              start_event_doc: JSON.stringify({ test: 'start' }),
              finished_event_doc: JSON.stringify({ test: 'end' }),
              file: `test-${session.id}-${k}.js`,
            },
          });
          injectedData.testEventJournals++;
        }
      }
    }

    // Create recent builds (should NOT be deleted with retentionDays=30)
    log.info(`Creating ${recentBuilds} recent builds...`);
    for (let i = 0; i < recentBuilds; i++) {
      const recentBuildDate = new Date(now);
      recentBuildDate.setDate(recentBuildDate.getDate() - (5 + i)); // 5-7 days ago

      const build = await prisma.build.create({
        data: {
          name: `Recent Build ${i + 1}`,
          createdAt: recentBuildDate,
        },
      });
      injectedData.builds.push(build.id);

      // Create sessions for this build
      for (let j = 0; j < sessionsPerBuild; j++) {
        const sessionStartTime = new Date(build.createdAt.getTime() + j * 60 * 60 * 1000);
        const sessionEndTime = new Date(sessionStartTime.getTime() + 20 * 60 * 1000); // 20 min duration

        const session = await prisma.session.create({
          data: {
            id: `session-${build.id}-${j}`,
            buildId: build.id,
            name: `Session ${j + 1} for Recent Build ${i + 1}`,
            status: j % 3 === 0 ? 'passed' : j % 3 === 1 ? 'failed' : 'running',
            desiredCapabilities: JSON.stringify({
              platformName: 'Android',
              deviceName: `Pixel ${j + 1}`,
            }),
            sessionCapabilities: JSON.stringify({
              platformName: 'Android',
              deviceName: `Pixel ${j + 1}`,
            }),
            nodeId: 'test-node-2',
            hasLiveVideo: true,
            deviceUdid: `test-udid-${build.id}-${j}`,
            devicePlatform: 'android',
            deviceVersion: '14.0',
            deviceName: `Pixel ${j + 1}`,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            createdAt: sessionStartTime,
          },
        });
        injectedData.sessions.push(session.id);

        // Create session logs
        for (let k = 0; k < sessionLogsPerSession; k++) {
          await prisma.sessionLog.create({
            data: {
              sessionId: session.id,
              commandName: `command-${k}`,
              url: `/wd/hub/session/${session.id}/${k}`,
              method: 'POST',
              title: `Command ${k + 1}`,
              subtitle: `Executing command ${k + 1}`,
              body: JSON.stringify({ param: `value-${k}` }),
              response: JSON.stringify({ status: 0, value: `result-${k}` }),
              isSuccess: true,
              createdAt: new Date(sessionStartTime.getTime() + k * 3 * 60 * 1000), // 3 min apart
            },
          });
          injectedData.sessionLogs++;
        }

        // Create test event journals
        for (let k = 0; k < testEventJournalsPerSession; k++) {
          await prisma.testEventJournal.create({
            data: {
              session_id: session.id,
              event_uuid: `event-${session.id}-${k}`,
              event_type: 'test',
              event_sub_type: 'test_run',
              name: `Test ${k + 1} for Session ${j + 1}`,
              scopes: JSON.stringify(['test']),
              result: session.status === 'running' ? null : session.status,
              started_at: sessionStartTime,
              finished_at: session.status === 'running' ? null : sessionEndTime,
              start_event_doc: JSON.stringify({ test: 'start' }),
              finished_event_doc:
                session.status === 'running' ? null : JSON.stringify({ test: 'end' }),
              file: `test-${session.id}-${k}.js`,
            },
          });
          injectedData.testEventJournals++;
        }
      }
    }

    log.info('Sample data injection completed successfully!');
    log.info(`Summary:
      - Builds created: ${injectedData.builds.length} (${oldBuilds} old, ${yesterdayBuilds} yesterday, ${todayBuilds} today, ${twoDayOldBuilds} two-days-old, ${recentBuilds} recent)
      - Sessions created: ${injectedData.sessions.length}
      - Session logs created: ${injectedData.sessionLogs}
      - Test event journals created: ${injectedData.testEventJournals}
    `);

    return injectedData;
  } catch (error) {
    log.error('Error injecting sample data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: SampleDataOptions = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--old-builds' && args[i + 1]) {
      options.oldBuilds = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--today-builds' && args[i + 1]) {
      options.todayBuilds = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--yesterday-builds' && args[i + 1]) {
      options.yesterdayBuilds = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--two-day-old-builds' && args[i + 1]) {
      options.twoDayOldBuilds = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--recent-builds' && args[i + 1]) {
      options.recentBuilds = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--sessions-per-build' && args[i + 1]) {
      options.sessionsPerBuild = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--session-logs-per-session' && args[i + 1]) {
      options.sessionLogsPerSession = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--test-events-per-session' && args[i + 1]) {
      options.testEventJournalsPerSession = parseInt(args[i + 1], 10);
      i++;
    }
  }

  (async () => {
    await injectSampleData(options);
    process.exit(0);
  })();
}

export { injectSampleData };
