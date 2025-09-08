import { expect } from 'chai';
import { ADBManager, adbManager } from '../../src/utils/adb-manager';
import { ADB } from 'appium-adb';
import * as sinon from 'sinon';

describe('ADBManager', () => {
  let sandbox: sinon.SinonSandbox;
  let mockADB: sinon.SinonStubbedInstance<ADB>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockADB = sandbox.createStubInstance(ADB);

    // Mock ADB.createADB to return our stubbed instance
    sandbox.stub(ADB, 'createADB').resolves(mockADB as any);
  });

  afterEach(() => {
    sandbox.restore();
    // Reset the singleton instance for each test
    (ADBManager as any).instance = undefined;
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = ADBManager.getInstance();
      const instance2 = ADBManager.getInstance();

      expect(instance1).to.equal(instance2);
    });

    it('should return the same instance from adbManager export', () => {
      const instance1 = ADBManager.getInstance();
      const instance2 = adbManager;

      expect(instance1).to.equal(instance2);
    });
  });

  describe('Initialization', () => {
    it('should initialize ADB instance only once', async () => {
      const manager = ADBManager.getInstance();

      // First initialization
      const adb1 = await manager.initialize({ adbExecTimeout: 60000 });

      // Second initialization should return the same instance
      const adb2 = await manager.initialize({ adbExecTimeout: 80000 });

      expect(adb1).to.equal(adb2);
      expect(ADB.createADB).to.have.been.calledOnce;
    });

    it('should handle concurrent initialization calls', async () => {
      const manager = ADBManager.getInstance();

      // Start multiple concurrent initializations
      const promises = [
        manager.initialize({ adbExecTimeout: 60000 }),
        manager.initialize({ adbExecTimeout: 80000 }),
        manager.initialize({ udid: 'test-device' }),
      ];

      const results = await Promise.all(promises);

      // All should return the same instance
      results.forEach((result) => {
        expect(result).to.equal(results[0]);
      });

      // ADB.createADB should only be called once
      expect(ADB.createADB).to.have.been.calledOnce;
    });

    it('should throw error if ADB creation fails', async () => {
      const manager = ADBManager.getInstance();
      const error = new Error('ADB creation failed');

      (ADB.createADB as sinon.SinonStub).rejects(error);

      try {
        await manager.initialize({ adbExecTimeout: 60000 });
        expect.fail('Should have thrown an error');
      } catch (e) {
        expect((e as Error).message).to.include('ADB initialization failed');
      }
    });
  });

  describe('Instance Management', () => {
    it('should return null if not initialized', () => {
      const manager = ADBManager.getInstance();
      expect(manager.getADBInstance()).to.be.null;
    });

    it('should return ADB instance after initialization', async () => {
      const manager = ADBManager.getInstance();
      await manager.initialize({ adbExecTimeout: 60000 });

      const instance = manager.getADBInstance();
      expect(instance).to.equal(mockADB);
    });

    it('should check initialization status correctly', async () => {
      const manager = ADBManager.getInstance();

      expect(manager.isADBInitialized()).to.be.false;

      await manager.initialize({ adbExecTimeout: 60000 });

      expect(manager.isADBInitialized()).to.be.true;
    });
  });

  describe('Device-specific Operations', () => {
    it('should return ADB instance for device operations', async () => {
      const manager = ADBManager.getInstance();
      await manager.initialize({ adbExecTimeout: 60000 });

      const adb = await manager.getADBForDevice('test-device');
      expect(adb).to.equal(mockADB);
    });

    it('should initialize ADB if not already initialized for device operations', async () => {
      const manager = ADBManager.getInstance();

      const adb = await manager.getADBForDevice('test-device');
      expect(adb).to.equal(mockADB);
      expect(ADB.createADB).to.have.been.calledOnce;
    });
  });

  describe('Reset Functionality', () => {
    it('should reset ADB instance', async () => {
      const manager = ADBManager.getInstance();
      await manager.initialize({ adbExecTimeout: 60000 });

      expect(manager.isADBInitialized()).to.be.true;

      await manager.reset();

      expect(manager.isADBInitialized()).to.be.false;
      expect(manager.getADBInstance()).to.be.null;
    });

    it('should allow re-initialization after reset', async () => {
      const manager = ADBManager.getInstance();
      await manager.initialize({ adbExecTimeout: 60000 });
      await manager.reset();

      const adb = await manager.initialize({ adbExecTimeout: 80000 });
      expect(adb).to.equal(mockADB);
      expect(ADB.createADB).to.have.been.calledTwice;
    });
  });

  describe('Convenience Functions', () => {
    it('should provide getADBInstance convenience function', async () => {
      const manager = ADBManager.getInstance();
      await manager.initialize({ adbExecTimeout: 60000 });

      const adb = await manager.getADBForDevice();
      expect(adb).to.equal(mockADB);
    });

    it('should provide getExistingADBInstance convenience function', async () => {
      const manager = ADBManager.getInstance();

      // Should return null if not initialized
      expect(manager.getADBInstance()).to.be.null;

      await manager.initialize({ adbExecTimeout: 60000 });

      // Should return instance after initialization
      const adb = manager.getADBInstance();
      expect(adb).to.equal(mockADB);
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', async () => {
      const manager = ADBManager.getInstance();
      const error = new Error('Network error');

      (ADB.createADB as sinon.SinonStub).rejects(error);

      try {
        await manager.initialize({ adbExecTimeout: 60000 });
        expect.fail('Should have thrown an error');
      } catch (e) {
        expect((e as Error).message).to.include('ADB initialization failed');
        expect(manager.isADBInitialized()).to.be.false;
      }
    });

    it('should handle device operations when ADB is not initialized', async () => {
      const manager = ADBManager.getInstance();

      try {
        await manager.getADBForDevice('test-device');
        expect.fail('Should have thrown an error');
      } catch (e) {
        expect((e as Error).message).to.include('ADB instance not available');
      }
    });
  });
});
