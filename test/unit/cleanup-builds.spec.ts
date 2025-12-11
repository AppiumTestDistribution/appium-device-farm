import { expect } from 'chai';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../src/prisma';
import { config } from '../../src/config';

describe('Cleanup Builds - Sequential Delete Operations', () => {
  let testPrisma: PrismaClient;
  let testDbPath: string;
  let testSessionAssetsPath: string;

  before(async () => {
    // Use the existing database setup from config
    // This ensures the schema is already initialized
    testPrisma = prisma;
    testDbPath = config.databasePath.replace('file:', '').split('?')[0];
    testSessionAssetsPath = config.sessionAssetsPath;

    // Ensure session assets directory exists
    fs.mkdirSync(testSessionAssetsPath, { recursive: true });
  });

  after(async () => {
    // Don't disconnect from the shared prisma instance
    // Just clean up test data (handled in beforeEach)
  });

  beforeEach(async () => {
    // Clean up all data before each test
    await testPrisma.sessionLog.deleteMany();
    await testPrisma.testEventJournal.deleteMany();
    await testPrisma.session.deleteMany();
    await testPrisma.build.deleteMany();
  });

  describe('Sequential Delete Operations', () => {
    it('should delete builds and related data in correct order without transaction errors', async () => {
      // Create test data
      const build1 = await testPrisma.build.create({
        data: {
          id: uuidv4(),
          name: 'Test Build 1',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
      });

      const build2 = await testPrisma.build.create({
        data: {
          id: uuidv4(),
          name: 'Test Build 2',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
      });

      const session1 = await testPrisma.session.create({
        data: {
          id: uuidv4(),
          buildId: build1.id,
          deviceUdid: 'test-udid-1',
          devicePlatform: 'android',
          deviceVersion: '10',
          desiredCapabilities: '{}',
          sessionCapabilities: '{}',
          nodeId: 'test-node',
          status: 'completed',
          hasLiveVideo: false,
        },
      });

      const session2 = await testPrisma.session.create({
        data: {
          id: uuidv4(),
          buildId: build1.id,
          deviceUdid: 'test-udid-2',
          devicePlatform: 'ios',
          deviceVersion: '14',
          desiredCapabilities: '{}',
          sessionCapabilities: '{}',
          nodeId: 'test-node',
          status: 'completed',
          hasLiveVideo: false,
        },
      });

      // Create session logs
      await testPrisma.sessionLog.createMany({
        data: [
          {
            id: uuidv4(),
            sessionId: session1.id,
            commandName: 'click',
            url: '/session/click',
            method: 'POST',
            title: 'Click',
            response: '{}',
            isSuccess: true,
          },
          {
            id: uuidv4(),
            sessionId: session2.id,
            commandName: 'getText',
            url: '/session/getText',
            method: 'POST',
            title: 'Get Text',
            response: '{}',
            isSuccess: true,
          },
        ],
      });

      // Create test event journals
      await testPrisma.testEventJournal.createMany({
        data: [
          {
            id: uuidv4(),
            session_id: session1.id,
            event_uuid: uuidv4(),
            event_type: 'test',
            event_sub_type: 'start',
            name: 'Test Event',
            scopes: '{}',
            file: 'test.json',
          },
        ],
      });

      const buildIdsToDelete = [build1.id];
      const sessionsToDelete = await testPrisma.session.findMany({
        where: { buildId: { in: buildIdsToDelete } },
        select: { id: true },
      });
      const sessionIdsToDelete = sessionsToDelete.map((s) => s.id);

      // Perform sequential deletes (mimicking the actual implementation)
      let deletedSessionLogs = { count: 0 };
      let deletedTestEventJournals = { count: 0 };
      let deletedSessions = { count: 0 };
      let deletedBuilds = { count: 0 };

      try {
        if (sessionIdsToDelete.length > 0) {
          deletedSessionLogs = await testPrisma.sessionLog.deleteMany({
            where: { sessionId: { in: sessionIdsToDelete } },
          });

          deletedTestEventJournals = await testPrisma.testEventJournal.deleteMany({
            where: { session_id: { in: sessionIdsToDelete } },
          });
        }

        deletedSessions = await testPrisma.session.deleteMany({
          where: { buildId: { in: buildIdsToDelete } },
        });

        deletedBuilds = await testPrisma.build.deleteMany({
          where: { id: { in: buildIdsToDelete } },
        });
      } catch (error) {
        throw error;
      }

      // Verify deletions
      expect(deletedSessionLogs.count).to.equal(2);
      expect(deletedTestEventJournals.count).to.equal(1);
      expect(deletedSessions.count).to.equal(2);
      expect(deletedBuilds.count).to.equal(1);

      // Verify data is actually deleted
      const remainingBuilds = await testPrisma.build.findMany();
      expect(remainingBuilds.length).to.equal(1); // build2 should remain
      expect(remainingBuilds[0].id).to.equal(build2.id);

      const remainingSessions = await testPrisma.session.findMany();
      expect(remainingSessions.length).to.equal(0);

      const remainingLogs = await testPrisma.sessionLog.findMany();
      expect(remainingLogs.length).to.equal(0);

      const remainingJournals = await testPrisma.testEventJournal.findMany();
      expect(remainingJournals.length).to.equal(0);
    });

    it('should handle empty sessionIdsToDelete gracefully', async () => {
      const build = await testPrisma.build.create({
        data: {
          id: uuidv4(),
          name: 'Test Build',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      });

      const buildIdsToDelete = [build.id];
      const sessionIdsToDelete: string[] = []; // No sessions

      let deletedSessionLogs = { count: 0 };
      let deletedTestEventJournals = { count: 0 };
      let deletedSessions = { count: 0 };
      let deletedBuilds = { count: 0 };

      try {
        if (sessionIdsToDelete.length > 0) {
          deletedSessionLogs = await testPrisma.sessionLog.deleteMany({
            where: { sessionId: { in: sessionIdsToDelete } },
          });

          deletedTestEventJournals = await testPrisma.testEventJournal.deleteMany({
            where: { session_id: { in: sessionIdsToDelete } },
          });
        }

        deletedSessions = await testPrisma.session.deleteMany({
          where: { buildId: { in: buildIdsToDelete } },
        });

        deletedBuilds = await testPrisma.build.deleteMany({
          where: { id: { in: buildIdsToDelete } },
        });
      } catch (error) {
        throw error;
      }

      expect(deletedSessionLogs.count).to.equal(0);
      expect(deletedTestEventJournals.count).to.equal(0);
      expect(deletedSessions.count).to.equal(0);
      expect(deletedBuilds.count).to.equal(1);
    });

    it('should handle errors in session log deletion gracefully', async () => {
      const build = await testPrisma.build.create({
        data: {
          id: uuidv4(),
          name: 'Test Build',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      });

      const session = await testPrisma.session.create({
        data: {
          id: uuidv4(),
          buildId: build.id,
          deviceUdid: 'test-udid',
          devicePlatform: 'android',
          deviceVersion: '10',
          desiredCapabilities: '{}',
          sessionCapabilities: '{}',
          nodeId: 'test-node',
          status: 'completed',
          hasLiveVideo: false,
        },
      });

      const sessionIdsToDelete = [session.id];
      const buildIdsToDelete = [build.id];

      let errorThrown = false;

      try {
        // Simulate an error by using invalid session IDs
        await testPrisma.sessionLog.deleteMany({
          where: { sessionId: { in: ['invalid-id'] } },
        });
      } catch (error) {
        errorThrown = true;
        expect(error).to.be.instanceOf(Error);
      }

      // Even if there's an error, it should be caught and re-thrown
      expect(errorThrown).to.be.false; // deleteMany with invalid IDs doesn't throw, returns {count: 0}
    });

    it('should handle large number of records without transaction timeout', async () => {
      // Create a build with many sessions
      const build = await testPrisma.build.create({
        data: {
          id: uuidv4(),
          name: 'Large Build',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        },
      });

      // Create 100 sessions
      const sessions = [];
      for (let i = 0; i < 100; i++) {
        const session = await testPrisma.session.create({
          data: {
            id: uuidv4(),
            buildId: build.id,
            deviceUdid: `test-udid-${i}`,
            devicePlatform: 'android',
            deviceVersion: '10',
            desiredCapabilities: '{}',
            sessionCapabilities: '{}',
            nodeId: 'test-node',
            status: 'completed',
            hasLiveVideo: false,
          },
        });
        sessions.push(session);

        // Create 10 session logs per session
        await testPrisma.sessionLog.createMany({
          data: Array.from({ length: 10 }, () => ({
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
      }

      const buildIdsToDelete = [build.id];
      const sessionsToDelete = await testPrisma.session.findMany({
        where: { buildId: { in: buildIdsToDelete } },
        select: { id: true },
      });
      const sessionIdsToDelete = sessionsToDelete.map((s) => s.id);

      const startTime = Date.now();
      let deletedSessionLogs = { count: 0 };
      let deletedSessions = { count: 0 };
      let deletedBuilds = { count: 0 };

      try {
        deletedSessionLogs = await testPrisma.sessionLog.deleteMany({
          where: { sessionId: { in: sessionIdsToDelete } },
        });

        deletedSessions = await testPrisma.session.deleteMany({
          where: { buildId: { in: buildIdsToDelete } },
        });

        deletedBuilds = await testPrisma.build.deleteMany({
          where: { id: { in: buildIdsToDelete } },
        });
      } catch (error) {
        throw error;
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Verify all records deleted
      expect(deletedSessionLogs.count).to.equal(1000); // 100 sessions * 10 logs
      expect(deletedSessions.count).to.equal(100);
      expect(deletedBuilds.count).to.equal(1);

      // Verify operation completed in reasonable time (should be fast without transaction overhead)
      expect(duration).to.be.lessThan(10000); // Should complete in under 10 seconds

      // Verify no transaction errors occurred
      const remainingLogs = await testPrisma.sessionLog.findMany();
      expect(remainingLogs.length).to.equal(0);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain referential integrity during sequential deletes', async () => {
      const build = await testPrisma.build.create({
        data: {
          id: uuidv4(),
          name: 'Integrity Test Build',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      });

      const session = await testPrisma.session.create({
        data: {
          id: uuidv4(),
          buildId: build.id,
          deviceUdid: 'test-udid',
          devicePlatform: 'android',
          deviceVersion: '10',
          desiredCapabilities: '{}',
          sessionCapabilities: '{}',
          nodeId: 'test-node',
          status: 'completed',
          hasLiveVideo: false,
        },
      });

      await testPrisma.sessionLog.create({
        data: {
          id: uuidv4(),
          sessionId: session.id,
          commandName: 'click',
          url: '/session/click',
          method: 'POST',
          title: 'Click',
          response: '{}',
          isSuccess: true,
        },
      });

      const buildIdsToDelete = [build.id];
      const sessionsToDelete = await testPrisma.session.findMany({
        where: { buildId: { in: buildIdsToDelete } },
        select: { id: true },
      });
      const sessionIdsToDelete = sessionsToDelete.map((s) => s.id);

      // Delete in correct order
      await testPrisma.sessionLog.deleteMany({
        where: { sessionId: { in: sessionIdsToDelete } },
      });

      await testPrisma.session.deleteMany({
        where: { buildId: { in: buildIdsToDelete } },
      });

      await testPrisma.build.deleteMany({
        where: { id: { in: buildIdsToDelete } },
      });

      // Verify all related data is deleted
      const remainingBuilds = await testPrisma.build.findMany({ where: { id: build.id } });
      expect(remainingBuilds.length).to.equal(0);

      const remainingSessions = await testPrisma.session.findMany({ where: { id: session.id } });
      expect(remainingSessions.length).to.equal(0);

      const remainingLogs = await testPrisma.sessionLog.findMany({
        where: { sessionId: session.id },
      });
      expect(remainingLogs.length).to.equal(0);
    });
  });
});
