import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../src/prisma';
import { config } from '../../src/config';

describe('Cleanup Builds Integration Test', () => {
  let testBuildIds: string[] = [];
  let testSessionIds: string[] = [];
  let testSessionAssetDirs: string[] = [];

  afterEach(async () => {
    // Clean up any remaining test data
    if (testSessionIds.length > 0) {
      await prisma.sessionLog.deleteMany({
        where: { sessionId: { in: testSessionIds } },
      });
      await prisma.testEventJournal.deleteMany({
        where: { session_id: { in: testSessionIds } },
      });
    }
    if (testBuildIds.length > 0) {
      await prisma.session.deleteMany({
        where: { buildId: { in: testBuildIds } },
      });
      await prisma.build.deleteMany({
        where: { id: { in: testBuildIds } },
      });
    }

    // Clean up session asset directories
    for (const dir of testSessionAssetDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }

    testBuildIds = [];
    testSessionIds = [];
    testSessionAssetDirs = [];
  });

  async function createTestBuild(daysOld: number, numSessions: number = 2) {
    const build = await prisma.build.create({
      data: {
        id: uuidv4(),
        name: `Test Build ${Date.now()}`,
        createdAt: new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000),
      },
    });
    testBuildIds.push(build.id);

    const sessions = [];
    for (let i = 0; i < numSessions; i++) {
      const session = await prisma.session.create({
        data: {
          id: uuidv4(),
          buildId: build.id,
          deviceUdid: `test-udid-${build.id}-${i}`,
          devicePlatform: 'android',
          deviceVersion: '10',
          desiredCapabilities: JSON.stringify({ platformName: 'Android' }),
          sessionCapabilities: JSON.stringify({ platformName: 'Android' }),
          nodeId: 'test-node',
          status: 'completed',
          hasLiveVideo: false,
        },
      });
      sessions.push(session);
      testSessionIds.push(session.id);

      // Create session logs
      await prisma.sessionLog.createMany({
        data: Array.from({ length: 3 }, () => ({
          id: uuidv4(),
          sessionId: session.id,
          commandName: 'click',
          url: '/session/click',
          method: 'POST',
          title: 'Click',
          response: '{}',
          isSuccess: true,
        })),
      });

      // Create test event journals
      await prisma.testEventJournal.create({
        data: {
          id: uuidv4(),
          session_id: session.id,
          event_uuid: uuidv4(),
          event_type: 'test',
          event_sub_type: 'start',
          name: 'Test Event',
          scopes: '{}',
          file: 'test.json',
        },
      });

      // Create session asset directory
      const sessionDir = path.join(config.sessionAssetsPath, session.id);
      fs.mkdirSync(sessionDir, { recursive: true });
      fs.writeFileSync(path.join(sessionDir, 'test.txt'), 'test content');
      testSessionAssetDirs.push(sessionDir);
    }

    return { build, sessions };
  }

  async function cleanupBuilds(retentionDays: number) {
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - retentionDays);
    retentionDate.setHours(0, 0, 0, 0);

    const buildsToDelete = await prisma.build.findMany({
      where: {
        createdAt: {
          lt: retentionDate,
        },
      },
      select: { id: true },
    });

    const buildIdsToDelete = buildsToDelete.map((b) => b.id);

    if (buildIdsToDelete.length === 0) {
      return {
        deletedBuilds: 0,
        deletedSessions: 0,
        deletedSessionLogs: 0,
        deletedTestEventJournals: 0,
      };
    }

    const sessionsToDelete = await prisma.session.findMany({
      where: { buildId: { in: buildIdsToDelete } },
      select: { id: true },
    });
    const sessionIdsToDelete = sessionsToDelete.map((s) => s.id);

    let deletedSessionLogs = { count: 0 };
    let deletedTestEventJournals = { count: 0 };
    let deletedSessions = { count: 0 };
    let deletedBuilds = { count: 0 };

    if (sessionIdsToDelete.length > 0) {
      deletedSessionLogs = await prisma.sessionLog.deleteMany({
        where: { sessionId: { in: sessionIdsToDelete } },
      });

      deletedTestEventJournals = await prisma.testEventJournal.deleteMany({
        where: { session_id: { in: sessionIdsToDelete } },
      });
    }

    deletedSessions = await prisma.session.deleteMany({
      where: { buildId: { in: buildIdsToDelete } },
    });

    deletedBuilds = await prisma.build.deleteMany({
      where: { id: { in: buildIdsToDelete } },
    });

    // Clean up session asset directories
    for (const sessionId of sessionIdsToDelete) {
      const sessionDir = path.join(config.sessionAssetsPath, sessionId);
      if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
      }
    }

    return {
      deletedBuilds: deletedBuilds.count,
      deletedSessions: deletedSessions.count,
      deletedSessionLogs: deletedSessionLogs.count,
      deletedTestEventJournals: deletedTestEventJournals.count,
    };
  }

  it('should delete old builds and all related data', async () => {
    const oldBuild = await createTestBuild(10, 3);
    const newBuild = await createTestBuild(1, 2);

    const result = await cleanupBuilds(5);

    expect(result.deletedBuilds).to.equal(1);
    expect(result.deletedSessions).to.equal(3);
    expect(result.deletedSessionLogs).to.equal(9);
    expect(result.deletedTestEventJournals).to.equal(3);

    const remainingOldBuild = await prisma.build.findUnique({
      where: { id: oldBuild.build.id },
    });
    expect(remainingOldBuild).to.be.null;

    const remainingNewBuild = await prisma.build.findUnique({
      where: { id: newBuild.build.id },
    });
    expect(remainingNewBuild).to.not.be.null;

    const remainingSessions = await prisma.session.findMany({
      where: { buildId: oldBuild.build.id },
    });
    expect(remainingSessions.length).to.equal(0);

    const remainingLogs = await prisma.sessionLog.findMany({
      where: { sessionId: { in: oldBuild.sessions.map((s) => s.id) } },
    });
    expect(remainingLogs.length).to.equal(0);

    for (const session of oldBuild.sessions) {
      const sessionDir = path.join(config.sessionAssetsPath, session.id);
      expect(fs.existsSync(sessionDir)).to.be.false;
    }

    // Clean up new build manually since it wasn't deleted
    testBuildIds = testBuildIds.filter((id) => id !== newBuild.build.id);
    await prisma.sessionLog.deleteMany({
      where: { sessionId: { in: newBuild.sessions.map((s) => s.id) } },
    });
    await prisma.testEventJournal.deleteMany({
      where: { session_id: { in: newBuild.sessions.map((s) => s.id) } },
    });
    await prisma.session.deleteMany({
      where: { buildId: newBuild.build.id },
    });
    await prisma.build.delete({ where: { id: newBuild.build.id } });
  });

  it('should handle builds with no sessions', async () => {
    const build = await prisma.build.create({
      data: {
        id: uuidv4(),
        name: 'Build without sessions',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    });
    testBuildIds.push(build.id);

    const result = await cleanupBuilds(5);

    expect(result.deletedBuilds).to.equal(1);
    expect(result.deletedSessions).to.equal(0);
    expect(result.deletedSessionLogs).to.equal(0);
    expect(result.deletedTestEventJournals).to.equal(0);

    const remainingBuild = await prisma.build.findUnique({
      where: { id: build.id },
    });
    expect(remainingBuild).to.be.null;
  });

  it('should not delete builds within retention period', async () => {
    const build1 = await createTestBuild(2, 1);
    const build2 = await createTestBuild(4, 1);

    const result = await cleanupBuilds(5);

    expect(result.deletedBuilds).to.equal(0);
    expect(result.deletedSessions).to.equal(0);

    const remainingBuild1 = await prisma.build.findUnique({
      where: { id: build1.build.id },
    });
    expect(remainingBuild1).to.not.be.null;

    const remainingBuild2 = await prisma.build.findUnique({
      where: { id: build2.build.id },
    });
    expect(remainingBuild2).to.not.be.null;

    // Clean up manually
    testBuildIds = [];
    for (const build of [build1, build2]) {
      await prisma.sessionLog.deleteMany({
        where: { sessionId: { in: build.sessions.map((s) => s.id) } },
      });
      await prisma.testEventJournal.deleteMany({
        where: { session_id: { in: build.sessions.map((s) => s.id) } },
      });
      await prisma.session.deleteMany({
        where: { buildId: build.build.id },
      });
      await prisma.build.delete({ where: { id: build.build.id } });
    }
  });

  it('should delete multiple old builds correctly', async () => {
    const build1 = await createTestBuild(10, 2);
    const build2 = await createTestBuild(15, 1);
    const build3 = await createTestBuild(20, 3);
    const newBuild = await createTestBuild(2, 1);

    const result = await cleanupBuilds(5);

    expect(result.deletedBuilds).to.equal(3);
    expect(result.deletedSessions).to.equal(6);
    expect(result.deletedSessionLogs).to.equal(18);
    expect(result.deletedTestEventJournals).to.equal(6);

    for (const build of [build1, build2, build3]) {
      const remainingBuild = await prisma.build.findUnique({
        where: { id: build.build.id },
      });
      expect(remainingBuild).to.be.null;
    }

    const remainingNewBuild = await prisma.build.findUnique({
      where: { id: newBuild.build.id },
    });
    expect(remainingNewBuild).to.not.be.null;

    // Clean up new build manually
    testBuildIds = testBuildIds.filter((id) => id !== newBuild.build.id);
    await prisma.sessionLog.deleteMany({
      where: { sessionId: { in: newBuild.sessions.map((s) => s.id) } },
    });
    await prisma.testEventJournal.deleteMany({
      where: { session_id: { in: newBuild.sessions.map((s) => s.id) } },
    });
    await prisma.session.deleteMany({
      where: { buildId: newBuild.build.id },
    });
    await prisma.build.delete({ where: { id: newBuild.build.id } });
  });
});
